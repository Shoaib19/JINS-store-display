import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { components } from "~/src/interfaces/root";
import { addDays } from "~/src/utils/datetimeUtils";
import {
  COUNTRY_CODE_ALPHA2,
  DeliveryStatus,
  OrderType,
  ReplacementStatusCode,
  HandsOverDelayDays
} from "~/src/components/const";
import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import type { IJobTicketsPresenter } from "~/src/presenters/interfaces";
import { getOrderByReceptionNumber } from "~/src/clients/salesOrder/salesOrderClient";
import {
  findWarranties,
  findWarrantyHistories,
  getPowersById
} from "~/src/clients/warranties/warrantiesClient";
import { getStoreAttributes } from "~/src/clients/locations/locationsClient";
import { getLensUniqueAttributes } from "~/src/clients/items/itemsClient";
import {
  WarrantyInfo,
  WarrantyHistoriesGetRequest,
  WarrantyHistoriesGetResponse,
  WarrantyHistories,
  PowersGetRequest,
  PowersGetResponse,
  WarrantiesGetRequest,
  WarrantiesGetResponse,
} from "~/src/clients/warranties/warrantiesClientTypes";
import {
  OrderByReceptionNumberGetRequest,
  OrderGetResponse,
} from "~/src/clients/salesOrder/salesOrderClientTypes";
import {
  StoreAttributesGetRequest,
  StoreAttributesGetResponse
} from "~/src/clients/locations/locationsClientTypes";
import {
  LensUniqueAttributesGetRequest,
  LensUniqueAttributesGetResponse
} from "~/src/clients/items/itemsClientTypes";
import {
  fixDatetimeForFront,
  fixDatetimeForFrontFromDpfm,
  toUTCDateFromString
} from "~/src/utils/fixDatetime";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";
import { ApiResponse } from "openapi-typescript-fetch";
import { isNotFoundResponse, ValidationError } from "~/src/components/errors";

/**
 * 保証書・加工指示書・引換票API
 */
@injectable()
export class JobTicketsPresenter implements IJobTicketsPresenter {

