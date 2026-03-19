import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IReceptionsPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";

import { components, operations } from "~/src/interfaces/root";
import { components as cartsComponents } from "~/src/interfaces/clients/carts/cartsClient";
import { getReceptionsServer, getCallManagement } from "~/src/clients/carts/cartsClient";

import { components as salesOrderComponents } from "~/src/interfaces/clients/salesOrder/salesOrderClient";
import { getOrderByReceptionNumber } from "~/src/clients/salesOrder/salesOrderClient";

import { subHours } from "date-fns";

import {
  CallingStatus,
  LineType,
  ReceptionStatus,
  WaitingStatus,
  DeliveryStatus,
  customerStaffId,
} from "~/src/compornents/const";
import { fixDatetimeForFront, fixSystemDate, toUTCDateFromString } from "~/src/utils/fixDatetime";
import { getTimeOfToday } from "~/src/utils/datetimeUtils";
import { makeErrorResponse400 } from "~/src/utils/makeErrorResponse400";
import { isAfter, roundUpToNextMinute } from "~/src/utils/datetimeUtils";
import { getCountryTimeZone, getStoreTimeZone } from "~/src/utils/getTimeZone";
import { FindReceptionsPath, FindReceptionsQuery } from "~/src/clients/carts/cartsClientTypes";
import { ReceptionInfos } from "~/src/clients/carts/cartsClientTypes";
import { decryptText } from "~/src/utils/encryptText";
import { calcWaitingStatus } from "~/src/utils/calculateWaitingTime";

/**
 * 待ち状況取得
 */
