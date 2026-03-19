import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IWarrantyReplacementsPostPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { customerStaffId, ItemCategory, RegistrationMethod, ReplacementStatusCode, OrderType, ReceptionStatus, CallingStatus, } from "~/src/compornents/const";
import { EventCode, SubEventCode }from "~/src/compornents/eventCode";
import { Cart, CartPostRequest, CopyPrescriptionRequest, findCartQuery, ItemGroup, itemGroupCompleteSet, Lineitem, LineitemPostRequest, SearchReceptionInformationQuery, SearchReceptionInformationResponse ,ReceptionEventsRequest } from "~/src/clients/carts/cartsClientTypes";
import { DiscountLineMixinReadDto, GetOrderByReceptionNumberPath, GlassLineHorizontalMixinReadDto, OrderDetailReadDto, TaxLineMixinReadDto } from "~/src/clients/salesOrder/salesOrderClientTypes";
import { FindWarrantyHistoriesQuery, GetPowersPath, GetPowersResponse, WarrantyHistoriesPostRequest, WarrantyHistoriesResponse } from "~/src/clients/warranties/warrantiesClientTypes";
import { getCartInfo, postCartInfo, postLineitems, postPrescriptionsCopyServer, searchReceptionInformation, postReceptionEvents } from "~/src/clients/carts/cartsClient";
import { findWarrantyHistories, getPowersById, postWarrantyHistories } from "~/src/clients/warranties/warrantiesClient";
import { getOrderByReceptionNumber } from "~/src/clients/salesOrder/salesOrderClient";
import { fixDatetimeForDpfm, fixSystemDatetimeForDpfm } from "~/src/utils/fixDatetime";
import { components } from "~/src/interfaces/root";


