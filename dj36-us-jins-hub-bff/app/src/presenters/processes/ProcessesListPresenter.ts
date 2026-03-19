import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IProcessesListPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import {
  getCallManagement,
  getCartInfo,
  searchReceptionInformation,
} from "~/src/clients/carts/cartsClient";
import {
  fixSystemDatetimeForFront,
  fixDatetimeForFront,
  fixDate,
  fixSystemDate,
  fixDatetimeForFrontFromDpfm,
} from "~/src/utils/fixDatetime";
import {
  CallingStatus,
  DeliveryStatus,
  VisitingPurpose,
  COUNTRY_CODE_ALPHA2,
} from "~/src/components/const";
import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { getStoreLocations } from "~/src/clients/locations/locationsClient";
import {
  LocationsGetResponse,
  StoreLocation,
  LocationsGetRequest,
} from "~/src/clients/locations/locationsClientTypes";
import {
  CallManagementGetResponse,
  CartGetResponse,
  CartGetRequest,
  CallManagementGetRequest,
  ReceptionInformation,
  ReceptionInformationSearchRequest,
  ReceptionInformationSearchResponse,
} from "~/src/clients/carts/cartsClientTypes";
import { components, operations } from "~/src/interfaces/root";
import {
  OrderByOrderCodeGetRequest,
  OrderByReceptionNumberGetRequest,
  GlassLineDeliveryListRequest,
  GlassLineDeliveryPartialDto,
  GlassLineDeliveryListResponse,
  OrderGetResponse,
  SearchGlassLinePartialDto,
  OrdersGlassLinesSearchResponse,
  OrdersGlassLinesSearchRequest,
} from "~/src/clients/salesOrder/salesOrderClientTypes";
import {
  getGlassLinesSearch,
  getOrderByOrderCode,
  getOrderByReceptionNumber,
  listGlassLineDelivery,
} from "~/src/clients/salesOrder/salesOrderClient";
import { calcReceptionsWithGuidanceDiffMinute, divideReception, filterWaitingReceptions } from "~/src/utils/receptionUtils";
import { ResourceNotFoundError } from "~/src/components/errors";
import { addMinutes, roundUpToNextMinute, subDays } from "~/src/utils/datetimeUtils";
import { getCountryTimeZone, getStoreTimeZone } from "~/src/utils/getTimeZone";
import { ApiResponse } from "openapi-typescript-fetch";

type RcptProcessListInfo = components["schemas"]["RcptProcessListInfo"];
type DeliveryProcessListInfo = {
  rcptProcessListInfo : RcptProcessListInfo,
  // ソート用
  sortInfo : {
    // レンズ発注対象フラグ
    needsPurchaseLens : boolean;
    // お渡しメガネ行更新日時(ms)
    deliveryUpdateTimestamp : number;
  }
}

/**
 * 工程情報一覧取得API
 */
