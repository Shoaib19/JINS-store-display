import { services } from "~/src/compornents/services";
import { createApiMethod } from "~/src/utils/fetchService";

/**
 * 呼出し管理情報取得API
 */
// export const getCallManagement = createApiMethod(
//   "/cart/call-management/{storeCode}",
//   "get",
//   services.CART,
// );


export const getCallManagement = createApiMethod(
  "/callManagmentData",
  "get",
  services.CART,
);