  /**
   * 保証書・加工指示書・引換票API
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

      // 注文詳細取得
      const orderDetail: OrderGetResponse = await this.getOrderDetail(dpfmRequestInfo, req.params.receptionNumber);

      // メガネ行がない場合
      if (!(Array.isArray(orderDetail.glassLines) && orderDetail.glassLines.length > 0)) {
        throw new ValidationError("GlassLines of the order-detail is not array or empty.");
      }

      // 注文詳細から商品グループコードが一致するメガネ行を取得
      const glassLine = orderDetail.glassLines?.find(
        glass => glass.itemGroupCode == req.params.itemGroupCode);
      if (!glassLine) {
        throw new ValidationError("Glasslines has no matches item group code.");
      }

      // 度数IDが取得できない場合
      if (glassLine.powerId == null) {
        throw new ValidationError("Power ID of the warranty information could not get.");
      }

      // 度数・処方箋情報取得
      const powerPrescriptionInfo = await this.getPowerPrescription(dpfmRequestInfo, glassLine.powerId);

      // 保証履歴取得
      const warrantyHistory = await this.getWarrantyHistory(dpfmRequestInfo, req.params.receptionNumber);

      // 保証情報取得
      const warrantyInfo = await this.getWarrantyInfo(
        dpfmRequestInfo,
        warrantyHistory?.warrantyNumber ?? req.params.itemGroupCode
      );

      // 店舗属性情報取得
      const storeAttributes = await this.getStoreAttributes(dpfmRequestInfo, req.params.storeCode);

      // レンズ固有属性取得 (L)
      const lensAttributeGetRequest: LensUniqueAttributesGetRequest = {
        itemIdList: glassLine.lensLeftItemId ? [glassLine.lensLeftItemId] : undefined,
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
        deletedGetFlag: false
      };
      const lensAttributesLeft = await this.getLensUniqueAttributes(
        dpfmRequestInfo, lensAttributeGetRequest
      );

      // レンズ固有属性取得 (R)
      lensAttributeGetRequest.itemIdList = glassLine.lensRightItemId ? [glassLine.lensRightItemId] : undefined;
      const lensAttributesRight = await this.getLensUniqueAttributes(
        dpfmRequestInfo, lensAttributeGetRequest
      );

      const timeZone = getStoreTimeZone(req);

      // 店舗電話番号を取得
      const storePhoneNumber = (
        Array.isArray(storeAttributes.records)
        && storeAttributes.records.length > 0
        && storeAttributes.records[0].location
        && storeAttributes.records[0].location.primaryPhoneNumber)
        ? storeAttributes.records[0].location.primaryPhoneNumber : "";

        // レスポンスボディをセット
      const responseBody: components["schemas"]["OrderVoucherResponse"] = {
        storeName: orderDetail.receptionStoreName ?? "",
        storePhoneNumber: storePhoneNumber,
        receptionNumber:
          orderDetail.receptionNumber ?? req.params.receptionNumber,
        warrantyNumber: warrantyInfo?.warrantyNumber ?? req.params.itemGroupCode,
        warrantyInfo: this.setWarrantyInfo(
          glassLine.delivery?.deliveryStatus ?? "",
          glassLine.orderType,
          warrantyInfo,
          warrantyHistory
        ),
        customerInfo: {
          phoneNumber: orderDetail.phoneNumber ?? "",
          customerName: orderDetail.customerName ?? "",
          hasJinsAccountId: orderDetail.customerId ? true : false,
        },
        itemCaseInfo: {
          caseName: glassLine.caseItemName ?? "",
        },
        lensoption: {
          salesColorNameItemName: glassLine.lopSalesColorNameItemName ?? "",
          salesLensSpecItemName: glassLine.lopSalesLensSpecItemName ?? "",
          progressiveCategoryItemName: glassLine.lopProgressiveCategoryItemName ?? "",
          refractiveIndexNameItemName: glassLine.lopRefractiveIndexNameItemName ?? "",
          RLens: (Array.isArray(lensAttributesRight.records) && lensAttributesRight.records.length > 0)
            ? lensAttributesRight.records[0].lensNames?.lensName ?? "" : "",
          LLens: (Array.isArray(lensAttributesLeft.records) && lensAttributesLeft.records.length > 0)
            ? lensAttributesLeft.records[0].lensNames?.lensName ?? "" : "",
          displayTitle: glassLine.lopSalesColorNameItemName ?? "",
        },
        lensReplacement: {
          lensReplacementFlag: warrantyInfo?.isExchangeLens ?? false,
          lensReplacementTypeName:
            glassLine.lensReplacementTypeItemName ?? undefined,
        },
        frame: {
          productCode: glassLine.frameItemCode ?? "",
        },
        prescription: powerPrescriptionInfo
          ? {
              prescriptionExpiration:
                fixDatetimeForFrontFromDpfm(powerPrescriptionInfo.PowerItem?.expirationDate) ?? undefined,
            }
          : null,
        prescriptionInfo: powerPrescriptionInfo
          ? {
              vision: powerPrescriptionInfo.vision,
              perspectiveTypeCode:
                powerPrescriptionInfo.perspectiveTypeCode ?? null,
              sphRight: powerPrescriptionInfo.sphRight ?? null,
              sphLeft: powerPrescriptionInfo.sphLeft ?? null,
              cylRight: powerPrescriptionInfo.cylRight ?? null,
              cylLeft: powerPrescriptionInfo.cylLeft ?? null,
              axisRight: powerPrescriptionInfo.axisRight ?? null,
              axisLeft: powerPrescriptionInfo.axisLeft ?? null,
              pdRight: powerPrescriptionInfo.pdRight ?? null,
              pdLeft: powerPrescriptionInfo.pdLeft ?? null,
              addRight: powerPrescriptionInfo.addRight ?? null,
              addLeft: powerPrescriptionInfo.addLeft ?? null,
              eyepointRight: powerPrescriptionInfo.eyepointRight ?? null,
              eyepointLeft: powerPrescriptionInfo.eyepointLeft ?? null,
              prismFlag: powerPrescriptionInfo.prismFlag ?? false,
              prism01Right: powerPrescriptionInfo.prism01Right ?? undefined,
              prism01Left: powerPrescriptionInfo.prism01Left ?? undefined,
              baseHRight: powerPrescriptionInfo.baseHRight ?? undefined,
              baseHLeft: powerPrescriptionInfo.baseHLeft ?? undefined,
              prism02Right: powerPrescriptionInfo.prism02Right ?? undefined,
              prism02Left: powerPrescriptionInfo.prism02Left ?? undefined,
              baseVRight: powerPrescriptionInfo.baseVRight ?? undefined,
              baseVLeft: powerPrescriptionInfo.baseVLeft ?? undefined,
            }
          : null,
        deliveryInfo: {
          deliveryMethodCode: glassLine.delivery?.deliveryMethodCode ?? "",
        },
        purchaseDate:
          fixDatetimeForFrontFromDpfm(warrantyInfo?.warrantyItems?.at(0)?.purchaseDate) ?? "",
        handOverDate: this.getHandsOverDate(
          lensAttributesLeft,
          lensAttributesRight,
          orderDetail,
          timeZone,
        ) ?? "",
      };

      res.status(200).json(responseBody).send();

    } catch (error) {
      next(error);
    }
  }

  /**
   * 注文詳細情報取得
   * @param dpfmRequestInfo DPFM層へのリクエスト情報
   * @param receptionNumber 受付番号
   * @returns 注文詳細情報
   */
  private async getOrderDetail(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string
  ): Promise<OrderGetResponse> {
    const getOrderByReceptionNumberRequest: OrderByReceptionNumberGetRequest = {
      receptionNumber: receptionNumber
    };
    logger.info(`getOrderByReceptionNumberRequest: ${JSON.stringify(getOrderByReceptionNumberRequest)}`);

    // DPFM層注文詳細取得API呼出
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    const response: ApiResponse<OrderGetResponse> = await sendApiRequest(
      getOrderByReceptionNumber,
      getOrderByReceptionNumberRequest,
      header,
    );
    logger.info(`getOrderByReceptionNumberResponse: ${JSON.stringify(response)}`);
    return response.data;
  }

