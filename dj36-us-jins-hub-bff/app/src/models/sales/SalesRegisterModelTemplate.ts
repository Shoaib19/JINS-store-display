import {
  postLineitems,
  postReceptionEvents,
} from "~/src/clients/carts/cartsClient";
import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { CallingStatus, MAXIMUM_IMAGE_BYTE_SIZE, ReceptionStatus } from "~/src/components/const";
import { logger } from "~/src/logging/logger";
import { Cart } from "~/src/models/sales/Cart";
import { PrescriptionImageData } from "~/src/models/sales/PrescriptionImageData";
import {
  LineitemPostRequest,
  ReceptionEventsPostRequest,
} from "~/src/clients/carts/cartsClientTypes";
import {
  CartInfoPostRequest,
  SalesOperationResult,
  VerifyFunction,
} from "~/src/models/sales/SalesOperationModelTemplate";
import {
  getFailureRegisterResult,
  getSuccessRegisterResult,
  isSuccessRegisterResult,
  mergeRegisterResult,
  mergeSuccessRegisterResult,
  SalesOperationRegisterResult,
  SuccessRegisterResult,
} from "~/src/models/sales/SalesOperationRegisterResult";
import { Prescription } from "~/src/models/sales/Prescription";
import { PerspectiveTypeCodeType } from "~/src/models/sales/PerspectiveTypeCodeMap";
import { SaleOperationModelTemplate } from "~/src/models/sales/SalesOperationModelTemplate";
import { Suite } from "~/src/models/sales/Suite";
import { sendApiRequest } from "~/src/utils/fetchService";
import { ApplicationError, BaseError, ValidationError } from "~/src/components/errors";
import { ApiResponse } from "openapi-typescript-fetch";
import { components } from "~/src/interfaces/root";

// カート・登録リクエスト
export type ItemGroupRequestInfo = components["schemas"]["ItemGroupRequestInfo"];
////////////////////////////////////////////////////////////////////////////////////////
/**
 * カート登録・更新（カート更新あり）のモデル（基底クラス）
 */
