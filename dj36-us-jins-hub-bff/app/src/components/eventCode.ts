/**
 * 処理コード
 */
export const EventCode = {
  // 受付
   CHECK_IN: {
    CODE:"000",
    NAME:"Check-in",
  },
  // 度数登録
  REGISTERED: {
    CODE:"100",
    NAME:"Registered",
  },
  // 測定
  MEAS: {
    CODE:"150",
    NAME:"Measurement",
  },
  // フレーム
  FRAME: {
    CODE:"200",
    NAME:"Frame",
  },
  // レンズ
  LENSES: {
    CODE:"300",
    NAME:"Lenses",
  },
  // ケース
  CASE: {
    CODE:"400",
    NAME:"Case",
  },
  // セリート
  CERRITO: {
    CODE:"410",
    NAME:"Cerrito"
  },
  // 受取方法
  PICK_UP: {
    CODE:"500",
    NAME:"Pick-up",
  },
  // オーダー確定
  ORDER: {
    CODE:"600",
    NAME:"Order",
  },
  // カート
  CART: {
    CODE:"610",
    NAME:"Cart",
  },
  // 商品グループ
  ITEM_GROUP: {
    CODE:"620",
    NAME:"ItemGroup",
  },
  // 会計
  PAYMENT: {
    CODE:"700",
    NAME:"Payment",
  },
  // 加工開始
  START_PROCESSING: {
    CODE:"800",
    NAME:"Start processing",
  },
  // 加工終了
  FINISH_PROCESSING: {
    CODE:"850",
    NAME:"Finish processing",
  },
  // 受け渡し
  DELIVER: {
    CODE:"900",
    NAME:"Deliver",
  },
  // 調整
  ADJUSTMENT: {
    CODE:"951",
    NAME:"Adjustment",
  },
  // General help
  GENERAL_HELP: {
    CODE:"952",
    NAME:"General help",
  },
};

/**
 * サブ処理コード
 */
export const SubEventCode = {
  CALLING: "000",  // 呼出
  CHECK_IN: "010", // 受付
  CANCEL: "020", // 取消
  ABSENCE: "030",  // 不在
  RESET: "031",  // reset
  UNDO: "032",  // undo
  ADD: "100",  // 登録
  CHANGE: "110", // 更新
  DELETE: "120", // 削除
  CHECK: "200", // 確認
}
