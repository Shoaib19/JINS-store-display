import { format } from "date-fns";
import {
  adjustTimeZone,
  restoreTimeZone,
  toUTCDateFromLocalDate,
} from "~/src/utils/datetimeUtils";

// 出力フォーマット(ISO8601)
const FRONT_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z'";
const DPFM_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
const DATE_FORMAT = "yyyy-MM-dd";
const TIME_FORMAT = "HH:mm:ss";

// 正規表現(ISO8601)
const regex_datetime =
  /^[0-9]{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]Z{0,1}$/;
const regex_date = /^[0-9]{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])$/;
const regex_time = /^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

/**
 * 日付文字列変換
 * @param date -日付
 * @param format -フォーマット
 * @returns string
 * @link https://ribbit.konomi.app/blog/javascript-date-format/
 */

const formatUTC = (utcDate: Date, outFormat: string) => {
  // format が 地方時刻に対して出力するため、
  // UTCの時刻が 地方時刻となるDateを作成
  const localDate = new Date(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth(),
    utcDate.getUTCDate(),
    utcDate.getUTCHours(),
    utcDate.getUTCMinutes(),
    utcDate.getUTCSeconds(),
    utcDate.getUTCMilliseconds(),
  );
  return isNaN(utcDate.getTime()) ? null : format(localDate, outFormat);
};

/**
 * （フロント/デジタル基盤層送信用）日時文字列への変換（タイムゾーン変換可）
 *
 * timezone:'America/Los_Angeles' ：\
 *  　date：2024-12-24T12:34:56Z → '2024-12-24' \
 *  　date：2024-12-24T07:59:59Z → '2024-12-23' (PSTを適用)\
 *  　date：2024-12-24T08:00:00Z → '2024-12-24' (PSTを適用)\
 *  　date：2024-05-24T06:59:59Z → '2024-05-23' (PDTを適用)\
 *  　date：2024-05-24T07:00:00Z → '2024-05-24' (PDTを適用)\
 *  　date：Date(2024/12/24 12:34:56(UTC)) → '2024-12-24' \
 *  　date：Date(2024/12/24 07:59:59(UTC)) → '2024-12-23' (PSTを適用)\
 *  　date：Date(2024/12/24 08:00:00(UTC)) → '2024-12-24' (PSTを適用)\
 *  　date：Date(2024/12/24 06:59:59(UTC)) → '2024-05-23' (PDTを適用)\
 *  　date：Date(2024/12/24 07:00:00(UTC)) → '2024-05-24' (PDTを適用)\
 * timezone:'-06:00' ：\
 *  　date：2024-12-24T12:34:56Z → '2024-12-24' \
 *  　date：2024-12-24T05:59:59Z → '2024-12-23' \
 *  　date：2024-12-24T06:00:00Z → '2024-12-24' \
 *  　date：（2024/12/24 12:34:56(UTC)) → '2024-12-24' \
 *  　date：（2024/12/24 05:59:59(UTC)) → '2024-12-23' \
 *  　date：（2024/12/24 06:00:00(UTC)) → '2024-12-24' \
 * timezone:undefined ：\
 *  　date：2024-12-24T12:34:56Z → '2024-12-24' \
 *  　date：Date(2024/12/24 12/34/56(UTC)) → '2024-12-24' \
 * date:null → null \
 * date:undefined → null
 *
 * @param date -日時('yyyy-MM-ddTHH:mm:ssZ' or Date)
 * @param timeZone -タイムゾーン
 * @returns 'yyyy-MM-dd'
 */
export const fixDate = (
  date: string | Date | null | undefined,
  timeZone?: string,
): string | null => {
  if (!date) return null;
  const zonedDate = adjustTimeZone(new Date(date), timeZone);
  return formatUTC(zonedDate, DATE_FORMAT);
};

const getFormattedDate = (date: Date, format: string) => {
  const symbol = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  };

  const formatted = format.replace(/(M+|d+|h+|m+|s+)/g, (v) =>
    (
      (v.length > 1 ? "0" : "") + symbol[v.slice(-1) as keyof typeof symbol]
    ).slice(-2),
  );

  return formatted.replace(/(y+)/g, (v) =>
    date.getFullYear().toString().slice(-v.length),
  );
};

/**
 * デジタル基盤層に送るための日付変換（指定タイムゾーンに変換）
 * @param date -日付
 * @param timeZone -タイムゾーン
 * @returns yyyy-MM-dd
 */
