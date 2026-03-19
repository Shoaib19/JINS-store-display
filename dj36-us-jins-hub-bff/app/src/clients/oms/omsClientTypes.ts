import { components, operations } from "~/src/interfaces/clients/oms/omsClient";

// 価格・税計算API
type CalculateAmountGlassLinesRequestBody = components["schemas"]["CalculateAmountWriteDto"];
export type CalculateAmountGlassLinesWriteDto = components["schemas"]["CalculateAmountGlassLinesWriteDto"];
export type CalculateAmountGlassLinesRequest = CalculateAmountGlassLinesRequestBody;
export type CalculateAmountResponse = components["schemas"]["CalculateAmountReadDto"];
export type CalculateAmountGlassLinesReadDto = components["schemas"]["CalculateAmountGlassLinesReadDto"];

// update-order-status-payment-completed-by-reception
type UpdateOrderStatusPaymentCompletedByReceptionPath = operations["updateOrderStatusPaymentCompletedByReception"]["parameters"]["path"];
type UpdateOrderStatusPaymentCompletedByReceptionBody = components["schemas"]["UpdateOrderStatusWriteDto"];
export type UpdateOrderStatusPaymentCompletedByReceptionRequest = UpdateOrderStatusPaymentCompletedByReceptionPath & UpdateOrderStatusPaymentCompletedByReceptionBody;

// update-glass-lines-status-delivery-completed
type UpdateGlassLinesStatusReadyForDeliveryPath = operations["updateGlassLinesStatusReadyForDelivery"]["parameters"]["path"];
type UpdateGlassLinesStatusReadyForDeliveryBody = components["schemas"]["UpdateGlassLinesStatusWriteDto"]
export type UpdateGlassLinesStatusReadyForDeliveryRequest = UpdateGlassLinesStatusReadyForDeliveryPath & UpdateGlassLinesStatusReadyForDeliveryBody;

// update-glass-lines-status-ready-for-delivery
type UpdateGlassLinesStatusDeliveryCompletedPath = operations["updateGlassLinesStatusReadyForDelivery_1"]["parameters"]["path"];
type UpdateGlassLinesStatusDeliveryCompletedBody = components["schemas"]["UpdateGlassLinesStatusWriteDto"];
export type UpdateGlassLinesStatusDeliveryCompletedRequest = UpdateGlassLinesStatusDeliveryCompletedPath & UpdateGlassLinesStatusDeliveryCompletedBody;

// 注文確定API
type PlaceOrderByCartPath = operations["placeOrderByCart"]["parameters"]["path"];
type PlaceOrderByCartBody = components["schemas"]["PlaceOrderByCartWriteDto"];
export type OrderType = components["schemas"]["OrderType"];
export type WarrantyExchangeTerm = components["schemas"]["WarrantyExchangeTerm"];
export type PlaceOrderByCartPostRequest = PlaceOrderByCartPath & PlaceOrderByCartBody;
export type PlaceOrderByCartPostResponse = components["schemas"]["PlaceOrderByCartReadDto"];

// 注文キャンセルAPI
type CancelOrderPath = operations["cancelOrder"]["parameters"]["path"];
type CancelOrderBody = components["schemas"]["CancelOrderRequest"];
export type CancelOrderPostRequest = CancelOrderPath & CancelOrderBody;
export type CancelOrderPostResponse = components["schemas"]["OrderDetailReadDto"];

// 注文部分キャンセルAPI
type CancelGlassLinePath = operations["cancelGlassLine"]["parameters"]["path"];
export type CancelGlassLinePostRequest = CancelGlassLinePath & CancelOrderBody;

// 注文返品API
type ReturnOrderBody = components["schemas"]["ReturnOrderRequest"];
export type ReturnOrderRequest = ReturnOrderBody;
export type ReturnOrderResponse = components["schemas"]["ReturnOrderResponse"];