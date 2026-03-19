import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { EventCode, SubEventCode } from "~/src/components/eventCode";
import { logger } from "~/src/logging/logger";
import {
  getSuccessRegisterResult,
  SuccessRegisterResult,
} from "~/src/models/sales/SalesOperationRegisterResult";
import { SalesRegisterModelTemplate, ItemGroupRequestInfo } from "~/src/models/sales/SalesRegisterModelTemplate";
import { Suite } from "~/src/models/sales/Suite";
import { ApplicationError } from "~/src/components/errors";

/**
 * カート登録・更新（フレーム）モデル
 */
export class SalesRegisterFrameModel extends SalesRegisterModelTemplate {
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
    suite.setEventCode(EventCode.FRAME.CODE);
    // フレーム・レンズ交換オプション取得
    let frameItem = suite.getLineItem("frame");
    let lensReplacementItem = suite.getLineItem("lensReplacement");
    if (itemGroupRequestInfo.frame?.frameCode != undefined) {
      // フレームコードが指定されているときはフレームを登録し、レンズ交換オプションを削除する。
      suite.itemGroup.isExchangeLens = false;
      // フレーム
      if (frameItem == undefined) {
        frameItem = {
          operationCode: "01", // 登録
          itemCode: itemGroupRequestInfo.frame.frameCode,
          lot: itemGroupRequestInfo.frame.lot
        };
        suite.setSubEventCode(SubEventCode.ADD);
      } else {
        frameItem.operationCode ??= "02"; // 更新
        frameItem.itemCode = itemGroupRequestInfo.frame.frameCode;
        frameItem.lot = itemGroupRequestInfo.frame.lot
        suite.setSubEventCode(SubEventCode.CHANGE);
      }
      suite.updateLineItem("frame", frameItem);
      // レンズ交換オプション（あれば削除）
      if (lensReplacementItem != undefined) {
        lensReplacementItem.operationCode ??= "03"; // 削除
        suite.updateLineItem("lensReplacement", lensReplacementItem);
      }
    } else if (
      itemGroupRequestInfo.lensReplacement?.lensReplacementFlag == true
    ) {
      // レンズ交換が指定されているときはフレームを削除し、レンズ交換オプションを登録する。
      suite.itemGroup.isExchangeLens = true;
      // フレーム（あれば削除）
      if (frameItem != undefined) {
        frameItem.operationCode ??= "03"; // 削除
        suite.updateLineItem("frame", frameItem);
      }
      // レンズ交換オプション
      if (lensReplacementItem == undefined) {
        lensReplacementItem = {
          operationCode: "01", // 登録
        };
        suite.setSubEventCode(SubEventCode.ADD);
      } else {
        lensReplacementItem.operationCode ??= "02"; // 更新
        suite.setSubEventCode(SubEventCode.CHANGE);
      }
      suite.updateLineItem("lensReplacement", lensReplacementItem);
    } else {
      suite.itemGroup.isExchangeLens = false;
      // レンズ交換オプション（あれば削除）
      if (lensReplacementItem != undefined) {
        lensReplacementItem.operationCode ??= "03"; // 削除
        suite.updateLineItem("lensReplacement", lensReplacementItem);
      }
      suite.setSubEventCode(SubEventCode.CHANGE);
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
    const verifyFn = [
      this.verifyItem, //  5.1 商品に関するチェック
      this.verifyDiameterShortage, //  5.3 レンズに関するチェック(径不足チェック)
      this.verifyEyePoint, //  5.3 レンズに関するチェック(アイポイントチェック)

      //  6.1 フレーム・メガネケースの全国在庫照会（12-4スコープでも対象外）
      this.checkFrameStockInStore, // 6.2 フレーム・メガネケースの店舗在庫照会(フレーム)
      this.checkCaseStockInStore, // 6.2 フレーム・メガネケースの店舗在庫照会(ケース)
      this.checkCerritoStockInStore, // 6.2 フレーム・メガネケースの店舗在庫照会(セリート)
      this.checkLensStockInStore, // 6.3 レンズの在庫照会
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
    if (suite.getItemCode("frame") != undefined) {
      const itemId = await suite.findItemId("frame", dpfmRequestInfo);
      if (itemId == undefined) {
        logger.info(`Item not found.`);
        throw new ApplicationError(
          "Specified data not found error occurred.");
      }
    }
    logger.info("Checked the items info. (No5.1)");
    return getSuccessRegisterResult();
  }
}
