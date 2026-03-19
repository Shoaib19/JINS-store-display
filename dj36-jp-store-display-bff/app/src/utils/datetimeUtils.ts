import { TZDate } from "@date-fns/tz";
import {
  isAfter as fnsIsAfter,
  isBefore as fnsIsBefore,
  addYears as fnsAddYears,
  addDays as fnsAddDays,
  subDays as fnsSubDays,
  addMinutes as fnsAddMinutes,
  subHours as fnsSubHours,
  format,
} from "date-fns";

/**
 * 日時の比較（後か判定）
 *
 * @param date 日時
 * @param dateToCompare 比較対象の日時
 * @returns TRUE 比較対象の日時より後、FALSE: 比較対象の日時以前
 */
export const isAfter = (date: Date, dateToCompare: Date) => {
  return fnsIsAfter(date, dateToCompare);
};

/**
 * 日時の比較（前か判定）
 *
 * @param date 日時
 * @param dateToCompare 比較対象の日時
 * @returns TRUE 比較対象の日時より後、FALSE: 比較対象の日時以前
 */
export const isBefore = (date: Date, dateToCompare: Date) => {
  return fnsIsBefore(date, dateToCompare);
};

/**
 * 日数加算
 *
 * @param date 日時
 * @param amount 加算する値（日数）
 * @returns 加算された日時
 */
export const addDays = (date: Date, amount: number) => {
  return fnsAddDays(date, amount);
};

/**
 * 日数減算
 *
 * @param date 日時
 * @param amount 減算する値（日数）
 * @returns 減算された日時
 */
export const subDays = (date: Date, amount: number) => {
  return fnsSubDays(date, amount);
};

/**
 * 分数加算
 *
 * @param date 日時
 * @param amount 加算する値（分数）
 * @returns 加算された値
 */
export const addMinutes = (date: Date, amount: number) => {
  return fnsAddMinutes(date, amount);
};

/**
 * 時間数減算
 * 
 * @param date 日時 
 * @param amount 減算する値（時間数）
 * @returns 減算された値
 */
export const subHours = (date: Date, amount: number) => {
  return fnsSubHours(date, amount);
};

/**
 * 時刻を1分単位で切り上げる
 *
 * @param date 時刻
 * @returns 切り上げた時刻
 */
export const roundUpToNextMinute = (date: Date): Date => {
  // 現在の秒が0以上の端数があれば、次の分に切り上げる
  const roundedDate =
    date.getSeconds() > 0 ? fnsAddMinutes(date, 1) : new Date(date);
  // 秒・ミリ秒を0に設定
  roundedDate.setSeconds(0, 0);
  return roundedDate;
};

/**
 * ローカル時刻に設定されている時刻がUTC時刻であるDateオブジェクトを作成
 *
 * localDate：Date(2024/12/24 12:34:56(Local時刻)) → Date(2024/12/24 12:34:56(UTC)) \
 *
 * @param localDate ローカル時刻
 * @returns UTC時刻のDateオブジェクト（Timezone/ローカル時刻はシステムタイムゾーンに依存）
 */
export const toUTCDateFromLocalDate = (localDate: Date) => {
  return new Date(
    Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      localDate.getHours(),
      localDate.getMinutes(),
      localDate.getSeconds(),
      localDate.getMilliseconds(),
    ),
  );
};

/**
 * TimeZone適用
 *
 * UTC時刻がTimeZoneで指定した時刻となるように
 * Dateオブジェクトの時刻をTimeZoneで指定された時間だけ進める\
 * \
 * utcDate：Date(2024/12/24 12:34:56[UTC])、timeZone:'America/Los_Angeles' → Date(2024/12/24  4:34:56[UTC]) \
 * utcDate：Date(2024/12/24 12:34:56[UTC])、timeZone:'Asia/Tokyo'          → Date(2024/12/24 21:34:56[UTC]) \
 * utcDate：Date(2024/12/24 12:34:56[UTC])、timeZone:undefined             → Date(2024/12/24 12:34:56[UTC]) \
 *
 * @param date UTC時刻のDateオブジェクト
 * @param timeZone タイムゾーン
 * @returns UTC時刻にTimeZoneが適用されたDateオブジェクト（Timezone/ローカル時刻はシステムタイムゾーンに依存）
 */
