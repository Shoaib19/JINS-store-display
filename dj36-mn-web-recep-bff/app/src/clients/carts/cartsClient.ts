import { services } from "~/src/compornents/services";
import { createApiMethod } from "~/src/utils/fetchService";

///////////////
// Receptions
/**
 * 待ち状況取得API
 */
export const getReceptionsServer = createApiMethod("/cart/receptions/{storeCode}", "get", services.CART);

/**
 * 受付情報新規作成API
 */
export const postReceptionInfoServer = createApiMethod("/cart/receptions", "post", services.CART);

/**
 * 受付情報検索API
 */
export const searchReceptionInformation = createApiMethod("/cart/receptions", "get", services.CART);

///////////////
// ReceptionEvents
/**
 * 受付履歴取得API
 */
export const findReceptionEvents = createApiMethod(`/cart/receptions-events/{receptionNumber}`,"get", services.CART);

/**
 * 受付履歴更新API
 */
export const postReceptionEvents = createApiMethod(`/cart/receptions-events`,"post", services.CART);

///////////////
// Prescriptions
/**
 * 処方箋画像取得API
 */
export const getPrescriptionServer = createApiMethod("/cart/prescriptions/{prescriptionId}", "get", services.CART);

/**
 * 処方箋画像コピーAPI
 */
export const postPrescriptionsCopyServer = createApiMethod("/cart/prescriptions/copy/{originalItemGroupCode}/{copiedItemGroupCode}", "post", services.CART)

///////////////
// Prescription
/**
 * 処方箋アップロードダミーAPI
 */
export const postPrescriptionsServer = createApiMethod("/cart/prescription", "post", services.CART);

///////////////
// ItemGroups
/**
 * 受取方法登録API
 */
export const postItemGroupsServer = createApiMethod("/cart/item-groups/{receptionNumber}/{itemGroupCode}", "put", services.CART);

/**
 * 商品グループ削除API
 */
export const deleteItemGroups = createApiMethod("/cart/item-groups/items/{itemGroupCode}", "delete", services.CART);

///////////////
// Lineitems
/**
 * カート情報登録API
 */
export const postLineitems = createApiMethod("/cart/lineitems", "post", services.CART);

///////////////
// Carts
/**
 * カート・カタログ取得API
 */
export const getCartInfo = createApiMethod("/cart/carts", "get", services.CART);

/**
 * カート新規作成API
 */
export const postCartInfo = createApiMethod("/cart/carts", "post", services.CART);

///////////////
// CallManagement
/**
 * 呼出し管理情報取得API
 */
export const getCallManagement = createApiMethod("/cart/call-management/{storeCode}", "get", services.CART);

/**
 * 呼出し管理情報API
 */
export const putCallManagement = createApiMethod("/cart/call-management/{storeCode}", "put", services.CART);
