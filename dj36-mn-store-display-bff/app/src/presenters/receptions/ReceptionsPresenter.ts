import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IReceptionsPresenter } from "~/src/presenters/interfaces";
import { getReceptionsServer } from "~/src/clients/receptions/receptionsClient";

import { getCallManagement } from "~/src/clients/callManagement/callManagementClient";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";

import { components as components } from "~/src/interfaces/root";
import { calcWaitingStatus } from "~/src/utils/calculateWaitingTime";

import {
  CallingStatus,
  LineType,
  ReceptionStatus,
  WaitingStatus,
  VisitingPurpose,
  customerIssueCode,
  SortOrder,
  HEADERS,
  BUFFER_MIN,
  MAX_WAIT_TIME,
  DEFAULT_STORE_TIME_ZONE,
  RegistrationMethod,
} from "~/src/compornents/const";
import { fixDatetimeForFront, fixSystemDate } from "~/src/utils/fixDatetime";
import {
  getTimeOfToday,
  isAfter,
  getCurrentTimeInTimeZone,
} from "~/src/utils/datetimeUtils";
import { getCountryTimeZone, getStoreTimeZone } from "~/src/utils/getTimeZone";

const { CHANGE_LENS, CANT_SEE_CLEAR, STRONG_PRESCRIPTION } = customerIssueCode;
const { JINS_TRACE_ID, JINS_USER_ID, JINS_TRACE_ID_BRANCH_NO } = HEADERS;
const { MEASUREMENT, MANUAL_ENTER } = RegistrationMethod;
type ReceptionApiResponse = {
  ok: boolean;
  data: components["schemas"]["ReceptionInfos"];
};

type ReceptionApiErrorResponse = {
  ok: boolean;
  data: components["schemas"]["RcptInfoErrorResponse"];
};