  /**
   * 保証情報取得
   * @param dpfmRequestInfo DPFM層へのリクエスト情報
   * @param warrantyNumber 保証書番号
   * @returns 保証情報
   */
  private async getWarrantyInfo(
    dpfmRequestInfo: DpfmRequestInfo,
    warrantyNumber: string
  ): Promise<WarrantyInfo | undefined> {
    const request: WarrantiesGetRequest = {
      warrantyNumber: warrantyNumber
    };
    logger.info(`findWarrantiesRequest: ${JSON.stringify(request)}`);

    // DPFM層保証情報取得API呼出
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    const response: ApiResponse<WarrantiesGetResponse> = await sendApiRequest(
      findWarranties,
      request,
      header
    );
    logger.info(`findWarrantiesResponse: ${JSON.stringify(response)}`);
    return response.data.warrantyInfo;
  }

  /**
   * 保証履歴取得
   * @param dpfmRequestInfo DPFM層へのリクエスト情報
   * @param receptionNumber 受付番号
   * @returns 保証履歴
   */
  private async getWarrantyHistory(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string
  ): Promise<WarrantyHistories | undefined | null> {
    const excludeInitialStatus=ReplacementStatusCode.TEMPORARY
    +","+ReplacementStatusCode.PROCESSING
    +","+ReplacementStatusCode.DONE;
    const request: WarrantyHistoriesGetRequest = {
      receptionNumber: receptionNumber
      , replacementStatusCode: excludeInitialStatus

    }
    logger.info(`findWarrantyHistoriesRequest: ${JSON.stringify(request)}`);
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    try {
      const response: ApiResponse<WarrantyHistoriesGetResponse> = await sendApiRequest(
        findWarrantyHistories,
        request,
        header
      );
      logger.info(`findWarrantyHistoriesResponse: ${JSON.stringify(response)}`);
      return (Array.isArray(response.data.warrantyHistories) && response.data.warrantyHistories.length > 0)
        ? response.data.warrantyHistories[0] : undefined;
    } catch (error) {
      // Not Foundはエラーとせず正常終了する
      if (isNotFoundResponse(error)) {
        return null;
      }
      throw error;
    }
  }

  /**
   * 度数・処方箋情報取得
   * @param dpfmRequestInfo DPFM層へのリクエスト情報
   * @param powerId 度数ID
   * @returns 度数・処方箋情報
   */
  private async getPowerPrescription(
    dpfmRequestInfo: DpfmRequestInfo,
    powerId: number
  ): Promise<PowersGetResponse | null> {
    const request: PowersGetRequest = {
      powerId: powerId
    };
    logger.info(`getPowersRequest: ${JSON.stringify(request)}`);

    // DPFM層度数・処方箋情報取得API呼出
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    try {
      const response: ApiResponse<PowersGetResponse> = await sendApiRequest(
        getPowersById,
        request,
        header,
      );
      logger.info(`getPowersResponse: ${JSON.stringify(response)}`);
      return response.data;
    } catch (error) {
      // ステータス404はエラーとしない
      if (isNotFoundResponse(error)) {
        return null;
      }
      throw error;
    }
  }

  /**
   * 店舗属性情報取得
   * @param dpfmRequestInfo DPFM層へのリクエスト情報
   * @param storeCode 店舗コード
   * @returns 店舗属性情報
   */
  private async getStoreAttributes(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string
  ): Promise<StoreAttributesGetResponse> {
    const request: StoreAttributesGetRequest = {
      locationCodeList: [storeCode]
    };
    logger.info(`getStoreAttributesRequest: ${JSON.stringify(request)}`);

    // DPFM店舗属性マスタ検索API呼出
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    const response: ApiResponse<StoreAttributesGetResponse> = await sendApiRequest(
      getStoreAttributes,
      request,
      header,
    );
    logger.info(`getStoreAttributesResponse: ${JSON.stringify(response)}`);
    return response.data;
  }

