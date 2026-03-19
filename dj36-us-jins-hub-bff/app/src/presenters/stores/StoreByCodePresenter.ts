import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IStoreByCodePresenter } from "~/src/presenters/interfaces";
import { logger } from "~/src/logging/logger";
import {
  getStoreAttributes,
  getStoreLocations,
} from "~/src/clients/locations/locationsClient";
import { components, operations } from "~/src/interfaces/root";
import {
  StoreAttributesGetRequest,
  LocationsGetRequest,
  LocationsGetResponse,
  StoreAttributesGetResponse
} from "~/src/clients/locations/locationsClientTypes";
import { ApiResponse } from "openapi-typescript-fetch";
import { sendApiRequest } from "~/src/utils/fetchService";
import { DpfmRequestInfo,generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";

/**
 * 店舗情報取得処理
 */
@injectable()
export class StoreByCodePresenter
  implements IStoreByCodePresenter
{
  /**
   * 店舗情報取得処理
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
      const path = req.params as operations['getStoreByCode']['parameters']['path'];

      //店舗のロケーションを取得するメソッドの呼び出し
      const locationGetResponseData = await this.getLocations(
        dpfmRequestInfo,
        path.storeCode,
      );
      //店舗属性を取得するメソッドの呼び出し
      const storeAttributesGetResponseData = await this.getStoreAttributes(    
        dpfmRequestInfo,
        path.storeCode,
      )

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
    } catch (error) {
      next(error);
    }
  };
    /**
   * 店舗コードから店舗のロケーションを取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @returns 店舗のロケーション | undefined
   */
    private async getLocations(
      dpfmRequestInfo: DpfmRequestInfo,
      storeCode: string)
      {
        // デジタル基盤層（ロケーションマスタ検索）APIを呼び出す
        const locationRequest: LocationsGetRequest = {
          locationCodeList: [storeCode]
        };
        logger.info(`getStoreLocationsRequest: ${JSON.stringify(locationRequest)}`);
        const locationGetResponse : ApiResponse<LocationsGetResponse> = await sendApiRequest(
          getStoreLocations, 
          locationRequest,
          makeDpfmRequestHeader(dpfmRequestInfo)
        );
        logger.info(
          `getStoreLocationsResponse: ${JSON.stringify(locationGetResponse)}`
        );
        const locationGetResponseRecords = locationGetResponse?.data;
        const locationGetResponseData = locationGetResponseRecords?.records?.at(0);
        return locationGetResponseData;
      }

   /**
   * 店舗コードから店舗属性マスタを取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @returns 店舗属性マスタ | undefined
   */
    private async getStoreAttributes(
      dpfmRequestInfo: DpfmRequestInfo,
      storeCode: string)
      {
        // デジタル基盤層（店舗属性マスタ検索）APIを呼び出す
        const storeAttributesRequest: StoreAttributesGetRequest = {
          locationCodeList: [storeCode]
        };
        logger.info(`getStoreAttributesRequest: ${JSON.stringify(storeAttributesRequest)}`);
        const storeAttributesGetResponse : ApiResponse<StoreAttributesGetResponse> = await sendApiRequest(
          getStoreAttributes,
          storeAttributesRequest,
          makeDpfmRequestHeader(dpfmRequestInfo)
        );
        logger.info(
          `getStoreAttributesResponse: ${JSON.stringify(storeAttributesGetResponse)}`
        );
        const storeAttributesGetResponseRecords = storeAttributesGetResponse.data;
        const storeAttributesGetResponseData = storeAttributesGetResponseRecords.records?.at(0);
        return storeAttributesGetResponseData;
      }
    };