import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";
import { injectable } from "inversify";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { components } from "~/src/interfaces/root";
import { CommonErrorCode } from "~/src/compornents/errorCode";
import { makeErrorResponse400 } from "~/src/utils/makeErrorResponse400";
import { addDays } from "~/src/utils/datetimeUtils";
import { COUNTRY_CODE_ALPHA2, OrderType} from "~/src/compornents/const";
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
  FindWarrantiesPath,
  WarrantyInfo,
  FindWarrantyHistoriesQuery,
  WarrantyHistories,
  GetPowersPath,
  GetPowersResponse,
} from "~/src/clients/warranties/warrantiesClientTypes";
import {
  GetOrderByReceptionNumberPath,
  OrderDetailReadDto,
  GlassLineHorizontalMixinReadDto,
} from "~/src/clients/salesOrder/salesOrderClientTypes";
import {
  GetStoreAttributesQuery,
  GetStoreAttributesResponse
} from "~/src/clients/locations/locationsClientTypes";
import {
  getLensUniqueAttributesQuery,
  LensUniqueAttributesGetResponse
} from "~/src/clients/items/itemsClientTypes";
import { fixDate, fixDatetimeForFront, toUTCDateFromString } from "~/src/utils/fixDatetime";
import { getStartOfDate } from "~/src/utils/datetimeUtils";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";

// 保証書・加工指示書・引換票レスポンスボディ
type OrderVoucherResponse = components["schemas"]["OrderVoucherResponse"];

/**
 * 保証書・加工指示書・引換票API
 */
@injectable()
export class JobTicketsPresenter extends BasePresenter implements IJobTicketsPresenter {

