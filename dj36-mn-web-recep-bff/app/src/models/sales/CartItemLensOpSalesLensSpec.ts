import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { Lineitem } from "~/src/clients/carts/cartsClientTypes";
import { SalesLensSearchGetResponseRecord } from "~/src/clients/items/itemsClientTypes";
import { CartItem } from "~/src/models/sales/CartItem";
import { ItemCategory } from "~/src/compornents/const";

/**
 * カート明細（レンズOP（販売用レンズ仕様））
 */
export class CartItemLensOpSalesLensSpec extends CartItem {
  /**
   * コンストラクタ
   * @param lineItem
   * @param itemId
   */
  constructor(lineItem: Lineitem, itemId: number | undefined = undefined) {
    super(lineItem, itemId);
    this.lineItem.itemCategoryCode =
      lineItem.itemCategoryCode ?? ItemCategory.LENS_OPTION;
    this.lineItem.preparation1 = lineItem.preparation1 ?? "2";
  }

  /**
   * 商品ID検索
   * @param dpfmRequestInfo
   * @returns Promise<number | undefined>
   */
  public override async findItemId(
    dpfmRequestInfo: DpfmRequestInfo,
  ): Promise<number | undefined> {
    const itemCode = this.getItemCode();
    if (itemCode != undefined) {
      if (this.itemId == undefined) {
        this.itemId = await this.getLensOptionItemId(
          dpfmRequestInfo,
          2,
          itemCode,
          this.getItemIdFromSalesLensSearchResponse,
        );
      }
      return this.itemId;
    }
    return undefined;
  }

  /**
   * 販売用レンズ検索項目検索APIレスポンスから商品IDへの変換(販売用レンズ仕様)
   *  SalesLensSearchGetResponseRecord
   *   + salesLensSpec[]
   *       *salesLensSpecCode 販売用レンズ仕様コード(商品コード)
   *       *salesLensSpecId　販売用レンズ仕様ID(商品ID)
   *
   * @param salesLensSearchGetResponseData
   * @param itemCode
   * @returns 商品ID|undefined
   */
  private getItemIdFromSalesLensSearchResponse(
    salesLensSearchGetResponseData: SalesLensSearchGetResponseRecord,
    itemCode: string,
  ): number | undefined {
    if (salesLensSearchGetResponseData.salesLensSpec != undefined) {
      for (const salesLensSpec of salesLensSearchGetResponseData.salesLensSpec) {
        if (salesLensSpec.salesLensSpecCode == itemCode) {
          return salesLensSpec.salesLensSpecId ?? undefined;
        }
      }
    }
    return undefined;
  }
}
