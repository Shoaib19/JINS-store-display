/**
 * サービス名定義
 */
export const services = {
  DIAMETER: "diameter",
  SALESORDER: "salesOrder",
  OMS: "oms",
  WARRANTY: "warranty",
  CART: "cart",
  CATALOG: "catalog",
  LOCATION: "location",
  INVENTORY: "inventory",
  STAFFS: "staffs",
  BFF_VALIDATOR: "bffValidator",
  PRICE: "price",
} as const;

/** サービス名のユニオン型 */
export type ServiceName = typeof services[keyof typeof services];;
