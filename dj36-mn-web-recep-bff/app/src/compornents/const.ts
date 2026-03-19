/**
 * BFF設定値（MN）
 */
// 店舗のタイムゾーン(IANA or UTC offset)
export const DEFAULT_STORE_TIME_ZONE = "Asia/Ulaanbaatar";
// 国のタイムゾーン(IANA or UTC offset)
export const COUNTRY_TIME_ZONE = "+08:00";  // MNT
// 国名コード(ISO 3166-1 alpha-2)
export const COUNTRY_CODE_ALPHA2 = "MN";
// 通貨コード(ISO 4217)
export const CURRENCY_CODE = "MNT";
// 価格計算パターンコード
export const DEFAULT_CALCULATION_PATTERN_CODE = "MN_L2-1";

/**
 * staffId/staffName
 */
// （Customer用固定値）
export const customerStaffId = "guest";
export const customerStaffName = "Customer";
export const unknownStaffName = "-";

/**
 * 来店目的(visiting purpose)
 */
export const VisitingPurpose = {
  // メガネを作る
  MAKE_NEW_GLASSES: "010",
  // 調整
  REPAIR: "020",
  // 保証書利用
  USE_THE_WARRANTY: "030",
  // アクセサリーを買う
  BUY_ACCESSORIES: "040",
  // 相談
  GENERAL_HELP: "050",
};

/**
 * 度数登録方法(registration method)
 */
export const RegistrationMethod = {
  // 測定
  MEASUREMENT: {
    CODE: "001",
    NAME: "measurement",
  },
  // 処方箋
  PRESCRIPTION: {
    CODE: "002",
    NAME: "prescription",
  },
  // JB
  JB: {
    CODE: "003",
    NAME: "JB",
  },
  // 度数不要
  NON_PRESCRIPTION: {
    CODE: "004",
    NAME: "non prescription",
  },
  // 度数不要
  JINS_APP: {
    CODE: "005",
    NAME: "JINS app",
  },
  // 度数不要
  MANUAL_ENTER: {
    CODE: "006",
    NAME: "Manual enter",
  },
};

/**
 * 列タイプ(line type)
 */
export const LineType = {
  // メイン測定方法
  MAIN_MEASUREMENT: "A",
  // メイン以外の測定方法
  OTHER_MEASURMENT: "B",
  // 調整
  REPAIR: "F",
  // ヘルプ・相談
  HELP: "G",
  // パッケージ購入
  PACKAGE: "P",
};

/**
 * 受付ステータス(reception status)
 */
export const ReceptionStatus = {
  // 測定
  MEASUREMENT: "100",
  // 度数登録
  REGISTERED: "101",
  // カート登録
  ORDER_NEW: "200",
  // 会計
  PAYMENT: "300",
  // 加工 ※検討課題
  PROCESSING: "400",
  // 調整 ※検討課題
  ADJUSTMENT: "401",
  // General help
  GENERAL_HELP: "402",
  // 商品受取 ※検討課題
  PICK_UP: "500",
  // 完了
  COMPLETE: "800",
  // 注文完了
  ORDER_COMPLETE: "801",
  // キャンセル
  CANCEL: "900",
  // キャンセル済
  CANCELED: "901",
};

/**
 * 呼出状態(calling status)
 */
export const CallingStatus = {
  // 対象外
  NONE: "000",
  // 呼出待
  WATING: "001",
  // 呼出中
  CALLING: "002",
  // 対応中
  IN_SERVICE: "003",
  // 完了
  DONE: "010",
  // 不在
  NO_SHOW: "090",
  // 外出
  GOING_OUT: "091",
  // 取消
  CANCEL: "020",
};

/**
 * 商品種別(item category)
 * ※受付保証_コード一覧に英語名称の記載がなかったので仮定数名
 */
export const ItemCategory = {
  // フレーム
  FRAME: "01",
  // ケース
  CASE: "04",
  // セリート（眼鏡拭き）
  CLOTH: "05",
  // 度数情報/処方箋
  PRESCRIPTION_INFO: "11",
  // レンズOP
  LENS_OPTION: "12",
  // レンズ交換OP
  LENS_REPLACEMENT_OPTION: "14",
};

/**
 * 販売用商品種別管理コード(salesItemCategoryMgmtCode)
 */
