import { services } from "~/src/components/services";
import { createApiMethod } from "~/src/utils/fetchService";

///////////////
//Sales-Oder
/**
 * 管理用注文検索API
 */
export const getGlassLinesSearch = createApiMethod("/sales-order/orders/glass-lines/_search", "get", services.SALESORDER);

/**
 * 注文詳細取得API（受付番号）
 */
export const getOrderByReceptionNumber = createApiMethod("/sales-order/orders/_by-reception/{receptionNumber}", "get", services.SALESORDER);

/**
 * 注文詳細取得API（注文コード）
 */
export const getOrderByOrderCode = createApiMethod("/sales-order/orders/{orderCode}", "get", services.SALESORDER);

/**
 * お渡しメガネ行の一覧
 */
export const listGlassLineDelivery = createApiMethod("/sales-order/glass-line-deliveries/_list", "post", services.SALESORDER);
