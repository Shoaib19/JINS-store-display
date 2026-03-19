import { Lineitem } from "~/src/clients/carts/cartsClientTypes";
import { SalesLensSearchGetResponseRecord } from "~/src/clients/items/itemsClientTypes";
import { ItemCategory } from "~/src/compornents/const";
import { CartItem } from "~/src/models/sales/CartItem";
import { DpfmRequestInfo } from "~/src/utils/makeRequestHeader";

/**
 * カート明細（レンズOP（販売用カラー名称））
 */
export class CartItemLensOpSalesColorName extends CartItem {
  /**
   * コンストラクタ
   * @param lineItem
   * @param itemId
   */
  constructor(lineItem: Lineitem, itemId: number | undefined = undefined) {
    super(lineItem, itemId);
    this.lineItem.itemCategoryCode =
      lineItem.itemCategoryCode ?? ItemCategory.LENS_OPTION;
    this.lineItem.preparation1 = lineItem.preparation1 ?? "1";
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
          1,
          itemCode,
          this.getItemIdFromSalesLensSearchResponse,
        );
      }
      return this.itemId;
    }
    return undefined;
  }
  /**
   * 販売用レンズ検索項目検索APIレスポンスから商品IDへの変換(販売用カラー名称)
   *  SalesLensSearchGetResponseRecord
   *   + salesColorMajorClass[]
   *      +salesColorMinorClass[]
   *        + salesColorName[]
   *            *salesColorNameCode 販売用カラー名称コード(商品コード)
   *            *salesColorNameId　販売用カラー名称ID(商品ID)
   *
   * @param salesLensSearchGetResponseData
   * @param itemCode
   * @returns 商品ID|undefined
   */
  private getItemIdFromSalesLensSearchResponse(
    salesLensSearchGetResponseData: SalesLensSearchGetResponseRecord,
    itemCode: string,
  ): number | undefined {
    if (salesLensSearchGetResponseData.salesColorMajorClass != undefined) {
      for (const salesColorMajorClass of salesLensSearchGetResponseData.salesColorMajorClass) {
        if (salesColorMajorClass.salesColorMinorClass != undefined) {
          for (const salesColorMinorClass of salesColorMajorClass.salesColorMinorClass) {
            if (salesColorMinorClass.salesColorName != undefined) {
              for (const salesColorName of salesColorMinorClass.salesColorName) {
                if (salesColorName.salesColorNameCode == itemCode) {
                  return salesColorName.salesColorNameId ?? undefined;
                }
              }
            }
          }
        }
      }
    }
    return undefined;
  }
}
