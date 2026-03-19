import { DpfmRequestInfo, generateDpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { logger } from "~/src/logging/logger";
import { Cart } from "~/src/models/sales/Cart";
import {
  SalesOperationResult,
  SaleOperationModelTemplate,
  CartInfoPostRequest,
} from "~/src/models/sales/SalesOperationModelTemplate";
import {
  getFailureRegisterResult,
  getSuccessRegisterResult,
  mergeRegisterResult,
  SalesOperationRegisterResult,
  SuccessRegisterResult,
} from "~/src/models/sales/SalesOperationRegisterResult";
import { Suite } from "~/src/models/sales/Suite";
import { ApplicationError, BaseError } from "~/src/components/errors";

/**
 * カート登録・更新（チェックアウト）モデル
 */
export class SalesCheckoutModel extends SaleOperationModelTemplate {
  /**
   * 実行
   * @param dpfmRequestInfo
   * @param cartInfoPostRequest
   * @returns Promise<SalesOperationResult> 処理結果
   */
  public override async execute(
    dpfmRequestInfo: DpfmRequestInfo,
    cartInfoPostRequest: CartInfoPostRequest,
  ): Promise<SalesOperationResult> {
    logger.info(cartInfoPostRequest);
    const cartId = cartInfoPostRequest.cartId;
    const cart: Cart = await this.getCart(dpfmRequestInfo, cartId, cartInfoPostRequest.warrantyExchange);

    // チェックアウト時はカートに入ってるすべてに対してチェックアウトを実施
    const registerCheckResultList: SalesOperationRegisterResult[] =
      await Promise.all(
        cart.suites.map(async (suite) => {
          try {
            return await this.checkoutSuite(
              generateDpfmRequestInfo(
                dpfmRequestInfo.bffRequest,
                suite.getSuiteNo()
              ),
              suite
            );
          } catch(error) {
            if (error instanceof BaseError) {
              logger.error(`(Set ${suite.getSuiteNo()}): ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
              return getFailureRegisterResult(error.messages??error.message);
            }
            throw error;
          }
        })
      );
    const result = mergeRegisterResult([getSuccessRegisterResult(), ...registerCheckResultList]);
    const executeResult: SalesOperationResult = {
      status: result.status,
      data: result,
    };
    return executeResult;
  }

  /**
   * チェックアウト（商品グループ）
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SuccessRegisterResult> 処理結果
   */
  private async checkoutSuite(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    // 3.4 カート登録状況の確認
    this.validateRegistered(suite);

    // 度数情報の登録状況の確認
    this.validatePrescriptionRegistered(suite);

    const verifyFn = [
      this.verifyDiameterShortage, //  5.3 レンズに関するチェック(径不足チェック)
      this.verifyEyePoint, //  5.3 レンズに関するチェック(アイポイントチェック)

      //  6.1 フレーム・メガネケースの全国在庫照会（12-4スコープでも対象外）
      this.checkFrameStockInStore, // 6.2 フレーム・メガネケースの店舗在庫照会(フレーム)
      this.checkCaseStockInStore, // 6.2 フレーム・メガネケースの店舗在庫照会(ケース)
      this.checkLensStockInStore, // 6.3 レンズの在庫照会
      this.checkCerritoStockInStore //セリートの在庫照会
    ];
    return await this.verifyFnList(dpfmRequestInfo, suite, verifyFn);
  }

  /**
   * カート登録状況の確認
   * @param suite
   * @returns SuccessRegisterResult
   */
  private validateRegistered(suite: Suite): SuccessRegisterResult {
    const isItemsRegistered = (suite: Suite): boolean => {
      // 処方箋画像が設定されていること
      if (suite.hasRequiredPrescriptionImage() == false) {
        logger.info(`no prescription image. : ${JSON.stringify(suite)}`);
        return false;
      }
      // フレームが設定されていること
      if (suite.isFrameRegistered() == false) {
        logger.info(`no frame. : ${JSON.stringify(suite)}`);
        return false;
      }
      // ケースが設定されていること
      if (suite.isCaseRegistered() == false) {
        logger.info(`no case. : ${JSON.stringify(suite)}`);
        return false;
      }
      // セリートが設定されていること
      if (suite.isCerritoRegistered() == false) {
        logger.info(`no cerrito. : ${JSON.stringify(suite)}`);
        return false;
      }
      // レンズオプションが設定されていること
      if (suite.isLensOptionRegistered() == false) {
        logger.info(`no lens options. : ${JSON.stringify(suite)}`);
        return false;
      }
      return true;
    };

    // 3.4 カート登録状況の確認
    if (isItemsRegistered(suite) == false) {
      throw new ApplicationError(
        "Validation error occurred."
      );
    }
    logger.info("Checked the cart item validation. (No3.4)");
    return getSuccessRegisterResult();
  }

  /**
   * 度数情報の登録状態の確認
   * @param suite
   * @returns SuccessRegisterResult
   */
  private validatePrescriptionRegistered(
    suite: Suite,
  ): SuccessRegisterResult {
    // 3.5 度数情報の登録状態のチェック
    if (suite.isSetPrescription() == false) {
      throw new ApplicationError(
        "Validation error occurred."
      );
    }
    logger.info("Checked the prescription info validation. (No3.5)");

    return getSuccessRegisterResult();
  }
}