export const adjustTimeZone = (utcDate: Date, timeZone?: string) => {
  if (timeZone == undefined) {
    return new Date(utcDate);
  } else {
    const localDate = new TZDate(
      Date.UTC(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate(),
        utcDate.getUTCHours(),
        utcDate.getUTCMinutes(),
        utcDate.getUTCSeconds(),
        utcDate.getUTCMilliseconds(),
      ),
      timeZone,
    );
    return toUTCDateFromLocalDate(localDate);
  }
};

/**
 * TimeZone復元
 *
 * TimeZoneの時刻だけずれたUTC時刻がUTC時刻となるように
 * Dateオブジェクトの時刻をTimeZoneで指定された時間だけ戻す
 * \
 * zonedDate：Date(2024/12/24  4:34:56[UTC])、timeZone:'America/Los_Angeles' → Date(2024/12/24 12:34:56[UTC]) \
 * zonedDate：Date(2024/12/24 21:34:56[UTC])、timeZone:'Asia/Tokyo'          → Date(2024/12/24 12:34:56[UTC]) \
 * zonedDate：Date(2024/12/24 12:34:56[UTC])、timeZone:undefined             → Date(2024/12/24 12:34:56[UTC]) \
 *
 * @param zonedDate UTC時刻にTimeZoneが適用されたDateオブジェクト
 * @param timeZone タイムゾーン
 * @returns UTC時刻のDateオブジェクト（Timezone/ローカル時刻はシステムタイムゾーンに依存）
 */
export const restoreTimeZone = (zonedDate: Date, timeZone?: string) => {
  if (timeZone == undefined) {
    return new Date(zonedDate);
  }
  return new TZDate(
    zonedDate.getUTCFullYear(),
    zonedDate.getUTCMonth(),
    zonedDate.getUTCDate(),
    zonedDate.getUTCHours(),
    zonedDate.getUTCMinutes(),
    zonedDate.getUTCSeconds(),
    zonedDate.getUTCMilliseconds(),
    timeZone,
  );
};

/**
 * 指定されたタイムゾーンにおける本日の指定されたローカル時刻を表すDateオブジェクトを取得
 *
 * timeZone:'America/Los_Angeles'： \
 *  　timeLocal:20:00:00、現在時刻：2024/12/24 12:34:56(UTC) → Date(2024/12/25 04:00:00(UTC)) = 2024/12/24 20:00:00 (PSTを適用) \
 *  　timeLocal:20:00:00、現在時刻：2024/12/24 07:59:59(UTC) → Date(2024/12/24 04:00:00(UTC)) = 2024/12/23 20:00:00 (PSTを適用) \
 *  　timeLocal:20:00:00、現在時刻：2024/12/24 08:00:00(UTC) → Date(2024/12/25 04:00:00(UTC)) = 2024/12/24 20:00:00 (PSTを適用) \
 *  　timeLocal:20:00:00、現在時刻：2024/05/24 12:34:56(UTC) → Date(2024/05/25 03:00:00(UTC)) = 2024/05/24 20:00:00 (PDTを適用) \
 *  　timeLocal:20:00:00、現在時刻：2024/05/24 06:59:59(UTC) → Date(2024/05/24 03:00:00(UTC)) = 2024/05/23 20:00:00 (PDTを適用) \
 *  　timeLocal:20:00:00、現在時刻：2024/05/24 07:00:00(UTC) → Date(2024/05/25 03:00:00(UTC)) = 2024/05/24 20:00:00 (PDTを適用) \
 * timeZone:'-06:00'： \
 *  　timeLocal:20:00:00、現在時刻：2024/12/24 12:34:56(UTC) → Date(2024/12/25 02:00:00(UTC)) = 2024/12/24 20:00:00 (PSTを適用) \
 *  　timeLocal:20:00:00、現在時刻：2024/12/24 05:59:59(UTC) → Date(2024/12/24 02:00:00(UTC)) = 2024/12/23 20:00:00 (PSTを適用) \
 *  　timeLocal:20:00:00、現在時刻：2024/12/24 06:00:00(UTC) → Date(2024/12/25 02:00:00(UTC)) = 2024/12/24 20:00:00 (PSTを適用) \
 * timeZone:'Asia/Tokyo'： \
 *  　timeLocal:20:00:00、現在時刻：2024/12/24 12:34:56(UTC) → Date(2024/12/24 11:00:00(UTC)) = 2024/12/24 20:00:00 (JSTを適用) \
 *  　timeLocal:20:00:00、現在時刻：2024/12/24 14:59:59(UTC) → Date(2024/12/24 11:00:00(UTC)) = 2024/12/24 20:00:00 (JSTを適用) \
 *  　timeLocal:20:00:00、現在時刻：2024/12/24 15:00:00(UTC) → Date(2024/12/25 11:00:00(UTC)) = 2024/12/25 20:00:00 (JSTを適用) \
 *
 * @param timeLocal ローカル時刻（'HH:mm:ss'）
 * @param timeZone -タイムゾーン
 * @returns 本日のUTC時刻のDateオブジェクト（Timezone/ローカル時刻はシステムタイムゾーンに依存）
 */
