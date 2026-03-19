import { NextFunction, Request, Response } from "express";

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
  SMSConfig,
} from "~/src/components/const";
import {
  CallManagementGetResponse,
  CallManagementGetRequest,
  ReceptionEventsPostRequest,
  ReceptionGetRequest,
  ReceptionGetResponse,
  ReceptionInformation,
  ReceptionInformationSearchRequest,
  ReceptionInformationSearchResponse,
} from "~/src/clients/carts/cartsClientTypes";
import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { ApplicationError, ResourceNotFoundError, ValidationError } from "~/src/components/errors";
import { components,operations  } from "~/src/interfaces/root";
import { EventCode, SubEventCode } from "~/src/components/eventCode";
import {
  getCallingMessage,
  getCallingSoonMessage,
} from "~/src/utils/createMessage";
import { SMSNotifier } from "~/src/utils/fetchService4SMS";
import { getCountryTimeZone, getStoreTimeZone } from "~/src/utils/getTimeZone";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import { StoreStaffErrorCode } from "~/src/components/errorCode";
import { ApiResponse } from "openapi-typescript-fetch";
import {
  filterReceptionsByCallingLine,
  getProcessLineType,
  filterWaitingReceptions,
  ProcessLineType,
  getCurrentAvailableLine,
} from "~/src/utils/receptionUtils";

/**
 * 呼出ステータス更新API
 */
