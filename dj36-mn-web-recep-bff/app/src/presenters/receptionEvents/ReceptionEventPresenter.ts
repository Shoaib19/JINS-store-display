import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IReceptionEventPresenter } from "~/src/presenters/interfaces";

import dotenv from "dotenv";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { findReceptionEvents } from "~/src/clients/carts/cartsClient";
import { fixDatetimeForFrontFromDpfm } from "~/src/utils/fixDatetime";
import { customerStaffId } from "~/src/compornents/const";
import {
  FindReceptionEventsPath,
  FindReceptionEventsQuery,
  ReceptionEvent,
  ReceptionEventsGetResponse,
} from "~/src/clients/carts/cartsClientTypes";
import { components } from "~/src/interfaces/root";
import {
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { getStaffName } from "~/src/utils/getStaffName";

dotenv.config();

/**
 * 受付履歴取得
 */
@injectable()
export class ReceptionEventPresenter
  extends BasePresenter
  implements IReceptionEventPresenter
{
  /**
   * 受付履歴取得処理
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
      const dpfmRequestInfo = generateDpfmRequestInfo(req);

      // 受付履歴取得API 呼び出し
      const findReceptionEventsQuery: FindReceptionEventsQuery = {
        itemGroupCode: req.params.itemGroupCode,
        lastedFlag : true,
      };
      const findReceptionEventsPath: FindReceptionEventsPath = {
        receptionNumber: req.params.receptionNumber,
      };
      const receptionEventsGetRequest = {
        ...findReceptionEventsQuery,
        ...findReceptionEventsPath,
      };
      logger.info(
        `receptionEventsGetRequest: ${JSON.stringify(receptionEventsGetRequest)}`
      );
      const apiResponse = await sendApiRequest(
        findReceptionEvents,
        receptionEventsGetRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );
      logger.info(
        `receptionEventsGetResponse: ${JSON.stringify(apiResponse)}`
      );
      if (!apiResponse.ok) {
        throw apiResponse;
      }
      const receptionEventsGetResponse : ReceptionEventsGetResponse = apiResponse.data;

      const toRcptEvent = async (events? : ReceptionEvent[]) => {
        const rcptEvent : components["schemas"]["RcptEventInfo"][] = [];
        if (events) {
          const cashedStaff = new Map<string, string>();
          for(const event of events) {
            const rcptEventInfo: components["schemas"]["RcptEventInfo"] = {
              eventCode: event.eventCode,
              eventName: event.eventName,
              employeeId:
                event.registeredUserId !== customerStaffId
                  ? event.registeredUserId
                  : undefined,
              employeeName: await getStaffName(
                dpfmRequestInfo,
                event.registeredUserId!,
                cashedStaff
              ),
              eventDateTime:
                fixDatetimeForFrontFromDpfm(event.registeredDatetime) ??
                undefined,
            };
            rcptEvent.push(rcptEventInfo);
          };
        }
        return rcptEvent;
      }

      const data :components["schemas"]["RcptEventGetResponse"] = {
        rcptEvent : await toRcptEvent(receptionEventsGetResponse.rcptEvent),
      };
      res.status(200).send(data);
      return;
    } catch (error: any) {
      if(error.status === 404){
        res.status(400).send(error.data);
      }else{
        res.status(error.status).json(error.data);
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };
}
