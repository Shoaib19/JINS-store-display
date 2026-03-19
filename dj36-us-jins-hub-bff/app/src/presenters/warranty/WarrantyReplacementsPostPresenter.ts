import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IWarrantyReplacementsPostPresenter } from "~/src/presenters/interfaces";
import { ApiResponse } from "openapi-typescript-fetch";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import {
  ItemCategory,
  RegistrationMethod,
  ReplacementStatusCode,
  OrderType,
  ReceptionStatus,
  CallingStatus,
  COUNTRY_CODE_ALPHA2
} from "~/src/components/const";
import { EventCode, SubEventCode }from "~/src/components/eventCode";
import {
  Cart,
  CartPostRequest,
  CartPostResponse,
  PrescriptionCopyRequest,
  CartGetRequest,
  CartGetResponse,
  ItemGroup,
  itemGroupCompleteSet,
  Lineitem,
  LineitemPostRequest,
  ReceptionInformationSearchRequest,
  ReceptionInformationSearchResponse,
  ReceptionEventsPostRequest
} from "~/src/clients/carts/cartsClientTypes";
import {
  DiscountLineMixinReadDto,
  OrderByReceptionNumberGetRequest,
  GlassLineHorizontalMixinReadDto,
  OrderGetResponse,
  TaxLineMixinReadDto
} from "~/src/clients/salesOrder/salesOrderClientTypes";
import {
  WarrantyHistoriesGetRequest,
  PowersGetRequest,
  PowersGetResponse,
  WarrantyHistoriesPostRequest,
  WarrantyHistoriesGetResponse
} from "~/src/clients/warranties/warrantiesClientTypes";
import {
  getCartInfo,
  postCartInfo,
  postLineitems,
  postPrescriptionsCopyServer,
  searchReceptionInformation,
  postReceptionEvents
} from "~/src/clients/carts/cartsClient";
import {
  findWarrantyHistories,
  getPowersById,
  postWarrantyHistories
} from "~/src/clients/warranties/warrantiesClient";
import { getOrderByReceptionNumber } from "~/src/clients/salesOrder/salesOrderClient";
import { fixSystemDatetimeForDpfm } from "~/src/utils/fixDatetime";
import { components } from "~/src/interfaces/root";
import { checkReceptionNumberCountryCode } from "~/src/utils/commonError";
import { generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";
import { isNotFoundResponse, ValidationError } from "~/src/components/errors";

// アイテムリスト
const ItemTypeList = [
  "frame", // フレーム
  "case", // ケース
  "cerrito", // セリート
  // "lensRight", // 右レンズ
  // "lensLeft", // 左レンズ
  "prescriptionInfo", // 度数情報
  "lopSalesColorName", // レンズOP（販売用カラー名称）
  "lopSalesLensSpec", // レンズOP（販売用レンズ仕様）
  "lopFocusCategory", // レンズOP（焦点分類）
  "lopProgressiveCategory", // レンズOP（累進分類）
  "lopRefractiveIndexName", // レンズOP（屈折率名称）
  "lensReplacement", // レンズ交換OP
] as const;
export type ItemType = (typeof ItemTypeList)[number];

// 度数情報（JSON形式）
type PrescriptionRequest =
  components["schemas"]["ItemGroupRequestInfo"]["prescription"];
type PrescriptionAdditional = { prescriptionRegistDate?: string };
export type PrescriptionType = Omit<
  PrescriptionRequest & PrescriptionAdditional,
  "prescriptionData"
>;

/**
 * 保証履歴登録・変更処理
 */
@injectable()
export class WarrantyReplacementsPostPresenter
  implements IWarrantyReplacementsPostPresenter
{
  /**
   * カート情報登録APIのリクエスト設定
   * @param warrantyNumber - 保証書番号
   * @param cartData - カート情報
   * @param orderDetailData - OMS注文詳細
   * @param powersData - 度数情報
   * @returns カート情報登録APIリクエスト
   */
  private formatLineitemPostRequest = (
    warrantyNumber: string,
    cartData: Cart,
    orderDetailData: OrderGetResponse,
    powersData: PowersGetResponse | null
  ): LineitemPostRequest => {
    const result: LineitemPostRequest = {
      cartId: cartData.cartId!,
      discountPrice: cartData.discountPrice, // TODO: discountPrice/totalDiscountPriceを適切な値に設定する(暫定はカート初期状態のまま)
      subtotal: orderDetailData.totalSellingAmount??undefined,
      totalDiscountPrice: cartData.totalDiscountPrice,
      totalTaxPrice: orderDetailData.totalTaxAmount??undefined,
      totalSalesPrice: orderDetailData.totalAmount??undefined,
      ItemGroups: this.formatItemGroups(
        warrantyNumber,
        cartData.itemGroups,
        orderDetailData,
        powersData
      )
    }
    return result;
  }

  /**
   * カート情報登録リクエストの商品グループ設定
   * @param warrantyNumber - 保証書番号
   * @param cartItemGroups - カート情報商品グループ
   * @param orderDetailData - OMS注文詳細
   * @param powersData - 度数情報
   * @returns カート情報登録リクエスト商品グループ
   */
  private formatItemGroups = (
    warrantyNumber: string,
    cartItemGroups: itemGroupCompleteSet[] | undefined,
    orderDetailData: OrderGetResponse,
    powersData: PowersGetResponse | null
  ): ItemGroup[] | undefined => {
    if (cartItemGroups == undefined) {
      logger.info(`cartItemGroups is undefined`);
      return undefined;
    }

    const lineItemGroups: ItemGroup[] = cartItemGroups.map((itemGroup) =>
      this.formatItemGroup(warrantyNumber, itemGroup, orderDetailData, powersData)
    );
    logger.info(`formatItemGroups: ${JSON.stringify(lineItemGroups)}`);
    return lineItemGroups;
  }

  /**
   * カート情報登録リクエストの商品グループ詳細設定
   * @param warrantyNumber - 保証書番号
   * @param itemGroup - カート情報商品グループ
   * @param orderDetailData - OMS注文詳細
   * @param powersData - 度数情報
   * @returns - カート情報登録リクエスト商品グループ詳細
   */
  private formatItemGroup = (
    warrantyNumber: string,
    itemGroup: itemGroupCompleteSet,
    orderDetailData: OrderGetResponse,
    powersData: PowersGetResponse | null
  ): ItemGroup => {
    // 注文メガネ行
    const glassLineItem: GlassLineHorizontalMixinReadDto | undefined =
      orderDetailData.glassLines?.find(
        (glassLine) =>
          glassLine.glassLineCode == warrantyNumber
      )
    // 割引行
    const _discountLineItem: DiscountLineMixinReadDto | undefined =
      orderDetailData.discountLines?.find(
        (discountLine) =>
          discountLine?.discountGlassLineItems?.find(
            (discountGlassLineItem) =>
              discountGlassLineItem?.glassLineCode == warrantyNumber
          )
      )
    const result: ItemGroup = {
      lineitemGroupId: itemGroup.lineitemGroupId,
      itemGroupCode: itemGroup.itemGroupCode,
      statusCode: ReceptionStatus.ORDER_NEW,
      callingStatusCode: itemGroup.callingStatusCode,
      customerName: itemGroup.customerName??undefined,
      phoneNumber: itemGroup.phoneNumber??undefined,
      shippingAddressZip: itemGroup.shippingAddressZip??undefined,
      shippingAddress1: itemGroup.shippingAddress1??undefined,
      shippingAddress2: itemGroup.shippingAddress2??undefined,
      shippingAddress3: itemGroup.shippingAddress3??undefined,
      shippingAddress4: itemGroup.shippingAddress4??undefined,
      isExchangeLens: !!glassLineItem?.lensReplacementTypeItemCode,
      isWaitingLens: itemGroup.isWaitingLens,
      isDeliveryToday: itemGroup.isDeliveryToday,
      note: itemGroup.note??undefined,
      discountPrice: itemGroup.discountPrice, // TODO: discountPrice/totalDiscountPriceを適切な値に設定する(暫定はカート初期状態のまま)
      subtotal: glassLineItem?.subtotalSellingAmount??undefined,
      totalDiscountPrice: itemGroup.totalDiscountPrice,
      totalTaxPrice: glassLineItem?.subtotalTaxAmount??undefined,
      salesPrice: glassLineItem?.subtotalAmount??undefined,
      jinsAccountId: powersData?.PowerItem?.jinsAccountId??undefined,
      optimisticLockVerNo: itemGroup.optimisticLockVerNo,
      Lineitems: this.formatLineItems(warrantyNumber, orderDetailData, powersData)
    }
    return result;
  }

  /**
   * カート情報登録リクエストの商品グループ詳細設定
   * @param warrantyNumber - 保証書番号
   * @param orderDetailData - OMS注文詳細
   * @param powersData - 度数情報
   * @returns - カート情報登録リクエスト商品グループ詳細
   */
  private formatLineItems = (
    warrantyNumber: string,
    orderDetailData: OrderGetResponse,
    powersData: PowersGetResponse | null
  ): Lineitem[] | undefined => {
    if (
      orderDetailData == undefined ||
      orderDetailData.glassLines == undefined
    ) {
      logger.info(`orderDetailData is undefined`);
      return undefined;
    }
    logger.info(`(debug1)warrantyNumber: ${JSON.stringify(warrantyNumber)}`);
    logger.info(`(debug1)orderDetailData: ${JSON.stringify(orderDetailData)}`);

    // 注文メガネ行
    const glassLineItem: GlassLineHorizontalMixinReadDto | undefined =
      orderDetailData.glassLines.find(
        (glassLine) =>
          glassLine.glassLineCode == warrantyNumber
      )
    logger.info(`(debug1)glassLineItem: ${JSON.stringify(glassLineItem)}`);
    // 割引行
    const discountLineItem: DiscountLineMixinReadDto | undefined =
      orderDetailData.discountLines?.find(
        (discountLine) =>
          discountLine?.discountGlassLineItems?.find(
            (discountGlassLineItem) => discountGlassLineItem?.glassLineCode == warrantyNumber
          )
      )
    logger.info(`(debug1)discountLineItem: ${JSON.stringify(discountLineItem)}`);
    // 税小計行
    const taxLineItem: TaxLineMixinReadDto | undefined = orderDetailData.taxLines?.find(
      (taxLine) =>
        taxLine?.taxGlassLineItems?.find(
          (taxGlassLineItem) => taxGlassLineItem?.glassLineCode == warrantyNumber
        )
    )
    logger.info(`(debug1)taxLineItem: ${JSON.stringify(taxLineItem)}`);
    // 度数情報設定
    const prescription: PrescriptionType | null =
      this.formatPrescription(glassLineItem?.prescriptionId, powersData)
    logger.info(`(debug1)prescription: ${JSON.stringify(prescription)}`);

    if (glassLineItem) {
      const lineItemGroups: Lineitem[] = [];
      ItemTypeList.forEach((itemType) => {
        logger.info(`(debug2)itemType: ${JSON.stringify(itemType)}`);
        const lineItem: Lineitem | null = 
          this.formatLineItem(
            itemType,
            glassLineItem,
            discountLineItem ?? null,
            taxLineItem ?? null,
            prescription
          )
        logger.info(`(debug2)lineItem: ${JSON.stringify(lineItem)}`);
        if (lineItem) lineItemGroups.push(lineItem);
      });
      logger.info(`formatLineItems: ${JSON.stringify(lineItemGroups)}`);
      return lineItemGroups;
    }
    return undefined;
  }

  /**
   *
   */
  private formatPrescription = (
    prescriptionId: number | null | undefined,
    power: PowersGetResponse | null
  ): PrescriptionType | null => {
    if (!power) return null;

    // 度数登録方法にて処方箋(002)か否かを判定する
    const prescriptionRequest: (string|undefined|null)[] = [RegistrationMethod.PRESCRIPTION.CODE];
    const registrationMethodCode: (string|undefined|null) = power.PowerItem?.registrationMethodCode;
    const isRegistrationMethodPrescription = prescriptionRequest.includes(registrationMethodCode);

    const prescription: PrescriptionType = {
      prescriptionId: power.PowerItem?.prescriptionId,
      registrationMethodCode: registrationMethodCode,
      prescriptionInfo: {
        vision: power.vision,
        perspectiveTypeCode: power.perspectiveTypeCode,
        eyepointRight: power?.eyepointRight ?? undefined,
        eyepointLeft: power?.eyepointLeft ?? undefined,
        pdRight: power?.pdRight ?? undefined,
        pdLeft: power?.pdLeft ?? undefined,
        sphRight: power?.sphRight ?? undefined,
        sphLeft: power?.sphLeft ?? undefined,
        cylRight: power?.cylRight ?? undefined,
        cylLeft: power?.cylLeft ?? undefined,
        axisRight: power?.axisRight ?? undefined,
        axisLeft: power?.axisLeft ?? undefined,
        addRight: power?.addRight ?? undefined,
        addLeft: power?.addLeft ?? undefined,
        prismFlag: power?.prismFlag ?? undefined,
        prism01Right: power?.prism01Right ?? undefined,
        prism01Left: power?.prism01Left ?? undefined,
        baseHRight: power?.baseHRight ?? undefined,
        baseHLeft: power?.baseHLeft ?? undefined,
        prism02Right: power?.prism02Right ?? undefined,
        prism02Left: power?.prism02Left ?? undefined,
        baseVRight: power?.baseVRight ?? undefined,
        baseVLeft: power?.baseVLeft ?? undefined,
      },
      prescriptionExpiration: power?.PowerItem?.expirationDate,
      prescriptionRegistDate: isRegistrationMethodPrescription
        ? fixSystemDatetimeForDpfm()
        : undefined,
    };
    return prescription;
  }

  /**
   * カート情報登録リクエストの商品グループ詳細設定
   * @param itemType - 作成するカート明細
   * @param glassLine - 注文メガネ行
   * @param discountLineItem - 割引行
   * @param taxLineItem - 税小計行
   * @param prescription - 度数情報
   * @returns - カート情報登録リクエスト商品グループ詳細
   */
  private formatLineItem = (
    itemType: ItemType,
    glassLine: GlassLineHorizontalMixinReadDto,
    discountLineItem: DiscountLineMixinReadDto,
    taxLineItem: TaxLineMixinReadDto,
    prescription: PrescriptionType | null
  ): Lineitem | null => {
    switch (itemType) {
      case "frame":
        return glassLine.frameItemCategoryCode ? {
          lineitemId: glassLine.frameLineItemId,
          itemCode: glassLine.frameItemCode,
          countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
          itemCategoryCode: glassLine.frameItemCategoryCode,
          operationCode: "01",  // 登録
          preparation1: glassLine.framePreparation1,
          preparation2: glassLine.framePreparation2,
          taxClass: glassLine.frameTaxGroupCode ? "1" : "0",
          listPrice: glassLine.frameListPrice,
          discountPrice: discountLineItem?.discountAmount ?? undefined,
          taxPrice: taxLineItem?.taxAmount ?? undefined,
          salesPrice: glassLine.frameSellingPrice,
          optimisticLockVerNo: glassLine.frameVersion
        } : null
      case "case":
        return glassLine.caseItemCategoryCode ? {
          lineitemId: glassLine.caseLineItemId,
          itemCode: glassLine.caseItemCode,
          countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
          itemCategoryCode: glassLine.caseItemCategoryCode,
          operationCode: "01",  // 登録
          preparation1: glassLine.casePreparation1,
          preparation2: glassLine.casePreparation2,
          taxClass: glassLine.caseTaxGroupCode ? "1" : "0",
          listPrice: glassLine.caseListPrice,
          discountPrice: discountLineItem?.discountAmount ?? undefined,
          taxPrice: taxLineItem?.taxAmount ?? undefined,
          salesPrice: glassLine.caseSellingPrice,
          optimisticLockVerNo: glassLine.caseVersion
        } : null
      case "cerrito":
        return glassLine.cerritoItemCategoryCode ? {
          lineitemId: glassLine.cerritoLineItemId,
          itemCode: glassLine.cerritoItemCode,
          countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
          itemCategoryCode: glassLine.cerritoItemCategoryCode,
          operationCode: "01",  // 登録
          preparation1: glassLine.cerritoPreparation1,
          preparation2: glassLine.cerritoPreparation2,
          taxClass: glassLine.cerritoTaxGroupCode ? "1" : "0",
          listPrice: glassLine.cerritoListPrice,
          discountPrice: discountLineItem?.discountAmount ?? undefined,
          taxPrice: taxLineItem?.taxAmount ?? undefined,
          salesPrice: glassLine.cerritoSellingPrice,
          optimisticLockVerNo: glassLine.cerritoVersion
        } : null
      // case "lensRight":
      //   return glassLine.lensRightItemCategoryCode ? {
      //     lineitemId: glassLine.lensRightLineItemId,
      //     itemCode: glassLine.lensRightItemCode,
      //     countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
      //     itemCategoryCode: glassLine.lensRightItemCategoryCode,
      //     operationCode: "01",  // 登録
      //     preparation1: glassLine.lensRightPreparation1,
      //     preparation2: glassLine.lensRightPreparation2,
      //     taxClass: undefined,
      //     listPrice: undefined,
      //     discountPrice: discountLineItem?.discountAmount ?? undefined,
      //     taxPrice: taxLineItem?.taxAmount ?? undefined,
      //     salesPrice: undefined,
      //     optimisticLockVerNo: glassLine.lensRightVersion
      //   } : null
      // case "lensLeft":
      //   return glassLine.lensLeftItemCategoryCode ? {
      //     lineitemId: glassLine.lensLeftLineItemId,
      //     itemCode: glassLine.lensLeftItemCode,
      //     countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
      //     itemCategoryCode: glassLine.lensLeftItemCategoryCode,
      //     operationCode: "01",  // 登録
      //     preparation1: glassLine.lensLeftPreparation1,
      //     preparation2: glassLine.lensLeftPreparation2,
      //     taxClass: undefined,
      //     listPrice: undefined,
      //     discountPrice: discountLineItem?.discountAmount ?? undefined,
      //     taxPrice: taxLineItem?.taxAmount ?? undefined,
      //     salesPrice: undefined,
      //     optimisticLockVerNo: glassLine.lensLeftVersion
      //   }: null
      case "prescriptionInfo":
      return prescription ? {
        lineitemId: undefined,
        itemCode: undefined,
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
        itemCategoryCode: ItemCategory.PRESCRIPTION_INFO,
        operationCode: "01",  // 登録
        preparation1: JSON.stringify(prescription), // 度数情報
        preparation2: undefined,  // 度数情報（処方箋画像データ)
        taxClass: undefined,
        listPrice: undefined,
        discountPrice: discountLineItem?.discountAmount ?? undefined,
        taxPrice: taxLineItem?.taxAmount ?? undefined,
        salesPrice: undefined,
        optimisticLockVerNo: undefined
      } : null
      case "lopFocusCategory":
        return glassLine.lopFocusCategoryItemCategoryCode ? {
          lineitemId: glassLine.lopFocusCategoryLineItemId,
          itemCode: glassLine.lopFocusCategoryItemCode,
          countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
          itemCategoryCode: glassLine.lopFocusCategoryItemCategoryCode,
          operationCode: "01",  // 登録
          preparation1: glassLine.lopFocusCategoryPreparation1,
          preparation2: glassLine.lopFocusCategoryPreparation2,
          taxClass: glassLine.lopFocusCategoryTaxGroupCode ? "1" : "0",
          listPrice: glassLine.lopFocusCategoryListPrice,
          discountPrice: discountLineItem?.discountAmount ?? undefined,
          taxPrice: taxLineItem?.taxAmount ?? undefined,
          salesPrice: glassLine.lopFocusCategorySellingPrice,
          optimisticLockVerNo: glassLine.lopFocusCategoryVersion
        } : null
      case "lopProgressiveCategory":
        return glassLine.lopProgressiveCategoryItemCategoryCode ? {
          lineitemId: glassLine.lopProgressiveCategoryLineItemId,
          itemCode: glassLine.lopProgressiveCategoryItemCode,
          countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
          itemCategoryCode: glassLine.lopProgressiveCategoryItemCategoryCode,
          operationCode: "01",  // 登録
          preparation1: glassLine.lopProgressiveCategoryPreparation1,
          preparation2: glassLine.lopProgressiveCategoryPreparation2,
          taxClass: glassLine.lopProgressiveCategoryTaxGroupCode ? "1" : "0",
          listPrice: glassLine.lopProgressiveCategoryListPrice,
          discountPrice: discountLineItem?.discountAmount ?? undefined,
          taxPrice: taxLineItem?.taxAmount ?? undefined,
          salesPrice: glassLine.lopProgressiveCategorySellingPrice,
          optimisticLockVerNo: glassLine.lopProgressiveCategoryVersion
        } : null
      case "lopRefractiveIndexName":
        return glassLine.lopRefractiveIndexNameItemCategoryCode ? {
          lineitemId: glassLine.lopRefractiveIndexNameLineItemId,
          itemCode: glassLine.lopRefractiveIndexNameItemCode,
          countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
          itemCategoryCode: glassLine.lopRefractiveIndexNameItemCategoryCode,
          operationCode: "01",  // 登録
          preparation1: glassLine.lopRefractiveIndexNamePreparation1,
          preparation2: glassLine.lopRefractiveIndexNamePreparation2,
          taxClass: glassLine.lopRefractiveIndexNameTaxGroupCode ? "1" : "0",
          listPrice: glassLine.lopRefractiveIndexNameListPrice,
          discountPrice: discountLineItem?.discountAmount ?? undefined,
          taxPrice: taxLineItem?.taxAmount ?? undefined,
          salesPrice: glassLine.lopRefractiveIndexNameSellingPrice,
          optimisticLockVerNo: glassLine.lopRefractiveIndexNameVersion
        } : null
      case "lopSalesColorName":
        return glassLine.lopSalesColorNameItemCategoryCode ? {
          lineitemId: glassLine.lopSalesColorNameLineItemId,
          itemCode: glassLine.lopSalesColorNameItemCode,
          countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
          itemCategoryCode: glassLine.lopSalesColorNameItemCategoryCode,
          operationCode: "01",  // 登録
          preparation1: glassLine.lopSalesColorNamePreparation1,
          preparation2: glassLine.lopSalesColorNamePreparation2,
          taxClass: glassLine.lopSalesColorNameTaxGroupCode ? "1" : "0",
          listPrice: glassLine.lopSalesColorNameListPrice,
          discountPrice: discountLineItem?.discountAmount ?? undefined,
          taxPrice: taxLineItem?.taxAmount ?? undefined,
          salesPrice: glassLine.lopSalesColorNameSellingPrice,
          optimisticLockVerNo: glassLine.lopSalesColorNameVersion
        } : null
      case "lopSalesLensSpec":
        return glassLine.lopSalesLensSpecItemCategoryCode ? {
          lineitemId: glassLine.lopSalesLensSpecLineItemId,
          itemCode: glassLine.lopSalesLensSpecItemCode,
          countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
          itemCategoryCode: glassLine.lopSalesLensSpecItemCategoryCode,
          operationCode: "01",  // 登録
          preparation1: glassLine.lopSalesLensSpecPreparation1,
          preparation2: glassLine.lopSalesLensSpecPreparation2,
          taxClass: glassLine.lopSalesLensSpecTaxGroupCode ? "1" : "0",
          listPrice: glassLine.lopSalesLensSpecListPrice,
          discountPrice: discountLineItem?.discountAmount ?? undefined,
          taxPrice: taxLineItem?.taxAmount ?? undefined,
          salesPrice: glassLine.lopSalesLensSpecSellingPrice,
          optimisticLockVerNo: glassLine.lopSalesLensSpecVersion
        } : null
      case "lensReplacement":
        return glassLine.lensReplacementTypeItemCategoryCode ? {
          lineitemId: glassLine.lensReplacementTypeLineItemId,
          itemCode: glassLine.lensReplacementTypeItemCode,
          countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
          itemCategoryCode: glassLine.lensReplacementTypeItemCategoryCode,
          operationCode: "01",  // 登録
          preparation1: glassLine.lensReplacementTypePreparation1,
          preparation2: glassLine.lensReplacementTypePreparation2,
          taxClass: glassLine.lensReplacementTypeTaxGroupCode ? "1" : "0",
          listPrice: glassLine.lensReplacementTypeListPrice,
          discountPrice: discountLineItem?.discountAmount ?? undefined,
          taxPrice: taxLineItem?.taxAmount ?? undefined,
          salesPrice: glassLine.lensReplacementTypeSellingPrice,
          optimisticLockVerNo: glassLine.lensReplacementTypeVersion
        } : null
    }
  }

  /**
   * 保証履歴登録・変更処理
   * @param req - Request
   * @param res - Response
   * @param next - NextFunction
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dpfmRequestInfo = generateDpfmRequestInfo(req);

      const warrantyNumber: string = req.body.warrantyNumber;
      const receptionNumber: string = req.body.receptionNumber;

      // リクエストパラメータチェック
      // 受付番号と保証番号が一致する場合はエラー
      if (receptionNumber == warrantyNumber.substring(0, warrantyNumber.indexOf("-"))) {
        throw new ValidationError("The reception number or warranty number is incorrect.");
      }

      // 受付番号がBFF設定の事業国と異なる場合はエラー
      await checkReceptionNumberCountryCode(dpfmRequestInfo, receptionNumber);

      let warrantyHistoriesGetData : WarrantyHistoriesGetResponse | undefined = undefined;
      try {
        /**
         * 保証履歴取得API呼出
         */
        const warrantyHistoriesGetRequest: WarrantyHistoriesGetRequest = {
          warrantyNumber: warrantyNumber,
          replacementStatusCode: ReplacementStatusCode.DONE,
        };

        logger.info(`findWarrantyHistoriesRequest: ${JSON.stringify(warrantyHistoriesGetRequest)}`);

        // デジタル基盤層APIを呼び出す
        const warrantyHistoriesGetResponse: ApiResponse<WarrantyHistoriesGetResponse> =
          await sendApiRequest(
            findWarrantyHistories,
            warrantyHistoriesGetRequest,
            makeDpfmRequestHeader(dpfmRequestInfo)
          );

        logger.info(`findWarrantyHistoriesResponse: ${JSON.stringify(warrantyHistoriesGetResponse)}`);

        warrantyHistoriesGetData = warrantyHistoriesGetResponse.data;
      } catch (error) {
        if (!isNotFoundResponse(error)) {
          throw error;
        }
      }

      // 保証書番号から受付番号を抽出
      let lastReceptionNumber: string = warrantyNumber.substring(0, warrantyNumber.indexOf("-"));
      let lastItemGroupCode: string = warrantyNumber;

      if (
        warrantyHistoriesGetData?.warrantyHistories &&
        warrantyHistoriesGetData.warrantyHistories.length > 0
      ) {
        // 前回の保証履歴から受付番号を取得
        const index = warrantyHistoriesGetData.warrantyHistories.length - 1
        lastReceptionNumber =
          warrantyHistoriesGetData.warrantyHistories[index].receptionNumber ?? lastReceptionNumber;
        lastItemGroupCode =
          warrantyHistoriesGetData.warrantyHistories[index].receptionNumber
            ? lastReceptionNumber+"-1"
            : warrantyNumber;
      }


      /**
       * 受付情報検索API呼出
       */
      const searchReceptionInformationQuery: ReceptionInformationSearchRequest = {
        receptionNumber: receptionNumber,
      };

      logger.info(`searchReceptionInformationRequest: ${JSON.stringify(searchReceptionInformationQuery)}`);

      // デジタル基盤層APIを呼び出す
      const searchReceptionInformationResponse: ApiResponse<ReceptionInformationSearchResponse> =
        await sendApiRequest(
          searchReceptionInformation,
          searchReceptionInformationQuery,
          makeDpfmRequestHeader(dpfmRequestInfo)
        );

      logger.info(`searchReceptionInformationResponse: ${JSON.stringify(searchReceptionInformationResponse)}`);

      const searchReceptionInformationData = searchReceptionInformationResponse.data

      /**
       * カートカタログ取得API呼出
       */
      const cartInfoGetRequest: CartGetRequest = {
        receptionNumber: receptionNumber,
        deleteFlag: false
      };

      logger.info(`getCartInfoRequest: ${JSON.stringify(cartInfoGetRequest)}`);

      // デジタル基盤層APIを呼び出す
      const cartInfoGetResponse: ApiResponse<CartGetResponse> =
        await sendApiRequest(
          getCartInfo,
          cartInfoGetRequest,
          makeDpfmRequestHeader(dpfmRequestInfo)
        );

      logger.info(`getCartInfoResponse: ${JSON.stringify(cartInfoGetResponse)}`);

      /**
       * OMS注文詳細取得API呼出
       */
      const getOrderByReceptionNumberRequest: OrderByReceptionNumberGetRequest = {
        receptionNumber: lastReceptionNumber,
      };

      logger.info(`getOrderByReceptionNumberRequest: ${JSON.stringify(getOrderByReceptionNumberRequest)}`);

      // デジタル基盤層APIを呼び出す
      const getOrderByReceptionNumberResponse: ApiResponse<OrderGetResponse> =
        await sendApiRequest(
          getOrderByReceptionNumber,
          getOrderByReceptionNumberRequest,
          makeDpfmRequestHeader(dpfmRequestInfo)
        );

      logger.info(`getOrderByReceptionNumberResponse: ${JSON.stringify(getOrderByReceptionNumberResponse)}`);

      const orderDetailData = getOrderByReceptionNumberResponse.data

      const targetGlassLine = orderDetailData.glassLines?.find(
        (glassLine:GlassLineHorizontalMixinReadDto) => glassLine.glassLineCode == lastItemGroupCode
      )
      let getPowersResponseData: PowersGetResponse | null = null
      if (targetGlassLine && targetGlassLine.powerId) {
        /**
         * 度数情報取得API呼出
         */
        const getPowersPath: PowersGetRequest = {
          powerId: targetGlassLine.powerId
        }
        logger.info(`getPowersByIdRequest: ${JSON.stringify(getPowersPath)}`);

        // デジタル基盤層APIを呼び出す
        const getPowersResponse: ApiResponse<PowersGetResponse> =
          await sendApiRequest(
            getPowersById,
            getPowersPath,
            makeDpfmRequestHeader(dpfmRequestInfo)
          );

        logger.info(`getPowersByIdResponse: ${JSON.stringify(getPowersResponse)}`);

        getPowersResponseData = getPowersResponse.data
      }

      /**
       * 保証履歴登録API呼出
       */
      const warrantyHistoriesPostRequest: WarrantyHistoriesPostRequest = {
        warrantyNumber: warrantyNumber,
        receptionNumber: receptionNumber,
        replacementType: req.body.replacementType,
        replacementPart: req.body.replacementPart,
        replacementReason: req.body.replacementReason,
        exchangeCountIncrementFlag: Boolean(req.body.exchangeCountIncrementFlag),
        replacementStoreId: Array.isArray(searchReceptionInformationData?.ReceptionInfoAllItems) 
          && searchReceptionInformationData?.ReceptionInfoAllItems.length > 0
          ? Number(searchReceptionInformationData?.ReceptionInfoAllItems[0].storeId)
          : undefined,
        receiptDatetime: searchReceptionInformationData?.ReceptionInfoAllItems?.at(0)?.registeredDatetime,
        jinsAccountId: getPowersResponseData?.PowerItem?.jinsAccountId
      };

      logger.info(`postWarrantyHistoriesRequest: ${JSON.stringify(warrantyHistoriesPostRequest)}`);

      // デジタル基盤層APIを呼び出す
      const warrantyHistoriesPostResponse: ApiResponse<unknown> =
        await sendApiRequest(
          postWarrantyHistories,
          warrantyHistoriesPostRequest,
          makeDpfmRequestHeader(dpfmRequestInfo)
        );

      logger.info(`postWarrantyHistoriesResponse: ${JSON.stringify(warrantyHistoriesPostResponse)}`);

      if (
        cartInfoGetResponse.data.cart == null ||
        cartInfoGetResponse.data.cart.itemGroups == undefined ||
        cartInfoGetResponse.data.cart.itemGroups.length == 0
      ) {

        /**
         * カート新規作成API呼出
         */
        const cartPostRequest: CartPostRequest = {
          receptionNumber: receptionNumber,
        };

        logger.info(`postCartInfoRequest: ${JSON.stringify(cartPostRequest)}`);

        // デジタル基盤層APIを呼び出す
        const cartPostResponse: ApiResponse<CartPostResponse> =
          await sendApiRequest(
            postCartInfo,
            cartPostRequest,
            makeDpfmRequestHeader(dpfmRequestInfo)
          );

        logger.info(`postCartInfoResponse: ${JSON.stringify(cartPostResponse)}`);

        const cartData = cartPostResponse.data.cart;
        // カート情報が作成できていない場合
        if(cartData == null){
          throw new ValidationError("Cart data has not been created.");
        }

        /**
         * カート情報登録API呼出
         */
        const lineitemPostRequest: LineitemPostRequest =
          this.formatLineitemPostRequest(
            lastItemGroupCode,
            cartData,
            orderDetailData,
            getPowersResponseData
          );

        logger.info(`postLineitemsRequest: ${JSON.stringify(lineitemPostRequest)}`);

        // デジタル基盤層APIを呼び出す
        const lineitemPostResponse: ApiResponse<unknown> =
          await sendApiRequest(
            postLineitems,
            lineitemPostRequest,
            makeDpfmRequestHeader(dpfmRequestInfo)
          );

        logger.info(`postLineitemsResponse: ${JSON.stringify(lineitemPostResponse)}`);

        /**
         * 処方箋画像コピーAPI呼出
         */
        const prescriptionRequest: (string|undefined|null)[] = [RegistrationMethod.PRESCRIPTION.CODE];
        const registrationMethodCode: (string|undefined|null) =
          getPowersResponseData?.PowerItem?.registrationMethodCode;
        // 処方箋ファイル名が設定されている かつ 度数登録方法が処方箋(002)の場合
        if(getPowersResponseData?.PowerItem?.prescriptionFileName
          && prescriptionRequest.includes(registrationMethodCode)){

          const copyPrescriptionRequest: PrescriptionCopyRequest = {
            originalItemGroupCode: lastItemGroupCode,
            copiedItemGroupCode: cartData.itemGroups![0].itemGroupCode!,
            countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
          }

          logger.info(`postPrescriptionsCopyServerRequest: ${JSON.stringify(copyPrescriptionRequest)}`);

          // デジタル基盤層APIを呼び出す
          const copyPrescriptionResponse: ApiResponse<unknown> =
            await sendApiRequest(
              postPrescriptionsCopyServer,
              copyPrescriptionRequest,
              makeDpfmRequestHeader(dpfmRequestInfo)
            );

          logger.info(`postPrescriptionsCopyServerResponse: ${JSON.stringify(copyPrescriptionResponse)}`);
        }
      }


      /**
       * 受付情報更新API呼出
       */
      const receptionEventsRequest: ReceptionEventsPostRequest = {
        receptionNumber: receptionNumber,
        storeCode:cartInfoGetResponse?.data.cart?.receptionStoreCode ?? undefined,
        statusCode: ReceptionStatus.ORDER_NEW,
        callingStatusCode: CallingStatus.NONE,
        eventCode: EventCode.CART.CODE,
        subEventCode: SubEventCode.ADD,
      }

      logger.info(`postReceptionEventsRequest: ${JSON.stringify(receptionEventsRequest)}`);

      // デジタル基盤層APIを呼び出す
      const receptionEventsResponse: ApiResponse<unknown> =
        await sendApiRequest(
          postReceptionEvents,
          receptionEventsRequest,
          makeDpfmRequestHeader(dpfmRequestInfo)
        );

      logger.info(`postReceptionEventsResponse: ${JSON.stringify(receptionEventsResponse)}`);

      res.status(200).send();

      return;
    } catch (error) {
      next(error);
    }
  };
}
