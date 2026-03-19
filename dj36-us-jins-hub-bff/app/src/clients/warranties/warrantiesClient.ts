import { services } from "~/src/components/services";
import { createApiMethod } from "~/src/utils/fetchService";

///////////////
// Warranties
/**
 * 保証書登録API
 */
export const postWarranties = createApiMethod("/warranty/warranties", "post", services.WARRANTY);

/**
 * 保証情報取得API
 */
export const findWarranties = createApiMethod("/warranty/warranties/{warrantyNumber}", "get", services.WARRANTY);

/**
 * 保証書削除API
 */
export const deleteWarranties = createApiMethod("/warranty/warranties/{warrantyNumber}", "delete", services.WARRANTY);

/**
 * 保証書論理削除API
 */
export const patchWarranties = createApiMethod("/warranty/warranties/{warrantyNumber}", "patch", services.WARRANTY);

/**
 * 保証書更新API
 */
export const putWarranties = createApiMethod("/warranty/warranties/{warrantyNumber}", "put", services.WARRANTY);

/**
 * 保証履歴登録API
 */
export const postWarrantyHistories = createApiMethod("/warranty/warranty-histories", "post", services.WARRANTY);

/**
 * 保証履歴情報取得API
 */
export const findWarrantyHistories = createApiMethod("/warranty/warranty-histories", "get", services.WARRANTY);

/**
 * 保証履歴更新API
 */
export const putWarrantyHistories = createApiMethod("/warranty/warranty-histories/{receptionNumber}", "put", services.WARRANTY);

///////////////
// PowersById
/**
 * 度数・処方箋情報取得API
 */
export const getPowersById = createApiMethod("/warranty/powers-by-id/{powerId}", "get", services.WARRANTY);
