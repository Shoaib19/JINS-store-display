import { CartItemCase } from "~/src/models/sales/CartItemCase";
import { CartItemFrame } from "~/src/models/sales/CartItemFrame";
import { CartItemLensOpFocusCategory } from "~/src/models/sales/CartItemLensOpFocusCategory";
import { CartItemLensOpProgressiveCategory } from "~/src/models/sales/CartItemLensOpProgressiveCategory";
import { CartItemLensOpRefractiveIndexName } from "~/src/models/sales/CartItemLensOpRefractiveIndexName";
import { CartItemLensOpSalesLensSpec } from "~/src/models/sales/CartItemLensOpSalesLensSpec";
import { CartItemPrescriptionInfo } from "~/src/models/sales/CartItemPrescriptionInfo";
import { CartItemLensOpSalesColorName } from "~/src/models/sales/CartItemLensOpSalesColorName";
import { CartItem } from "~/src/models/sales/CartItem";
import {
  itemGroupCompleteSet,
  Lineitem,
} from "~/src/clients/carts/cartsClientTypes";
import { ItemType } from "~/src/models/sales/Suite";
import { CartItemLensReplacementOp } from "~/src/models/sales/CartItemLensReplacementOp";
import { CartItemCerrito } from "~/src/models/sales/CartItemCerrito";

/**
 * カート明細のFactory
 */
export class CartItemFactory {
  /**
   * カート明細作成
   * @param itemType  : 作成するカート明細
   * @param source   ： カート・カタログ取得APIの商品グループ(メガネ一式) または カート情報登録APIのカート明細
   * @returns カート明細
   */
  public static create(
    itemType: ItemType,
    source: itemGroupCompleteSet | Lineitem,
  ): CartItem | undefined {
    if (this.isCartSchemaItemGroupCompleteSet(source)) {
      return (
        this.createFromCartSchemaItemGroupCompleteSet(itemType, source) ??
        undefined
      );
    } else if (this.isCartSchemaLineItem(source)) {
      return this.createFromCartSchemaLineItem(itemType, source);
    }
    return undefined;
  }

  /**
   * itemGroupCompleteSet 判定(タイプガード)
   * @param source
   * @returns
   */
  private static isCartSchemaItemGroupCompleteSet(
    source: object,
  ): source is itemGroupCompleteSet {
    // itemGroupCompleteSetの場合、必須項目の"lineitemGroupId"があることを確認
    return "lineitemGroupId" in source;
  }

  /**
   * Lineitem 判定(タイプガード)
   * @param source
   * @returns
   */
  private static isCartSchemaLineItem(source: object): source is Lineitem {
    // Lineitemの場合、必須の"itemCategoryCode" か "operationCode"（新規の場合）で判定
    return "itemCategoryCode" in source || "operationCode" in source;
  }

