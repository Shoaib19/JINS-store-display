import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { EventCode, SubEventCode } from "~/src/compornents/eventCode";
import { ItemGroupRequestInfo } from "~/src/compornents/rootType";
import {
  getRegistResult,
  getSuccessRegistResult,
  SalesOperationRegistResult,
} from "~/src/models/sales/SalesOperationRegistResult";
import { Prescription } from "~/src/models/sales/Prescription";
import {
  isPerspectiveTypeCode,
  perspectiveTypeCodeMap,
} from "~/src/models/sales/PerspectiveTypeCodeMap";
import { SalesRegistModelTemplate } from "~/src/models/sales/SalesRegistModelTemplate";
import { Suite } from "~/src/models/sales/Suite";
import { logger } from "~/src/logging/logger";
import { fixDate } from "~/src/utils/fixDatetime";
import { toUTCDateFromString } from "~/src/utils/fixDatetime";

/**
 * カート登録・更新（度数情報）モデル
 */
export class SalesRegistPrescriptionInfoModel extends SalesRegistModelTemplate {

  /** タイムゾーン */
  private timeZone: string;
  /**
   * コンストラクタ
   * @param timeZone 
   */
  constructor(timeZone: string) {
    super();
    this.timeZone = timeZone;
  }

  /**
   * バリデーションチェック
   * @param itemGroupRequestInfo
   * @returns SalesOperationResult
   */
  protected override validateRequest(
    itemGroupRequestInfo: ItemGroupRequestInfo,
  ): SalesOperationRegistResult {
    // 度数情報の必須項目チェック
    const validateResult = this.validatePrescriptionItems(itemGroupRequestInfo);
    if (validateResult.status != 200) {
      return validateResult;
    }
    logger.info("Checked prescription validation.  (No2)");

    return getSuccessRegistResult();
  }

  /**
   * 度数情報の必須項目チェック
   * @param itemGroupRequestInfo
   * @returns SalesOperationResult
   */
  private validatePrescriptionItems(
    itemGroupRequestInfo: ItemGroupRequestInfo,
  ) {
    const isValidPrescription = (
      itemGroupRequestInfo: ItemGroupRequestInfo,
    ): boolean => {
      if (itemGroupRequestInfo.prescription == undefined) {
        // 度数情報が設定されていない
        return false;
      }
      const prescription = itemGroupRequestInfo.prescription;
      if (
        isPerspectiveTypeCode(
          prescription.prescriptionInfo?.perspectiveTypeCode,
        ) == false
      ) {
        // 遠中近区分コードが不正
        return false;
      }
      return true;
    };

    if (!isValidPrescription(itemGroupRequestInfo)) {
      return getRegistResult(400, "The prescription item is insufficient.");
    }
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
    suite.setEventCode(EventCode.REGISTERED);
    if (itemGroupRequestInfo.prescription != undefined) {
      // 度数情報を設定
      let prescriptionInfoItem = suite.getLineItem("prescriptionInfo");
      // 処方箋期限 は個別書式で登録されるのでデジタル基盤の書式に変える。
      const prescription = structuredClone(itemGroupRequestInfo.prescription);
      if ( prescription.prescriptionExpiration ) {
        prescription.prescriptionExpiration = fixDate(toUTCDateFromString(
          prescription.prescriptionExpiration,
          this.timeZone
        ));
      } 
      const requestPrescription = new Prescription(prescription);
      if (prescriptionInfoItem?.preparation1 != undefined) {
        // 度数情報があるときは、登録日(prescriptionRegistDate)を引き継ぐ
        const oldPrescription = new Prescription(
          prescriptionInfoItem?.preparation1
        );
        requestPrescription.setPrescriptionRegistDate(oldPrescription.getPrescriptionRegistDate());
      }
      const preparation1 = requestPrescription.toJSON();
      if (prescriptionInfoItem == undefined) {
        prescriptionInfoItem = {
          operationCode: "01", // 登録
          preparation1: preparation1,
        };
        suite.setSubEventCode(SubEventCode.ADD);
      } else {
        prescriptionInfoItem.operationCode ??= "02"; // 更新
        prescriptionInfoItem.preparation1 = preparation1;
        suite.setSubEventCode(SubEventCode.CHANGE);
      }
      suite.updateLineItem("prescriptionInfo", prescriptionInfoItem);

      // レンズOP（焦点分類）を登録
      if (
        isPerspectiveTypeCode(
          itemGroupRequestInfo.prescription.prescriptionInfo
            ?.perspectiveTypeCode,
        )
      ) {
        let focusCategoryItem = suite.getLineItem("focusCategory");
        // 遠中近区分から焦点分類を取得
        const focusCategoryItemCode =
          perspectiveTypeCodeMap[
            itemGroupRequestInfo.prescription.prescriptionInfo!.perspectiveTypeCode
          ].focusCategoryItemCode;
        if (focusCategoryItem == undefined) {
          focusCategoryItem = {
            operationCode: "01", // 登録
            itemCode: focusCategoryItemCode,
          };
        } else {
          focusCategoryItem.operationCode ??= "02"; // 更新
          focusCategoryItem.itemCode = focusCategoryItemCode;
        }
        suite.updateLineItem("focusCategory", focusCategoryItem);
      }
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
      this.verifyEeyesightCombi, //   5.3 レンズに関するチェック(度数組み合わせチェック)
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
   * @returns
   */
  protected async verifyItem(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SalesOperationRegistResult> {
    if (suite.getItemCode("focusCategory") != undefined) {
      const itemId = await suite.findItemId("focusCategory", dpfmRequestInfo);
      if (itemId == undefined) {
        logger.info(`Item not found.`);
        return getRegistResult(400, "Specified data not found error occurred.");
      }
    }
    logger.info("Checked the items info. (No5.1)");
    return getSuccessRegistResult();
  }
}
