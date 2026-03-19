import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { ICallingStatusUpdatePresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import {
  getCallManagement,
  getReceptionsServer,
  postReceptionEvents,
  searchReceptionInformation,
} from "~/src/clients/carts/cartsClient";
import {
  CallingStatus,
  ReceptionStatus,
} from "~/src/compornents/const";
import {
  CallManagementGetResponse,
  FindReceptionsPath,
  FindReceptionsQuery,
  GetCallManagementPath,
  ReceptionEventsRequest,
  ReceptionGetResponse,
  ReceptionInformation,
  SearchReceptionInformationQuery,
  SearchReceptionInformationResponse,
} from "~/src/clients/carts/cartsClientTypes";
import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { ErrorResponse } from "~/src/compornents/errors";
import { components } from "~/src/interfaces/root";
import { makeErrorResponse400, makeErrorResponse404 } from "~/src/utils/makeErrorResponse400";
import { EventCode, SubEventCode } from "~/src/compornents/eventCode";
import {
  getCallingMessage,
  getCallingSoonMessage,
} from "~/src/utils/createMessage";
import { SMSNotifier } from "~/src/utils/fetchService4SMS";
import { getCountryTimeZone } from "~/src/utils/getTimeZone";
import { fixSystemDate } from "~/src/utils/fixDatetime";

/**
 * 呼出ステータス更新API
 */
@injectable()
export class CallingStatusUpdatePresenter
  extends BasePresenter
  implements ICallingStatusUpdatePresenter
{
  /**
   * 呼出ステータス更新
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
      // 対象の呼出状態
      const allowedCallingStatus: (string | undefined)[] = [
        CallingStatus.WATING,
        CallingStatus.CALLING,
        CallingStatus.IN_SERVICE,
        CallingStatus.NO_SHOW,
      ];
      if (!allowedCallingStatus.includes(req.params.callingStatusCode)) {
        // 呼出状態が対象外の時は400を返却
        const error: ErrorResponse = makeErrorResponse400(
          ["Invalid callingStatus."],
          req
        );
        res.status(400).json(error);
        return;
      }

      // 受付情報取得
      const receptionInformation = await this.getReceptionInformation(
        dpfmRequestInfo,
        req.params.receptionNumber
      );
      if (receptionInformation == undefined) {
        // 受付情報が見つからないときは404を返却
        const error: ErrorResponse = makeErrorResponse404(
          `There is no recode matched ${req.params.receptionNumber}.`,
          req
        );
        res.status(404).json(error);
        return;
      }
      // 更新対象の受付ステータス
      const allowedReceptionStatus: (string | undefined)[] = [
        ReceptionStatus.MEASUREMENT,
        ReceptionStatus.REGISTERED,
        ReceptionStatus.ADJUSTMENT,
        ReceptionStatus.GENERAL_HELP,
      ];
      if (!allowedReceptionStatus.includes(receptionInformation.statusCode)) {
        // 受付情報の受付ステータスが、更新対象の受付ステータスではない時は400を返却
        const error: ErrorResponse = makeErrorResponse400(
          ["The reception status is not applicable."],
          req
        );
        res.status(400).json(error);
        return;
      }

      // 受付情報更新
      await this.updateReceptionInformation(
        dpfmRequestInfo,
        receptionInformation,
        req.params.callingStatusCode
      );

      // SMS送信
      await this.notifySMS(
        dpfmRequestInfo,
        req.params.storeCode,
        receptionInformation,
        req.params.callingStatusCode
      );

      const response: components["schemas"]["CallingStatusResponse"] = {
        callingStatusCode: req.params.callingStatusCode,
      };
      res.status(200).json(response);
      return;
    } catch (error: any) {
      if (error.status == 404) {
          res.status(400).json(error.data);
        } else {
          res.status(error.status).json(error.data);
        }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };

  /**
   * 受付番号から受付情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @returns 受付情報 | undefined
   */
  private async getReceptionInformation(
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
   * 受付情報を更新する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionInformation 受付情報
   * @param callingStatus 呼出状態
   */
  private async updateReceptionInformation(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionInformation: ReceptionInformation,
    callingStatus: string
  ) {
    /**
     * 処理コードを取得する
     * @param receptionInformation 受付情報
     * @param callingStatus 呼出状態
     * @returns 処理コード
     */
    const getEventCode = (
      receptionInformation: ReceptionInformation,
      callingStatus: string
    ) => {
      switch (callingStatus) {
        case CallingStatus.CALLING:
          return undefined;
      }
      switch (receptionInformation.statusCode) {
        case ReceptionStatus.MEASUREMENT:
          return EventCode.MEAS;
        case ReceptionStatus.REGISTERED:
          return EventCode.REGISTERED;
        case ReceptionStatus.ADJUSTMENT:
          return EventCode.ADJUSTMENT;
      }
    };

    /**
     * サブ処理コードを取得する
     * @param receptionInformation 受付情報
     * @param callingStatus 呼出状態
     * @returns サブ処理コード
     */
    const getSubEventCode = (
      receptionInformation: ReceptionInformation,
      callingStatus: string
    ) => {
      switch (callingStatus) {
        case CallingStatus.WATING:
          return receptionInformation.callingStatusCode ===
            CallingStatus.NO_SHOW
            ? SubEventCode.UNDO
            : SubEventCode.RESET;
        case CallingStatus.CALLING:
          return undefined;
        case CallingStatus.IN_SERVICE:
          return SubEventCode.CALLING;
        case CallingStatus.NO_SHOW:
          return SubEventCode.ADSENSE;
      }
    };

    // 受付情報更新API呼び出し
    const receptionEventsPostRequest: ReceptionEventsRequest = {
      receptionNumber: receptionInformation.receptionNumber,
      callingStatusCode: callingStatus,
      eventCode: getEventCode(receptionInformation, callingStatus),
      subEventCode: getSubEventCode(receptionInformation, callingStatus),
    };
    logger.info(
      `receptionEventsPostRequest: ${JSON.stringify(receptionEventsPostRequest)}`
    );

    const apiResponse = await sendApiRequest(
      postReceptionEvents,
      receptionEventsPostRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`receptionEventsPostResponse: ${JSON.stringify(apiResponse)}`);
    if (!apiResponse.ok) {
      throw apiResponse;
    }
  }

  /**
   * SMS送信
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @param receptionInformation 受付情報
   * @returns 受付情報 | undefined
   */
  private async notifySMS(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    receptionInformation: ReceptionInformation,
    callingStatus: string
  ) {
    switch (callingStatus) {
      case CallingStatus.CALLING:
        // 「呼出中」のメッセージを送信
        await this.sendCallingMessage(receptionInformation);
        break;
      case CallingStatus.IN_SERVICE:
        // 次に「もうすぐ呼出」になる受付情報に対して「もうすぐ呼出」のメッセージを送信
        await this.sendCallingSoonMessage(dpfmRequestInfo, receptionInformation, storeCode);
        break;
    }
  }

  /**
   * 「呼出中」メッセージを送信する
   * @param receptionInformation 受付情報
   */
  private async sendCallingMessage(receptionInformation: ReceptionInformation) {
    // MN版ではSMS通知は行わない
    // if (receptionInformation.phoneNumber != undefined) {
    //   try {
    //     const smsnotifierUrl = process.env.SMS_NOTIFIER + "/smsnotifier/JINSUS";
    //     const receptionCompleteMessage: string = getCallingMessage(
    //       receptionInformation.callingNumber!,
    //       receptionInformation.receptionNumber!
    //     );
    //     logger.info(`receptionCompleteMessage: ${receptionCompleteMessage}`);
    //     await SMSNotifier(
    //       smsnotifierUrl,
    //       receptionCompleteMessage,
    //       receptionInformation.phoneNumber
    //     );
    //   } catch (error) {
    //     logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    //   }
    // }
  }
  /**
   * 「もうすぐ呼出」メッセージを送信する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionInformation 受付情報
   * @param storeCode 店舗コード
   */
  private async sendCallingSoonMessage(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionInformation: ReceptionInformation,
    storeCode: string
  ) {
    const targetReceptionStatus : (string|undefined)[] = [
      ReceptionStatus.MEASUREMENT,
      ReceptionStatus.REGISTERED,
    ];
    if( !targetReceptionStatus.includes(receptionInformation.statusCode) ) {
      return;
    }
    // 呼出管理情報を取得
    const callManagementInfo = await this.getCallManagement(
      dpfmRequestInfo,
      storeCode
    );
    // 待ち状況を取得
    const waitingReceptions = await this.getWaitingReceptionInformation(
      dpfmRequestInfo,
      storeCode,
      fixSystemDate(getCountryTimeZone()),
    );
    // 対象の受付情報は、視力測定ライン数+1番目
    const receptionInfo = waitingReceptions.receptionInfos
      ?.filter((reception) =>
        targetReceptionStatus.includes(reception.statusCode)
      )
      .at(callManagementInfo?.availableLines ?? 0);
    // MN版ではSMS通知は行わない
    // logger.info(`phoneNumber: ${receptionInfo?.phoneNumber}`);
    // if (receptionInfo?.phoneNumber != undefined) {
    //   try {
    //     const smsnotifierUrl = process.env.SMS_NOTIFIER + "/smsnotifier/JINSUS";
    //     const receptionCompleteMessage: string = getCallingSoonMessage(
    //       receptionInfo.receptionNumber!
    //     );
    //     logger.info(`receptionCompleteMessage: ${receptionCompleteMessage}`);
    //     await SMSNotifier(
    //       smsnotifierUrl,
    //       receptionCompleteMessage,
    //       receptionInfo.phoneNumber
    //     );
    //   } catch (error) {
    //     logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    //   }
    // }
  }

  /**
   * 待ち状況を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @param registeredDate 受付情報の登録日
   * @returns 待ち状況
   */
  private async getWaitingReceptionInformation(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    registeredDate: string,
  ) {
    // 待ち状況取得API呼び出し
    const findReceptionsPath: FindReceptionsPath = {
      storeCode: storeCode,
    };
    const findReceptionsQuery: FindReceptionsQuery = {
      registeredDate: registeredDate,
    };

    const receptionsGetRequest = {
      ...findReceptionsPath,
      ...findReceptionsQuery,
    };
    logger.info(
      `receptionsGetRequest: ${JSON.stringify(receptionsGetRequest)}`
    );
    // 受付情報が更新直後のため、JPから取得する
    const apiResponse = await sendApiRequest(
      getReceptionsServer,
      receptionsGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo),
      process.env.CART_SERVICE_JP
    );
    logger.info(`receptionsGetResponse: ${JSON.stringify(apiResponse)}`);
    if (!apiResponse.ok) {
      throw apiResponse;
    }
    const receptionGetResponse: ReceptionGetResponse = apiResponse.data;
    return receptionGetResponse;
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
}
