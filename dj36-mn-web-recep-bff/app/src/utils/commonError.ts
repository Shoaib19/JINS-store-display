import { COUNTRY_CODE_ALPHA2 } from "~/src/compornents/const";

/**
 * カート新規作成時、受付事業国と異なる場合はエラー
 * @param receptionNumber - 受付番号
 * @returns string | null
 */
export const checkReceptionNumberCountryCode = (receptionNumber?: string | null): string | null => {
  if (receptionNumber && String(receptionNumber).slice(6,8) !== COUNTRY_CODE_ALPHA2) {
    return "The country code in the reception number is incorrect.";
  }
  return null
}
