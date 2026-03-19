import {
  getSalesLensSearchServer,
  getItemsServer,
} from "~/src/clients/items/itemsClient";
import {
  DpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { logger } from "~/src/logging/logger";
import { Lineitem } from "~/src/clients/carts/cartsClientTypes";
import {
  SalesLensSearchGetResponseRecord,
  SalesLensSearchesGetRequest,
  SalesLensSearchesGetResponse,
  ItemsGetRequest,
  ItemsGetResponse,
} from "~/src/clients/items/itemsClientTypes";
import { sendApiRequest } from "~/src/utils/fetchService";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";
import { COUNTRY_CODE_ALPHA2 } from "~/src/components/const";
import { ApiResponse } from "openapi-typescript-fetch";

/**
 * カート明細（基底クラス）
 */

export abstract class CartItem {
  protected lineItem: Lineitem;
  protected itemId: number | undefined;
  constructor(lineItem: Lineitem, itemId?: number | undefined) {
    this.lineItem = lineItem;
    this.lineItem.countryCodeAlpha2 = COUNTRY_CODE_ALPHA2;
    this.itemId = itemId;
  }
  /**
   * LineItem取得
   * 取得されるLineItemは複製のため、updateLineItemで更新する。
   * @returns
   */
  public getLineItem(): Lineitem | undefined {
    // 複製を作成
    return structuredClone(this.lineItem);
  }

  /**
   * LineItem更新
   * @param properties
   */
  public updateLineItem(properties: Lineitem) {
    // 商品コードが変更された場合、商品IDをクリアする
    if (this.lineItem.itemCode !== properties.itemCode) {
      this.itemId = undefined;
    }
    this.lineItem = properties;
  }

  /**
   * 商品ID検索
   * @param dpfmRequestInfo
   * @returns Promise<number | undefined>
   */
  public abstract findItemId(
    dpfmRequestInfo: DpfmRequestInfo,
  ): Promise<number | undefined>;

  /**
   * 商品ID取得
   * @returns number|undefined
   */
  public getItemId(): number | undefined {
    return this.itemId;
  }

  /**
   * 商品コード取得
   * @returns string|null|undefined
   */
  public getItemCode(): string | null | undefined {
    if (this.lineItem.operationCode === "03") {
      // 削除
      return undefined;
    }
    return this.lineItem.itemCode;
  }

  /**
   * Lineitem取得(カート情報登録API用)
   * @returns Lineitem
   */
  public toLineItem(): Lineitem {
    return this.lineItem;
  }

  /**
   * 販売用レンズ検索項目検索APIを呼び出し、商品コードから商品IDを取得する
   * @param dpfmRequestInfo
   * @param targetTable 販売用レンズ検索項目検索API の targetTable
   * @param itemCode  商品コード
   * @param callbackfn 販売用レンズ検索項目検索APIレスポンスから商品IDへの変換コールバック
   * @returns 商品ID|undefined
   */
  protected async getLensOptionItemId(
    dpfmRequestInfo: DpfmRequestInfo,
    targetTable: number,
    itemCode: string,
    callbackfn: (
      salesLensSearchGetResponseRecord: SalesLensSearchGetResponseRecord,
      itemCode: string,
    ) => number | undefined,
  ): Promise<number | undefined> {
    const requestHeader = makeDpfmRequestHeader(dpfmRequestInfo);
    const salesLensSearchGetRequest: SalesLensSearchesGetRequest = {
      salesDate: fixSystemDate(getStoreTimeZone(dpfmRequestInfo.bffRequest))!,
      targetTable: targetTable,
      countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
      deletedGetFlag: false,
    };
    logger.info(
      `getSalesLensSearchRequest: ${JSON.stringify(salesLensSearchGetRequest)}`,
    );
    const apiResponse: ApiResponse<SalesLensSearchesGetResponse> = await sendApiRequest(
      getSalesLensSearchServer,
      salesLensSearchGetRequest,
      requestHeader,
    );
    logger.info(`getSalesLensSearchResponse: ${JSON.stringify(apiResponse)}`);

    const salesLensSearchesGetResponse = apiResponse.data;
    if (salesLensSearchesGetResponse.records != undefined) {
      return salesLensSearchesGetResponse.records
        .map(
          (salesLensSearchGetResponseData: SalesLensSearchGetResponseRecord) =>
            callbackfn(salesLensSearchGetResponseData, itemCode),
        )
        .filter((itemId) => itemId != undefined)
        .at(0);
    }
    return undefined;
  }

  /**
   * 商品ID取得（catalog API使用）
   * @param dpfmRequestInfo
   * @param itemCode
   * @returns
   */
  protected async getItemIdFromCatalog(
    dpfmRequestInfo: DpfmRequestInfo,
    itemCode: string,
  ): Promise<number | undefined> {
    const requestHeader: Headers = makeDpfmRequestHeader(dpfmRequestInfo);
    //NOTE: 7.1 商品マスタ検索APIの呼出し
    const itemsGetRequest: ItemsGetRequest = {
      countryCodeAlpha2List: [COUNTRY_CODE_ALPHA2],
      itemCodeList: [itemCode],
      deletedGetFlag: false,
    };

    logger.info(`getItemsRequest: ${JSON.stringify(itemsGetRequest)}`);
    const apiResponse: ApiResponse<ItemsGetResponse> = await sendApiRequest(
      getItemsServer,
      itemsGetRequest,
      requestHeader,
    );
    logger.info(`getItemsResponse: ${JSON.stringify(apiResponse)}`);

    const itemsGetResponse = apiResponse.data;
    return itemsGetResponse.records
      ?.filter((record) => record.itemCode === itemCode)
      .at(0)?.itemId;
  }
}
