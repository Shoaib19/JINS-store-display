import { services } from "~/src/compornents/services";
import { createApiMethod } from "~/src/utils/fetchService";
///////////////
// smsnotifier
/**
 * SMS送信API
 */
export const postSmsNotifier = createApiMethod("/smsnotifier/JINSUSTEST?phoneNumber={phoneNumber}", "post", "smsnotifier")