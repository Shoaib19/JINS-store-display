import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { Lineitem } from "~/src/clients/carts/cartsClientTypes";
import { CartItem } from "~/src/models/sales/CartItem";
import { ItemCategory } from "~/src/components/const";

/**
 * カート明細（セリート）
 */
export class CartItemCerrito extends CartItem {
  /**
   * コンストラクタ
   * @param lineItem
   * @param itemId
   */
  constructor(lineItem: Lineitem, itemId: number | undefined = undefined) {
    super(lineItem, itemId);
    this.lineItem.itemCategoryCode =
      lineItem.itemCategoryCode ?? ItemCategory.CLOTH;
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
        this.itemId = await this.getItemIdFromCatalog(
          dpfmRequestInfo,
          itemCode,
        );
      }
      return this.itemId;
    }
    return undefined;
  }
}