export const getTimeOfToday = (
  timeLocal: string | null | undefined,
  timeZone: string,
) => {
  if (!timeLocal) return null;

  const timeArray = timeLocal.split(":").map((v) => +v);

  const localDate = TZDate.tz(timeZone);
  localDate.setHours(timeArray.at(0) ?? 0, timeArray.at(1) ?? 0, timeArray.at(2) ?? 0, 0,);
  return localDate;
};

/**
 * タイムゾーンで指定された本日の00:00:00を表すDateオブジェクトを取得
 *
 * timeZone:'America/Los_Angeles'： \
 *  　現在時刻：2024/12/24 12:34:56(UTC) → Date(2024/12/24 08:00:00(UTC)) = 2024/12/24 00:00:00 (PSTを適用) \
 *  　現在時刻：2024/12/24 07:59:59(UTC) → Date(2024/12/23 08:00:00(UTC)) = 2024/12/23 00:00:00 (PSTを適用) \
 *  　現在時刻：2024/12/24 08:00:00(UTC) → Date(2024/12/24 08:00:00(UTC)) = 2024/12/24 00:00:00 (PSTを適用) \
 *  　現在時刻：2024/05/24 12:34:56(UTC) → Date(2024/05/24 07:00:00(UTC)) = 2024/05/24 00:00:00 (PDTを適用) \
 *  　現在時刻：2024/05/24 06:59:59(UTC) → Date(2024/05/23 07:00:00(UTC)) = 2024/05/23 00:00:00 (PDTを適用) \
 *  　現在時刻：2024/05/24 07:00:00(UTC) → Date(2024/05/24 07:00:00(UTC)) = 2024/05/24 00:00:00 (PDTを適用) \
 * timeZone:'-06:00'： \
 *  　現在時刻：2024/12/24 12:34:56(UTC) → Date(2024/12/24 06:00:00(UTC)) = 2024/12/24 00:00:00 \
 *  　現在時刻：2024/12/24 05:59:59(UTC) → Date(2024/12/23 06:00:00(UTC)) = 2024/12/23 00:00:00 \
 *  　現在時刻：2024/12/24 06:00:00(UTC) → Date(2024/12/24 06:00:00(UTC)) = 2024/12/24 00:00:00 \
 * timeZone:'Asia/Tokyo'： \
 *  　現在時刻：2024/12/24 12:34:56(UTC) → Date(2024/12/23 15:00:00(UTC)) = 2024/12/24 00:00:00 (JSTを適用) \
 *  　現在時刻：2024/12/24 14:59:59(UTC) → Date(2024/12/23 15:00:00(UTC)) = 2024/12/24 00:00:00 (JSTを適用) \
 *  　現在時刻：2024/12/24 15:00:00(UTC) → Date(2024/12/24 15:00:00(UTC)) = 2024/12/25 00:00:00 (JSTを適用) \
 *
 * @param timeZone -タイムゾーン
 * @returns 本日のUTC時刻のDateオブジェクト（Timezone/ローカル時刻はシステムタイムゾーンに依存）
 */
