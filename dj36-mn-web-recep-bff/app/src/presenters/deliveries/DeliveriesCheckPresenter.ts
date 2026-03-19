import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { IDeliveriesCheckPresenter } from "~/src/presenters/interfaces";

import { getInventoriesServer } from "~/src/clients/inventories/inventoriesClient";
import { operations as inventriesOperations } from "~/src/interfaces/clients/inventories/inventoriesClient";
import { getLensUniqueAttributes } from "~/src/clients/items/itemsClient";
import { operations as itemsOperations } from "~/src/interfaces/clients/items/itemsClient";
import {
  operations as cartsOperations,
  components as cartsComponents,
} from "~/src/interfaces/clients/carts/cartsClient";
import { getCartInfo ,getCallManagement } from "~/src/clients/carts/cartsClient";
import { getStoreAttributes } from "~/src/clients/locations/locationsClient";
import {
  GetStoreAttributesQuery,
  GetStoreAttributesResponse
} from "~/src/clients/locations/locationsClientTypes";
import { COUNTRY_CODE_ALPHA2, customerStaffId } from "~/src/compornents/const";
import {
  isBefore,
} from "~/src/utils/datetimeUtils";
import { getTimeOfToday } from "~/src/utils/datetimeUtils";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";

// jins-trace-id-branch-no用定数
class BranchNo {
  static readonly orderInfo:          string = "1";
  static readonly storeInfo:          string = "2";
  static readonly callManagementInfo: string = "3";
  static readonly inventoriesInfo1:   string = "4";
  static readonly lensInfo:           string = "5";
  static readonly inventoriesInfo2:   string = "6";
};

//TODO: define from oas
interface DeliveryInfo {
  itemGroupCode?: string;
  isProducible?: boolean;
  isDeliverableToday?: boolean;
  hasPul?: boolean;
}
interface DeliveryCheckResponse {
  deliveryInfo: DeliveryInfo[]
}

/**
 * 受取方法チェックAPI
 */
