import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { IDeliveriesCheckPresenter } from "~/src/presenters/interfaces";

// Cart
import {
  getCartInfo,
  getCallManagement,
} from "~/src/clients/carts/cartsClient";
import {
  CartGetRequest,
  CartGetResponse,
  CallManagementGetRequest,
  CallManagementGetResponse,
  itemGroupCompleteSet,
  Cart,
  CallManagementInfo,
} from "~/src/clients/carts/cartsClientTypes";

// Location
import {
  getStoreAttributes,
} from "~/src/clients/locations/locationsClient";

// Items
// import {
//   getLensUniqueAttributes,
// } from "~/src/clients/items/itemsClient";
// import {
//   LensUniqueAttributesGetRequest,
//   LensUniqueAttributesGetResponse,
//   LensUniqueAttributeGetResponse,
// } from "~/src/clients/items/itemsClientTypes";

// Inventories
import {
  getInventoriesServer
} from "~/src/clients/inventories/inventoriesClient";
import {
  InventoriesGetRequest,
  InventoriesGetResponse
} from "~/src/clients/inventories/inventoriesClientTypes";

// 保証情報(sp16)
import {
  findWarranties,
} from "~/src/clients/warranties/warrantiesClient";
import {
  WarrantiesGetRequest,
  WarrantiesGetResponse,
  WarrantyInfo,
} from "~/src/clients/warranties/warrantiesClientTypes";

import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";

import {
  StoreAttributesGetRequest,
  StoreAttributesGetResponse,
  StoresAttribute
} from "~/src/clients/locations/locationsClientTypes";
import {
//  COUNTRY_CODE_ALPHA2,
  WarrantyItemType,
} from "~/src/components/const";
import {
  isBefore,
} from "~/src/utils/datetimeUtils";
import { getTimeOfToday } from "~/src/utils/datetimeUtils";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";
import { ApiResponse } from "openapi-typescript-fetch";
import { components, operations } from "~/src/interfaces/root";
import { isNotFoundResponse, ResourceNotFoundError } from "~/src/components/errors";

// 在庫チェック実行有無フラグ
class InventoryCheck {
  // 在庫チェックしたい=true
  static readonly execute: boolean = false;
}
//
// 内部インタフェース
type ElementType<T> = T extends(infer U)[] ? U : never;
type DeliveryInfo = ElementType<NonNullable<components["schemas"]["DeliveryResponse"]['deliveryInfo']>>;

/**
 * 受取方法チェックAPI
 */
