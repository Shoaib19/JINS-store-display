// 処理結果
export type SalesOperationRegistResult = {
  status: number;
  messages: string[];
  code?: string;
  message?: string;
};

/**
 * 登録結果取得（正常）
 * @returns
 */
export function getSuccessRegistResult(): SalesOperationRegistResult {
  return getRegistResult(200);
}

/**
 * 登録結果取得
 * @param status ステータス
 * @param message メッセージ
 * @returns
 */
export function getRegistResult(
  status: number,
  message?: string,
): SalesOperationRegistResult;
export function getRegistResult(
  status: number,
  messages: string[],
): SalesOperationRegistResult;
export function getRegistResult(
  status: number,
  messages: undefined | string | string[],
): SalesOperationRegistResult {

  const resultMessages =
    messages == undefined
    ? []
    : typeof messages === "string"
      ? [messages]
      : messages

  if (status == 200) {
    return {
      status: status,
      messages: resultMessages
    };
  }

  const result: SalesOperationRegistResult = {
    status: status,
    messages: resultMessages,
    code: "COM_0001",
    message: resultMessages.join(",")
  }

  return result;
}

/**
 * レスポンスを結合する
 * @param results - SalesOperationResult[]
 * @returns SalesOperationResult
 */
export function mergeRegistResult(
  results: SalesOperationRegistResult[],
): SalesOperationRegistResult {
  /* ステータスコード取得 */
  const reduceStatusCode = (results: SalesOperationRegistResult[]) => {
    return results
      .map((result: SalesOperationRegistResult) => result.status)
      .reduce(
        (resultStatus, currentStatus) =>
          resultStatus > currentStatus ? resultStatus : currentStatus,
        0,
      );
  };
  /* メッセージを平らにする */
  const flattenMessages = (
    results: SalesOperationRegistResult[],
    statusCode: number,
  ) => {
    const messagesMap: Map<string, string[]> = new Map();
    results
      .filter((result) => result.status === statusCode)
      .forEach((result) => {
        const suiteNoList = /^\(Suite [0-9]+\)/.exec(result.messages[0]);
        const suiteNo = suiteNoList?.at(0) ?? "";
        let messages = messagesMap.get(suiteNo);
        if (messages != undefined) {
          messages = messages.concat(result.messages);
        } else {
          messages = result.messages;
        }
        messagesMap.set(suiteNo, messages);
      });
    return Array.from(messagesMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map((entry) => entry[1])
      .flat();
  };
  const mergedStatusCode: number = reduceStatusCode(results);
  // 400/200が混在したときは400のmessageのみのメッセージにする。
  // Suite {n}の{n}の昇順 messageは発生準(resultsの順)にする。
  const mergedMessages: string[] = flattenMessages(results, mergedStatusCode);
  return getRegistResult(mergedStatusCode, mergedMessages);
}