@injectable()
export class DeliveriesCheckPresenter
  extends BasePresenter
  implements IDeliveriesCheckPresenter
{
  /**
   * 商品コード（レンズ左or右）を取得
   * @param req - Request
   * @param itemGroup - 商品グループ
   * @param side - 左右どちらか
   * @returns 商品コード（レンズ左or右）
   */
  getLensCode = async (
    req: Request,
    itemGroup: cartsComponents["schemas"]["itemGroupCompleteSet"],
    side: string
  ): Promise<string | null> => {
    const requestHeader = this.makeRequestHeader(req);
    if (!itemGroup.registeredPreparation1
      || (!itemGroup.lopRefractiveIndexNameItemId
        && !itemGroup.lopSalesColorNameItemId
        && !itemGroup.lopSalesLensSpecItemId
        && !itemGroup.lopFocusCategoryItemId
        && !itemGroup.lopProgressiveCategoryItemId
      )
    ) {
      return null;
    }

    //NOTE: The prescription info and the lens options are included in preparation1, 2.
    const prescription = JSON.parse(itemGroup.registeredPreparation1);
    const lensUniqueAttributesGetRequest: itemsOperations["getLensUniqueAttributes"]["parameters"]["query"] =
      {
        sphericalPower: prescription.prescriptionInfo[`sph${side}`],
        astigmatismPrescription: prescription.prescriptionInfo[`cyl${side}`],
        addPower: prescription.prescriptionInfo[`add${side}`],
        refractiveIndexNameId: itemGroup.lopRefractiveIndexNameItemId
          ? itemGroup.lopRefractiveIndexNameItemId
          : undefined,
        salesColorNameId: itemGroup.lopSalesColorNameItemId
          ? itemGroup.lopSalesColorNameItemId
          : undefined,
        salesLensSpecId: itemGroup.lopSalesLensSpecItemId
          ? itemGroup.lopSalesLensSpecItemId
          : undefined,
        focusCategoryId: itemGroup.lopFocusCategoryItemId
          ? itemGroup.lopFocusCategoryItemId
          : undefined,
        progressiveCategoryId: itemGroup.lopProgressiveCategoryItemId
          ? itemGroup.lopProgressiveCategoryItemId
          : undefined,
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
        deletedGetFlag: false,
      };

    logger.info(`lensUniqueAttributesGetRequest: ${JSON.stringify(lensUniqueAttributesGetRequest)}`);

    requestHeader.set("jins-trace-id-branch-no", BranchNo.lensInfo);
    logger.info(`requestHeader: ${JSON.stringify(requestHeader.get("jins-trace-id-branch-no"))}`);
    const lensUniqueAttributesGetResponse = await sendApiRequest(
      getLensUniqueAttributes,
      lensUniqueAttributesGetRequest,
      requestHeader
    );

    logger.info(`lensUniqueAttributesGetResponse: ${JSON.stringify(lensUniqueAttributesGetResponse)}`);

    if (!lensUniqueAttributesGetResponse.ok) {
      throw lensUniqueAttributesGetResponse;
    }

    const records = lensUniqueAttributesGetResponse.data.records;
    if (!records || records.length == 0) {
      return null;
    }
    return records[0].itemCode;
  };

  /**
   * 商品コード（レンズ左右）を取得
   * @param req - リクエスト
   * @param itemGroup - 商品グループ
   * @returns [左レンズ商品コード, 右レンズ商品コード]
   */
  getLensCodes = async (
    req: Request,
    itemGroup: cartsComponents["schemas"]["itemGroupCompleteSet"]
  ): Promise<[string | null, string | null]> => {
    const [left_lens_code, right_lens_code] = await Promise.all([
      this.getLensCode(req, itemGroup, "Left"), //itemGroup.lensLeftItemCode;Cart情報にレンズ情報はこの段階では入っていません. なぜならば、受取方法が決まる際に、加工場所のレンズ在庫を元に優先順位を決めレンズが決まるからです
      this.getLensCode(req, itemGroup, "Right") //itemGroup.lensRightItemCode;Cart情報にレンズ情報はこの段階では入っていません. なぜならば、受取方法が決まる際に、加工場所のレンズ在庫を元に優先順位を決めレンズが決まるからです
    ])
    return [left_lens_code, right_lens_code];
  };

  /**
   * deliveryInfoセット
   * @param itemGroupCode - 商品グループコード
   * @param isProducible - 販売可否
   * @param isDeliverableToday - 当日受取可否
   * @param hasPul - PUL有無
   * @returns deliveryInfoデータ
   */
  makeResponseData = (
    itemGroupCode: string | undefined,
    isProducible: boolean,
    isDeliverableToday: boolean,
    hasPul: boolean
  ): DeliveryInfo => {
    const responseData = {
      itemGroupCode: itemGroupCode,
      isProducible: isProducible,
      isDeliverableToday: isDeliverableToday,
      hasPul: hasPul,
    };
    return responseData;
  };

  /**
   * レスポンスデータセット
   * @param req - リクエスト
   * @param itemGroup - 商品グループ
   * @returns deliveryInfoレスポンスデータ
   */
  makeDeliveriesCheckData = async (
    req: Request,
    itemGroup: cartsComponents["schemas"]["itemGroupCompleteSet"],
    cartCnt: number,
    hasPul: boolean,
    deliTodayFlag: boolean,
  ): Promise<DeliveryInfo> => {
    const frameCode: string | undefined = itemGroup.frameItemCode??undefined;
    const caseCode: string | undefined = itemGroup.caseItemCode??undefined;
    const itemGroupCode: string | undefined = itemGroup.itemGroupCode;

    const itemCodeListAll = [frameCode, caseCode].filter((item): item is string => typeof item == 'string')

    interface AllInventoriesRequestType {
      locationCodeList?: string;
      itemCodeList: string;
      salesStatusIdList: number;
      itemStatusIdList: number;
    }

    const allInventoriesGetRequest: AllInventoriesRequestType = {
      locationCodeList: req.params.storeCode, //NOTE: req.params.storeCode
      itemCodeList: itemCodeListAll.join(), //REVIEW: itemCodeList?itemIdList?
      salesStatusIdList: 1, //NOTE: 「1:販売可」に固定
      itemStatusIdList: 1, //NOTE: 「1:良品」に固定
    };
    const requestHeader = this.makeRequestHeader(req);

    logger.info(`allInventoriesGetRequest: ${JSON.stringify(allInventoriesGetRequest)}`);

    // requestHeader.set("jins-trace-id-branch-no", BranchNo.inventoriesInfo1 + "-" + cartCnt);
    // logger.info(`requestHeader: ${JSON.stringify(requestHeader.get("jins-trace-id-branch-no"))}`);
    // const allInventoriesGetResponse = await sendApiRequest(
    //   getInventoriesServer,
    //   allInventoriesGetRequest,
    //   requestHeader,
    // );

    // logger.info(`allInventoriesGetResponse: ${JSON.stringify(allInventoriesGetResponse)}`);

    // if (!allInventoriesGetResponse.ok) {
    //   throw allInventoriesGetResponse;
    // }

    // logger.info(`allInventoriesGetResponse.data.count: ${JSON.stringify(allInventoriesGetResponse.data.count)}`);
    // if (allInventoriesGetResponse.data.count == 0) {
    //   return this.makeResponseData(itemGroupCode, false, false, hasPul);
    // }

    const lensCodes = await this.getLensCodes(req, itemGroup);
    logger.info(`lensCodes: ${JSON.stringify(lensCodes)}`);

    if (lensCodes.filter((lensCode) => lensCode != null).length != 2) {
      //REVIEW: if lens don't exist, what value should we return?
      return this.makeResponseData(itemGroupCode, false, false, hasPul);
    }

    const itemCodes: (string | undefined)[] = [
      frameCode,
      caseCode,
      lensCodes[0]!,
      lensCodes[1]!,
    ];
    const itemCodeList = itemCodes.filter((item): item is string => typeof item == 'string')

    const inventoriesStoreGetRequest: AllInventoriesRequestType = {
      locationCodeList: req.params.storeCode, //NOTE: req.params.storeCode
      itemCodeList: itemCodeList.join(), //REVIEW: itemCodeList?itemIdList?
      salesStatusIdList: 1, //NOTE: 「1:販売可」に固定
      itemStatusIdList: 1, //NOTE: 「1:良品」に固定
    };

    logger.info(`inventoriesStoreGetRequest: ${JSON.stringify(inventoriesStoreGetRequest)}`);

    // requestHeader.set("jins-trace-id-branch-no", BranchNo.inventoriesInfo2 + "-" + cartCnt);
    // logger.info(`requestHeader: ${JSON.stringify(requestHeader.get("jins-trace-id-branch-no"))}`);
    // const inventoriesStoreGetResponse = await sendApiRequest(
    //   getInventoriesServer,
    //   inventoriesStoreGetRequest,
    //   requestHeader,
    // );

    // logger.info(`inventoriesStoreGetResponse: ${JSON.stringify(inventoriesStoreGetResponse)}`);

    // if (!inventoriesStoreGetResponse.ok) {
    //   throw inventoriesStoreGetResponse;
    // }

    // const records: inventriesOperations["getInventories"]["responses"]["200"]["content"]["application/json"]["records"] =
    // inventoriesStoreGetResponse.data.records;
    // if (records == undefined) {
    //   return this.makeResponseData(itemGroupCode, false, false, hasPul);
    // } else {
    //   if (records.length == itemCodeList?.length) {
    //     const enoughQuantityItems = records.filter((record) => {
    //       if (record.inventoryQuantity == undefined) {
    //         return false;
    //       }
    //       return record.inventoryQuantity > 0;
    //     });
    //     if (enoughQuantityItems.length == records.length) {
          if (deliTodayFlag) {
            // 加工終了時間以内
            return this.makeResponseData(itemGroupCode, true, true, hasPul);
          } else {
            // 加工終了時間超過
            return this.makeResponseData(itemGroupCode, true, false, hasPul);
          }
    //     }
    //     return this.makeResponseData(itemGroupCode, true, false, hasPul);
    //   } else {
    //     return this.makeResponseData(itemGroupCode, false, false, hasPul);
    //   }
        // return this.makeResponseData(itemGroupCode, true, false, hasPul);
    }

  /**
   * リクエストヘッダーセット
   * @param req - リクエスト
   * @returns ヘッダー情報
   */
  makeRequestHeader = (req: Request): Headers => {
    const cursor = req.header("x-cursor");
    const requestHeader: HeadersInit = new Headers();
    requestHeader.set("Accept", req.header("accept") ?? "");
    requestHeader.set("Accept-Language", req.header("accept-language") ?? "");
    requestHeader.set("Content-Type", req.header("content-type") ?? "");
    requestHeader.set("Authorization", req.header("authorization") ?? "");
    requestHeader.set("X-API-KEY", process.env.CRM_API_KEY ?? "");
    requestHeader.set("jins-trace-id", req.header("jins-trace-id") ?? "");
    requestHeader.set("jins-trace-id-branch-no", "");
    requestHeader.set("jins-user-id", req.header("staffID") ?? customerStaffId);
    if (cursor) {
      requestHeader.set("X-Cursor", cursor);
    }
    return requestHeader;
  };

  /**
   * 受取方法チェック処理
   * @param req - Request
   * @param res - Response
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // NOTE: If you request, the apiVersion property is required.
      const cartGetRequest: cartsOperations["findCart"]["parameters"]["query"] = {
        receptionNumber: req.params.receptionNumber,
        deleteFlag: false
      };

      logger.info(`cartGetRequest: ${JSON.stringify(cartGetRequest)}`);

      //TODO: type annotation
      const requestHeader = this.makeRequestHeader(req);
      requestHeader.set("jins-trace-id-branch-no", BranchNo.orderInfo);
      logger.info(`requestHeader: ${JSON.stringify(requestHeader.get("jins-trace-id-branch-no"))}`);
      const cartGetResponse = await sendApiRequest(
        getCartInfo,
        cartGetRequest,
        requestHeader
      );

      logger.info(`cartGetResponses: ${JSON.stringify(cartGetResponse)}`);

      if (!cartGetResponse.ok) {
        throw cartGetResponse;
      }
      const cartGetResponsData: cartsComponents["schemas"]["CartResponse"] =
      cartGetResponse.data;

      if (cartGetResponsData.cart?.itemGroups == undefined) {
        res.status(404).json({
          "Jins-Trace-ID": req.header("jins-trace-id"),
          timestamp: new Date().toISOString(),
          systemName: "DJ36-Sales",
          code: "COM_0004",
          message: "Specified data not found.",
          details: "The cartGetResponsData.cart.itemGroups is requied.",
        });
        return;
      }

      interface Parameters {
        storeCode: string;
      }
      const locationGetRequest: Parameters = {
        storeCode: req.params.storeCode,
      };
    const query: GetStoreAttributesQuery = {
      locationCodeList: [req.params.storeCode]
    };
    const request = {
      ...query
    };
      logger.info(`locationGetRequest: ${JSON.stringify(request)}`);



      /*
       *２.PUL情報の取得判定
       */
      // 店舗属性マスタ検索APIを呼び出して、PUL有無情報を取得する
      requestHeader.set("jins-trace-id-branch-no", BranchNo.storeInfo);
      logger.info(`requestHeader: ${JSON.stringify(requestHeader.get("jins-trace-id-branch-no"))}`);
      const storeAttrGetResponse = await sendApiRequest(
        getStoreAttributes,
        request,
        requestHeader
      );
      logger.info(`storeAttrGetResponse: ${JSON.stringify(storeAttrGetResponse)}`);

      if (!storeAttrGetResponse.ok) {
        throw storeAttrGetResponse;
      };
      const storeAttributesGetResponseData = storeAttrGetResponse.data.records[0];
      const hasPul = Boolean(storeAttributesGetResponseData.pickupLockerHoldingFlag);
      logger.info(`hasPul: ${JSON.stringify(hasPul)}`);

      /*
       *３.加工終了日の取得判定
       */
      // 呼出し管理情報取得APIを呼び出して、加工終了時間を取得する
      requestHeader.set("jins-trace-id-branch-no", BranchNo.callManagementInfo);
      logger.info(`requestHeader: ${JSON.stringify(requestHeader.get("jins-trace-id-branch-no"))}`);
      const callMngGetResponse = await sendApiRequest(
        getCallManagement,
        locationGetRequest,
        requestHeader
      );
      logger.info(`callMngGetResponse: ${JSON.stringify(callMngGetResponse)}`);

      if (!callMngGetResponse.ok) {
        throw callMngGetResponse;
      };

      const callMngGetResponseData = callMngGetResponse.data.callManagementInfo;
      const processingCloseTime = callMngGetResponseData.processingCloseTime;
      const cstProcessingCloseTime = getTimeOfToday(processingCloseTime, getStoreTimeZone(req));
      logger.info(`@cstProcessingCloseTime : ${JSON.stringify(cstProcessingCloseTime)}`);
      // 現時刻が加工時間より小さい場合、当日受取可能(true)
      const deliTodayFlag = cstProcessingCloseTime ? isBefore(new Date(), cstProcessingCloseTime) : true;
      logger.info(`@deliTodayFlag[Sys<Proc]: ${JSON.stringify(deliTodayFlag)}`);


      /*
       * ４.在庫情報の取得①、５.レンズ商品コードの取得、６.在庫情報の取得②
       */
      const itemGroups: cartsComponents["schemas"]["itemGroupCompleteSet"][] =
        cartGetResponsData.cart?.itemGroups;

      let cartCnt: number = 0;
      const deliveriesCheckDataList = await Promise.all(
        itemGroups.map(async (itemGroup) => {
          cartCnt++;
          return await this.makeDeliveriesCheckData(req, itemGroup, cartCnt, hasPul, deliTodayFlag);
        })
      );

      const deliveryCheckResponseData: DeliveryCheckResponse = {
        deliveryInfo: deliveriesCheckDataList
      }

      res.status(200).json(deliveryCheckResponseData);
      return;

    } catch (error: any) {
      if(error.status === 404){
        res.status(400).send(error.data);
      }else{
        res.status(error.status).json(error.data);
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };
}
