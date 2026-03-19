import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IOrdersPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { getCartInfo } from "~/src/clients/carts/cartsClient";
import { postPlaceOrderByCart } from "~/src/clients/oms/omsClient";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import { COUNTRY_CODE_ALPHA2, OrderType, ReplacementPart, USE_INVENTORY } from "~/src/components/const";
import { postItemGroupsServer } from "~/src/clients/carts/cartsClient";
import { SpecialOrderLensInventoryMessageReplacement } from "~/src/components/errorCode";
import { PlaceOrderByCartPostRequest, OrderType as OmsOrderType, WarrantyExchangeTerm } from "~/src/clients/oms/omsClientTypes";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";
import { DpfmRequestInfo, generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";
import { components, operations } from "~/src/interfaces/root";
import { Cart, CartGetRequest, CartGetResponse, itemGroupCompleteSet, ItemGroupsPutRequest } from "~/src/clients/carts/cartsClientTypes";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import { ApplicationError, isCodeIncludes, ResourceNotFoundError, ValidationError } from "~/src/components/errors";

/**
 * オーダー情報確定API
 */
@injectable()
export class OrdersPresenter implements IOrdersPresenter {
  /**
   * オーダー確定処理
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
      const path = req.params as operations['postOrder']['parameters']['path'];
      const body: components["schemas"]["OrderPostRequest"] = req.body;
      logger.info(`req.body: ${JSON.stringify(body)}`);

      // カート・カタログ取得
      const cart = await this.getCart(dpfmRequestInfo, path.receptionNumber);
      if (!cart.itemGroups?.at(0)) {
        throw new ResourceNotFoundError(`Item groups does not exist.`);
      }

      // JINSアカウントIDを商品グループに反映
      if (body.jinsAccountId != undefined) {
        for (const itemGroup of cart.itemGroups) {
          await this.updateItemGroup(
            dpfmRequestInfo,
            itemGroup,
            path.receptionNumber,
            body.jinsAccountId
          );
        };
      }

      // 注文確定
      await this.placeOrder(dpfmRequestInfo,
        cart,
        body.customerName,
        body.phoneNumber,
        body.warrantyExchange,
      );

      res.status(200).send();
      return;
    } catch (error) {
      next(error);
    }
  };

  /**
   * カート情報取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @returns カート情報
   */
  private getCart = async (
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string
  ): Promise<Cart> => {
    // カート・カタログ取得API
    const cartInfoGetRequest: CartGetRequest = {
      receptionNumber: receptionNumber,
      deleteFlag: false,
    };
    logger.info(`getCartInfoRequest: ${JSON.stringify(cartInfoGetRequest)}`);

    const apiResponse: ApiResponse<CartGetResponse> = await sendApiRequest(
      getCartInfo,
      cartInfoGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`getCartInfoResponse: ${JSON.stringify(apiResponse)}`);
    if (!apiResponse.data.cart) {
      throw new ResourceNotFoundError(`Cart not found: receptionNumber=${receptionNumber}.`);
    }
    return apiResponse.data.cart;
  }

  /**
   * 商品グループ更新
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param itemGroup 商品グループ
   * @param receptionNumber 受付番号
   * @param jinsAccountId JINSアカウントID
   */
  private updateItemGroup = async(
    dpfmRequestInfo: DpfmRequestInfo,
    itemGroup: itemGroupCompleteSet,
    receptionNumber: string,
    jinsAccountId: string,
  ): Promise<void> => {
    //必須項目がnullまたはundefinedの場合
    if (
      itemGroup.deliveryMethodCode == null ||
      itemGroup.isWaitingLens == null ||
      itemGroup.isDeliveryToday == null
    ) {
      const suiteNo = itemGroup.itemGroupCode!.replace(/.*-/, "");
      const messagePrefix = `(Set ${suiteNo}) `;
      const unset = [
        !itemGroup.deliveryMethodCode ? "deliveryMethodCode" : undefined,
        !itemGroup.isWaitingLens ? "isWaitingLens" : undefined,
        !itemGroup.isDeliveryToday ? "isDeliveryToday" : undefined,
      ];
      const message = `The ${unset.filter(v => v).join(',')} is required.`;
      logger.info(`${itemGroup.itemGroupCode!}: ${message}`);
      throw new ValidationError(`${messagePrefix}${message}`);
    }
    // 各itemGroupCode毎に処理を実施
    const putItemGroupsRequest : ItemGroupsPutRequest = {
      receptionNumber: receptionNumber,
      itemGroupCode: itemGroup.itemGroupCode!,
      deliveryMethodCode: itemGroup.deliveryMethodCode,
      deliveryDatetime: itemGroup.deliveryDatetime??undefined,
      deliveryStoreCode: itemGroup.deliveryStoreCode ?? undefined,
      customerName: itemGroup.customerName ?? undefined,
      phoneNumber: itemGroup.phoneNumber ?? undefined,
      shippingAddressZip: itemGroup.shippingAddressZip ?? undefined,
      shippingAddress1: itemGroup.shippingAddress1 ?? undefined,
      shippingAddress2: itemGroup.shippingAddress2 ?? undefined,
      shippingAddress3: itemGroup.shippingAddress3 ?? undefined,
      shippingAddress4: itemGroup.shippingAddress4 ?? undefined,
      isWaitingLens: itemGroup.isWaitingLens,
      isDeliveryToday: itemGroup.isDeliveryToday,
      jinsAccountId: jinsAccountId,
    };

    logger.info(`postItemGroupsRequest: ${JSON.stringify(putItemGroupsRequest)}`);

    const putItemGroupsResponse: ApiResponse<unknown> = await sendApiRequest(
      postItemGroupsServer,
      putItemGroupsRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`postItemGroupsResponse: ${JSON.stringify(putItemGroupsResponse)}`);
  }

  /**
   * 注文確定
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param cart カート 
   * @param customerName 注文者名 
   * @param phoneNumber 電話番号
   * @param warrantyExchange 保証交換
   */
  private placeOrder = async (
    dpfmRequestInfo: DpfmRequestInfo,
    cart: Cart,
    customerName?: string,
    phoneNumber?: string,
    warrantyExchange?: components["schemas"]["warrantyExchange"],
  ): Promise<void> => {
    //注文商品リストの設定
    const getOrderType = (isWarrantyExchange: boolean, isExchangeLens: boolean | undefined) => {
      if(isWarrantyExchange) {
        return OrderType.WARRANTY_EXCHANGE;
      }
      if(isExchangeLens) {
        return OrderType.LENSE_REPLACE;
      }
      return OrderType.PLAIN;
    }

    //保証交換商品リストの設定
    const getExchangeItem = (replacementPart : string) => {
      switch(replacementPart) {
        case ReplacementPart.ALL:
          return "ALL";
        case ReplacementPart.FRAME:
          return "FRAME";
        case ReplacementPart.LENSES:
          return "LENSE";
      }
    }

    try {
      // 現在日付を取得
      const currentDate = fixSystemDate(getStoreTimeZone(dpfmRequestInfo.bffRequest));
      const orderTypes: OmsOrderType[] | undefined = cart.itemGroups?.map((itemGroup) => (
        {
          itemGroupCode:  itemGroup.itemGroupCode!,
          orderType: getOrderType(warrantyExchange != undefined, itemGroup.isExchangeLens),
        }
      ));
      const itemGroup = cart.itemGroups?.at(0);
      const warrantyExchangeTerms: WarrantyExchangeTerm[] | undefined = warrantyExchange != undefined ? [
        {
          itemGroupCode : itemGroup!.itemGroupCode!,
          exchangeItem : getExchangeItem(warrantyExchange.replacementPart!)!,
        }
      ] : undefined

      const placeOrderByCartPostRequest: PlaceOrderByCartPostRequest = {
        cartId: cart.cartId!,
        customerName: customerName!,
        phoneNumber: phoneNumber ?? cart.phoneNumber!,
        channel: "S", // 店舗（固定値）
        orderDate: currentDate,
        calculationBaseDate: currentDate,
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
        orderTypes : orderTypes,
        warrantyExchangeTerms: warrantyExchangeTerms,
        useInventory: USE_INVENTORY
      };

      logger.info(`postPlaceOrderByCartRequest: ${JSON.stringify(placeOrderByCartPostRequest)}`);
      const apiResponse: ApiResponse<unknown> = await sendApiRequest(
        postPlaceOrderByCart,
        placeOrderByCartPostRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );

      logger.info(`postPlaceOrderByCartResponse: ${JSON.stringify(apiResponse)}`);

    } catch (error) {
      if (error instanceof ApiError) {
        const messageReplacement = SpecialOrderLensInventoryMessageReplacement.find(replace => isCodeIncludes(error, replace.DPFM_CODE));
        if (messageReplacement) {
          const data = error.data; // any
          const suiteNo = data?.details?.itemGroupCode?.replace(/.*-/, "");
          const messagePrefix = suiteNo ? `(Set ${suiteNo}) ` : "";

          throw new ApplicationError(
            {
              code: messageReplacement.BFF_MESSAGE.code,
              message:`${messagePrefix}${messageReplacement.BFF_MESSAGE.message}`,
            },
            data?.message
          );
        }
      }
      throw error;
    }
  }
}
