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
   * @param itemSet   ： カート・カタログ取得APIの商品グループ(メガネ一式)
   * @returns カート明細（switch分岐の漏れチェックのためは作成しないときはnullを返却）
   */
  private static createFromCartSchemaItemGroupCompleteSet(
    itemType: ItemType,
    itemSet: itemGroupCompleteSet,
  ): CartItem | null {
    switch (itemType) {
      case "frame":
        return itemSet.frameItemCategoryCode
          ? new CartItemFrame(
              {
                lineitemId: itemSet.frameLineitemId ?? undefined,
                itemCode: itemSet.frameItemCode ?? undefined,
                itemCategoryCode: itemSet.frameItemCategoryCode,
                operationCode: undefined,
                preparation1: itemSet.framePreparation1 ?? undefined,
                preparation2: itemSet.framePreparation2 ?? undefined,
                taxClass: itemSet.frameTaxClass ?? undefined,
                listPrice: itemSet.frameListPrice ?? undefined,
                discountPrice: itemSet.frameDiscountPrice ?? undefined,
                taxPrice: itemSet.frameTaxPrice ?? undefined,
                salesPrice: itemSet.frameSalesPrice ?? undefined,
                lot: itemSet.frameLot ?? undefined,
                optimisticLockVerNo:
                  itemSet.frameOptimisticLockVerNo ?? undefined,
              },
              itemSet.frameItemId ?? undefined,
            )
          : null;
      case "case":
        return itemSet.caseItemCategoryCode
          ? new CartItemCase(
              {
                lineitemId: itemSet.caseLineitemId ?? undefined,
                itemCode: itemSet.caseItemCode ?? undefined,
                itemCategoryCode: itemSet.caseItemCategoryCode,
                operationCode: undefined,
                preparation1: itemSet.casePreparation1 ?? undefined,
                preparation2: itemSet.casePreparation2 ?? undefined,
                taxClass: itemSet.caseTaxClass ?? undefined,
                listPrice: itemSet.caseListPrice ?? undefined,
                discountPrice: itemSet.caseDiscountPrice ?? undefined,
                taxPrice: itemSet.caseTaxPrice ?? undefined,
                salesPrice: itemSet.caseSalesPrice ?? undefined,
                lot: itemSet.caseLot ?? undefined,
                optimisticLockVerNo:
                  itemSet.caseOptimisticLockVerNo ?? undefined,
              },
              itemSet.caseItemId ?? undefined,
            )
          : null;
          case "cerrito":
            return itemSet.cerritoItemCategoryCode
              ? new CartItemCerrito(
                  {
                    lineitemId: itemSet.cerritoLineitemId ?? undefined,
                    itemCode: itemSet.cerritoItemCode ?? undefined,
                    itemCategoryCode: itemSet.cerritoItemCategoryCode,
                    operationCode: undefined,
                    preparation1: itemSet.cerritoPreparation1 ?? undefined,
                    preparation2: itemSet.cerritoPreparation2 ?? undefined,
                    taxClass: itemSet.cerritoTaxClass ?? undefined,
                    listPrice: itemSet.cerritoListPrice ?? undefined,
                    discountPrice: itemSet.cerritoDiscountPrice ?? undefined,
                    taxPrice: itemSet.cerritoTaxPrice ?? undefined,
                    salesPrice: itemSet.cerritoSalesPrice ?? undefined,
                    lot: itemSet.cerritoLot ?? undefined,
                    optimisticLockVerNo:
                      itemSet.cerritoOptimisticLockVerNo ?? undefined,
                  },
                  itemSet.cerritoItemId ?? undefined,
                )
              : null;
          case "prescriptionInfo":
        return itemSet.registeredItemCategoryCode
          ? new CartItemPrescriptionInfo(
              {
                lineitemId: itemSet.registeredLineitemId ?? undefined,
                itemCode: undefined,
                itemCategoryCode:
                  itemSet.registeredItemCategoryCode,
                operationCode: undefined,
                preparation1: itemSet.registeredPreparation1 ?? undefined,
                preparation2: undefined, // 予備２(処方箋画像のパス)は引き継がない。
                taxClass: itemSet.registeredTaxClass ?? undefined,
                listPrice: itemSet.registeredListPrice ?? undefined,
                discountPrice: itemSet.registeredDiscountPrice ?? undefined,
                taxPrice: itemSet.registeredTaxPrice ?? undefined,
                salesPrice: itemSet.registeredSalesPrice ?? undefined,
                lot: itemSet.registeredLot ?? undefined,
                optimisticLockVerNo:
                  itemSet.registeredOptimisticLockVerNo ?? undefined,
              },
              itemSet.registeredItemId ?? undefined,
            )
          : null;
      case "salesColorName":
        return itemSet.lopSalesColorNameItemCategoryCode
          ? new CartItemLensOpSalesColorName(
              {
                lineitemId: itemSet.lopSalesColorNameLineitemId ?? undefined,
                itemCode: itemSet.lopSalesColorNameLensOptionCode ?? undefined,
                itemCategoryCode:
                  itemSet.lopSalesColorNameItemCategoryCode,
                operationCode: undefined,
                preparation1:
                  itemSet.lopSalesColorNamePreparation1 ?? undefined,
                preparation2:
                  itemSet.lopSalesColorNamePreparation2 ?? undefined,
                taxClass: itemSet.lopSalesColorNameTaxClass ?? undefined,
                listPrice: itemSet.lopSalesColorNameListPrice ?? undefined,
                discountPrice:
                  itemSet.lopSalesColorNameDiscountPrice ?? undefined,
                taxPrice: itemSet.lopSalesColorNameTaxPrice ?? undefined,
                salesPrice: itemSet.lopSalesColorNameSalesPrice ?? undefined,
                lot: itemSet.lopSalesColorNameLot ?? undefined,
                optimisticLockVerNo:
                  itemSet.lopSalesColorNameOptimisticLockVerNo ?? undefined,
              },
              itemSet.lopSalesColorNameItemId ?? undefined,
            )
          : null;
      case "salesLensSpec":
        return itemSet.lopSalesLensSpecItemCategoryCode
          ? new CartItemLensOpSalesLensSpec(
              {
                lineitemId: itemSet.lopSalesLensSpecLineitemId ?? undefined,
                itemCode: itemSet.lopSalesLensSpecLensOptionCode ?? undefined,
                itemCategoryCode:
                  itemSet.lopSalesLensSpecItemCategoryCode,
                operationCode: undefined,
                preparation1: itemSet.lopSalesLensSpecPreparation1 ?? undefined,
                preparation2: itemSet.lopSalesLensSpecPreparation2 ?? undefined,
                taxClass: itemSet.lopSalesLensSpecTaxClass ?? undefined,
                listPrice: itemSet.lopSalesLensSpecListPrice ?? undefined,
                discountPrice:
                  itemSet.lopSalesLensSpecDiscountPrice ?? undefined,
                taxPrice: itemSet.lopSalesLensSpecTaxPrice ?? undefined,
                salesPrice: itemSet.lopSalesLensSpecSalesPrice ?? undefined,
                lot: itemSet.lopSalesLensSpecLot ?? undefined,
                optimisticLockVerNo:
                  itemSet.lopSalesLensSpecOptimisticLockVerNo ?? undefined,
              },
              itemSet.lopSalesLensSpecItemId ?? undefined,
            )
          : null;
      case "focusCategory":
        return itemSet.lopFocusCategoryItemCategoryCode
          ? new CartItemLensOpFocusCategory(
              {
                lineitemId: itemSet.lopFocusCategoryLineitemId ?? undefined,
                itemCode: itemSet.lopFocusCategoryLensOptionCode ?? undefined,
                itemCategoryCode:
                  itemSet.lopFocusCategoryItemCategoryCode,
                operationCode: undefined,
                preparation1: itemSet.lopFocusCategoryPreparation1 ?? undefined,
                preparation2: itemSet.lopFocusCategoryPreparation2 ?? undefined,
                taxClass: itemSet.lopFocusCategoryTaxClass ?? undefined,
                listPrice: itemSet.lopFocusCategoryListPrice ?? undefined,
                discountPrice:
                  itemSet.lopFocusCategoryDiscountPrice ?? undefined,
                taxPrice: itemSet.lopFocusCategoryTaxPrice ?? undefined,
                salesPrice: itemSet.lopFocusCategorySalesPrice ?? undefined,
                lot: itemSet.lopFocusCategoryLot ?? undefined,
                optimisticLockVerNo:
                  itemSet.lopFocusCategoryOptimisticLockVerNo ?? undefined,
              },
              itemSet.lopFocusCategoryItemId ?? undefined,
            )
          : null;
      case "progressiveCategory":
        return itemSet.lopProgressiveCategoryItemCategoryCode
          ? new CartItemLensOpProgressiveCategory(
              {
                lineitemId:
                  itemSet.lopProgressiveCategoryLineitemId ?? undefined,
                itemCode:
                  itemSet.lopProgressiveCategoryLensOptionCode ?? undefined,
                itemCategoryCode:
                  itemSet.lopProgressiveCategoryItemCategoryCode,
                operationCode: undefined,
                preparation1:
                  itemSet.lopProgressiveCategoryPreparation1 ?? undefined,
                preparation2:
                  itemSet.lopProgressiveCategoryPreparation2 ?? undefined,
                taxClass: itemSet.lopProgressiveCategoryTaxClass ?? undefined,
                listPrice: itemSet.lopProgressiveCategoryListPrice ?? undefined,
                discountPrice:
                  itemSet.lopProgressiveCategoryDiscountPrice ?? undefined,
                taxPrice: itemSet.lopProgressiveCategoryTaxPrice ?? undefined,
                salesPrice:
                  itemSet.lopProgressiveCategorySalesPrice ?? undefined,
                lot: itemSet.lopProgressiveCategoryLot ?? undefined,
                optimisticLockVerNo:
                  itemSet.lopProgressiveCategoryOptimisticLockVerNo ??
                  undefined,
              },
              itemSet.lopProgressiveCategoryItemId ?? undefined,
            )
          : null;
      case "refractiveIndexName":
        return itemSet.lopRefractiveIndexNameItemCategoryCode
          ? new CartItemLensOpRefractiveIndexName(
              {
                lineitemId:
                  itemSet.lopRefractiveIndexNameLineitemId ?? undefined,
                itemCode:
                  itemSet.lopRefractiveIndexNameLensOptionCode ?? undefined,
                itemCategoryCode:
                  itemSet.lopRefractiveIndexNameItemCategoryCode,
                operationCode: undefined,
                preparation1:
                  itemSet.lopRefractiveIndexNamePreparation1 ?? undefined,
                preparation2:
                  itemSet.lopRefractiveIndexNamePreparation2 ?? undefined,
                taxClass: itemSet.lopRefractiveIndexNameTaxClass ?? undefined,
                listPrice: itemSet.lopRefractiveIndexNameListPrice ?? undefined,
                discountPrice:
                  itemSet.lopRefractiveIndexNameDiscountPrice ?? undefined,
                taxPrice: itemSet.lopRefractiveIndexNameTaxPrice ?? undefined,
                salesPrice:
                  itemSet.lopRefractiveIndexNameSalesPrice ?? undefined,
                lot: itemSet.lopRefractiveIndexNameLot ?? undefined,
                optimisticLockVerNo:
                  itemSet.lopRefractiveIndexNameOptimisticLockVerNo ??
                  undefined,
              },
              itemSet.lopRefractiveIndexNameItemId ?? undefined,
            )
          : null;
      case "lensReplacement":
        return itemSet.lensReplacementItemCategoryCode
          ? new CartItemLensReplacementOp(
              {
                lineitemId: itemSet.lensReplacementLineitemId ?? undefined,
                itemCode: itemSet.lensReplacementTypeCode ?? undefined,
                itemCategoryCode:
                  itemSet.lensReplacementItemCategoryCode,
                operationCode: undefined,
                preparation1: itemSet.lensReplacementPreparation1 ?? undefined,
                preparation2: itemSet.lensReplacementPreparation2 ?? undefined,
                taxClass: itemSet.lensReplacementTaxClass ?? undefined,
                listPrice: itemSet.lensReplacementListPrice ?? undefined,
                discountPrice:
                  itemSet.lensReplacementDiscountPrice ?? undefined,
                taxPrice: itemSet.lensReplacementTaxPrice ?? undefined,
                salesPrice: itemSet.lensReplacementSalesPrice ?? undefined,
                lot: itemSet.lensReplacementTypeLot ?? undefined,
                optimisticLockVerNo:
                  itemSet.lensReplacementOptimisticLockVerNo ?? undefined,
              },
              itemSet.lensReplacementItemId ?? undefined,
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