export const getStartOfToday = (timeZone: string) => {
  const localDate = TZDate.tz(timeZone);
  localDate.setHours(0, 0, 0, 0);
  return localDate;
};

/**
 * タイムゾーンで指定した日付の00:00:00を表すDateオブジェクトを取得
 *
 *  timeZone:'America/Los_Angeles'： \
 *  　date: Date(2024/12/24 12:34:56(UTC)) → Date(2024/12/24 08:00:00(UTC)) = 2024/12/24 00:00:00 (PSTを適用) \
 *  　date: Date(2024/12/24 08:00:00(UTC)) → Date(2024/12/24 08:00:00(UTC)) = 2024/12/24 00:00:00 (PSTを適用) \
 *  　date: Date(2024/12/24 07:59:59(UTC)) → Date(2024/12/23 08:00:00(UTC)) = 2024/12/23 00:00:00 (PSTを適用) \
 *  　date: Date(2024/05/24 12:34:56(UTC)) → Date(2024/05/24 07:00:00(UTC)) = 2024/05/24 00:00:00 (PDTを適用) \
 *  　date: Date(2024/05/24 07:00:00(UTC)) → Date(2024/05/24 07:00:00(UTC)) = 2024/05/24 00:00:00 (PDTを適用) \
 *  　date: Date(2024/05/24 06:59:59(UTC)) → Date(2024/05/23 07:00:00(UTC)) = 2024/05/23 00:00:00 (PDTを適用) \
 *  timeZone:'-06:00'： \
 *  　date: Date(2024/12/24 06:00:00(UTC)) → Date(2024/12/24 06:00:00(UTC)) = 2024/12/24 00:00:00 \
 *  　date: Date(2024/12/24 05:59:59(UTC)) → Date(2024/12/23 06:00:00(UTC)) = 2024/12/23 00:00:00 \
 *  timeZone:'Asia/Tokyo'： \
 *  　date：Date(2024/12/23 15:00:00(UTC)) → Date(2024/12/23 15:00:00(UTC)) = 2024/12/24 00:00:00 (JSTを適用) \
 *  　date：Date(2024/12/23 14:59:59(UTC)) → Date(2024/12/22 15:00:00(UTC)) = 2024/12/23 00:00:00 (JSTを適用) \
 *  date:null → null \
 *  date:undefined → null
 *
 * @param date -日付(yyyy-MM-dd)
 * @param timeZone -タイムゾーン
 * @returns 指定した日付の00:00:00のDateオブジェクト（Timezone/ローカル時刻はシステムタイムゾーンに依存）
 */
export const getStartOfDate = (
  date: Date | null | undefined,
  timeZone: string,
): Date | null => {
  if (!date) return null;

  const zonedDate = adjustTimeZone(date, timeZone);
  zonedDate.setUTCHours(0, 0, 0, 0);
  return restoreTimeZone(zonedDate, timeZone);
};

/**
 * 保証の有効期限を取得する
 *
 * @param warrantyStartDate 保証開始日(UTC時刻)
 * @param timeZone タイムゾーン
 * @returns 保証終了日(UTC時刻)
 */
export const getWarrantyExpirationDate = (
  warrantyStartDate: Date | undefined | null,
  timeZone?: string,
): Date | null => {
  if (warrantyStartDate == undefined) {
    return null;
  }
  const zonedDate = adjustTimeZone(warrantyStartDate, timeZone);
  // 翌年の同日（閏年：保証開始日が2/29の場合、有効期限は翌年の2/28）
  zonedDate.setUTCHours(0, 0, 0, 0);
  const warrantyExpirationDate = fnsAddYears(zonedDate, 1);
  return restoreTimeZone(warrantyExpirationDate, timeZone);
};

/**
 * 指定されたタイムゾーンの現在時刻を取得
 * @param timeZone タイムゾーン
 */
export const getCurrentTimeInTimeZone = (timeZone: string): string => {
  const zonedDate = TZDate.tz(timeZone);
  return format(zonedDate, "h:mm a").toLowerCase();
};
