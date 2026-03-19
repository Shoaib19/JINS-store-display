import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { getCartInfo } from "~/src/clients/carts/cartsClient";
import { logger } from "~/src/logging/logger";
import { IItemSalesColorInfoPresenter } from "~/src/presenters/interfaces";
import { sendApiRequest } from "~/src/utils/fetchService";
import { getSalesLensSearchServer } from "~/src/clients/items/itemsClient";
import { COUNTRY_CODE_ALPHA2, TargetTable} from "~/src/components/const";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import { CartGetRequest, CartGetResponse } from "~/src/clients/carts/cartsClientTypes";
import { SalesLensSearchesGetRequest, SalesLensSearchesGetResponse, SalesLensSearchGetResponseRecord } from "~/src/clients/items/itemsClientTypes";
import { components } from "~/src/interfaces/root";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";
import { ApiResponse } from "openapi-typescript-fetch";
import { generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";

type ElementType<T> = T extends (infer U)[] ? U : never;
type NonNullableRequired<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]>};

type ItemSalesColorResponse = components["schemas"]["ItemSalesColorResponse"];
type ItemSalesColorInfo = ElementType<ItemSalesColorResponse["itemSalesColorInfo"]>;
type ItemSalesSubcategory = ElementType<ItemSalesColorInfo["subcategory"]>;
type ItemSalesLensOption = ElementType<ItemSalesSubcategory["lensOptionList"]>;

type SalesColorMajorClass = ElementType<SalesLensSearchGetResponseRecord["salesColorMajorClass"]>;
type ValidSalesColorMajorClass = NonNullableRequired<SalesColorMajorClass, "salesColorMajorClassName">;
type SalesColorMinorClass = ElementType<SalesColorMajorClass["salesColorMinorClass"]>;
type ValidSalesColorMinorClass = NonNullableRequired<SalesColorMinorClass, "salesColorMinorClassName">;

