import { services } from "~/src/compornents/services";
import { createApiMethod } from "~/src/utils/fetchService";

/**
 * 売価検索API
 */
export const getSellingPrices = createApiMethod("/price/selling-prices", "get", services.PRICE);

/**
 * 売価検索API リクエストパラメータqueryインタフェース
 * ※リクエスト時はJSON文字列化
 */
export interface getSellingPricesRequestSearchTarget {
    sellingPriceCategoryCode?: string,
    sellingPriceCategoryId?: number,
    salesTargetId?: number,
}
export interface getSellingPricesRequestQuery {
    searchTargetList: Array<getSellingPricesRequestSearchTarget>,
}