import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { Lineitem } from "~/src/clients/carts/cartsClientTypes";
import { CartItem } from "~/src/models/sales/CartItem";
import { ItemCategory } from "~/src/components/const";

/**
 * カート明細（度数情報）
 */
export class CartItemPrescriptionInfo extends CartItem {
  /**
   * コンストラクタ
   * @param lineItem
   * @param itemId
   */
  constructor(lineItem: Lineitem, itemId: number | undefined = undefined) {
    super(lineItem, itemId);
    this.lineItem.itemCategoryCode =
      lineItem.itemCategoryCode ?? ItemCategory.PRESCRIPTION_INFO;
  }

  /**
   * 商品ID検索
   * @param _dpfmRequestInfo
   * @returns Promise<number | undefined>
   */
  public override async findItemId(
    _dpfmRequestInfo: DpfmRequestInfo,
  ): Promise<number | undefined> {
    return undefined;
  }
}