export const SalesItemCategoryMgmtCode = {
  // 店舗EC共通
  STORE_EC: "10",
  // ECでの商品選択用
  EC_ONLY: "20",
};
/**
 * 販売用商品種別項目コード(salesItemCategoryCode)
 */
export const SalesItemCategoryCode = {
  // アイウェア小物ーメガネケース
  CASE: "0501",
};

/**
 * 商品コード
 */
export const ItemCode = {
  // サービスセリート
  SERVICE_CERRITO: "YC0101-1",
}

/**
 * 受け渡し方法(delivery method)
 */
export const DeliveryMethod = {
  // 配送
  SHIPPING: "001",
  // 店舗受取
  HAND_OVER: "002",
  // ピックアップロッカー
  PICKUP_LOCKER: "003",
  // 他店受取
  HAND_OVER_AT_OTHER_STORE: "004",
  // 他店ピックアップロッカー
  PICKUP_LOCKER_AT_OTHER_STORE: "005",
};

/**
 * 遠中近区分
 */
export const PerspectiveType = {
  // 度なし
  NON_PRESCRIPTION: {
    CODE: "000",
    NAME: "Non-prescription",
  },
  // 遠用
  DISTANCE: {
    CODE: "001",
    NAME: "Distance",
  },
  // 近用
  NEAR: {
    CODE: "002",
    NAME: "Near",
  },
  // 遠近
  PROGRESSIVE: {
    CODE: "003",
    NAME: "Progressive",
  },
  // 中近
  MID_NEAR: {
    CODE: "004",
    NAME: "Mid-Near",
  },
  // 近近
  NEAR_NEAR: {
    CODE: "005",
    NAME: "Near-Near",
  },
  // サポート
  SUPPORT: {
    CODE: "007",
    NAME: "Support",
  },
  // Bi-Focal
  BI_FOCAL: {
    CODE: "008",
    NAME: "Bi-Focal",
  },
  // 老眼
  READERS: {
    CODE: "100",
    NAME: "Readers",
  },
  // 中間用
  INTERMEDIATE: {
    CODE: "101",
    NAME: "Intermediate"
  }
};

/**
 * 対象テーブル
 */
export const TargetTable = {
  // 販売用カラー名称マスタ
  SALES_COLOR_NAME: 1,
  // 販売用レンズ仕様マスタ
  SALES_LENS_SPEC: 2,
  // 焦点分類マスタ
  FOCUS_CATEGORY: 3,
  // 累進分類マスタ
  PROGRESSIVE_CATEGORY: 4,
  // 屈折率名称マスタ
  REFRACTIVE_INDEX_NAME: 5
}

/**
 * 累進分類表示名
 */
export const ProgressiveCategory = {
  // 11mm corridor length
  CORRIDOR_LENGTH_11MM: {
    CODE: "LOP-P-110004",
    DISPLAY_NAME: "11mm",
  },
  // 13mm corridor length
  CORRIDOR_LENGTH_13MM: {
    CODE: "LOP-P-110005",
    DISPLAY_NAME: "13mm",
  },
}

/**
 * 処方箋画像サイズ
 */
export const MAXIMUM_IMAGE_BYTE_SIZE: number = 100000000;

/**
 * 待ち状況ステータス
 */
export const WaitingStatus = {
  // 受付完了
  RECEPTION_COMPLETE: "001",
  // まもなく呼び出し
  SOON_CALL: "002",
  // 呼び出し済み
  CALLED: "003",
  // 受付キャンセル
  RECEPTIONS_CANCEL: "004",
  // 受け渡し準備完了
  READY_FOR_DELIVERY: "005",
};

/**
 * 注文ステータスコード（フロント向け）
 */
export const OrderStatus = {
  PAYMENT: "300",
  PROCESSING: "400",
  PICKUP: "500",
  RESOLVE: "800",
  ORDER_COMPLETED: "801",
  ORDER_CANCELED: "901",
}

/**
 * 注文ステータスコード（フロント向け）
 */
export const OrderStatusName = {
  PAYMENT: "Payment",
  PROCESSING: "Processing",
  PICKUP: "Pick up",
  RESOLVE: "Resolve",
  ORDER_COMPLETED: "Order completed",
  ORDER_CANCELED: "Order canceled",
}

