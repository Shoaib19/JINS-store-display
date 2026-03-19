import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { Lineitem } from "~/src/clients/carts/cartsClientTypes";
import { SalesLensSearchGetResponseRecord } from "~/src/clients/items/itemsClientTypes";
import { CartItem } from "~/src/models/sales/CartItem";
import { ItemCategory } from "~/src/components/const";

/**
 * カート明細（レンズOP（屈折率名称））
 */
export class CartItemLensOpRefractiveIndexName extends CartItem {
  /**
   * コンストラクタ
   * @param lineItem
   * @param itemId
   */
  constructor(lineItem: Lineitem, itemId: number | undefined = undefined) {
    super(lineItem, itemId);
    this.lineItem.itemCategoryCode =
      lineItem.itemCategoryCode ?? ItemCategory.LENS_OPTION;
    this.lineItem.preparation1 = lineItem.preparation1 ?? "5";
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
          5,
          itemCode,
          this.getItemIdFromSalesLensSearchResponse,
        );
      }
      return this.itemId;
    }
    return undefined;
  }
  /**
   * 販売用レンズ検索項目検索APIレスポンスから商品IDへの変換(屈折率名称)
   *  SalesLensSearchGetResponseRecord
   *   + salesLensSpec[]
   *       *refractiveIndexNameCode 屈折率名称コード(商品コード)
   *       *refractiveIndexNameId　屈折率名称ID(商品ID)
   *
   * @param salesLensSearchGetResponseData
   * @param itemCode
   * @returns 商品ID|undefined
   */
  private getItemIdFromSalesLensSearchResponse(
    salesLensSearchGetResponseData: SalesLensSearchGetResponseRecord,
    itemCode: string,
  ): number | undefined {
    if (salesLensSearchGetResponseData.refractiveIndexName != undefined) {
      for (const refractiveIndexName of salesLensSearchGetResponseData.refractiveIndexName) {
        if (refractiveIndexName.refractiveIndexNameCode == itemCode) {
          return refractiveIndexName.refractiveIndexNameId ?? undefined;
        }
      }
    }
    return undefined;
  }
}
