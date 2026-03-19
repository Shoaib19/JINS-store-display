import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { EventCode, SubEventCode } from "~/src/compornents/eventCode";
import { ItemGroupRequestInfo } from "~/src/compornents/rootType";
import {
  getRegistResult,
  getSuccessRegistResult,
  SalesOperationRegistResult,
} from "~/src/models/sales/SalesOperationRegistResult";
import { SalesRegistModelTemplate } from "~/src/models/sales/SalesRegistModelTemplate";
import { ItemType, Suite } from "~/src/models/sales/Suite";
import { logger } from "~/src/logging/logger";
import { ItemCode } from "~/src/compornents/const";

/**
 * カート登録・更新（ケース）モデル
 */
export class SalesRegistCaseModel extends SalesRegistModelTemplate {
  /**
   * バリデーションチェック
   * @param itemGroupRequestInfo
   * @returns SalesOperationResult
   */
  protected override validateRequest(
    itemGroupRequestInfo: ItemGroupRequestInfo,
  ): SalesOperationRegistResult {
    // チェック項目なし
    return getSuccessRegistResult();
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
    suite.setEventCode(EventCode.CASE);
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

      // // セリートを登録する。
      // const cerritoItemCode = ItemCode.SERVICE_CERRITO;
      // let cerritoItem = suite.getLineItem("cerrito");
      // if (cerritoItem == undefined) {
      //   cerritoItem = {
      //     operationCode: "01", // 登録
      //     itemCode: cerritoItemCode,
      //   };
      // } else {
      //   cerritoItem.itemCode = cerritoItemCode;
      //   cerritoItem.operationCode ??= "02"; // 更新
      // }
      // suite.updateLineItem("cerrito", cerritoItem);
    }
    // 備考の設定があれば更新
    if (itemGroupRequestInfo.note != undefined) {
      suite.itemGroup.note = itemGroupRequestInfo.note;
    }
    logger.info("Unioned the cart item and the request item. (No3.3)");
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
  ): Promise<SalesOperationRegistResult> {
    const verifyFn: ((
      dpfmRequestInfo: DpfmRequestInfo,
      suite: Suite,
    ) => Promise<SalesOperationRegistResult>)[] = [
      this.verifyItem, //  5.1 商品に関するチェック
      //  6.1 フレーム・メガネケースの全国在庫照会（12-4スコープでも対象外）
      this.checkFrameStockInStore, // 6.2 フレーム・メガネケースの店舗在庫照会(フレーム)
      this.checkCaseStockInStore, // 6.2 フレーム・メガネケースの店舗在庫照会(ケース)
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
  ): Promise<SalesOperationRegistResult> {
    const itemList: ItemType[] = [
      "case",
      "cerrito",
    ];
    for (const itemType of itemList) {
      if (suite.getItemCode(itemType) != undefined) {
        const itemId = await suite.findItemId(itemType, dpfmRequestInfo);
        if (itemId == undefined) {
          logger.info(`Item not found.`);
          return getRegistResult(
            400,
            "Specified data not found error occurred.",
          );
        }
      }
    }
    logger.info("Checked the items info. (No5.1)");
    return getSuccessRegistResult();
  }
}
