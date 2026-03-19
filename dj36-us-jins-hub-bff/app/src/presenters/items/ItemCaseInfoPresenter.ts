import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IItemCaseInfoPresenter } from "~/src/presenters/interfaces";
import { getItemsServer } from "~/src/clients/items/itemsClient";
import { logger } from "~/src/logging/logger";
import dotenv from "dotenv";
import { SalesItemCategoryMgmtCode, SalesItemCategoryCode, COUNTRY_CODE_ALPHA2 } from "~/src/components/const";
import { sendApiRequest } from "~/src/utils/fetchService";
import { getCartInfo } from "~/src/clients/carts/cartsClient";
import { getSellingPrices,getSellingPricesRequestQuery, getSellingPricesRequestSearchTarget } from "~/src/clients/prices/pricesClient";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";
import { SellingPricesGetResponse, SellingPricesGetRequest } from "~/src/clients/prices/priceClientTypes";
import { CartGetRequest, CartGetResponse } from "~/src/clients/carts/cartsClientTypes";
import { ItemsGetRequest, ItemsGetResponse } from "~/src/clients/items/itemsClientTypes";
import { components } from "~/src/interfaces/root";
import { ApiResponse } from "openapi-typescript-fetch";
import { generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";

dotenv.config();

/**
 * ステータス
 */
@injectable()
export class ItemCaseInfoPresenter
  implements IItemCaseInfoPresenter
{
  /**
   * 商品情報取得処理（ケース）
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

      // カート・カタログ取得API
      const cartInfoGetRequest: CartGetRequest = 
      {
        receptionNumber: req.params.receptionNumber,
        deleteFlag: false,
      }
      logger.info(`getCartInfoRequest: ${JSON.stringify(cartInfoGetRequest)}`);

      const cartInfoGetResponse: ApiResponse<CartGetResponse> = await sendApiRequest(
        getCartInfo, cartInfoGetRequest, makeDpfmRequestHeader(dpfmRequestInfo));
      logger.info(`getCartInfoResponse: ${JSON.stringify(cartInfoGetResponse)}`);

      // 販売用商品種別項目コード
      const categoryCodesInOrder = [
        SalesItemCategoryCode.SERVICE_CASE,
        SalesItemCategoryCode.PAID_CASE,
        SalesItemCategoryCode.COLLAB_CASE,
        SalesItemCategoryCode.EXCLUSIVE_CASE,
      ];

      // レスポンスデータ初期化
      const data: components["schemas"]["ItemCaseResponse"] = { itemCaseInfo: [] };

      for(const categoryCode of categoryCodesInOrder) {
        // 商品マスタ検索API
        const itemCaseGetRequest: ItemsGetRequest = 
        {
          countryCodeAlpha2List: [COUNTRY_CODE_ALPHA2], // 固定値
          salesItemCategoryMgmtCode: SalesItemCategoryMgmtCode.STORE_EC,
          salesItemCategoryCode: categoryCode,
          sortKey: "itemCode:ASC",  // 商品コード昇順
          deletedGetFlag: false,
        }
        logger.info(`itemCaseGetRequest: ${JSON.stringify(itemCaseGetRequest)}`);

        const itemCaseGetResponse: ApiResponse<ItemsGetResponse> = await sendApiRequest(
          getItemsServer,
          itemCaseGetRequest,
          makeDpfmRequestHeader(dpfmRequestInfo),
        );
        logger.info(`itemCaseGetResponse: ${JSON.stringify(itemCaseGetResponse)}`);

        const itemCaseRecords = itemCaseGetResponse.data.records;
        if (Array.isArray(itemCaseRecords) && itemCaseRecords?.length > 0) {
          const itemIdList = itemCaseRecords
            .filter((record) => record.itemId != undefined)
            .map((record) => record.itemId!);

          // 在庫数取得API
          //TODO: import InventoriesGetResponse from ./src/interfaces/clients/inventories/inventoriesClient.ts and define args type
          // function getInventoryList(inventoriesResponse: any) {
          //   return inventoriesResponse.data.records.map((inventory_item: any) => {
          //     return inventory_item.inventoryQuantity;
          //   });
          // }
          // const inventoriesGetRequest: inventoryOperations["getInventories"]["parameters"]["query"] = 
          // {
          //   locationCodeList: [req.params.storeCode], //NOTE: リクエスト.storeCode
          //   itemIdList: itemIdList.join(), //NOTE: 商品マスタ検索APIのrecords[].itemId
          //   salesStatusIdList: [1], //NOTE: 「販売可」に固定
          //   itemStatusIdList: [1], //NOTE: 「良品」に固定
          // }
          // logger.info(`getInventoriesGetRequest ${JSON.stringify(inventoriesGetRequest)}`);
          // const inventoriesGetResponse = await sendApiRequest(
          //   getInventoriesServer,
          //   inventoriesGetRequest,
          //   requestHeader,
          // );
          // logger.info(`getInventoriesGetResponse: ${JSON.stringify(inventoriesGetResponse)}`);

          // const inventory_list = getInventoryList(inventoriesGetResponse);

          // 現在日付の取得
          const currentDate = fixSystemDate(getStoreTimeZone(req))!;

          // 売価検索API検索条件
          const searchTargetList: getSellingPricesRequestQuery["searchTargetList"] =
            itemIdList.map((itemId): getSellingPricesRequestSearchTarget => {
              return {
                sellingPriceCategoryCode: "01", // 固定値 単品（フレーム、ケース、セリート）
                salesTargetId: itemId,
              };
            });

          // 売価検索API
          const sellingPricesGetRequest: SellingPricesGetRequest = {
            countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
            salesDate: currentDate,
            query: JSON.stringify({"searchTargetList": searchTargetList}),
          };
          logger.info(`sellingPricesGetRequest: ${JSON.stringify(sellingPricesGetRequest)}`);

          const sellingPricesGetResponse: ApiResponse<SellingPricesGetResponse> =
            await sendApiRequest(
              getSellingPrices,
              sellingPricesGetRequest,
              makeDpfmRequestHeader(dpfmRequestInfo)
            );
          logger.info(`sellingPricesGetResponse: ${JSON.stringify(sellingPricesGetResponse)}`);
          const sellingPricesGetResponseData = sellingPricesGetResponse.data;

          // レスポンスデータの加工
          const stockQuantity: number = 5; // TODO: 9-11スコープでは在庫数:5で固定
          const itemCaseInfo: components["schemas"]["ItemCaseInfo"][] = [];
          itemCaseRecords.map(itemCase => {
            // リクエストされた商品グループコードと合致している配列を抽出
            let selectedFlag = false;
            if(cartInfoGetResponse.data.cart){
              const selectedItemGroups = cartInfoGetResponse.data?.cart?.itemGroups?.filter(
                itemGroup => itemGroup.itemGroupCode === req.params.itemGroupCode
              );
              // カート選択中フラグ判定（カートのcaseItemCode と 商品マスタのitemCodeが一致）
              selectedFlag = selectedItemGroups?.some(itemGroup =>
                  itemGroup.caseItemCode === itemCase.itemCode
              ) ?? false;
            }

            // 売価検索のレスポンスの中からitemIdで一致する商品情報を取得する
            const itemPrice = sellingPricesGetResponseData.records?.find(sellingPrice =>
              sellingPrice.salesTargetId === itemCase.itemId
            );

            const itemCaseInfoData: components["schemas"]["ItemCaseInfo"] = {
              itemCode: itemCase.itemCode,
              itemName: itemCase.salesItemName,
              price: itemPrice?.sellingPriceExcludingTax ?? undefined,
              stockQuantity: stockQuantity, //TODO: insert value from get inventory server
              disableFlag: stockQuantity === 0,
              selectedFlag: selectedFlag,
            };
            itemCaseInfo.push(itemCaseInfoData);
          });
          // 価格昇順に並び替える
          itemCaseInfo.sort((a,b) => {
            if(a.price == null) return 1;
            if(b.price == null) return -1;
            if(a.price === b.price) return 0;
            return a.price < b.price ? -1 : 1
          });

          data.itemCaseInfo?.push(...itemCaseInfo);
        }
      }

      res.status(200).send(data);
      return;
    } catch (error) {
      next(error);
    }
  };
}
