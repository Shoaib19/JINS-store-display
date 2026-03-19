import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IReceptionEventPresenter } from "~/src/presenters/interfaces";

import dotenv from "dotenv";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { findReceptionEvents } from "~/src/clients/carts/cartsClient";
import { fixDatetimeForFrontFromDpfm } from "~/src/utils/fixDatetime";
import { customerStaffId } from "~/src/components/const";
import {
  ReceptionEvent,
  ReceptionEventsGetRequest,
  ReceptionEventsGetResponse,
} from "~/src/clients/carts/cartsClientTypes";
import { components, operations } from "~/src/interfaces/root";
import {
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { getStaffName } from "~/src/utils/getStaffName";
import { EventCode } from "~/src/components/eventCode";
import { ApiResponse } from "openapi-typescript-fetch";

dotenv.config();

/**
 * 受付履歴取得
 */
@injectable()
export class ReceptionEventPresenter
  implements IReceptionEventPresenter
{
  /**
   * 受付履歴取得処理
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
      const path = req.params as operations['getReceptionEvent']['parameters']['path'];
      // 受付履歴取得API 呼び出し
      const receptionEventsGetRequest: ReceptionEventsGetRequest = {
        itemGroupCode: path.itemGroupCode,
        lastedFlag : true,
        receptionNumber: path.receptionNumber,
      };
      logger.info(`findReceptionEventsRequest: ${JSON.stringify(receptionEventsGetRequest)}`);
      
      const apiResponse : ApiResponse<ReceptionEventsGetResponse> = await sendApiRequest(
        findReceptionEvents,
        receptionEventsGetRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );

      logger.info(`findReceptionEventsResponse: ${JSON.stringify(apiResponse)}`);

      const receptionEventsGetResponse = apiResponse.data;

      const toRcptEvent = async (events? : ReceptionEvent[]) => {
        const rcptEvent : components["schemas"]["RcptEventInfo"][] = [];
        if (events) {
          const cashedStaff = new Map<string, string>();
          for(const event of events) {
            const rcptEventInfo: components["schemas"]["RcptEventInfo"] = {
              eventCode: event.eventCode,
              eventName: Object.values(EventCode).find(
                (value) =>
                  event.eventCode == value.CODE
                )?.NAME,
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
    } catch (error) {
      next(error);
    }
  };
}