@injectable()
export class ReceptionsPresenter
  extends BasePresenter
  implements IReceptionsPresenter
{
  /**
   * 待ち状況ステータスの取得
   * @param specifiedReceptionInfo リクエストされた受付番号の受付情報
   * @param waitingOrder 待ち順番
   * @param activeLine 稼働中視力測定ライン数
   * @returns 待ち状況ステータス
   */
  private getWaitingStatusCode = (
    specifiedReceptionInfo: cartsComponents["schemas"]["ReceptionInfos"],
    waitingOrder: number,
    activeLine: number,
  ): string | null => {
    if (!specifiedReceptionInfo.statusCode) {
      return null;
    }
    // 受付ステータス：測定or度数登録
    if ([
        ReceptionStatus.MEASUREMENT,
        ReceptionStatus.REGISTERED,
      ].includes(specifiedReceptionInfo.statusCode)
    ) {
      // 呼出状態から判定
      switch (specifiedReceptionInfo.callingStatusCode) {
        // 呼出待ち
        case CallingStatus.WATING:
          return waitingOrder <= activeLine + 1
            ? WaitingStatus.SOON_CALL
            : WaitingStatus.RECEPTION_COMPLETE;
        // 呼出中
        case CallingStatus.CALLING:
          return WaitingStatus.CALLED;
        // 対応中（呼出済）
        case CallingStatus.IN_SERVICE:
          return WaitingStatus.CALLED;
        // 不在
        case CallingStatus.NO_SHOW:
          return WaitingStatus.CALLED;
        default:
          return null;
      }
    // 受付ステータス：カート登録
    } else if (specifiedReceptionInfo.statusCode == ReceptionStatus.ORDER_NEW) {
      return WaitingStatus.CALLED;
    // 受付ステータス：キャンセル
    } else if (specifiedReceptionInfo.statusCode == ReceptionStatus.CANCEL) {
      return specifiedReceptionInfo?.callingStatusCode == CallingStatus.CANCEL
        ? WaitingStatus.RECEPTIONS_CANCEL : null;
    // 受付ステータス：会計or調整orGeneral help
    } else if ([
        ReceptionStatus.PAYMENT,
        ReceptionStatus.ADJUSTMENT,
        ReceptionStatus.GENERAL_HELP,
      ].includes(specifiedReceptionInfo.statusCode)
    ) {
      // 呼出状態から判定
      switch (specifiedReceptionInfo.callingStatusCode) {
        // 呼出待ち
        case CallingStatus.WATING:
          return WaitingStatus.RECEPTION_COMPLETE;
        // 呼出中
        case CallingStatus.CALLING:
          return WaitingStatus.CALLED;
        // 対応中（呼出済）
        case CallingStatus.IN_SERVICE:
          return WaitingStatus.CALLED;
        // 不在
        case CallingStatus.NO_SHOW:
          return WaitingStatus.CALLED;
        default:
          return null;
      }
    } else {
      return WaitingStatus.CALLED;
    }
  };

  /**
   * 注文詳細情報から待ち状況ステータスの取得
   * @param requestHeader
   * @param receptionNumber
   * @param itemGroupCode
   * @returns 待ち状況ステータス
   */
  private getWaitingStatusCodeByOrder = async (
    requestHeader: Headers,
    receptionNumber: string,
    itemGroupCode: string | undefined,
  ): Promise<string> => {

    if (!requestHeader.get("jins-trace-id-branch-no")) {
      // branch-noが必須のため、リクエストされてない場合は暫定で1をセット
      requestHeader.set("jins-trace-id-branch-no", "1");
    }
    // OMSの注文詳細取得API呼出
    logger.info(`getOrderByReceptionNumberRequest: ${JSON.stringify({receptionNumber: receptionNumber})}`);

    const orderResponse = await sendApiRequest(
      getOrderByReceptionNumber,
      {receptionNumber: receptionNumber},
      requestHeader,
    );

    logger.info(`getOrderByReceptionNumberResponse: ${JSON.stringify(orderResponse)}`);

    if (!orderResponse.ok) {
      throw orderResponse
    }

    // 注文詳細レスポンスのメガネ行情報を取得して待ち状況ステータスを判定
    const glassLines: salesOrderComponents["schemas"]["GlassLineHorizontalMixinReadDto"][]
      = orderResponse.data.glassLines;
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
   * 待ち状況取得処理
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
      requestHeader.set("jins-trace-id-branch-no", req.header("jins-trace-id-branch-no") ?? "");
      requestHeader.set("jins-user-id", customerStaffId);
      if (cursor) {
        requestHeader.set("X-Cursor", cursor);
      }
      const query : operations["getReceptions"]["parameters"]["query"] = req.query;
      const encryptionReceptionNumber = query?.encryptionReceptionNumber;
      const encryptionItemGroupCode = query?.encryptionItemGroupCode;

      let receptionNumber = encryptionReceptionNumber ? decryptText(encryptionReceptionNumber) : undefined;
      if(encryptionReceptionNumber && !receptionNumber) {
        const error = makeErrorResponse400(
          ["Invalid encryptionReceptionNumber."],
          req
        )
        res.status(400).json(error);
        return;
      }
      const itemGroupCode = encryptionItemGroupCode ? decryptText(encryptionItemGroupCode) : undefined;
      if(encryptionItemGroupCode && !itemGroupCode) {
        const error = makeErrorResponse400(
          ["Invalid encryptionItemGroupCode."],
          req
        )
        res.status(400).json(error);
        return;
      }
      // 商品グループコードのみ指定されている場合、商品グループコードから受付番号を作成
      if( itemGroupCode && !receptionNumber) {
        receptionNumber = itemGroupCode.replace(/-[0-9]*/, "")
      }

      // 待ち状況取得リクエストの設定
      const findReceptionsPath: FindReceptionsPath = {
        storeCode: req.params.storeCode,
      };
      const findReceptionsQuery: FindReceptionsQuery = {
        receptionNumber: receptionNumber,
        registeredDate: fixSystemDate(getCountryTimeZone()),
      };
      const receptionsGetRequest = {
        ...findReceptionsPath,
        ...findReceptionsQuery,
      };
      logger.info( `getReceptionsServerRequest: ${JSON.stringify(receptionsGetRequest)}`);

      // デジタル基盤層（待ち状況取得）APIを呼び出す
      const receptionsGetResponse = await sendApiRequest(
        getReceptionsServer,
        receptionsGetRequest,
        requestHeader,
        process.env.CART_SERVICE_JP
      );

      logger.info(`getReceptionsServerResponse: ${JSON.stringify(receptionsGetResponse)}`);

      if (!receptionsGetResponse.ok) {
        throw receptionsGetResponse;
      }
      const receptionsGetResponseData = receptionsGetResponse.data;

      // 呼出管理情報取得リクエストの設定
      interface CallManagementRequest {
        storeCode: string;
      }

      const callManagementGetRequest: CallManagementRequest = {
        storeCode: req.params.storeCode,
      };

      logger.info(`getCallManagementRequest: ${JSON.stringify(callManagementGetRequest)}`);

      // デジタル基盤層（呼出管理情報取得）APIを呼び出す
      const callManagementGetResponse = await sendApiRequest(
        getCallManagement,
        callManagementGetRequest,
        requestHeader
      );

      logger.info(`getCallManagementResponse: ${JSON.stringify(callManagementGetResponse)}`);

      if (!callManagementGetResponse.ok) {
        throw callManagementGetResponse;
      }
      const callManagementGetResponseData = callManagementGetResponse.data;

      // 現在日時を取得
      const currentTime = new Date();

      const receptionInfosData = receptionsGetResponseData.receptionInfos.filter(
        (receptionInfo: ReceptionInfos) => {
          const updatedDatetime = toUTCDateFromString(receptionInfo.updatedDatetime);
          return !(receptionInfo.callingStatusCode == CallingStatus.NO_SHOW && (updatedDatetime && subHours(currentTime, 1) > updatedDatetime))
        }
      )
      
      // リクエストした受付番号の受付情報を取得
      const callTime = new Date(currentTime); // 現在日時をコピー
      let waitingStatusCode: string | null = null;
      let specifiedReceptionInfo: cartsComponents["schemas"]["ReceptionInfos"];
      let isGetOrder = false;   //  注文詳細API呼出フラグ
      if (receptionNumber) {
        specifiedReceptionInfo = receptionsGetResponseData.receptionInfos.find(
          (receptionInfo: cartsComponents["schemas"]["ReceptionInfos"]) =>
            receptionInfo.receptionNumber == receptionNumber);
        if (!specifiedReceptionInfo) {
          throw makeErrorResponse400(["Specified data not found."], req);
        }

        // 商品グループコードがリクエストされ、かつ以下の受付ステータス時は注文詳細API呼出
        // 400:加工、500:商品受け渡し、801:注文完了、901:キャンセル済
        isGetOrder = !!itemGroupCode && !!specifiedReceptionInfo.statusCode &&
          [
            ReceptionStatus.PROCESSING,
            ReceptionStatus.PICK_UP,
            ReceptionStatus.ORDER_COMPLETE,
            ReceptionStatus.CANCELED,
          ]
          .includes(specifiedReceptionInfo.statusCode);

        // 待ち状況ステータスの取得
        waitingStatusCode = isGetOrder
          ? await this.getWaitingStatusCodeByOrder(
            requestHeader,
            String(receptionNumber),
            itemGroupCode)
          : this.getWaitingStatusCode(
            specifiedReceptionInfo,
            receptionInfosData.length,
            callManagementGetResponseData.callManagementInfo.availableLines,
          );
      }

      // 待ち時間範囲
      let [earliest, latest] = [0, 0];
      let [totalWaitTime, totalWaitPeople, totalOtherWaitPeople] = [0, 0, 0];

      // 注文詳細取得API呼出不要の場合、待ち時間を計算
      if (!isGetOrder) {
        const otherReceptionInfos = receptionInfosData.filter(
          (receptionInfo: cartsComponents["schemas"]["ReceptionInfos"]) =>
            receptionInfo.receptionNumber !== receptionNumber
        )

        // 測定待ち時間の計算
        const [waitTime, waitPeople, otherWaitPeople] = calcWaitingStatus(
          callManagementGetResponseData.callManagementInfo,
          otherReceptionInfos,
        );
        [totalWaitTime, totalWaitPeople, totalOtherWaitPeople] = [waitTime, waitPeople, otherWaitPeople];

        // 5分単位で切り上げる
        const roundUpToNext5Minutes = (number: number): number => {
          return Math.ceil(number / 5) * 5;
        };
        // 待ち時間範囲の設定
        const buffer = 5;
        [earliest, latest] = [
          roundUpToNext5Minutes(totalWaitTime),
          roundUpToNext5Minutes(totalWaitTime) + buffer];
      }

      // 呼出時間の設定
      callTime.setMinutes(currentTime.getMinutes() + earliest); // 現在の分に待ち時間加算

      // 受付終了フラグの設定
      // 本日の受付終了時刻
      const receptionCloseTime = getTimeOfToday(
        callManagementGetResponseData.callManagementInfo.receptionCloseTime,
        getStoreTimeZone(req)
      );
      const isReceptionClose = receptionCloseTime ? isAfter(currentTime, receptionCloseTime) : false;

      // レスポンスデータの加工
      const data: components["schemas"]["RcptInfoGetResponse"] = {
        waitTimeRange: isGetOrder ? null : {
          earliest: earliest,
          latest: latest,
        },
        callTime: isGetOrder ? null : fixDatetimeForFront(roundUpToNextMinute(callTime)),
        waitPeople: isGetOrder ? null : totalWaitPeople + totalOtherWaitPeople,
        waitingStatusCode: waitingStatusCode,
        callingNumber: receptionNumber ? specifiedReceptionInfo!.callingNumber : null,
        isReceptionClose: isReceptionClose,
        receptionNumber: receptionNumber,
        itemGroupCode: itemGroupCode,
      };

      res.status(200).send(data);

      return;
    } catch (error: any) {
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
      if (error.hasOwnProperty("details")
        && JSON.parse(error.details)?.hasOwnProperty("status")
        && JSON.parse(error.details)?.status == 400) {
        res.status(400).json(error.data);
      } else if(error.status === 404){
        res.status(400).send(error.data);
      }else{
        res.status(error.status).json(error.data);
      }
    }
  };
}
