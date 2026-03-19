import { services } from "~/src/compornents/services";
import { createApiMethod } from "~/src/utils/fetchService";

///////////////
//Locations
/**
 * ロケーションマスタ検索API(店舗コード指定)
 */
export const getStoreLocations = createApiMethod("/location/locations", "get", services.LOCATION);

///////////////
//storesAttributes
/**
 * 店舗属性マスタ検索API(店舗コード指定)
 */
export const getStoreAttributes = createApiMethod("/location/stores-attributes", "get", services.LOCATION);
