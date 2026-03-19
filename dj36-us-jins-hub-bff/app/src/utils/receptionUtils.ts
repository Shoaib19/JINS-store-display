import {
  CallManagementInfo,
  ReceptionInformation,
  ReceptionInfos,
} from "~/src/clients/carts/cartsClientTypes";
import { CallingStatus, LineType, ReceptionStatus } from "~/src/components/const";
import { logger } from "~/src/logging/logger";
import { isBefore, subHours } from "~/src/utils/datetimeUtils";
import { fixSystemTime, toUTCDateFromString } from "~/src/utils/fixDatetime";

/**
 * 受付情報（待ち状況取得APIと受付情報検索APIでの共通項目）
 */
type BasicReceptionType = ReceptionInformation & ReceptionInfos;

/**
 * 受付情報＋待ち時間
 */
export interface ReceptionWithGuidanceDiffMinute extends BasicReceptionType {
  guidanceDiffMinutes?: number;
}

/**
 * 現時刻での視力測定ライン数
 * @param callManagementInfo 呼出管理情報
 * @param timezone タイムゾーン
 * @returns 視力測定ライン数
 */
export const getCurrentAvailableLine = (
  callManagementInfo: CallManagementInfo,
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
 * 待ち時間計算
 * @param callManagementInfo 呼出管理情報
 * @param timezone タイムゾーン
 * @param receptions 受付情報
 * @returns (受付情報＋待ち時間)[]
 */
export const calcReceptionsWithGuidanceDiffMinute = (
  callManagementInfo: CallManagementInfo,
  timeZone: string,
  receptions: (ReceptionInformation | ReceptionInfos)[]
): ReceptionWithGuidanceDiffMinute[] => {
  const waitingList = initializeWaitingList(callManagementInfo, timeZone);
  return receptions.map((reception) =>
    calcReceptionGuidanceDiffMinutes(callManagementInfo, waitingList, reception)
  );
};

/**
 * 待ち時間取得
 * @param callManagementInfo 呼び出し管理情報
 * @param timezone タイムゾーン
 * @param receptions 受付情報[]
 * @returns 最小の待ち時間
 */
export const calcWaitingTime = (
  callManagementInfo: CallManagementInfo,
  timeZone: string,
  receptions: (ReceptionInformation | ReceptionInfos)[]
): number => {
  const waitingList = initializeWaitingList(callManagementInfo, timeZone);
  receptions.map((reception) =>
    calcReceptionGuidanceDiffMinutes(callManagementInfo, waitingList, reception)
  );
  logger.info(`availableLinesWaitingStatus: ${JSON.stringify(waitingList)}`);
  return getMinAvailableLine(waitingList).waitingTime;
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
}

/**
 * 待ち行列を作成
 * @param callManagementInfo
 * @param timezone タイムゾーン
 * @returns 待ち行列
 */
const initializeWaitingList = (
  callManagementInfo: CallManagementInfo,
  timeZone: string
) => {
  const availableLines = [
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
  };
  return waitingList;
};

/**
 * 待ち時間が最小の測定待ち時間を取得
 * @param waitingList
 * @returns 測定待ち時間
 */
const getMinAvailableLine = (waitingList: WaitingList) => {
  return waitingList.availableLines.reduce((accumulator, currentValue) =>
    accumulator.waitingTime < currentValue.waitingTime
      ? accumulator
      : currentValue
  );
};

/**
 * 待ち時間計算
 * @param callManagementInfo
 * @param waitingList
 * @param reception
 * @returns 受付情報＋待ち時間
 */
const calcReceptionGuidanceDiffMinutes = (
  callManagementInfo: CallManagementInfo,
  waitingList: WaitingList,
  reception: ReceptionInformation | ReceptionInfos
): ReceptionWithGuidanceDiffMinute => {
  let waitingTime = undefined;
  if (isWaitingReception(reception)) {
    if(getProcessLineType(reception) === "Eye exam" ) {
      // 最小待ち時間の測定列を取得
      const minAvailableLine = getMinAvailableLine(waitingList);
      // 待ち時間に加算
      waitingTime =
        waitingList.availableLines[minAvailableLine.index].waitingTime;
      waitingList.availableLines[minAvailableLine.index].waitingTime +=
        callManagementInfo.timeRequiredUntilCall ?? 0;
    }
  }
  return {
    ...reception,
    guidanceDiffMinutes: waitingTime,
  };
};

/**
 * 呼出待ち受付への絞り込み
 * @param receptions 受付情報[] 
 * @returns 呼出待ちの受付情報[]
 */
export const filterWaitingReceptions = (
  receptions: (ReceptionInformation | ReceptionInfos)[],
): (ReceptionInformation | ReceptionInfos)[] => {
  // 不在後非表示にする時刻
  const noShoHideCutoffDate = getNoShoHideCutoffDate();
  return receptions
    // 待ち状態の受付のみにする
    .filter((reception) => isWaitingReception(reception))
    // 不在後一定時間経過した受付を除外
    .filter((reception) => !isPersistentNoShowBefore(noShoHideCutoffDate)(reception));
}

/**
 * 呼出待ちの受付判定
 * @param reception 受付
 * @returns true:呼出待ちの受付、false：呼出待ち以外の受付
 */
const isWaitingReception = (
  reception: ReceptionInformation | ReceptionInfos
) => {
  return [
      CallingStatus.WAITING,
      CallingStatus.SOON_CALL,
      CallingStatus.CALLING,
      CallingStatus.NO_SHOW,
    ].includes(reception.callingStatusCode!)
}

/**
 * 有効な受付への絞り込み
 * @param receptions 受付情報[] 
 * @returns 呼出待ちの受付情報[]
 */
export const filterActiveReceptions = (
  receptions: (ReceptionInformation | ReceptionInfos)[],
): (ReceptionInformation | ReceptionInfos)[] => {
  // 有効な受付のみにする
  return receptions.filter((reception) => isActiveReception(reception));
}

/**
 * 有効な受付判定
 * @param reception 受付
 * @returns true:有効な受付、false：有効ではない受付
 */
const isActiveReception = (reception: ReceptionInformation | ReceptionInfos) => {
  return [
    CallingStatus.NONE,
    CallingStatus.WAITING,
    CallingStatus.SOON_CALL,
    CallingStatus.CALLING,
    CallingStatus.IN_SERVICE,
    CallingStatus.NO_SHOW,
    CallingStatus.GOING_OUT,
  ].includes(reception.callingStatusCode!);
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
  return (reception: ReceptionInformation | ReceptionInfos) => {
    if (![CallingStatus.NO_SHOW].includes(reception.callingStatusCode!)) {
      return false;
    }
    const updatedDatetime = toUTCDateFromString(reception.updatedDatetime);
    return updatedDatetime
      ? isBefore(updatedDatetime, noShoHideCutoffDate)
      : false;
  };
}

/**
 * 工程列
 */
export type ProcessLineType =
  | "Eye exam" // Prescription/Exe exam
  | "No eye exam" // No Eye exam
  | "Adjustment" // Adjustment
  | "Cart" // Cart
  | "Payment" // Payment
  | "Processing" // Processing
  | "Pickup"; // Ready for pickup

// 修理の工程列（"No eye exam"と"Adjustment"）
export const repairProcessLineTypes: (ProcessLineType | undefined)[] = [
  "No eye exam",
  "Adjustment",
];

/**
 * 工程列取得
 * @param reception 受付情報
 * @returns 工程列
 */
export const getProcessLineType = (
  reception: ReceptionInformation | ReceptionInfos
): ProcessLineType | undefined => {
  const receptionLineType = getLineType(reception);
  const receptionStatus = reception?.statusCode;

  switch (receptionStatus) {
    case ReceptionStatus.REGISTERED:
      if ([LineType.MAIN_MEASUREMENT].includes(receptionLineType)) {
        // A列
        return "Eye exam";
      }
      if ([LineType.OTHER_MEASUREMENT].includes(receptionLineType)) {
        // B列
        return "No eye exam";
      }
      break;
    case ReceptionStatus.MEASUREMENT:
      if ([LineType.MAIN_MEASUREMENT].includes(receptionLineType)) {
        // A列
        return "Eye exam";
      }
      break;
    case ReceptionStatus.ADJUSTMENT:
    case ReceptionStatus.GENERAL_HELP:
      return "Adjustment";
    case ReceptionStatus.ORDER_NEW:
      return "Cart";
    case ReceptionStatus.PAYMENT:
      return "Payment";
    case ReceptionStatus.PROCESSING:
      return "Processing";
    case ReceptionStatus.PICK_UP:
      return "Pickup";
  }
};

/**
 * 列タイプ取得
 * @param reception 受付情報 
 * @returns 列タイプ
 */
export const getLineType = (reception?: ReceptionInformation | ReceptionInfos
): string => {
  // 呼出番号から列タイプを取得
  return reception?.callingNumber?.substring(0, 1)??'';
};

/**
 * 工程列による絞り込み
 * @param receptions 受付情報[]
 * @param processLineTypes 抽出対象の工程列
 * @returns 絞り込まれた受付情報[]
 */
export const filterReceptionsByProcessLine = (
  receptions: (ReceptionInformation | ReceptionInfos)[],
  processLineTypes: ProcessLineType | undefined | (ProcessLineType|undefined)[]
) => {
  return processLineTypes
    ? receptions.filter((reception) =>
        isProcessLineType(processLineTypes)(reception)
      )
    : [];
};

/**
 * 対象の受付と同一の呼出し列による絞り込み
 * @param receptions 受付情報[]
 * @param reception 対象の受付
 * @returns 絞り込まれた受付情報[]
 */
export const filterReceptionsByCallingLine = (
  receptions: (ReceptionInformation | ReceptionInfos)[],
  reception: ReceptionInformation | ReceptionInfos,
): (ReceptionInformation | ReceptionInfos)[] => {
  const processLineType = getProcessLineType(reception);
  const callingProcessLineTypes = getCallingProcessLineTypes(processLineType);
  return processLineType
    ? receptions.filter((reception) =>
        isProcessLineType(callingProcessLineTypes)(reception)
      )
    : []; 
};

/**
 * 受付が工程列と同一かを判定（判定用の関数を返却）
 * @param processLineTypes 工程列[] or 工程列
 * @returns (reception: ReceptionInformation | ReceptionInfos) => boolean
 */
const isProcessLineType = (
  processLineTypes:
    | ProcessLineType
    | undefined
    | (ProcessLineType | undefined)[]
) => {
  const searchProcessLineType: (ProcessLineType | undefined)[] = Array.isArray(
    processLineTypes
  )
    ? processLineTypes
    : [processLineTypes];
  return (reception: ReceptionInformation | ReceptionInfos) =>
    searchProcessLineType.includes(getProcessLineType(reception));
};

/**
 * 呼出時の工程列を取得
 * 　受付の工程列　⇒ 呼出時の工程列
 *    Eye exam ⇒ Eye exam
 *    No eye exam ⇒ [No eye exam, Adjustment]
 *    Adjustment ⇒ [No eye exam, Adjustment]
 *    Payment ⇒ Payment
 * @param processLineType 工程列
 * @returns 工程列[] or 工程列
 */
const getCallingProcessLineTypes = (processLineType: ProcessLineType|undefined) => {
  // 呼出時の工程列（No eye examとAdjustmentの列は同一）
  return repairProcessLineTypes.includes(processLineType)
      ? repairProcessLineTypes
      : processLineType;
}

/** 工程別に分割した受付 */
interface DividedReception {
  eyeExam : (ReceptionInformation|ReceptionInfos)[],
  noEyeExam : (ReceptionInformation|ReceptionInfos)[],
  adjustment : (ReceptionInformation|ReceptionInfos)[],
  cart : (ReceptionInformation|ReceptionInfos)[],
  payment : (ReceptionInformation|ReceptionInfos)[],
};

/**
 * 受付情報を工程列で分割する
 * @param receptions 受付情報[]
 * @returns 分割後受付情報
 */
export const divideReception = (
  receptions: (ReceptionInformation | ReceptionInfos)[]
): DividedReception => {
  // 呼出状態で抽出
  const activeReceptions = filterActiveReceptions(receptions);
  return {
    eyeExam: filterReceptionsByProcessLine(activeReceptions, "Eye exam"),
    noEyeExam: filterReceptionsByProcessLine(activeReceptions, "No eye exam"),
    adjustment: filterReceptionsByProcessLine(activeReceptions, "Adjustment"),
    cart: filterReceptionsByProcessLine(activeReceptions, "Cart"),
    payment: filterReceptionsByProcessLine(activeReceptions, "Payment"),
  };
};