let traceBranchNo: number = 0; // jins-trace-id-branch-no

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
  extends BasePresenter
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
    orderDetailData: OrderDetailReadDto,
    powersData: GetPowersResponse | null
  ): LineitemPostRequest => {
    const result: LineitemPostRequest = {
      cartId: cartData.cartId!,
      discountPrice: cartData.discountPrice, // TODO: discountPrice/totalDiscountPriceを適切な値に設定する(暫定はカート初期状態のまま)
      subtotal: orderDetailData.totalSellingAmount??undefined,
      totalDiscountPrice: cartData.totalDiscountPrice,
      totalTaxPrice: orderDetailData.totalTaxAmount??undefined,
      totalSalesPrice: orderDetailData.totalAmount??undefined,
      ItemGroups: this.formatItemGroups(warrantyNumber, cartData.itemGroups, orderDetailData, powersData)
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
    orderDetailData: OrderDetailReadDto,
    powersData: GetPowersResponse | null
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
    orderDetailData: OrderDetailReadDto,
    powersData: GetPowersResponse | null
  ): ItemGroup => {
    // 注文メガネ行
    const glassLineItem: GlassLineHorizontalMixinReadDto | undefined = orderDetailData.glassLines?.find((glassLine) =>
      glassLine.glassLineCode == warrantyNumber
    )
    // 割引行
    const discountLineItem: DiscountLineMixinReadDto | undefined = orderDetailData.discountLines?.find((discountLine) =>
      discountLine?.discountGlassLineItems?.find((discountGlassLineItem) => discountGlassLineItem?.glassLineCode == warrantyNumber
    ))
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
      isExchangeLens: glassLineItem?.orderType == OrderType.LENSE_REPLACE,
      isWaitingLens: itemGroup.isWaitingLens,
      isDeliveryToday: itemGroup.isDeliveryToday,
      note: itemGroup.note??undefined,
      discountPrice: itemGroup.discountPrice, // TODO: discountPrice/totalDiscountPriceを適切な値に設定する(暫定はカート初期状態のまま)
      subtotal: glassLineItem?.subtotalSellingAmount??undefined,
      totalDiscountPrice: itemGroup.totalDiscountPrice,
      totalTaxPrice: glassLineItem?.subtotalTaxAmount??undefined,
      salesPrice: glassLineItem?.subtotalAmount??undefined,
      jinsAccountId: itemGroup.jinsAccountId??undefined,
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
    orderDetailData: OrderDetailReadDto,
    powersData: GetPowersResponse | null
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
    const glassLineItem: GlassLineHorizontalMixinReadDto | undefined = orderDetailData.glassLines.find((glassLine) =>
      glassLine.glassLineCode == warrantyNumber
    )
    logger.info(`(debug1)glassLineItem: ${JSON.stringify(glassLineItem)}`);
    // 割引行
    const discountLineItem: DiscountLineMixinReadDto | undefined = orderDetailData.discountLines?.find((discountLine) =>
      discountLine?.discountGlassLineItems?.find((discountGlassLineItem) => discountGlassLineItem?.glassLineCode == warrantyNumber
    ))
    logger.info(`(debug1)discountLineItem: ${JSON.stringify(discountLineItem)}`);
    // 税小計行
    const taxLineItem: TaxLineMixinReadDto | undefined = orderDetailData.taxLines?.find((taxLine) =>
      taxLine?.taxGlassLineItems?.find((taxGlassLineItem) => taxGlassLineItem?.glassLineCode == warrantyNumber
    ))
    logger.info(`(debug1)taxLineItem: ${JSON.stringify(taxLineItem)}`);
    // 度数情報設定
    const prescription: PrescriptionType | null = this.formatPrescription(glassLineItem?.prescriptionId, powersData)
    logger.info(`(debug1)prescription: ${JSON.stringify(prescription)}`);

    if (glassLineItem) {
      const lineItemGroups: Lineitem[] = [];
      ItemTypeList.forEach((itemType) => {
        logger.info(`(debug2)itemType: ${JSON.stringify(itemType)}`);
        const lineItem: Lineitem | null = this.formatLineItem(itemType, glassLineItem, discountLineItem ?? null, taxLineItem ?? null, prescription)
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
    power: GetPowersResponse | null
  ): PrescriptionType | null => {
    if (!power) return null;

    let registrationMethodCode = RegistrationMethod.PRESCRIPTION.CODE;
    if (prescriptionId == undefined) {
      logger.info(`powerId undefined.`);
      registrationMethodCode = RegistrationMethod.MANUAL_ENTER.CODE;
    }

    const prescription: PrescriptionType = {
      prescriptionId: power.PowerItem?.prescriptionId,
      registrationMethodCode: registrationMethodCode,
      prescriptionInfo: {
        vision: power.vision ? String(power.vision) : null,
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
      // FIXME:度数情報はwarantyからdateで戻ってくる。
      // → date-timeに変わる想定で、無変換で設定。
      prescriptionExpiration: power?.PowerItem?.expirationDate,
      prescriptionRegistDate: fixSystemDatetimeForDpfm(),
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
    }
  }

  /**
   * 保証履歴登録・変更処理
   * @param req - Request
   * @param res - Response
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const cursor = req.header("x-cursor");

      const requestHeader: HeadersInit = new Headers();
      requestHeader.set("Accept", req.header("accept") ?? "");
      requestHeader.set("Accept-Language", req.header("accept-language") ?? "");
      requestHeader.set("Content-Type", req.header("content-type") ?? "");
      requestHeader.set("Authorization", req.header("authorization") ?? "");
      requestHeader.set("X-API-KEY", process.env.CRM_API_KEY ?? "");
      requestHeader.set("jins-trace-id", req.header("jins-trace-id") ?? "");
      requestHeader.set("jins-user-id", req.header("staffID") ?? customerStaffId);
      if (cursor) {
        requestHeader.set("X-Cursor", cursor);
      }

      const warrantyNumber: string = req.body.warrantyNumber;
      const receptionNumber: string = req.body.receptionNumber;

      let warrantyHistoriesGetData : WarrantyHistoriesResponse | undefined = undefined;
      try {
        /**
         * 保証履歴取得API呼出
         */
        const warrantyHistoriesGetRequest: FindWarrantyHistoriesQuery = {
          warrantyNumber: warrantyNumber,
          replacementStatusCode: ReplacementStatusCode.DONE,
        };

        logger.info(`warrantyHistoriesGetRequest: ${JSON.stringify(warrantyHistoriesGetRequest)}`);

        // デジタル基盤層APIを呼び出す
        requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
        const warrantyHistoriesGetResponse = await sendApiRequest(findWarrantyHistories, warrantyHistoriesGetRequest, requestHeader);

        logger.info(`warrantyHistoriesGetResponse: ${JSON.stringify(warrantyHistoriesGetResponse)}`);

        if (!warrantyHistoriesGetResponse.ok) {
          throw warrantyHistoriesGetResponse;
        }
        warrantyHistoriesGetData = warrantyHistoriesGetResponse.data;
      } catch (error : any) {
        if (error.status !== 404) {
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
        lastReceptionNumber = warrantyHistoriesGetData.warrantyHistories[index].receptionNumber ?? lastReceptionNumber;
        lastItemGroupCode = warrantyHistoriesGetData.warrantyHistories[index].receptionNumber ? lastReceptionNumber+"-1" : warrantyNumber;
      }


      /**
       * 受付情報検索API呼出
       */
      const searchReceptionInformationQuery: SearchReceptionInformationQuery = {
        receptionNumber: receptionNumber,
      };

      logger.info(`searchReceptionInformationQuery: ${JSON.stringify(searchReceptionInformationQuery)}`);

      // デジタル基盤層APIを呼び出す
      requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
      const searchReceptionInformationResponse = await sendApiRequest(searchReceptionInformation, searchReceptionInformationQuery, requestHeader);

      logger.info(`searchReceptionInformationResponse: ${JSON.stringify(searchReceptionInformationResponse)}`);

      if (!searchReceptionInformationResponse.ok) {
        throw searchReceptionInformationResponse;
      }

      const searchReceptionInformationData: SearchReceptionInformationResponse = searchReceptionInformationResponse.data

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
        replacementStoreId: searchReceptionInformationData?.ReceptionInfoAllItems ? Number(searchReceptionInformationData?.ReceptionInfoAllItems[0].storeId) : undefined,
        receiptDatetime: searchReceptionInformationData?.ReceptionInfoAllItems?.at(0)?.registeredDatetime,
      };

      logger.info(`warrantyHistoriesPostRequest: ${JSON.stringify(warrantyHistoriesPostRequest)}`);

      // デジタル基盤層APIを呼び出す
      requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
      const warrantyHistoriesPostResponse = await sendApiRequest(postWarrantyHistories, warrantyHistoriesPostRequest, requestHeader);

      logger.info(`warrantyHistoriesPostResponse: ${JSON.stringify(warrantyHistoriesPostResponse)}`);

      if (!warrantyHistoriesPostResponse.ok) {
        throw warrantyHistoriesPostResponse;
      }


      /**
       * カートカタログ取得API呼出
       */
      const cartInfoGetRequest: findCartQuery = {
        receptionNumber: receptionNumber,
        deleteFlag: false
      };

      logger.info(`cartInfoGetRequest: ${JSON.stringify(cartInfoGetRequest)}`);

      // デジタル基盤層APIを呼び出す
      requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
      const cartInfoGetResponse = await sendApiRequest(getCartInfo, cartInfoGetRequest, requestHeader);

      logger.info(`cartInfoGetResponse: ${JSON.stringify(cartInfoGetResponse)}`);

      if (!cartInfoGetResponse.ok) {
        throw cartInfoGetResponse;
      }


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

        logger.info(`cartPostRequest: ${JSON.stringify(cartPostRequest)}`);

        // デジタル基盤層APIを呼び出す
        requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
        const cartPostResponse = await sendApiRequest(postCartInfo, cartPostRequest, requestHeader);

        logger.info(`cartPostResponse: ${JSON.stringify(cartPostResponse)}`);

        if (!cartPostResponse.ok) {
          throw cartPostResponse;
        }
        const cartData: Cart = cartPostResponse.data.cart;


        /**
         * OMS注文詳細取得API呼出
         */
        const getOrderByReceptionNumberRequest: GetOrderByReceptionNumberPath = {
          receptionNumber: lastReceptionNumber,
        };

        logger.info(`getOrderByReceptionNumberRequest: ${JSON.stringify(getOrderByReceptionNumberRequest)}`);

        // デジタル基盤層APIを呼び出す
        requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
        const getOrderByReceptionNumberResponse = await sendApiRequest(getOrderByReceptionNumber, getOrderByReceptionNumberRequest, requestHeader);

        logger.info(`getOrderByReceptionNumberResponse: ${JSON.stringify(getOrderByReceptionNumberResponse)}`);

        if (!getOrderByReceptionNumberResponse.ok) {
          throw getOrderByReceptionNumberResponse;
        }

        const orderDetailData: OrderDetailReadDto = getOrderByReceptionNumberResponse.data

        const targetGlassLine = orderDetailData.glassLines?.find(glassLine => glassLine.glassLineCode == lastItemGroupCode)
        let getPowersResponseData: GetPowersResponse | null = null
        if (targetGlassLine && targetGlassLine.powerId) {
          /**
           * 度数情報取得API呼出
           */
          const getPowersPath: GetPowersPath = {
            powerId: targetGlassLine.powerId
          }
          logger.info(`getPowersPath: ${JSON.stringify(getPowersPath)}`);

          // デジタル基盤層APIを呼び出す
          requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
          const getPowersResponse = await sendApiRequest(getPowersById, getPowersPath, requestHeader);

          logger.info(`getPowersResponse: ${JSON.stringify(getPowersResponse)}`);

          if (!getPowersResponse.ok) {
            throw getPowersResponse;
          }
          getPowersResponseData = getPowersResponse.data
        }

        /**
         * カート情報登録API呼出
         */
        const lineitemPostRequest: LineitemPostRequest
         = this.formatLineitemPostRequest(lastItemGroupCode, cartData, orderDetailData, getPowersResponseData);

        logger.info(`lineitemPostRequest: ${JSON.stringify(lineitemPostRequest)}`);

        // デジタル基盤層APIを呼び出す
        requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
        const lineitemPostResponse = await sendApiRequest(postLineitems, lineitemPostRequest, requestHeader);

        logger.info(`lineitemPostResponse: ${JSON.stringify(lineitemPostResponse)}`);

        if (!lineitemPostResponse.ok) {
          throw lineitemPostResponse;
        }


        /**
         * 処方箋画像コピーAPI呼出
         */
        if (getPowersResponseData?.PowerItem?.prescriptionId) {

          const copyPrescriptionRequest: CopyPrescriptionRequest = {
            originalItemGroupCode: lastItemGroupCode,
            copiedItemGroupCode: cartData.itemGroups![0].itemGroupCode!
          }

          logger.info(`copyPrescriptionRequest: ${JSON.stringify(copyPrescriptionRequest)}`);

          // デジタル基盤層APIを呼び出す
          requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
          const copyPrescriptionResponse = await sendApiRequest(postPrescriptionsCopyServer, copyPrescriptionRequest, requestHeader);

          logger.info(`copyPrescriptionResponse: ${JSON.stringify(copyPrescriptionResponse)}`);

          if (!copyPrescriptionResponse.ok) {
            throw copyPrescriptionResponse;
          }
        }
      }

      /**
       * 受付情報更新API呼出
       */
      const receptionEventsRequest: ReceptionEventsRequest = {
        receptionNumber: receptionNumber,
        storeCode:cartInfoGetResponse?.cart?.receptionStoreCode,
        statusCode: ReceptionStatus.ORDER_NEW,
        callingStatusCode: CallingStatus.NONE,
        eventCode: EventCode.CART,
        subEventCode: SubEventCode.ADD,
      }

      logger.info(`ReceptionEventsRequest: ${JSON.stringify(receptionEventsRequest)}`);

      // デジタル基盤層APIを呼び出す
      requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
      const receptionEventsResponse = await sendApiRequest(postReceptionEvents, receptionEventsRequest, requestHeader);

      if (!receptionEventsResponse.ok) {
        throw receptionEventsResponse
      }

      res.status(200).send();

      return;
    } catch (error: any) {
      if (error?.systemName == "BFF") {
        if (error.details.status === 404) {
          res.status(400).json(error)
        } else {
          res.status(error.details.status).json(error)
        }
      } else if (error?.status) {
        if (error.status === 404){
          res.status(400).json(error.data);
        } else {
          res.status(error.status).json(error.data);
        }
      } else {
        res.status(500).json(error.data)
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };
}
