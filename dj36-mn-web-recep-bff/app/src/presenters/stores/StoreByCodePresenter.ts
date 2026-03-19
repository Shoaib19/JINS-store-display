import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IStoreByCodePresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import {
  getStoreAttributes,
  getStoreLocations,
} from "~/src/clients/locations/locationsClient";
import { sendApiRequest } from "~/src/utils/fetchService";
import { customerStaffId } from "~/src/compornents/const";
import { components } from "~/src/interfaces/root";
import {
  GetStoreAttributesQuery,
  LocationsGetResponse,
  GetStoreAttributesResponse
} from "~/src/clients/locations/locationsClientTypes";

/**
 * 店舗情報取得処理
 */
@injectable()
export class StoreByCodePresenter
  extends BasePresenter
  implements IStoreByCodePresenter
{
  /**
   * 店舗情報取得処理
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
      const cursor = req.header("x-cursor");

      const requestHeader: HeadersInit = new Headers();
      requestHeader.set("Accept", req.header("accept") ?? "");
      requestHeader.set("Accept-Language", req.header("accept-language") ?? "");
      requestHeader.set("Content-Type", req.header("content-type") ?? "");
      requestHeader.set("Authorization", req.header("authorization") ?? "");
      requestHeader.set("X-API-KEY", process.env.CRM_API_KEY ?? "");
      requestHeader.set("jins-trace-id", req.header("jins-trace-id") ?? "");
      requestHeader.set("jins-user-id", req.header("staffID") ?? customerStaffId);
      if (cursor) {
        requestHeader.set("X-Cursor", cursor);
      }

      // interface Parameters {
      //   storeCode: string;
      // }

      // // TODO: oasのクラス定義で設定
      // const locationGetRequest: Parameters = {
      //   storeCode: req.params.storeCode,
      // };
    const query: GetStoreAttributesQuery = {
      locationCodeList: [req.params.storeCode]
    };
    const request = {
      ...query
    };

      logger.info(`locationGetRequest: ${JSON.stringify(request)}`);

      // デジタル基盤層（ロケーションマスタ検索）APIを呼び出す
      const locationGetResponse = await sendApiRequest(getStoreLocations, request, requestHeader);

      logger.info(`locationGetResponse: ${JSON.stringify(locationGetResponse)}`);

      if (!locationGetResponse.ok) {
        throw locationGetResponse;
      }

      const locationGetResponseRecords: LocationsGetResponse = locationGetResponse?.data;

      const locationGetResponseData = locationGetResponseRecords?.records?.at(0);

      // デジタル基盤層（店舗属性マスタ検索）APIを呼び出す
      const storeAttributesGetResponse = await sendApiRequest(getStoreAttributes, request, requestHeader);

      logger.info(`storeAttributesGetResponse: ${JSON.stringify(storeAttributesGetResponse)}`);

      if (!storeAttributesGetResponse.ok) {
        throw storeAttributesGetResponse;
      }
      
      const storeAttributesGetResponseRecords: GetStoreAttributesResponse = storeAttributesGetResponse.data;

      const storeAttributesGetResponseData = storeAttributesGetResponseRecords.records?.at(0);


      // レスポンスデータ加工
      const data: components["schemas"]["StoreInfoResponse"] = {
        storeCode: locationGetResponseData?.locationCode,
        storeName: locationGetResponseData?.locationName,
        storeTypeCode: locationGetResponseData?.locationMinorClass?.locationMinorClassCode,
        storeType: locationGetResponseData?.locationMinorClass?.locationMinorClassName,
        hasPul: Boolean(storeAttributesGetResponseData?.pickupLockerHoldingFlag),
        storeLatitude: locationGetResponseData?.latitude?? undefined,
        storeLongitude: locationGetResponseData?.longitude?? undefined,
        storeTimezone: locationGetResponseData?.timezone?? undefined,
      };

      res.status(200).send(data);
      return;
    } catch (error: any) {
      if (error.status === 404){
        res.status(400).send(error.data);
      }else{
        res.status(error.status).json(error.data);
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };
}
