import { components, operations } from "~/src/interfaces/clients/oms/omsClient";

// 価格・税計算API
export type CalculateAmountWriteDto = components["schemas"]["CalculateAmountWriteDto"];
export type CalculateAmountGlassLinesWriteDto = components["schemas"]["CalculateAmountGlassLinesWriteDto"];
export type CalculateAmountReadDto = components["schemas"]["CalculateAmountReadDto"];
export type CalculateAmountGlassLinesReadDto = components["schemas"]["CalculateAmountGlassLinesReadDto"];


// update-order-status-payment-completed-by-reception
export type UpdateOrderStatusPaymentCompletedByReceptionPath = operations["updateOrderStatusPaymentCompletedByReception"]["parameters"]["path"];
// update-glass-lines-status-delivery-completed
export type UpdateGlassLinesStatusReadyForDeliveryPath = operations["updateGlassLinesStatusReadyForDelivery"]["parameters"]["path"];
// update-glass-lines-status-ready-for-delivery
export type UpdateGlassLinesStatusDeliveryCompletedPath = operations["updateGlassLinesStatusReadyForDelivery_1"]["parameters"]["path"];

// 注文確定API
export type PlaceOrderByCartPath = operations["placeOrderByCart"]["parameters"]["path"];
export type PlaceOrderByCartWriteDto = components["schemas"]["PlaceOrderByCartWriteDto"];
export type WarrantyExchangeTerm = components["schemas"]["WarrantyExchangeTerm"];
