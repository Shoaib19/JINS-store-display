import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IOrdersPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { getCartInfo, postReceptionEvents } from "~/src/clients/carts/cartsClient";
import { postPlaceOrderByCart } from "~/src/clients/oms/omsClient";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import { COUNTRY_CODE_ALPHA2, customerStaffId, OrderType, ReplacementPart } from "~/src/compornents/const";
import { postItemGroupsServer } from "~/src/clients/carts/cartsClient";
import { operations as cartOperations } from "~/src/interfaces/clients/carts/cartsClient";
import { CommonErrorCode, SpecialOrderLensInventoryErrorCode } from "~/src/compornents/errorCode";
import { PlaceOrderByCartPath, PlaceOrderByCartWriteDto, WarrantyExchangeTerm } from "~/src/clients/oms/omsClientTypes";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";

/**
 * オーダー情報確定API
 */
@injectable()
export class OrdersPresenter extends BasePresenter implements IOrdersPresenter {
  /**
   * オーダー確定処理
   * @param req - Request
   * @param res - Response
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    let traceBranchNo: number = 0; // jins-trace-id-branch-no
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

    try {

      // カート・カタログ取得API呼出
      interface CartsGetRequest {
        receptionNumber: string;
        deleteFlag: boolean;
      }

      const cartInfoGetRequest: CartsGetRequest = {
        receptionNumber: req.params.receptionNumber,
        deleteFlag: false,
      };

      logger.info(`cartInfoGetRequest: ${JSON.stringify(cartInfoGetRequest)}`);

      // デジタル基盤層APIを呼び出す
      const cartInfoGetResponse = await sendApiRequest(
        getCartInfo,
        cartInfoGetRequest,
        requestHeader
      );

      logger.info(`cartInfoGetResponse: ${JSON.stringify(cartInfoGetResponse)}`);

      if (!cartInfoGetResponse.ok) {
        throw cartInfoGetResponse;
      }

      // カートカタログAPIのレスポンスのitemGroupsが空でない場合
      if (req.body.jinsAccountId && cartInfoGetResponse.data.cart.itemGroups.length != 0) {
        for (const itemGroup of cartInfoGetResponse.data.cart.itemGroups){
          // 各itemGroupCode毎に処理を実施
          const putItemGroupsPathParameters: cartOperations["putItemGroups"]["parameters"]["path"] = {
            receptionNumber: req.params.receptionNumber,
            itemGroupCode: itemGroup.itemGroupCode,
          };

          //必須項目がnullまたはundefinedの場合
          if(itemGroup.deliveryMethodCode == null || itemGroup.isWaitingLens == null || itemGroup.isDeliveryToday == null){
            throw this.getValidationErrorResponse(requestHeader,cartInfoGetResponse)
          }

          const putItemGroupsContent: cartOperations["putItemGroups"]["requestBody"]["content"]["application/json"] = {
            deliveryMethodCode: itemGroup.deliveryMethodCode,
            deliveryDatetime: itemGroup.deliveryDatetime,
            deliveryStoreCode: itemGroup.deliveryStoreCode ?? undefined,
            customerName: cartInfoGetResponse.data.cart.customerName ?? undefined,
            phoneNumber: cartInfoGetResponse.data.cart.phoneNumber ?? undefined,
            shippingAddressZip: itemGroup.shippingAddressZip ?? undefined,
            shippingAddress1: itemGroup.shippingAddress1 ?? undefined,
            shippingAddress2: itemGroup.shippingAddress2 ?? undefined,
            shippingAddress3: itemGroup.shippingAddress3 ?? undefined,
            shippingAddress4: itemGroup.shippingAddress4 ?? undefined,
            isWaitingLens: itemGroup.isWaitingLens,
            isDeliveryToday: itemGroup.isDeliveryToday,
            jinsAccountId: req.body.jinsAccountId,
          };

          const putItemGroups = {
            ...putItemGroupsPathParameters,
            ...putItemGroupsContent,
          };

          logger.info(`putItemGroups: ${JSON.stringify(putItemGroups)}`);

          // デジタル基盤層APIを呼び出す
          requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
          const putItemGroupsResponse = await sendApiRequest(
            postItemGroupsServer,
            putItemGroups,
            requestHeader
          );

          logger.info(`itemGroupsPostResponse: ${JSON.stringify(putItemGroupsResponse)}`);

          if (!putItemGroupsResponse.ok) {
            throw putItemGroupsResponse;
          }
        }
      }

      // 注文確定API呼出

      //注文商品リストの設定
      const getOrderType = (isWarrantyExchange: boolean, isExchangeLens: boolean) => {
        if(isWarrantyExchange) {
          return OrderType.WARRANTY_EXCHANGE;
        }
        if(isExchangeLens) {
          return OrderType.LENSE_REPLACE;
        }
        return OrderType.PLAIN;
      }
      const orderTypes = cartInfoGetResponse.data.cart?.itemGroups?.map((itemGroup : any) => (
        {
          itemGroupCode:  itemGroup.itemGroupCode!,
          orderType: getOrderType(req.body.warrantyExchange != undefined, itemGroup.isExchangeLens),
          // orderType : req.body.warrantyExchange != undefined ? OrderType.WARRANTY_EXCHANGE : itemGroup.isExchangeLens ? OrderType.LENSE_REPLACE : OrderType.PLAIN,
        }
      ));

      //保証交換商品リストの設定
      const getExchangeItem = (replacementPart : string) => {
        switch(replacementPart) {
          case ReplacementPart.ALL:
            return "ALL";
          case ReplacementPart.FRAME:
            return "FRAME";
          case ReplacementPart.LENSES:
            return "LENSES";
        }
      }
      const warrantyExchangeTerms: WarrantyExchangeTerm[] | undefined = req.body.warrantyExchange != undefined ? [
        {
          itemGroupCode : cartInfoGetResponse.data.cart?.itemGroups?.at(0)?.itemGroupCode,
          exchangeItem : getExchangeItem(req.body.warrantyExchange.replacementPart)!,
        }
      ] : undefined

      // 現在日付を取得
      const currentDate = fixSystemDate(getStoreTimeZone(req));

      const placeOrderByCartPath: PlaceOrderByCartPath = {
        cartId: cartInfoGetResponse.data.cart.cartId,
      }
      const placeOrderByCartWriteDto: PlaceOrderByCartWriteDto = {
        customerName: req.query.customerName ?? cartInfoGetResponse.data.cart.customerName,
        phoneNumber: req.query.phoneNumber ?? cartInfoGetResponse.data.cart.phoneNumber,
        channel: "S", // 店舗（固定値）
        orderDate: currentDate,
        calculationBaseDate: currentDate,
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
        orderTypes : orderTypes,
        warrantyExchangeTerms: warrantyExchangeTerms,
      };
      const placeOrderByCartPostRequest = {
        ...placeOrderByCartPath,
        ...placeOrderByCartWriteDto,
      };

      logger.info(`placeOrderByCartPostRequest: ${JSON.stringify(placeOrderByCartPostRequest)}`);

      // デジタル基盤層APIを呼び出す
      requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
      const placeOrderByCartPostResponse = await sendApiRequest(
        postPlaceOrderByCart,
        placeOrderByCartPostRequest,
        requestHeader
      );

      logger.info(`placeOrderByCartPostResponse: ${JSON.stringify(placeOrderByCartPostResponse)}`);

      if (!placeOrderByCartPostResponse.ok) {
        if (placeOrderByCartPostResponse?.data?.code == SpecialOrderLensInventoryErrorCode.BFF_USSTORESTAFF_0030.OMS_CODE) {
          throw this.getSpecialOrderLensInventoryErrorResponse(requestHeader, placeOrderByCartPostResponse)
        } else {
          throw placeOrderByCartPostResponse;
        }
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
        } else if (error.data.code == SpecialOrderLensInventoryErrorCode.BFF_USSTORESTAFF_0030.OMS_CODE) {
          const bffResponse = this.getSpecialOrderLensInventoryErrorResponse(requestHeader, error)
          res.status(bffResponse.status).json(bffResponse.data)
        } else {
          res.status(error.status).json(error.data);
        }
      } else {
        res.status(500).json(error.data)
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };

  private getValidationErrorResponse = (requestHeader: Headers, response: any): any => {
    return {
      status: 400,
      data: {
        "jins-trace-id": requestHeader.get("jins-trace-id"),
        "code": CommonErrorCode.COM_0001_VALIDATION_ERROR.CODE,
        "message": CommonErrorCode.COM_0001_VALIDATION_ERROR.MESSAGE,
        "details": response.data.message,
      }
    }
  };

  private getSpecialOrderLensInventoryErrorResponse = (requestHeader: Headers, response: any): any => {
    const suiteNo = response?.data?.details?.itemGroupCode.replace(/.*-/, "");
    const messagePrefix = suiteNo ? `(Suite ${suiteNo}) `: ""
    return {
      status: 400,
      data: {
        "jins-trace-id": requestHeader.get("jins-trace-id"),
        "code": SpecialOrderLensInventoryErrorCode.BFF_USSTORESTAFF_0030.BFF_CODE,
        "message": `${messagePrefix}${SpecialOrderLensInventoryErrorCode.BFF_USSTORESTAFF_0030.MESSAGE}`,
        "details": response?.data?.message,
      }
    }
  };
}
