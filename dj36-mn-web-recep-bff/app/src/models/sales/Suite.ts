import { getInventoriesServer } from "~/src/clients/inventories/inventoriesClient";
import { getLensUniqueAttributes } from "~/src/clients/items/itemsClient";
import {
  DpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { SubEventCode } from "~/src/compornents/eventCode";
import { logger } from "~/src/logging/logger";
import { CartItemFactory } from "~/src/models/sales/CartItemFactory";
import { CartItem } from "~/src/models/sales/CartItem";
import {
  itemGroupCompleteSet,
  ItemGroup,
  Lineitem,
} from "~/src/clients/carts/cartsClientTypes";
import {
  getLensUniqueAttributesQuery,
  LensUniqueAttributesGetResponse,
} from "~/src/clients/items/itemsClientTypes";
import {
  getInventoriesQuery,
  InventoriesGetResponse,
} from "~/src/clients/inventories/inventoriesClientTypes";
import {
  CalculateAmountGlassLinesReadDto,
  CalculateAmountGlassLinesWriteDto,
} from "~/src/clients/oms/omsClientTypes";
import { Prescription} from "~/src/models/sales/Prescription";
import { isPerspectiveTypeCode } from "~/src/models/sales/PerspectiveTypeCodeMap";
import { sendApiRequest } from "~/src/utils/fetchService";
import { components as cartsComponents } from "~/src/interfaces/clients/carts/cartsClient";
import { WarrantyExchange } from "~/src/compornents/rootType";
import { COUNTRY_CODE_ALPHA2, ReplacementPart } from "~/src/compornents/const";

/////////////////////////////////////////////////////////////////////////////////////
// 商品
const ItemTypeList = [
  "frame", // フレーム
  "case", // ケース
  "cerrito", // セリート
  // "right_lens", // 右レンズ
  // "left_lens", // 左レンズ
  "prescriptionInfo", // 度数情報
  "salesColorName", // レンズOP（販売用カラー名称）
  "salesLensSpec", // レンズOP（販売用レンズ仕様）
  "focusCategory", // レンズOP（焦点分類）
  "progressiveCategory", // レンズOP（累進分類）
  "refractiveIndexName", // レンズOP（屈折率名称）
  // "rimlessFinishingCategory", // リムレス仕上げ分類
  "lensReplacement", // レンズ交換OP
] as const;
export type ItemType = (typeof ItemTypeList)[number];

// （カート）Suiteクラスで保持する形式
type ItemGroupExtendsLineitems = Omit<
  cartsComponents["schemas"]["ItemGroup"],
  "Lineitems"
>;

/**
 * Suiteクラス
 */
export class Suite {
  itemGroup: ItemGroupExtendsLineitems;
  private suiteNo: string;
  private eventCode: string | undefined; // see EventCode.ts(const EventCode)
  private subEventCode: string | undefined; // see EventCode.ts(const SubEventCode)
  // カート明細
  private items: {
    [K in ItemType]: CartItem | undefined;
  };
  // 保証交換
  private warrantyExchange: WarrantyExchange | undefined;

  /**
   * コンストラクタ
   * @param itemset
   * @param warrantyExchange
   */
  constructor(itemset: itemGroupCompleteSet, warrantyExchange? : WarrantyExchange) {
    // suiteNoは、商品グループIDの-以降の部分
    this.suiteNo = itemset.itemGroupCode!.replace(/.*-/, "");
    this.itemGroup = this.getItemGroupfromItemSet(itemset);
    this.items = {
      ["frame"]: CartItemFactory.create("frame", itemset),
      ["case"]: CartItemFactory.create("case", itemset),
      ["cerrito"]: CartItemFactory.create("cerrito", itemset),
      ["prescriptionInfo"]: CartItemFactory.create("prescriptionInfo", itemset),
      ["salesColorName"]: CartItemFactory.create("salesColorName", itemset),
      ["salesLensSpec"]: CartItemFactory.create("salesLensSpec", itemset),
      ["focusCategory"]: CartItemFactory.create("focusCategory", itemset),
      ["progressiveCategory"]: CartItemFactory.create(
        "progressiveCategory",
        itemset
      ),
      ["refractiveIndexName"]: CartItemFactory.create(
        "refractiveIndexName",
        itemset
      ),
      ["lensReplacement"]: CartItemFactory.create("lensReplacement", itemset),
    };
    this.warrantyExchange = warrantyExchange;
  }

  /**
   * ItemGroupCompleteSetからitemGroupを作成
   * @param itemset
   * @returns
   */
  private getItemGroupfromItemSet(
    itemset: itemGroupCompleteSet
  ): ItemGroupExtendsLineitems {
    const itemGroup: ItemGroupExtendsLineitems = {
      lineitemGroupId: itemset.lineitemGroupId ?? undefined,
      itemGroupCode: itemset.itemGroupCode,
      statusCode: itemset.statusCode,
      callingStatusCode: itemset.callingStatusCode,
      deliveryMethodCode: itemset.deliveryMethodCode ?? undefined,
      deliveryDatetime: itemset.deliveryDatetime ?? undefined,
      deliveryStoreCode: itemset.deliveryStoreCode ?? undefined,
      customerName: itemset.customerName ?? undefined,
      phoneNumber: itemset.phoneNumber ?? undefined,
      shippingAddressZip: itemset.shippingAddressZip ?? undefined,
      shippingAddress1: itemset.shippingAddress1 ?? undefined,
      shippingAddress2: itemset.shippingAddress2 ?? undefined,
      shippingAddress3: itemset.shippingAddress3 ?? undefined,
      shippingAddress4: itemset.shippingAddress4 ?? undefined,
      isExchangeLens: itemset.isExchangeLens,
      isWaitingLens: itemset.isWaitingLens,
      isDeliveryToday: itemset.isDeliveryToday,
      note: itemset.note ?? undefined,
      discountPrice: itemset.discountPrice,
      subtotal: itemset.subtotal,
      totalDiscountPrice: itemset.totalDiscountPrice,
      totalTaxPrice: itemset.totalTaxPrice,
      salesPrice: itemset.salesPrice,
      jinsAccountId: itemset.jinsAccountId ?? undefined,
      optimisticLockVerNo: itemset.optimisticLockVerNo,
    };
    return itemGroup;
  }

  /**
   * SuiteNo取得
   * @returns
   */
  public getSuiteNo(): string {
    return this.suiteNo;
  }

  /**
   * EventCode設定
   * @param eventCode
   */
  public setEventCode(eventCode: string) {
    this.eventCode = eventCode;
  }

  /**
   * EventCode取得
   * @returns eventCode
   */
  public getEventCode() {
    return this.eventCode;
  }

  /**
   * subEventCode設定
   * @param subEventCode
   */
  public setSubEventCode(subEventCode: string) {
    if (subEventCode === SubEventCode.ADD) {
      // 登録は上書き
      this.subEventCode = subEventCode;
    } else {
      // 登録以外は未設定時のみ上書き
      this.subEventCode ??= subEventCode;
    }
  }

  /**
   * subEventCode取得
   * @returns subEventCode
   */
  public getSubEventCode() {
    return this.subEventCode;
  }

  /**
   * LineItem取得
   * 取得されるLineItemは複製のため、updateLineItemで更新する。
   * @param itemType
   * @returns
   */
  public getLineItem(itemType: ItemType): Lineitem | undefined {
    return this.items[itemType]?.getLineItem();
  }

  /**
   * LineItem更新
   * @param itemType
   * @param lineItem
   */
  public updateLineItem(itemType: ItemType, lineItem: Lineitem): void {
    if (this.items[itemType] == undefined) {
      this.items[itemType] = CartItemFactory.create(itemType, lineItem);
    } else {
      this.items[itemType]!.updateLineItem(lineItem);
    }
  }

  // 直接アクセス用
  /**
   * 商品コード取得
   * @param itemType
   * @returns
   */
  public getItemCode(itemType: ItemType): string | null | undefined {
    return this.items[itemType]?.getItemCode();
  }

  /**
   * 商品ID取得
   * @param itemType
   * @returns
   */
  public getItemId(itemType: ItemType): number | undefined {
    return this.items[itemType]?.getItemId();
  }

  /**
   * 商品ID検索
   * 　商品コードの更新後、商品を検索して商品IDキャッシュする。
   * 　当メソッドを呼び出していないと商品IDが取得できない。
   * @param itemType
   * @param dpfmRequestInfo
   * @returns
   */
  public async findItemId(
    itemType: ItemType,
    dpfmRequestInfo: DpfmRequestInfo
  ): Promise<number | undefined> {
    return await this.items[itemType]?.findItemId(dpfmRequestInfo);
  }

  /**
   * 商品が登録されているか判定
   * @returns true：商品あり・false：商品なし
   */
  public hasItems(): boolean {
    return Object.values(this.items).some(
      (item) => item?.getItemCode() != undefined
    );
  }

  /**
   * フレームが登録されているかを確認
   * @returns
   */
  public isFrameRegisterd() {
    // フレームのコードまたはレンズ交換分類コードが存在していること
    if (
      this.getItemCode("frame") != undefined ||
      this.getItemCode("lensReplacement") != undefined
    ) {
      return true;
    }
    return false;
  }

  /**
   * ケースが登録されているかを確認
   * @returns
   */
  public isCaseRegisterd() {
    // ケースのカート明細があること
    if (this.items["case"] != undefined) {
      return true;
    }
    return false;
  }

  /**
   * レンズオプションが登録されているかを確認
   * @returns
   */
  public isLensOptionRegisterd() {
    // いずれかのレンズオプションが設定されていること
    // 焦点分類は、度数情報登録時に登録されるので確認対象外。
    const itemCodes: (string | null | undefined)[] = [
      this.getLineItem("salesColorName")?.itemCode, // レンズOP（販売用カラー名称）
      this.getLineItem("salesLensSpec")?.itemCode, // レンズOP（販売用レンズ仕様）
      // this.getItemProperty("focusCategory")?.itemCode, // レンズOP（焦点分類）
      this.getLineItem("progressiveCategory")?.itemCode, // レンズOP（累進分類）
      this.getLineItem("refractiveIndexName")?.itemCode, // レンズOP（屈折率名称）
    ];
    if (itemCodes.some((itemCode) => itemCode != undefined)) {
      return true;
    }
    return false;
  }

  /**
   * 必要な処方箋画像が登録されているかを確認
   * @returns
   */
  public hasRequiedPrescriptionImage() {
    const prescription = this.getPrescription();
    if (prescription.isPrescriptionMethodByPrescription()) {
      // 処方箋画像が登録されているか
      // カート・カタログ取得APIで取得した処方箋画像（予備２）は保持していないため、
      // 処方箋登録日が設定されていることで代替
      return prescription.getPrescriptionRegistDate() != undefined;
    }
    return true;
  }

  /**
   * 度数情報の登録状態のチェック
   * @returns boolean
   */
  public isSetPrescription(): boolean {
    const prescription = this.getPrescription();
    // 指定した項目に値が入っているかを確認
    const targets = [
      prescription.getSphRight(), // 球面度数(右)
      prescription.getSphLeft(), // 球面度数(左)
      prescription.getCylRight(), // 乱視度数(右)
      prescription.getCylLeft(), // 乱視度数(左)
      prescription.getPdRight(), // 瞳孔間距離(右)
      prescription.getPdLeft(), // 瞳孔間距離(左)
      prescription.getPerspectiveTypeCode(), // 遠中近区分コード
    ];
    if (targets.some((value) => value == undefined)) {
      logger.info(
        `(prescription has undefined value.) prescription: ${prescription.toJSON()}`
      );
      return false;
    }
    // 度数登録方法が処方箋の時に、処方箋期限が設定されていることを確認
    if (
      prescription.isPrescriptionMethodByPrescription() &&
      prescription.getPrescriptionExpiration() == undefined
    ) {
      logger.info(
        `(prescriptionExpiration is not set.) prescription: ${prescription.toJSON()}`
      );
      return false;
    }
    // 遠中近区分コードが遠中近区分コードのリストに含まれていることを確認
    if (isPerspectiveTypeCode(prescription.getPerspectiveTypeCode()) == false) {
      logger.info(
        `(perspectiveTypeCode is not in list.) prescription: ${prescription.toJSON()}`
      );
      return false;
    }
    return true;
  }

  /**
   * 度数情報取得
   * @returns
   */
  public getPrescription(): Prescription {
    return new Prescription(this.items["prescriptionInfo"]?.getLineItem()?.preparation1);
  }

  /**
   * レンズ商品コード取得
   * @param dpfmRequestInfo
   * @param side - 左右どちらか
   * @returns 商品コード（レンズ左or右）
   */
  public async getLensItemCode(
    dpfmRequestInfo: DpfmRequestInfo,
    side: "Right" | "Left"
  ): Promise<string | null> {
    const prescription = this.getPrescription();
    if (!prescription.isDefined()) {
      return null;
    }
    const requestHeader = makeDpfmRequestHeader(dpfmRequestInfo);
    // レンズ固有属性検索API呼び出し
    const lensUniqueAttributesGetRequest: getLensUniqueAttributesQuery = {
      sphericalPower: side == "Right" ? prescription.getSphRight()??undefined : prescription.getSphLeft()??undefined,
      astigmatismPrescription:
        side == "Right" ? prescription.getCylRight()??undefined : prescription.getCylLeft()??undefined,
      addPower: side == "Right" ? prescription.getAddRight() : prescription.getAddLeft(),
      //refractiveIndex: itemGroup.lopRefractiveIndexNameItemId, //NOTE: 「指定しない」が理想形
      salesColorNameId: this.items["salesColorName"]?.getItemId(),
      salesLensSpecId: this.items["salesLensSpec"]?.getItemId(),
      focusCategoryId: this.items["focusCategory"]?.getItemId(),
      progressiveCategoryId: this.items["progressiveCategory"]?.getItemId(),
      countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
      deletedGetFlag: false,
    };

    logger.info(
      `lensUniqueAttributesGetRequest: ${JSON.stringify(lensUniqueAttributesGetRequest)}`
    );

    const apiResponse = await sendApiRequest(
      getLensUniqueAttributes,
      lensUniqueAttributesGetRequest,
      requestHeader
    );
    logger.info(
      `lensUniqueAttributesGetResponse: ${JSON.stringify(apiResponse)}`
    );

    if (!apiResponse.ok) {
      throw apiResponse;
    }

    const lensUniqueAttributesGetResponse: LensUniqueAttributesGetResponse =
      apiResponse.data;
    return lensUniqueAttributesGetResponse.records?.at(0)?.itemCode ?? null;
  }

  /**
   * フレームの在庫が必要かどうか判定
   * 保証交換の場合、交換部品以外の在庫は不要
   * @returns true:在庫必要、false:在庫不要
   */
  public needFrameStock() {
    const replacement : (string|undefined|null)[] = [ReplacementPart.ALL, ReplacementPart.FRAME];
    return this.warrantyExchange == undefined || replacement.includes(this.warrantyExchange?.replacementPart);
  }

  /**
   * ケースの在庫が必要かどうか判定
   * 保証交換の場合、交換部品以外の在庫は不要
   * @returns true:在庫必要、false:在庫不要
   */
  public needCaseStock() {
    return this.warrantyExchange == undefined;
  }

  /**
   * レンズの在庫が必要かどうか判定
   * 保証交換の場合、交換部品以外の在庫は不要
   * @returns true:在庫必要、false:在庫不要
   */
  public needLensStock() {
    const replacement : (string|undefined|null)[] = [ReplacementPart.ALL, ReplacementPart.LENSES];
    return this.warrantyExchange == undefined || replacement.includes(this.warrantyExchange?.replacementPart);
  }

  /**
   * 店舗在庫確認
   * @param dpfmRequestInfo
   * @param itemCodes 確認する商品コード
   * @returns true:在庫あり、false:在庫なし
   */
  public async hasStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    itemCodes: string[]
  ): Promise<boolean> {
    // 店舗に在庫切れの商品が存在するかを確認（在庫切れの商品がないなら在庫あり）
    return (
      (await this.isOutOfStockItemInStore(dpfmRequestInfo, itemCodes)) == false
    );
  }

  /**
   * 店舗に在庫切れの商品が存在するかを確認
   * @param dpfmRequestInfo
   * @param itemCodes 確認する商品コード
   * @returns true:在庫切れ商品あり、false:在庫切れ商品なし
   */
  private async isOutOfStockItemInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    itemCodes: string[]
  ): Promise<boolean> {
    const requestHeader = makeDpfmRequestHeader(dpfmRequestInfo);
    const getInventoryRequest: getInventoriesQuery = {
      locationCodeList: ["83005"], //NOTE: static value カート情報取得APIで取得予定
      itemCodeList: itemCodes,
      salesStatusIdList: [1], //NOTE: saleable
      itemStatusIdList: [1], //NOTE: enough quarity
    };
    logger.info(`getInventoriesQuery: ${JSON.stringify(getInventoryRequest)}`);
    return false

    // const apiResponse = await sendApiRequest(
    //   getInventoriesServer,
    //   getInventoryRequest,
    //   requestHeader
    // );
    // logger.info(`InventoriesGetResponse: ${JSON.stringify(apiResponse)}`);

    // if (!apiResponse.ok) {
    //   throw apiResponse;
    // }
    // const inventoriesGetResponse: InventoriesGetResponse = apiResponse.data;
    // if (inventoriesGetResponse.records == undefined) {
    //   return false;
    // }

    // return inventoriesGetResponse.records
    //   .filter((record) =>
    //     record.itemCode != undefined
    //       ? itemCodes.includes(record.itemCode)
    //       : false
    //   )
    //   .some((record) => record.inventoryQuantity == 0);
  }

  /**
   * メガネ行を取得する（価格・税計算API用）
    * @returns 価格・税計算APIリクエスト（メガネ行）
   */
  public toCalculateAmountGlassLinesWriteDto(): CalculateAmountGlassLinesWriteDto {
    const glassLine: CalculateAmountGlassLinesWriteDto = {
      glassLineCode: this.itemGroup.itemGroupCode!,
      caseItemId: this.getItemId("case"),
      frameItemId: this.getItemId("frame"),
      lensReplacementTypeItemId: this.getItemId("lensReplacement"),
      lopFocusCategoryItemId: this.getItemId("focusCategory"),
      lopProgressiveCategoryItemId: this.getItemId("progressiveCategory"),
      //lopRimlessFinishingCategoryItemId: undefined, //NOTE: Rimless pattern`s value is only null
      lopRefractiveIndexNameItemId: this.getItemId("refractiveIndexName"),
      lopSalesColorNameItemId: this.getItemId("salesColorName"),
      lopSalesLensSpecItemId: this.getItemId("salesLensSpec"),
      taxable: this.getTaxable(),
    };
    return glassLine;
  }

  /**
   * 課税対象取得
   */
  private getTaxable() {
    // 処方箋での度数登録の場合非課税
    const prescription = this.getPrescription();
    if( prescription.isPrescriptionMethodByPrescription() ){
      // 非課税
      return false;
    }
    // 課税対象
    return true;
  }

  /**
   * 価格更新
   * @param glassLine 価格・税計算APIレスポンスのメガネ行
   */
  public updateAmount(glassLine: CalculateAmountGlassLinesReadDto | undefined) {
    if (glassLine != undefined) {
      this.itemGroup.discountPrice = 0; //TODO: set discount price
      this.itemGroup.subtotal = glassLine.subtotalListAmount ?? 0;
      this.itemGroup.totalDiscountPrice = 0;
      this.itemGroup.totalTaxPrice = glassLine.subtotalTaxAmount;
      this.itemGroup.salesPrice = glassLine.subtotalSellingAmount;
    } else {
      this.itemGroup.discountPrice = 0; //TODO: set discount price
      this.itemGroup.subtotal = 0;
      this.itemGroup.totalDiscountPrice = 0;
      this.itemGroup.totalTaxPrice = 0;
      this.itemGroup.salesPrice = 0;
    }
    // items
    this.updateItemAmount(glassLine);
  }

  /**
   * カート明細の価格を更新する
   * @param glassLine 価格・税計算APIレスポンス（メガネ行）
   */
  private updateItemAmount(
    glassLine: CalculateAmountGlassLinesReadDto | undefined
  ) {
    // 商品の価格情報
    type ItemAmount = {
      // 商品ID
      itemId?: number;
      // 定価
      listPrice?: number;
      // 販売価格
      sellingPrice?: number;
      // 税コード
      taxClass?: string;
    };
    // 価格が変更されたかを判定
    const isChangedmount = (item: Lineitem, itemAmount: ItemAmount) => {
      return (
        item.taxClass != itemAmount.taxClass ||
        item.listPrice != itemAmount.listPrice ||
        item.salesPrice != itemAmount.sellingPrice
      );
    };
    // カート明細の更新
    const updateAmount = (itemType: ItemType, itemAmount: ItemAmount) => {
      // カート明細を更新する。
    const item = this.getLineItem(itemType);
      if (item != undefined) {
        if (isChangedmount(item, itemAmount)) {
          item.operationCode ??= "02"; // 更新
          item.taxClass = itemAmount.taxClass;
          item.listPrice = itemAmount.listPrice;
          item.discountPrice = 0;
          item.salesPrice = itemAmount.sellingPrice;
        }
        this.updateLineItem(itemType, item);
      }
    };

    // 税区分コードは、課税なら"1", 非課税なら"0"を設定
    const taxClass = glassLine?.taxable ? "1" : "0";

    // フレーム
    const frameItemAmount: ItemAmount = {
      itemId: glassLine?.frameItemId,
      listPrice: glassLine?.frameListPrice,
      sellingPrice: glassLine?.frameSellingPrice,
      taxClass: glassLine?.frameItemId?taxClass:undefined,
    };
    updateAmount("frame", frameItemAmount);

    // ケース
    const caseItemAmount: ItemAmount = {
      itemId: glassLine?.caseItemId,
      listPrice: glassLine?.caseListPrice,
      sellingPrice: glassLine?.caseSellingPrice,
      taxClass: glassLine?.caseItemId?taxClass:undefined,
    };
    updateAmount("case", caseItemAmount);

    // レンズOP（販売用カラー名称）
    const salesColorNameAmount: ItemAmount = {
      itemId: glassLine?.lopSalesColorNameItemId,
      listPrice: glassLine?.lopSalesColorNameListPrice,
      sellingPrice: glassLine?.lopSalesColorNameSellingPrice,
      taxClass: glassLine?.lopSalesColorNameItemId?taxClass:undefined,
    };
    updateAmount("salesColorName", salesColorNameAmount);

    // レンズOP（販売用レンズ仕様）
    const salesLensSpecAmount: ItemAmount = {
      itemId: glassLine?.lopSalesLensSpecItemId,
      listPrice: glassLine?.lopSalesLensSpecListPrice,
      sellingPrice: glassLine?.lopSalesLensSpecSellingPrice,
      taxClass: glassLine?.lopSalesLensSpecItemId?taxClass:undefined,
    };
    updateAmount("salesLensSpec", salesLensSpecAmount);

    // レンズOP（焦点分類）
    const focusCategoryAmount: ItemAmount = {
      itemId: glassLine?.lopFocusCategoryItemId,
      listPrice: glassLine?.lopFocusCategoryListPrice,
      sellingPrice: glassLine?.lopFocusCategorySellingPrice,
      taxClass: glassLine?.lopFocusCategoryItemId?taxClass:undefined,
    };
    updateAmount("focusCategory", focusCategoryAmount);

    // レンズOP（累進分類）
    const progressiveCategoryAmount: ItemAmount = {
      itemId: glassLine?.lopProgressiveCategoryItemId,
      listPrice: glassLine?.lopProgressiveCategoryListPrice,
      sellingPrice: glassLine?.lopProgressiveCategorySellingPrice,
      taxClass: glassLine?.lopProgressiveCategoryItemId?taxClass:undefined,
    };
    updateAmount("progressiveCategory", progressiveCategoryAmount);

    // レンズOP（屈折率名称）
    const refractiveIndexNameAmount: ItemAmount = {
      itemId: glassLine?.lopRefractiveIndexNameItemId,
      listPrice: glassLine?.lopRefractiveIndexNameListPrice,
      sellingPrice: glassLine?.lopRefractiveIndexNameSellingPrice,
      taxClass: glassLine?.lopRefractiveIndexNameItemId?taxClass:undefined,
    };
    updateAmount("refractiveIndexName", refractiveIndexNameAmount);

    // レンズ交換OP
    const lensReplacementAmount: ItemAmount = {
      itemId: glassLine?.lensReplacementTypeItemId,
      listPrice: glassLine?.lopRefractiveIndexNameListPrice,
      sellingPrice: glassLine?.lopRefractiveIndexNameSellingPrice,
      taxClass: glassLine?.lensReplacementTypeItemId?taxClass:undefined,
    };
    updateAmount("lensReplacement", lensReplacementAmount);
  }

  /**
   * ItemGroup取得(カート情報登録API用)
   * @returns カート情報登録リクエストのItemGroup
   */
  public toItemGroup(): ItemGroup {
    const itemGroup: ItemGroup = {
      ...this.itemGroup,
      // Lineitems: lineItems,
      Lineitems: Object.values(this.items)
        .map((item) => item?.toLineItem())
        .filter((lineItem): lineItem is Lineitem => lineItem != undefined)
        .filter((lineItem) => lineItem?.operationCode != undefined),
    };
    return itemGroup;
  }
}