@injectable()
export class ItemSalesColorInfoPresenter
  implements IItemSalesColorInfoPresenter
{
  /**
   * 商品情報取得処理（レンズオプション|販売用カラー名称）
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
      const cartInfoGetRequest: CartGetRequest = {
        receptionNumber: req.params.receptionNumber,
        deleteFlag: false,
      };
      logger.info(`CartGetRequest: ${JSON.stringify(cartInfoGetRequest)}`);

      // カート・カタログ取得API呼出
      const cartInfoGetResponse: ApiResponse<CartGetResponse> = await sendApiRequest(
        getCartInfo,
        cartInfoGetRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );
      logger.info(`CartGetResponse: ${JSON.stringify(cartInfoGetResponse)}`);
      const cartInfoGetResponseData = cartInfoGetResponse.data.cart;

      // リクエストされた商品グループコードと一致する商品グループから、焦点分類IDと販売用カラー名称IDを抽出
      const { lopFocusCategoryItemId, lopSalesColorNameItemId } =
        cartInfoGetResponseData?.itemGroups?.find(
          (itemGroup) => itemGroup.itemGroupCode === req.params.itemGroupCode
        ) ?? { lopFocusCategoryItemId: null, lopSalesColorNameItemId: null };

      // 現在日付の取得
      const currentDate = fixSystemDate(getStoreTimeZone(req))!;

      /**
       * 選択可能なカラー名称の取得
       */

      // 販売用レンズ検索項目検索リクエスト
      const salesLensSearchGetRequest: SalesLensSearchesGetRequest = {
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
        salesDate: currentDate,
        targetTable: TargetTable.SALES_COLOR_NAME, // 販売用カラー名称マスタ
        focusCategoryId: lopFocusCategoryItemId
          ? Number(lopFocusCategoryItemId)
          : undefined,
        deletedGetFlag: false,
      };
      logger.info(`SalesLensSearchGetRequest: ${JSON.stringify(salesLensSearchGetRequest)}`);

      // 販売用レンズ検索項目検索API呼出
      const salesLensSearchGetResponse: ApiResponse<SalesLensSearchesGetResponse> =
        await sendApiRequest(
          getSalesLensSearchServer,
          salesLensSearchGetRequest,
          makeDpfmRequestHeader(dpfmRequestInfo),
        );
      logger.info(`SalesLensSearchGetResponse: ${JSON.stringify(salesLensSearchGetResponse)}`);

      // 販売用レンズ検索項目検索APIレスポンスのトップ階層は国コードで集約されているため、先頭レコードのみが対象
      const salesLens = salesLensSearchGetResponse.data.records?.at(0);
      // 「販売用カラー大分類名称(salesColorMajorClassName)」 が nullの「販売用カラー名称ID(salesColorNameId)」をログ出力
      const noMajorClassNameColorNameId = salesLens?.salesColorMajorClass
        ?.filter((salesColorMajor) => salesColorMajor.salesColorMajorClassName == null)
        .flatMap((salesColorMajor) => salesColorMajor.salesColorMinorClass
          ?.flatMap((salesColorMinor) => salesColorMinor.salesColorName
            ?.map((salesColor) => salesColor.salesColorNameId)
          )
        ) ?? [];
      if (noMajorClassNameColorNameId.length > 0) {
        logger.info(`salesColorMajorClassName is null: ${JSON.stringify(noMajorClassNameColorNameId)}`);
      }
      // 「販売用カラー小分類名称(salesColorMinorClassName)」 が nullの「販売用カラー名称ID(salesColorNameId)」をログ出力
      const noMinorClassNameColorNameId = salesLens?.salesColorMajorClass
        ?.flatMap((salesColorMajor) => salesColorMajor.salesColorMinorClass
          ?.filter((salesColorMinor) => salesColorMinor.salesColorMinorClassName == null)
          ?.flatMap((salesColorMinor) => salesColorMinor.salesColorName
            ?.map((salesColor) => salesColor.salesColorNameId)
          )
        ) ?? [];
      if (noMinorClassNameColorNameId.length > 0) {
        logger.info(`salesColorMinorClassName is null: ${JSON.stringify(noMajorClassNameColorNameId)}`);
      }

      // レスポンスデータを加工
      const data: ItemSalesColorResponse = {
        itemSalesColorInfo: salesLens?.salesColorMajorClass
            ?.filter(
              (salesColorMajor): salesColorMajor is ValidSalesColorMajorClass =>
                salesColorMajor.salesColorMajorClassName != null
            )
            .map((salesColorMajor) => {
              const colorInfo: ItemSalesColorInfo = {
                categoryName: salesColorMajor.salesColorMajorClassName,
                subcategory: salesColorMajor.salesColorMinorClass
                  ?.filter(
                    (salesColorMinor): salesColorMinor is ValidSalesColorMinorClass =>
                      salesColorMinor.salesColorMinorClassName != null
                  )
                  .map((salesColorMinor) => {
                    const subcategory: ItemSalesSubcategory = {
                      subcategoryName: salesColorMinor.salesColorMinorClassName,
                      lensOptionList: salesColorMinor.salesColorName?.map((salesColor) => {
                        const lensOption: ItemSalesLensOption = {
                          lensOptionName: salesColor.salesColorName ?? undefined,
                          lensOptionId: salesColor.salesColorNameId ?? undefined,
                          lensOptionCode: salesColor.salesColorNameCode ?? undefined,
                          price: salesColor.sellingPrice?.sellingPriceExcludingTax ?? undefined,
                          disableFlag: !salesColor.isSelectable,
                          selectedFlag: lopSalesColorNameItemId === salesColor.salesColorNameId,
                        };
                        return lensOption;
                      }),
                    };
                    return subcategory;
                  }),
              };
              return colorInfo;
            }) ?? [],
      };
      res.status(200).send(data);
      return;
    } catch (error) {
      next(error);
    }
  };
}
