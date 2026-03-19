/**
 * UTCの現在日時を取得
 * @returns UTC日付
 */
export function getNowUTCDate(): Date {
  const now = new Date();
  const utcnow = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
  );
  return utcnow;
}