  /**
   * カート明細作成
   * @param itemType  : 作成するカート明細
   * @param itemset   ： カート・カタログ取得APIの商品グループ(メガネ一式)
   * @returns カート明細（switch分岐の漏れチェックのためは作成しないときはnullを返却）
   */
  private static createFromCartSchemaItemGroupCompleteSet(
    itemType: ItemType,
    itemset: itemGroupCompleteSet,
  ): CartItem | null {
    switch (itemType) {
      case "frame":
        return itemset.frameItemCategoryCode
          ? new CartItemFrame(
              {
                lineitemId: itemset.frameLineitemId ?? undefined,
                itemCode: itemset.frameItemCode ?? undefined,
                itemCategoryCode: itemset.frameItemCategoryCode,
                operationCode: undefined,
                preparation1: itemset.framePreparation1 ?? undefined,
                preparation2: itemset.framePreparation2 ?? undefined,
                taxClass: itemset.frameTaxClass ?? undefined,
                listPrice: itemset.frameListPrice ?? undefined,
                discountPrice: itemset.frameDiscountPrice ?? undefined,
                taxPrice: itemset.frameTaxPrice ?? undefined,
                salesPrice: itemset.frameSalesPrice ?? undefined,
                optimisticLockVerNo:
                  itemset.frameOptimisticLockVerNo ?? undefined,
              },
              itemset.frameItemId ?? undefined,
            )
          : null;
      case "case":
        return itemset.caseItemCategoryCode
          ? new CartItemCase(
              {
                lineitemId: itemset.caseLineitemId ?? undefined,
                itemCode: itemset.caseItemCode ?? undefined,
                itemCategoryCode: itemset.caseItemCategoryCode,
                operationCode: undefined,
                preparation1: itemset.casePreparation1 ?? undefined,
                preparation2: itemset.casePreparation2 ?? undefined,
                taxClass: itemset.caseTaxClass ?? undefined,
                listPrice: itemset.caseListPrice ?? undefined,
                discountPrice: itemset.caseDiscountPrice ?? undefined,
                taxPrice: itemset.caseTaxPrice ?? undefined,
                salesPrice: itemset.caseSalesPrice ?? undefined,
                optimisticLockVerNo:
                  itemset.caseOptimisticLockVerNo ?? undefined,
              },
              itemset.caseItemId ?? undefined,
            )
          : null;
          case "cerrito":
            return itemset.cerritoItemCategoryCode
              ? new CartItemCerrito(
                  {
                    lineitemId: itemset.cerritoLineitemId ?? undefined,
                    itemCode: itemset.cerritoItemCode ?? undefined,
                    itemCategoryCode: itemset.cerritoItemCategoryCode,
                    operationCode: undefined,
                    preparation1: itemset.cerritoPreparation1 ?? undefined,
                    preparation2: itemset.cerritoPreparation2 ?? undefined,
                    taxClass: itemset.cerritoTaxClass ?? undefined,
                    listPrice: itemset.cerritoListPrice ?? undefined,
                    discountPrice: itemset.cerritoDiscountPrice ?? undefined,
                    taxPrice: itemset.cerritoTaxPrice ?? undefined,
                    salesPrice: itemset.cerritoSalesPrice ?? undefined,
                    optimisticLockVerNo:
                      itemset.cerritoOptimisticLockVerNo ?? undefined,
                  },
                  itemset.cerritoItemId ?? undefined,
                )
              : null;
          case "prescriptionInfo":
        return itemset.registeredItemCategoryCode
          ? new CartItemPrescriptionInfo(
              {
                lineitemId: itemset.registeredLineitemId ?? undefined,
                itemCode: undefined,
                itemCategoryCode:
                  itemset.registeredItemCategoryCode,
                operationCode: undefined,
                preparation1: itemset.registeredPreparation1 ?? undefined,
                preparation2: undefined, // 予備２は引き継がない。
                // preparation2: itemset.registeredPreparation2 ?? undefined,
                taxClass: itemset.registeredTaxClass ?? undefined,
                listPrice: itemset.registeredListPrice ?? undefined,
                discountPrice: itemset.registeredDiscountPrice ?? undefined,
                taxPrice: itemset.registeredTaxPrice ?? undefined,
                salesPrice: itemset.registeredSalesPrice ?? undefined,
                optimisticLockVerNo:
                  itemset.registeredOptimisticLockVerNo ?? undefined,
              },
              itemset.registeredItemId ?? undefined,
            )
          : null;
      case "salesColorName":
        return itemset.lopSalesColorNameItemCategoryCode
          ? new CartItemLensOpSalesColorName(
              {
                lineitemId: itemset.lopSalesColorNameLineitemId ?? undefined,
                itemCode: itemset.lopSalesColorNameLensOptionCode ?? undefined,
                itemCategoryCode:
                  itemset.lopSalesColorNameItemCategoryCode,
                operationCode: undefined,
                preparation1:
                  itemset.lopSalesColorNamePreparation1 ?? undefined,
                preparation2:
                  itemset.lopSalesColorNamePreparation2 ?? undefined,
                taxClass: itemset.lopSalesColorNameTaxClass ?? undefined,
                listPrice: itemset.lopSalesColorNameListPrice ?? undefined,
                discountPrice:
                  itemset.lopSalesColorNameDiscountPrice ?? undefined,
                taxPrice: itemset.lopSalesColorNameTaxPrice ?? undefined,
                salesPrice: itemset.lopSalesColorNameSalesPrice ?? undefined,
                optimisticLockVerNo:
                  itemset.lopSalesColorNameOptimisticLockVerNo ?? undefined,
              },
              itemset.lopSalesColorNameItemId ?? undefined,
            )
          : null;
      case "salesLensSpec":
        return itemset.lopSalesLensSpecItemCategoryCode
          ? new CartItemLensOpSalesLensSpec(
              {
                lineitemId: itemset.lopSalesLensSpecLineitemId ?? undefined,
                itemCode: itemset.lopSalesLensSpecLensOptionCode ?? undefined,
                itemCategoryCode:
                  itemset.lopSalesLensSpecItemCategoryCode,
                operationCode: undefined,
                preparation1: itemset.lopSalesLensSpecPreparation1 ?? undefined,
                preparation2: itemset.lopSalesLensSpecPreparation2 ?? undefined,
                taxClass: itemset.lopSalesLensSpecTaxClass ?? undefined,
                listPrice: itemset.lopSalesLensSpecListPrice ?? undefined,
                discountPrice:
                  itemset.lopSalesLensSpecDiscountPrice ?? undefined,
                taxPrice: itemset.lopSalesLensSpecTaxPrice ?? undefined,
                salesPrice: itemset.lopSalesLensSpecSalesPrice ?? undefined,
                optimisticLockVerNo:
                  itemset.lopSalesLensSpecOptimisticLockVerNo ?? undefined,
              },
              itemset.lopSalesLensSpecItemId ?? undefined,
            )
          : null;
      case "focusCategory":
        return itemset.lopFocusCategoryItemCategoryCode
          ? new CartItemLensOpFocusCategory(
              {
                lineitemId: itemset.lopFocusCategoryLineitemId ?? undefined,
                itemCode: itemset.lopFocusCategoryLensOptionCode ?? undefined,
                itemCategoryCode:
                  itemset.lopFocusCategoryItemCategoryCode,
                operationCode: undefined,
                preparation1: itemset.lopFocusCategoryPreparation1 ?? undefined,
                preparation2: itemset.lopFocusCategoryPreparation2 ?? undefined,
                taxClass: itemset.lopFocusCategoryTaxClass ?? undefined,
                listPrice: itemset.lopFocusCategoryListPrice ?? undefined,
                discountPrice:
                  itemset.lopFocusCategoryDiscountPrice ?? undefined,
                taxPrice: itemset.lopFocusCategoryTaxPrice ?? undefined,
                salesPrice: itemset.lopFocusCategorySalesPrice ?? undefined,
                optimisticLockVerNo:
                  itemset.lopFocusCategoryOptimisticLockVerNo ?? undefined,
              },
              itemset.lopFocusCategoryItemId ?? undefined,
            )
          : null;
      case "progressiveCategory":
        return itemset.lopProgressiveCategoryItemCategoryCode
          ? new CartItemLensOpProgressiveCategory(
              {
                lineitemId:
                  itemset.lopProgressiveCategoryLineitemId ?? undefined,
                itemCode:
                  itemset.lopProgressiveCategoryLensOptionCode ?? undefined,
                itemCategoryCode:
                  itemset.lopProgressiveCategoryItemCategoryCode,
                operationCode: undefined,
                preparation1:
                  itemset.lopProgressiveCategoryPreparation1 ?? undefined,
                preparation2:
                  itemset.lopProgressiveCategoryPreparation2 ?? undefined,
                taxClass: itemset.lopProgressiveCategoryTaxClass ?? undefined,
                listPrice: itemset.lopProgressiveCategoryListPrice ?? undefined,
                discountPrice:
                  itemset.lopProgressiveCategoryDiscountPrice ?? undefined,
                taxPrice: itemset.lopProgressiveCategoryTaxPrice ?? undefined,
                salesPrice:
                  itemset.lopProgressiveCategorySalesPrice ?? undefined,
                optimisticLockVerNo:
                  itemset.lopProgressiveCategoryOptimisticLockVerNo ??
                  undefined,
              },
              itemset.lopProgressiveCategoryItemId ?? undefined,
            )
          : null;
      case "refractiveIndexName":
        return itemset.lopRefractiveIndexNameItemCategoryCode
          ? new CartItemLensOpRefractiveIndexName(
              {
                lineitemId:
                  itemset.lopRefractiveIndexNameLineitemId ?? undefined,
                itemCode:
                  itemset.lopRefractiveIndexNameLensOptionCode ?? undefined,
                itemCategoryCode:
                  itemset.lopRefractiveIndexNameItemCategoryCode,
                operationCode: undefined,
                preparation1:
                  itemset.lopRefractiveIndexNamePreparation1 ?? undefined,
                preparation2:
                  itemset.lopRefractiveIndexNamePreparation2 ?? undefined,
                taxClass: itemset.lopRefractiveIndexNameTaxClass ?? undefined,
                listPrice: itemset.lopRefractiveIndexNameListPrice ?? undefined,
                discountPrice:
                  itemset.lopRefractiveIndexNameDiscountPrice ?? undefined,
                taxPrice: itemset.lopRefractiveIndexNameTaxPrice ?? undefined,
                salesPrice:
                  itemset.lopRefractiveIndexNameSalesPrice ?? undefined,
                optimisticLockVerNo:
                  itemset.lopRefractiveIndexNameOptimisticLockVerNo ??
                  undefined,
              },
              itemset.lopRefractiveIndexNameItemId ?? undefined,
            )
          : null;
      case "lensReplacement":
        return itemset.lensReplacementItemCategoryCode
          ? new CartItemLensReplacementOp(
              {
                lineitemId: itemset.lensReplacementLineitemId ?? undefined,
                itemCode: itemset.lensReplacementTypeCode ?? undefined,
                itemCategoryCode:
                  itemset.lensReplacementItemCategoryCode,
                operationCode: undefined,
                preparation1: itemset.lensReplacementPreparation1 ?? undefined,
                preparation2: itemset.lensReplacementPreparation2 ?? undefined,
                taxClass: itemset.lensReplacementTaxClass ?? undefined,
                listPrice: itemset.lensReplacementListPrice ?? undefined,
                discountPrice:
                  itemset.lensReplacementDiscountPrice ?? undefined,
                taxPrice: itemset.lensReplacementTaxPrice ?? undefined,
                salesPrice: itemset.lensReplacementSalesPrice ?? undefined,
                optimisticLockVerNo:
                  itemset.lensReplacementOptimisticLockVerNo ?? undefined,
              },
              itemset.lensReplacementItemId ?? undefined,
            )
          : null;
    }
  }
  /**
   * カート明細作成
   * @param itemType  : 作成するカート明細
   * @param item   ： カートアイテムAPIのカート明細と同等
   * @returns カート明細
   */
  private static createFromCartSchemaLineItem(
    itemType: ItemType,
    item: Lineitem,
  ): CartItem {
    switch (itemType) {
      case "frame":
        return new CartItemFrame(item);
      case "case":
        return new CartItemCase(item);
      case "cerrito":
        return new CartItemCerrito(item);
      case "prescriptionInfo":
        return new CartItemPrescriptionInfo(item);
      case "salesColorName":
        return new CartItemLensOpSalesColorName(item);
      case "salesLensSpec":
        return new CartItemLensOpSalesLensSpec(item);
      case "focusCategory":
        return new CartItemLensOpFocusCategory(item);
      case "progressiveCategory":
        return new CartItemLensOpProgressiveCategory(item);
      case "refractiveIndexName":
        return new CartItemLensOpRefractiveIndexName(item);
      case "lensReplacement":
        return new CartItemLensReplacementOp(item);
    }
  }
}
