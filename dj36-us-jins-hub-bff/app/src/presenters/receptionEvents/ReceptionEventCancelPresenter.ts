import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IReceptionEventCancelPresenter } from "~/src/presenters/interfaces";

import dotenv from "dotenv";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { postReceptionEvents } from "~/src/clients/carts/cartsClient";
import { CallingStatus, ReceptionStatus } from "~/src/components/const";
import { EventCode, SubEventCode } from "~/src/components/eventCode";
import { decryptText } from "~/src/utils/encryptText";
import { ReceptionEventsPostRequest } from "~/src/clients/carts/cartsClientTypes";
import { generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";
import { operations } from "~/src/interfaces/root";
import { ApiResponse } from "openapi-typescript-fetch";
import { ValidationError } from "~/src/components/errors";

dotenv.config();

@injectable()
export class ReceptionEventCancelPresenter
  implements IReceptionEventCancelPresenter
{
  /**
   * 受付キャンセル処理
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
      const dpfmRequest = generateDpfmRequestInfo(req);

      // 受付番号を復号
      const path = req.params as operations['putReceptionCancel']['parameters']['path'];
      const receptionNumber = decryptText(path.encryptionReceptionNumber);
      if (!receptionNumber) {
        throw new ValidationError("The reception number must be encrypted.");
      }

      // 受付情報更新API呼出
      const rcptEventPostRequest: ReceptionEventsPostRequest = {
        receptionNumber: receptionNumber,
        storeCode: path.storeCode,
        statusCode: ReceptionStatus.CANCEL, // キャンセル:900
        callingStatusCode: CallingStatus.CANCEL, // 取消:020
        itemGroupCode: `${receptionNumber}-1`,
        eventCode: EventCode.CHECK_IN.CODE, // 受付:000
        subEventCode: SubEventCode.CANCEL, // キャンセル:020
      };

      logger.info(`postReceptionEventsRequest: ${JSON.stringify(rcptEventPostRequest)}`);

      const apiResponse: ApiResponse<unknown> = await sendApiRequest(
        postReceptionEvents,
        rcptEventPostRequest,
        makeDpfmRequestHeader(dpfmRequest)
      );

      logger.info(`postReceptionEventsResponse: ${JSON.stringify(apiResponse)}`);

      res.status(200).send();

      return;
    } catch (error) {
      next(error);
    }
  };
}
