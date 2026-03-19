import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { getCartInfo } from "~/src/clients/carts/cartsClient";
import { logger } from "~/src/logging/logger";
import { IItemSalesLensAttributesInfoPresenter } from "~/src/presenters/interfaces";
import { sendApiRequest } from "~/src/utils/fetchService";
import { getSalesLensSearchServer } from "~/src/clients/items/itemsClient";
import { COUNTRY_CODE_ALPHA2, TargetTable } from "~/src/components/const";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import { components } from "~/src/interfaces/root";
import { CartGetRequest, CartGetResponse } from "~/src/clients/carts/cartsClientTypes";
import {
  SalesLensSearchesGetRequest,
  SalesLensSearchesGetResponse,
  SalesLensSearchGetResponseRecord,
 } from "~/src/clients/items/itemsClientTypes";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";
import { ApiResponse } from "openapi-typescript-fetch";
import { generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";

@injectable()
export class ItemSalesLensAttributesInfoPresenter
  implements IItemSalesLensAttributesInfoPresenter
{
  /**
   * 商品情報取得処理（レンズオプション|累進・屈折率）
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
      logger.info(`cartInfoGetRequest: ${JSON.stringify(cartInfoGetRequest)}`);

      // カート・カタログ取得API呼出
      const cartInfoGetResponse: ApiResponse<CartGetResponse> = await sendApiRequest(
        getCartInfo,
        cartInfoGetRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );
      logger.info(`cartInfoGetResponse: ${JSON.stringify(cartInfoGetResponse)}`);
      const cartInfoGetResponseData = cartInfoGetResponse.data.cart;

      // リクエストされた商品グループコードと一致する商品を抽出
      const {
        lopFocusCategoryItemId,   // 焦点分類ID
        lopProgressiveCategoryItemId,   // 累進分類ID
        lopRefractiveIndexNameItemId,   // 屈折率分類ID
      } = (cartInfoGetResponseData ? cartInfoGetResponseData.itemGroups?.find(
        (itemGroup: { itemGroupCode: string }) =>
          itemGroup.itemGroupCode === req.params.itemGroupCode
      ) : null) ?? {};

      // 現在日付の取得
      const currentDate = fixSystemDate(getStoreTimeZone(req))!;

      // レスポンスデータの初期設定
      const data: components["schemas"]["ItemSalesLensAttributeResponse"] = {
        itemProgressCategoryInfo: [
          {
            categoryName: "Progressive Lens Design",
            lensOptionList: [],
          },
        ],
        itemRefractiveIndexNameInfo: [
          {
            categoryName: "Refractive Index",
            lensOptionList: [],
          },
        ],
      };

      /**
       * 選択可能な累進分類の取得
       */
      const progressiveCategoryGetRequest: SalesLensSearchesGetRequest = {
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
        salesDate: currentDate,
        targetTable: TargetTable.PROGRESSIVE_CATEGORY, // 累進分類マスタ
        salesColorNameId: req.query.salesColorNameId
          ? Number(req.query.salesColorNameId)
          : undefined,
        salesLensSpecId: req.query.salesLensSpecId
          ? Number(req.query.salesLensSpecId)
          : undefined,
        focusCategoryId: lopFocusCategoryItemId
          ? Number(lopFocusCategoryItemId)
          : undefined,
        deletedGetFlag: false,
      };
      logger.info(
        `progressiveCategoryGetRequest: ${JSON.stringify(progressiveCategoryGetRequest)}`
      );

      const progressiveCategoryGetResponse: ApiResponse<SalesLensSearchesGetResponse>
        = await sendApiRequest(
          getSalesLensSearchServer,
          progressiveCategoryGetRequest,
          makeDpfmRequestHeader(dpfmRequestInfo),
        );
      logger.info(
        `progressiveCategoryGetResponse: ${JSON.stringify(progressiveCategoryGetResponse)}`
      );

      // 累進分類のレスポンスデータを加工
      progressiveCategoryGetResponse.data.records?.map(
        (record: { progressiveCategory: SalesLensSearchGetResponseRecord["progressiveCategory"] }) => {
          record.progressiveCategory?.map(progressive => {
            // レンズオプション配列の追加
            data.itemProgressCategoryInfo![0].lensOptionList?.push({
              lensOptionName: progressive.progressiveCategoryName ?? undefined,
              lensOptionId: progressive.progressiveCategoryId ?? undefined,
              lensOptionCode: progressive.progressiveCategoryCode ?? undefined,
              price: progressive.sellingPrice?.sellingPriceExcludingTax ?? undefined,
              disableFlag: !progressive.isSelectable,
              selectedFlag: lopProgressiveCategoryItemId === progressive.progressiveCategoryId,
            });
          });
        }
      );

      /**
       * 選択可能な屈折率名称の取得
       */
      const refractiveIndexNameGetRequest: SalesLensSearchesGetRequest = {
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
        salesDate: currentDate,
        targetTable: TargetTable.REFRACTIVE_INDEX_NAME, // 屈折率名称マスタ
        salesColorNameId: req.query.salesColorNameId
          ? Number(req.query.salesColorNameId)
          : undefined,
        salesLensSpecId: req.query.salesLensSpecId
          ? Number(req.query.salesLensSpecId)
          : undefined,
        focusCategoryId: lopFocusCategoryItemId
          ? Number(lopFocusCategoryItemId)
          : undefined,
        deletedGetFlag: false,
      };
      logger.info(
        `refractiveIndexNameGetRequest: ${JSON.stringify(refractiveIndexNameGetRequest)}`
      );

      const refractiveIndexNameGetResponse: ApiResponse<SalesLensSearchesGetResponse>
        = await sendApiRequest(
          getSalesLensSearchServer,
          refractiveIndexNameGetRequest,
          makeDpfmRequestHeader(dpfmRequestInfo),
        );
      logger.info(
        `refractiveIndexNameGetResponse: ${JSON.stringify(refractiveIndexNameGetResponse)}`
      );

      // 屈折率名称のレスポンスデータを加工
      refractiveIndexNameGetResponse.data.records?.map(
        (record: { refractiveIndexName: SalesLensSearchGetResponseRecord["refractiveIndexName"] }) => {
          record.refractiveIndexName?.map((refractive) => {
            // レンズオプション配列の追加
            data.itemRefractiveIndexNameInfo![0].lensOptionList?.push({
              lensOptionName: refractive.refractiveIndexName ?? undefined,
              lensOptionId: refractive.refractiveIndexNameId ?? undefined,
              lensOptionCode: refractive.refractiveIndexNameCode ?? undefined,
              price: refractive.sellingPrice?.sellingPriceExcludingTax ?? undefined,
              disableFlag: !refractive.isSelectable,
              selectedFlag: lopRefractiveIndexNameItemId === refractive.refractiveIndexNameId,
            });
          });
        }
      );

      res.status(200).send(data);
      return;
    } catch (error) {
      next(error);
    }
  };
}
