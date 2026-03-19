import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IReceptionEventCancelPresenter } from "~/src/presenters/interfaces";

import dotenv from "dotenv";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { postReceptionEvents } from "~/src/clients/carts/cartsClient";
import { CallingStatus, ReceptionStatus } from "~/src/compornents/const";
import { EventCode, SubEventCode } from "~/src/compornents/eventCode";
import { decryptText } from "~/src/utils/encryptText";
import { ReceptionEventsRequest } from "~/src/clients/carts/cartsClientTypes";
import { generateDpfmRequestInfo, makeDpfmRequestHeader, makeRequestHeader } from "~/src/utils/makeRequestHeader";

dotenv.config();

@injectable()
export class ReceptionEventCancelPresenter
  extends BasePresenter
  implements IReceptionEventCancelPresenter
{
  /**
   * 受付キャンセル処理
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
      const dpfmRequest = generateDpfmRequestInfo(req);

      // 受付番号復号化
      const receptionNumber = decryptText(req.params.receptionNumber) ?? req.params.receptionNumber;

      // 受付情報更新API呼出
      const rcptEventPostRequest: ReceptionEventsRequest = {
        receptionNumber: receptionNumber,
        storeCode: req.params.storeCode,
        statusCode: ReceptionStatus.CANCEL, // キャンセル:900
        callingStatusCode: CallingStatus.CANCEL, // 取消:020
        itemGroupCode: `${receptionNumber}-1`,
        eventCode: EventCode.CHECK_IN, // 受付:000
        subEventCode: SubEventCode.CANCEL, // キャンセル:020
      };

      logger.info(`rcptEventPostRequest: ${JSON.stringify(rcptEventPostRequest)}`);

      // デジタル基盤層APIを呼び出す
      const rcptEventPostResponse = await sendApiRequest(
        postReceptionEvents,
        rcptEventPostRequest,
        makeDpfmRequestHeader(dpfmRequest)
      );

      logger.info(`rcptEventPostResponse: ${JSON.stringify(rcptEventPostResponse)}`);

      if (!rcptEventPostResponse.ok) {
        throw rcptEventPostResponse;
      }

      res.status(200).send(rcptEventPostResponse.data);

      return;
    } catch (error: any) {
      if (error.status == 404) {
        res.status(400).json(error?.data);
      } else {
        res.status(error.status).json(error?.data);
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };
}
