import { Request } from "express";
import { CartInfoPostRequest, SaleOperationModelTemplate } from "~/src/models/sales/SalesOperationModelTemplate";
import { SalesCheckoutModel } from "~/src/models/sales/SalesCheckoutModel";
import { SalesRegisterCaseModel } from "~/src/models/sales/SalesRegisterCaseModel";
import { SalesRegisterCerritoModel } from "~/src/models/sales/SalesRegisterCerritoModel";
import { SalesRegisterFrameModel } from "~/src/models/sales/SalesRegisterFrameModel";
import { SalesRegisterLensOptionModel } from "~/src/models/sales/SalesRegisterLensOptionModel";
import { SalesRegisterNoteModel } from "~/src/models/sales/SalesRegisterNoteModel";
import { SalesRegisterPrescriptionImageModel } from "~/src/models/sales/SalesRegisterPrescriptionImageModel";
import { SalesRegisterPrescriptionInfoModel } from "~/src/models/sales/SalesRegisterPrescriptionInfoModel";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";
import { ValidationError } from "~/src/components/errors";

/**
 * SaleOperationModel の Factory
 */

export class SalesOperationModelFactory {
  /**
   * カート登録・変更APIリクエスト から SaleOperationModelを作成する
   * @param req カート登録・変更APIリクエスト
   * @param cartInfoPostRequest カート登録・変更APIリクエストボディ
   * @returns SaleOperationModelTemplate
   */
  public static create(
    req: Request,
    cartInfoPostRequest: CartInfoPostRequest,
  ): SaleOperationModelTemplate {
    // 商品種別コード で判定
    switch (cartInfoPostRequest.itemCategoryCode) {
      case "01": // フレーム
        return new SalesRegisterFrameModel();
      case "04": // ケース
        return new SalesRegisterCaseModel();
      case "05": // セリート
        return new SalesRegisterCerritoModel();
      case "11": // 度数情報
        return new SalesRegisterPrescriptionInfoModel(getStoreTimeZone(req));
      case "12": // レンズオプション
        return new SalesRegisterLensOptionModel();
      case "13": // 処方箋画像
        return new SalesRegisterPrescriptionImageModel();
      case "21": // 備考
        return new SalesRegisterNoteModel();
      case "91": // チェックアウト
        return new SalesCheckoutModel();
    }
    throw new ValidationError("itemCategoryCode is invalid.");
  }
}
