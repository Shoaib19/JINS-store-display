import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import type { IReceptionsPresenter } from "~/src/presenters/interfaces";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { getReceptionsServer, getCallManagement } from "~/src/clients/carts/cartsClient";
import { getOrderByReceptionNumber } from "~/src/clients/salesOrder/salesOrderClient";
import {
  CallingStatus,
  ReceptionStatus,
  WaitingStatus,
  DeliveryStatus,
} from "~/src/components/const";
import { fixDatetimeForFront, fixSystemDate } from "~/src/utils/fixDatetime";
import { addMinutes, getTimeOfToday } from "~/src/utils/datetimeUtils";
import { isAfter, roundUpToNextMinute } from "~/src/utils/datetimeUtils";
import { getCountryTimeZone, getStoreTimeZone } from "~/src/utils/getTimeZone";
import {
  CallManagementGetRequest,
  CallManagementGetResponse,
  CallManagementInfo,
  ReceptionGetRequest,
  ReceptionGetResponse,
} from "~/src/clients/carts/cartsClientTypes";
import { ReceptionInfos } from "~/src/clients/carts/cartsClientTypes";
import { decryptText } from "~/src/utils/encryptText";
import {
  calcWaitingTime,
  filterReceptionsByProcessLine,
  getProcessLineType,
  filterWaitingReceptions,
  repairProcessLineTypes,
  filterReceptionsByCallingLine,
} from "~/src/utils/receptionUtils";
import { GlassLineHorizontalMixinReadDto, OrderGetResponse } from "~/src/clients/salesOrder/salesOrderClientTypes";
import { ApiResponse } from "openapi-typescript-fetch";
import { DpfmRequestInfo, generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";
import { components, operations } from "~/src/interfaces/root";
import { ValidationError } from "~/src/components/errors";

// 待ち状況取得APIレスポンス
type RcptInfoGetResponse = components["schemas"]["RcptInfoGetResponse"];
// 受付待ち時間範囲
type WaitTimeRange = RcptInfoGetResponse["waitTimeRange"];

/**
 * 待ち状況取得
 */
@injectable()
export class ReceptionsPresenter
  implements IReceptionsPresenter
{
  /**
   * 受付待ち時間範囲取得
   * @param callManagementInfo 呼び出し管理情報
   * @param timezone タイムゾーン
   * @param beforeReceptions 受付情報
   * @returns [受付待ち時間範囲, 呼び出し時間, 待ち人数]
   */
  private calcWaitTimeRange = (
    callManagementInfo: CallManagementInfo,
    timezone: string,
    beforeReceptions: ReceptionInfos[],
  ): WaitTimeRange => {
    // 測定待ち時間の計算
    const waitTime = calcWaitingTime(callManagementInfo, timezone, beforeReceptions);

    // 5分単位で切り上げる
    const roundUpToNext5Minutes = (number: number) => {
      return Math.ceil(number / 5) * 5;
    };

    // 待ち時間範囲の設定
    const buffer = 5;
    const earliest = roundUpToNext5Minutes(waitTime);

    const waitTimeRange: WaitTimeRange = {
      earliest: earliest,
      latest: earliest + buffer,
    };
    return waitTimeRange;
  };

  /**
   * 呼び出し時刻取得
   * @param waitTimeRange 
   * @param now 
   * @returns 
   */
  private getCallTime = (waitTimeRange: WaitTimeRange, now: Date) => {
    return waitTimeRange
      ? roundUpToNextMinute(addMinutes(now, waitTimeRange.earliest!))
      : null;
  };

  /**
   * 受付終了判定
   * @param callManagementInfo 呼び出し管理情報
   * @param timezone タイムゾーン
   * @param now 現在時刻
   * @returns true:受付終了、false:受付中
   */
  private isReceptionClose = (
    callManagementInfo: CallManagementInfo,
    timezone: string,
    now: Date
  ) => {
    // 本日の受付終了時刻
    const receptionCloseTime = getTimeOfToday(
      callManagementInfo?.receptionCloseTime,
      timezone
    );
    return receptionCloseTime ? isAfter(now, receptionCloseTime) : false;
  };

  /**
   * 待ち状況ステータスの取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param callManagementInfo 呼び出し管理情報
   * @param storeCode 店舗コード
   * @param receptions 受付情報[]
   * @param specifiedReceptionInfo 対象の受付
   * @returns [待ち状況ステータス, 受付待ち時間範囲, 修理待ち人数]
   */
  private getWaitingStatusByReception = async (
    dpfmRequestInfo: DpfmRequestInfo,
    callManagementInfo: CallManagementInfo,
    storeCode: string,
    receptions: ReceptionInfos[],
    specifiedReceptionInfo: ReceptionInfos,
  ): Promise<[string|null, WaitTimeRange, number|null]> => {
    /**
     * 待ち状況ステータスの取得
     * @param callingStatusCode 呼出ステータスコード
     * @returns 待ち状況ステータス
     */
    const getWaitingStatusCode = (
      callingStatusCode: string,
    ) => {
      switch (callingStatusCode) {
        // 呼出待ち
        case CallingStatus.WAITING:
          return  WaitingStatus.RECEPTION_COMPLETE;
        // まもなく呼び出し
        case CallingStatus.SOON_CALL:
          return  WaitingStatus.SOON_CALL;
        // 呼出中
        case CallingStatus.CALLING:
          return WaitingStatus.CALLED;
        // 対応中（呼出済）
        case CallingStatus.IN_SERVICE:
          return WaitingStatus.CALLED;
        // 不在
        case CallingStatus.NO_SHOW:
          return WaitingStatus.CALLED;
      }
      return null;
    };
    /**
     * 待ち状況を表示するかの判定
     * @param reception 受付情報
     * @returns true：表示する、false：表示しない
     */
    const isShowWaitInfo = (reception: ReceptionInfos) => {
      // waitTimeRange/waitPeopleを設定する呼出ステータス
      const showWaitInfoCallingStatus: (string | undefined)[] = [
        CallingStatus.WAITING,
        CallingStatus.SOON_CALL,
      ];
      return showWaitInfoCallingStatus.includes(reception.callingStatusCode);
    };
    /**
     * 対象の受付より前の工程列の呼出待ちの受付を取得
     * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
     * @param storeCode 店舗コード
     * @param receptions 受付情報[]
     * @param specifiedReceptionInfo 対象の受付情報
     * @returns 受付情報[]
     */
    const getEarlierWaitingReceptions = (
      receptions: ReceptionInfos[],
      specifiedReceptionInfo: ReceptionInfos
    ) => {
      // 待ち状況取得対象の受付に絞り込む
      const waitingReceptions = filterWaitingReceptions(receptions);
      // 自分の工程列と同じ受付に絞り込む
      const processLineReceptions = filterReceptionsByCallingLine(
        waitingReceptions,
        specifiedReceptionInfo
      );
      // 指定された受付番号を除外
      return processLineReceptions.filter(
        (reception) =>
          reception.receptionNumber !== specifiedReceptionInfo.receptionNumber
      );
    };

    if (!specifiedReceptionInfo.statusCode) {
      // 受付ステータス不正
      return [null, null, null];
    }
    if (specifiedReceptionInfo.statusCode == ReceptionStatus.CANCEL) {
      // 受付キャンセル
      const waitingStatusCode =
        specifiedReceptionInfo?.callingStatusCode == CallingStatus.CANCEL
          ? WaitingStatus.RECEPTIONS_CANCEL
          : null;
      return [waitingStatusCode, null, null];
    }

    // 工程列を取得
    const processLineType = getProcessLineType(specifiedReceptionInfo);
    if (processLineType === "Eye exam") {
      // Eye exam(Prescription)列
      // 待ち状況を取得する場合は、指定された受付より前の受付を取得
      const earlierReceptions = isShowWaitInfo(specifiedReceptionInfo)
        ? getEarlierWaitingReceptions(receptions, specifiedReceptionInfo)
        : [];
      const waitingStatusCode = getWaitingStatusCode(
        specifiedReceptionInfo.callingStatusCode!,
      );
      const waitTimeRange = isShowWaitInfo(specifiedReceptionInfo)
        ? this.calcWaitTimeRange(callManagementInfo, getStoreTimeZone(dpfmRequestInfo.bffRequest), earlierReceptions)
        : null;
      return [waitingStatusCode, waitTimeRange, null];
    } else if (processLineType === "Cart") {
      // Cart列
      return [WaitingStatus.CALLED, null, null];
    } else if (
      processLineType === "No eye exam" ||
      processLineType === "Adjustment"
    ) {
      // No eye exam/Adjustment列
      // 待ち状況を取得する場合は、指定された受付より前の受付を取得
      const earlierReceptions = isShowWaitInfo(specifiedReceptionInfo)
        ? getEarlierWaitingReceptions(receptions, specifiedReceptionInfo)
        : [];
      const waitingStatusCode = getWaitingStatusCode(
        specifiedReceptionInfo.callingStatusCode!,
      );
      const waitPeople = isShowWaitInfo(specifiedReceptionInfo)
        ? earlierReceptions.length
        : null;
      return [waitingStatusCode, null, waitPeople];
    } else if (processLineType === "Payment") {
      // Payment列
      // 待ち状況を取得する場合は、指定された受付より前の会計の受付を取得
      const earlierReceptions = isShowWaitInfo(specifiedReceptionInfo)
        ? await this.getEarlierWaitingPaymentReceptions(
            dpfmRequestInfo,
            storeCode,
            specifiedReceptionInfo
          )
        : [];
      const waitingStatusCode = getWaitingStatusCode(
        specifiedReceptionInfo.callingStatusCode!,
      );
      const waitPeople = isShowWaitInfo(specifiedReceptionInfo)
        ? earlierReceptions.length
        : null;
      return [waitingStatusCode, null, waitPeople];
    } else {
      return [WaitingStatus.CALLED, null, null];
    }
  };

  /**
   * 注文詳細情報から待ち状況ステータスの取得
   * @param dpfmRequestInfo - デジタル基盤へのリクエスト情報
   * @param receptionNumber - 受付番号
   * @param itemGroupCode - 商品グループコード
   * @returns 待ち状況ステータス
   */
  private getWaitingStatusCodeByOrder = async (
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string,
    itemGroupCode: string | undefined,
  ): Promise<string> => {

    // OMSの注文詳細取得API呼出
    logger.info(`getOrderByReceptionNumberRequest: ${JSON.stringify({receptionNumber: receptionNumber})}`);

    const apiResponse: ApiResponse<OrderGetResponse> = await sendApiRequest(
      getOrderByReceptionNumber,
      {receptionNumber: receptionNumber},
      makeDpfmRequestHeader(dpfmRequestInfo),
    );

    logger.info(`getOrderByReceptionNumberResponse: ${JSON.stringify(apiResponse)}`);

    const orderGetResponse = apiResponse.data

    // 注文詳細レスポンスのメガネ行情報を取得して待ち状況ステータスを判定
    const glassLines: GlassLineHorizontalMixinReadDto[] | undefined
      = orderGetResponse.glassLines;
    if (Array.isArray(glassLines) && glassLines.length > 0) {

      // メガネ行情報を取得
      const glassLine = glassLines.find((glass) => glass.itemGroupCode == itemGroupCode);

      if (glassLine && glassLine?.delivery) {
        // お渡しステータスによる判定
        switch (glassLine!.delivery!.deliveryStatus) {
          // お渡し準備完了、お渡し完了は005:受け渡し準備完了
          case DeliveryStatus.READY_FOR_DELIVERY:
          case DeliveryStatus.DELIVERED:
            return WaitingStatus.READY_FOR_DELIVERY;
          // キャンセル済は004:受付キャンセル
          case DeliveryStatus.DELIVERY_CANCELED:
            return WaitingStatus.RECEPTIONS_CANCEL;
        }
      }
    }
    // 以外は全て003:呼び出し済み
    return WaitingStatus.CALLED;
  };

  /**
   * 受付情報取得
   * @param dpfmRequestInfo - デジタル基盤へのリクエスト情報
   * @param storeCode - 店舗コード
   * @param receptionNumber - 受付番号
   * @returns 受付情報[]
   */
  private getReceptions = async (
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    receptionNumber?: string
  ): Promise<ReceptionInfos[]> => {
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

    return apiResponse.data.receptionInfos!;
  };

  /**
   * 呼出管理情報取得
   * @param dpfmRequestInfo - デジタル基盤へのリクエスト情報
   * @param storeCode - 店舗コード
   * @returns 呼び出し管理情報
   */
  private getCallManagementInfo = async (
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string
  ): Promise<CallManagementInfo> => {
    // 呼出管理情報取得リクエストの設定
    const callManagementGetRequest: CallManagementGetRequest = {
      storeCode: storeCode,
    };
    logger.info(`getCallManagementRequest: ${JSON.stringify(callManagementGetRequest)}`);

    // デジタル基盤層（呼出管理情報取得）APIを呼び出す
    const apiResponse: ApiResponse<CallManagementGetResponse> = await sendApiRequest(
        getCallManagement,
        callManagementGetRequest,
        makeDpfmRequestHeader(dpfmRequestInfo),
        process.env.CART_SERVICE_JP
      );

    logger.info(`getCallManagementResponse: ${JSON.stringify(apiResponse)}`);

    return apiResponse.data.callManagementInfo!;
  };

  /**
   * 受付より前の会計列の待ち受付を取得
   * @param dpfmRequestInfo - デジタル基盤へのリクエスト情報
   * @param storeCode - 店舗コード
   * @param specifiedReceptionInfo 対象の受付
   * @returns 受付情報[]
   */
  private getEarlierWaitingPaymentReceptions = async (
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    specifiedReceptionInfo: ReceptionInfos,
  ) => {
    const receptions = await this.getReceptions(dpfmRequestInfo, storeCode);
    // 待ち状況取得対象の受付に絞り込む
    const waitingReceptions = filterWaitingReceptions(receptions);
    // 自分の工程列と同じ受付に絞り込む
    const paymentProcessLineReceptions = filterReceptionsByCallingLine(
      waitingReceptions,
      specifiedReceptionInfo
    );
    // 受付情報を更新日時の昇順に並べ替える
    const sortedReceptions = paymentProcessLineReceptions.sort((a, b) =>
      a.updatedDatetime!.localeCompare(b.updatedDatetime!)
    );
    // 指定された受付より前の受付を取り出す
    const receptionIndex = sortedReceptions.findIndex(
      (reception) =>
        reception.receptionNumber === specifiedReceptionInfo.receptionNumber
    );
    return receptionIndex < 0
      ? sortedReceptions
      : sortedReceptions.slice(0, receptionIndex);
  }

  /**
   * 受付から待ち状況を取得
   * @param callManagementInfo 呼び出し管理情報
   * @param now 現在時刻
   * @param isReceptionClose 受付終了
   * @param storeCode 店舗コード
   * @param receptions 受付情報[]
   * @param specifiedReceptionInfo 対象の受付
   * @param itemGroupCode 対象の商品グループコード
   * @returns 待ち状況取得APIレスポンス
   */
  private getRcptInfoByReception = async(
    dpfmRequestInfo: DpfmRequestInfo,
    callManagementInfo: CallManagementInfo,
    now: Date,
    isReceptionClose: boolean,
    storeCode: string,
    receptions: ReceptionInfos[],
    specifiedReceptionInfo: ReceptionInfos,
    itemGroupCode: string | undefined
  ): Promise<RcptInfoGetResponse> => {
    const [waitingStatusCode, waitTimeRange, waitPeople] =
      await this.getWaitingStatusByReception(
        dpfmRequestInfo,
        callManagementInfo,
        storeCode,
        receptions,
        specifiedReceptionInfo
      );
    const callTime = this.getCallTime(waitTimeRange, now);

    const rcptInfo: RcptInfoGetResponse = {
      waitTimeRange: waitTimeRange,
      callTime: fixDatetimeForFront(callTime),
      waitPeople: waitPeople,
      waitingStatusCode: waitingStatusCode,
      callingNumber: specifiedReceptionInfo.callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: specifiedReceptionInfo.receptionNumber!,
      itemGroupCode: itemGroupCode,
    };
    return rcptInfo;
  };

  /**
   * 注文済みの受付から待ち状況取得
   * @param dpfmRequestInfo - デジタル基盤へのリクエスト情報
   * @param isReceptionClose 受付終了
   * @param specifiedReceptionInfo 対象の受付
   * @param itemGroupCode 対象の商品グループコード
   * @returns 待ち状況取得APIレスポンス
   */
  private getRcptInfoByOrder = async (
    dpfmRequestInfo: DpfmRequestInfo,
    isReceptionClose: boolean,
    specifiedReceptionInfo: ReceptionInfos,
    itemGroupCode: string
  ): Promise<RcptInfoGetResponse> => {
    const receptionNumber = specifiedReceptionInfo.receptionNumber!;
    const waitingStatusCode = await this.getWaitingStatusCodeByOrder(
      dpfmRequestInfo,
      receptionNumber,
      itemGroupCode
    );
    // レスポンスデータの加工
    const rcptInfo: RcptInfoGetResponse = {
      waitTimeRange: null,
      callTime: null,
      waitPeople: null,
      waitingStatusCode: waitingStatusCode,
      callingNumber: specifiedReceptionInfo.callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
      itemGroupCode: itemGroupCode,
    };
    return rcptInfo; 
  };

  /**
   * 待ち状況取得（Web受付）
   * @param callManagementInfo 呼び出し管理情報
   * @param timezone タイムゾーン
   * @param now 現在時刻
   * @param isReceptionClose 受付終了
   * @param receptions 受付
   * @returns 待ち状況取得APIレスポンス
   */
  private getRcptInfoForDashboard = (
    callManagementInfo: CallManagementInfo,
    timezone: string,
    now: Date,
    isReceptionClose: boolean,
    receptions: ReceptionInfos[]
  ) => {

    // 待ち状況取得対象の受付に絞り込む
    const waitingReceptions = filterWaitingReceptions(receptions);

    const waitTimeRange = this.calcWaitTimeRange(
      callManagementInfo,
      timezone,
      waitingReceptions
    );
    const callTime = this.getCallTime(waitTimeRange, now);
    const waitPeople = filterReceptionsByProcessLine(waitingReceptions, repairProcessLineTypes).length;

    const rcptInfo: RcptInfoGetResponse = {
      waitTimeRange: waitTimeRange,
      callTime: fixDatetimeForFront(callTime),
      waitPeople: waitPeople,
      waitingStatusCode: null,
      callingNumber: null,
      isReceptionClose: isReceptionClose,
      receptionNumber: undefined,
      itemGroupCode: undefined,
    };
    return rcptInfo;
  };

  /**
   * 待ち状況取得処理
   * @param req - Request
   * @param res - Response
   * @param next - NextFunction
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      /**
       * 注文確定（会計済み）された受付かを判定
       * @param reception 受付情報
       * @returns true：注文確定済み false：注文確定前
       */
      const isOrdered = (reception?: ReceptionInfos) => {
        // 400:加工、500:商品受け渡し、801:注文完了、901:キャンセル済
        const orderedStatuses: (string | undefined)[] = [
          ReceptionStatus.PROCESSING,
          ReceptionStatus.PICK_UP,
          ReceptionStatus.ORDER_COMPLETE,
          ReceptionStatus.CANCELED,
        ];
        return orderedStatuses.includes(reception?.statusCode);
      };

      const dpfmRequestInfo = generateDpfmRequestInfo(req);

      const query: operations["getReceptions"]["parameters"]["query"] = req.query;
      const path = req.params as operations["getReceptions"]["parameters"]["path"];
      const encryptionReceptionNumber = query?.encryptionReceptionNumber;
      const encryptionItemGroupCode = query?.encryptionItemGroupCode;

      let receptionNumber = encryptionReceptionNumber ? decryptText(encryptionReceptionNumber) : undefined;
      if (encryptionReceptionNumber && !receptionNumber) {
        throw new ValidationError("Invalid encryptionReceptionNumber.");
      }
      const itemGroupCode = encryptionItemGroupCode ? decryptText(encryptionItemGroupCode) : undefined;
      if (encryptionItemGroupCode && !itemGroupCode) {
        throw new ValidationError("Invalid encryptionItemGroupCode.");
      }
      // 商品グループコードのみ指定されている場合、商品グループコードから受付番号を作成
      if (itemGroupCode && !receptionNumber) {
        receptionNumber = itemGroupCode.replace(/-[0-9]*/, "");
      }

      // 受付情報を取得
      const receptions = await this.getReceptions(
        dpfmRequestInfo,
        path.storeCode,
        receptionNumber
      );
      // 呼出管理情報取得
      const callManagementInfo = await this.getCallManagementInfo(
        dpfmRequestInfo,
        path.storeCode
      );

      // 現在日時を取得
      const now = new Date();
      const isReceptionClose = this.isReceptionClose(
        callManagementInfo,
        getStoreTimeZone(req),
        now
      );

      if (receptionNumber) {
        const specifiedReceptionInfo = receptions.find(
          (receptionInfo) => receptionInfo.receptionNumber == receptionNumber
        );
        if (!specifiedReceptionInfo) {
          throw new ValidationError("Invalid encryptionItemGroupCode.");
        }

        if (itemGroupCode && isOrdered(specifiedReceptionInfo)) {
          // 注文情報からレスポンスを取得
          const rcptInfo = await this.getRcptInfoByOrder(
            dpfmRequestInfo,
            isReceptionClose,
            specifiedReceptionInfo,
            itemGroupCode
          );
          res.status(200).send(rcptInfo);
          return;
        } else {
          // 受付情報からレスポンスを取得
          const rcptInfo = await this.getRcptInfoByReception(
            dpfmRequestInfo,
            callManagementInfo,
            now,
            isReceptionClose,
            path.storeCode,
            receptions,
            specifiedReceptionInfo,
            itemGroupCode
          );
          res.status(200).send(rcptInfo);
          return;
        }
      } else {
        // web受付用のレスポンス
        const rcptInfo = this.getRcptInfoForDashboard(
          callManagementInfo,
          getStoreTimeZone(req),
          now,
          isReceptionClose,
          receptions
        );
        res.status(200).send(rcptInfo);
        return;
      }
    } catch (error) {
      next(error);
    }
  };

}
