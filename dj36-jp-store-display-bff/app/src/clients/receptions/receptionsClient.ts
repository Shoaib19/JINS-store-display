import { services } from "~/src/compornents/services";
import { createApiMethod } from "~/src/utils/fetchService";

/**
 * 待ち状況取得API
 */
export const getReceptionsServer = createApiMethod(
  "/cart/receptions/{storeCode}",
  "get",
  services.CART,
);