export const fixDateForDpfm = (
  date: string | null,
  timeZone?: number,
): string | null => {
  if (!date) return null;
  const targetDate = new Date(date);
  // UTC標準時に変換
  const utcDate = new Date(
    targetDate.getUTCFullYear(),
    targetDate.getUTCMonth(),
    targetDate.getUTCDate(),
    targetDate.getUTCHours(),
    targetDate.getUTCMinutes(),
    targetDate.getUTCSeconds(),
  );
  if (timeZone) {
    // タイムゾーンの時差調整
    utcDate.setTime(utcDate.getTime() + 1000 * 60 * 60 * timeZone);
  }
  // yyyy-MM-dd フォーマットに変換
  return format(utcDate, "yyyy-MM-dd");
};

/**
 * デジタル基盤層送信用日時文字列への変換
 *
 *  date:'2024-12-24T12:34:56Z' → '2024-12-24T12:34:56' \
 *  date:Date('2024/12/24 12:34:56'(UTC)) → '2024-12-24T12:34:56' \
 *  date:null → null \
 *  date:undefined → null
 *
 * @param date -日付('yyyy-MM-ddTHH:mm:ssZ' or Date)
 * @returns 'yyyy-MM-ddTHH:mm:ss'
 */
export const fixDatetimeForDpfm = (
  date: string | Date | null | undefined,
): string | null => {
  if (!date) return null;
  return formatUTC(new Date(date), DPFM_DATETIME_FORMAT);
};

/**
 * フロント送信用日時文字列への変換
 *
 *  date:'2024/12/24 12:34:56Z' → '2024-12-24T12:34:56Z' \
 *  date:Date(2024/12/24 12:34:56(UTC)) → '2024-12-24T12:34:56Z' \
 *  date:null → null \
 *  date:undefined → null
 *
 * @param date -日付('yyyy-MM-ddTHH:mm:ssZ' or Date)
 * @returns 'yyyy-MM-ddTHH:mm:ssZ'
 */
export const fixDatetimeForFront = (
  date: string | Date | null | undefined,
): string | null => {
  if (!date) return null;
  return formatUTC(new Date(date), FRONT_DATETIME_FORMAT);
};

/**
 * デジタル基盤から受信した日時からフロント送信用日時文字列への変換
 *
 *  date:'2024-12-24T12:34:56' → '2024-12-24T12:34:56Z' \
 *  date:null → null \
 *  date:undefined → null
 *
 * @param date -日付('yyyy-MM-ddTHH:mm:ss')
 * @returns 'yyyy-MM-ddTHH:mm:ssZ'
 */
export const fixDatetimeForFrontFromDpfm = (
  date: string | null | undefined,
): string | null => {
  if (!date) return null;
  return fixDatetimeForFront(toUTCDateFromString(date));
};

/**
 * 現在時刻から日付文字列への変換（タイムゾーン変換可）
 *
 * timezone:'America/Los_Angeles'： \
 *  　現在時刻：2024/12/24 12:34:56(UTC) → '2024-12-24' (PSTを適用) \
 *  　現在時刻：2024/12/24 07:59:59(UTC) → '2024-12-23' (PSTを適用) \
 *  　現在時刻：2024/12/24 08:00:00(UTC) → '2024-12-24' (PSTを適用) \
 *  　現在時刻：2024/05/24 12:34:56(UTC) → '2024-05-24' (PDTを適用) \
 *  　現在時刻：2024/05/24 06:59:59(UTC) → '2024-05-24' (PDTを適用) \
 *  　現在時刻：2024/05/24 07:00:00(UTC) → '2024-05-24' (PDTを適用) \
 * timezone:'-06:00'： \
 *  　現在時刻：2024/12/24 12:34:56(UTC) → '2024-12-24' \
 *  　現在時刻：2024/12/24 05:59:59(UTC) → '2024-12-23' \
 *  　現在時刻：2024/12/24 06:00:00(UTC) → '2024-12-24' \
 * timezone:'Asia/Tokyo'： \
 *  　現在時刻：2024/12/24 12:34:56(UTC) → '2024-12-24' (JSTを適用) \
 *  　現在時刻：2024/12/24 14:59:59(UTC) → '2024-12-24' (JSTを適用) \
 *  　現在時刻：2024/12/24 15:00:00(UTC) → '2024-12-24' (JSTを適用) \
 * timezone:undefined： \
 *  　現在時刻：2024/12/24 12:34:56(UTC) → '2024-12-24'
 *
 * @param timeZone -タイムゾーン
 * @returns 'yyyy-MM-dd'
 */