  /**
   * レンズ固有属性情報取得
   * @param dpfmRequestInfo DPFM層へのリクエスト情報
   * @param request レンズ固有属性検索APIのリクエスト
   * @returns レンズ固有属性情報
   */
  private async getLensUniqueAttributes(
    dpfmRequestInfo: DpfmRequestInfo,
    request: LensUniqueAttributesGetRequest
  ): Promise<LensUniqueAttributesGetResponse> {
    logger.info(`getLensUniqueAttributesRequest: ${JSON.stringify(request)}`);

    // DPFMレンズ固有属性検索API呼出
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    const response: ApiResponse<LensUniqueAttributesGetResponse> = await sendApiRequest(
      getLensUniqueAttributes,
      request,
      header,
    );
    logger.info(`getLensUniqueAttributesResponse: ${JSON.stringify(response)}`);
    return response.data;
  }

  /**
   * お渡し予定日取得
   * @param lensAttributesLeft レンズ固有属性Left
   * @param lensAttributesRight レンズ固有属性Right
   * @param orderDetail 注文詳細
   * @param timeZone タイムゾーン
   * @returns お渡し予定日
   */
  private getHandsOverDate(
    lensAttributesLeft: LensUniqueAttributesGetResponse,
    lensAttributesRight: LensUniqueAttributesGetResponse,
    orderDetail: OrderGetResponse,
    timeZone: string,
  ) {
    const isSpecialOrder = (
      lensAttributesLeft: LensUniqueAttributesGetResponse,
      lensAttributesRight: LensUniqueAttributesGetResponse,
    ) => {
      // 左右のレンズ固有属性のOPCコードがいずれかnullの場合は特注品
      return lensAttributesLeft.records?.at(0)?.lenses?.opcCode == null || 
      lensAttributesRight.records?.at(0)?.lenses?.opcCode == null
    };
    
    const orderDatetime = toUTCDateFromString(orderDetail.orderDate, timeZone);
    if(!orderDatetime) {
      return null;
    }

    let deliveryDateTime = null;
    if(orderDetail.glassLines?.at(0)?.delivery?.deliveryDateTime != null){
      deliveryDateTime = toUTCDateFromString(orderDetail.glassLines?.at(0)?.delivery?.deliveryDateTime, timeZone);
      if(!deliveryDateTime) {
        return null;
      }
    }

    // 特注品は注文日にレンズ固有属性検索APIで取得したレンズ固有属性情報.リードタイムToを加算
    const handsOverDatetime = isSpecialOrder(
      lensAttributesLeft,
      lensAttributesRight
    )
      // 一時的にコメントアウトする(DJ36_STORE-1044)
      // ? addDays(orderDatetime, lensAttributesLeft.records?.at(0)?.lenses?.leadTimeTo ?? 0)
      // 一時的に固定値加算に変更する(DJ36_STORE-1044)
      ? addDays(orderDatetime, HandsOverDelayDays.SPECIAL_ORDER_LENS)
      : deliveryDateTime;
    return fixDatetimeForFront(handsOverDatetime);
  }
  /**
   * 保証情報設定
   * @param deliveryStatus - お渡し行ステータス
   * @param orderType - 顧客名
   * @param warrantyInfo - 住所1
   * @param warrantyHistory - 住所2
   */
  private setWarrantyInfo(
    deliveryStatus: string,
    orderType?: string,
    warrantyInfo?: WarrantyInfo,
    warrantyHistory?: WarrantyHistories | null,
  ): {warrantyCount?:number, replacePartCodeL?: string,originalReceptionNumber?: string} | null {
    if( orderType !== OrderType.WARRANTY_EXCHANGE){
      return null;
    }
    
    let exchangeCount: number | undefined = warrantyInfo?.exchangeCount
    const calcExchangeCountStatuses = [
      DeliveryStatus.BEFORE_PREPARING,
      DeliveryStatus.DELIVERY_PREPARING,
      DeliveryStatus.READY_FOR_DELIVERY,
    ];
    if (calcExchangeCountStatuses.includes(deliveryStatus)) {
      // 交換回数加算フラグがtrueの場合＋1する
      if(warrantyHistory?.exchangeCountIncrementFlag){
        logger.info(`Increment the exchange count for printing. 
          deliveryStatus: ${deliveryStatus}, 
          exchangeCountIncrementFlag: ${warrantyHistory?.exchangeCountIncrementFlag} ` );
        exchangeCount = ( warrantyInfo?.exchangeCount ?? 0 ) +1 ;
      }
    }

    const result = {
      warrantyCount: exchangeCount,
      replacePartCode: warrantyHistory?.replacementPart,
      originalReceptionNumber: warrantyInfo?.receptionNumber,
    }
    return result;
  }
}
