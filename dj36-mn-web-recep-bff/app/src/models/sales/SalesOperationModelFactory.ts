import { Request } from "express";
import { SaleOperationModelTemplate } from "~/src/models/sales/SaleOperationModelTemplate";
import { SalesCheckoutModel } from "~/src/models/sales/SalesCheckoutModel";
import { CartInfoPostRequest } from "~/src/compornents/rootType";
import { SalesRegistCaseModel } from "~/src/models/sales/SalesRegistCaseModel";
import { SalesRegistFrameModel } from "~/src/models/sales/SalesRegistFrameModel";
import { SalesRegistLensOptionModel } from "~/src/models/sales/SalesRegistLensOptionModel";
import { SalesRegistNoteModel } from "~/src/models/sales/SalesRegistNoteModel";
import { SalesRegistPrescriptionImageModel } from "~/src/models/sales/SalesRegistPrescriptionImageModel";
import { SalesRegistPrescriptionInfoModel } from "~/src/models/sales/SalesRegistPrescriptionInfoModel";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";

/**
 * SaleOperationModel の Factory
 */

export class SalesOperationModelFactory {
  /**
   * カート登録・変更APIリクエスト から SaleOperationModelを作成する
   * @param req カート登録・変更APIリクエスト
   * @param cartInfoPostRequest カート登録・変更APIリクエストボディ
   * @returns SaleOperationModel|undefined
   */
  public static create(
    req: Request,
    cartInfoPostRequest: CartInfoPostRequest,
  ): SaleOperationModelTemplate | undefined {
    // 商品種別コード で判定
    switch (cartInfoPostRequest.itemCategoryCode) {
      case "01": // フレーム
        return new SalesRegistFrameModel();
      case "04": // ケース
        return new SalesRegistCaseModel();
      case "11": // 度数情報
        return new SalesRegistPrescriptionInfoModel(getStoreTimeZone(req));
      case "12": // レンズオプション
        return new SalesRegistLensOptionModel();
      case "13": // 処方箋画像
        return new SalesRegistPrescriptionImageModel();
      case "21": // 備考
        return new SalesRegistNoteModel();
      case "91": // チェックアウト
        return new SalesCheckoutModel();
    }
  }
}