@injectable()
export class ProcessesListPresenter
  implements IProcessesListPresenter
{
  /**
   * 工程情報一覧取得
   * @param req - Request
   * @param res - Response
   * @param next - NextFunction
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dpfmRequestInfo = generateDpfmRequestInfo(req);
      const path = req.params as operations["getProcessesList"]["parameters"]["path"];
      // 店舗情報取得
      const storeLocation = await this.getStoreLocation(
        dpfmRequestInfo,
        path.storeCode
      );
      if (storeLocation == undefined) {
        // 店舗情報が見つからないときはエラー送出
        throw new ResourceNotFoundError(`There is no recode matched ${path.storeCode}.`);
      }
      // 現在時刻
      const now = fixSystemDatetimeForFront();

      // 店舗コードから受付情報取得
      const receptions = await this.getReceptionInformationByStoreCode(
        dpfmRequestInfo,
        path.storeCode,
        fixSystemDate(getCountryTimeZone()),
      );

      // 受付情報を振り分ける
      const dividedReceptions = divideReception(receptions);

      const convertToEmptyPricesListInfo = async () : Promise<RcptProcessListInfo[]> => [];

      // 工程情報取得
      const processes = await Promise.all([
        this.convertToPrescriptionProcessListInfo(
          generateDpfmRequestInfo(dpfmRequestInfo.bffRequest, "1"),
          path.storeCode,
          dividedReceptions.eyeExam
        ),
        this.convertToAdjustmentProcessListInfo(
          generateDpfmRequestInfo(dpfmRequestInfo.bffRequest, "2"),
          dividedReceptions.adjustment
        ),
        this.convertToCartProcessListInfo(
          generateDpfmRequestInfo(dpfmRequestInfo.bffRequest, "3"),
          dividedReceptions.cart
        ),
        this.convertToPaymentProcessListInfo(
          generateDpfmRequestInfo(dpfmRequestInfo.bffRequest, "4"),
          dividedReceptions.payment
        ),
        convertToEmptyPricesListInfo(),
        // this.convertToProcessingProcessListInfo(
        //   generateDpfmRequestInfo(dpfmRequestInfo.bffRequest, "5"),
        //   path.storeCode
        // ),
        convertToEmptyPricesListInfo(),
        // this.convertToReadyForPickupProcessListInfo(
        //   generateDpfmRequestInfo(dpfmRequestInfo.bffRequest, "6"),
        //   path.storeCode
        // ),
      ]);

      const response: components["schemas"]["RcptProcessListGetResponse"] = {
        storeName: storeLocation.locationName,
        lastUpdatedTime: now ?? undefined,
        prescription: processes[0],
        adjustment: processes[1],
        cart: processes[2],
        payment: processes[3],
        processing: processes[4],
        readyForPickup: processes[5],
      };
      res.status(200).json(response);
      return;
    } catch (error) {
      next(error);
    }
  };

  /**
   * 工程情報（度数登録）取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptions 受付情報
   * @returns 工程情報[]
   */
  private async convertToPrescriptionProcessListInfo(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    receptions: ReceptionInformation[]
  ): Promise<RcptProcessListInfo[]> {
    // 受付情報を呼出状態で並べ替える。
    const sortedReceptions = [
      ...receptions.filter((reception) =>
        ![CallingStatus.NO_SHOW].includes(reception.callingStatusCode!)
      ),
      ...receptions.filter((reception) =>
        [CallingStatus.NO_SHOW].includes(reception.callingStatusCode!)
      ),
    ];
    // 呼出管理情報を取得
    const callManagementInfo = await this.getCallManagement(
      dpfmRequestInfo,
      storeCode
    );
    const waitingReceptions = filterWaitingReceptions(receptions);

    const now = new Date();
    const receptionsWithWaitTime = calcReceptionsWithGuidanceDiffMinute(
      callManagementInfo!,
      getStoreTimeZone(dpfmRequestInfo.bffRequest),
      waitingReceptions
    );
    const RcptProcessListInfo : RcptProcessListInfo[] = [];
    for (const reception of sortedReceptions) {
      let guidanceTime = undefined;
      let guidanceDiffMinutes = undefined
      const showCallingStatus = [CallingStatus.WAITING, CallingStatus.SOON_CALL];

      if (showCallingStatus.includes(reception.callingStatusCode!)) {
        guidanceDiffMinutes = receptionsWithWaitTime.find(
          (receptionWithWaitTime) =>
            receptionWithWaitTime.receptionNumber ===
            reception.receptionNumber
        )?.guidanceDiffMinutes;
        if (guidanceDiffMinutes != undefined) {
          const guidanceDateTime = addMinutes(now, guidanceDiffMinutes);
          guidanceTime = fixDatetimeForFront(
            roundUpToNextMinute(guidanceDateTime)
          );
        }
      }
      const process: RcptProcessListInfo = {
        receptionNumber: reception.receptionNumber,
        callingStatusCode: this.getCallingStatusCode(reception),
        callingNumber : reception.callingNumber,
        hasLensInCart: reception.hasLensInCart??false,
        hasFrameInCart: reception.hasFrameInCart??false,
        needsHelp: this.isNeedHelp(reception),
        itemGroupCode: undefined,
        customerName: reception.customerName,
        guidanceTime: guidanceTime ?? undefined,
        guidanceDiffMinutes: guidanceDiffMinutes,
        receptionTime: fixDatetimeForFrontFromDpfm(reception.registeredDatetime) ?? undefined,
        receptionStatusUpdatedTime: fixDatetimeForFrontFromDpfm(reception.updatedDatetime) ?? undefined,
      };
      RcptProcessListInfo.push(process);
    }
    return RcptProcessListInfo;
  }

  /**
   * 工程情報（調整）取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptions 受付情報
   * @returns 工程情報[]
   */
  private async convertToAdjustmentProcessListInfo(
    dpfmRequestInfo: DpfmRequestInfo,
    receptions: ReceptionInformation[]
  ): Promise<RcptProcessListInfo[]> {
    // 受付情報を呼出状態で並べ替える。
    const sortedReceptions = [
      ...receptions.filter((reception) =>
        ![CallingStatus.NO_SHOW].includes(reception.callingStatusCode!)
      ),
      ...receptions.filter((reception) =>
        [CallingStatus.NO_SHOW].includes(reception.callingStatusCode!)
      ),
    ];
    return sortedReceptions.map((reception) => {
      const process: RcptProcessListInfo = {
        receptionNumber: reception.receptionNumber,
        callingStatusCode: this.getCallingStatusCode(reception),
        callingNumber : reception.callingNumber,
        hasLensInCart: false,
        hasFrameInCart: false,
        needsHelp: this.isNeedHelp(reception),
        itemGroupCode: undefined,
        customerName: reception.customerName,
        guidanceTime: undefined,
        guidanceDiffMinutes: undefined,
        receptionTime: fixDatetimeForFrontFromDpfm(reception.registeredDatetime) ?? undefined,
        receptionStatusUpdatedTime: fixDatetimeForFrontFromDpfm(reception.updatedDatetime) ?? undefined,
      };
      return process;
    });
  }

  /**
   * 工程情報（カート）取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptions 受付情報
   * @returns 工程情報[]
   */
  private async convertToCartProcessListInfo(
    dpfmRequestInfo: DpfmRequestInfo,
    receptions: ReceptionInformation[]
  ): Promise<RcptProcessListInfo[]> {
    // 受付情報を更新日時の昇順に並べ替える
    const sortedReceptions = receptions.sort((a, b) =>
      a.updatedDatetime!.localeCompare(b.updatedDatetime!)
    );
    const rcptProcessListInfo : RcptProcessListInfo[] = [];
    for (const reception of sortedReceptions) {
      const process: RcptProcessListInfo = {
        receptionNumber: reception.receptionNumber,
        callingStatusCode: this.getCallingStatusCode(reception),
        callingNumber: reception.callingNumber,
        hasLensInCart: reception.hasLensInCart??false,
        hasFrameInCart: reception.hasFrameInCart??false,
        needsHelp: this.isNeedHelp(reception),
        itemGroupCode: undefined,
        customerName: reception.customerName,
        guidanceTime: undefined,
        guidanceDiffMinutes: undefined,
        receptionTime: fixDatetimeForFrontFromDpfm(reception.registeredDatetime) ?? undefined,
        receptionStatusUpdatedTime: fixDatetimeForFrontFromDpfm(reception.updatedDatetime) ?? undefined,
      };
      rcptProcessListInfo.push(process);
    }
    return rcptProcessListInfo;
  }

  /**
   * 工程情報（会計待ち）取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptions 受付情報
   * @returns 工程情報[]
   */
  private async convertToPaymentProcessListInfo(
    dpfmRequestInfo: DpfmRequestInfo,
    receptions: ReceptionInformation[]
  ): Promise<RcptProcessListInfo[]> {
    // 受付情報を更新日時の昇順に並べ替える
    const sortedReceptions = receptions.sort((a, b) =>
      a.updatedDatetime!.localeCompare(b.updatedDatetime!)
    );

    const rcptProcessListInfo: RcptProcessListInfo[] = [];
    for (const reception of sortedReceptions) {
      const process: RcptProcessListInfo = {
        receptionNumber: reception.receptionNumber,
        callingStatusCode: this.getCallingStatusCode(reception),
        callingNumber: reception.callingNumber,
        hasLensInCart: reception.hasLensInCart??false,
        hasFrameInCart: reception.hasFrameInCart??false,
        needsHelp: this.isNeedHelp(reception),
        itemGroupCode: undefined,
        customerName: reception.customerName,
        guidanceTime: undefined,
        guidanceDiffMinutes: undefined,
        receptionTime: fixDatetimeForFrontFromDpfm(reception.registeredDatetime) ?? undefined,
        receptionStatusUpdatedTime: fixDatetimeForFrontFromDpfm(reception.updatedDatetime) ?? undefined,
      };
      rcptProcessListInfo.push(process);
    }
    return rcptProcessListInfo;
  }

  /**
   * 工程情報（加工中）取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @returns 工程情報[]
   */
  private async convertToProcessingProcessListInfo(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string
  ): Promise<RcptProcessListInfo[]> {

    const deliveryProcesses = await this.getDeliveryProcessList (
      dpfmRequestInfo,
      storeCode,
      DeliveryStatus.DELIVERY_PREPARING
    )
    return deliveryProcesses.sort((a, b) => {
      if (a.sortInfo.needsPurchaseLens !== b.sortInfo.needsPurchaseLens) {
        return a.sortInfo.needsPurchaseLens ? 1 : -1;
      }
      return (
        a.sortInfo.deliveryUpdateTimestamp -
        b.sortInfo.deliveryUpdateTimestamp
      );
    }).map((delivery) => delivery.rcptProcessListInfo);
    // const glassLineDeliveries = await this.getGlassLineDelivery(
    //   dpfmRequestInfo,
    //   storeCode,
    //   DeliveryStatus.DELIVERY_PREPARING
    // );
    // const rcptProcessListInfo: RcptProcessListInfo[] = [];
    // for (const glassLineDelivery of glassLineDeliveries) {
    //   rcptProcessListInfo.push(
    //     await this.convertToProcessFromGlassLineDelivery(
    //       dpfmRequestInfo,
    //       glassLineDelivery
    //     )
    //   );
    // }
    // return rcptProcessListInfo;
  }

  /**
   * 工程情報（お渡し準備完了）取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @returns 工程情報[]
   */
  private async convertToReadyForPickupProcessListInfo(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string
  ): Promise<RcptProcessListInfo[]> {
    const deliveryProcesses = await this.getDeliveryProcessList (
      dpfmRequestInfo,
      storeCode,
      DeliveryStatus.READY_FOR_DELIVERY
    )
    return deliveryProcesses.sort((a, b) => {
      return (
        a.sortInfo.deliveryUpdateTimestamp -
        b.sortInfo.deliveryUpdateTimestamp
      );
    }).map((delivery) => delivery.rcptProcessListInfo);
    // const glassLineDeliveries = await this.getGlassLineDelivery(
    //   dpfmRequestInfo,
    //   storeCode,
    //   DeliveryStatus.READY_FOR_DELIVERY
    // );
    // const rcptProcessListInfo: RcptProcessListInfo[] = [];
    // for (const glassLineDelivery of glassLineDeliveries) {
    //   rcptProcessListInfo.push(
    //     await this.convertToProcessFromGlassLineDelivery(
    //       dpfmRequestInfo,
    //       glassLineDelivery
    //     )
    //   );
    // }
    // return rcptProcessListInfo;
  }

  /**
   * お渡しメガネ行から工程情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param glassLineDelivery お渡しメガネ行
   * @returns 工程情報
   */
  private async convertToProcessFromGlassLineDelivery(
    dpfmRequestInfo: DpfmRequestInfo,
    glassLineDelivery: GlassLineDeliveryPartialDto
  ) {
    // 注文コードから注文情報を取得
    const order = await this.getOrderInformationByOrderCode(
      dpfmRequestInfo,
      glassLineDelivery.orderCode!
    );
    // 注文メガネ行は、glassLineCodeが一致しているもの
    const glassLine = order.glassLines
      ?.filter(
        (glassLine) =>
          glassLine.glassLineCode === glassLineDelivery.glassLineCode
      )
      .at(0);
    // 受付番号から受付情報を取得
    // const reception = await this.getReceptionInformationByReceptionNumber(
    //   dpfmRequestInfo,
    //   order.receptionNumber!
    // );

    const process: RcptProcessListInfo = {
      receptionNumber: order.receptionNumber,
      callingStatusCode: CallingStatus.NONE,
      callingNumber : glassLine?.callingNumber,
      hasLensInCart:
        glassLine?.lensLeftItemCode != undefined ||
        glassLine?.lensRightItemCode != undefined,
      hasFrameInCart: glassLine?.frameItemCode != undefined,
      needsHelp: false,
      itemGroupCode: glassLine?.glassLineCode,
      customerName: glassLineDelivery.customerName ?? undefined ,
      guidanceTime: undefined,
      guidanceDiffMinutes: undefined,
  };
    return process;
  }

  /**
   * お渡しメガネ行の工程情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @param deliveryStatus お渡しステータスコード
   * @returns 工程情報（お渡しメガネ行）
   */
  private async getDeliveryProcessList(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    deliveryStatus: string,
  ) {
    const processes : DeliveryProcessListInfo[] = [];

    // 対象となる注文を検索
    const glassLinesSearch = await this.getGlassLinesSearch(dpfmRequestInfo, storeCode, deliveryStatus);

    for (const targetGlassLine of glassLinesSearch) {
      // 注文コードから注文情報を取得
      const order = await this.getOrderInformationByOrderCode(
        dpfmRequestInfo,
        targetGlassLine.orderCode
      );
      // 注文メガネ行は、glassLineCodeが一致しているもの
      const _glassLines = order.glassLines
        ?.filter(
          (glassLine) =>
            glassLine.glassLineCode === targetGlassLine.glassLineCode
          ).forEach((glassLine) => {
          const process: RcptProcessListInfo = {
            receptionNumber: order.receptionNumber,
            callingStatusCode: CallingStatus.NONE,
            callingNumber: glassLine?.callingNumber,
            hasLensInCart:
              glassLine?.lensLeftItemCode != undefined ||
              glassLine?.lensRightItemCode != undefined,
            hasFrameInCart: glassLine?.frameItemCode != undefined,
            needsHelp: false,
            itemGroupCode: glassLine?.glassLineCode,
            customerName: targetGlassLine.customerName ?? undefined,
            guidanceTime: undefined,
            guidanceDiffMinutes: undefined,
          };
          const deliveryProcessListInfo :DeliveryProcessListInfo = {
            rcptProcessListInfo: process,
            sortInfo: {
              needsPurchaseLens: glassLine.needsPurchaseLens??false,
              deliveryUpdateTimestamp: glassLine.delivery?.updateTimestamp??0,
            }
          }
          processes.push(deliveryProcessListInfo);
        });
    }
    return processes;
  }

  /**
   * 来店目的をGeneral Helpで登録したかどうか取得
   * @param reception 受付情報
   * @returns 来店目的をGeneral Helpで登録したかどうか
   */
  private isNeedHelp(reception?: ReceptionInformation) {
    return VisitingPurpose.GENERAL_HELP===reception?.visitingPurposeCode;
  }

  /**
   * 呼出ステータスコード取得
   * @param reception 受付情報
   * @returns 呼出ステータスコード(Front返却用)
   */
  private getCallingStatusCode(reception: ReceptionInformation) {
    const waitingCallingStatusCode: (string|undefined)[] = [
      CallingStatus.WAITING,
      CallingStatus.SOON_CALL
    ];
    return waitingCallingStatusCode.includes(reception?.callingStatusCode)
      ? CallingStatus.WAITING
      : reception?.callingStatusCode;
  };

  /**
   * 店舗情報取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @returns 店舗情報
   */
  private async getStoreLocation(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string
  ) {
    // (location)ロケーションマスタ検索API呼び出し
    const locationGetRequest: LocationsGetRequest = {
      locationCodeList: [storeCode]
    };
    logger.info(`getStoreLocationsRequest: ${JSON.stringify(locationGetRequest)}`);

    const apiResponse :ApiResponse<LocationsGetResponse> = await sendApiRequest(
      getStoreLocations,
      locationGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`getStoreLocationsResponse: ${JSON.stringify(apiResponse)}`);

    const locationsGetResponse = apiResponse.data;
    const storeLocation: StoreLocation | undefined =
      locationsGetResponse.records?.at(0);
    return storeLocation;
  }

  /**
   * 呼出管理情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @returns 呼出管理情報
   */
  private async getCallManagement(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string
  ) {
    // 呼出管理情報取得API呼び出し
    const callManagementGetRequest: CallManagementGetRequest = {
      storeCode: storeCode,
    };

    logger.info(`getCallManagementRequest: ${JSON.stringify(callManagementGetRequest)}`);

    const apiResponse : ApiResponse<CallManagementGetResponse> = await sendApiRequest(
      getCallManagement,
      callManagementGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`getCallManagementResponse: ${JSON.stringify(apiResponse)}`);

    const callManagementGetResponse = apiResponse.data;
    return callManagementGetResponse.callManagementInfo;
  }

  /**
   * 店舗コードから受付情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @param registeredDate 受付日（受付情報の登録日）
   * @returns 受付情報[]
   */
  private async getReceptionInformationByStoreCode(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    registeredDate: string
  ) {
    // (cart)受付情報検索API呼び出し
    const searchReceptionInformationRequest: ReceptionInformationSearchRequest = {
      storeCode: storeCode,
      registeredDate: registeredDate,
    };
   logger.info(`searchReceptionInformationRequest: ${JSON.stringify(searchReceptionInformationRequest)}`);

    const apiResponse : ApiResponse<ReceptionInformationSearchResponse> = await sendApiRequest(
      searchReceptionInformation,
      searchReceptionInformationRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`searchReceptionInformationResponse: ${JSON.stringify(apiResponse)}`);

    const searchReceptionInformationResponse = apiResponse.data;
    return searchReceptionInformationResponse.ReceptionInfoAllItems!;
  }

  /**
   * 受付番号から受付情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @returns 受付情報 | undefined
   */
  private async getReceptionInformationByReceptionNumber(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string
  ) {
    // 受付情報検索API呼び出し
    const searchReceptionInformationRequest: ReceptionInformationSearchRequest = {
      receptionNumber: receptionNumber,
    };
    logger.info(`searchReceptionInformationRequest: ${JSON.stringify(searchReceptionInformationRequest)}`);

    const apiResponse : ApiResponse<ReceptionInformationSearchResponse> = await sendApiRequest(
      searchReceptionInformation,
      searchReceptionInformationRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`searchReceptionInformationResponse: ${JSON.stringify(apiResponse)}`);

    const searchReceptionInformationResponse = apiResponse.data;
    return searchReceptionInformationResponse.ReceptionInfoAllItems?.at(0);
  }

  /**
   * カート情報取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @returns カート情報
   */
  private async getCart(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string
  ) {
    // (cart)カート・カタログ取得API
    const cartInfoGetRequest: CartGetRequest = {
      receptionNumber: receptionNumber,
      deleteFlag: false,
    };
    logger.info(`getCartInfoRequest: ${JSON.stringify(cartInfoGetRequest)}`);

    const apiResponse : ApiResponse<CartGetResponse> = await sendApiRequest(
      getCartInfo,
      cartInfoGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`getCartInfoResponse: ${JSON.stringify(apiResponse)}`);

    const cartResponse = apiResponse.data;
    return cartResponse.cart;
  }

  /**
   * 受付番号から注文情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @returns 注文情報 | undefined
   */
  private async getOrderInformationByReceptionNumber(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string
  ) {
    // (SalesOrder)注文詳細取得API呼び出し
    const getOrderByReceptionNumberRequest: OrderByReceptionNumberGetRequest = {
      receptionNumber: receptionNumber,
    };
    logger.info(`getOrderByReceptionNumberRequest: ${JSON.stringify(getOrderByReceptionNumberRequest)}`);

    const apiResponse : ApiResponse<OrderGetResponse> = await sendApiRequest(
      getOrderByReceptionNumber,
      getOrderByReceptionNumberRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`getOrderByReceptionNumberResponse: ${JSON.stringify(apiResponse)}`);

    const orderInformation = apiResponse.data;
    return orderInformation;
  }

  /**
   * 管理用注文検索
   * @param dpfmRequestInfo
   * @param storeCode
   * @param deliveryStatus
   */
  private async getGlassLinesSearch(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    deliveryStatus: string
  ): Promise<SearchGlassLinePartialDto[]> {
    let nodes: SearchGlassLinePartialDto[] = [];
    const now = new Date();
    const timeZone = getStoreTimeZone(dpfmRequestInfo.bffRequest);
    let page = 0;
    do {
      // (SalesOrder)管理用注文検索API呼出
      const searchOrdersGlassLinesRequest: OrdersGlassLinesSearchRequest = {
        count: "100", // page_sizeを指定するため無視される
        page: (++page).toString(),
        page_size: process.env.PAGE_SIZE,
        "q.receptionStoreCode": storeCode,
        "q.countryCodeAlpha2": COUNTRY_CODE_ALPHA2,
        "q.orderDateFrom": fixDate(subDays(now, 30), timeZone)!, // 30日前
        "q.orderDateTo": fixDate(now, timeZone)!, // 本日
        "q.deliveryStatus": deliveryStatus,
      };
      logger.info(`getGlassLinesSearchRequest: ${JSON.stringify(searchOrdersGlassLinesRequest)}`);

      const apiResponse : ApiResponse<OrdersGlassLinesSearchResponse> =await sendApiRequest(
        getGlassLinesSearch,
        searchOrdersGlassLinesRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );

      logger.info(`getGlassLinesSearchRequest: ${JSON.stringify(apiResponse)}`);

      const searchOrdersGlassLinesResponse = apiResponse.data;
      if (searchOrdersGlassLinesResponse != undefined) {
        nodes = nodes.concat(searchOrdersGlassLinesResponse?.nodes);
      }
      if(searchOrdersGlassLinesResponse.pageInfo.hasNext !== true) {
        break;
      }
    } while(true);
    return nodes;
  }

  /**
   * お渡しメガネ行取得
   * @param dpfmRequestInfo
   * @param storeCode
   * @param deliveryStatus
   * @returns お渡しメガネ行[]
   */
  private async getGlassLineDelivery(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    deliveryStatus: string
  ): Promise<GlassLineDeliveryPartialDto[]> {
    // (SalesOrder)お渡しメガネ行の一覧API呼出
    const listGlassLineDeliveryRequest: GlassLineDeliveryListRequest = {
      filter: `delivery_store_code = '${storeCode}' AND delivery_status = '${deliveryStatus}'`,
      sort: "update_timestamp",
      order: "asc",
    };
    logger.info(`listGlassLineDeliveryRequest: ${JSON.stringify(listGlassLineDeliveryRequest)}`);

    const apiResponse : ApiResponse<GlassLineDeliveryListResponse> = await sendApiRequest(
      listGlassLineDelivery,
      listGlassLineDeliveryRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`listGlassLineDeliveryResponse: ${JSON.stringify(apiResponse)}`);

    const listGlassLineDeliveryResponse = apiResponse.data;
    const nodes: GlassLineDeliveryPartialDto[] =
      listGlassLineDeliveryResponse.nodes;
    return nodes;
  }

  /**
   * 注文コードから注文情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param orderCode 注文コード
   * @returns 注文情報 | undefined
   */
  private async getOrderInformationByOrderCode(
    dpfmRequestInfo: DpfmRequestInfo,
    orderCode: string
  ) {
    // (SalesOrder)注文詳細取得API呼び出し
    const getOrderByOrderCodeRequest: OrderByOrderCodeGetRequest = {
      orderCode: orderCode,
    };
    logger.info(`getOrderByOrderCodeRequest: ${JSON.stringify(getOrderByOrderCodeRequest)}`);

    const apiResponse : ApiResponse<OrderGetResponse> = await sendApiRequest(
      getOrderByOrderCode,
      getOrderByOrderCodeRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`getOrderByOrderCodeResponse: ${JSON.stringify(apiResponse)}`);

    const orderInformation = apiResponse.data;
    return orderInformation;
  }
}
