import { encryptText } from "~/src/utils/encryptText";

/**
 * 受付完了時：受付完了を知らせるメッセージ
 * @param callingNumber
 * @param receptionNumber
 */
export const getReceptionCompleteMessage = (
  callingNumber: string,
  receptionNumber: string,
) : string => {
  return `JINS Eyewear
  You're added to the queue!
  Call No: ${callingNumber}
  Check status or Cancel here:
${process.env.RECEPTIONS_DOMAIN ?? ""}/receptionSlip?n=${encryptText(receptionNumber)}`
}
/**
 * 受付完了時：アプリのダウンロードを促すメッセージ
 */
export const getAppDownloadMessage = () : string => {
  return `Download the new JINS app!
  Check your order history, prescriptions, and warranties. Available on iPhone and Android.
  https://us.jins.com/pages/jins-app`;
}

/**
 * 呼出時：呼び出しを知らせるメッセージ
 * @param callingNumber
 * @param receptionNumber
 */
export const getCallingMessage = (
  callingNumber: string,
  receptionNumber: string,
) : string => {
  return `It's your turn!
  Please come to the reception counter.

  Call Number: ${callingNumber}

  Show the QR from the URL to store staff:${process.env.RECEPTIONS_DOMAIN ?? ""}/receptionSlip?n=${encryptText(receptionNumber)}`;
}

/**
 * 呼出済（待ちが減少）：もうすぐ呼び出しを知らせるメッセージ
 * @param receptionNumber
 */
export const getCallingSoonMessage = (
  receptionNumber: string,
) : string => {
  return `JINS Eyewear

  Your turn is coming up!

  Please return to the store if you are out.

  Check status or Cancel here:
  ${process.env.RECEPTIONS_DOMAIN ?? ""}/receptionSlip?n=${encryptText(receptionNumber)}`;
}

/**
 * お渡し準備完了：お渡し準備完了を知らせるメッセージ
 * @param itemGroupCode
 */
export const getReadyForPickupMessage = (
  itemGroupCode: string,
) : string => {
  return `Your glasses are ready! Pick up in-store.
  Pick up ticket[${itemGroupCode}]
  *Shipped orders will be sent soon.

  ${process.env.RECEPTIONS_DOMAIN ?? ""}/receptionSlip?g=${encryptText(itemGroupCode)}`;
}
