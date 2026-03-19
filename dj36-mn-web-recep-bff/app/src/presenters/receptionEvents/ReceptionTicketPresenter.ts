import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IReceptionTicketPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import {
  CallingStatus,
  LineType,
  ReceptionStatus,
} from "~/src/compornents/const";
import { calcReceptionsWithGuidanceDiffMinute , getLineType} from "~/src/utils/calculateWaitingTime";
import { getCallManagement, getCartInfo, getReceptionsServer, searchReceptionInformation } from "~/src/clients/carts/cartsClient";
import { CartResponse, findCartQuery, FindReceptionsPath, FindReceptionsQuery, GetCallManagementPath, ReceptionGetResponse, itemGroupCompleteSet, ReceptionInformation, ReceptionInfos, SearchReceptionInformationQuery } from "~/src/clients/carts/cartsClientTypes";
import { fixDatetimeForFront, fixSystemDate } from "~/src/utils/fixDatetime";
import { makeErrorResponse400 } from "~/src/utils/makeErrorResponse400";
import { CommonErrorCode } from "~/src/compornents/errorCode";
import { addMinutes, roundUpToNextMinute } from "~/src/utils/datetimeUtils";
import { ErrorResponse } from "~/src/compornents/errors";
import { components } from "~/src/interfaces/root";
import { getCountryTimeZone } from "~/src/utils/getTimeZone";

/**
 * 受付票・番号票API
 */
