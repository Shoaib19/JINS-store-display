import { components, operations } from "~/src/interfaces/clients/salesOrder/salesOrderClient";

// 注文詳細取得API（受付番号）
export type GetOrderByReceptionNumberPath = operations["getOrderByReceptionNumber"]["parameters"]["path"];
export type OrderDetailReadDto = components["schemas"]["OrderDetailReadDto"];
export type GlassLineHorizontalMixinReadDto = components["schemas"]["GlassLineHorizontalMixinReadDto"];
export type DiscountLineMixinReadDto = components["schemas"]["DiscountLineMixinReadDto"];
export type TaxLineMixinReadDto = components["schemas"]["TaxLineMixinReadDto"];

// 注文詳細取得API（注文コード）
export type GetOrderByOrderCodePath = operations["getOrderByOrderCode"]["parameters"]["path"];


// お渡しメガネ行の一覧
export type GlassLineDeliveryListQueryDto = components["schemas"]["GlassLineDeliveryListQueryDto"];
export type GlassLineDeliveryQueryResultDto = components["schemas"]["GlassLineDeliveryQueryResultDto"];
export type GlassLineDeliveryPartialDto = components["schemas"]["GlassLineDeliveryPartialDto"];

// 管理用メガネ行単位での注文検索
export type SearchOrdersGlassLinesQuery = operations["searchOrdersGlassLines"]["parameters"]["query"];
export type SearchGlassLineReadDto = components["schemas"]["SearchGlassLineReadDto"];
export type SearchGlassLinePartialDto = components["schemas"]["SearchGlassLinePartialDto"];
