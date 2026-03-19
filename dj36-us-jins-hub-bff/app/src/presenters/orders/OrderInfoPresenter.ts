import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IOrderInfoPresenter } from "~/src/presenters/interfaces";

import dotenv from "dotenv";
import { getCartInfo, postCartInfo, searchReceptionInformation } from "~/src/clients/carts/cartsClient";
import {
    DeliveryStatus,
    OrderStatus,
    OrderStatusName,
    PerspectiveType,
    RegistrationMethod,
    WarrantyItemType,
    ExchangeMaxCount,
    OrderType,
    ReplacementStatusCode,
    ReceptionStatus,
    ReceptionStatusName,
} from "~/src/components/const";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { isNotFoundResponse, ResourceNotFoundError, ValidationError } from "~/src/components/errors";

import { fixDatetimeForFront, fixDatetimeForFrontFromDpfm, toUTCDateFromString } from "~/src/utils/fixDatetime";
import { getOrderByReceptionNumber } from "~/src/clients/salesOrder/salesOrderClient";
import { getPowersById } from "~/src/clients/warranties/warrantiesClient";
import { ProgressiveCategory } from "~/src/components/const";

import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";

// 保証情報(sp16)
import {
  findWarranties,
  findWarrantyHistories,
} from "~/src/clients/warranties/warrantiesClient";
import {
  WarrantyHistoriesGetRequest,
  WarrantiesGetRequest,
  WarrantiesGetResponse,
  WarrantyHistoriesGetResponse,
  warrantyItemInfo,
  PowersGetResponse,
} from "~/src/clients/warranties/warrantiesClientTypes";
import {  getWarrantyExpirationDate } from "~/src/utils/datetimeUtils";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";
import { checkReceptionNumberCountryCode } from "~/src/utils/commonError";
import { Cart, CartGetRequest, CartGetResponse, CartPostResponse, itemGroupCompleteSet, ReceptionInformation, ReceptionInformationSearchRequest, ReceptionInformationSearchResponse } from "~/src/clients/carts/cartsClientTypes";
import { DiscountLineMixinReadDto, GlassLineHorizontalMixinReadDto, OrderGetResponse } from "~/src/clients/salesOrder/salesOrderClientTypes";
import { ApiResponse } from "openapi-typescript-fetch";
import { components, operations } from "~/src/interfaces/root";

// オーダー情報取得API
type FindOrderQuery = operations["getOrder"]["parameters"]["query"];
type OrderRequest = FindOrderQuery;
type OrderResponse = components["schemas"]["OrderResponse"];
type ItemGroupInfo = components["schemas"]["ItemGroupInfo"];
type Prescription = components["schemas"]["ItemGroupInfo"]["prescription"];
type LensOptionInfo = components["schemas"]["LensOptionInfo"];
type CartLineItemInfo = components["schemas"]["CartLineItemInfo"];
type ShippingInfo = components["schemas"]["ShippingInfo"];
type WarrantyInfo = components["schemas"]["WarrantyInfo"];

dotenv.config();

/**
 * オーダー情報取得API
 */
