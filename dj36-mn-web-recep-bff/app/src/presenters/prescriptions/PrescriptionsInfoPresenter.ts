import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IPrescriptionsInfoPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { getPrescriptionServer } from "~/src/clients/carts/cartsClient";
import { sendApiRequest } from "~/src/utils/fetchService";
import { customerStaffId } from "~/src/compornents/const";

/**
 * 処方箋画像取得処理
 */
@injectable()
export class PrescriptionsInfoPresenter extends BasePresenter implements IPrescriptionsInfoPresenter {
  /**
   * 処方箋画像取得処理
   * @param req - Request
   * @param res - Response
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
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
      requestHeader.set("jins-user-id", customerStaffId);
      if (cursor) {
        requestHeader.set("X-Cursor", cursor);
      }

      interface PrescriptionGetRequest {
        prescriptionId: string;
      }

      const prescriptionGetRequest: PrescriptionGetRequest = {
        prescriptionId: req.params.prescriptionId,
      }

      logger.info(`prescriptionGetRequest: ${JSON.stringify(prescriptionGetRequest)}`);

      // デジタル基盤層APIを呼び出す
      const prescriptionGetResponse = await sendApiRequest(
        getPrescriptionServer,
        prescriptionGetRequest,
        requestHeader,
        process.env.CART_SERVICE_JP
      );

      logger.info(`prescriptionGetResponse: ${JSON.stringify(prescriptionGetResponse)}`);

      if (!prescriptionGetResponse.ok) {
        throw prescriptionGetResponse;
      }

      res.status(200).send(prescriptionGetResponse.data);

      return;
    } catch (error: any) {
      if (error.status == 404) {
          res.status(400).json(error.data);
        } else {
          res.status(error.status).json(error?.data);
        }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };
}
