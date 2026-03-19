/**
 * タイムゾーン
 * (UTC標準時との差)
 */
export const timeZone = {
  // 太平洋標準時
  PST: -8,
  // 米国中部標準時
  CST: -6,
  // 日本標準時
  JST: 9,
  // モンゴル標準時
  ULAT: 8,
};

/**
 * BFF設定値（US）
 */
// 店舗のタイムゾーン(IANA or UTC offset)
export const DEFAULT_STORE_TIME_ZONE = "Asia/Ulaanbaatar";
// 国のタイムゾーン(IANA or UTC offset)
export const COUNTRY_TIME_ZONE = "+08:00"; // ULAT
// 国名コード(ISO 3166-1 alpha-2)
export const COUNTRY_CODE_ALPHA2 = "MN";
// 通貨コード(ISO 4217)
export const CURRENCY_CODE = "MNT";
// 価格計算パターンコード
// export const DEFAULT_CALCULATION_PATTERN_CODE = "US_L2-1";

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

export const customerIssueCode = {
  // レンズを交換する
  CHANGE_LENS: "004",
  // はっきりと見えない
  CANT_SEE_CLEAR: "005",
  // 強力な処方
  STRONG_PRESCRIPTION: "006",
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
  MANUAL_ENTER: {
    CODE: "003",
    NAME: "manual enter",
  },
  // 度数不要
  NON_PRESCRIPTION: {
    CODE: "004",
    NAME: "non prescription",
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
  // 一般的なヘルプ
  GENERAL_HELP: "402",
  // 商品受取 ※検討課題
  PICK_UP: "500",
  // キャンセル
  CANCEL: "900",
};

/**
 * 呼出状態(calling status)
 */
export const CallingStatus = {
  // 対象外
  NONE: "000",
  // 呼出待
  WAITING: "001",
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
};

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
    CODE: "0",
    NAME: "Non-prescription",
  },
  // 遠用
  DISTANCE: {
    CODE: "1",
    NAME: "Distance",
  },
  // 近用
  NEAR: {
    CODE: "2",
    NAME: "Near",
  },
  // 遠近
  PROGRESSIVE: {
    CODE: "3",
    NAME: "Progressive",
  },
  // 中近
  MID_NEAR: {
    CODE: "4",
    NAME: "Mid-Near",
  },
  // 近近
  BI_FOCAL: {
    CODE: "5",
    NAME: "Bi-Focal",
  },
  SUPPORT: {
    CODE: "7",
    NAME: "Support",
  },
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
  REFRACTIVE_INDEX_NAME: 5,
};

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

export const ErrorCodes = new Set(["DPFM_RCPT_0001"]);

export const PingInterval = {
  // 1.5秒
  ONE_AND_HALF_SEC: 1_500,
  // 30秒
  THIRTY_SEC: 30_000,
  // 1分
  ONE_MIN: 60_000,
  // 15秒
  FIFTEEN_SEC: 15_000,
};

export const WS_ERROR_CODES = {
  // 接続コードを閉じる
  CLOSE_CONNECTION: 1000,
  // エラーコード
  ERROR: 4000,
};

export const HEADERS = {
  // ジンズ トレースID
  JINS_TRACE_ID: "2389c607-f5ed-4789-95a3-efd78be1e8d9",
  // ジンズユーザーID
  JINS_USER_ID: "U00001",
  // ジンズ トレースID 支店番号
  JINS_TRACE_ID_BRANCH_NO: "1",
};

export const SortOrder = {
  // 昇順
  ASC: "asc",
  // 降順
  DESC: "desc",
};

export const BUFFER_MIN = 5;
export const MAX_WAIT_TIME = 120;