@injectable()
export class DeliveriesCheckPresenter
  implements IDeliveriesCheckPresenter
{
  /**
   * カート・カタログ取得（DPFM呼び出し）
   * @param dpfmRequestInfo 
   * @param receptionNumber 
   * @returns 
   */
  private async getCart(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string,
  ): Promise<Cart|undefined> {

    const getCartRequest: CartGetRequest = {
      receptionNumber: receptionNumber,
      deleteFlag: false
    };
    logger.info(`getCartInfoRequest: ${JSON.stringify(getCartRequest)}`);
    const apiResponse: ApiResponse<CartGetResponse> = await sendApiRequest(
      getCartInfo,
      getCartRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`getCartInfoResponse: ${JSON.stringify(apiResponse)}`);

    return apiResponse.data.cart;
  };

  /**
   * 店舗属性マスタ検索（DPFM呼び出し）
   * @param dpfmRequestInfo 
   * @param storeCode 
   * @returns 
   */
  private async getStoreAttribute(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
  ): Promise<StoresAttribute|undefined> {

    const getStoreAttributesRequest : StoreAttributesGetRequest= {
      locationCodeList: [storeCode],
    };
    logger.info(`getStoreAttributesRequest: ${JSON.stringify(getStoreAttributesRequest)}`);
    const apiResponse: ApiResponse<StoreAttributesGetResponse> = await sendApiRequest(
      getStoreAttributes,
      getStoreAttributesRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`getStoreAttributesResponse: ${JSON.stringify(apiResponse)}`);

    return apiResponse.data.records?.at(0);

  };

  /**
   * 呼出し管理情報取得（DPFM呼び出し）
   * @param dpfmRequestInfo 
   * @param storeCode 
   * @returns 
   */
  private async getCallManagement(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
  ): Promise<CallManagementInfo|undefined> {
    
    const getCallManagementRequest: CallManagementGetRequest = {
      storeCode: storeCode,
    };
    logger.info(`getCallManagementDataRequest: ${JSON.stringify(getCallManagementRequest)}`);
    const apiResponse: ApiResponse<CallManagementGetResponse> = await sendApiRequest(
      getCallManagement,
      getCallManagementRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`getCallManagementDataResponse: ${JSON.stringify(apiResponse)}`);

    return apiResponse.data.callManagementInfo;
  };

  /**
   * 加工日付の大小比較（当日持ち帰り可能か）
   * @param processingCloseTime 
   * @returns 
   */
  private isReceipt(
    processingCloseTime: Date | undefined | null,
  ): boolean {
 
    // 現時刻が加工時間より小さい場合、当日受取可能(true)
    const sysDate = new Date();
    let deliTodayFlag: boolean = false;
    if (processingCloseTime) {
      deliTodayFlag = isBefore(sysDate, processingCloseTime);
    }
//    const deliTodayFlag = processingCloseTime ? isBefore(sysDate, processingCloseTime) : true;
    logger.info(`LocalDate                 : ${JSON.stringify(sysDate)}`);
    logger.info(`deliTodayFlag             : ${JSON.stringify(deliTodayFlag)}`);
    
    return deliTodayFlag;
  };

  /**
   * レンズ固有属性検索（DPFM呼び出し）
   * @param dpfmRequestInfo 
   * @param itemGroup 
   * @param side 
   * @returns 
   */
  // private async getLensUniqueAttributes(
  //   dpfmRequestInfo: DpfmRequestInfo,
  //   itemGroup: itemGroupCompleteSet,
  //   side: string,
  // ): Promise<LensUniqueAttributeGetResponse[] | null> {
  
  //   const request = this.getLensUniqueAttributesGetRequest(itemGroup, side);
  //   if (request == null) {
  //     return null;
  //   }
  //   logger.info(`getLensUniqueAttributesRequest: ${JSON.stringify(request)}`);
  //   const apiResponse: ApiResponse<LensUniqueAttributesGetResponse> = await sendApiRequest(
  //     getLensUniqueAttributes,
  //     request,
  //     makeDpfmRequestHeader(dpfmRequestInfo)
  //   );
  //   logger.info(`getLensUniqueAttributesResponse: ${JSON.stringify(apiResponse)}`);

  //   const lensUniqueAttributesGetResponseData: LensUniqueAttributesGetResponse =
  //     apiResponse.data;

  //   const records = lensUniqueAttributesGetResponseData.records;
  //   if (!records || records.length == 0) {
  //     logger.info(`getLensUniqueAttributesData return: null`);
  //     return null;
  //   }
    
  //   return records;
  // }

  /**
   * レンズ固有属性検索用パラメタ作成
   * @param itemGroup 
   * @param side 
   * @returns 
   */
  // private getLensUniqueAttributesGetRequest (
  //   itemGroup: itemGroupCompleteSet,
  //   side: string,
  // ): LensUniqueAttributesGetRequest | null {
  //   logger.info(`check registeredPreparation1 ${JSON.stringify(itemGroup.registeredPreparation1)}`);
  //   logger.info(`check lopRefractiveIndexNameItemId ${JSON.stringify(itemGroup.lopRefractiveIndexNameItemId)}`);
  //   logger.info(`check lopSalesColorNameItemId ${JSON.stringify(itemGroup.lopSalesColorNameItemId)}`);
  //   logger.info(`check lopSalesLensSpecItemId ${JSON.stringify(itemGroup.lopSalesLensSpecItemId)}`);
  //   logger.info(`check lopFocusCategoryItemId ${JSON.stringify(itemGroup.lopFocusCategoryItemId)}`);
  //   logger.info(`check lopProgressiveCategoryItemId ${JSON.stringify(itemGroup.lopProgressiveCategoryItemId)}`);
  //   if (!itemGroup.registeredPreparation1
  //     || (!itemGroup.lopRefractiveIndexNameItemId
  //       && !itemGroup.lopSalesColorNameItemId
  //       && !itemGroup.lopSalesLensSpecItemId
  //       && !itemGroup.lopFocusCategoryItemId
  //       && !itemGroup.lopProgressiveCategoryItemId
  //     )
  //   ) {
  //     return null;
  //   }
  //   logger.info(`lop Items control`);
  //   const prescription = JSON.parse(itemGroup.registeredPreparation1);
  //   // 処方箋画像登録のみの場合、予備領域に度数情報なしの対応
  //   if (!prescription.prescriptionInfo){
  //     return null;
  //   }

  //   let wkLopRefractiveIndexNameItemId: number | undefined = undefined;
  //   if (itemGroup.lopRefractiveIndexNameItemId){
  //     wkLopRefractiveIndexNameItemId = itemGroup.lopRefractiveIndexNameItemId;
  //   }
  //   let wkLopSalesColorNameItemId: number | undefined = undefined;
  //   if (itemGroup.lopSalesColorNameItemId){
  //     wkLopSalesColorNameItemId = itemGroup.lopSalesColorNameItemId;
  //   }
  //   let wkLopSalesLensSpecItemId: number | undefined = undefined;
  //   if (itemGroup.lopSalesLensSpecItemId){
  //     wkLopSalesLensSpecItemId = itemGroup.lopSalesLensSpecItemId;
  //   }
  //   let wkLopFocusCategoryItemId: number | undefined = undefined;
  //   if (itemGroup.lopFocusCategoryItemId){
  //     wkLopFocusCategoryItemId = itemGroup.lopFocusCategoryItemId;
  //   }
  //   let wkLopProgressiveCategoryItemId: number | undefined = undefined;
  //   if (itemGroup.lopProgressiveCategoryItemId){
  //     wkLopProgressiveCategoryItemId = itemGroup.lopProgressiveCategoryItemId;
  //   }

  //   const lensUniqueAttributesGetRequest: LensUniqueAttributesGetRequest =
  //     {
  //       limit: 1,
  //       sphericalPower: prescription.prescriptionInfo[`sph${side}`],
  //       astigmatismPrescription: prescription.prescriptionInfo[`cyl${side}`],
  //       addPower: prescription.prescriptionInfo[`add${side}`],
  //       refractiveIndexNameId: wkLopRefractiveIndexNameItemId,
  //       salesColorNameId: wkLopSalesColorNameItemId,
  //       salesLensSpecId: wkLopSalesLensSpecItemId,
  //       focusCategoryId: wkLopFocusCategoryItemId,
  //       progressiveCategoryId: wkLopProgressiveCategoryItemId,
  //       countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
  //       deletedGetFlag: false,
  //     };
  //   return lensUniqueAttributesGetRequest;   
  // };

  /**
   * 在庫取得
   * @param dpfmRequestInfo 
   * @param inventoriesGetRequest 
   * @returns 
   */
  private async getInventories (
    dpfmRequestInfo: DpfmRequestInfo,
    inventoriesGetRequest: InventoriesGetRequest,
  ): Promise<InventoriesGetResponse | undefined> {

    logger.info(`getInventoriesServerRequest : ${JSON.stringify(inventoriesGetRequest)}`);
    const apiResponse: ApiResponse<InventoriesGetResponse> = await sendApiRequest(
      getInventoriesServer,
      inventoriesGetRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`getInventoriesServerResponse : ${JSON.stringify(apiResponse)}`);

    return apiResponse.data;
  };

   /**
   * 保証情報取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param warrantyNumber 保証書番号
   */
   private async findWarrantyInfo (
    dpfmRequestInfo: DpfmRequestInfo,
    warrantyNumber: string | undefined,
  ): Promise<WarrantyInfo | undefined> {

    // 保証情報取得API呼出
    try{
      const findWarrantiesRequest: WarrantiesGetRequest = {
        warrantyNumber: String(warrantyNumber),
        deleteFlag : false,
      };
      logger.info(`getFindWarrantiesRequest: ${JSON.stringify(findWarrantiesRequest)}`);
      const apiResponse: ApiResponse<WarrantiesGetResponse> = await sendApiRequest(
        findWarranties,
        findWarrantiesRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );

      logger.info(`getFindWarrantiesResponse: ${JSON.stringify(apiResponse)}`);
      
      return apiResponse.data.warrantyInfo;

    } catch (error) {
      if (isNotFoundResponse(error)) {
        return undefined;
      }
      throw error;
    }
  };

  /**
   * 商品コード（レンズ左右）を取得
   * @param dpfmRequestInfo 
   * @param itemGroup - 商品グループ
   * @returns [左レンズ商品コード, 右レンズ商品コード]
   */
  // private async getLensCodes (
  //   dpfmRequestInfo: DpfmRequestInfo,
  //   itemGroup: itemGroupCompleteSet
  // ): Promise<[string | null, string | null]> {

  //   const [left_lens_code, right_lens_code] = [
  //     //itemGroup.lens～ItemCode;Cart情報にレンズ情報はこの段階では入っていません.
  //     //受取方法が決まる際、加工場所のレンズ在庫を元に優先順位を決めレンズが決まるため.
  //     await this.getLensCode(dpfmRequestInfo, itemGroup, "Left"),
  //     await this.getLensCode(dpfmRequestInfo, itemGroup, "Right"),
  //   ];
  //   logger.info(`getLensCodes return: ${JSON.stringify([left_lens_code, right_lens_code])}`);
  //   return [left_lens_code, right_lens_code];
  // };

  /**
   * 上記レンズ情報取得
   * @param dpfmRequestInfo 
   * @param itemGroup 
   * @param side 
   * @returns 
   */
  // private async getLensCode(
  //   dpfmRequestInfo: DpfmRequestInfo,
  //   itemGroup: itemGroupCompleteSet,
  //   side: string,
  // ): Promise<string | null> {
  //   logger.info(`getLensCode start side=[${side}]`);
  //   const result = await this.getLensUniqueAttributes(dpfmRequestInfo, itemGroup, side);
  //   if (result == null) {
  //     return null;
  //   }
  //   logger.info(`getLensCode return: ${JSON.stringify(result[0].itemCode ?? null)}`);
  //   return result[0].itemCode ?? null;
  // }

  /**
   * deliveryInfoセット
   * @param itemGroupCode - 商品グループコード
   * @param isProducible - 販売可否
   * @param isDeliverableToday - 当日受取可否
   * @param hasPul - PUL有無
   * @returns deliveryInfoデータ
   */
  private makeResponseData  (
    itemGroupCode: string,    // 商品グループコード
    isProducible: boolean,                // 販売可否
    isDeliverableToday: boolean,          // 当時受取可否
    hasPul: boolean                       // PUL有無
  ): DeliveryInfo {

    const responseData: DeliveryInfo = {
      itemGroupCode: itemGroupCode,
      isProducible: isProducible,
      isDeliverableToday: isDeliverableToday,
      hasPul: hasPul,
    };
    logger.info(`makeResponseData return: ${JSON.stringify(responseData)}`);
    return responseData;
  };

  /**
   * 在庫チェックの範囲指定
   * @param itemTypes 
   * @param frameCode 
   * @param caseCode 
   * @param lensCode1 
   * @param lensCode2 
   * @returns 
   */
  private getItemCodeList (
    itemTypes: string[] | undefined,
    frameCode: string | undefined | null,
    caseCode: string | undefined | null,
    lensCode1?: string | null,
    lensCode2?: string | null,
  ) {
    // 保証交換フラグにより在庫チェックのパラメタ切り替える
    const items: (string | undefined | null)[] = [];
    if (itemTypes == undefined){
      items.push(frameCode);
      items.push(caseCode);
      items.push(lensCode1);
      items.push(lensCode2);
    } else {
      if(itemTypes.includes(WarrantyItemType.FRAME)){
        items.push(frameCode);
      };
      if(itemTypes.includes(WarrantyItemType.LENS_LEFT) || itemTypes.includes(WarrantyItemType.LENS_RIGHT)){
        items.push(lensCode1);
        items.push(lensCode2);
      }
    }
    return items.filter((item): item is string => item != undefined);
  };

  /**
   * レスポンスデータセット
   * @param dpfmRequestInfo 
   * @param request 
   * @param itemGroup 
   * @param deliTodayFlag 当日受取可否フラグ(true 受取可)
   * @param hasPul        PUL有無フラグ(true PULあり)
   * @returns 
   */
  private async makeDeliveriesCheckData (
    dpfmRequestInfo: DpfmRequestInfo,
    request: operations['getDelivery']['parameters']['path'] & operations['getDelivery']['parameters']['query'],
    itemGroup: itemGroupCompleteSet,
    deliTodayFlag: boolean,
    hasPul: boolean,
  ): Promise<DeliveryInfo> {

    // 商品グループ情報取得
    const itemGroupCode = itemGroup.itemGroupCode!;
    const frameCode = itemGroup.frameItemCode;
    const caseCode = itemGroup.caseItemCode;

    // 保証交換フラグ
    const isWarrantyExchange = !!request.isWarrantyExchange;
    logger.info(`req.query.isWarrantyExchange ${isWarrantyExchange}`);
    // 保証情報取得
    const warrantyInfo = await this.findWarrantyInfo(dpfmRequestInfo, itemGroupCode);
    // 保証対象取得
    const itemTypes = isWarrantyExchange ? warrantyInfo?.warrantyItems?.map(w => w.itemType!) : undefined;
    logger.info(`itemTypes ${JSON.stringify(itemTypes)}`);

    if (InventoryCheck.execute) {
      // 
      // 在庫チェック呼出し
      const itemCodeExcludeLensLists = this.getItemCodeList(
        itemTypes,
        frameCode,
        caseCode,
      );
      logger.info(`itemCodeLists1 ${JSON.stringify(itemCodeExcludeLensLists)}`);
      const InventoriesGetRequest1: InventoriesGetRequest = {
        locationCodeList: [request.storeCode],
        itemCodeList: itemCodeExcludeLensLists,
        salesStatusIdList: [1], //NOTE: 「1:販売可」固定
        itemStatusIdList: [1],  //NOTE: 「1:良品」固定
      };
      const inventoriesServerData1 = 
        await this.getInventories(dpfmRequestInfo, InventoriesGetRequest1);
      if (inventoriesServerData1?.count == 0) {
        // 在庫なし
        return this.makeResponseData(itemGroupCode, false, false, hasPul);
      }
    }

    // レンズ情報取得
    // DJ36_STORE-168対応にてレンズ固有属性検索API呼出をオミット
    // const lensCodes: [string | null, string | null] = await this.getLensCodes(dpfmRequestInfo, itemGroup);
    // if (lensCodes.filter((lensCode) => lensCode != null).length != 2) {
    //   // レンズ1セット在庫なし（在庫がないので作成不可、当日受取不可）
    //   return this.makeResponseData(itemGroupCode, false, false, hasPul);
    // }
    const lensCodes: [string | null, string | null] = [null, null];

    // 販売可否判定
    //   保証交換以外：フレーム、ケース、レンズが1セットで揃っている
    //   保証交換：フレーム、またはレンズの在庫がある
    let isProducible: boolean = true;
    let isDeliverableToday: boolean = deliTodayFlag;
    if (InventoryCheck.execute) {
    // レンズ情報含め在庫チェック呼出し
      const itemCodeLists = this.getItemCodeList(
        itemTypes,
        frameCode,
        caseCode,
        lensCodes[0],
        lensCodes[1],
      );
      logger.info(`itemCodeLists2 ${JSON.stringify(itemCodeLists)}`);
      const InventoriesGetRequest2: InventoriesGetRequest = {
        locationCodeList: [request.storeCode],
        itemCodeList: itemCodeLists,
        salesStatusIdList: [1], //NOTE: 「1:販売可」固定
        itemStatusIdList: [1],  //NOTE: 「1:良品」固定
      };

      isProducible = false;
      const inventoriesServerData2 = 
        await this.getInventories(dpfmRequestInfo, InventoriesGetRequest2);
      logger.info(`inventoriesServerData2?.count ${inventoriesServerData2?.count}`);
      if (inventoriesServerData2?.count == 0) {
        // 在庫なし
        // （在庫がないため、販売可否(isProducible)=false、当日受取可否(isDeliverableToday)=false）
        return this.makeResponseData(itemGroupCode, false, false, hasPul);
      }
      const records = inventoriesServerData2?.records;
      logger.info(`records ${JSON.stringify(records)}`);
      if (records == undefined) {
        // 在庫なし
        // （在庫がないため、販売可否(isProducible)=false、当日受取可否(isDeliverableToday)=false）
        return this.makeResponseData(itemGroupCode, false, false, hasPul);
      }
      logger.info(`records ${JSON.stringify(records)}`);
      logger.info(`records.length ${JSON.stringify(records.length)}`);
      logger.info(`itemCodeLists ${JSON.stringify(itemCodeLists)}`);
      const itemCodeListsLen: string[] = itemCodeLists;
      if (records.length == itemCodeListsLen.length) {
        // 在庫チェックで在庫データ数と、実際に在庫チェックをかけた商品の数が一致していた場合
        // 在庫数が0、または未設定の場合は作成不可
        isProducible = true;
        for(const record of records) {
          logger.info(`isProducible inventoryQuantity  ${JSON.stringify(record.inventoryQuantity)}`);
          if (record.inventoryQuantity == undefined || record.inventoryQuantity <= 0) {
            // 在庫数 未設定、または在庫数0以下
            isProducible = false;
            break;
          }
        }
      }
      if (!isProducible) {
        // 在庫がないなら当日受取はできないため
        isProducible = false;
        isDeliverableToday = false;
      }
    }

    return this.makeResponseData(itemGroupCode, isProducible, isDeliverableToday, hasPul);
  };

  /**
   * 受取方法チェック処理(main)
   * @param req - Request
   * @param res - Response
   * @param next - NextFunction
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dpfmRequestInfo = generateDpfmRequestInfo(req);
      const path = req.params as operations['getDelivery']['parameters']['path'];
      const query: operations['getDelivery']['parameters']['query'] = req.query

      // 1.カート情報の取得
      const cart = await this.getCart(dpfmRequestInfo, path.receptionNumber);
      if (cart?.itemGroups == undefined) {
        logger.info(`cartGetResponseData.cart.itemGroups undefined`);
        throw new ResourceNotFoundError("The cartGetResponseData.cart.itemGroups is required.");
      };

      // 2.PUL情報の取得判定
      const storesAttribute = await this.getStoreAttribute(dpfmRequestInfo, path.storeCode);
      const hasPul = !!storesAttribute?.pickupLockerHoldingFlag;

      // 3.加工終了日の取得判定
      const callManagement = await this.getCallManagement(dpfmRequestInfo, path.storeCode);
      const processingCloseTime = callManagement?.processingCloseTime;
      // 時間の妥当性チェック
      const deliTodayFlag = processingCloseTime ? this.isReceipt(getTimeOfToday(processingCloseTime, getStoreTimeZone(req))) : false;
 
      // 4.在庫情報の取得①、5.レンズ商品コードの取得、6.在庫情報の取得②
      const deliveriesCheckDataList: DeliveryInfo[] = await Promise.all(
        cart.itemGroups.map(async (itemGroup) => {
          const suiteNo = itemGroup.itemGroupCode?.replace(/.*-/, "");
          const dpfmRequestInfo = generateDpfmRequestInfo(req, suiteNo);
          return await this.makeDeliveriesCheckData(dpfmRequestInfo, {...path, ...query }, itemGroup, deliTodayFlag, hasPul);
        })
      );

      const deliveryCheckResponseData: components["schemas"]["DeliveryResponse"] = {
        deliveryInfo: deliveriesCheckDataList
      }
      logger.info(`return deliveriesCheck ${JSON.stringify(deliveryCheckResponseData)}`);
      res.status(200).json(deliveryCheckResponseData);
      return;
    } catch (error) {
      next(error);
    }
    return;
  };
}
