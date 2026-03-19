import { CommonErrorCode } from "~/src/components/errorCode";

// 処理結果（ステータス）
export const successStatus = 200 as const;
export const failureStatus = 400 as const;
// 処理結果（成功）のステータスの型
export type SuccessStatus = typeof successStatus;
// 処理結果（失敗）のステータスの型
export type FailureStatus = typeof failureStatus;
// 処理結果のステータスの型
export type SalesOperationStatus = SuccessStatus | FailureStatus;

// 処理結果（成功）
export type SuccessRegisterResult = {
  status: SuccessStatus;
  messages: string[];
}
// 処理結果（失敗）
export type FailureRegisterResult = {
  status: FailureStatus;
  code: string;
  messages: string[];
  message?: string;
}
// カート登録・変更APIのレスポンスの型（処理結果）
export type SalesOperationRegisterResult = SuccessRegisterResult | FailureRegisterResult

/**
 * 処理結果取得（成功）
 * @returns
 */
export function getSuccessRegisterResult(messages?: string | string[]): SuccessRegisterResult {
  const resultMessages = getResultMessages(messages);
  return {
    status: successStatus,
    messages: resultMessages,
  };
}

/**
 * 処理結果取得（失敗）
 * @returns
 */
export function getFailureRegisterResult(messages?: string | string[]): FailureRegisterResult {
  const resultMessages = getResultMessages(messages);
  return {
    status: failureStatus,
    code: CommonErrorCode.COM_0001_VALIDATION_ERROR.code,
    messages: resultMessages,
    message: resultMessages.join(","),
  };
}

/**
 * 処理結果のmessagesを作成
 * @param messages 
 * @returns 
 */
function getResultMessages(
  messages: undefined | string | string[],
): string[] {
  return messages == undefined
    ? []
    : typeof messages === "string"
      ? [messages]
      : messages;
}

/**
 * 処理結果か成功かを判定
 * @param result 
 * @returns 
 */
export function isSuccessRegisterResult(
  result: SalesOperationRegisterResult
): result is SuccessRegisterResult {
  return isSuccessRegisterStatus(result.status);
}

/**
 * ステータスが成功かを判定
 * @param status ステータス
 * @returns 
 */
export function isSuccessRegisterStatus(status: number) {
  return successStatus == status;
}

/**
 * 処理結果を結合する
 * @param results - 処理結果[]
 * @returns 結合された処理結果
 */
export function mergeRegisterResult(
  results: [SalesOperationRegisterResult, ...SalesOperationRegisterResult[]],
): SalesOperationRegisterResult {
  /* ステータスコード取得 */
  const reduceStatusCode = (results: SalesOperationRegisterResult[]) =>
    results.every((result) => isSuccessRegisterStatus(result.status))
      ? successStatus
      : failureStatus;

  // 400/200が混在したときは400のmessageのみのメッセージにする。
  const mergedStatusCode = reduceStatusCode(results);
  const mergedMessages = flattenMessages(mergedStatusCode, results);
  return getRegisterResult(mergedStatusCode, mergedMessages);
}

/**
 * 成功レスポンスを結合する
 * @param results - SuccessRegisterResult[]
 * @returns SuccessRegisterResult
 */
export function mergeSuccessRegisterResult(
  results: [SuccessRegisterResult, ...SuccessRegisterResult[]],
): SuccessRegisterResult {
  const mergedMessages = flattenMessages(successStatus, results);
  return getSuccessRegisterResult(mergedMessages);
}

/**
 * メッセージを平らにする
 * 処理結果をステータスコードで絞り込み、messagesのメッセージを取得する。
 * @param statusCode ステータスコード
 * @param results 処理結果[]
 * @returns メッセージ
 */
function flattenMessages (
  statusCode: SalesOperationStatus,
  results: [SalesOperationRegisterResult, ...SalesOperationRegisterResult[]],
): string[] {
  const messagesMap = new Map<string, string[]>();
  results
    .filter((result) => result.status === statusCode)
    .forEach((result) => {
      const suiteNoList = /^\(Set [0-9]+\)/.exec(result.messages[0]);
      const suiteNo = suiteNoList?.at(0) ?? "";
      let messages = messagesMap.get(suiteNo);
      if (messages != undefined) {
        messages = messages.concat(result.messages);
      } else {
        messages = result.messages;
      }
      messagesMap.set(suiteNo, messages);
    });
  // Suite {n}の{n}の昇順 messageは発生順(resultsの順)にする。
  return Array.from(messagesMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((entry) => entry[1])
    .flat();
}

/**
 * 処理結果取得
 * @param status ステータス
 * @param message メッセージ
 * @returns
 */
function getRegisterResult(
  status: SalesOperationStatus,
  messages: undefined | string | string[],
): SalesOperationRegisterResult {
  return (isSuccessRegisterStatus(status)) ? getSuccessRegisterResult(messages): getFailureRegisterResult(messages);
}

