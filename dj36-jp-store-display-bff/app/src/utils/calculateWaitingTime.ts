import { components as components } from "~/src/interfaces/root";
import {
  CallingStatus,
  LineType,
  ReceptionStatus,
} from "~/src/compornents/const";
import { logger } from "~/src/logging/logger";
import { fixSystemTime, toUTCDateFromString } from "~/src/utils/fixDatetime";
import { isBefore, subHours } from "~/src/utils/datetimeUtils";

/**
 * 受付情報＋待ち時間
 */
export interface ReceptionWithGuidanceDiffMinute {
  reception:
    | components["schemas"]["ReceptionInfoAllItems"]
    | components["schemas"]["ReceptionInfos"];
  guidanceDiffMinutes?: number;
}

/**
 * 待ち時間計算
 * @param callManagementInfo 呼出管理情報
 * @param receptions 受付情報
 * @returns (受付情報＋待ち時間)[]
 */
export const calcReceptionsWithGuidanceDiffMinute = (
  callManagementInfo: components["schemas"]["CallManagementInfo"],
  timeZone: string,
  receptions: (
    | components["schemas"]["ReceptionInfoAllItems"]
    | components["schemas"]["ReceptionInfos"]
  )[],
): ReceptionWithGuidanceDiffMinute[] => {
  const waitingList = initializeWaitingList(callManagementInfo, timeZone);
  return receptions.map((reception) =>
    calcReceptionGuidanceDiffMinutes(
      callManagementInfo,
      waitingList,
      reception,
    ),
  );
};

/**
 * 現時刻での視力測定ライン数
 * @param callManagementInfo 呼出管理情報
 * @param timezone タイムゾーン
 * @returns 視力測定ライン数
 */
export const getCurrentAvailableLine = (
  callManagementInfo: components["schemas"]["CallManagementInfo"],
  timeZone: string
)=> {
  const now = fixSystemTime(timeZone);

  // 視力測定ライン設定 がある場合は、 現在時刻以前の最も開始時刻の遅いの視力測定ライン数
  // 見つからない場合は、呼び出し管理情報の視力測定ライン数
  return (
    callManagementInfo.lineSettings
      ?.sort((a, b) => b.startTime!.localeCompare(a.startTime!))
      .find((setting) => setting.startTime!.localeCompare(now) <= 0)
      ?.availableLines ??
    callManagementInfo.availableLines
  );
};

/**
 * 待ち状況取得
 * @param callManagementInfo
 * @param receptions
 * @returns [合計待ち時間, 合計修理待ち人数, 合計その他待ち人数]
 */
export const calcWaitingStatus = (
  callManagementInfo: components["schemas"]["CallManagementInfo"],
  timeZone: string,
  receptions: (
    | components["schemas"]["ReceptionInfoAllItems"]
    | components["schemas"]["ReceptionInfos"]
  )[],
): [number, number, number] => {
  const waitingList = initializeWaitingList(callManagementInfo, timeZone);
  receptions.map((reception) =>
    calcReceptionGuidanceDiffMinutes(
      callManagementInfo,
      waitingList,
      reception,
    ),
  );
  logger.info(`availableLinesWaitingStatus: ${JSON.stringify(waitingList)}`);
  return [
    getMinAvailableLine(waitingList).waitingTime,
    waitingList.waitRepairCount,
    waitingList.waitOtherMeasurementCount,
  ];
};

/** 有効行 */
interface AvailableLine {
  index: number;
  waitingTime: number;
}

/** 待ち行列 */
interface WaitingList {
  // 測定待ち時間
  availableLines: AvailableLine[];
  // 修理待ち人数
  waitRepairCount: number;
  // その他測定待ち人数
  waitOtherMeasurementCount: number;
}

/**
 * 待ち行列を作成
 * @param callManagementInfo
 * @returns 待ち行列
 */
const initializeWaitingList = (
  callManagementInfo: components["schemas"]["CallManagementInfo"],
  timeZone: string
) => {
  const availableLines: AvailableLine[] = [
    ...Array(getCurrentAvailableLine(callManagementInfo, timeZone)),
  ].map((_, i) => {
    const availableLine: AvailableLine = {
      index: i,
      waitingTime: 0,
    };
    return availableLine;
  });

  const waitingList: WaitingList = {
    availableLines: availableLines,
    waitRepairCount: 0,
    waitOtherMeasurementCount: 0,
  };
  return waitingList;
};

/**
 * 待ち時間が最小の待ち行列を取得
 * @param waitingList
 * @returns
 */
const getMinAvailableLine = (waitingList: WaitingList) => {
  return waitingList.availableLines.reduce((accumulator, currentValue) =>
    accumulator.waitingTime < currentValue.waitingTime
      ? accumulator
      : currentValue,
  );
};

