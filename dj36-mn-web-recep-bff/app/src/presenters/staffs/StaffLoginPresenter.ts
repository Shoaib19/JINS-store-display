import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IStaffLoginPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { getStaffLogin } from "~/src/clients/staffs/staffsClient";
import { sendApiRequest } from "~/src/utils/fetchService";
import { customerStaffId } from "~/src/compornents/const";

/**
 * スタッフログインAPI処理
 */
@injectable()
export class StaffLoginPresenter extends BasePresenter implements IStaffLoginPresenter {
  /**
   * スタッフログインAPI処理
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
      requestHeader.set("jins-user-id", String(req.query.staffId) ?? customerStaffId);
      if (cursor) {
        requestHeader.set("X-Cursor", cursor);
      }

      interface StaffLoginGetRequest {
        staffId: string;
        password: string;
      }

      const staffLoginGetRequest: StaffLoginGetRequest = {
        staffId: String(req.query.staffId ?? ""),
        password: String(req.query.password ?? ""),
      }

      logger.info(`staffLoginGetRequest: ${JSON.stringify(staffLoginGetRequest)}`);

      // デジタル基盤層APIを呼び出す
      const staffLoginGetResponse = await sendApiRequest(
        getStaffLogin,
        staffLoginGetRequest,
        requestHeader,
        process.env.STAFF_SERVICE_JP
      );

      logger.info(`staffLoginGetResponse: ${JSON.stringify(staffLoginGetResponse)}`);

      if (!staffLoginGetResponse.ok) {
        throw staffLoginGetResponse;
      }

      res.status(200).send(staffLoginGetResponse.data);

      return;
    } catch (error: any) {
      if (error.status === 400) {
        res.status(401).json(error.data);
      } else {
        res.status(500).json(error.data);
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };
}
