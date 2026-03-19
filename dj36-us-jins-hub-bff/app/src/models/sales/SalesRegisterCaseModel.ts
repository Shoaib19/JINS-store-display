import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { EventCode, SubEventCode } from "~/src/components/eventCode";
import {
  getSuccessRegisterResult,
  SuccessRegisterResult,
} from "~/src/models/sales/SalesOperationRegisterResult";
import { SalesRegisterModelTemplate, ItemGroupRequestInfo } from "~/src/models/sales/SalesRegisterModelTemplate";
import { ItemType, Suite } from "~/src/models/sales/Suite";
import { logger } from "~/src/logging/logger";
import { ApplicationError } from "~/src/components/errors";

/**
 * カート登録・更新（ケース）モデル
 */
export class SalesRegisterCaseModel extends SalesRegisterModelTemplate {
  /**
   * バリデーションチェック
   * @returns SuccessRegisterResult
   */
  protected override validateRequest(): SuccessRegisterResult {
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
    suite.setEventCode(EventCode.CASE.CODE);
    if (itemGroupRequestInfo.caseCode !== undefined) {
      let caseItem = suite.getLineItem("case");
      // ケースコードが指定されているときはケースを登録する。
      if (caseItem == undefined) {
        caseItem = {
          operationCode: "01", // 登録
          itemCode: itemGroupRequestInfo.caseCode??undefined,
        };
        suite.setSubEventCode(SubEventCode.ADD);
      } else {
        caseItem.itemCode = itemGroupRequestInfo.caseCode??undefined;
        caseItem.operationCode ??= "02"; // 更新
        suite.setSubEventCode(SubEventCode.CHANGE);
      }
      caseItem.preparation1 =
        itemGroupRequestInfo.caseCode == null ? "Case None." : undefined; // ケースコードがnullの場合固定文言を設定
      suite.updateLineItem("case", caseItem);
    }
    // 備考の設定があれば更新
    if (itemGroupRequestInfo.note != undefined) {
      suite.itemGroup.note = itemGroupRequestInfo.note;
    }
    logger.info("Union the cart item and the request item. (No3.3)");
  }

  /**
   * カート内容チェック
   * @param dpfmRequestInfo
   * @param suite
   * @returns
   */
  protected override async verify(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    const verifyFn: ((
      dpfmRequestInfo: DpfmRequestInfo,
      suite: Suite,
    ) => Promise<SuccessRegisterResult>)[] = [
      this.verifyItem, //  5.1 商品に関するチェック
      //  6.1 フレーム・メガネケースの全国在庫照会（12-4スコープでも対象外）
      this.checkFrameStockInStore, // 6.2 フレーム・メガネケースの店舗在庫照会(フレーム)
      this.checkCaseStockInStore, // 6.2 フレーム・メガネケースの店舗在庫照会(ケース)
      this.checkCerritoStockInStore // 6.2 フレーム・メガネケースの店舗在庫照会(セリート)
    ];
    return await this.verifyFnList(dpfmRequestInfo, suite, verifyFn);
  }

  /**
   * 商品に関するチェック（指定された商品コードの商品が登録されているか判定）
   * @param dpfmRequestInfo
   * @param suite
   * @returns
   */
  protected async verifyItem(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    const itemList: ItemType[] = [
      "case",
    ];
    for (const itemType of itemList) {
      if (suite.getItemCode(itemType) != undefined) {
        const itemId = await suite.findItemId(itemType, dpfmRequestInfo);
        if (itemId == undefined) {
          logger.info(`Item not found.`);
          throw new ApplicationError(
            "Specified data not found error occurred."
          );
        }
      }
    }
    logger.info("Checked the items info. (No5.1)");
    return getSuccessRegisterResult();
  }
}
