import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IStaffLoginPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { getStaffLogin } from "~/src/clients/staffs/staffsClient";
import { sendApiRequest } from "~/src/utils/fetchService";
import { StaffAuthenticateRequest, StaffAuthenticateResponse } from "~/src/clients/staffs/staffsClientTypes";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import { DpfmRequestInfo, generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";
import { operations } from "~/src/interfaces/root";

/**
 * スタッフログインAPI処理
 */
@injectable()
export class StaffLoginPresenter implements IStaffLoginPresenter {
  /**
   * スタッフログインAPI処理
   * @param req - Request
   * @param res - Response
   * @param next - NextFunction
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dpfmRequestInfo = generateDpfmRequestInfo(req);
      const query = req.query as operations["getStaffLogin"]["parameters"]["query"];

      // スタッフ認証
      const staffAuthenticateResponse = await this.authenticateStaff(
        dpfmRequestInfo,
        query.staffId,
        query.password
      );

      res.status(200).send(staffAuthenticateResponse);
      return;
    } catch (error) {
      next(error);
    }
  };

  /**
   * スタッフ認証API呼び出し
   * @param dpfmRequestInfo
   * @param staffId
   * @param password
   * @returns
   */
  authenticateStaff = async (
    dpfmRequestInfo: DpfmRequestInfo,
    staffId: string,
    password: string
  ) => {
    try {
      const staffAuthenticateRequest: StaffAuthenticateRequest = {
        staffId: staffId,
        password: password,
      };

      logger.info(
        `staffAuthenticateRequest: ${JSON.stringify(staffAuthenticateRequest)}`
      );

      // スタッフ認証APIを呼び出す
      const staffAuthenticateResponse: ApiResponse<StaffAuthenticateResponse> =
        await sendApiRequest(
          getStaffLogin,
          staffAuthenticateRequest,
          makeDpfmRequestHeader(dpfmRequestInfo),
          process.env.STAFF_SERVICE_JP
        );

      logger.info(
        `staffAuthenticateResponse: ${JSON.stringify(staffAuthenticateResponse)}`
      );
      return staffAuthenticateResponse.data;
    } catch (error) {
      if (error instanceof ApiError && error.status == 400) {
        // ステータスが「400」で復帰した場合、ステータスを「401 Unauthorized」に変える。
        logger.error(
          `staffLoginPresenter: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
        );
        const apiResponse: ApiResponse = {
          ...error,
          ok: false,
          status: 401,
        };
        throw new ApiError(apiResponse);
      }
      throw error;
    }
  };
}
