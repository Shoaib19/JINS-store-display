import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IPrescriptionsInfoPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { getPrescriptionServer } from "~/src/clients/carts/cartsClient";
import { sendApiRequest } from "~/src/utils/fetchService";
import { ApiResponse } from "openapi-typescript-fetch";
import { PrescriptionGetRequest, PrescriptionGetResponse } from "~/src/clients/carts/cartsClientTypes";
import { generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";
import { COUNTRY_CODE_ALPHA2 } from "~/src/components/const";

/**
 * 処方箋画像取得処理
 */
@injectable()
export class PrescriptionsInfoPresenter implements IPrescriptionsInfoPresenter {
  /**
   * 処方箋画像取得処理
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

      const prescriptionGetRequest: PrescriptionGetRequest = {
        itemGroupCode: req.params.prescriptionId,
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
      }
      logger.info(`getPrescriptionServerRequest: ${JSON.stringify(prescriptionGetRequest)}`);

      // デジタル基盤層APIを呼び出す
      const apiResponse: ApiResponse<PrescriptionGetResponse> = await sendApiRequest(
        getPrescriptionServer,
        prescriptionGetRequest,
        makeDpfmRequestHeader(dpfmRequestInfo),
        process.env.CART_SERVICE_JP
      );

      logger.info(`getPrescriptionServerResponse: ${JSON.stringify(apiResponse,
       (key, value) => {
        if (key === "data" && typeof value === "string") {
            return `${value.slice(0,32)}...(${value.length}byte)`;
        }
        return value;
      })}`);

      res.status(200).send(apiResponse.data);

      return;
    } catch (error) {
      next(error);
    }
  };
}
