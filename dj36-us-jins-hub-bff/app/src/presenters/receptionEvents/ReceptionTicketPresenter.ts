import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IReceptionTicketPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { calcReceptionsWithGuidanceDiffMinute, filterWaitingReceptions } from "~/src/utils/receptionUtils";
import {
  getCallManagement,
  getCartInfo,
  getReceptionsServer,
} from "~/src/clients/carts/cartsClient";
import {
  CartGetResponse,
  CartGetRequest,
  CallManagementGetRequest,
  ReceptionGetResponse,
  ReceptionGetRequest,
  CallManagementGetResponse,
} from "~/src/clients/carts/cartsClientTypes";
import { fixDatetimeForFront, fixSystemDate } from "~/src/utils/fixDatetime";
import { addMinutes, roundUpToNextMinute } from "~/src/utils/datetimeUtils";
import { getCountryTimeZone, getStoreTimeZone } from "~/src/utils/getTimeZone";
import { ApiResponse } from "openapi-typescript-fetch";
import { DpfmRequestInfo, generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";
import { components } from "~/src/interfaces/root";

// 受付票・番号票API
type RcptTicketsGetResponse = components["schemas"]["RcptTicketsGetResponse"]

/**
 * 受付票・番号票API
 */
@injectable()
export class ReceptionTicketPresenter
  implements IReceptionTicketPresenter
{
  /**
   * 待ち状況取得
   * @param dpfmRequestInfo - デジタル基盤へのリクエスト情報
   * @param storeCode - 店舗CD
   * @param receptionNumber - 受付番号
   * @returns - 待ち状況情報
   */
  private getReceptions = async (
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    receptionNumber?: string
  ): Promise<ReceptionGetResponse> => {
    // 待ち状況取得リクエストの設定
    const receptionsGetRequest: ReceptionGetRequest = {
      storeCode: storeCode,
      receptionNumber: receptionNumber,
      registeredDate: fixSystemDate(getCountryTimeZone()),
    };
    logger.info(`getReceptionsServerRequest: ${JSON.stringify(receptionsGetRequest)}`);

    // デジタル基盤層（待ち状況取得）APIを呼び出す
    const apiResponse: ApiResponse<ReceptionGetResponse> = await sendApiRequest(
      getReceptionsServer,
      receptionsGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo),
      process.env.CART_SERVICE_JP
    );

    logger.info(`getReceptionsServerResponse: ${JSON.stringify(apiResponse)}`);
    return apiResponse.data;
  }

  /**
   * 呼出管理情報取得
   * @param dpfmRequestInfo - デジタル基盤へのリクエスト情報
   * @param storeCode - 店舗CD
   * @returns - 呼出管理情報
   */
  private getCallManagement = async (
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
  ): Promise<CallManagementGetResponse> => {
    // 呼出管理情報取得リクエストの設定
    const callManagementGetRequest: CallManagementGetRequest = {
      storeCode: storeCode,
    };
    logger.info(`getCallManagementRequest: ${JSON.stringify(callManagementGetRequest)}`);

    // デジタル基盤層（呼出管理情報取得）APIを呼び出す
    const apiResponse = await sendApiRequest(
      getCallManagement,
      callManagementGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`getCallManagementResponse: ${JSON.stringify(apiResponse)}`);
    return apiResponse.data
  }

  /**
   * カート・カタログ取得
   * @param dpfmRequestInfo - デジタル基盤へのリクエスト情報
   * @param receptionNumber - 受付番号
   * @returns - カート情報
   */
  private getCart = async (
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string
  ): Promise<CartGetResponse> => {
    // カート・カタログ取得リクエストの設定
    const cartInfoGetRequest: CartGetRequest = {
      receptionNumber: receptionNumber,
      deleteFlag: false,
    };
    logger.info(`getCartInfoRequest: ${JSON.stringify(cartInfoGetRequest)}`);

    // デジタル基盤層（カート・カタログ取得）APIを呼び出す
    const apiResponse : ApiResponse<CartGetResponse> = await sendApiRequest(
      getCartInfo,
      cartInfoGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`getCartInfoResponse: ${JSON.stringify(apiResponse)}`);

    return apiResponse.data;
  }
  
  /**
   * 受付票・番号票
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

      // 待ち状況取得API呼出
      const receptionsGetResponse = await this.getReceptions(dpfmRequestInfo, req.params.storeCode, req.params.receptionNumber);
      // 指定された受付番号の受付情報（必ず存在する）
      const reception = receptionsGetResponse.receptionInfos?.find((reception) => reception.receptionNumber === req.params.receptionNumber);

      // 呼出し管理情報取得API呼出
      const callManagementGetResponse = await this.getCallManagement(dpfmRequestInfo, req.params.storeCode);

      // カートカタログ取得API呼出
      const cartInfoGetResponse = await this.getCart(dpfmRequestInfo, req.params.receptionNumber);
      const cartItemGroup = cartInfoGetResponse?.cart?.itemGroups?.at(0);

      // 呼出待ち時間を算出するため、呼出待ちの受付に絞り込む。
      const waitingReceptions = filterWaitingReceptions(receptionsGetResponse.receptionInfos!);

      const now = new Date();
      const receptionsWithWaitTime = calcReceptionsWithGuidanceDiffMinute(
        callManagementGetResponse.callManagementInfo!,
        getStoreTimeZone(req),
        waitingReceptions
      );

      const receptionWithGuidanceDiffMinute = 
      receptionsWithWaitTime.filter((reception) => reception.receptionNumber === req.params.receptionNumber).at(0);

      const guidanceDiffMinutes = receptionWithGuidanceDiffMinute?.guidanceDiffMinutes;
      const guidanceTime = guidanceDiffMinutes != undefined
        ? fixDatetimeForFront(
            roundUpToNextMinute(addMinutes(now, guidanceDiffMinutes))
          )
        : null;

      //レスポンスデータの加工
      const data: RcptTicketsGetResponse = {
        receptionNumber: reception!.receptionNumber!,
        callingNumber: reception!.callingNumber!,
        guidanceTime: guidanceTime,
        visitingPurposeCode: reception!.visitingPurposeCode!,
        customerIssueCode: reception!.customerIssueCode ?? null,
        prescriptionRegistCode: reception!.prescriptionRegistCode ?? null,
        frameCode: cartItemGroup?.frameItemCode ?? null,
        frameName: cartItemGroup?.frameItemName ?? null,
      }
      res.status(200).send(data);
      return;
    } catch (error) {
      next(error);
    }
  };
}
