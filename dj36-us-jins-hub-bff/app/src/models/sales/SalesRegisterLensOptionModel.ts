import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { SubEventCode, EventCode } from "~/src/components/eventCode";
import {
  getSuccessRegisterResult,
  SuccessRegisterResult,
} from "~/src/models/sales/SalesOperationRegisterResult";
import { SalesRegisterModelTemplate, ItemGroupRequestInfo } from "~/src/models/sales/SalesRegisterModelTemplate";
import { Suite, ItemType } from "~/src/models/sales/Suite";
import { logger } from "~/src/logging/logger";
import { ApplicationError } from "~/src/components/errors";

/**
 * カート登録・更新（レンズオプション）モデル
 */
export class SalesRegisterLensOptionModel extends SalesRegisterModelTemplate {
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
    // カート明細に登録
    const mergeItem = (itemType: ItemType, itemCode?: string | null) => {
      // レンズオプション取得
      let lensOptionItem = suite.getLineItem(itemType);
      if (lensOptionItem == undefined) {
        lensOptionItem = {
          operationCode: "01", // 登録
          itemCode: itemCode??undefined,
        };
          suite.setSubEventCode(SubEventCode.ADD);
      } else {
        if (itemCode) {
          // 更新あり
          lensOptionItem.operationCode ??= "02"; // 更新
          lensOptionItem.itemCode = itemCode;
          suite.setSubEventCode(SubEventCode.CHANGE);
        } else {
          lensOptionItem.operationCode ??= "03"; // 削除
        }
      }
      suite.updateLineItem(itemType, lensOptionItem);
    };

    suite.setEventCode(EventCode.LENSES.CODE);
    // レンズOP（販売用カラー名称）
    mergeItem(
      "salesColorName",
      itemGroupRequestInfo.lensOptionCode?.salesColorNameItemCode,
    );
    // レンズOP（販売用レンズ仕様）
    mergeItem(
      "salesLensSpec",
      itemGroupRequestInfo.lensOptionCode?.salesLensSpecItemCode,
    );
    // レンズOP（焦点分類）※度数情報で登録するため実施しない
    // レンズOP（累進分類）
    mergeItem(
      "progressiveCategory",
      itemGroupRequestInfo.lensOptionCode?.progressiveCategoryItemCode,
    );
    // レンズOP（屈折率名称）
    mergeItem(
      "refractiveIndexName",
      itemGroupRequestInfo.lensOptionCode?.refractiveIndexNameItemCode,
    );

    if (itemGroupRequestInfo.lensReplacement?.lensReplacementFlag == true) {
      // レンズ交換フラグが設定されている場合のみ実施（レンズ交換フラグの切り替えは、フレーム登録時に実施）
      // レンズ交換オプション取得
      let lensReplacementItem = suite.getLineItem("lensReplacement");
      if (lensReplacementItem == undefined) {
        lensReplacementItem = {
          operationCode: "01", // 登録
          itemCode:
            itemGroupRequestInfo.lensReplacement.lensReplacementTypeCode??undefined,
        };
        suite.setSubEventCode(SubEventCode.ADD);
      } else {
        lensReplacementItem.operationCode ??= "02"; // 更新
        lensReplacementItem.itemCode =
          itemGroupRequestInfo.lensReplacement.lensReplacementTypeCode??undefined;
        suite.setSubEventCode(SubEventCode.CHANGE);
      }
      suite.updateLineItem("lensReplacement", lensReplacementItem);
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
   * @returns Promise<SuccessRegisterResult>
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
      this.verifyEyesightCombi, //   5.3 レンズに関するチェック(度数組み合わせチェック)
      this.verifyDiameterShortage, // 5.3 レンズに関するチェック(径不足チェック)
      this.verifyEyePoint, // 5.3 レンズに関するチェック(アイポイントチェック)
      this.checkLensStockInStore, // 6.3 レンズの在庫照会
    ];
    return await this.verifyFnList(dpfmRequestInfo, suite, verifyFn);
  }

  /**
   * 商品に関するチェック（指定された商品コードの商品が登録されているか判定）
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SuccessRegisterResult>
   */
  protected async verifyItem(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    const itemList: ItemType[] = [
      "salesColorName",
      "salesLensSpec",
      "progressiveCategory",
      "refractiveIndexName",
      "lensReplacement",
    ];
    for (const itemType of itemList) {
      if (suite.getItemCode(itemType) != undefined) {
        const itemId = await suite.findItemId(itemType, dpfmRequestInfo);
        if (itemId == undefined) {
          logger.info(`Item not found.`);
          throw new ApplicationError(
            "Specified data not found error occurred.");
        }
      }
    }
    logger.info("Checked the items info. (No5.1)");
    return getSuccessRegisterResult();
  }
}
