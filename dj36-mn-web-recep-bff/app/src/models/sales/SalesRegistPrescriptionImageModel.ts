import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { EventCode, SubEventCode } from "~/src/compornents/eventCode";
import { ItemGroupRequestInfo } from "~/src/compornents/rootType";
import {
  getSuccessRegistResult,
  SalesOperationRegistResult,
} from "~/src/models/sales/SalesOperationRegistResult";
import { Prescription, PrescriptionType } from "~/src/models/sales/Prescription";
import { SalesRegistModelTemplate } from "~/src/models/sales/SalesRegistModelTemplate";
import { PrescriptionImageData } from "~/src/models/sales/PrescriptionImageData";
import { Suite } from "~/src/models/sales/Suite";
import { logger } from "~/src/logging/logger";
import { fixSystemDatetimeForDpfm } from "~/src/utils/fixDatetime";

/**
 * カート登録・更新（処方箋画像）モデル
 */
export class SalesRegistPrescriptionImageModel extends SalesRegistModelTemplate {
  /**
   * バリデーションチェック
   * @param itemGroupRequestInfo
   * @returns SalesOperationResult
   */
  protected override validateRequest(
    itemGroupRequestInfo: ItemGroupRequestInfo,
  ): SalesOperationRegistResult {
    // 処方箋画像のチェック
    if (itemGroupRequestInfo.prescription?.prescriptionData != undefined) {
      const validateResult = this.vaidatePrescriptionData(
        itemGroupRequestInfo.prescription?.prescriptionData,
      );
      if (validateResult.status != 200) {
        return validateResult;
      }
      logger.info("Checked prescription image validation.  (No2)");
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
    if (itemGroupRequestInfo.prescription != undefined) {
      suite.setEventCode(EventCode.REGISTERED);
      // リクエストの度数情報が指定されているときは処方箋画像を登録する。
      let prescriptionInfoItem = suite.getLineItem("prescriptionInfo");
      const prescriptionData = PrescriptionImageData.makeImageURI(
        itemGroupRequestInfo.prescription.prescriptionData!,
      );
      const now = fixSystemDatetimeForDpfm()!;
      if (prescriptionInfoItem == undefined) {
        const prescription = new Prescription();
        prescription.setPrescriptionRegistDate(now);
        prescriptionInfoItem = {
          operationCode: "01", // 登録
          preparation1: prescription.toJSON(),
          preparation2: prescriptionData,
        };
        suite.setSubEventCode(SubEventCode.ADD);
      } else {
        prescriptionInfoItem.operationCode ??= "02"; // 更新

        // 度数情報が設定されている場合、更新
        if (prescriptionInfoItem.preparation1 != undefined) {
          const prescription = new Prescription(prescriptionInfoItem.preparation1);
          // 処方箋ID
          prescription.setPrescriptionId(undefined);
          prescription.setPrescriptionRegistDate(now);
          prescriptionInfoItem.preparation1 = prescription.toJSON();
        }
        prescriptionInfoItem.preparation2 = prescriptionData;
        suite.setSubEventCode(SubEventCode.CHANGE);
      }
      suite.updateLineItem("prescriptionInfo", prescriptionInfoItem);
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
    // チェック項目なし
    return getSuccessRegistResult();
  }
}
