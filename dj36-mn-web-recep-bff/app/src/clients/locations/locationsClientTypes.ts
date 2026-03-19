import { components, operations } from "~/src/interfaces/clients/locations/locationsClient";

/**
 * ロケーションマスタ検索API(店舗コード指定)
 */
// 店舗コードのみ指定のためここで定義
export type LocationsGetRequest = {storeCode : string };
export type LocationsGetResponse = components["schemas"]["LocationsGetResponse"];
export type StoreLocation = components["schemas"]["LocationGetResponse"];
export type GetLocationsQuery = operations["getLocations"]["parameters"]["query"];

/**
 * 店舗属性マスタ検索API
 */
export type GetStoreAttributesQuery = operations["getStoresAttributes"]["parameters"]["query"];
export type GetStoreAttributesResponse = components["schemas"]["StoresAttributesGetResponse"];
