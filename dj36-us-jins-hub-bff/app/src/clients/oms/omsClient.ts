import { services } from "~/src/components/services";
import { createApiMethod } from "~/src/utils/fetchService";

///////////////
// update-order-status-payment-completed-by-reception
/**
 * 注文番号で注文ステータスを支払い完了に更新するAPIです。
 */
export const postPaymentCompleted = createApiMethod("/oms/orders/_payment-completed-by-reception/{receptionNumber}", "post", services.OMS);

///////////////
// update-glass-lines-status-delivery-completed
/**
 * 商品グループコードで注文メガネ行ステータスをお渡し完了に更新するAPIです。
 */
export const postDeliveryCompleted = createApiMethod("/oms/glass-lines/_delivery-completed-by-item-group-code/{itemGroupCode}", "post", services.OMS);

///////////////
// update-glass-lines-status-ready-for-delivery
/**
 * 商品グループコードで注文メガネ行ステータスをお渡し準備完了に更新するAPIです。
 */
export const postReadyForDelivery = createApiMethod("/oms/glass-lines/_ready-for-delivery-by-item-group-code/{itemGroupCode}", "post", services.OMS);

///////////////
// order
/**
 * 注文確定API
 */
export const postPlaceOrderByCart = createApiMethod("/oms/orders/_place-order-by-cart/{cartId}", "post", services.OMS);

/**
 * 注文キャンセルAPI
 */
export const postOrderCodeCancel = createApiMethod("/oms/orders/{orderCode}/_cancel", "post", services.OMS);

/**
 * 注文キャンセルAPI注文部分キャンセル
 */
export const postOrderCodeGlassLinesCancel = createApiMethod("/oms/orders/{orderCode}/glass-lines/{glassLineCode}/_cancel", "post", services.OMS);

/**
 * 注文返品API
 */
export const postReturns = createApiMethod("/oms/returns", "post", services.OMS);
///////////////
// calculate-amount
/**
 * 価格・税計算API
 */
export const postCalculateAmount = createApiMethod("/oms/_calculate-amount", "post", services.OMS);

