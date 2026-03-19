import { operations, components } from "~/src/interfaces/clients/items/itemsClient";

// フレーム固有属性検索API
type GetFrameUniqueAttributesQuery = operations["getFrameUniqueAttributes"]["parameters"]["query"];
export type FrameUniqueAttributesGetRequest = GetFrameUniqueAttributesQuery;
export type FrameUniqueAttributesGetResponse = components["schemas"]["FrameUniqueAttributesGetResponse"];
// 販売用レンズ検索項目検索API
type GetSalesLensSearchQuery = operations["getSalesLensSearch"]["parameters"]["query"];
export type SalesLensSearchesGetRequest = GetSalesLensSearchQuery;
export type SalesLensSearchesGetResponse = components["schemas"]["SalesLensSearchesGetResponse"];
export type SalesLensSearchGetResponseRecord = components["schemas"]["SalesLensSearchGetResponse"];
// レンズ固有属性検索API
type GetLensUniqueAttributesQuery = operations["getLensUniqueAttributes"]["parameters"]["query"];
export type LensUniqueAttributesGetRequest = GetLensUniqueAttributesQuery;
export type LensUniqueAttributesGetResponse = components["schemas"]["LensUniqueAttributesGetResponse"];
export type LensUniqueAttributeGetResponse = components["schemas"]["LensUniqueAttributeGetResponse"];
// 商品検索API
type GetItemsQuery = operations["getItems"]["parameters"]["query"];
export type ItemsGetRequest = GetItemsQuery;
export type ItemsGetResponse = components["schemas"]["ItemsGetResponse"];