@injectable()
export class OrderInfoPresenter
  implements IOrderInfoPresenter
{
  /**
   * 度数情報設定（カート情報）
   * @param client_item_group - 商品グループコード
   * @returns 度数情報
   */
  private formatPrescription(
    client_item_group: itemGroupCompleteSet
  ): Prescription | null {
    if (client_item_group.registeredPreparation1 == undefined) {
      return null;
    }
    const prescription = JSON.parse(client_item_group.registeredPreparation1);
    const result: Prescription =
      {
        prescriptionId: null, // TODO: 9-11スコープはnull
        prescriptionRegistCode: client_item_group.prescriptionRegistCode??null,
        registrationMethodCode: prescription?.registrationMethodCode,
        registrationMethodName: Object.values(RegistrationMethod).find(
          (value) => prescription?.registrationMethodCode == value.CODE
        )?.NAME,
        prescriptionInfo: prescription?.prescriptionInfo ? {
          vision: prescription?.prescriptionInfo?.vision,
          perspectiveTypeCode:
            prescription?.prescriptionInfo?.perspectiveTypeCode,
          perspectiveTypeName: Object.values(PerspectiveType).find(
            (value) =>
              prescription?.prescriptionInfo?.perspectiveTypeCode == value.CODE
          )?.NAME,
          eyepointRight: prescription?.prescriptionInfo?.eyepointRight,
          eyepointLeft: prescription?.prescriptionInfo?.eyepointLeft,
          pdRight: prescription?.prescriptionInfo?.pdRight,
          pdLeft: prescription?.prescriptionInfo?.pdLeft,
          sphRight: prescription?.prescriptionInfo?.sphRight,
          sphLeft: prescription?.prescriptionInfo?.sphLeft,
          cylRight: prescription?.prescriptionInfo?.cylRight,
          cylLeft: prescription?.prescriptionInfo?.cylLeft,
          axisRight: prescription?.prescriptionInfo?.axisRight,
          axisLeft: prescription?.prescriptionInfo?.axisLeft,
          addRight: prescription?.prescriptionInfo?.addRight,
          addLeft: prescription?.prescriptionInfo?.addLeft,
          prismFlag: prescription?.prescriptionInfo?.prismFlag,
          prism01Right: prescription?.prescriptionInfo?.prism01Right,
          prism01Left: prescription?.prescriptionInfo?.prism01Left,
          baseHRight: prescription?.prescriptionInfo?.baseHRight,
          baseHLeft: prescription?.prescriptionInfo?.baseHLeft,
          prism02Right: prescription?.prescriptionInfo?.prism02Right,
          prism02Left: prescription?.prescriptionInfo?.prism02Left,
          baseVRight: prescription?.prescriptionInfo?.baseVRight,
          baseVLeft: prescription?.prescriptionInfo?.baseVLeft,
        } : undefined,
        prescriptionExpiration: prescription?.prescriptionExpiration
          ? fixDatetimeForFrontFromDpfm(prescription.prescriptionExpiration)
          : undefined,
        prescriptionRegistDate: prescription?.prescriptionRegistDate
          ? fixDatetimeForFrontFromDpfm(prescription.prescriptionRegistDate)
          : undefined,
      };
    return result;
  }

  /**
   * 度数情報設定（注文詳細）
   * @param client_glass_line - 注文メガネ行
   * @returns 度数情報
   */
  private async formatOrderPrescription (
    dpfmRequestInfo: DpfmRequestInfo,
    client_glass_line: GlassLineHorizontalMixinReadDto
  ): Promise<Prescription | null> {
    if (client_glass_line.powerId == undefined) {
      logger.info(`powerId undefined.`);
      return null;
    }

    interface PowersGetRequest {
      powerId: string;
    }

    const powersGetRequest: PowersGetRequest = {
      //powerId: String(client_glass_line.prescriptionId),
      powerId: String(client_glass_line.powerId),
    }

    logger.info(`getPowersByIdRequest: ${JSON.stringify(powersGetRequest)}`);

    // 度数情報取得APIの呼出
    const apiResponse: ApiResponse<PowersGetResponse> = await sendApiRequest(
      getPowersById,
      powersGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`getPowersByIdResponse: ${JSON.stringify(apiResponse)}`);
    const power = apiResponse.data;

    const registrationMethodCode = power.PowerItem?.registrationMethodCode;
    
    const result: Prescription =
      {
        prescriptionId: client_glass_line?.prescriptionId ?? null,
        prescriptionRegistCode: null,
        registrationMethodCode: registrationMethodCode,
        registrationMethodName: Object.values(RegistrationMethod).find(
          (value) => registrationMethodCode == value.CODE
        )?.NAME,
        prescriptionInfo: {
          vision: power.vision,
          perspectiveTypeCode: power.perspectiveTypeCode,
          perspectiveTypeName: Object.values(PerspectiveType).find(
            (value) =>
              power.perspectiveTypeCode == value.CODE
          )?.NAME,
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
        prescriptionExpiration: power?.PowerItem?.expirationDate
          ? fixDatetimeForFrontFromDpfm(power?.PowerItem?.expirationDate)
          : undefined,
      };
    return result;
  }

  /**
   * レンズオプション設定（カート情報）
   * @param client_item_group - 商品グループコード
   * @returns レンズオプション情報
   */
  private parseLensOptionsFromClientItemGroup(
    client_item_group: itemGroupCompleteSet
  ): LensOptionInfo | null {
    const displayTitle = (() => {
      switch (client_item_group.lopProgressiveCategoryLensOptionCode) {
        case ProgressiveCategory.CORRIDOR_LENGTH_11MM.CODE:
          return client_item_group.lopSalesColorNameLensOptionName + "(" + ProgressiveCategory.CORRIDOR_LENGTH_11MM.DISPLAY_NAME + ")"
        case ProgressiveCategory.CORRIDOR_LENGTH_13MM.CODE:
          return client_item_group.lopSalesColorNameLensOptionName + "(" + ProgressiveCategory.CORRIDOR_LENGTH_13MM.DISPLAY_NAME + ")"
        default:
          return client_item_group.lopSalesColorNameLensOptionName
      }
    })();
    const totalPrice =
      client_item_group.lopSalesColorNameSalesPrice !== undefined ||
      client_item_group.lopSalesLensSpecSalesPrice !== undefined ||
      client_item_group.lopFocusCategorySalesPrice !== undefined ||
      client_item_group.lopProgressiveCategorySalesPrice !== undefined ||
      client_item_group.lopRefractiveIndexNameSalesPrice !== undefined
        ? (client_item_group.lopSalesColorNameSalesPrice ?? 0) +
          (client_item_group.lopSalesLensSpecSalesPrice ?? 0) +
          (client_item_group.lopFocusCategorySalesPrice ?? 0) +
          (client_item_group.lopProgressiveCategorySalesPrice ?? 0) +
          (client_item_group.lopRefractiveIndexNameSalesPrice ?? 0)
        : undefined;
    const result: LensOptionInfo = {
      displayTitle: displayTitle??undefined, //TODO: レンズカラー名称 (累進分類)(9-11スコープではレスポンスとして作成、今後削除予定)
      totalPrice: totalPrice,
      salesColorNameItemCode: client_item_group.lopSalesColorNameLensOptionCode??undefined,
      salesColorNameItemName: client_item_group.lopSalesColorNameLensOptionName??undefined,
      salesColorNameItemPrice: client_item_group.lopSalesColorNameSalesPrice??undefined,
      salesLensSpecItemCode: client_item_group.lopSalesLensSpecLensOptionCode??undefined,
      salesLensSpecItemName: client_item_group.lopSalesLensSpecLensOptionName??undefined,
      salesLensSpecItemPrice: client_item_group.lopSalesLensSpecSalesPrice??undefined,
      focusCategoryItemCode: client_item_group.lopFocusCategoryLensOptionCode??undefined,
      focusCategoryItemName: client_item_group.lopFocusCategoryLensOptionName??undefined,
      focusCategoryItemPrice: client_item_group.lopFocusCategorySalesPrice??undefined,
      progressiveCategoryItemCode:
        client_item_group.lopProgressiveCategoryLensOptionCode??undefined,
      progressiveCategoryItemName:
        client_item_group.lopProgressiveCategoryLensOptionName??undefined,
      progressiveCategoryItemPrice:
        client_item_group.lopProgressiveCategorySalesPrice??undefined,
      refractiveIndexNameItemCode:
        client_item_group.lopRefractiveIndexNameLensOptionCode??undefined,
      refractiveIndexNameItemName:
        client_item_group.lopRefractiveIndexNameLensOptionName??undefined,
      refractiveIndexNameItemPrice:
        client_item_group.lopRefractiveIndexNameSalesPrice??undefined,
    };
    let isExistResult = false;
    Object.entries(result).forEach(([key, value]) => {
      if ((value != null || value != undefined) && !key.includes("Price")) {
        isExistResult = true;
        return;
      }
    });

    return isExistResult ? result : null;
  }

  /**
   * レンズオプション設定（注文詳細）
   * @param client_glass_line - 注文メガネ行
   * @returns レンズオプション情報
   */
  private parseLensOptionsFromClientGlassLine(
    client_glass_line: GlassLineHorizontalMixinReadDto
  ): LensOptionInfo | null {
    const displayTitle = (() => {
      switch (client_glass_line.lopProgressiveCategoryItemCode) {
        case ProgressiveCategory.CORRIDOR_LENGTH_11MM.CODE:
          return client_glass_line.lopSalesColorNameItemName + "(" + ProgressiveCategory.CORRIDOR_LENGTH_11MM.DISPLAY_NAME + ")"
        case ProgressiveCategory.CORRIDOR_LENGTH_13MM.CODE:
          return client_glass_line.lopSalesColorNameItemName + "(" + ProgressiveCategory.CORRIDOR_LENGTH_13MM.DISPLAY_NAME + ")"
        default:
          return client_glass_line.lopSalesColorNameItemName
      }
    })();
    const totalPrice =
      client_glass_line.lopSalesColorNameSellingPrice !== undefined ||
      client_glass_line.lopSalesLensSpecSellingPrice !== undefined ||
      client_glass_line.lopFocusCategorySellingPrice !== undefined ||
      client_glass_line.lopProgressiveCategorySellingPrice !== undefined ||
      client_glass_line.lopRefractiveIndexNameSellingPrice !== undefined
        ? (client_glass_line.lopSalesColorNameSellingPrice ?? 0) +
          (client_glass_line.lopSalesLensSpecSellingPrice ?? 0) +
          (client_glass_line.lopFocusCategorySellingPrice ?? 0) +
          (client_glass_line.lopProgressiveCategorySellingPrice ?? 0) +
          (client_glass_line.lopRefractiveIndexNameSellingPrice ?? 0)
        : undefined;
    const result: LensOptionInfo = {
      displayTitle: displayTitle??undefined, //TODO: レンズカラー名称 (累進分類)(9-11スコープではレスポンスとして作成、今後削除予定)
      totalPrice: totalPrice,
      salesColorNameItemCode: client_glass_line.lopSalesColorNameItemCode??undefined,
      salesColorNameItemName: client_glass_line.lopSalesColorNameItemName??undefined,
      salesColorNameItemPrice: client_glass_line.lopSalesColorNameSellingPrice??undefined,
      salesLensSpecItemCode: client_glass_line.lopSalesLensSpecItemCode??undefined,
      salesLensSpecItemName: client_glass_line.lopSalesLensSpecItemName??undefined,
      salesLensSpecItemPrice: client_glass_line.lopSalesLensSpecSellingPrice??undefined,
      focusCategoryItemCode: client_glass_line.lopFocusCategoryItemCode??undefined,
      focusCategoryItemName: client_glass_line.lopFocusCategoryItemName??undefined,
      focusCategoryItemPrice: client_glass_line.lopFocusCategorySellingPrice??undefined,
      progressiveCategoryItemCode:
        client_glass_line.lopProgressiveCategoryItemCode??undefined,
      progressiveCategoryItemName:
        client_glass_line.lopProgressiveCategoryItemName??undefined,
      progressiveCategoryItemPrice:
        client_glass_line.lopProgressiveCategorySellingPrice??undefined,
      refractiveIndexNameItemCode:
        client_glass_line.lopRefractiveIndexNameItemCode??undefined,
      refractiveIndexNameItemName:
        client_glass_line.lopRefractiveIndexNameItemName??undefined,
      refractiveIndexNameItemPrice:
        client_glass_line.lopRefractiveIndexNameSellingPrice??undefined,
    };
    let isExistResult = false;
    Object.entries(result).forEach(([key, value]) => {
      if ((value != null || value != undefined) && !key.includes("Price")) {
        isExistResult = true;
        return;
      }
    });

    return isExistResult ? result : null;
  }

  /**
   * フレーム・ケース情報設定
   * @param productCode - 商品コード
   * @param productName - 商品名
   * @param price - 価格
   * @param isCaseNone - ケースがNoneかどうか
   * @returns フレーム・ケース情報
   */
  private cartLineItemSet(
    productCode?: string,
    productName?: string,
    price?: number,
    isCaseNone?: boolean,
  ): CartLineItemInfo | null {
    if ((!productCode || !productName || price == undefined) && isCaseNone == undefined)
      return null;
    const result = {
      productCode: productCode,
      productName: productName,
      price: price,
      isCaseNone: isCaseNone,
    };
    return result;
  }

  /**
   * 配送先情報設定
   * @param fullName - 顧客名
   * @param address1 - 住所1
   * @param address2 - 住所2
   * @param city - 市
   * @param postalCode - 郵便番号
   * @param state - 州
   * @param phoneNumber - 電話番号
   */
  private shippingItemSet(
    fullName?: string,
    address1?: string,
    address2?: string,
    city?: string,
    postalCode?: string,
    state?: string,
    phoneNumber?: string,
  ): ShippingInfo | null {
    if( !fullName && !address1 && !address2 && !city && !postalCode && !state && !phoneNumber)
      return null;
    const result = {
      fullName: fullName,
      address1: address1,
      address2: address2,
      city: city,
      postalCode: postalCode,
      state: state,
      phoneNumber: phoneNumber,
    }
    return result
  }

  /**
   * 商品グループ情報設定（カート情報）
   * @param client_item_group - 商品グループ
   * @param receptionInformation - 受付情報
   * @returns 商品グループ情報
   */
  private formatItemGroup(
    client_item_group: itemGroupCompleteSet,
    receptionInformation: ReceptionInformation
  ): ItemGroupInfo {
    const deliveryDate: string | undefined | null =
      client_item_group.deliveryDatetime
        ? fixDatetimeForFrontFromDpfm(client_item_group.deliveryDatetime)
        : undefined;
    const result: ItemGroupInfo = {
      itemGroupCode: client_item_group.itemGroupCode,
      callingNumber: client_item_group.callingNumber,
      // 値引き額:商品グループ.割引額
      discountAmount: client_item_group.discountPrice,
      // 料金: 商品グループ.小計
      orderTotal: client_item_group.subtotal,
      prescription: this.formatPrescription(client_item_group),
      frame: this.cartLineItemSet(
        client_item_group.frameItemCode??undefined,
        client_item_group.frameItemName??undefined,
        client_item_group.frameSalesPrice??undefined
      ),
      lensoption: this.parseLensOptionsFromClientItemGroup(client_item_group),
      lensReplacement: {
        lensReplacementFlag: client_item_group.isExchangeLens,
        lensReplacementTypeCode: client_item_group.lensReplacementTypeCode??undefined,
      },
      itemCaseInfo: this.cartLineItemSet(
        client_item_group.caseItemCode??undefined,
        client_item_group.caseItemName??undefined,
        client_item_group.caseSalesPrice??undefined,
        client_item_group.isCaseNone??undefined
      ),
      deliveryInfo:{
        deliveryMethodCode: client_item_group.deliveryMethodCode??undefined,
        deliveryMethodName: client_item_group.deliveryMethodName??undefined,
        deliveryDate: deliveryDate ? deliveryDate : undefined,
        isWaitingLens: client_item_group.isWaitingLens,
        isDeliveryToday: client_item_group.isDeliveryToday,
        shippingInfo: this.shippingItemSet(
          client_item_group.customerName??undefined,
          client_item_group.shippingAddress3??undefined,
          client_item_group.shippingAddress4??undefined,
          client_item_group.shippingAddress2??undefined,
          client_item_group.shippingAddressZip??undefined,
          client_item_group.shippingAddress1??undefined,
          client_item_group.phoneNumber??undefined,
        ),
      },
      note: client_item_group.note??undefined,
      orderStatusCode: null,
      orderStatusName: null,
      receptionStatusCode: receptionInformation?.statusCode,
      receptionStatusName: this.setReceptionStatusName(receptionInformation.statusCode!),
    };
    return result;
  }

  /**
   * 商品グループ情報設定（注文詳細）
   * @param client_glass_line - 注文メガネ行
   * @returns 商品グループ情報
   */
  private async formatOrderItemGroup (
    dpfmRequestInfo: DpfmRequestInfo,
    client_glass_line: GlassLineHorizontalMixinReadDto,
    client_discount_line: DiscountLineMixinReadDto
  ): Promise<ItemGroupInfo> {
    // 注文ステータスコード
    logger.info(`[3] formatOrderItemGroup start`);
    const deliveryDate: string | undefined | null =
    client_glass_line.delivery?.deliveryDateTime
        ? fixDatetimeForFrontFromDpfm(client_glass_line.delivery?.deliveryDateTime)
        : undefined;
    // ケースNone判定
    let isCaseNone: boolean | undefined ;
    if("Case None." === client_glass_line.casePreparation1){
      isCaseNone = true;
    }else{
      isCaseNone = false;
    }
    // レンズ交換判定
    let _lensReplacementFlag: boolean | undefined ;
    if(OrderType.LENSE_REPLACE === client_glass_line.casePreparation1){
      _lensReplacementFlag = true;
    }else{
      _lensReplacementFlag = false;
    }

    const result: ItemGroupInfo = {
      itemGroupCode: client_glass_line.itemGroupCode,
      callingNumber: client_glass_line.callingNumber,
      // 値引き額:商品グループ.割引額
      discountAmount: client_discount_line?.discountAmount??undefined,
      // 料金: 商品グループ.小計
      orderTotal: client_glass_line.subtotalAmount,
      prescription: await this.formatOrderPrescription(dpfmRequestInfo, client_glass_line),
      frame: this.cartLineItemSet(
        client_glass_line.frameItemCode??undefined,
        client_glass_line.frameItemName??undefined,
        client_glass_line.frameSellingPrice??undefined
      ),
      lensoption: this.parseLensOptionsFromClientGlassLine(client_glass_line),
      // レンズ交換情報設定
      lensReplacement: this.setLensReplacementFlag(client_glass_line),
      //lensReplacement: {
      //  lensReplacementFlag: lensReplacementFlag,
        // lensReplacementTypeCode: client_glass_line.lensReplacementTypeItemCode??undefined,
      //},
      itemCaseInfo: this.cartLineItemSet(
        client_glass_line.caseItemCode??undefined,
        client_glass_line.caseItemName??undefined,
        client_glass_line.caseSellingPrice??undefined,
        // client_glass_line.isCaseNone??undefined
        isCaseNone
      ),
      deliveryInfo:{
        deliveryMethodCode: client_glass_line.delivery?.deliveryMethodCode??undefined,
        deliveryMethodName: client_glass_line.delivery?.deliveryMethodName??undefined,
        deliveryDate: deliveryDate ? deliveryDate : undefined,
        // isWaitingLens: client_glass_line.isWaitingLens,
        isWaitingLens: client_glass_line.needsPurchaseLens??undefined,
        // isDeliveryToday: client_glass_line.isDeliveryToday,
        shippingInfo:{
          fullName: client_glass_line.delivery?.customerName??undefined,
          address1: client_glass_line.delivery?.shippingAddress3??undefined,
          address2: client_glass_line.delivery?.shippingAddress4??undefined,
          city: client_glass_line.delivery?.shippingAddress2??undefined,
          postalCode: client_glass_line.delivery?.shippingAddressZip??undefined,
          state: client_glass_line.delivery?.shippingAddress1??undefined,
          phoneNumber: client_glass_line.delivery?.phoneNumber??undefined,
        },
      },
      note: client_glass_line.note??undefined,
      orderStatusCode: this.setOrderStatus(client_glass_line.delivery?.deliveryStatus ?? ""),
      orderStatusName: this.setOrderStatusName(client_glass_line.delivery?.deliveryStatus ?? ""),

    }
    return result;
  }
  /**
   * レンズ交換フラグ設定
   * @param client_glass_line
   * @returns
   */
  private setLensReplacementFlag(
    client_glass_line: GlassLineHorizontalMixinReadDto,
  ) {
    const typeItemCode: string | undefined =client_glass_line.lensReplacementTypeItemCode;
    const result = {
      lensReplacementFlag: !!typeItemCode,
      lensReplacementTypeCode: typeItemCode,
    }
    return result;
  };

  /**
   * 商品グループ情報配列設定
   * @param client_item_groups - 商品グループ
   * @param receptionInformation - 受付情報
   * @returns 商品グループ情報配列
   */
  private formatItemGroups(
    client_item_groups:
      | itemGroupCompleteSet[]
      | undefined,
    receptionInformation: ReceptionInformation,
    queryItemGroupCode: string | undefined,
  ): ItemGroupInfo[] | undefined {
    if (client_item_groups == undefined) {
      logger.info(`itemGroups is undefined`);
      return undefined;
    }
    const result: ItemGroupInfo[] =
      client_item_groups.map((item_group) => this.formatItemGroup(item_group, receptionInformation));
    const filterResult =
      result.filter((itemGroup)=> queryItemGroupCode == undefined || queryItemGroupCode == itemGroup.itemGroupCode)
    logger.info(`formatItemGroups: ${JSON.stringify(filterResult)}`);
    return filterResult;
  }

  /**
   * 商品グループ情報配列設定
   * @param client_item_groups - 商品グループ
   * @returns 商品グループ情報配列
   */
  private formatOrderItemGroups = async (
    dpfmRequestInfo: DpfmRequestInfo,
    client_item_groups: GlassLineHorizontalMixinReadDto[] | undefined,
    client_discount_lines: DiscountLineMixinReadDto[] | undefined,
    queryItemGroupCode: string | undefined,

  ): Promise<ItemGroupInfo[] | undefined> => {
    logger.info(`[2] formatOrderItemGroups start`);
    if (client_item_groups == undefined || client_discount_lines == undefined) {
      logger.info(`glassLines and discountLines is undefined`);
      return undefined;
    }
    const result: ItemGroupInfo[] =
      await Promise.all(
        client_item_groups
        .map(async (item_group, index) => {
          return await this.formatOrderItemGroup(
            generateDpfmRequestInfo(dpfmRequestInfo.bffRequest, (index + 1).toString()),
            item_group,
            client_discount_lines[index]
          );
        })
      );
    const filterResult =
      result.filter((itemGroup)=> queryItemGroupCode == undefined || queryItemGroupCode == itemGroup.itemGroupCode)
    return filterResult;
  }

  /**
   * レスポンス設定（カート情報）
   * @param cartData - カート情報
   * @returns オーダー情報取得レスポンス
   */
  private async formatResponse(
    dpfmRequestInfo: DpfmRequestInfo,
    queryItemGroupCode: string | undefined,
    cartData?: Cart,
  ): Promise<OrderResponse | undefined> {
    // 受付情報取得
    const receptionInformation = await this.getReceptionInformation(
      dpfmRequestInfo,
      cartData?.receptionNumber
    );
    if (receptionInformation == undefined) {
      // 受付情報が見つからないとき
      throw new ResourceNotFoundError(`There is no recode matched ${cartData?.receptionNumber}.`);
    }
    // 保証情報事前取得
    // 保証情報取得用の商品グループコードを設定
    const itemGroupCode: string | undefined = cartData?.itemGroups?.at(0)?.itemGroupCode;
    const warrantyInfo =
      await this.getWarrantyInfo(dpfmRequestInfo, cartData?.receptionNumber, itemGroupCode);
    logger.info(`warrantyInfo ${JSON.stringify(warrantyInfo)}`);
    let warrantyNumber: string | undefined | null = null;
    if (warrantyInfo != undefined) {
      warrantyNumber = warrantyInfo?.warrantyNumber;
    }
    // 返却値設定
    const result: OrderResponse = {
      cartId: cartData?.cartId,
      customerName: cartData?.customerName,
      phoneNumber: cartData?.phoneNumber,
      // 会員ID:
      memberId: cartData?.itemGroups?.[0]?.jinsAccountId,
      subtotal: cartData?.subtotal,
      totalTaxPrice: cartData?.totalTaxPrice,
      totalSalesPrice: cartData?.totalSalesPrice,
      // #TODO プロモーションコード
      promotionCodes: '002',
      // 値引き額（総額）: カート.割引額合計
      totalDiscountAmount: cartData?.totalDiscountPrice,
      // #TODO 値引き理由
      reasonCode: "002",
      itemGroups: this.formatItemGroups(cartData?.itemGroups, receptionInformation, queryItemGroupCode),
      // 保証情報(sp16)
      warrantyNumber: warrantyNumber,
      expirationDate: warrantyInfo?.expirationDate,
      frameAvailableExchanges: warrantyInfo?.frameCounter,
      lensAvailableExchanges: warrantyInfo?.lensCounter,
      warrantyList: warrantyInfo?.warrantyLists,
    };
    logger.info(`formatResponse: ${JSON.stringify(result)}`);
    return result;
  }

/**
 * レスポンス設定（注文詳細）
 * @param orderData - 注文詳細
 * @returns オーダー情報取得レスポンス
 */
  private async formatOrderResponse(
    orderData: OrderGetResponse,
    dpfmRequestInfo: DpfmRequestInfo,
    itemGroupCode: string | undefined,
  ): Promise<OrderResponse | undefined> {
    logger.info(`formatOrderResponse start: ${orderData?.customerName}`);
    logger.info(`[1] ${JSON.stringify(orderData)}`);

    // いったんオーダ情報から商品情報を取得しておく
    const itemGroups = await this.formatOrderItemGroups(
      dpfmRequestInfo,
      orderData?.glassLines,
      orderData?.discountLines,
      itemGroupCode
    );

    // 保証情報事前取得
    let wkItemGroupCode: string | undefined;
    if(itemGroups != undefined) {
      // 保証情報取得用の商品グループコードを設定
      wkItemGroupCode = itemGroups[0].itemGroupCode;
    }
    const warrantyInfo =
      await this.getWarrantyInfo(dpfmRequestInfo, orderData?.receptionNumber, wkItemGroupCode);
    logger.info(`warrantyInfo ${JSON.stringify(warrantyInfo)}`);
    // 返却値設定
    const result: OrderResponse = {
      cartId: orderData?.cartId,
      customerName: orderData?.customerName,
      phoneNumber: orderData?.phoneNumber,
      // 会員ID:
      memberId: orderData?.customerId,
      subtotal: orderData?.totalSellingAmount,
      totalTaxPrice: orderData?.totalTaxAmount,
      totalSalesPrice: orderData?.totalAmount,
      // #TODO プロモーションコード
      promotionCodes: '002',
      // 値引き額（総額）: カート.割引額合計
      totalDiscountAmount: orderData?.totalDiscountAmount,
      // #TODO 値引き理由
      reasonCode: "002",
      itemGroups: itemGroups,
      // 保証情報(sp16)
      warrantyNumber: warrantyInfo?.warrantyNumber,
      expirationDate: warrantyInfo?.expirationDate,
      frameAvailableExchanges: warrantyInfo?.frameCounter,
      lensAvailableExchanges: warrantyInfo?.lensCounter,
      warrantyList: warrantyInfo?.warrantyLists,
    };
    logger.info(`formatOrderResponse: ${JSON.stringify(result)}`);
    return result;
  }

   /**
   * 保証情報取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param warrantyNumber 保証書番号
   */
   private async findWarrantyItems(
    dpfmRequestInfo: DpfmRequestInfo,
    warrantyNumber: string | undefined,
  ) {
    // 保証情報取得API呼出
    try{
      const findWarrantiesRequest: WarrantiesGetRequest = {
        warrantyNumber: String(warrantyNumber),
        deleteFlag : false,
      };
      logger.info(
        `getFindWarrantiesRequest: ${JSON.stringify(findWarrantiesRequest)}`);
      const apiResponse: ApiResponse<WarrantiesGetResponse> = await sendApiRequest(
        findWarranties,
        findWarrantiesRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );
      logger.info(`getFindWarrantiesResponse: ${JSON.stringify(apiResponse)}`);
      const warrantiesResponse = apiResponse.data;
      const warrantyItems:warrantyItemInfo[] | undefined = warrantiesResponse.warrantyInfo?.warrantyItems;
      return warrantyItems;
    } catch (error) {
      if (isNotFoundResponse(error)) {
        return undefined;
      }
      throw error;
    }
  };

  /**
   * 受付番号から受付情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @returns 受付情報 | undefined
   */
  private async getReceptionInformation(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber?: string
  ) {
    // 受付情報検索API呼び出し
      if(receptionNumber == undefined){
        logger.info(`receptionNumber is undefined`);
        return undefined;
      }
      const searchReceptionInformationRequest: ReceptionInformationSearchRequest = {
        receptionNumber: receptionNumber,
      };
      logger.info(`searchReceptionInformationRequest: ${JSON.stringify(searchReceptionInformationRequest)}`);

      const apiResponse : ApiResponse<ReceptionInformationSearchResponse> = await sendApiRequest(
        searchReceptionInformation,
        searchReceptionInformationRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );

      logger.info(`searchReceptionInformationResponse: ${JSON.stringify(apiResponse)}`);

      const searchReceptionInformationResponse = apiResponse.data;
      return searchReceptionInformationResponse.ReceptionInfoAllItems?.at(0);
    }

  /**
   * 保証履歴取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   */
  private async findWarrantyHistory(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string | undefined,
    warrantyNumber: string | undefined,
    replacementStatusCode: string | undefined
  ) {
    // 保証履歴情報取得API呼出
    try {
      const findWarrantyHistoriesRequest: WarrantyHistoriesGetRequest = {
        receptionNumber: receptionNumber,
        warrantyNumber: warrantyNumber,
        replacementStatusCode: replacementStatusCode
      };
      logger.info(
        `getFindWarrantyHistoriesRequest: ${JSON.stringify(findWarrantyHistoriesRequest)}`
      );
      const apiResponse: ApiResponse<WarrantyHistoriesGetResponse> = await sendApiRequest(
        findWarrantyHistories,
        findWarrantyHistoriesRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );
      logger.info(`getFindWarrantyHistoriesResponse: ${JSON.stringify(apiResponse)}`);
      const warrantyHistoriesResponse = apiResponse.data;
      return warrantyHistoriesResponse.warrantyHistories;
    } catch (error) {
      if (isNotFoundResponse(error)) {
        return undefined;
      }
      throw error;
    }
  }

  /**
   * 保証情報取得編集
   * @param dpfmRequestInfo
   * @param receptionNumber
   * @returns
   */
  private async getWarrantyInfo (
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string | undefined,
    itemGroupCode: string | undefined,
  ) {
    // 保証履歴情報取得
    const excludeInitialStatus=ReplacementStatusCode.TEMPORARY
    +","+ReplacementStatusCode.PROCESSING
    +","+ReplacementStatusCode.DONE;
    const warrantyHistories =
      await this.findWarrantyHistory(dpfmRequestInfo, receptionNumber, undefined, excludeInitialStatus);

    // 保証情報取得用キー生成
    let warrantyReqKey: string | undefined = "";
    if (warrantyHistories == undefined) {
      warrantyReqKey = itemGroupCode;
    }else{
      warrantyReqKey = warrantyHistories[0].warrantyNumber;
    }
    if (warrantyReqKey == undefined) {
      return undefined;
    }
    const warrantyItems =
      await this.findWarrantyItems(dpfmRequestInfo, warrantyReqKey);
    if (warrantyItems == undefined || warrantyItems.length == 0) {
      return undefined;
    }

    // 各回数カウント（※各国展開修正対象）
    const exchangeCount = this.getExchangeCount(warrantyItems);
    logger.info(`targetCountryDeploymentCorrection ${JSON.stringify(exchangeCount)}`);
    // 有効期限（※各国展開修正対象）
    const timeZone = getStoreTimeZone(dpfmRequestInfo.bffRequest);
    const expirationDate =
      fixDatetimeForFront(
        getWarrantyExpirationDate(
          toUTCDateFromString(warrantyItems[0].warrantyStartDate, timeZone),
          timeZone
        )
      ) ?? undefined;
    logger.info(`targetCountryDeploymentCorrection ${JSON.stringify(expirationDate)}`);
    // 交換済みの保証履歴一覧を取得
    const replaceDoneWarrantyHistories =
      await this.findWarrantyHistory(dpfmRequestInfo, undefined, warrantyReqKey, ReplacementStatusCode.DONE);
    
    // レスポンス「warrantyList」領域の作成
    const warrantyLists: WarrantyInfo[] | undefined = replaceDoneWarrantyHistories?.map((history) => ({
      receptionNumber: history.receptionNumber,
      itemGroupCode: history.receptionNumber + "-1",  // sprint16暫定対応
      exchangeDate: fixDatetimeForFrontFromDpfm(history.receiptDatetime)??undefined,
      replaceTypeCode: history.replacementType,
      replacePartCode: history.replacementPart,
      replaceReasonCode: history.replacementReason,
    }));

    const result = {
      warrantyNumber: warrantyReqKey,
      expirationDate: expirationDate,
      frameCounter: exchangeCount.frameCounter,
      lensCounter: exchangeCount.lensCounter,
      warrantyLists: warrantyLists,
    };
    logger.info(`warrantyInfo result ${JSON.stringify(result)}`);
    return result;
  };

  /**
   * 交換回数取得
   * @param warranties
   * @returns
   * @note 各国展開修正対象
   */
  private getExchangeCount(
    warranties:warrantyItemInfo[],
  ) {
    const frameExchangeMaxCnt = ExchangeMaxCount.FRAME;
    const lensExchangeMaxCnt = ExchangeMaxCount.LENS;
    // 交換可能回数算出
    let frameCont: number = frameExchangeMaxCnt -
       (warranties?.filter((item) =>
         [WarrantyItemType.FRAME].includes(item.itemType!))
          .map((item) => item.exchangeCount).at(0) ?? 0);
    let lensCont: number = lensExchangeMaxCnt -
      (warranties?.filter((item) =>
        [WarrantyItemType.LENS_LEFT, WarrantyItemType.LENS_RIGHT].includes(item.itemType!))
        .map((item) => item.exchangeCount).at(0) ?? 0);
    // 交換可能回数が0未満の場合、0とする
    if (frameCont < 0) {
      frameCont = 0;
    }
    if (lensCont < 0) {
      lensCont = 0;
    }
    const result = {
      frameCounter: frameCont,
      lensCounter: lensCont,
    }
    return result;
  };

  /**
   * オーダー情報取得処理
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
      // バリデーションチェック
      this.validateRequest(req);

      const dpfmRequestInfo = generateDpfmRequestInfo(req);

      // クエリから商品グループコードを取得
      const query: OrderRequest = req.query;
      const queryItemGroupCode = query.itemGroupCode;
      logger.info(`req.query ${queryItemGroupCode}`);

      if (req.query.receptionNumber) {
        // OMSの注文詳細取得API呼出

        try {
          logger.info(`getOrderByReceptionNumberRequest: ${JSON.stringify(req.query.receptionNumber)}`);
          const apiResponse: ApiResponse<OrderGetResponse> = await sendApiRequest(
            getOrderByReceptionNumber,
            {receptionNumber: req.query.receptionNumber},
            makeDpfmRequestHeader(dpfmRequestInfo),
          );
          logger.info(`getOrderByReceptionNumberResponse: ${JSON.stringify(apiResponse)}`);

          const orderData = apiResponse.data;
          logger.info(`orderData count: ${orderData.glassLines?.length }`);
          if (orderData && orderData.glassLines && orderData.glassLines?.length > 0) {
            const result: OrderResponse | undefined =
              await this.formatOrderResponse(orderData, dpfmRequestInfo, queryItemGroupCode);
            logger.info(`return receptionInfoSet ${JSON.stringify(result)}`);
            res.status(200).send(result);
//              logger.info(`return ${result}`);
            return;
          }
          // }
        } catch(error) {
          if (!isNotFoundResponse(error)) {
            // 何もしない
            logger.error(`getOrderByReceptionNumber failed. ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
          }
        }
      }

      // カートカタログ取得API呼出
      const cartInfoGetRequest: CartGetRequest = {
        receptionNumber: req.query.receptionNumber ? String(req.query.receptionNumber) : undefined,
        cartId: req.query.cartId ? Number(req.query.cartId) : undefined,
        deleteFlag: false,
      };

      logger.info(`getCartInfoRequest: ${JSON.stringify(cartInfoGetRequest)}`);

      const apiResponse: ApiResponse<CartGetResponse> = await sendApiRequest(
        getCartInfo,
        cartInfoGetRequest,
        makeDpfmRequestHeader(dpfmRequestInfo),
        process.env.CART_SERVICE_JP
      );

      logger.info(`getCartInfoResponse: ${JSON.stringify(apiResponse)}`);

      const cartInfoGetResponse = apiResponse.data

      /**
       * カート新規作成
       */
      //NOTE: cart empty check
      if (
        cartInfoGetResponse.cart === null ||
        cartInfoGetResponse.cart?.itemGroups === undefined ||
        cartInfoGetResponse.cart?.itemGroups.length === 0
      ) {

        // カート新規作成時、受付事業国と異なる場合はエラー
        await checkReceptionNumberCountryCode(dpfmRequestInfo, String(req.query.receptionNumber ?? ""));
        
        const cartInfoPostRequest: CartGetRequest = {
          receptionNumber: String(req.query.receptionNumber),
        };

        logger.info(`postCartInfoRequest: ${JSON.stringify(cartInfoPostRequest)}`);

        const apiResponse: ApiResponse<CartPostResponse> = await sendApiRequest(
          postCartInfo,
          cartInfoPostRequest,
          makeDpfmRequestHeader(dpfmRequestInfo),
        );
        logger.info(`postCartInfoResponse: ${JSON.stringify(apiResponse)}`);
        const cartInfoPostResponse = apiResponse.data
        const cartData: Cart | undefined = cartInfoPostResponse.cart;
        const result: OrderResponse | undefined =
          await this.formatResponse(dpfmRequestInfo, queryItemGroupCode, cartData);
        logger.info(`return noCartInfo ${JSON.stringify(result)}`);
        res.status(200).send(result);
        return;
      } else {
        const cartData: Cart = cartInfoGetResponse.cart;
        const result: OrderResponse | undefined =
          await this.formatResponse(dpfmRequestInfo, queryItemGroupCode, cartData);
        logger.info(`return cartInfoSet ${JSON.stringify(result)}`);
        res.status(200).send(result);
        return;
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * リクエストバリデート
   * @param req - Request
   * @returns ErrorResponse | undefined
   */
  private validateRequest(req: Request) {
    if (!req.query.receptionNumber && ! req.query.cartId ) {
      throw new ValidationError("You must specify either receptionNumber or cartId.");
    }
  }

  /**
   * 注文ステータスコード設定
   * @param deliveryStatus - deliveryStatus
   * @returns string
   */
  private setOrderStatus(deliveryStatus: string): string {
    switch (deliveryStatus) {
      case DeliveryStatus.BEFORE_PREPARING:
        return OrderStatus.PAYMENT
      case DeliveryStatus.DELIVERY_PREPARING:
        return OrderStatus.PROCESSING
      case DeliveryStatus.READY_FOR_DELIVERY:
        return OrderStatus.PICKUP
      case DeliveryStatus.DELIVERED:
        return OrderStatus.ORDER_COMPLETED
      case DeliveryStatus.DELIVERY_CANCELED:
        return OrderStatus.ORDER_CANCELED
      default:
        return OrderStatus.PAYMENT
    };
  }
  /**
   * 注文ステータス名設定
   * @param deliveryStatus - deliveryStatus
   * @returns string
   */
  private setOrderStatusName(deliveryStatus: string): string {
    switch (deliveryStatus) {
      case DeliveryStatus.BEFORE_PREPARING:
        return OrderStatusName.PAYMENT
      case DeliveryStatus.DELIVERY_PREPARING:
        return OrderStatusName.PROCESSING
      case DeliveryStatus.READY_FOR_DELIVERY:
        return OrderStatusName.PICKUP
      case DeliveryStatus.DELIVERED:
        return OrderStatusName.ORDER_COMPLETED
      case DeliveryStatus.DELIVERY_CANCELED:
        return OrderStatusName.ORDER_CANCELED
      default:
        return "";
    };
  }

   /**
   * 注文ステータス名設定
   * @param deliveryStatus - deliveryStatus
   * @returns string
   */
  private setReceptionStatusName(receptionStatus: string): string | undefined {
    switch (receptionStatus) {
      case ReceptionStatus.MEASUREMENT:
        return ReceptionStatusName.MEASUREMENT;
      case ReceptionStatus.REGISTERED:
        return ReceptionStatusName.REGISTERED;
      case ReceptionStatus.ORDER_NEW:
        return ReceptionStatusName.ORDER_NEW;
      case ReceptionStatus.PAYMENT:
        return ReceptionStatusName.PAYMENT;
      case ReceptionStatus.PROCESSING:
        return ReceptionStatusName.PROCESSING;
      case ReceptionStatus.ADJUSTMENT:
        return ReceptionStatusName.ADJUSTMENT;
      case ReceptionStatus.GENERAL_HELP:
        return ReceptionStatusName.GENERAL_HELP;
      case ReceptionStatus.PICK_UP:
        return ReceptionStatusName.PICK_UP;
      case ReceptionStatus.COMPLETE:
        return ReceptionStatusName.COMPLETED;
      case ReceptionStatus.ORDER_COMPLETE:
        return ReceptionStatusName.ORDER_COMPLETE;
      case ReceptionStatus.CANCEL:
        return ReceptionStatusName.CANCEL;
      case ReceptionStatus.CANCELED:
        return ReceptionStatusName.CANCELED;
      default:
        return undefined;
    };
  }
}
