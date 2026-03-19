import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IReceptionEventCustomerPresenter } from "~/src/presenters/interfaces";
import { ApiResponse } from "openapi-typescript-fetch";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import {
  findReceptionEvents,
  searchReceptionInformation,
} from "~/src/clients/carts/cartsClient";
import {
  ReceptionEvent,
  ReceptionEventsGetRequest,
  ReceptionEventsGetResponse,
  ReceptionInformation,
  ReceptionInformationSearchRequest,
  ReceptionInformationSearchResponse,
} from "~/src/clients/carts/cartsClientTypes";
import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { components, operations } from "~/src/interfaces/root";
import { ResourceNotFoundError } from "~/src/components/errors";
import { fixDatetimeForFrontFromDpfm } from "~/src/utils/fixDatetime";
import { encryptText } from "~/src/utils/encryptText";
import { CallingStatus } from "~/src/components/const";

/**
 * 顧客情報 受付履歴取得API
 */
@injectable()
export class ReceptionEventCustomerPresenter
  implements IReceptionEventCustomerPresenter
{
  /**
   * 顧客情報 受付履歴取得
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
      const path = req.params as operations["getReceptionEventCustomer"]["parameters"]["path"];
      const query: operations["getReceptionEventCustomer"]["parameters"]["query"] = req.query;

      // 受付情報取得
      const receptionInformation = await this.getReceptionInformation(
        dpfmRequestInfo,
        path.receptionNumber
      );
      if (receptionInformation == undefined) {
        throw new ResourceNotFoundError(`There is no recode matched ${path.receptionNumber}.`);
      }

      // 受付履歴を取得
      const receptionEvents = await this.getReceptionEvent(
        dpfmRequestInfo,
        path.receptionNumber,
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

      // 呼出ステータスコード取得
      const getCallingStatusCode = (receptionInformation: ReceptionInformation) => {
        const waitingCallingStatusCode: (string|undefined)[] = [
          CallingStatus.WAITING,
          CallingStatus.SOON_CALL
        ];
        return waitingCallingStatusCode.includes(receptionInformation?.callingStatusCode)
          ? CallingStatus.WAITING
          : receptionInformation?.callingStatusCode;
      };

      const response: components["schemas"]["RcptEventCstmrGetResponse"] = {
        callingNumber: receptionInformation?.callingNumber,
        receptionStatusCode: receptionInformation?.statusCode,
        receptionNumber: receptionInformation?.receptionNumber,
        encryptionReceptionNumber: receptionInformation.receptionNumber != undefined
          ? encryptText(receptionInformation.receptionNumber) : undefined,
        customerName: receptionInformation?.customerName,
        callingStatusCode: getCallingStatusCode(receptionInformation),
        customerPhoneNumber: receptionInformation?.phoneNumber,
        receptionUpdatedTime: fixDatetimeForFrontFromDpfm(receptionInformation.updatedDatetime) ?? undefined,
        itemGroups: itemGroups,
      };
      res.status(200).json(response);
      return;
    } catch (error) {
      next(error);
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
    const searchReceptionInformationRequest: ReceptionInformationSearchRequest = {
      receptionNumber: receptionNumber,
    };
    logger.info(`searchReceptionInformationRequest: ${JSON.stringify(searchReceptionInformationRequest)}`);

    const apiResponse : ApiResponse<ReceptionInformationSearchResponse> = await sendApiRequest(
      searchReceptionInformation,
      searchReceptionInformationRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`searchReceptionInformationResponse: ${JSON.stringify(apiResponse)}`);

    const searchReceptionInformationResponse = apiResponse.data;
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
    const receptionEventsGetRequest: ReceptionEventsGetRequest = {
      receptionNumber: receptionNumber,
      itemGroupCode: itemGroupCode,
      lastedFlag: true,
    };
    logger.info(`findReceptionEventsRequest: ${JSON.stringify(receptionEventsGetRequest)}`);

    const apiResponse : ApiResponse<ReceptionEventsGetResponse> = await sendApiRequest(
      findReceptionEvents,
      receptionEventsGetRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`findReceptionEventsResponse: ${JSON.stringify(apiResponse)}`);

    const receptionEventsGetResponse = apiResponse.data;
    const rcptEvent: ReceptionEvent[] = receptionEventsGetResponse.rcptEvent!;
    return rcptEvent;
  }
}
