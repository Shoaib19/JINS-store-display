import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { getCartInfo } from "~/src/clients/carts/cartsClient";
import { logger } from "~/src/logging/logger";
import { BasePresenter } from "~/src/presenters/BasePresenter";
import { IItemSalesLensAttributesInfoPresenter } from "~/src/presenters/interfaces";
import { sendApiRequest } from "~/src/utils/fetchService";
import { getSalesLensSearchServer, getItemsServer } from "~/src/clients/items/itemsClient";
import { COUNTRY_CODE_ALPHA2, customerStaffId, TargetTable } from "~/src/compornents/const";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import { components } from "~/src/interfaces/root";
import {
  operations as cartsOperations,
  components as cartsComponents,
} from "~/src/interfaces/clients/carts/cartsClient";
import {
  operations as catalogOperations,
  components as catalogComponents,
} from "~/src/interfaces/clients/items/itemsClient";
import { operations as pricesOperations } from "~/src/interfaces/clients/prices/pricesClient";
import { getSellingPrices, getSellingPricesRequestQuery } from "~/src/clients/prices/pricesClient";
import { CommonErrorCode } from "~/src/compornents/errorCode";

import crypto from "crypto";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";

@injectable()
export class ItemSalesLensAttributesInfoPresenter
  extends BasePresenter
  implements IItemSalesLensAttributesInfoPresenter
{
  /**
   * 商品情報取得処理（レンズオプション|累進・屈折率）
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
      const cartInfoGetRequest: cartsOperations["findCart"]["parameters"]["query"] =
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
        throw this.getErrorResponse(requestHeader, cartInfoGetResponse);
      }

      const cartInfoGetResponseData: cartsComponents["schemas"]["cart"] =
        cartInfoGetResponse.data.cart;

      // リクエストされた商品グループコードと一致する商品を抽出
      const {
        lopFocusCategoryItemId,   // 焦点分類ID
        lopProgressiveCategoryItemId,   // 累進分類ID
        lopRefractiveIndexNameItemId,   // 屈折率分類ID
        isExchangeLens,   // レンズ交換フラグ
        lensReplacementTypeCode,    // レンズ交換分類コード
      } = (cartInfoGetResponseData ? cartInfoGetResponseData.itemGroups!.find(
        (itemGroup: { itemGroupCode: string }) =>
          itemGroup.itemGroupCode === req.params.itemGroupCode
      )! : null) ?? {};

      // 現在日付の取得
      const currentDate = fixSystemDate(getStoreTimeZone(req))!;

      // レスポンスデータの初期設定
      let data: components["schemas"]["ItemSalesLensAttributeResponse"] = {
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
        lensReplacementTypeInfo: {
          categoryName: "Replacement context",
          lensReplacementTypeList: [],
        },
      };

      /**
       * 選択可能な累進分類の取得
       */
      const progressiveCategoryGetRequest: catalogOperations["getSalesLensSearch"]["parameters"]["query"] = {
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

      const progressiveCategoryGetResponse = await sendApiRequest(
        getSalesLensSearchServer,
        progressiveCategoryGetRequest,
        requestHeader,
      )

      logger.info(
        `progressiveCategoryGetResponse: ${JSON.stringify(progressiveCategoryGetResponse)}`
      );

      if (!progressiveCategoryGetResponse.ok) {
        throw this.getErrorResponse(requestHeader, progressiveCategoryGetResponse);
      }

      // 累進分類のレスポンスデータを加工
      progressiveCategoryGetResponse.data.records?.map(
        (record: { progressiveCategory: any[] }) => {
          record.progressiveCategory.map((progressive) => {
            // レンズオプション配列の追加
            data.itemProgressCategoryInfo![0].lensOptionList?.push({
              lensOptionName: progressive.progressiveCategoryName,
              lensOptionId: progressive.progressiveCategoryId,
              lensOptionCode: progressive.progressiveCategoryCode,
              price: progressive.sellingPrice.sellingPriceExcludingTax,
              disableFlag: !progressive.isSelectable,
              selectedFlag:
                lopProgressiveCategoryItemId ===
                progressive.progressiveCategoryId,
            });
          });
        }
      );

      /**
       * 選択可能な屈折率名称の取得
       */
      const refractiveIndexNameGetRequest: catalogOperations["getSalesLensSearch"]["parameters"]["query"] = {
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

      // TODO: 1月以降はアーキ側で冪等性担保の対応が追加されるので、暫定対応
      requestHeader.set("jins-trace-id", crypto.randomUUID());

      const refractiveIndexNameGetResponse = await sendApiRequest(
        getSalesLensSearchServer,
        refractiveIndexNameGetRequest,
        requestHeader,
      )

      logger.info(
        `refractiveIndexNameGetResponse: ${JSON.stringify(refractiveIndexNameGetResponse)}`
      );

      if (!refractiveIndexNameGetResponse.ok) {
        throw this.getErrorResponse(requestHeader, refractiveIndexNameGetResponse);
      }

      // 屈折率名称のレスポンスデータを加工
      refractiveIndexNameGetResponse.data.records?.map(
        (record: { refractiveIndexName: any[] }) => {
          record.refractiveIndexName.map((refractive) => {
            // レンズオプション配列の追加
            data.itemRefractiveIndexNameInfo![0].lensOptionList?.push({
              lensOptionName: refractive.refractiveIndexName,
              lensOptionId: refractive.refractiveIndexNameId,
              lensOptionCode: refractive.refractiveIndexNameCode,
              price: refractive.sellingPrice.sellingPriceExcludingTax,
              disableFlag: !refractive.isSelectable,
              selectedFlag:
                lopRefractiveIndexNameItemId ===
                refractive.refractiveIndexNameId,
            });
          });
        }
      );

      // レンズ交換分類
      if (isExchangeLens) {
        const lensReplacementTypes = [
          {
            itemCode: "Y9100",
            lensReplacementTypeCode: "Y9100",
            lensReplacementTypeName: "JINS frame brought in",
          },
          {
            itemCode: "Y9100T",
            lensReplacementTypeCode: "Y9100T",
            lensReplacementTypeName: "Third-party frame brought in",
          },
        ];

        // 商品検索APIを呼び出して商品IDを取得
        const getItemsRequest = {
          countryCodeAlpha2List: COUNTRY_CODE_ALPHA2,
          itemCodeList: lensReplacementTypes.map(lensReplacementType => {
            return lensReplacementType.itemCode;
          }).join(",")
        };
        logger.info(`getItemsRequest: ${JSON.stringify(getItemsRequest)}`);

        const getItemsResponse = await sendApiRequest(
          getItemsServer,
          getItemsRequest,
          requestHeader,
        );
        logger.info(`getItemsResponse: ${JSON.stringify(getItemsResponse)}`);
        if (!getItemsResponse.ok) {
          throw this.getErrorResponse(requestHeader, getItemsResponse);
        }
        const items: catalogComponents["schemas"]["ItemGetResponse"][] = getItemsResponse.data.records;

        // レンズ交換分類の取得(売価検索API呼出)
        const searchTargetList: getSellingPricesRequestQuery["searchTargetList"] =
          items.map((record: {itemId: number}) => {
            return {
              sellingPriceCategoryCode: "01",
              salesTargetId: record.itemId
            };
          });
        const getSellingPricesRequest: pricesOperations["getSellingPrices"]["parameters"]["query"] = {
          countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
          salesDate: currentDate,
          query: JSON.stringify({"searchTargetList": searchTargetList}),
        };
        const getSellingPricesResponse = await sendApiRequest(
          getSellingPrices,
          getSellingPricesRequest,
          requestHeader,
        )
        logger.info(`getSellingPricesResponse: ${JSON.stringify(getSellingPricesResponse)}`);
        if (!getSellingPricesResponse.ok) {
          throw this.getErrorResponse(requestHeader, getSellingPricesResponse);
        }

        // レンズ交換分類をレスポンスにセット
        data.lensReplacementTypeInfo!.lensReplacementTypeList =
          lensReplacementTypes.map((lensReplacementType) => {
            const item = items.find(
              (record: {itemCode: string}) => record.itemCode == lensReplacementType.itemCode
            );
            return {
              lensReplacementTypeCode: lensReplacementType.lensReplacementTypeCode,
              lensReplacementTypeName: lensReplacementType.lensReplacementTypeName,
              lensReplacementTypePrice: item ? getSellingPricesResponse.data.records.find(
                (sellingPrice: any) => sellingPrice.salesTargetId == item.itemId
              ).sellingPriceExcludingTax : null,
              selectedFlag: lensReplacementType.lensReplacementTypeCode === lensReplacementTypeCode,
            };
          });
      } else {
        data.lensReplacementTypeInfo = null;
      }

      res.status(200).send(data);
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
        } else {
          res.status(error.status).json(error.data);
        }
      } else {
        res.status(500).json(error.data)
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };

  private getErrorResponse = (requestHeader: Headers, response: any): any => {
    return {
      status: 500,
      data: {
        "jins-trace-id": requestHeader.get("jins-trace-id"),
        "code": CommonErrorCode.COM_0000_UNEXPECTED_ERROR.CODE,
        "message": "Internal Server Error.",
        "details": response.data.message ?? CommonErrorCode.COM_0000_UNEXPECTED_ERROR.MESSAGE,
      }
    }
  }
}