type ReceptionUnionResponse = ReceptionApiResponse | ReceptionApiErrorResponse;
@injectable()
export class ReceptionsPresenter
  extends BasePresenter
  implements IReceptionsPresenter
{
  /**
   * 受付記録に基づいて分類されたキュー配列 (呼び出し中、呼び出された、待機中) を作成します。
   *
   * 1. キュー条件 (lineType + 目的) を満たさない受付を除外します。
   * 2. 受付をステータス別に分類します (CALLED、CALLING、WAITING)。
   * 3. 各カテゴリを並べ替え、重複を排除し、設定された数のレコードに制限します。
   *
   * @param receptionsGetResponseData - 受付情報レコードの配列
   * @returns ソートされ重複が排除されたキュー項目をそれぞれ含むタプル [呼び出し中、呼び出された、待機中]
   */

  private populatingQueueInfo = (
    receptionsGetResponseData: components["schemas"]["ReceptionInfos"][],
  ): [
    components["schemas"]["queueAttribs"][],
    components["schemas"]["queueAttribs"][],
    components["schemas"]["queueAttribs"][],
  ] => {
    // 各カテゴリの一時配列
    const inCallTemp: components["schemas"]["queueAttribs"][] = [];
    const noShowTemp: components["schemas"]["queueAttribs"][] = [];
    const waitingTemp: components["schemas"]["queueAttribs"][] = [];

    const today = fixSystemDate(getCountryTimeZone());
    // 許可されるタイプ
    const allowedLineTypes = [LineType.MAIN_MEASUREMENT];

    // 条件を満たさない受信を除外する
    receptionsGetResponseData.forEach((reception) => {
      const lineType = reception.callingNumber?.substring(0, 1);
      // 要素のフォーマット
      const queueItem: components["schemas"]["queueAttribs"] = {
        callingNumber: reception.callingNumber,
        registeredDate: reception.registeredDate,
        updatedDatetime: reception.updatedDatetime,
        registeredDatetime: reception.registeredDatetime,
      };
      // すべてのカテゴリーに共通の基準
      if ( reception.registeredDate === today && reception.statusCode &&
        [ReceptionStatus.MEASUREMENT, ReceptionStatus.REGISTERED].includes(reception.statusCode) &&
        allowedLineTypes.includes(lineType!)
      ) 
      {
        switch (reception.callingStatusCode) {
          // キューを状態ステータスコードに基づいて分類する
          case CallingStatus.CALLING:
            if ((lineType == LineType.MAIN_MEASUREMENT && reception.prescriptionRegistCode == MEASUREMENT.CODE && this.queueAssignCondition(reception))) {
              inCallTemp.push(queueItem);
            }
            break;
          case CallingStatus.NO_SHOW:
            if ((lineType == LineType.MAIN_MEASUREMENT && reception.prescriptionRegistCode == MEASUREMENT.CODE && this.queueAssignCondition(reception))) {
              noShowTemp.push(queueItem);
            }
            break;
          case CallingStatus.WAITING:
            if (lineType == LineType.MAIN_MEASUREMENT && reception.prescriptionRegistCode == MEASUREMENT.CODE && this.queueAssignCondition(reception)) {
              waitingTemp.push(queueItem);
            }
            break;
        }
      }
    });

    // 重複があれば並べ替えて削除する
    let waiting = this.sortAndRemoveDuplicate(waitingTemp, SortOrder.ASC, 5, 'waiting');
    let called = this.sortAndRemoveDuplicate(noShowTemp, SortOrder.DESC, 10, 'called');
    let calling = this.sortAndRemoveDuplicate(inCallTemp, SortOrder.DESC, 1, 'calling');


    logger.info(
      `Final called count=${called.length}, waiting count=${waiting.length}, calling count=${calling.length}`,
    );
    return [calling, called, waiting];
  };

  /**
   * 指定された受付がキュー割り当ての条件を満たしているかどうかを確認します。
   *
   * 条件:
   * 1. lineType が MAIN_MEASUREMENT の場合、受付が今日登録され、
   * 訪問目的コードが「010」(例: メイン測定) です。
   * または
   * 2. 訪問目的コードが「020」(例: 保証/交換)
   * で、 customerIssueCode が {「004」、「005」、「006」} のいずれかである場合。
   *
   * @param reception - 評価する受信記録
   * @returns この受信が割り当ての対象となるかどうかを示すブール値
   */

  private queueAssignCondition = (
    reception: components["schemas"]["ReceptionInfos"],
  ) => {
    // すべてのカテゴリーに共通する条件
    return (reception.visitingPurposeCode == VisitingPurpose.MAKE_NEW_GLASSES ||
      (reception.visitingPurposeCode == VisitingPurpose.REPAIR &&
        reception.customerIssueCode &&
        [CHANGE_LENS, CANT_SEE_CLEAR, STRONG_PRESCRIPTION].includes(reception.customerIssueCode)))
  };

  /**
   * queueAttribs の配列を降順 (デフォルト) で並べ替え、callingNumber で重複を削除します。
   * オプションで昇順または降順で並べ替え直し、最終結果を制限します。
   *
   * @param receptions - 処理するキュー項目の配列
   * @param finalSortOrder - 最終的な並べ替え順序を示す「asc」または「desc」のいずれか
   * @param limit - 重複排除後に返されるアイテムの最大数
   * @returns ソートされ、重複が排除され、制限されたキュー項目の新しい配列
   */
  private sortAndRemoveDuplicate = (
    receptions: components["schemas"]["queueAttribs"][],
    finalSortOrder: string,
    limit: number,
    type: string,
  ): components["schemas"]["queueAttribs"][] => {
    // callingNumber で重複を排除 => 最初の出現 (最新のレコード) を保持
    const seen = new Set<string>();
    const deduplicated: components["schemas"]["queueAttribs"][] = [];
    for (const reception of receptions) {
      const key = reception.callingNumber ?? "";
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(reception);
      }
    }
    logger.info(
      `After deduplication, deduplicated length=${deduplicated.length}`,
    );

    // 重複排除されたリストをfinalSortOrderに従って再ソートする
    deduplicated.sort((rcptA, rcptB) => {
      const aTime = new Date(type === 'waiting' ? rcptA.registeredDatetime! : rcptA.updatedDatetime!).getTime();
      const bTime = new Date(type === 'waiting' ? rcptB.registeredDatetime! : rcptB.updatedDatetime!).getTime();

      return finalSortOrder === SortOrder.ASC ? aTime - bTime : bTime - aTime;
    });

    return deduplicated.slice(0, limit);
  };

  /**
   * 次の情報に基づいて、特定の受付記録の待機ステータス コードを決定します:
   * - 受付のステータス (例: MEASUREMENT、REGISTERED、ORDER_NEW)
   * - 呼び出しステータス (例: NONE、WATING、CALLING)
   * - 全体の待機順序とアクティブ回線の数
   *
   * @param specifiedReceptionInfo - 待機状態を判断する受付記録
   * @param waitingOrder - 全体の待ち行列における受付の位置
   * @param activeLine - 有効な測定ラインの数
   * @returns 待機ステータス コード文字列 (例: 'CALLED'、'SOON_CALL')、または該当しない場合は null
   */
  private getWaitingStatusCode = (
    specifiedReceptionInfo: components["schemas"]["ReceptionInfos"],
    waitingOrder: number,
    activeLine: number,
  ): string | null => {
    // まず、受信のステータスが認識された測定/登録ステータスの1つであるかどうかを確認します
    if (
      specifiedReceptionInfo.statusCode &&
      [
        ReceptionStatus.MEASUREMENT,
        ReceptionStatus.REGISTERED,
        ReceptionStatus.ORDER_NEW,
      ].includes(specifiedReceptionInfo.statusCode)
    ) {
      // 最終的な待機ステータスを決定するために、callingStatusCode を評価します
      switch (specifiedReceptionInfo.callingStatusCode) {
        case CallingStatus.NONE:
          return WaitingStatus.CALLED;
        case CallingStatus.WAITING:
          return waitingOrder <= activeLine + 1
            ? WaitingStatus.SOON_CALL
            : WaitingStatus.RECEPTION_COMPLETE;
        case CallingStatus.CALLING:
          return WaitingStatus.CALLED;
        case CallingStatus.IN_SERVICE:
          return WaitingStatus.CALLED;
        case CallingStatus.CANCEL:
          return WaitingStatus.RECEPTIONS_CANCEL;
        case CallingStatus.NO_SHOW:
          return WaitingStatus.CALLED;
        default:
          return null;
      }
    } else {
      // 受信のステータスコードが認識されない場合はnullを返す
      return null;
    }
  };

  /**
   * 受付待ちステータス情報を取得して収集します。
   * @param storeCode - 弦
   * @param receptionNumber - 弦
   * @returns Promise<components['schemas']['RcptInfoResponse']>
   */

  private recectionApi = async (
    storeCode: string,
    requestHeaders: Headers,
    receptionNumber?: string,
  ): Promise<ReceptionUnionResponse> => {
    // 受付APIのリクエストを作成する
    interface ReceptionsGetRequest {
      storeCode: string;
      receptionNumber?: string;
      registeredDate: string;
    }

    const receptionsGetRequest: ReceptionsGetRequest = {
      storeCode: storeCode,
      receptionNumber: receptionNumber ? String(receptionNumber) : undefined,
      registeredDate: fixSystemDate(getCountryTimeZone()),
    };

    logger.info(
      `receptionsGetRequest: ${JSON.stringify(receptionsGetRequest)}`,
    );

    // 受付APIを呼び出す
    const receptionsGetResponse = (await sendApiRequest(
      getReceptionsServer,
      receptionsGetRequest,
      requestHeaders,
      process.env.CART_SERVICE_US,
    )) as ReceptionUnionResponse;

    logger.info(
      `receptionsGetResponse: ${JSON.stringify(receptionsGetResponse)}`,
    );

    return receptionsGetResponse;
  };

  /**
   * 受付待ちステータス情報を取得して収集します。
   * @param storeCode - 弦
   * @param receptionNumber - 弦
   * @returns Promise<components['schemas']['RcptInfoResponse']>
   */
  public show = async (
    storeCode: string,
    receptionNumber?: string,
  ): Promise<
    | components["schemas"]["RcptInfoResponse"]
    | components["schemas"]["RcptInfoErrorResponse"]
  > => {
    try {
      // ヘッダー
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set(
        "jins-trace-id",
        process.env.JINS_TRACE_ID || JINS_TRACE_ID,
      );
      requestHeaders.set(
        "jins-user-id",
        process.env.JINS_USER_ID || JINS_USER_ID,
      );

      const receptionsGetResponse = await this.recectionApi(
        storeCode,
        requestHeaders,
        receptionNumber,
      );

      function isErrorResponse(
        response: ReceptionUnionResponse,
      ): response is ReceptionApiErrorResponse {
        return "code" in response.data;
      }

      let data:
        | components["schemas"]["RcptInfoResponse"]
        | components["schemas"]["RcptInfoErrorResponse"];

      // 応答がOKでない場合はエラーをスローします
      if (!receptionsGetResponse.ok) {
        throw receptionsGetResponse;
      } else if (isErrorResponse(receptionsGetResponse)) {
        return receptionsGetResponse.data;
      }

      // 通話管理APIリクエストを構築して呼び出す
      interface CallManagementRequest {
        storeCode: string;
      }

      const callManagementGetRequest: CallManagementRequest = {
        storeCode: storeCode,
      };

      logger.info(
        `callManagementGetRequest: ${JSON.stringify(callManagementGetRequest)}`,
      );

      type CallManagementApiResponse = {
        ok: boolean;
        data: components["schemas"]["CallManagementInfo"];
      };

      // jins-trace-id-branch-no ヘッダーを追加する
      requestHeaders.set(
        "jins-trace-id-branch-no",
        process.env.JINS_TRACE_ID_BRANCH_NO || JINS_TRACE_ID_BRANCH_NO,
      );

      // 通話管理APIを呼び出す
      const callManagementGetResponse = (await sendApiRequest(
        getCallManagement,
        callManagementGetRequest,
        requestHeaders,
      )) as CallManagementApiResponse;

      logger.info(
        `callManagementGetResponse: ${JSON.stringify(callManagementGetResponse)}`,
      );

      // 通話管理の応答がOKでない場合はエラーをスローします
      if (!callManagementGetResponse.ok) {
        throw callManagementGetResponse;
      }

      interface IReceptionsGetResponseData {
        receptionInfos: components["schemas"]["ReceptionInfos"][];
      }
      interface ICallManagementGetResponseData {
        callManagementInfo: components["schemas"]["CallManagementInfo"];
      }

      // 回答からデータを抽出する
      const receptionsGetResponseData =
        receptionsGetResponse.data as IReceptionsGetResponseData;
      const callManagementGetResponseData =
        callManagementGetResponse.data as ICallManagementGetResponseData;

      // 指定された受付番号（ある場合）を除外する
      const otherReceptionInfos =
        receptionsGetResponseData.receptionInfos.filter(
          (receptionInfo: components["schemas"]["ReceptionInfos"]) =>
            receptionInfo.receptionNumber !== receptionNumber,
        );

      logger.info(
        `Filtered receptions. Total: ${receptionsGetResponseData.receptionInfos}, Filtered: ${otherReceptionInfos.length}`,
      );

      let [earliest, latest] = [0, 0];
      let [totalWaitTime, totalWaitPeople, totalOtherWaitPeople] = [0, 0, 0];

      // 待ち時間と待ち人数の合計を計算する
      const [waitTime, waitPeople, otherWaitPeople] = calcWaitingStatus(
        callManagementGetResponseData.callManagementInfo,
        otherReceptionInfos,
      );

      [totalWaitTime, totalWaitPeople, totalOtherWaitPeople] = [
        waitTime,
        waitPeople,
        otherWaitPeople,
      ];

      logger.info(
        `calcWaitingStatus result: totalWaitTime=${totalWaitTime}, totalWaitPeople=${totalWaitPeople}`,
      );

      // 特定の受付番号が指定されている場合、待機ステータスコードを決定します
      let waitingStatusCode: string | null = null;
      if (receptionNumber) {
        const specifiedReceptionInfo =
          receptionsGetResponseData.receptionInfos.find(
            (receptionInfo: components["schemas"]["ReceptionInfos"]) =>
              receptionInfo.receptionNumber == receptionNumber,
          );
        if (
          specifiedReceptionInfo &&
          callManagementGetResponseData.callManagementInfo.availableLines
        ) {
          waitingStatusCode = this.getWaitingStatusCode(
            specifiedReceptionInfo,
            receptionsGetResponseData.receptionInfos.length,
            callManagementGetResponseData.callManagementInfo.availableLines,
          );
          logger.info(
            `waitingStatusCode for receptionNumber=${receptionNumber}: ${waitingStatusCode}`,
          );
        }
      }

      // 待ち時間を5分単位で切り上げます
      const roundUpToNext5Minuts = (number: number): number => {
        return Math.ceil(number / BUFFER_MIN) * BUFFER_MIN;
      };

      [earliest, latest] = [
        roundUpToNext5Minuts(totalWaitTime),
        roundUpToNext5Minuts(totalWaitTime) + BUFFER_MIN,
      ];
      logger.info(`Earliest=${earliest}, Latest=${latest}`);

      // 最終通話時間を計算します（次の1分に切り上げます）
      const roundUpToNextMinute = (date: Date): Date => {
        const roundedDate = new Date(date);
        if (roundedDate.getSeconds() > 0) {
          roundedDate.setMinutes(roundedDate.getMinutes() + 1);
        }

        roundedDate.setSeconds(0);
        roundedDate.setMilliseconds(0);

        return roundedDate;
      };

      const currentTime = new Date();
      const callTime = new Date(currentTime);
      callTime.setMinutes(currentTime.getMinutes() + earliest);

      // 受付がすでに閉まっているかどうかを確認してください
      const receptionCloseTime = getTimeOfToday(
        callManagementGetResponseData.callManagementInfo.receptionCloseTime,
        getStoreTimeZone(DEFAULT_STORE_TIME_ZONE),
      );

      logger.info(`Reception close time: ${receptionCloseTime?.toISOString()}`);
      const isReceptionClose = receptionCloseTime
        ? isAfter(currentTime, receptionCloseTime)
        : false;
      logger.info(`isReceptionClose=${isReceptionClose}`);

      // 最終的なキュー情報配列を構築する（呼び出し中、呼び出された、待機中）
      const [calling, called, waiting] = this.populatingQueueInfo(
        receptionsGetResponseData.receptionInfos,
      );

      // 最終応答データを構築する
      data = {
        waitTimeRange:
          latest > MAX_WAIT_TIME
            ? { latest: MAX_WAIT_TIME }
            : { earliest, latest },
        callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
        waitPeople: totalWaitPeople,
        waitingStatusCode: waitingStatusCode,
        isReceptionClose: isReceptionClose,
        currentTime: getCurrentTimeInTimeZone(DEFAULT_STORE_TIME_ZONE),
        queuesData: {
          callingNumber: calling[0],
          calledList: called,
          waitingList: waiting,
        },
      };
      logger.info(`Final data: ${JSON.stringify(data)}`);
      return data;
    } catch (error) {
      logger.error(
        `Error in show(): ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`,
      );
      throw error;
    }
  };
}
