import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { getCartInfo } from "~/src/clients/carts/cartsClient";
import { logger } from "~/src/logging/logger";
import { BasePresenter } from "~/src/presenters/BasePresenter";
import { IItemSalesLensSpecInfoPresenter } from "~/src/presenters/interfaces";
import { sendApiRequest } from "~/src/utils/fetchService";
import { getSalesLensSearchServer } from "~/src/clients/items/itemsClient";
import { COUNTRY_CODE_ALPHA2, customerStaffId,  TargetTable } from "~/src/compornents/const";
import {
  operations as cartOperations,
  components as cartsComponents,
} from "~/src/interfaces/clients/carts/cartsClient";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";

@injectable()
export class ItemSalesLensSpecInfoPresenter
  extends BasePresenter
  implements IItemSalesLensSpecInfoPresenter
{
  /**
   * 商品情報取得処理（レンズオプション|販売用レンズ仕様）
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

      // リクエストされた商品グループコードと一致する焦点分類IDと販売用レンズ仕様IDを抽出
      const { lopFocusCategoryItemId, lopSalesLensSpecItemId } =
        cartInfoGetResponseData.itemGroups!.find(
          (itemGroup: { itemGroupCode: string }) =>
            itemGroup.itemGroupCode === req.params.itemGroupCode
        )!;

      // 現在日付の取得
      const currentDate = fixSystemDate(getStoreTimeZone(req))!;

      /**
       * 選択可能な販売用レンズ仕様の取得
       */

      // 販売用レンズ検索項目検索リクエスト
      // TODO: oasのクラス定義で設定
      interface SalesLensSearchRequest {
        countryCodeAlpha2: string;
        salesDate: string;
        targetTable: number;
        salesColorNameId?: number;
        focusCategoryId?: number;
        deletedGetFlag: false;
      }

      const salesLensSearchGetRequest: SalesLensSearchRequest = {
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
        salesDate: currentDate,
        targetTable: TargetTable.SALES_LENS_SPEC, // 販売用レンズ仕様マスタ
        salesColorNameId: req.query.salesColorNameId
          ? Number(req.query.salesColorNameId)
          : undefined,
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

      interface ItemSalesLensSpecInfoType {
        categoryName: string;
        lensOptionList: LensOptionListType[];
      }

      interface SalesLensSearchResponse {
        itemSalesLensSpecInfo: ItemSalesLensSpecInfoType[];
      }

      let data: SalesLensSearchResponse = {
        itemSalesLensSpecInfo: [
          {
            categoryName: "Lens Coating",
            lensOptionList: [],
          },
        ],
      };

      // レスポンスデータを加工
      salesLensSearchGetResponse.data.records.map(
        (record: { salesLensSpec: any[] }) => {
          record.salesLensSpec.map(async (lensSpec) => {
            // レンズオプション配列の追加
            await data.itemSalesLensSpecInfo[0].lensOptionList.push({
              lensOptionName: lensSpec.salesLensSpecName,
              lensOptionId: lensSpec.salesLensSpecId,
              lensOptionCode: lensSpec.salesLensSpecCode,
              price: lensSpec.sellingPrice.sellingPriceExcludingTax,
              disableFlag: !lensSpec.isSelectable,
              selectedFlag: lopSalesLensSpecItemId === lensSpec.salesLensSpecId,
            });
          });
        }
      );

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
