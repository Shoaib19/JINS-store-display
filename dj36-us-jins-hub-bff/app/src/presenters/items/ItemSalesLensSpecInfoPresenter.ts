import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { getCartInfo } from "~/src/clients/carts/cartsClient";
import { logger } from "~/src/logging/logger";
import { IItemSalesLensSpecInfoPresenter } from "~/src/presenters/interfaces";
import { sendApiRequest } from "~/src/utils/fetchService";
import { getSalesLensSearchServer } from "~/src/clients/items/itemsClient";
import { COUNTRY_CODE_ALPHA2, TargetTable } from "~/src/components/const";
import { CartGetRequest, CartGetResponse } from "~/src/clients/carts/cartsClientTypes";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";
import { SalesLensSearchesGetRequest, SalesLensSearchesGetResponse } from "~/src/clients/items/itemsClientTypes";
import { components } from "~/src/interfaces/root";
import { ApiResponse } from "openapi-typescript-fetch";
import { generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";

@injectable()
export class ItemSalesLensSpecInfoPresenter
  implements IItemSalesLensSpecInfoPresenter
{
  /**
   * 商品情報取得処理（レンズオプション|販売用レンズ仕様）
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

      // カート・カタログ取得リクエスト
      const cartInfoGetRequest: CartGetRequest =
        {
          receptionNumber: req.params.receptionNumber,
          deleteFlag: false,
        };
      logger.info(`getCartInfoRequest: ${JSON.stringify(cartInfoGetRequest)}`);

      // カート・カタログ取得API呼出
      const cartInfoGetResponse: ApiResponse<CartGetResponse> = await sendApiRequest(
        getCartInfo,
        cartInfoGetRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );
      logger.info(`getCartInfoResponse: ${JSON.stringify(cartInfoGetResponse)}`);
      const cartInfoGetResponseData = cartInfoGetResponse.data.cart;

      // リクエストされた商品グループコードと一致する焦点分類IDと販売用レンズ仕様IDを抽出
      const { lopFocusCategoryItemId, lopSalesLensSpecItemId } =
        cartInfoGetResponseData?.itemGroups?.find(
          (itemGroup: { itemGroupCode: string }) =>
            itemGroup.itemGroupCode === req.params.itemGroupCode
        ) ?? {};

      // 現在日付の取得
      const currentDate = fixSystemDate(getStoreTimeZone(req))!;

      /**
       * 選択可能な販売用レンズ仕様の取得
       */

      // 販売用レンズ検索項目検索リクエスト
      const salesLensSearchGetRequest: SalesLensSearchesGetRequest = {
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
        `getSalesLensSearchRequest: ${JSON.stringify(salesLensSearchGetRequest)}`
      );

      // 販売用レンズ検索項目検索API呼出
      const salesLensSearchGetResponse: ApiResponse<SalesLensSearchesGetResponse> = await sendApiRequest(
        getSalesLensSearchServer,
        salesLensSearchGetRequest,
        makeDpfmRequestHeader(dpfmRequestInfo),
      );
      logger.info(
        `getSalesLensSearchResponse: ${JSON.stringify(salesLensSearchGetResponse)}`
      );
      const salesLensSearchGetResponseData = salesLensSearchGetResponse.data;

      // レスポンスデータの初期化
      const data: components["schemas"]["ItemSalesLensSpecResponse"] = {
        itemSalesLensSpecInfo: [
          {
            categoryName: "Lens Coating",
            lensOptionList: [],
          },
        ],
      };

      // レスポンスデータを加工
      salesLensSearchGetResponseData.records?.map(record => {
        record.salesLensSpec?.map(lensSpec => {
          // レンズオプション配列の追加
          data.itemSalesLensSpecInfo![0].lensOptionList!.push({
            lensOptionName: lensSpec.salesLensSpecName ?? undefined,
            lensOptionId: lensSpec.salesLensSpecId ?? undefined,
            lensOptionCode: lensSpec.salesLensSpecCode ?? undefined,
            price: lensSpec.sellingPrice?.sellingPriceExcludingTax ?? undefined,
            disableFlag: !lensSpec.isSelectable,
            selectedFlag: lopSalesLensSpecItemId === lensSpec.salesLensSpecId,
          });
        });
      });

      res.status(200).send(data);
      return;
    } catch (error) {
      next(error);
    }
  };
}
