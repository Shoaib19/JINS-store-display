import { components, operations } from "~/src/interfaces/clients/salesOrder/salesOrderClient";

// 注文詳細取得API（受付番号）
type GetOrderByReceptionNumberPath = operations["getOrderByReceptionNumber"]["parameters"]["path"];
export type OrderByReceptionNumberGetRequest = GetOrderByReceptionNumberPath;

// 注文詳細取得API（注文コード）
type GetOrderByOrderCodePath = operations["getOrderByOrderCode"]["parameters"]["path"];
export type OrderByOrderCodeGetRequest = GetOrderByOrderCodePath;

// 注文詳細取得API（レスポンス共通）
export type OrderGetResponse = components["schemas"]["OrderDetailReadDto"];
export type GlassLineHorizontalMixinReadDto = components["schemas"]["GlassLineHorizontalMixinReadDto"];
export type DiscountLineMixinReadDto = components["schemas"]["DiscountLineMixinReadDto"];
export type TaxLineMixinReadDto = components["schemas"]["TaxLineMixinReadDto"];

// お渡しメガネ行の一覧
type ListGlassLineDeliveryBody = components["schemas"]["GlassLineDeliveryListQueryDto"];
export type GlassLineDeliveryListRequest = ListGlassLineDeliveryBody;
export type GlassLineDeliveryListResponse = components["schemas"]["GlassLineDeliveryQueryResultDto"];
export type GlassLineDeliveryPartialDto = components["schemas"]["GlassLineDeliveryPartialDto"];

// 管理用メガネ行単位での注文検索
type SearchOrdersGlassLinesQuery = operations["searchOrdersGlassLines"]["parameters"]["query"];
export type OrdersGlassLinesSearchRequest = SearchOrdersGlassLinesQuery;
export type OrdersGlassLinesSearchResponse = components["schemas"]["SearchGlassLineReadDto"];
export type SearchGlassLinePartialDto = components["schemas"]["SearchGlassLinePartialDto"];
