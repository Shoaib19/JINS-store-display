import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { EventCode, SubEventCode } from "~/src/components/eventCode";
import {
  getSuccessRegisterResult,
  SuccessRegisterResult,
} from "~/src/models/sales/SalesOperationRegisterResult";
import { SalesRegisterModelTemplate, ItemGroupRequestInfo } from "~/src/models/sales/SalesRegisterModelTemplate";
import { Suite } from "~/src/models/sales/Suite";
import { logger } from "~/src/logging/logger";

/**
 * カート登録・更新（備考）モデル
 */
export class SalesRegisterNoteModel extends SalesRegisterModelTemplate {
  /**
   * バリデーションチェック
   * @param _itemGroupRequestInfo
   * @returns SuccessRegisterResult
   */
  protected override validateRequest(
    _itemGroupRequestInfo: ItemGroupRequestInfo,
  ): SuccessRegisterResult {
    // チェック項目なし
    return getSuccessRegisterResult();
  }

  /**
   * カート情報にリクエスト内容を結合
   * @param itemGroupRequestInfo
   * @param suite
   */
  protected override mergeRequest(
    itemGroupRequestInfo: ItemGroupRequestInfo,
    suite: Suite,
  ): void {
    suite.setEventCode(EventCode.ITEM_GROUP.CODE);
    suite.setSubEventCode(SubEventCode.CHANGE);
    // 備考の設定があれば更新
    if (itemGroupRequestInfo.note != undefined) {
      suite.itemGroup.note = itemGroupRequestInfo.note;
    }
    logger.info("Union the cart item and the request item. (No3.3)");
  }

  /**
   * カート内容チェック
   * @param _dpfmRequestInfo
   * @param _suite
   * @returns
   */
  protected override async verify(
    _dpfmRequestInfo: DpfmRequestInfo,
    _suite: Suite,
  ): Promise<SuccessRegisterResult> {
    // チェック項目なし
    return getSuccessRegisterResult();
  }
}
