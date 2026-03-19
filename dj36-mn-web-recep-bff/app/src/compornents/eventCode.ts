/**
 * 処理コード
 */
export const EventCode = {
  // 受付
  CHECK_IN: "000",
  // 度数登録
  REGISTERED: "100",
  // 測定
  MEAS: "150",
  // フレーム
  FRAME: "200",
  // レンズ
  LENSES: "300",
  // ケース
  CASE: "400",
  // 受取方法
  PICK_UP: "500",
  // オーダー確定
  ORDER: "600",
  // カート
  CART: "610",
  // 商品グループ
  ITEM_GROUP: "620",
  // 会計
  PAYMENT: "700",
  // 加工開始
  START_PROCESSING: "800",
  // 加工終了
  FINISH_PROCESSING: "850",
  // 受け渡し
  DELIVER: "900",
  // 調整
  ADJUSTMENT: "951",
  // General help
  GENERAL_HELP: "952",
};

/**
 * サブ処理コード
 */
export const SubEventCode = {
  CALLING: "000",  // 呼出
  CHECK_IN: "010", // 受付
  CANCEL: "020", // 取消
  ADSENSE: "030",  // 不在
  RESET: "031",  // reset
  UNDO: "032",  // undo
  ADD: "100",  // 登録
  CHANGE: "110", // 更新
  DELETE: "120", // 削除
  CHECK: "200", // 確認
}