  /**
   * 保証書・加工指示書・引換票API
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

      // 注文詳細取得
      const orderDetail: OrderDetailReadDto = await this.getOrderDetail(dpfmRequestInfo, req.params.receptionNumber);

      // メガネ行がない場合はステータス400を返す
      if (!(Array.isArray(orderDetail.glassLines) && orderDetail.glassLines.length > 0)) {
        this.sendErrorResponse400(req, res, "GlassLines of the order-detail is not array or empty.");
        return;
      }

      // 注文詳細から商品グループコードが一致するメガネ行を取得
      const glassLine: GlassLineHorizontalMixinReadDto | undefined = orderDetail.glassLines!.find(
        (glass) => glass.itemGroupCode == req.params.itemGroupCode);
      if (!glassLine) {
        this.sendErrorResponse400(req, res, "Glasslines has no matches item group code.");
        return;
      }

      // 度数IDが取得できない場合はステータス400を返す
      if (glassLine.powerId == null) {
        this.sendErrorResponse400(req, res, "Power ID of the warranty information could not get.");
        return;
      }

      // 度数・処方箋情報取得
      const powerPrescriptionInfo: GetPowersResponse | null = await this.getPowerPrescription(
        dpfmRequestInfo, glassLine.powerId
      );

      // 保証履歴取得
      const warrantyHistory: WarrantyHistories | null = await this.getWarrantyHistory(
        dpfmRequestInfo, req.params.receptionNumber);

      // 保証情報取得
      const warrantyInfo: WarrantyInfo = await this.getWarrantyInfo(dpfmRequestInfo, warrantyHistory?.warrantyNumber??req.params.itemGroupCode);

      // 店舗属性情報取得
      const storeAttributes: GetStoreAttributesResponse = await this.getStoreAttributes(
        dpfmRequestInfo, req.params.storeCode
      );

      // レンズ固有属性取得 (L)
      const lensAttributeQuery: getLensUniqueAttributesQuery = {
        sphericalPower: powerPrescriptionInfo?.sphLeft ?? undefined,
        astigmatismPrescription: powerPrescriptionInfo?.cylLeft ?? undefined,
        addPower: powerPrescriptionInfo?.addLeft ?? undefined,
        refractiveIndexNameId: glassLine.lopRefractiveIndexNameItemId,
        salesColorNameId: glassLine.lopSalesColorNameItemId,
        salesLensSpecId: glassLine.lopSalesLensSpecItemId,
        focusCategoryId: glassLine.lopFocusCategoryItemId,
        progressiveCategoryId: glassLine.lopProgressiveCategoryItemId,
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
        deletedGetFlag: false
      };
      const lensAttributesLeft: LensUniqueAttributesGetResponse = await this.getLensUniqueAttributes(
        dpfmRequestInfo, lensAttributeQuery
      );

      // レンズ固有属性取得 (R)
      lensAttributeQuery.sphericalPower = powerPrescriptionInfo?.sphRight ?? undefined;
      lensAttributeQuery.astigmatismPrescription = powerPrescriptionInfo?.cylRight ?? undefined;
      lensAttributeQuery.addPower = powerPrescriptionInfo?.addRight ?? undefined;
      const lensAttributesRight: LensUniqueAttributesGetResponse = await this.getLensUniqueAttributes(
        dpfmRequestInfo, lensAttributeQuery
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
      const responseBody: OrderVoucherResponse = {
        storeName: orderDetail.receptionStoreName ?? "",
        storePhoneNumber: storePhoneNumber,
        receptionNumber:
          orderDetail.receptionNumber ?? req.params.receptionNumber,
        warrantyNumber: warrantyInfo.warrantyNumber ?? req.params.itemGroupCode,
        warrantyInfo: this.setWarrantyInfo(
          glassLine.orderType,
          warrantyInfo,
          warrantyHistory
        ),
        customerInfo: {
          customerName: orderDetail.customerName ?? "",
          hasJinsAccountId: orderDetail.customerId ? true : false,
        },
        itemCaseInfo: {
          caseName: glassLine.caseItemName ?? "",
        },
        lensoption: {
          salesColorNameItemName: glassLine.lopSalesColorNameItemName ?? "",
          salesLensSpecItemName: glassLine.lopSalesLensSpecItemName ?? "",
          progressiveCategoryItemName:
            glassLine.lopProgressiveCategoryItemName ?? "",
          refractiveIndexNameItemName:
            glassLine.lopRefractiveIndexNameItemName ?? "",
          RLens: glassLine.lensRightItemCode ?? "",
          LLens: glassLine.lensLeftItemCode ?? "",
          displayTitle: glassLine.lopSalesColorNameItemName ?? "",
        },
        lensReplacement: {
          lensReplacementFlag: warrantyInfo.isExchangeLens ?? false,
          lensReplacementTypeName:
            glassLine.lensReplacementTypeItemName ?? undefined,
        },
        frame: {
          productCode: glassLine.frameItemCode ?? "",
        },
        prescription: powerPrescriptionInfo
          ? {
              // FIXME: DJ36_DEV-888 暫定（warrantyがdateで返却するため）
              prescriptionExpiration:
                fixDatetimeForFront(
                  getStartOfDate(
                    toUTCDateFromString(powerPrescriptionInfo.PowerItem?.expirationDate, timeZone),
                  timeZone)
                ) ?? undefined,
              // prescriptionExpiration: powerPrescriptionInfo.PowerItem?.expirationDate ?? undefined,
            }
          : null,
        prescriptionInfo: powerPrescriptionInfo
          ? {
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
          // FIXME: DJ36_DEV-888 暫定（warrantyがdateで返却するため）
          fixDatetimeForFront(
            getStartOfDate(
              toUTCDateFromString(warrantyInfo.warrantyItems?.at(0)?.purchaseDate, timeZone),
            timeZone)
          ) ?? "",
        handOverDate: this.getHandsOverDate(
          lensAttributesLeft,
          lensAttributesRight,
          orderDetail.orderDate,
          timeZone,
        ) ?? "",
      };

      res.status(200).json(responseBody).send();

    } catch (error: any) {
        if (error.status == 404) {
          res.status(400).json(error?.data);
        } else {
          res.status(error.status).json(error?.data);
        }
        logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  }

  /**
   * ステータス400をレスポンス
   * @param req Request
   * @param res Response
   * @param message メッセージ
   */
  private sendErrorResponse400(req: Request, res: Response, message: string): void {
    logger.info(message);
    res.status(400).json(makeErrorResponse400([message], req)).send();
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
  ): Promise<OrderDetailReadDto> {
    const getOrderByReceptionNumberPath: GetOrderByReceptionNumberPath = {
      receptionNumber: receptionNumber
    };
    const getOrderByReceptionNumberRequest = {
      ...getOrderByReceptionNumberPath
    };
    logger.info(`getOrderByReceptionNumberRequest: ${JSON.stringify(getOrderByReceptionNumberRequest)}`);

    // DPFM層注文詳細取得API呼出
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    try {
      const response = await sendApiRequest(
        getOrderByReceptionNumber,
        getOrderByReceptionNumberRequest,
        header,
      );
      if (!response.ok) {
        throw response;
      }
      logger.info(`getOrderByReceptionNumberResponse: ${JSON.stringify(response)}`);
      return response.data;
    } catch (error: any) {
      logger.info(`getOrderByReceptionNumberResponse: ${JSON.stringify(error)}`);
      throw this.getErrorResponse(header, error);
    }
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
  ): Promise<WarrantyInfo> {
    const path: FindWarrantiesPath = {
      warrantyNumber: warrantyNumber
    };
    const request = {
      ...path
    };
    logger.info(`findWarrantiesRequest: ${JSON.stringify(request)}`);

    // DPFM層保証情報取得API呼出
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    try {
      const response = await sendApiRequest(
        findWarranties,
        request,
        header
      );
      if (!response.ok) {
        throw response;
      }
      logger.info(`findWarrantiesResponse: ${JSON.stringify(response)}`);
      return response.data.warrantyInfo;
    } catch (error) {
      logger.info(`findWarrantiesResponse: ${JSON.stringify(error)}`);
      throw this.getErrorResponse(header, error);
    }
  }

