import { services } from "~/src/compornents/services";
import { createApiMethod } from "~/src/utils/fetchService";

///////////////
// Authentication
/**
 * スタッフ認証API
 */
export const getStaffLogin = createApiMethod("/staff/authentication", "get", services.STAFFS);

///////////////
// Staff
/**
 * スタッフ情報取得API
 */
export const getStaff = createApiMethod("/staff/staff/{staffId}", "get", services.STAFFS);
