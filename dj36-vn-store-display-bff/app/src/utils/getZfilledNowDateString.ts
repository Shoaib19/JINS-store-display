import { getNowUTCDate } from "~/src/utils/getNowUTCDate";

/**
 * 指定したタイムゾーンの日時取得
 * @param timezone - タイムゾーン
 * @returns 指定したタイムゾーンの日時
 */
export function getZfilledNowDateString(timezone: string): string {
  const now = getNowUTCDate();
  let diffHours = 0;
  if (timezone == "CST") {
    diffHours = -6;
  }
  if (timezone == "JST") {
    diffHours = 9;
  }
  now.setHours(now.getHours() + diffHours);
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
