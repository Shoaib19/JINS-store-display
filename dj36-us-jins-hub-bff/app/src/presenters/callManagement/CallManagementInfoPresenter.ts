import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { ICallManagementInfoPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import {
  getCallManagement,
} from "~/src/clients/carts/cartsClient";
import { sendApiRequest } from "~/src/utils/fetchService";
import { components, operations } from "~/src/interfaces/root";
import { CallManagementGetRequest, CallManagementGetResponse, CallManagementInfo } from "~/src/clients/carts/cartsClientTypes";
import { ApiResponse } from "openapi-typescript-fetch";
import { DpfmRequestInfo, generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";
import { isNotFoundResponse } from "~/src/components/errors";

type CallManagementInfoResponse = components["schemas"]["CallManagementInfoResponse"];

/**
 * 呼出し管理情報取得API
 */
@injectable()
export class CallManagementInfoPresenter implements ICallManagementInfoPresenter {
  /**
   * 呼出し管理情報取得処理
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
      const path = req.params as operations['getCallManagement']['parameters']['path'];

      // 呼び出し管理情報取得
      const callManagementInfo = await this.getCallManagementInfo(dpfmRequestInfo, path.storeCode);

      const data: CallManagementInfoResponse = {
        timeRequiredUntilCall: callManagementInfo?.timeRequiredUntilCall ?? null,
        availableLines: callManagementInfo?.availableLines ?? null,
        openingHourAvailableLines: callManagementInfo?.lineSettings?.at(0)?.availableLines ?? null,
        lineSettings: callManagementInfo?.lineSettings?.slice(1),
        receptionCloseTime: callManagementInfo?.receptionCloseTime ?? null,
        processingCloseTime: callManagementInfo?.processingCloseTime ?? null,
        inStockLensPickupTime: callManagementInfo?.inStockLensPickupTime ?? null,
        awaitingDeliveryLensPickupTime: callManagementInfo?.awaitingDeliveryLensPickupTime ?? null
      };
      logger.info(`data: ${JSON.stringify(data)}`);
      res.status(200).send(data);

    } catch (error) {
      next(error);
    }
  };

  /**
   * 呼び出し管理情報取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @returns 呼び出し管理情報 | undefined
   */
  private getCallManagementInfo = async(
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string
  ): Promise<CallManagementInfo| undefined> => {
    try {
      // リクエストパラメタから店舗CDを取得
      const callManagementInfoGetRequest: CallManagementGetRequest = {
        storeCode: storeCode,
      };
      logger.info(`getCallManagementInfoRequest: ${JSON.stringify(callManagementInfoGetRequest)}`);

      // デジタル基盤層: 呼出し管理情報取得を呼び出す
      const apiResponse: ApiResponse<CallManagementGetResponse> =
        await sendApiRequest(
          getCallManagement,
          callManagementInfoGetRequest,
          makeDpfmRequestHeader(dpfmRequestInfo)
        );
      logger.info(`getCallManagementInfoResponse: ${JSON.stringify(apiResponse)}`);

      return apiResponse.data.callManagementInfo;
    } catch (error) {
      if (isNotFoundResponse(error)) {
        return undefined;
      }
      throw error;
    }
  } 
}