  /**
   * 保証履歴取得
   * @param dpfmRequestInfo DPFM層へのリクエスト情報
   * @param warrantyNumber 保証書番号
   * @param receptionNumber 受付番号
   * @returns 保証履歴
   */
  private async getWarrantyHistory(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string
  ): Promise<WarrantyHistories | null> {
    const query: FindWarrantyHistoriesQuery = {
      receptionNumber: receptionNumber
    }
    const request = {
      ...query,
    }
    logger.info(`findWarrantyHistoriesRequest: ${JSON.stringify(request)}`);
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    try {
      const response = await sendApiRequest(
        findWarrantyHistories,
        request,
        header
      );
      if (!response.ok) {
        throw response;
      }
      logger.info(`findWarrantyHistoriesResponse: ${JSON.stringify(response)}`);
      return response.data.warrantyHistories[0];
    } catch (error :any) {
      logger.info(`findWarrantyHistoriesResponse: ${JSON.stringify(error)}`);
      // Not Foundはエラーとせず正常終了する
      if (error.status == 404) {
        return null;
      }
      throw this.getErrorResponse(header, error);
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
  ): Promise<GetPowersResponse | null> {
    const path: GetPowersPath = {
      powerId: powerId
    };
    const request = {
      ...path
    };
    logger.info(`getPowersRequest: ${JSON.stringify(request)}`);

    // DPFM層度数・処方箋情報取得API呼出
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    try {
      const response = await sendApiRequest(
        getPowersById,
        request,
        header,
      );
      if (!response.ok) {
        throw response;
      }
      logger.info(`getPowersResponse: ${JSON.stringify(response)}`);
      return response.data;
    } catch (error: any) {
      logger.info(`getPowersResponse: ${JSON.stringify(error)}`);
      // ステータス404はエラーとしない
      if (error.status == 404) {
        return null;
      }
      throw this.getErrorResponse(header, error);
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
  ): Promise<GetStoreAttributesResponse> {
    const query: GetStoreAttributesQuery = {
      locationCodeList: [storeCode]
    };
    const request = {
      ...query
    };
    logger.info(`getStoreAttributesRequest: ${JSON.stringify(request)}`);

    // DPFM店舗属性マスタ検索API呼出
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    try {
      const response = await sendApiRequest(
        getStoreAttributes,
        request,
        header,
      );
      if (!response.ok) {
        throw response;
      }
      logger.info(`getStoreAttributesResponse: ${JSON.stringify(response)}`);
      return response.data;
    } catch (error) {
      logger.info(`getStoreAttributesResponse: ${JSON.stringify(error)}`);
      throw this.getErrorResponse(header, error);
    }
  }

  /**
   * レンズ固有属性情報取得
   * @param dpfmRequestInfo DPFM層へのリクエスト情報
   * @param query レンズ固有属性検索APIクエリーパラメータ
   * @returns レンズ固有属性情報
   */
  private async getLensUniqueAttributes(
    dpfmRequestInfo: DpfmRequestInfo,
    query: getLensUniqueAttributesQuery
  ): Promise<LensUniqueAttributesGetResponse> {
    const request = {
      ...query
    };
    logger.info(`getLensUniqueAttributesRequest: ${JSON.stringify(request)}`);

    // DPFMレンズ固有属性検索API呼出
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    try {
      const response = await sendApiRequest(
        getLensUniqueAttributes,
        request,
        header,
      );
      if (!response.ok) {
        throw response;
      }
      logger.info(`getLensUniqueAttributesResponse: ${JSON.stringify(response)}`);
      return response.data;
    } catch (error) {
      logger.info(`getLensUniqueAttributesResponse: ${JSON.stringify(error)}`);
      throw this.getErrorResponse(header, error);
    }
  }

  /**
   * お渡し予定日取得
   * @param lensAttributesLeft レンズ固有属性Left
   * @param lensAttributesRight レンズ固有属性Right
   * @param orderDate 注文日
   * @oaram timeZone タイムゾーン
   * @returns お渡し予定日
   */
  private getHandsOverDate(
    lensAttributesLeft: LensUniqueAttributesGetResponse,
    lensAttributesRight: LensUniqueAttributesGetResponse,
    orderDate: string,
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
    
    const orderDatetime = toUTCDateFromString(orderDate, timeZone);
    if(!orderDatetime) {
      return null;
    }
    // 特注品は注文日に22日加算
    const handsOverDatetime = isSpecialOrder(
      lensAttributesLeft,
      lensAttributesRight
    )
      ? addDays(orderDatetime, 22)
      : orderDatetime;
    return fixDatetimeForFront(handsOverDatetime);
  }
  /**
   * 保証情報設定
   * @param orderType - 顧客名
   * @param warrantyInfo - 住所1
   * @param warrantyHistory - 住所2
   */
  private setWarrantyInfo(
    orderType?: string,
    warrantyInfo?: WarrantyInfo,
    warrantyHistory?: WarrantyHistories | null,
  ): {warrantyCount?:number, replacePartCodeL?: string,originalReceptionNumber?: string} | null {
    if( orderType !== OrderType.WARRANTY_EXCHANGE){
      return null;
    }
    const result = {
      warrantyCount: warrantyInfo?.exchangeCount,
      replacePartCode: warrantyHistory?.replacementPart,
      originalReceptionNumber: warrantyInfo?.receptionNumber,
    }
    return result;
  }
  /**
   * エラーレスポンス取得
   * @param requestHeader リクエストヘッダー
   * @param response DPFM層のエラーレスポンス
   * @returns エラーレスポンス
   */
  private getErrorResponse = (requestHeader: Headers, response: any): any => {
    const errorResponse = {
      status: response.status ?? 500,
      data: {
        "jins-trace-id": requestHeader.get("jins-trace-id"),
        "timestamp": new Date().toISOString(),
        "systemName": "DJ36-Sales",
      }
    };
    this.setErrorMessage(errorResponse);
    return errorResponse;
  }

  /**
   * ステータスに応じたエラーコード・メッセージをセットする
   * @param error エラーレスポンス
   */
  private setErrorMessage(error: any): void {
    switch (error.status) {
      case 400:
        error.data.code = CommonErrorCode.COM_0001_VALIDATION_ERROR.CODE;
        error.data.message = CommonErrorCode.COM_0001_VALIDATION_ERROR.MESSAGE;
        error.data.details = "";
        break;
      case 404:
        error.data.code = CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.CODE;
        error.data.message = CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.MESSAGE;
        error.data.details = "";
        break;
      case 409:
        error.data.code = CommonErrorCode.COM_0003_OPTIMISTIC_LOCK_FAILED.CODE;
        error.data.message = CommonErrorCode.COM_0003_OPTIMISTIC_LOCK_FAILED.MESSAGE;
        error.data.details = "";
        break;
      case 429:
        error.data.code = CommonErrorCode.COM_0004_DUPLICATE_API_CALL.CODE;
        error.data.message = "Too Many Requests.";
        error.data.details = CommonErrorCode.COM_0004_DUPLICATE_API_CALL.MESSAGE;
        break;
      case 500:
        error.data.code = CommonErrorCode.COM_0000_UNEXPECTED_ERROR.CODE;
        error.data.message = "Internal Server Error.";
        error.data.details = CommonErrorCode.COM_0000_UNEXPECTED_ERROR.MESSAGE
        break;
    }
  }
}
