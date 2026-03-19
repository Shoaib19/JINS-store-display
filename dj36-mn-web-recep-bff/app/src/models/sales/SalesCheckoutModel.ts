import { DpfmRequestInfo, generateDpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { logger } from "~/src/logging/logger";
import { Cart } from "~/src/models/sales/Cart";
import { CartInfoPostRequest } from "~/src/compornents/rootType";
import {
  SalesOperationResult,
  SaleOperationModelTemplate,
} from "~/src/models/sales/SaleOperationModelTemplate";
import {
  getRegistResult,
  getSuccessRegistResult,
  mergeRegistResult,
  SalesOperationRegistResult,
} from "~/src/models/sales/SalesOperationRegistResult";
import { Suite } from "~/src/models/sales/Suite";

/**
 * カート登録・更新（チェックアウト）モデル
 */
export class SalesCheckoutModel extends SaleOperationModelTemplate {
  /**
   * 実行
   * @param dpfmRequestInfo
   * @param cartInfoPostRequest
   * @return Promise<SalesOperationResult> 処理結果
   */
  public override async execute(
    dpfmRequestInfo: DpfmRequestInfo,
    cartInfoPostRequest: CartInfoPostRequest,
  ): Promise<SalesOperationResult> {
    logger.info(cartInfoPostRequest);
    const cartId = cartInfoPostRequest.cartId;
    const cart: Cart = await this.getCart(dpfmRequestInfo, cartId, cartInfoPostRequest.warrantyExchange);

    // チェックアウト時はカートに入ってるすべてに対してチェックアウトを実施
    const registerCheckResultList: SalesOperationRegistResult[] =
      await Promise.all(
        cart.suites.map(async (suite) => {
          return await this.checkoutSuite(
            generateDpfmRequestInfo(
              dpfmRequestInfo.bffRequest,
              suite.getSuiteNo()
            ),
            suite
          );
        })
      );
    const result = mergeRegistResult(registerCheckResultList);
    const executeResilt: SalesOperationResult = {
      status: result.status,
      data: result,
    };
    return executeResilt;
  }

  /**
   * チェックアウト（商品グループ）
   * @param dpfmRequestInfo
   * @param suite
   * @return Promise<SalesOperationRegistResult> 処理結果
   */
  private async checkoutSuite(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SalesOperationRegistResult> {
    // 3.4 カート登録状況の確認
    const validateRegisterdResult = this.validateRegisterd(suite);
    if (validateRegisterdResult.status != 200) {
      return validateRegisterdResult;
    }

    const validatePrescriptionRegisterdResult =
      this.validatePrescriptionRegisterd(suite);
    if (validatePrescriptionRegisterdResult.status != 200) {
      return validatePrescriptionRegisterdResult;
    }

    const verifyFn: ((
      dpfmRequestInfo: DpfmRequestInfo,
      suite: Suite,
    ) => Promise<SalesOperationRegistResult>)[] = [
      this.verifyDiameterShortage, //  5.3 レンズに関するチェック(径不足チェック)
      this.verifyEyePoint, //  5.3 レンズに関するチェック(アイポイントチェック)

      //  6.1 フレーム・メガネケースの全国在庫照会（12-4スコープでも対象外）
      this.checkFrameStockInStore, // 6.2 フレーム・メガネケースの店舗在庫照会(フレーム)
      this.checkCaseStockInStore, // 6.2 フレーム・メガネケースの店舗在庫照会(ケース)
      this.checkLensStockInStore, // 6.3 レンズの在庫照会
    ];
    return await this.verifyFnList(dpfmRequestInfo, suite, verifyFn);
  }

  /**
   * カート登録状況の確認
   * @param suite
   * @returns SalesOperationRegistResult
   */
  private validateRegisterd(suite: Suite): SalesOperationRegistResult {
    const isItemsRegisterd = (suite: Suite): boolean => {
      // 処方箋画像が設定されていること
      if (suite.hasRequiedPrescriptionImage() == false) {
        logger.info(`no prescription image. : ${JSON.stringify(suite)}`);
        return false;
      }
      // フレームが設定されていること
      if (suite.isFrameRegisterd() == false) {
        logger.info(`no frame. : ${JSON.stringify(suite)}`);
        return false;
      }
      // ケースが設定されていること
      if (suite.isCaseRegisterd() == false) {
        logger.info(`no case. : ${JSON.stringify(suite)}`);
        return false;
      }
      // レンズオプションが設定されていること
      if (suite.isLensOptionRegisterd() == false) {
        logger.info(`no lens options. : ${JSON.stringify(suite)}`);
        return false;
      }
      return true;
    };

    // 3.4 カート登録状況の確認
    if (isItemsRegisterd(suite) == false) {
      return getRegistResult(400, "Validation error occurred.");
    }
    logger.info("Checked the cart item validation. (No3.4)");
    return getSuccessRegistResult();
  }

  /**
   * 度数情報の登録状態の確認
   * @param suite
   * @returns SalesOperationRegistResult
   */
  private validatePrescriptionRegisterd(
    suite: Suite,
  ): SalesOperationRegistResult {
    // 3.5 度数情報の登録状態のチェック
    if (suite.isSetPrescription() == false) {
      return getRegistResult(400, "Validation error occurred.");
    }
    logger.info("Checked the prescription info validation. (No3.5)");

    return getSuccessRegistResult();
  }
}
