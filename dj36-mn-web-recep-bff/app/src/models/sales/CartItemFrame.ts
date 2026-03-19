import { getFrameUniqueAttributes } from "~/src/clients/items/itemsClient";
import {
  DpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { logger } from "~/src/logging/logger";
import { Lineitem } from "~/src/clients/carts/cartsClientTypes";
import {
  GetFrameUniqueAttributesQuery,
  FrameUniqueAttributesGetResponse,
} from "~/src/clients/items/itemsClientTypes";
import { CartItem } from "~/src/models/sales/CartItem";
import { sendApiRequest } from "~/src/utils/fetchService";
import { COUNTRY_CODE_ALPHA2, ItemCategory } from "~/src/compornents/const";

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
        const frameUniqueAttributesGetRequest: GetFrameUniqueAttributesQuery = {
          itemCodeList: [itemCode!],
          salesCountryCode: COUNTRY_CODE_ALPHA2,
          deletedGetFlag: false,
        };
        logger.info(
          `frameUniqueAttributesGetRequest: ${JSON.stringify(frameUniqueAttributesGetRequest)}`,
        );
        const apiResponse = await sendApiRequest(
          getFrameUniqueAttributes,
          frameUniqueAttributesGetRequest,
          requestHeader,
        );
        logger.info(
          `frameUniqueAttributesGetResponse: ${JSON.stringify(apiResponse)}`,
        );

        if (!apiResponse.ok) {
          throw apiResponse;
        }
        const frameUniqueAttributesGetResponse: FrameUniqueAttributesGetResponse =
          apiResponse.data;
        this.itemId = frameUniqueAttributesGetResponse?.records
          ?.filter((record) => record.itemCode === itemCode)
          .at(0)?.itemId;
      }
      return this.itemId;
    }
    return undefined;
  }
}
