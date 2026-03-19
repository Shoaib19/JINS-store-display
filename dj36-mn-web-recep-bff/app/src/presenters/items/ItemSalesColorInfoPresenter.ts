import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { getCartInfo } from "~/src/clients/carts/cartsClient";
import { logger } from "~/src/logging/logger";
import { BasePresenter } from "~/src/presenters/BasePresenter";
import { IItemSalesColorInfoPresenter } from "~/src/presenters/interfaces";
import { sendApiRequest } from "~/src/utils/fetchService";
import { getSalesLensSearchServer } from "~/src/clients/items/itemsClient";
import { COUNTRY_CODE_ALPHA2, customerStaffId, TargetTable} from "~/src/compornents/const";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import {
  operations as cartOperations,
  components as cartsComponents,
} from "~/src/interfaces/clients/carts/cartsClient";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";

@injectable()
export class ItemSalesColorInfoPresenter
  extends BasePresenter
  implements IItemSalesColorInfoPresenter
{
  /**
   * 商品情報取得処理（レンズオプション|販売用カラー名称）
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

      // カート・カタログ取得リクエスト
      const cartInfoGetRequest: cartOperations["findCart"]["parameters"]["query"] =
        {
          receptionNumber: req.params.receptionNumber,
          deleteFlag: false,
        };

      logger.info(`cartInfoGetRequest: ${JSON.stringify(cartInfoGetRequest)}`);

      // カート・カタログ取得API呼出
      const cartInfoGetResponse = await sendApiRequest(
        getCartInfo,
        cartInfoGetRequest,
        requestHeader
      );

      logger.info(`cartInfoGetResponse: ${JSON.stringify(cartInfoGetResponse)}`);

      if (!cartInfoGetResponse.ok) {
        throw cartInfoGetResponse;
      }

      const cartInfoGetResponseData: cartsComponents["schemas"]["cart"] =
        cartInfoGetResponse.data.cart;

      // リクエストされた商品グループコードと一致する焦点分類IDと販売用カラー名称IDを抽出
      const { lopFocusCategoryItemId, lopSalesColorNameItemId } =
        cartInfoGetResponseData.itemGroups!.find(
          (itemGroup: { itemGroupCode: string }) =>
            itemGroup.itemGroupCode === req.params.itemGroupCode
        )!;

      // 現在日付の取得
      const currentDate = fixSystemDate(getStoreTimeZone(req))!;

      /**
       * 選択可能なカラー名称の取得
       */

      // 販売用レンズ検索項目検索リクエスト
      // TODO: oasのクラス定義で設定
      interface SalesLensSearchRequest {
        countryCodeAlpha2: string;
        salesDate: string;
        targetTable: number;
        focusCategoryId?: number;
        deletedGetFlag: false;
      }

      const salesLensSearchGetRequest: SalesLensSearchRequest = {
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
        salesDate: currentDate,
        targetTable: TargetTable.SALES_COLOR_NAME, // 販売用カラー名称マスタ
        focusCategoryId: lopFocusCategoryItemId
          ? Number(lopFocusCategoryItemId)
          : undefined,
        deletedGetFlag: false,
      };

      logger.info(
        `salesLensSearchGetRequest: ${JSON.stringify(salesLensSearchGetRequest)}`
      );

      // 販売用レンズ検索項目検索API呼出
      const salesLensSearchGetResponse = await sendApiRequest(
        getSalesLensSearchServer,
        salesLensSearchGetRequest,
        requestHeader,
      );

      logger.info(
        `salesLensSearchGetResponse: ${JSON.stringify(salesLensSearchGetResponse)}`
      );

      if (!salesLensSearchGetResponse.ok) {
        throw salesLensSearchGetResponse;
      }

      // レスポンスの型定義
      // TODO: oasのクラス定義で設定
      interface LensOptionListType {
        lensOptionName: string;
        lensOptionId: number;
        lensOptionCode: string;
        price: number | null;
        disableFlag: boolean;
        selectedFlag: boolean;
      }

      interface SubcategoryType {
        subcategoryName: string;
        lensOptionList: LensOptionListType[];
      }

      interface ItemSalesColorInfoType {
        categoryName: string;
        subcategory: SubcategoryType[];
      }

      interface SalesLensSearchResponse {
        itemSalesColorInfo: ItemSalesColorInfoType[];
      }

      let data: SalesLensSearchResponse = { itemSalesColorInfo: [] };

      /**
       * 再帰処理でレスポンスデータを加工
       * @param arr - 再帰処理する配列
       * @param target - ターゲット項目名
       * @param categoryKey - カテゴリーindex
       * @param subCategoryKey - サブカテゴリーindex
       */
      // TODO: メンバ参照時のVS Codeの予測候補やデバッグ機能の恩恵が受けにくくなる、ちょっとしたデメリットがあるためリファクタリング時修正
      const processResponseList = (
        arr: any[],
        target: string,
        categoryKey?: number,
        subCategoryKey?: number
      ) => {
        arr.map(async (item) => {
          // 項目名==targetの場合配列加工の再帰処理を行う
          if (target == "salesColorMajorClass") {
            processResponseList(item[target], "salesColorMinorClass");
          }
          if (target == "salesColorMinorClass") {
            // カテゴリー名の設定
            data.itemSalesColorInfo.push({
              categoryName: item.salesColorMajorClassName,
              subcategory: [],
            });
            const index = data.itemSalesColorInfo.findIndex(
              (info) => info.categoryName == item.salesColorMajorClassName
            );
            // 再帰処理
            processResponseList(item[target], "salesColorName", index);
          }
          if (target == "salesColorName" && categoryKey !== undefined) {
            // サブカテゴリー名の設定
            data.itemSalesColorInfo[categoryKey].subcategory.push({
              subcategoryName: item.salesColorMinorClassName,
              lensOptionList: [],
            });
            const index = data.itemSalesColorInfo[
              categoryKey
            ].subcategory.findIndex(
              (info) => info.subcategoryName == item.salesColorMinorClassName
            );
            // 再帰処理
            processResponseList(item[target], "", categoryKey, index);
          }
          if (
            target == "" &&
            categoryKey !== undefined &&
            subCategoryKey !== undefined
          ) {
            // レンズオプション配列の追加
            await data.itemSalesColorInfo[categoryKey].subcategory[
              subCategoryKey
            ].lensOptionList.push({
              lensOptionName: item.salesColorName,
              lensOptionId: item.salesColorNameId,
              lensOptionCode: item.salesColorNameCode,
              price: item.sellingPrice.sellingPriceExcludingTax,
              disableFlag: !item.isSelectable,
              selectedFlag: lopSalesColorNameItemId === item.salesColorNameId,
            });
          }
        });
      };
      // 再帰処理の開始(選択可能なカラー名称)
      processResponseList(salesLensSearchGetResponse.data.records, "salesColorMajorClass");

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
