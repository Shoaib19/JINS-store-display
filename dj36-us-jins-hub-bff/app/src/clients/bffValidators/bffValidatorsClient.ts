import { services } from "~/src/components/services";
import { createApiMethod } from "~/src/utils/fetchService";

///////////////
// validator
/**
 * 度数組合せチェックAPI
 */
export const postEyesightcombi = createApiMethod("/eyesightcombi", "post", services.BFF_VALIDATOR);

/**
 * アイポイント測定チェックAPI
 */
export const postEyepointmeasure = createApiMethod("/eyepointmeasure", "post", services.BFF_VALIDATOR);
