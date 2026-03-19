import { getFrameUniqueAttributes } from "~/src/clients/items/itemsClient";
import {
  DpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { logger } from "~/src/logging/logger";
import { Lineitem } from "~/src/clients/carts/cartsClientTypes";
import {
  FrameUniqueAttributesGetRequest,
  FrameUniqueAttributesGetResponse,
} from "~/src/clients/items/itemsClientTypes";
import { CartItem } from "~/src/models/sales/CartItem";
import { sendApiRequest } from "~/src/utils/fetchService";
import { COUNTRY_CODE_ALPHA2, ItemCategory } from "~/src/components/const";
import { ApiResponse } from "openapi-typescript-fetch";

/**
 * カート明細（フレーム）
 */
export class CartItemFrame extends CartItem {
  /**
   * コンストラクタ
   * @param lineItem
   * @param itemId
   */
  constructor(lineItem: Lineitem, itemId: number | undefined = undefined) {
    super(lineItem, itemId);
    this.lineItem.itemCategoryCode =
      lineItem.itemCategoryCode ?? ItemCategory.FRAME;
  }

  /**
   * 商品ID検索
   * @param dpfmRequestInfo
   * @returns Promise<number | undefined>
   */
  public async findItemId(
    dpfmRequestInfo: DpfmRequestInfo,
  ): Promise<number | undefined> {
    const itemCode = this.getItemCode();
    if (itemCode != undefined) {
      if (this.itemId == undefined) {
        // フレーム固有属性検索APIから商品コード指定で検索
        const requestHeader = makeDpfmRequestHeader(dpfmRequestInfo);
        const frameUniqueAttributesGetRequest: FrameUniqueAttributesGetRequest = {
          itemCodeList: [itemCode!],
          salesCountryCode: COUNTRY_CODE_ALPHA2,
          deletedGetFlag: false,
        };
        logger.info(
          `getFrameUniqueAttributesRequest: ${JSON.stringify(frameUniqueAttributesGetRequest)}`,
        );
        const apiResponse: ApiResponse<FrameUniqueAttributesGetResponse> = await sendApiRequest(
          getFrameUniqueAttributes,
          frameUniqueAttributesGetRequest,
          requestHeader,
        );
        logger.info(
          `getFrameUniqueAttributesResponse: ${JSON.stringify(apiResponse)}`,
        );

        const frameUniqueAttributesGetResponse = apiResponse.data;
        this.itemId = frameUniqueAttributesGetResponse?.records
          ?.filter((record) => record.itemCode === itemCode)
          .at(0)?.itemId;
      }
      return this.itemId;
    }
    return undefined;
  }
}
