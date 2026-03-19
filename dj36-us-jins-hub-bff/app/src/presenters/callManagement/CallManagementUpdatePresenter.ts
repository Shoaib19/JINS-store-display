import { Request, Response, NextFunction } from "express";

import { injectable } from "inversify";
import type { ICallManagementUpdatePresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { putCallManagement } from "~/src/clients/carts/cartsClient";

import dotenv from "dotenv";
import { sendApiRequest } from "~/src/utils/fetchService";
import { CallManagementPutRequest } from "~/src/clients/carts/cartsClientTypes";
import { generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";
import { components, operations } from "~/src/interfaces/root";
import { ApiResponse } from "openapi-typescript-fetch";

dotenv.config();

/**
 * 呼出し管理情報登録
 */
@injectable()
export class CallManagementUpdatePresenter implements ICallManagementUpdatePresenter {
  /**
   * 呼出し管理情報登録API
   * @param req - Request
   * @param res - Response
   * @param next - NextFunction
   * @returns Promise<void>
   */
  public show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dpfmRequestInfo = generateDpfmRequestInfo(req);
      const path = req.params as operations['putCallManagement']['parameters']['path'];
      const body: components['schemas']['CallManagementPutRequest'] = req.body;

      // 呼出し管理情報登録API 呼出し
      const callManagementPutRequest: CallManagementPutRequest = {
        storeCode: path.storeCode,
        timeRequiredUntilCall: body.timeRequiredUntilCall,
        availableLines: body.availableLines,
        lineSettings: body.lineSettings
          ? [
              {
                startTime: "00:00:00",
                availableLines: body.openingHourAvailableLines,
              },
              ...body.lineSettings,
            ]
          : undefined,
        receptionCloseTime: body.receptionCloseTime,
        processingCloseTime: body.processingCloseTime,
        inStockLensPickupTime: body.inStockLensPickupTime,
        awaitingDeliveryLensPickupTime: body.awaitingDeliveryLensPickupTime,
      };

      logger.info(`putCallManagementRequest: ${JSON.stringify(callManagementPutRequest)}`);

      const apiResponse: ApiResponse<unknown> = await sendApiRequest(
        putCallManagement,
        callManagementPutRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );

      logger.info(`putCallManagementResponse: ${JSON.stringify(apiResponse)}`);
      res.status(200).send();

      return;
    } catch (error) {
      next(error);
    }
  };
}
