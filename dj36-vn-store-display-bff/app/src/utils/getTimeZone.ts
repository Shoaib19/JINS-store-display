import {
  COUNTRY_TIME_ZONE,
  DEFAULT_STORE_TIME_ZONE,
} from "~/src/compornents/const";

/**
 * 店舗のタイムゾーン取得
 * @param bffRequest BFFのリクエスト情報
 * @returns 店舗のタイムゾーン
 */
export function getStoreTimeZone(timezone?: string): string {
  return timezone ?? DEFAULT_STORE_TIME_ZONE;
}

/**
 * 国のタイムゾーン取得
 * @returns 国のタイムゾーン
 */
export function getCountryTimeZone(): string {
  return COUNTRY_TIME_ZONE;
}
