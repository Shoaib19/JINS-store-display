import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IPrescriptionsPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { postPrescriptionsServer } from "~/src/clients/carts/cartsClient";
import { sendApiRequest } from "~/src/utils/fetchService";
import { customerStaffId } from "~/src/compornents/const";

/**
 * 処方箋画像登録処理
 */
@injectable()
export class PrescriptionsPresenter extends BasePresenter implements IPrescriptionsPresenter {
  /**
   * 処方箋画像登録処理
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

      const body = req.body;

      interface PrescriptionPostRequest {
        base64String: string;         // 国コード(alpha-2)
      }

      const prescriptionPostRequest: PrescriptionPostRequest = {
        base64String: body.base64String ?? "",
      }

      logger.info(`rcptInfoPostRequest: ${JSON.stringify(prescriptionPostRequest)}`);

      // デジタル基盤層APIを呼び出す
      const rcptInfoPostResponse = await sendApiRequest(postPrescriptionsServer, prescriptionPostRequest, requestHeader);

      logger.info(`rcptInfoPostResponse: ${JSON.stringify(rcptInfoPostResponse)}`);

      if (!rcptInfoPostResponse.ok) {
        throw rcptInfoPostResponse;
      }

      res.status(200).send(rcptInfoPostResponse.data);

      return;
    } catch (error: any) {
      res.status(error.status).json(error.data);
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };
}