export const fixSystemDate = (timeZone?: string): string => {
  return fixDate(new Date(), timeZone)!;
};

/**
 * 現在時刻から日時文字列への変換
 *
 *  現在時刻：2024/12/24 12:34:56(UTC) → '2024-12-24T12:34:56'
 *
 * @returns 'yyyy-MM-ddTHH:mm:ss'
 */
export const fixSystemDatetimeForDpfm = (): string => {
  return fixDatetimeForDpfm(new Date())!;
};

/**
 * 現在時刻から日付文字列への変換
 *
 * 現在時刻：2024/12/24 12:34:56(UTC) → '2024-12-24T12:34:56Z'
 *
 * @returns 'yyyy-MM-ddTHH:mm:ssZ'
 */
export const fixSystemDatetimeForFront = (): string => {
  return fixDatetimeForFront(new Date())!;
};

/**
 * 任意書式の日時文字列からDateオブジェクトを作成
 *
 *  date:'12/24/2024'、timezone:'America/Los_Angeles' → Date(2024/12/24 08:00:00[UTC]) = 2024/12/24 0:00:00(PSTを適用)\
 *  date:'2024-12-24'、timezone:'America/Los_Angeles' → Date(2024/12/24 08:00:00[UTC]) = 2024/12/24 0:00:00(PSTを適用)\
 *  date:'2024/12/24'、timezone:'Asia/Tokyo'          → Date(2024/12/23 15:00:00[UTC]) = 2024-12-24 0:00:00(JSTを適用)\
 *  date:null → null \
 *  date:undefined → null\
 *  \
 *  日付文字列からTimeZoneが明確な場合TimeZoneは適用しない。 \
 *  date:'2024-12-24T12:34:56Z'、timezone:'America/Los_Angeles' → Date(2024/12/24 12:34:56[UTC]) \
 *  date:'2024-12-24T12:34:56Z'、timezone:'Asia/Tokyo'          → Date(2024/12/24 12:34:56[UTC]) \
 *  date:'2024-12-24T12:34:56Z'、timezone:undefined             → Date(2024/12/24 12:34:56[UTC]) \
 *  デジタル基盤のdate-time \
 *  date:'2024-12-24T12:34:56'、timezone:'America/Los_Angeles'  → Date(2024/12/24 12:34:56[UTC]) \
 *  date:'2024-12-24T12:34:56'、timezone:'Asia/Tokyo'           → Date(2024/12/24 12:34:56[UTC]) \
 *  date:'2024-12-24T12:34:56'、timezone:undefined              → Date(2024/12/24 12:34:56[UTC])
 *
 * @param date -日付('MM/DD/yyyy','yyyy-MM-DD','yyyy-MM-DDTHH:mm.ss','yyyy-MM-DDTHH:mm.ssZ')
 * @param timeZone -タイムゾーン(指定された時刻のTimeZoneが不明確の場合適用)
 * @returns 'yyyy-MM-ddTHH:mm:ss'
 */

export const toUTCDateFromString = (
  date: string | null | undefined,
  timeZone?: string,
) => {
  if (!date) return null;
  let utcDate;
  if (regex_datetime.test(date)) {
    // date-timeの場合、TimeZoneを適用しない
    // デジタル基盤のdate-timeにはタイムゾーンが入っていないので付加
    utcDate = new Date(`${date.replace(/Z$/, "")}Z`);
  } else if (regex_date.test(date)) {
    // dateの場合、UTC時刻として取得されるので、
    // TimeZoneを戻して、TimeZoneで指定された時刻をUTCで表現
    utcDate = restoreTimeZone(new Date(date), timeZone);
  } else {
    // その他書式は地方時刻として取り扱う
    const localDate = new Date(date);
    // 地方時刻をUTCの時刻として、
    // TimeZoneを戻して、TimeZoneで指定された時刻をUTCで表現
    utcDate = restoreTimeZone(toUTCDateFromLocalDate(localDate), timeZone);
  }
  return !isNaN(utcDate.getTime()) ? utcDate : null;
};
