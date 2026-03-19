import { services } from "~/src/compornents/services";
import { createApiMethod } from "~/src/utils/fetchService";

///////////////
// Inventories
/**
 * 在庫取得API
 */
export const getInventoriesServer = createApiMethod("/inventory/inventories", "get", services.INVENTORY)
