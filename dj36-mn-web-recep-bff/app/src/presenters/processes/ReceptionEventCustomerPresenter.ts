import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IReceptionEventCustomerPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import {
  findReceptionEvents,
  searchReceptionInformation,
} from "~/src/clients/carts/cartsClient";
import {
  FindReceptionEventsPath,
  FindReceptionEventsQuery,
  ReceptionEvent,
  ReceptionEventsGetResponse,
  SearchReceptionInformationQuery,
  SearchReceptionInformationResponse,
} from "~/src/clients/carts/cartsClientTypes";
import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { components, operations } from "~/src/interfaces/root";
import { ErrorResponse } from "~/src/compornents/errors";
import { makeErrorResponse404 } from "~/src/utils/makeErrorResponse400";
import { fixDatetimeForFrontFromDpfm } from "~/src/utils/fixDatetime";

/**
 * 顧客情報 受付履歴取得API
 */
@injectable()
export class ReceptionEventCustomerPresenter
  extends BasePresenter
  implements IReceptionEventCustomerPresenter
{
  /**
   * 顧客情報 受付履歴取得
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

      const query: operations["getReceptionEventCustomer"]["parameters"]["query"] =
        req.query;
      // 受付情報取得
      const receptionInformation = await this.getReceptionInformation(
        dpfmRequestInfo,
        req.params.receptionNumber
      );
      if (receptionInformation == undefined) {
        // 受付情報が見つからないときは404を返却
        const error: ErrorResponse = makeErrorResponse404(
          `There is no recode matched ${req.params.receptionNumber}.`,
          req
        );
        res.status(404).json(error);
        return;
      }

      // 受付履歴を取得
      const receptionEvents = await this.getReceptionEvent(
        dpfmRequestInfo,
        req.params.receptionNumber,
        query.itemGroupCode
      );
      // 受付履歴はイベントコード,登録日時順番になっているので、
      // 受付履歴を商品グループコード別に振り分ける
      // Map<商品グループコード,受付履歴[]>
      const receptionEventMap = new Map<string, ReceptionEvent[]>();
      receptionEvents.forEach((rcptEvent) => {
        const events = receptionEventMap.get(rcptEvent.itemGroupCode!);
        if (events != undefined) {
          events.push(rcptEvent);
        } else {
          receptionEventMap.set(rcptEvent.itemGroupCode!, [rcptEvent]);
        }
      });

      const itemGroups: components["schemas"]["CstmrRcptEventItemGroup"][] = [];
      for (const itemGroupCode of receptionEventMap.keys()) {
        const rcptEventItemGroup: components["schemas"]["CstmrRcptEventItemGroup"] =
          {
            itemGroupCode: itemGroupCode,
            rcptEventList: [],
          };
        itemGroups.push(rcptEventItemGroup);
      }
      const response: components["schemas"]["RcptEventCstmrGetResponse"] = {
        callingNumber: receptionInformation?.callingNumber,
        receptionStatusCode: receptionInformation?.statusCode,
        receptionNumber: receptionInformation?.receptionNumber,
        customerName: receptionInformation?.customerName,
        callingStatusCode: receptionInformation?.callingStatusCode,
        customerPhoneNumber: receptionInformation?.phoneNumber,
        receptionUpdatedTime: fixDatetimeForFrontFromDpfm(receptionInformation.updatedDatetime) ?? undefined,
        itemGroups: itemGroups,
      };
      res.status(200).json(response);
      return;
    } catch (error: any) {
      if (error.status == 404) {
        res.status(400).json(error.data);
      } else {
        res.status(error.status).json(error.data);
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };

  /**
   * 受付番号から受付情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @returns 受付情報 | undefined
   */
  private async getReceptionInformation(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string
  ) {
    // 受付情報検索API呼び出し
    const searchReceptionInformationQuery: SearchReceptionInformationQuery = {
      receptionNumber: receptionNumber,
    };

    const searchReceptionInformationRequest = {
      ...searchReceptionInformationQuery,
    };
    logger.info(
      `searchReceptionInformationRequest: ${JSON.stringify(searchReceptionInformationRequest)}`
    );
    const apiResponse = await sendApiRequest(
      searchReceptionInformation,
      searchReceptionInformationRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(
      `SearchReceptionInformationResponse: ${JSON.stringify(apiResponse)}`
    );
    if (!apiResponse.ok) {
      throw apiResponse;
    }
    const searchReceptionInformationResponse: SearchReceptionInformationResponse =
      apiResponse.data;
    return searchReceptionInformationResponse.ReceptionInfoAllItems?.at(0);
  }

  /**
   * 受付番号から受付履歴を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @param itemGroupCode 商品グループコード
   * @returns 受付履歴[]
   */
  private async getReceptionEvent(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string,
    itemGroupCode?: string
  ) {
    // 受付履歴取得API 呼び出し
    const findReceptionEventsPath: FindReceptionEventsPath = {
      receptionNumber: receptionNumber,
    };
    const findReceptionEventsQuery: FindReceptionEventsQuery = {
      itemGroupCode: itemGroupCode,
      lastedFlag: true,
    };
    const receptionEventsGetRequest = {
      ...findReceptionEventsPath,
      ...findReceptionEventsQuery,
    };
    logger.info(
      `receptionEventsGetRequest: ${JSON.stringify(receptionEventsGetRequest)}`
    );
    const apiResponse = await sendApiRequest(
      findReceptionEvents,
      receptionEventsGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`receptionEventsGetResponse: ${JSON.stringify(apiResponse)}`);
    if (!apiResponse.ok) {
      throw apiResponse;
    }
    const receptionEventsGetResponse: ReceptionEventsGetResponse =
      apiResponse.data;
    const rcptEvent: ReceptionEvent[] = receptionEventsGetResponse.rcptEvent!;
    return rcptEvent;
  }
}
