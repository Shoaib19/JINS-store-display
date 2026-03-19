import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { Lineitem } from "~/src/clients/carts/cartsClientTypes";
import { SalesLensSearchGetResponseRecord } from "~/src/clients/items/itemsClientTypes";
import { CartItem } from "~/src/models/sales/CartItem";
import { ItemCategory } from "~/src/compornents/const";

/**
 * カート明細（レンズOP（累進分類））
 */
export class CartItemLensOpProgressiveCategory extends CartItem {
  /**
   * コンストラクタ
   * @param lineItem
   * @param itemId
   */
  constructor(lineItem: Lineitem, itemId: number | undefined = undefined) {
    super(lineItem, itemId);
    this.lineItem.itemCategoryCode =
      lineItem.itemCategoryCode ?? ItemCategory.LENS_OPTION;
    this.lineItem.preparation1 = lineItem.preparation1 ?? "4";
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
          4,
          itemCode,
          this.getItemIdFromSalesLensSearchResponse,
        );
      }
      return this.itemId;
    }
    return undefined;
  }

  /**
   * 販売用レンズ検索項目検索APIレスポンスから商品IDへの変換(累進分類)
   *  SalesLensSearchGetResponseRecord
   *   + salesLensSpec[]
   *       *progressiveCategoryCode 累進分類コード(商品コード)
   *       *progressiveCategoryId　累進分類ID(商品ID)
   *
   * @param salesLensSearchGetResponseData
   * @param itemCode
   * @returns 商品ID|undefined
   */
  private getItemIdFromSalesLensSearchResponse(
    salesLensSearchGetResponseData: SalesLensSearchGetResponseRecord,
    itemCode: string,
  ): number | undefined {
    if (salesLensSearchGetResponseData.progressiveCategory != undefined) {
      for (const progressiveCategory of salesLensSearchGetResponseData.progressiveCategory) {
        if (progressiveCategory.progressiveCategoryCode == itemCode) {
          return progressiveCategory.progressiveCategoryId ?? undefined;
        }
      }
    }
    return undefined;
  }
}
