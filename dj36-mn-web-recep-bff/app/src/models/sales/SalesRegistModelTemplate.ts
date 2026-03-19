import {
  postLineitems,
  postReceptionEvents,
} from "~/src/clients/carts/cartsClient";
import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { CallingStatus, MAXIMUM_IMAGE_BYTE_SIZE, ReceptionStatus } from "~/src/compornents/const";
import { logger } from "~/src/logging/logger";
import { Cart } from "~/src/models/sales/Cart";
import { PrescriptionImageData } from "~/src/models/sales/PrescriptionImageData";
import {
  ItemGroupRequestInfo,
  CartInfoPostRequest,
} from "~/src/compornents/rootType";
import {
  LineitemPostRequest,
  ReceptionEventsRequest,
} from "~/src/clients/carts/cartsClientTypes";
import { SalesOperationResult } from "~/src/models/sales/SaleOperationModelTemplate";
import {
  getRegistResult,
  getSuccessRegistResult,
  mergeRegistResult,
  SalesOperationRegistResult,
} from "~/src/models/sales/SalesOperationRegistResult";
import { Prescription } from "~/src/models/sales/Prescription";
import { PerspectiveTypeCodeType } from "~/src/models/sales/PerspectiveTypeCodeMap";
import { SaleOperationModelTemplate } from "~/src/models/sales/SaleOperationModelTemplate";
import { Suite } from "~/src/models/sales/Suite";
import { sendApiRequest } from "~/src/utils/fetchService";
import { makeErrorResponse400 } from "~/src/utils/makeErrorResponse400";
import { ErrorResponse } from "~/src/compornents/errors";

////////////////////////////////////////////////////////////////////////////////////////
/**
 * カート登録・更新（カート更新あり）のモデル（基底クラス）
 */