export abstract class SalesRegisterModelTemplate extends SaleOperationModelTemplate {
  // バリデーションチェック
  protected abstract validateRequest(
    itemGroupRequestInfo: ItemGroupRequestInfo,
  ): SuccessRegisterResult;
  // カート情報の更新
  protected abstract mergeRequest(
    itemGroupRequestInfo: ItemGroupRequestInfo,
    suite: Suite,
  ): void;
  // カート状態の検証
  protected abstract verify(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult>;

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
    logger.info(`cartInfoPostRequest: ${JSON.stringify(cartInfoPostRequest, 
      (key, value) => {
        if (key === "prescriptionData" && value != "string" && value != null) {
            return value.length > 32 ? `${value.slice(0, 32)}...(${value.length}byte)` : value;
        }
        return value;
      })}`);
    const cartId = cartInfoPostRequest.cartId;
    const cart: Cart = await this.getCart(dpfmRequestInfo, cartId, cartInfoPostRequest.warrantyExchange);

    // NOTE: check exist itemGroups
    if (cartInfoPostRequest.itemGroups == undefined) {
      throw new ValidationError("ItemGroups is undefined.");
    }
    // リクエストに指定されているitemGroup毎に処理を実施
    const registerCheckResultList: SalesOperationRegisterResult[] =
      await Promise.all(
        cartInfoPostRequest.itemGroups.map(async (requestItemGroup) => {
          const suite = cart.suites
            .find((suite) => suite.itemGroup.itemGroupCode == requestItemGroup.itemGroupCode);
          if (suite == undefined) {
            throw new ValidationError(`ItemGroup[${requestItemGroup.itemGroupCode}] not found.`);
          }
          try {
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
          } catch(error) {
            if (error instanceof BaseError) {
              logger.error(`(Set ${suite.getSuiteNo()}): ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
              return getFailureRegisterResult(error.messages??error.message);
            }
            throw error;
          }
        }),
      );
    // 応答をマージ
    const result = mergeRegisterResult([getSuccessRegisterResult(), ...registerCheckResultList]);
    if (isSuccessRegisterResult(result)) {
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
   * @returns Promise<SuccessRegisterResult>
   */
  private async executeSuite(
    dpfmRequestInfo: DpfmRequestInfo,
    itemGroupRequestInfo: ItemGroupRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    let result: SuccessRegisterResult = getSuccessRegisterResult();

    // 2. リクエストチェック
    const validateResult = this.validateRequest(itemGroupRequestInfo);
    logger.info("Checked prescription image validation.  (No2)");
    result = mergeSuccessRegisterResult([result, validateResult]);

    // 3. カート情報にリクエスト内容を結合
    this.mergeRequest(itemGroupRequestInfo, suite);
    // データの修正作業
    this.adjust(suite);

    // 4. カート内容チェック
    const verifyResult = await this.verify(dpfmRequestInfo, suite);
    result = mergeSuccessRegisterResult([result, verifyResult]);
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

    logger.info(`postLineitemsRequest: ${JSON.stringify(lineItemsPostRequest,
       (key, value) => {
        if (key === "preparation2" && typeof value === "string") {
            return `${value.slice(0,32)}...(${value.length}byte)`;
        }
        return value;
      }
    )}`);

    const apiResponse: ApiResponse<unknown> = await sendApiRequest(
      postLineitems,
      lineItemsPostRequest,
      requestHeader,
    );

    logger.info(`postLineitemsResponse: ${JSON.stringify(apiResponse)}`);
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
        const receptionEventsPostRequest: ReceptionEventsPostRequest = {
          receptionNumber: cart.cart.receptionNumber,
          statusCode: receptionStatusCode,
          callingStatusCode: callingStatusCode,
          itemGroupCode: suite.itemGroup.itemGroupCode,
          eventCode: suite.getEventCode(),
          subEventCode: suite.getSubEventCode(),
        };
        
        logger.info(`postReceptionEventsRequest: ${JSON.stringify(receptionEventsPostRequest)}`,);

        const apiResponse: ApiResponse<unknown> = await sendApiRequest(
          postReceptionEvents,
          receptionEventsPostRequest,
          requestHeader,
        );
        logger.info(`postReceptionEventsResponse: ${JSON.stringify(apiResponse)}`,);

        logger.info("register the reception event. (No9)");
      }
    }
  }

  /**
   * 処方箋画像チェック
   * @param imageData - 処方箋画像データ
   * @returns SuccessRegisterResult
   */
  protected validatePrescriptionData(
    imageData: string,
  ): SuccessRegisterResult {
    if (!PrescriptionImageData.isCollectImageSize(imageData)) {
      throw new ApplicationError(
        `The uploaded image exceeds the specified size. (Maximum ${MAXIMUM_IMAGE_BYTE_SIZE / 1000000}MB).`);
    }
    if (!PrescriptionImageData.isCollectImageFormat(imageData)) {
      throw new ApplicationError(
        `Invalid image upload format. Please upload a file in JPG or PNG format.`);
    }
    return getSuccessRegisterResult();
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
  protected override verifyEyesightCombi:VerifyFunction = async(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> => {
    // 度数情報が設定されているときのみ実施
    if (suite.isSetPrescription()) {
      return await super.verifyEyesightCombi(dpfmRequestInfo, suite);
    }
    return getSuccessRegisterResult();
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
  ): Promise<SuccessRegisterResult> {
    // 登録時のチェックはフレーム・度数情報・レンズオプションが設定されているときのみ実施
    if (
      suite.isFrameRegistered() &&
      suite.isSetPrescription() &&
      suite.isLensOptionRegistered()
    ) {
      return await super.verifyDiameterShortage(dpfmRequestInfo, suite);
    }
    return getSuccessRegisterResult();
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
  ): Promise<SuccessRegisterResult> {
    // 登録時のチェックはフレーム・度数情報・レンズオプションが設定されているときのみ実施
    if (
      suite.isFrameRegistered() &&
      suite.isSetPrescription() &&
      suite.isLensOptionRegistered()
    ) {
      return await super.verifyEyePoint(dpfmRequestInfo, suite);
    }
    return getSuccessRegisterResult();
  }

  /**
   * 店舗在庫照会(フレーム)
   * カート変更・登録(チェックアウト以外)時は、設定済み時のみ実施するためオーバーライド
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SuccessRegisterResult>
   */
  protected override async checkFrameStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    if (suite.isFrameRegistered() && suite.isCaseRegistered()) {
      return await super.checkFrameStockInStore(dpfmRequestInfo, suite);
    }
    return getSuccessRegisterResult();
  }

  /**
   * 店舗在庫照会(ケース)
   * カート変更・登録(チェックアウト以外)時は、設定済み時のみ実施するためオーバーライド
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SuccessRegisterResult>
   */
  protected override async checkCaseStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    if (suite.isFrameRegistered() && suite.isCaseRegistered()) {
      return await super.checkCaseStockInStore(dpfmRequestInfo, suite);
    }
    return getSuccessRegisterResult();
  }

  /**
   * 店舗在庫照会(セリート)
   * カート変更・登録(チェックアウト以外)時は、設定済み時のみ実施するためオーバーライド
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SuccessRegisterResult>
   */
  protected override async checkCerritoStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    if (suite.isFrameRegistered() && suite.isCaseRegistered() && suite.isCerritoRegistered()) {
      return await super.checkCerritoStockInStore(dpfmRequestInfo, suite);
    }
    return getSuccessRegisterResult();
  }
  /**
   * 店舗在庫照会(レンズ)
   * カート変更・登録(チェックアウト以外)時は、設定済み時のみ実施するためオーバーライド
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SuccessRegisterResult>
   */
  protected override async checkLensStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    // 度数情報が設定されているときのみ実施
    if (suite.isSetPrescription()) {
      return await super.checkLensStockInStore(dpfmRequestInfo, suite);
    }
    return getSuccessRegisterResult();
  }
}