/**
 * 注文ステータスコード（OMS）
 */
export const OMSOrderStatus = {
  // 注文支払い中
  ORDER_PAYMENT_PROCESSING: "ORDER_PAYMENT_PROCESSING",
  // お渡し中
  ORDER_DELIVERY_PROCESSING: "ORDER_DELIVERY_PROCESSING",
  // 注文完了
  ORDER_COMPLETED: "ORDER_COMPLETED",
  // 注文キャンセル
  ORDER_CANCELED: "ORDER_CANCELED"
}

/**
 * 注文ステータス（OMS）
 */
export const OmsOrderStatus = {
  // 注文確定済
  ORDER_PAYMENT_PROCESSING: "ORDER_PAYMENT_PROCESSING",
  // 注文処理中
  ORDER_DELIVERY_PROCESSING: "ORDER_DELIVERY_PROCESSING",
  // 注文完了
  ORDER_COMPLETED: "ORDER_COMPLETED",
  // キャンセル済
  ORDER_CANCELED: "ORDER_CANCELED",
}

/**
 * お渡しステータス（OMS）
 */
export const DeliveryStatus = {
  // お渡し準備前
  BEFORE_PREPARING: "BEFORE_PREPARING",
  // お渡し準備中
  DELIVERY_PREPARING: "DELIVERY_PREPARING",
  // お渡し準備完了
  READY_FOR_DELIVERY: "READY_FOR_DELIVERY",
  // お渡し完了
  DELIVERED: "DELIVERED",
  // キャンセル済み
  DELIVERY_CANCELED: "DELIVERY_CANCELED",
}

/**
 * 実行コード
 */
export const ExecuteCode = {
  // 取消
  PRE_CANCEL: "1",
  // キャンセル
  POST_CANCEL: "2",
  // 返品
  RETURN: "3",
}

/**
 * 理由コード
 */
export const ReasonCode = {
  // 商品違い
  WRONG_PRODUCT: "01",
  // 値引き忘れ
  DISCOUNT_OMISSION: "02",
  // 金種変更
  PRICE_CHARGE: "03",
  // アプリスキャン忘れ
  MEMBER_QR_SCAN_OMISSION: "04",
  // その他(取消)
  PRE_CANCEL_OTHERS: "05",
  // 加工ミス
  PROCESSING_ERROR: "11",
  // お客様都合キャンセル
  POST_CANCEL_CUSTOMER_REQUEST: "12",
  // その他(キャンセル)
  POST_CANCEL_OTHERS: "13",
  // 不良返品
  DEFECTIVE_ITEM: "21",
  // お客様都合返品
  RETURN_CUSTOMER_REQUEST: "22",
  // 保証返品
  RETURN_POLICY: "23",
  //  その他(返品)
  RETURN_OTHERS: "24",
}

/**
 * 交換部位
 */
export const ReplacementPart = {
  // ALL
  ALL : "000",
  // Frame
  FRAME : "001",
  // =Lenses
  LENSES : "002",
  // Lens Both
  LENS_BOTH : "002",
  // Lens Left
  LENS_LEFT : "003",
  // Lens Right
  LENS_RIGTH : "004",
}

/**
 * 注文種類
 */
export const OrderType = {
  //保証交換の注文
  WARRANTY_EXCHANGE : "WARRANTY_EXCHANGE",
  //レンズ交換の注文
  LENSE_REPLACE : "LENSE_REPLACE",
  //通常の注文
  PLAIN : "PLAIN",
}

/*
 * 保証交換ステータス（保証履歴情報）
 */
export const ReplacementStatusCode = {
  // 一次保存
  TEMPORARY : "010",
  // 交換中
  PROCESSING : "011",
  // 交換済
  DONE : "020",
}

/**
 * 商品種別（保証対象）
 */
export const WarrantyItemType = {
  // ALL
  ALL : "000",
  // Frame
  FRAME : "001",
  // Lens Both
  LENS_BOTH : "002",
  // Lens Left
  LENS_LEFT : "003",
  // Lens Right
  LENS_RIGTH : "004",
}

/**
 * 交換回数上限値
 */
export const ExchangeMaxCount = {
    // フレーム交換回数上限値
    FRAME : 1,
    // レンズ交換回数上限値
    LENS : 1,
}
