import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

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
} from "~/src/utils/fixDatetime";
import {
  CallingStatus,
  DeliveryStatus,
  LineType,
  VisitingPurpose,
  ReceptionStatus,
  COUNTRY_CODE_ALPHA2,
} from "~/src/compornents/const";
import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { getStoreLocations } from "~/src/clients/locations/locationsClient";
import {
  LocationsGetResponse,
  StoreLocation,
  GetLocationsQuery,
} from "~/src/clients/locations/locationsClientTypes";
import {
  CallManagementGetResponse,
  CartResponse,
  findCartQuery,
  GetCallManagementPath,
  ReceptionInformation,
  SearchReceptionInformationQuery,
  SearchReceptionInformationResponse,
} from "~/src/clients/carts/cartsClientTypes";
import { components } from "~/src/interfaces/root";
import {
  GetOrderByOrderCodePath,
  GetOrderByReceptionNumberPath,
  GlassLineDeliveryListQueryDto,
  GlassLineDeliveryPartialDto,
  GlassLineDeliveryQueryResultDto,
  OrderDetailReadDto,
  SearchGlassLinePartialDto,
  SearchGlassLineReadDto,
  SearchOrdersGlassLinesQuery,
} from "~/src/clients/salesOrder/salesOrderClientTypes";
import {
  getGlassLinesSearch,
  getOrderByOrderCode,
  getOrderByReceptionNumber,
  listGlassLineDelivery,
} from "~/src/clients/salesOrder/salesOrderClient";
import { calcReceptionsWithGuidanceDiffMinute, getLineType } from "~/src/utils/calculateWaitingTime";
import { ErrorResponse } from "~/src/compornents/errors";
import { makeErrorResponse404 } from "~/src/utils/makeErrorResponse400";
import { addMinutes, roundUpToNextMinute, subDays } from "~/src/utils/datetimeUtils";
import { getCountryTimeZone, getStoreTimeZone } from "~/src/utils/getTimeZone";

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
  extends BasePresenter
  implements IProcessesListPresenter
{
  /**
   * 工程情報一覧取得
   * @param req - Request
   * @param res - Response
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dpfmRequestInfo = generateDpfmRequestInfo(req);

      // 店舗情報取得
      const storeLocation = await this.getStoreLocation(
        dpfmRequestInfo,
        req.params.storeCode
      );
      if (storeLocation == undefined) {
        // 店舗情報が見つからないときは404を返却
        const error: ErrorResponse = makeErrorResponse404(
          `There is no recode matched ${req.params.storeCode}.`,
          req
        );
        res.status(404).json(error);
        return;
      }
      // 現在時刻
      const now = fixSystemDatetimeForFront();

      // 店舗コードから受付情報取得
      const receptions = await this.getReceptionInformationByStoreCode(
        dpfmRequestInfo,
        req.params.storeCode,
        fixSystemDate(getCountryTimeZone()),
      );

      // 受付情報を振り分ける
      const dividedReceptions = this.divideReception(receptions);

      // 工程情報取得
      const processes = await Promise.all([
        this.convertToPrescriptionProcessListInfo(
          generateDpfmRequestInfo(dpfmRequestInfo.bffRequest, "1"),
          req.params.storeCode,
          dividedReceptions[0]
        ),
        this.convertToAdjustmentProcessListInfo(
          generateDpfmRequestInfo(dpfmRequestInfo.bffRequest, "2"),
          dividedReceptions[1]
        ),
        this.convertToCartProcessListInfo(
          generateDpfmRequestInfo(dpfmRequestInfo.bffRequest, "3"),
          dividedReceptions[2]
        ),
        this.convertToPaymentProcessListInfo(
          generateDpfmRequestInfo(dpfmRequestInfo.bffRequest, "4"),
          dividedReceptions[3]
        ),
        this.convertToProcessingProcessListInfo(
          generateDpfmRequestInfo(dpfmRequestInfo.bffRequest, "5"),
          req.params.storeCode
        ),
        this.convertToReadyForPickupProcessListInfo(
          generateDpfmRequestInfo(dpfmRequestInfo.bffRequest, "6"),
          req.params.storeCode
        ),
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
    } catch (error: any) {
      res.status(error.status).json(error);
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };

  /**
   * 受付情報を受付ステータス別に分割する
   * @param receptions 受付情報[]
   * @returns 受付情報[][] (0:Prescription/1:Adjustment/2:Cart/3:Payment)
   */
  private divideReception(receptions: ReceptionInformation[]) {
    // 対象の処理状態だけを抽出
    const targetReceptions = receptions.filter((reception) =>
      [
        CallingStatus.NONE,
        CallingStatus.WATING,
        CallingStatus.CALLING,
        CallingStatus.IN_SERVICE,
        CallingStatus.NO_SHOW,
        CallingStatus.GOING_OUT,
      ].includes(reception.callingStatusCode!)
    );
    // Prescription
    const prescriptionReceptions = targetReceptions.filter(
      (reception) =>
        [LineType.MAIN_MEASUREMENT].includes(getLineType(reception)) &&
        [ReceptionStatus.REGISTERED].includes(reception.statusCode!)
    );
    // Ajustment
    const ajustmentReceptions = targetReceptions.filter((reception) =>
      [LineType.REPAIR, LineType.HELP].includes(getLineType(reception))
    );
    // Cart
    const cartReceptions = targetReceptions.filter(
      (reception) =>
        [LineType.MAIN_MEASUREMENT].includes(getLineType(reception)) &&
        [ReceptionStatus.ORDER_NEW].includes(reception.statusCode!)
    );
    // Payment
    const paymentReceptions = targetReceptions.filter(
      (reception) =>
        [LineType.PACKAGE].includes(getLineType(reception)) ||
        [ReceptionStatus.PAYMENT].includes(reception.statusCode!)
    );

    return [
      prescriptionReceptions,
      ajustmentReceptions,
      cartReceptions,
      paymentReceptions,
    ];
  }

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
    const now = new Date();
    const receptionsWithWaitTime = calcReceptionsWithGuidanceDiffMinute(
      callManagementInfo!,
      sortedReceptions
    );
    const RcptProcessListInfo : RcptProcessListInfo[] = [];
    for (const receptionWithWaitTime of receptionsWithWaitTime) {
      let guidanceTime = undefined;
      const showCallingStatus = [CallingStatus.WATING];

      if (
        showCallingStatus.includes(
          receptionWithWaitTime.reception.callingStatusCode!
        ) &&
        receptionWithWaitTime.guidanceDiffMinutes != undefined
      ) {
        const guidanceDateTime = addMinutes(now, receptionWithWaitTime.guidanceDiffMinutes);
        guidanceTime = fixDatetimeForFront(
          roundUpToNextMinute(guidanceDateTime)
        );
      }
      const reception: ReceptionInformation = receptionWithWaitTime.reception;
      const process: RcptProcessListInfo = {
        receptionNumber: reception.receptionNumber,
        callingStatusCode: reception.callingStatusCode,
        callingNumber : reception.callingNumber,
        hasLensInCart: reception.hasLensInCart??false,
        hasFrameInCart: reception.hasFrameInCart??false,
        // hasLensInCart: false,
        // hasFrameInCart: false,
        // hasFrameInCart: cart?.itemGroups?.some(
        //   (itemGroup) => itemGroup.frameItemCode != undefined
        // ) ?? false,
        needsHelp: this.isNeedHelp(reception),
        itemGroupCode: undefined,
        // itemGroupCode: cart?.itemGroups?.at(0)?.itemGroupCode,
        customerName: reception.customerName,
        guidanceTime: guidanceTime ?? undefined,
        guidanceDiffMinutes: receptionWithWaitTime.guidanceDiffMinutes,
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
        callingStatusCode: reception.callingStatusCode,
        callingNumber : reception.callingNumber,
        hasLensInCart: false,
        hasFrameInCart: false,
        needsHelp: this.isNeedHelp(reception),
        itemGroupCode: undefined,
        customerName: reception.customerName,
        guidanceTime: undefined,
        guidanceDiffMinutes: undefined,
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
      // const cart = await this.getCart(
      //   dpfmRequestInfo,
      //   reception.receptionNumber!
      // );
      const process: RcptProcessListInfo = {
        receptionNumber: reception.receptionNumber,
        callingStatusCode: reception.callingStatusCode,
        callingNumber: reception.callingNumber,
        hasLensInCart: reception.hasLensInCart??false,
        hasFrameInCart: reception.hasFrameInCart??false,
        // hasLensInCart: false,
        // hasFrameInCart: false,
        // hasFrameInCart: cart?.itemGroups?.some(
        //   (itemGroup) => itemGroup.frameItemCode != undefined
        // ) ?? false,
        needsHelp: this.isNeedHelp(reception),
        itemGroupCode: undefined,
        // itemGroupCode: cart?.itemGroups?.at(0)?.itemGroupCode,
        customerName: reception.customerName,
        guidanceTime: undefined,
        guidanceDiffMinutes: undefined,
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
      let order : OrderDetailReadDto | undefined = undefined;
      // if( ![LineType.PACKAGE].includes(getLineType(reception)) ) {
      //   order = await this.getOrderInformationByReceptionNumber(
      //     dpfmRequestInfo,
      //     reception.receptionNumber!
      //   );
      // }
      const process: RcptProcessListInfo = {
        receptionNumber: reception.receptionNumber,
        callingStatusCode: reception.callingStatusCode,
        callingNumber: reception.callingNumber,
        hasLensInCart: reception.hasLensInCart??false,
        hasFrameInCart: reception.hasFrameInCart??false,
        // hasLensInCart: false,
        // hasFrameInCart: false,
        // hasLensInCart: order?.glassLines?.some(
        //   (glassLine) =>
        //     glassLine.lensLeftItemCode != undefined ||
        //     glassLine.lensRightItemCode != undefined
        // ) ?? false,
        // hasFrameInCart: order?.glassLines?.some(
        //   (glassLine) => glassLine.frameItemCode != undefined
        // ) ?? false,
        needsHelp: this.isNeedHelp(reception),
        itemGroupCode: undefined,
        // itemGroupCode: order?.glassLines?.at(0)?.itemGroupCode,
        customerName: reception.customerName,
        guidanceTime: undefined,
        guidanceDiffMinutes: undefined,
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
    // for (const glassLineDeliverty of glassLineDeliveries) {
    //   rcptProcessListInfo.push(
    //     await this.convertToProcessFromGlassLineDelivery(
    //       dpfmRequestInfo,
    //       glassLineDeliverty
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
    // for (const glassLineDeliverty of glassLineDeliveries) {
    //   rcptProcessListInfo.push(
    //     await this.convertToProcessFromGlassLineDelivery(
    //       dpfmRequestInfo,
    //       glassLineDeliverty
    //     )
    //   );
    // }
    // return rcptProcessListInfo;
  }

  /**
   * お渡しメガネ行から工程情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param glassLineDeliverty お渡しメガネ行
   * @returns 工程情報
   */
  private async convertToProcessFromGlassLineDelivery(
    dpfmRequestInfo: DpfmRequestInfo,
    glassLineDeliverty: GlassLineDeliveryPartialDto
  ) {
    // 注文コードから注文情報を取得
    const order = await this.getOrderInformationByOrderCode(
      dpfmRequestInfo,
      glassLineDeliverty.orderCode!
    );
    // 注文メガネ行は、glassLineCodeが一致しているもの
    const glassLine = order.glassLines
      ?.filter(
        (glassLine) =>
          glassLine.glassLineCode === glassLineDeliverty.glassLineCode
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
      customerName: glassLineDeliverty.customerName ?? undefined ,
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
    const prosesses : DeliveryProcessListInfo[] = [];

    // 対象となる注文を検索
    const glassLinesSearch = await this.getGlassLinesSearch(dpfmRequestInfo, storeCode, deliveryStatus);

    for (const targetGlassLine of glassLinesSearch) {
      // 注文コードから注文情報を取得
      const order = await this.getOrderInformationByOrderCode(
        dpfmRequestInfo,
        targetGlassLine.orderCode
      );
      // 注文メガネ行は、glassLineCodeが一致しているもの
      const glassLines = order.glassLines
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
          prosesses.push(deliveryProcessListInfo);
        });
    }
    return prosesses;
  }

  /**
   * 来店目的をGeneral Helpで登録したかどうか取得
   * @param reception 受付情報
   * @returns 来店目的をGeneral Helpで登録したかどうか
   */
  private isNeedHelp(reception?: ReceptionInformation) {
    // return [LineType.PACKAGE].includes(getLineType(reception));
    return VisitingPurpose.GENERAL_HELP===reception?.visitingPurposeCode;
  }

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
    const locationGetRequest: GetLocationsQuery = {
      locationCodeList: [storeCode]
    };
    logger.info(`locationGetRequest: ${JSON.stringify(locationGetRequest)}`);
    const apiResponse = await sendApiRequest(
      getStoreLocations,
      locationGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`locationGetResponse: ${JSON.stringify(apiResponse)}`);

    if (!apiResponse.ok) {
      throw apiResponse;
    }
    const locationsGetResponse: LocationsGetResponse = apiResponse.data;
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
    const getCallManagementPath: GetCallManagementPath = {
      storeCode: storeCode,
    };

    const callManagementGetRequest = {
      ...getCallManagementPath,
    };
    logger.info(
      `callManagementGetRequest: ${JSON.stringify(callManagementGetRequest)}`
    );
    const apiResponse = await sendApiRequest(
      getCallManagement,
      callManagementGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`callManagementGetResponse: ${JSON.stringify(apiResponse)}`);
    if (!apiResponse.ok) {
      throw apiResponse;
    }
    const callManagementGetResponse: CallManagementGetResponse =
      apiResponse.data;
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
    const searchReceptionInformationQuery: SearchReceptionInformationQuery = {
      storeCode: storeCode,
      registeredDate: registeredDate,
    };

    const searchReceptionInformationRequest = {
      ...searchReceptionInformationQuery,
    };
    logger.info(
      `searchReceptionInformationRequest: ${JSON.stringify(searchReceptionInformationRequest)}`
    );
    const apiResponse = await sendApiRequest(
      searchReceptionInformation,
      searchReceptionInformationRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(
      `SearchReceptionInformationResponse: ${JSON.stringify(apiResponse)}`
    );
    if (!apiResponse.ok) {
      throw apiResponse;
    }
    const searchReceptionInformationResponse: SearchReceptionInformationResponse =
      apiResponse.data;
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
    const searchReceptionInformationQuery: SearchReceptionInformationQuery = {
      receptionNumber: receptionNumber,
    };

    const searchReceptionInformationRequest = {
      ...searchReceptionInformationQuery,
    };
    logger.info(
      `searchReceptionInformationRequest: ${JSON.stringify(searchReceptionInformationRequest)}`
    );
    const apiResponse = await sendApiRequest(
      searchReceptionInformation,
      searchReceptionInformationRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(
      `SearchReceptionInformationResponse: ${JSON.stringify(apiResponse)}`
    );
    if (!apiResponse.ok) {
      throw apiResponse;
    }
    const searchReceptionInformationResponse: SearchReceptionInformationResponse =
      apiResponse.data;
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
    const cartInfoGetRequest: findCartQuery = {
      receptionNumber: receptionNumber,
      deleteFlag: false,
    };
    logger.info(`cartInfoGetRequest: ${JSON.stringify(cartInfoGetRequest)}`);
    const apiResponse = await sendApiRequest(
      getCartInfo,
      cartInfoGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`cartInfoGetResponse: ${JSON.stringify(apiResponse)}`);

    if (!apiResponse.ok) {
      throw apiResponse;
    }
    const cartResponse: CartResponse = apiResponse.data;
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
    const getOrderByReceptionNumberPath: GetOrderByReceptionNumberPath = {
      receptionNumber: receptionNumber,
    };
    const getOrderByReceptionNumberRequst = {
      ...getOrderByReceptionNumberPath,
    };

    logger.info(
      `getOrderByReceptionNumberRequst: ${JSON.stringify(getOrderByReceptionNumberRequst)}`
    );
    const apiResponse = await sendApiRequest(
      getOrderByReceptionNumber,
      getOrderByReceptionNumberRequst,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(
      `getOrderByReceptionNumberResponse: ${JSON.stringify(apiResponse)}`
    );
    if (!apiResponse.ok) {
      throw apiResponse;
    }
    const orderInformation: OrderDetailReadDto = apiResponse.data;
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
      const searchOrdersGlassLinesQuery: SearchOrdersGlassLinesQuery = {
        count: "100", // page_sizeを指定するため無視される
        page: (++page).toString(),
        page_size: process.env.PAGE_SIZE,
        "q.receptionStoreCode": storeCode,
        "q.countryCodeAlpha2": COUNTRY_CODE_ALPHA2,
        "q.orderDateFrom": fixDate(subDays(now, 30), timeZone)!, // 30日前
        "q.orderDateTo": fixDate(now, timeZone)!, // 本日
        "q.deliveryStatus": deliveryStatus,
      };
      const searchOrdersGlassLinesRequest = {
        ...searchOrdersGlassLinesQuery,
      };
      logger.info(
        `searchOrdersGlassLinesRequest: ${JSON.stringify(searchOrdersGlassLinesRequest)}`
      );
      const apiResponse = await sendApiRequest(
        getGlassLinesSearch,
        searchOrdersGlassLinesRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );

      logger.info(
        `searchOrdersGlassLinesResponse: ${JSON.stringify(apiResponse)}`
      );

      if (!apiResponse.ok) {
        throw apiResponse;
      }

      const searchOrdersGlassLinesResponse: SearchGlassLineReadDto = apiResponse.data;
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
    const glassLineDeliveryListQuery: GlassLineDeliveryListQueryDto = {
      filter: `delivery_store_code = '${storeCode}' AND delivery_status = '${deliveryStatus}'`,
      sort: "update_timestamp",
      order: "asc",
    };
    const listGlassLineDeliveryRequest = {
      ...glassLineDeliveryListQuery,
    };

    logger.info(
      `listGlassLineDeliveryRequest: ${JSON.stringify(glassLineDeliveryListQuery)}`
    );
    const apiResponse = await sendApiRequest(
      listGlassLineDelivery,
      listGlassLineDeliveryRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(
      `listGlassLineDeliveryResponse: ${JSON.stringify(apiResponse)}`
    );

    if (!apiResponse.ok) {
      throw apiResponse;
    }

    const listGlassLineDeliveryResponse: GlassLineDeliveryQueryResultDto =
      apiResponse.data;
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
    const getOrderByOrderCodePath: GetOrderByOrderCodePath = {
      orderCode: orderCode,
    };
    const getOrderByOrderCodeRequst = {
      ...getOrderByOrderCodePath,
    };

    logger.info(
      `getOrderByOrderCodeRequst: ${JSON.stringify(getOrderByOrderCodeRequst)}`
    );
    const apiResponse = await sendApiRequest(
      getOrderByOrderCode,
      getOrderByOrderCodeRequst,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`getOrderByOrderCodeResponse: ${JSON.stringify(apiResponse)}`);
    if (!apiResponse.ok) {
      throw apiResponse;
    }
    const orderInformation: OrderDetailReadDto = apiResponse.data;
    return orderInformation;
  }
}