/**
 * 待ち時間計算
 * @param callManagementInfo
 * @param waitingList
 * @param reception
 * @returns
 */
const calcReceptionGuidanceDiffMinutes = (
  callManagementInfo: components["schemas"]["CallManagementInfo"],
  waitingList: WaitingList,
  reception:
    | components["schemas"]["ReceptionInfoAllItems"]
    | components["schemas"]["ReceptionInfos"],
): ReceptionWithGuidanceDiffMinute => {
  let waitingTime = undefined;
  if (
    [
      CallingStatus.WAITING,
      CallingStatus.SOON_CALL,
      CallingStatus.CALLING,
      CallingStatus.NO_SHOW,
    ].includes(reception.callingStatusCode!)
  ) {
    // 最小待ち時間を取得
    const targetAvailableLine = getMinAvailableLine(waitingList);
    // 呼出番号から列タイプを取得
    const lineType = reception.callingNumber?.substring(0, 1);

    // 「待ち時間」「修理待ち人数」「その他待ち人数」の計算
    switch (reception.statusCode) {
      case ReceptionStatus.REGISTERED:
        {
          const waitingTimeLineType = [LineType.MAIN_MEASUREMENT];
          const waitOtherMeasurementLineType = [LineType.OTHER_MEASURMENT];
          if (waitingTimeLineType.includes(lineType!)) {
            // 待ち時間に加算
            waitingTime =
              waitingList.availableLines[targetAvailableLine.index].waitingTime;
            waitingList.availableLines[targetAvailableLine.index].waitingTime +=
              callManagementInfo.timeRequiredUntilCall ?? 0;
          }
          if (waitOtherMeasurementLineType.includes(lineType!)) {
            // その他待ち人数に加算
            waitingList.waitOtherMeasurementCount += 1;
          }
        }
        break;
      case ReceptionStatus.MEASUREMENT:
        {
          const waitingTimeLineType = [LineType.MAIN_MEASUREMENT];
          if (waitingTimeLineType.includes(lineType!)) {
            // 待ち時間に加算
            waitingTime =
              waitingList.availableLines[targetAvailableLine.index].waitingTime;
            waitingList.availableLines[targetAvailableLine.index].waitingTime +=
              callManagementInfo.timeRequiredUntilCall ?? 0;
          }
        }
        break;
      case ReceptionStatus.PAYMENT:
        // TODO 対象外(USも暫定で対象外)
        break;
      case ReceptionStatus.ADJUSTMENT:
        // 修理待ち人数に加算
        waitingList.waitRepairCount += 1;
        break;
      case ReceptionStatus.GENERAL_HELP:
        // 修理待ち人数に加算
        waitingList.waitRepairCount += 1;
        break;
    }
  }
  return {
    reception: reception,
    guidanceDiffMinutes: waitingTime,
  };
};

/**
 * 列タイプ取得
 * @param reception 受付情報
 * @returns 列タイプ
 */
export const getLineType = (
  reception?:
    | components["schemas"]["ReceptionInfoAllItems"]
    | components["schemas"]["ReceptionInfos"],
) => {
  // 呼出番号から列タイプを取得
  return reception?.callingNumber?.substring(0, 1) ?? "";
};


/**
* 除外する受信をフィルタリングします:
* - 1時間以上前に更新された NO_SHOW
*/
export const filterWaitingReceptions = (
  receptions: (
    | components["schemas"]["ReceptionInfoAllItems"]
    | components["schemas"]["ReceptionInfos"]
  )[]
): (
    | components["schemas"]["ReceptionInfoAllItems"]
    | components["schemas"]["ReceptionInfos"]
  )[] => {
  const noShoHideCutoffDate = getNoShoHideCutoffDate();
  return receptions.filter((reception) => !isPersistentNoShowBefore(noShoHideCutoffDate)(reception));
};

/**
 * 不在後非表示にする時刻の取得
 * @returns 不在後非表示にする時刻
 */
const getNoShoHideCutoffDate = (): Date => {
  return subHours(new Date(), 1);
}

/**
 * 非表示にする時刻より前の不在受付か判定
 * @param noShoHideCutoffDate 不在後非表示にする時刻 
 * @returns true:非表示にする受付、false：非表示にしない受付
 */
const isPersistentNoShowBefore = (noShoHideCutoffDate : Date) => {
  return (reception:
    | components["schemas"]["ReceptionInfoAllItems"]
    | components["schemas"]["ReceptionInfos"],) => {
    if (![CallingStatus.NO_SHOW].includes(reception.callingStatusCode!)) {
      return false;
    }

    const updatedDatetime = toUTCDateFromString(reception.updatedDatetime);
    return updatedDatetime
      ? isBefore(updatedDatetime, noShoHideCutoffDate)
      : false;
  };
}
