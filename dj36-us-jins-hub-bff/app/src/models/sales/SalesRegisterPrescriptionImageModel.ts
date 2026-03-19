import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { EventCode, SubEventCode } from "~/src/components/eventCode";
import {
  getSuccessRegisterResult,
  SuccessRegisterResult,
} from "~/src/models/sales/SalesOperationRegisterResult";
import { Prescription } from "~/src/models/sales/Prescription";
import { SalesRegisterModelTemplate, ItemGroupRequestInfo } from "~/src/models/sales/SalesRegisterModelTemplate";
import { PrescriptionImageData } from "~/src/models/sales/PrescriptionImageData";
import { Suite } from "~/src/models/sales/Suite";
import { logger } from "~/src/logging/logger";
import { fixSystemDatetimeForDpfm } from "~/src/utils/fixDatetime";

/**
 * カート登録・更新（処方箋画像）モデル
 */
export class SalesRegisterPrescriptionImageModel extends SalesRegisterModelTemplate {
  /**
   * バリデーションチェック
   * @param itemGroupRequestInfo
   * @returns SuccessRegisterResult
   */
  protected override validateRequest(
    itemGroupRequestInfo: ItemGroupRequestInfo,
  ): SuccessRegisterResult {
    // 処方箋画像のチェック
    if (itemGroupRequestInfo.prescription?.prescriptionData != undefined) {
      this.validatePrescriptionData(
        itemGroupRequestInfo.prescription?.prescriptionData,
      );
      logger.info("Checked prescription image validation.  (No2)");
    }
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
    if (itemGroupRequestInfo.prescription != undefined) {
      suite.setEventCode(EventCode.REGISTERED.CODE);
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