@injectable()
export class ReceptionTicketPresenter
  extends BasePresenter
  implements IReceptionTicketPresenter
{
  /**
   * 受付票・番号票
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
      const cursor = req.header("x-cursor");
      const requestHeader: HeadersInit = new Headers();
      requestHeader.set("Accept", req.header("accept") ?? "");
      requestHeader.set("Accept-Language", req.header("accept-language") ?? "");
      requestHeader.set("Content-Type", req.header("content-type") ?? "");
      requestHeader.set("Authorization", req.header("authorization") ?? "");
      requestHeader.set("X-API-KEY", process.env.CRM_API_KEY ?? "");
      requestHeader.set("jins-trace-id", req.header("jins-trace-id") ?? "");
      requestHeader.set("jins-user-id", req.header("staffID") ?? "");
      if (cursor) {
        requestHeader.set("X-Cursor", cursor);
      }

      // 待ち状況取得API呼出
      const findReceptionsQuery: FindReceptionsQuery = {
        receptionNumber: req.params.receptionNumber,
        registeredDate: fixSystemDate(getCountryTimeZone()),
      };
      const findReceptionsPath: FindReceptionsPath = {
        storeCode: req.params.storeCode,
      }

      const receptionsGetRequest = {
        ...findReceptionsQuery,
        ...findReceptionsPath,
      };

      logger.info(
        `receptionsGetRequest: ${JSON.stringify(receptionsGetRequest)}`
      );

      // デジタル基盤層APIを呼び出す
      const receptionsGetResponse = await sendApiRequest(
        getReceptionsServer,
        receptionsGetRequest,
        requestHeader
      );

      logger.info(`receptionsGetResponse: ${JSON.stringify(receptionsGetResponse)}`);

      if (!receptionsGetResponse.ok) {
        throw receptionsGetResponse
      }
      const receptionsGetResponseData: ReceptionGetResponse = receptionsGetResponse.data;

      // 呼出し管理情報取得API呼出
      const getCallManagementPath: GetCallManagementPath = {
        storeCode: req.params.storeCode,
      };
      const callManagementGetRequest = {
        ...getCallManagementPath,
      };
      logger.info(`callManagementGetRequest: ${JSON.stringify(callManagementGetRequest)}`);
      const callManagementGetResponse = await sendApiRequest(
        getCallManagement,
        callManagementGetRequest,
        requestHeader
      );
      logger.info(`callManagementGetResponse: ${JSON.stringify(callManagementGetResponse)}`);
      if (!callManagementGetResponse.ok) {
        throw callManagementGetResponse;
      }

      // カートカタログ取得API呼出
      const cartInfoGetRequest: findCartQuery = {
        receptionNumber: req.params.receptionNumber,
        deleteFlag: false,
      }

      logger.info(`cartInfoGetRequest: ${JSON.stringify(cartInfoGetRequest)}`);

      const cartInfoGetResponse = await sendApiRequest(
        getCartInfo,
        cartInfoGetRequest,
        requestHeader
      );
      logger.info(`cartInfoGetResponse: ${JSON.stringify(cartInfoGetResponse)}`);
  
      if (!cartInfoGetResponse.ok) {
        throw cartInfoGetResponse;
      }
      const cartResponse: CartResponse = cartInfoGetResponse.data;
      const cartItemGroup: itemGroupCompleteSet | undefined = cartResponse.cart?.itemGroups ? cartResponse.cart?.itemGroups[0] : undefined

      // 受付情報を振り分ける
      const dividedReceptions = this.divideReception(receptionsGetResponseData.receptionInfos!);

      const sortedReceptions = [
        ...dividedReceptions[0].filter((reception) =>
          ![CallingStatus.NO_SHOW].includes(reception.callingStatusCode!)
        ),
        ...dividedReceptions[0].filter((reception) =>
          [CallingStatus.NO_SHOW].includes(reception.callingStatusCode!)
        ),
      ];
      const now = new Date();
      const receptionsWithWaitTime = calcReceptionsWithGuidanceDiffMinute(
        callManagementGetResponse.data.callManagementInfo!,
        sortedReceptions
      );

      const receptionWithGuidanceDiffMinute = 
      receptionsWithWaitTime.filter((reception) => reception.reception.receptionNumber === req.params.receptionNumber).at(0);

      let receptionInformation: ReceptionInformation | null = null
      // リクエスト.受付番号に合致するレコードがない場合、受付情報検索APIを呼び出す
      if (!receptionWithGuidanceDiffMinute) {
        const searchReceptionInformationQuery: SearchReceptionInformationQuery = {
          receptionNumber: req.params.receptionNumber,
        }
        logger.info(
          `searchReceptionInformationQuery: ${JSON.stringify(searchReceptionInformationQuery)}`
        );
        const SearchReceptionInformationResponse = await sendApiRequest(
          searchReceptionInformation,
          searchReceptionInformationQuery,
          requestHeader
        );
        logger.info(
          `SearchReceptionInformationResponse: ${JSON.stringify(SearchReceptionInformationResponse)}`
        );
        if (!SearchReceptionInformationResponse.ok) {
          throw SearchReceptionInformationResponse;
        }

        receptionInformation = SearchReceptionInformationResponse.data.ReceptionInfoAllItems[0]
      }

      const guidanceDiffMinutes = receptionInformation ? null : receptionWithGuidanceDiffMinute?.guidanceDiffMinutes;
      const guidanceTime = guidanceDiffMinutes
        ? fixDatetimeForFront(
            roundUpToNextMinute(addMinutes(now, guidanceDiffMinutes))
          )
        : null;

      //レスポンスデータの加工
      const data: components["schemas"]["RcptTicketsGetResponse"] = {
        receptionNumber: receptionInformation ? receptionInformation?.receptionNumber! : receptionWithGuidanceDiffMinute?.reception.receptionNumber!,
        callingNumber: receptionInformation ? receptionInformation?.callingNumber! : receptionWithGuidanceDiffMinute?.reception.callingNumber!,
        guidanceTime: guidanceTime,
        visitingPurposeCode: receptionInformation ? receptionInformation?.visitingPurposeCode! : receptionWithGuidanceDiffMinute?.reception.visitingPurposeCode!,
        customerIssueCode: receptionInformation ? receptionInformation?.customerIssueCode! : receptionWithGuidanceDiffMinute?.reception.customerIssueCode!,
        prescriptionRegistCode: receptionInformation ? receptionInformation?.prescriptionRegistCode! : receptionWithGuidanceDiffMinute?.reception.prescriptionRegistCode!,
        frameCode: cartItemGroup?.frameItemCode ?? null,
        frameName: cartItemGroup?.frameItemName ?? null,
      }
      res.status(200).send(data);
      return;
    } catch (error: any) {
      if (error.status === 400 || error.status === 404 || (error.hasOwnProperty("details")
        && JSON.parse(error.details).hasOwnProperty("status")
        && JSON.parse(error.details).status == 400)) {
        res.status(400).json(error?.data);
      } else {
        res.status(error.status).json(error?.data);
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };

  /**
   * 受付情報を受付ステータス別に分割する
   * @param receptions 受付情報[]
   * @returns 受付情報[][] (0:Prescription/1:Adjustment/2:Cart/3:Payment)
   */
  private divideReception(receptions: ReceptionInfos[]) {
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
}
