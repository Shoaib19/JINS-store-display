import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IItemCaseInfoPresenter } from "~/src/presenters/interfaces";
import { getItemsServer } from "~/src/clients/items/itemsClient";
import { getInventoriesServer } from "~/src/clients/inventories/inventoriesClient";
import { logger } from "~/src/logging/logger";
import dotenv from "dotenv";
import { ItemCategory, SalesItemCategoryMgmtCode, SalesItemCategoryCode, customerStaffId, COUNTRY_CODE_ALPHA2 } from "~/src/compornents/const";
import { sendApiRequest } from "~/src/utils/fetchService";
import { getCartInfo } from "~/src/clients/carts/cartsClient";
import { getSellingPrices,getSellingPricesRequestQuery } from "~/src/clients/prices/pricesClient";
import { operations as pricesOperations } from "~/src/interfaces/clients/prices/pricesClient";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";

dotenv.config();

/**
 * ステータス
 */
@injectable()
export class ItemCaseInfoPresenter
  extends BasePresenter
  implements IItemCaseInfoPresenter
{
  /**
   * 商品情報取得処理（ケース）
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

      interface ItemCatalogParameters {
        countryCodeAlpha2List: string;
        salesItemCategoryMgmtCode: string;
        salesItemCategoryCode: string;
        sortKey: string; //NOTE: ["priceUs:ASC", "itemCode:ASC"]
        deletedGetFlag: boolean;
      }

      interface InventoriesParameters {
        locationCodeList: string; //NOTE: リクエスト.storeCode
        itemIdList: string; //NOTE: 商品マスタ検索APIのrecords[].itemId ※カンマ区切りで渡すためstringで設定
        salesStatusIdList: number; //NOTE: 「販売可」に固定
        itemStatusIdList: number; //NOTE: 「良品」に固定
      }

      interface CartsParameters {
        receptionNumber: string;
        deleteFlag: boolean;
      }

      interface ItemCaseInfoType {
        itemCode?: string;
        itemName?: string;
        price: number | null;
        stockQuantity: number;
        disableFlag: boolean;
        selectedFlag: boolean;
      }
      interface CaseInfoResponse {
        itemCaseInfo: ItemCaseInfoType[];
      }

      // 商品検索API
      const itemCaseGetRequest: ItemCatalogParameters = {
        countryCodeAlpha2List: COUNTRY_CODE_ALPHA2, // 固定値
        salesItemCategoryMgmtCode: SalesItemCategoryMgmtCode.STORE_EC,
        salesItemCategoryCode: SalesItemCategoryCode.CASE,
        sortKey: "itemCode:ASC",  // 商品コード昇順
        deletedGetFlag: false,
      };

      logger.info(`itemCaseGetRequest: ${JSON.stringify(itemCaseGetRequest)}`);

      const itemCaseGetResponse = await sendApiRequest(
        getItemsServer,
        itemCaseGetRequest,
        requestHeader,
      );
      logger.info(`itemCaseGetResponse: ${JSON.stringify(itemCaseGetResponse)}`);

      // 在庫数取得API
      //TODO: import InventoriesGetResponse from ./src/interfaces/clients/inventories/inventoriesClient.ts and define args type
      function getInventryList(inventoriesResponse: any) {
        return inventoriesResponse.data.records.map((inventory_item: any) => {
          return inventory_item.inventoryQuantity;
        });
      }

      if (!(itemCaseGetResponse.ok && "records" in itemCaseGetResponse.data && Array.isArray(itemCaseGetResponse.data.records))) {
        throw itemCaseGetResponse;
      }

      let data: CaseInfoResponse = { itemCaseInfo: [] };

      // 商品検索APIレスポンスのrecordsが空でない場合
      if (itemCaseGetResponse.data.records.length != 0) {
        const itemIdList = itemCaseGetResponse.data.records.map((record: { itemId: number; }) => {return record.itemId})
        const inventoriesGetRequest: InventoriesParameters = {
          locationCodeList: req.params.storeCode, //NOTE: リクエスト.storeCode
          itemIdList: itemIdList.join(), //NOTE: 商品マスタ検索APIのrecords[].itemId
          salesStatusIdList: 1, //NOTE: 「販売可」に固定
          itemStatusIdList: 1, //NOTE: 「良品」に固定
        };

        logger.info(`inventoriesGetRequest: ${JSON.stringify(inventoriesGetRequest)}`);

        // const inventoriesGetResponse = await sendApiRequest(
        //   getInventoriesServer,
        //   inventoriesGetRequest,
        //   requestHeader,
        // );
        // logger.info(`inventoriesGetResponse: ${JSON.stringify(inventoriesGetResponse)}`);

        // if (!inventoriesGetResponse.ok) {
        //   throw inventoriesGetResponse;
        // }
        // const inventory_list = getInventryList(inventoriesGetResponse);

        // カート・カタログ取得API
        const cartInfoGetRequest: CartsParameters = {
          receptionNumber: req.params.receptionNumber,
          deleteFlag: false,
        };
        logger.info(`cartInfoGetRequest: ${JSON.stringify(cartInfoGetRequest)}`);

        const cartInfoGetResponse = await sendApiRequest(getCartInfo, cartInfoGetRequest, requestHeader);
        logger.info(`cartInfoGetResponse: ${JSON.stringify(cartInfoGetResponse)}`);

        if (!cartInfoGetResponse.ok) {
          throw cartInfoGetResponse;
        }

        // 現在日付の取得
        const currentDate = fixSystemDate(getStoreTimeZone(req))!;
        const searchTargetList: getSellingPricesRequestQuery["searchTargetList"] = itemIdList.map((itemId: number) => {
          return {
            sellingPriceCategoryCode: "01", // 固定値 単品（フレーム、ケース、セリート）
            salesTargetId: itemId,
          };
        });

        // 売価検索API
        const sellingPricesGetRequest: pricesOperations["getSellingPrices"]["parameters"]["query"] = {
          countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
          salesDate: currentDate,
          query: JSON.stringify({"searchTargetList": searchTargetList}),
        };

        logger.info(`sellingPricesGetRequest: ${JSON.stringify(sellingPricesGetRequest)}`);

        const sellingPricesGetResponse = await sendApiRequest(getSellingPrices, sellingPricesGetRequest, requestHeader);
        logger.info(`sellingPricesGetResponse: ${JSON.stringify(sellingPricesGetResponse)}`);

        if (!sellingPricesGetResponse.ok) {
          throw sellingPricesGetResponse;
        }

        const stockQuantity: number = 5; // TODO: 9-11スコープでは在庫数:5で固定

        itemCaseGetResponse.data.records.map(
          (case_item: { itemCode: string; salesItemName: string; itemId: number}) => {
            // リクエストされた商品グループコードと合致している配列を抽出
            let selectedFlag = false;
            if(cartInfoGetResponse.data.cart){
              const selectedItemGroups = cartInfoGetResponse.data.cart.itemGroups.filter(
                (itemGroup: { itemGroupCode: string }) =>
                  itemGroup.itemGroupCode === req.params.itemGroupCode
              );
              // カート選択中フラグを取得（carts_response.caseItemCode と case_item.itemCode の合致判定）
              selectedFlag = selectedItemGroups.some(
                (itemGroup: { caseItemCode: string }) =>
                  itemGroup.caseItemCode === case_item.itemCode
              );
            }

            // 売価検索のレスポンスの中からitemIdで一致する商品情報を取得する
            const itemPrice = sellingPricesGetResponse.data.records.find(
              (priceItem: {salesTargetId: number; sellingPriceExcludingTax: number}) =>
                priceItem.salesTargetId === case_item.itemId
            );

            const itemCaseInfoData: ItemCaseInfoType = {
              itemCode: case_item.itemCode,
              itemName: case_item.salesItemName,
              price: itemPrice ? itemPrice.sellingPriceExcludingTax : null,
              stockQuantity: stockQuantity, //TODO: insert value from get inventory server
              disableFlag: stockQuantity === 0,
              selectedFlag: selectedFlag,
            };
            data.itemCaseInfo.push(itemCaseInfoData);
          }
        );
      }

      // 価格昇順に並び替える
      data.itemCaseInfo = data.itemCaseInfo.sort((a,b) => {
        if(a.price === null) return 1;
        if(b.price === null) return -1;
        if(a.price === b.price) return 0;
        return a.price < b.price ? -1 : 1
      });

      res.status(200).send(data);
      return;
    } catch (error: any) {
      if (error.status === 404) {
        res.status(400).json(error.data);
      } else {
        res.status(error.status).json(error.data);
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };
}