@injectable()
export class CallingStatusUpdatePresenter
  implements ICallingStatusUpdatePresenter
{
  /**
   * 呼出ステータス更新
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
      const path = req.params as operations['putCallingStatus']['parameters']['path'];
      // 対象の呼出状態
      const allowedCallingStatus: (string | undefined)[] = [
        CallingStatus.WAITING,
        CallingStatus.CALLING,
        CallingStatus.IN_SERVICE,
        CallingStatus.NO_SHOW,
      ];
      if (!allowedCallingStatus.includes(path.callingStatusCode)) {
        // 呼出状態が対象外
        throw new ValidationError("Invalid callingStatus.");
      }

      // 受付情報取得
      const receptionInformation = await this.getReceptionInformation(
        dpfmRequestInfo,
        path.receptionNumber
      );
      if (receptionInformation == undefined) {
        // 受付情報が見つからないとき
        throw new ResourceNotFoundError(`There is no recode matched ${path.receptionNumber}.`);
      }

      // 受付キャンセルの場合
      if (receptionInformation.statusCode === ReceptionStatus.CANCEL) {
        throw new ApplicationError(
          StoreStaffErrorCode.BFF_USSTORESTAFF_0032,
          StoreStaffErrorCode.BFF_USSTORESTAFF_0032.message
        );
      }

      // 更新対象の受付ステータス
      const allowedReceptionStatus: (string | undefined)[] = [
        ReceptionStatus.MEASUREMENT,
        ReceptionStatus.REGISTERED,
        ReceptionStatus.ADJUSTMENT,
        ReceptionStatus.PAYMENT,
        ReceptionStatus.GENERAL_HELP,
      ];
      if (!allowedReceptionStatus.includes(receptionInformation.statusCode)) {
        // 受付情報の受付ステータスが、更新対象の受付ステータスではない時
        throw new ValidationError("The reception status is not applicable.");
      }

      // 更新する呼出ステータスを取得する
      const callingStatusCode = await this.getCallingStatus(
        dpfmRequestInfo,
        path.storeCode,
        receptionInformation,
        path.callingStatusCode
      );
      // 受付情報更新
      await this.updateReceptionInformation(
        dpfmRequestInfo,
        receptionInformation,
        callingStatusCode
      );

      // 事後処理
      switch (path.callingStatusCode) {
        case CallingStatus.CALLING:
          // 「呼出中」のメッセージを送信
          await this.sendCallingMessage(receptionInformation);
          break;
        case CallingStatus.IN_SERVICE:
          // 「もうすぐ呼出」になる受付の呼出ステータスを「もうすぐ呼出」に更新
          await this.markCallingSoonReceptions(
            dpfmRequestInfo,
            path.storeCode,
            receptionInformation
          );
          break;
      }

      const response: components["schemas"]["CallingStatusResponse"] = {
        callingStatusCode: path.callingStatusCode,
      };
      res.status(200).json(response);
      return;
    } catch (error) {
      next(error);
    }
  };

  /**
   * 呼出ステータスを取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @param calledReception 呼出済みとなった受付情報
   * @param callingStatus 呼出状態
   */
  private async getCallingStatus(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    receptionInformation: ReceptionInformation,
    callingStatus: string,
  ) {
    if(callingStatus == CallingStatus.WAITING) {
      // 「呼出待」が指定された場合は、「呼出待」か「まもなく呼び出し」かを決める
      const callingSoonReceptions = await this.findCallingSoonReceptions(
        dpfmRequestInfo,
        storeCode,
        receptionInformation,
      );
      return callingSoonReceptions.find(
        (reception) =>
          reception.receptionNumber === receptionInformation.receptionNumber
      )
        ? CallingStatus.SOON_CALL
        : CallingStatus.WAITING;
    }
    return callingStatus;
  }

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
        case CallingStatus.SOON_CALL:
          switch(receptionInformation.callingStatusCode) {
            case CallingStatus.WAITING:
              return undefined;
          }
      }

      switch (receptionInformation.statusCode) {
        case ReceptionStatus.MEASUREMENT:
          return EventCode.MEAS.CODE;
        case ReceptionStatus.REGISTERED:
          return EventCode.REGISTERED.CODE;
        case ReceptionStatus.ADJUSTMENT:
          return EventCode.ADJUSTMENT.CODE;
        case ReceptionStatus.PAYMENT:
          return EventCode.PAYMENT.CODE;
        case ReceptionStatus.GENERAL_HELP:
          return EventCode.GENERAL_HELP.CODE;
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
        case CallingStatus.WAITING:
        case CallingStatus.SOON_CALL:
          switch(receptionInformation.callingStatusCode) {
            case CallingStatus.WAITING:
              return undefined;
            case CallingStatus.NO_SHOW:
              return SubEventCode.UNDO;
            default:
              return SubEventCode.RESET;
          }
        case CallingStatus.CALLING:
          return undefined;
        case CallingStatus.IN_SERVICE:
          return SubEventCode.CALLING;
        case CallingStatus.NO_SHOW:
          return SubEventCode.ABSENCE;
      }
    };

    // 受付情報更新API呼び出し
    const receptionEventsPostRequest: ReceptionEventsPostRequest = {
      receptionNumber: receptionInformation.receptionNumber,
      callingStatusCode: callingStatus,
      eventCode: getEventCode(receptionInformation, callingStatus),
      subEventCode: getSubEventCode(receptionInformation, callingStatus),
    };
    logger.info(`postReceptionEventsRequest: ${JSON.stringify(receptionEventsPostRequest)}`);

    const apiResponse : ApiResponse<unknown> = await sendApiRequest(
      postReceptionEvents,
      receptionEventsPostRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`postReceptionEventsResponse: ${JSON.stringify(apiResponse)}`);

  }

  /**
   * 「呼出中」メッセージを送信する
   * @param receptionInformation 受付情報
   */
  private async sendCallingMessage(receptionInformation: ReceptionInformation) {
    const processLine = getProcessLineType(receptionInformation);
    const eyeExamProcessLine: (ProcessLineType | undefined)[] = [
      "Eye exam",
    ];
    const adjustmentProcessLine: (ProcessLineType | undefined)[] = [
      "No eye exam",
      "Adjustment",
    ];
    const isCallingMessageEnabled = (processLine: ProcessLineType | undefined) => {
     return (
       (eyeExamProcessLine.includes(processLine) && SMSConfig.eyeExamCallingMessageEnabled) ||
       (adjustmentProcessLine.includes(processLine) && SMSConfig.adjustmentCallingMessageEnabled)
     );
    }

    if (receptionInformation.phoneNumber != undefined && isCallingMessageEnabled(processLine)) {
      try {
        const smsnotifierUrl = process.env.SMS_NOTIFIER + "/smsnotifier/JINSUS";
        const callingMessage: string = getCallingMessage(
          receptionInformation.callingNumber!,
          receptionInformation.receptionNumber!
        );
        logger.info(`callingMessage: ${callingMessage}`);
        await SMSNotifier(
          smsnotifierUrl,
          callingMessage,
          receptionInformation.phoneNumber
        );
      } catch (error) {
        logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
        // SMS通知のエラーは無視して処理継続
      }
    }
  }

  /**
   * 「もうすぐ呼出」メッセージを送信する
   * @param receptionInformation 受付情報
   */
  private async sendCallingSoonMessage(receptionInformation: ReceptionInformation) {
    const processLine = getProcessLineType(receptionInformation);
    const eyeExamProcessLine: (ProcessLineType | undefined)[] = [
      "Eye exam",
    ];
    const adjustmentProcessLine: (ProcessLineType | undefined)[] = [
      "No eye exam",
      "Adjustment",
    ];
    const isCallingSoonMessageEnabled = (processLine: ProcessLineType | undefined) => {
     return (
       (eyeExamProcessLine.includes(processLine) && SMSConfig.eyeExamCallingSoonMessageEnabled) ||
       (adjustmentProcessLine.includes(processLine) && SMSConfig.adjustmentCallingSoonMessageEnabled)
     );
    }

    if (receptionInformation.phoneNumber != undefined && isCallingSoonMessageEnabled(processLine)) {
      try {
        const smsnotifierUrl = process.env.SMS_NOTIFIER + "/smsnotifier/JINSUS";
        const callingSoonMessage: string = getCallingSoonMessage(
          receptionInformation.receptionNumber!
        );
        logger.info(`callingSoonMessage: ${callingSoonMessage}`);
        await SMSNotifier(
          smsnotifierUrl,
          callingSoonMessage,
          receptionInformation.phoneNumber
        );
      } catch (error) {
        logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
        // SMS通知のエラーは無視して処理継続
      }
    }
  }

  /**
   * 指定された受付と工程列が同じ受付情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @param reception 受付情報 
   * @returns 受付情報[]
   */
  private getProcessLineReceptions = async (
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    reception: ReceptionInformation
  ) => {
    // 待ち状況を取得
    const receptions = await this.getWaitingReceptions(
      dpfmRequestInfo,
      storeCode,
      fixSystemDate(getCountryTimeZone())
    );
    // 待ち状況取得対象の受付に絞り込む
    const waitingReceptions = filterWaitingReceptions(receptions);
    // 自分の工程列と同じ受付に絞り込む
    return filterReceptionsByCallingLine(waitingReceptions, reception);
  }

  /**
   * 「もうすぐ呼出」となる受付を検索する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @param calledReception 呼出済みとなった受付情報
   */
  private async findCallingSoonReceptions(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    calledReception: ReceptionInformation,
  ) {
    const processLine = getProcessLineType(calledReception);
    const eyeExamProcessLine: (ProcessLineType | undefined)[] = [
      "Eye exam",
    ];

    // 呼出管理情報を取得
    const callManagementInfo = await this.getCallManagement(
      dpfmRequestInfo,
      storeCode
    );
    // 呼び出された受付と同じ工程列の受付を取得
    const processLineReceptions = await this.getProcessLineReceptions(
      dpfmRequestInfo,
      storeCode,
      calledReception
    );

    // 「もうすぐ呼出」となる受付は、呼び出された受付が
    // Eye examの場合、視力測定ライン数+1番目まで
    // それ以外の場合、先頭
    const endCallingSoonIndex = (eyeExamProcessLine.includes(processLine) && callManagementInfo) 
        ? getCurrentAvailableLine(callManagementInfo, getStoreTimeZone(dpfmRequestInfo.bffRequest)) ?? 0
      : 0;
    return processLineReceptions.slice(0, endCallingSoonIndex + 1);
  }

  /**
   * 「もうすぐ呼出」となる受付の呼出ステータスを更新する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @param calledReception 呼出済みとなった受付情報
   */
  private async markCallingSoonReceptions(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    calledReception: ReceptionInformation,
  ) {
    // 「もうすぐ呼出」の受付を探す
    const callingSoonReceptions = await this.findCallingSoonReceptions(
      dpfmRequestInfo,
      storeCode,
      calledReception,
    );
    for (const receptionInfo of callingSoonReceptions) {
      // 「もうすぐ呼出」となる受付が「呼出待」の時のみ実施
      if ([CallingStatus.WAITING].includes(receptionInfo.callingStatusCode!)) {
        // 「もうすぐ呼出」メッセージを送信する
        await this.sendCallingSoonMessage(receptionInfo);
        // 呼出ステータスを「もうすぐ呼出」に更新する
        await this.updateReceptionInformation(
          dpfmRequestInfo,
          receptionInfo,
          CallingStatus.SOON_CALL
        );
      }
    }
  }

  /**
   * 待ち状況を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @param registeredDate 受付情報の登録日
   * @returns 待ち状況
   */
  private async getWaitingReceptions(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    registeredDate: string,
  ) {
    // 待ち状況取得API呼び出し
    const receptionsGetRequest: ReceptionGetRequest = {
      storeCode: storeCode,
      registeredDate: registeredDate,
    };
    logger.info(`getReceptionsServerRequest: ${JSON.stringify(receptionsGetRequest)}`);

    // 受付情報が更新直後のため、JPから取得する
    const apiResponse : ApiResponse<ReceptionGetResponse>= await sendApiRequest(
      getReceptionsServer,
      receptionsGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo),
      process.env.CART_SERVICE_JP
    );

    logger.info(`getReceptionsServerResponse: ${JSON.stringify(apiResponse)}`);

    const receptionGetResponse = apiResponse.data;
    return receptionGetResponse.receptionInfos!;
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
}
