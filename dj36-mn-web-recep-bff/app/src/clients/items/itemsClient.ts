import { createApiMethod } from "~/src/utils/fetchService";
import { services } from "~/src/compornents/services";

///////////////
// Items
/**
 * 商品検索API
 */
export const getItemsServer = createApiMethod("/catalog/items", "get", services.CATALOG);

///////////////
//LensUniqueAttributes
/**
 * レンズ固有属性検索API
 */
export const getLensUniqueAttributes = createApiMethod("/catalog/lens-unique-attributes", "get", services.CATALOG);

///////////////
//FrameUniqueAttributes
/**
 * フレーム固有属性検索API
 */
export const getFrameUniqueAttributes = createApiMethod("/catalog/frame-unique-attributes", "get", services.CATALOG);

///////////////
//SalesLensSearch
/**
 * 販売用レンズ検索項目検索API
 */
export const getSalesLensSearchServer = createApiMethod("/catalog/sales-lens-search", "get", services.CATALOG);
