import { operations, components } from "~/src/interfaces/clients/items/itemsClient";

// フレーム固有属性検索API
export type GetFrameUniqueAttributesQuery = operations["getFrameUniqueAttributes"]["parameters"]["query"];
export type FrameUniqueAttributesGetResponse = components["schemas"]["FrameUniqueAttributesGetResponse"];
// 販売用レンズ検索項目検索API
export type SalesLensSearchGetQueryRequest = operations["getSalesLensSearch"]["parameters"]["query"];
export type SalesLensSearchesGetResponse = components["schemas"]["SalesLensSearchesGetResponse"];
export type SalesLensSearchGetResponseRecord = components["schemas"]["SalesLensSearchGetResponse"];
// レンズ固有属性検索API
export type getLensUniqueAttributesQuery = operations["getLensUniqueAttributes"]["parameters"]["query"];
export type LensUniqueAttributesGetResponse = components["schemas"]["LensUniqueAttributesGetResponse"];
// 商品検索API
export type getItemsQuery = operations["getItems"]["parameters"]["query"];
export type ItemsGetResponse = components["schemas"]["ItemsGetResponse"];
