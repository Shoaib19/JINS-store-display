import { components, operations } from "~/src/interfaces/clients/locations/locationsClient";

/**
 * ロケーションマスタ検索API(店舗コード指定)
 */
type GetLocationsQuery = operations["getLocations"]["parameters"]["query"];
export type LocationsGetRequest = GetLocationsQuery;
export type LocationsGetResponse = components["schemas"]["LocationsGetResponse"];
export type StoreLocation = components["schemas"]["LocationGetResponse"];

/**
 * 店舗属性マスタ検索API
 */
type GetStoresAttributesQuery = operations["getStoresAttributes"]["parameters"]["query"];
export type StoreAttributesGetRequest = GetStoresAttributesQuery;
export type StoreAttributesGetResponse = components["schemas"]["StoresAttributesGetResponse"];
export type StoresAttribute = components["schemas"]["StoreAttributesGetResponse"];
