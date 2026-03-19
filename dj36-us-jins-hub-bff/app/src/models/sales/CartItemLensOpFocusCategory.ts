import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { Lineitem } from "~/src/clients/carts/cartsClientTypes";
import { SalesLensSearchGetResponseRecord } from "~/src/clients/items/itemsClientTypes";
import { CartItem } from "~/src/models/sales/CartItem";
import { ItemCategory } from "~/src/components/const";

/**
 * カート明細（レンズOP（焦点分類））
 */
export class CartItemLensOpFocusCategory extends CartItem {
  /**
   * コンストラクタ
   * @param lineItem
   * @param itemId
   */
  constructor(lineItem: Lineitem, itemId: number | undefined = undefined) {
    super(lineItem, itemId);
    this.lineItem.itemCategoryCode =
      lineItem.itemCategoryCode ?? ItemCategory.LENS_OPTION;
    this.lineItem.preparation1 = lineItem.preparation1 ?? "3";
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
          3,
          itemCode,
          this.getItemIdFromSalesLensSearchResponse,
        );
      }
      return this.itemId;
    }
    return undefined;
  }
  /**
   * 販売用レンズ検索項目検索APIレスポンスから商品IDへの変換(焦点分類)
   *  SalesLensSearchGetResponseRecord
   *   + salesLensSpec[]
   *       *focusCategoryCode 焦点分類コード(商品コード)
   *       *focusCategoryId　焦点分類ID(商品ID)
   *
   * @param salesLensSearchGetResponseData
   * @param itemCode
   * @returns 商品ID|undefined
   */
  private getItemIdFromSalesLensSearchResponse(
    salesLensSearchGetResponseData: SalesLensSearchGetResponseRecord,
    itemCode: string,
  ): number | undefined {
    if (salesLensSearchGetResponseData.focusCategory != undefined) {
      for (const focusCategory of salesLensSearchGetResponseData.focusCategory) {
        if (focusCategory.focusCategoryCode == itemCode) {
          return focusCategory.focusCategoryId ?? undefined;
        }
      }
    }
    return undefined;
  }
}