export abstract class SalesRegistModelTemplate extends SaleOperationModelTemplate {
  // バリデーションチェック
  protected abstract validateRequest(
    itemGroupRequestInfo: ItemGroupRequestInfo,
  ): SalesOperationRegistResult;
  // カート情報の更新
  protected abstract mergeRequest(
    itemGroupRequestInfo: ItemGroupRequestInfo,
    suite: Suite,
  ): void;
  // カート状態の検証
  protected abstract verify(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SalesOperationRegistResult>;

  /**
   * カート登録・更新の実施
   * @param dpfmRequestInfo
   * @param cartInfoPostRequest カート登録・変更APIリクエスト
   * @returns Promise<SalesOperationResult>
   */
  public override async execute(
    dpfmRequestInfo: DpfmRequestInfo,
    cartInfoPostRequest: CartInfoPostRequest,
  ): Promise<SalesOperationResult> {
    logger.info(cartInfoPostRequest);
    const cartId = cartInfoPostRequest.cartId;
    const cart: Cart = await this.getCart(dpfmRequestInfo, cartId, cartInfoPostRequest.warrantyExchange);

    // NOTE: check exist itemGroups
    if (cartInfoPostRequest.itemGroups == undefined) {
      //TODO: make error message
      const error: ErrorResponse = makeErrorResponse400(
        ["ItemGroups is undefined."],
        dpfmRequestInfo.bffRequest,
      );
      const executeResult: SalesOperationResult = {
        status: 400,
        data: error,
      };
      return executeResult;
    }
    // リクエストに指定されているitemGroup毎に処理を実施
    const registerCheckResultList: SalesOperationRegistResult[] =
      await Promise.all(
        cartInfoPostRequest.itemGroups!.map(async (requestItemGroup) => {
          const suite = cart.suites
            .filter(
              (suite) =>
                suite.itemGroup.itemGroupCode == requestItemGroup.itemGroupCode,
            )
            .at(0);
          if (suite != undefined) {
            // デジタル基盤へのリクエスト情報（商品グループごと）
            const dpfmSuiteRequestInfo: DpfmRequestInfo =
              generateDpfmRequestInfo(
                dpfmRequestInfo.bffRequest,
                suite.getSuiteNo(),
              );
            // 氏名と電話番号を更新（itemGroup毎に設定されていないため）
            suite.itemGroup.customerName = cartInfoPostRequest.customerName
              ? cartInfoPostRequest.customerName
              : suite.itemGroup.customerName;
            suite.itemGroup.phoneNumber = cartInfoPostRequest.phoneNumber
              ? cartInfoPostRequest.phoneNumber
              : suite.itemGroup.phoneNumber;
            return await this.executeSuite(
              dpfmSuiteRequestInfo,
              requestItemGroup,
              suite,
            );
          } else {
            logger.info(
              `ItemGroup[${requestItemGroup.itemGroupCode}] not found.`,
            );
            return getRegistResult(400, "Validation error occurred.");
          }
        }),
      );
    // 応答をマージ
    const result = mergeRegistResult(registerCheckResultList);
    if (result.status === 200) {
      // カートの登録・更新
      await this.updateCart(dpfmRequestInfo, cart);
      // 受付情報更新
      await this.addReceptionEvents(dpfmRequestInfo, cart);
      logger.info("Updated the receptionEvents. (No9)");
    }
    // マージした応答を返却
    const executeResult: SalesOperationResult = {
      status: result.status,
      data: result,
    };
    return executeResult;
  }

  /**
   * 登録
   * @param dpfmRequestInfo
   * @param itemGroupRequestInfo  カート登録・更新リクエスト（itemGroup）
   * @param suite 商品グループ
   * @returns Promise<SalesOperationResult>
   */
  private async executeSuite(
    dpfmRequestInfo: DpfmRequestInfo,
    itemGroupRequestInfo: ItemGroupRequestInfo,
    suite: Suite,
  ): Promise<SalesOperationRegistResult> {
    let result: SalesOperationRegistResult = getSuccessRegistResult();

    // 2. リクエストチェック
    const validateResult = this.validateRequest(itemGroupRequestInfo);
    logger.info("Checked prescription image validation.  (No2)");
    if (validateResult.status != 200) {
      return validateResult;
    }
    result = mergeRegistResult([result, validateResult]);

    // 3. カート情報にリクエスト内容を結合
    this.mergeRequest(itemGroupRequestInfo, suite);
    // データの修正作業
    this.adjust(suite);

    // 4. カート内容チェック
    const verifyResult = await this.verify(dpfmRequestInfo, suite);
    if (verifyResult.status != 200) {
      return verifyResult;
    }
    result = mergeRegistResult([result, verifyResult]);
    logger.info("Checked the cart item validation. (No3.4)");
    return result;
  }

  /**
   * カートの更新
   *
   * @param dpfmRequestInfo
   * @param cart
   */
  private async updateCart(
    dpfmRequestInfo: DpfmRequestInfo,
    cart: Cart,
  ): Promise<void> {
    // カートの価格更新
    await cart.updateAmount(dpfmRequestInfo);
    logger.info("Updated the price. (No7)");
    // カートの登録・更新
    await this.registerCart(dpfmRequestInfo, cart);
    logger.info("Updated the line items. (No8)");
  }

  /**
   * カート登録
   * @param dpfmRequestInfo
   * @param cart 
   */
  private async registerCart(dpfmRequestInfo: DpfmRequestInfo, cart: Cart) {
    const requestHeader = makeDpfmRequestHeader(dpfmRequestInfo);

    const lineItemsPostRequest: LineitemPostRequest = {
      cartId: cart.cart.cartId!,
      discountPrice: cart.cart.discountPrice,
      subtotal: cart.cart.subtotal,
      totalDiscountPrice: cart.cart.totalDiscountPrice,
      totalTaxPrice: cart.cart.totalTaxPrice,
      totalSalesPrice: cart.cart.totalSalesPrice,
      ItemGroups: cart.suites.map((suite) => suite.toItemGroup()),
    };

    logger.info(
      `lineItemsPostRequest: ${JSON.stringify(lineItemsPostRequest)}`,
    );

    const apiResponse = await sendApiRequest(
      postLineitems,
      lineItemsPostRequest,
      requestHeader,
    );
    logger.info(`lineItemsPostResponse: ${JSON.stringify(apiResponse)}`);
    if (!apiResponse.ok) {
      throw apiResponse;
    }
  }

  /**
   * 受付履歴更新
   * @param dpfmRequestInfo
   * @param cart 
   */
  private async addReceptionEvents(
    dpfmRequestInfo: DpfmRequestInfo,
    cart: Cart,
  ) {
    // 受付ステータス（度数登録情報がそろっている場合「200: カート登録」, それ以外は更新しない）
    const receptionStatusCode = cart.suites.every((suite) => suite.isSetPrescription()) ? ReceptionStatus.ORDER_NEW : undefined;
    // 呼出状態（受付ステータスが「200: カート登録」の場合「000:対象外」, それ以外は更新しない）
    const callingStatusCode = receptionStatusCode === ReceptionStatus.ORDER_NEW ? CallingStatus.NONE : undefined;
    for (const suite of cart.suites) {
      if (suite.getEventCode() != undefined) {
        const requestHeader: Headers = makeDpfmRequestHeader(dpfmRequestInfo);
        const receptionEventsPostRequest: ReceptionEventsRequest = {
          receptionNumber: cart.cart.receptionNumber,
          statusCode: receptionStatusCode,
          callingStatusCode: callingStatusCode,
          itemGroupCode: suite.itemGroup.itemGroupCode,
          eventCode: suite.getEventCode(),
          subEventCode: suite.getSubEventCode(),
        };
        logger.info(
          `receptionEventsPostRequest: ${JSON.stringify(receptionEventsPostRequest)}`,
        );

        const apiResponse = await sendApiRequest(
          postReceptionEvents,
          receptionEventsPostRequest,
          requestHeader,
        );
        logger.info(
          `receptionEventsPostResponse: ${JSON.stringify(apiResponse)}`,
        );
        if (!apiResponse.ok) {
          throw apiResponse;
        }
        logger.info("register the reception event. (No9)");
      }
    }
  }

  /**
   * 処方箋画像チェック
   * @param imageData - 処方箋画像データ
   * @returns SalesOperationResult
   */
  protected vaidatePrescriptionData(
    imageData: string,
  ): SalesOperationRegistResult {
    if (!PrescriptionImageData.isCollectImageSize(imageData)) {
      return getRegistResult(
        400,
        `The uploaded image exceeds the specified size. (Maximum ${MAXIMUM_IMAGE_BYTE_SIZE / 1000000}MB).`,
      );
    }
    if (!PrescriptionImageData.isCollectImageFormat(imageData)) {
      return getRegistResult(
        400,
        `Invalid image upload format. Please upload a file in JPG or PNG format.`,
      );
    }
    return getSuccessRegistResult();
  }

  /**
   * データの修正
   * @param suite
   */
  private adjust(suite: Suite): void {
    const prescriptionInfoItem = suite.getLineItem("prescriptionInfo");
    if (prescriptionInfoItem?.preparation1 != undefined) {
      const prescription = new Prescription(prescriptionInfoItem?.preparation1);
      if (prescription.getPerspectiveTypeCode() != undefined) {
        // perspectiveTypeCodeが「近近」の場合、加入度数(addRight, addLeft)をnullに上書きする
        const clearAddPerspectiveTypeCodeList: readonly (
          | PerspectiveTypeCodeType
          | unknown
        )[] = ["005"];
        if (
          clearAddPerspectiveTypeCodeList.includes(
            prescription.getPerspectiveTypeCode(),
          )
        ) {
          if (
            prescription.getAddRight() != undefined ||
            prescription.getAddLeft() != undefined
          ) {
            // 加入度数(左右)をクリア
            prescription.setAddRight(undefined);
            prescription.setAddLeft(undefined);
            prescriptionInfoItem.preparation1 = prescription.toJSON();
            prescriptionInfoItem.operationCode ??= "02"; // 更新
            suite.updateLineItem("prescriptionInfo", prescriptionInfoItem);
          }
        }
      }
    }
    logger.info("Fixed the item. (No4)");
  }

  /**
   * レンズに関するチェック 度数組み合わせチェック
   * カート変更・登録(チェックアウト以外)時は、設定済み時のみ実施するためオーバーライド
   * @param dpfmRequestInfo
   * @param suite
   * @returns
   */
  protected override async verifyEeyesightCombi(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SalesOperationRegistResult> {
    // 度数情報が設定されているときのみ実施
    if (suite.isSetPrescription()) {
      return await super.verifyEeyesightCombi(dpfmRequestInfo, suite);
    }
    return getSuccessRegistResult();
  }

  /**
   * レンズに関するチェック ②径不足チェック
   * カート変更・登録(チェックアウト以外)時は、設定済み時のみ実施するためオーバーライド
   * @param dpfmRequestInfo
   * @param suite
   * @returns
   */
  protected override async verifyDiameterShortage(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SalesOperationRegistResult> {
    // 登録時のチェックはフレーム・度数情報・レンズオプションが設定されているときのみ実施
    if (
      suite.isFrameRegisterd() &&
      suite.isSetPrescription() &&
      suite.isLensOptionRegisterd()
    ) {
      return await super.verifyDiameterShortage(dpfmRequestInfo, suite);
    }
    return getSuccessRegistResult();
  }

  /**
   * レンズに関するチェック アイポイントチェック
   * カート変更・登録(チェックアウト以外)時は、設定済み時のみ実施するためオーバーライド
   * @param dpfmRequestInfo
   * @param suite
   * @returns
   */
  protected override async verifyEyePoint(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SalesOperationRegistResult> {
    // 登録時のチェックはフレーム・度数情報・レンズオプションが設定されているときのみ実施
    if (
      suite.isFrameRegisterd() &&
      suite.isSetPrescription() &&
      suite.isLensOptionRegisterd()
    ) {
      return await super.verifyEyePoint(dpfmRequestInfo, suite);
    }
    return getSuccessRegistResult();
  }

  /**
   * 店舗在庫照会(フレーム)
   * カート変更・登録(チェックアウト以外)時は、設定済み時のみ実施するためオーバーライド
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SalesOperationResult>
   */
  protected override async checkFrameStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SalesOperationRegistResult> {
    if (suite.isFrameRegisterd() && suite.isCaseRegisterd()) {
      await super.checkFrameStockInStore(dpfmRequestInfo, suite);
    }
    return getSuccessRegistResult();
  }

  /**
   * 店舗在庫照会(ケース)
   * カート変更・登録(チェックアウト以外)時は、設定済み時のみ実施するためオーバーライド
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SalesOperationResult>
   */
  protected override async checkCaseStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SalesOperationRegistResult> {
    if (suite.isFrameRegisterd() && suite.isCaseRegisterd()) {
      await super.checkCaseStockInStore(dpfmRequestInfo, suite);
    }
    return getSuccessRegistResult();
  }

  /**
   * 店舗在庫照会(レンズ)
   * カート変更・登録(チェックアウト以外)時は、設定済み時のみ実施するためオーバーライド
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SalesOperationResult>
   */
  protected override async checkLensStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SalesOperationRegistResult> {
    // 度数情報が設定されているときのみ実施
    if (suite.isSetPrescription()) {
      await super.checkLensStockInStore(dpfmRequestInfo, suite);
    }
    return getSuccessRegistResult();
  }
}
