import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { ICallManagementInfoPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import {
  getCallManagement,
} from "~/src/clients/carts/cartsClient";
import { sendApiRequest } from "~/src/utils/fetchService";
import { customerStaffId } from "~/src/compornents/const";

/**
 * 呼出し管理情報取得API
 */
@injectable()
export class CallManagementInfoPresenter extends BasePresenter
                                     implements ICallManagementInfoPresenter {
  /**
   * 呼出し管理情報取得処理
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
      requestHeader.set("jins-trace-id-branch-no", "");
      requestHeader.set("jins-user-id", customerStaffId);
      if (cursor) {
        requestHeader.set("X-Cursor", cursor);
      }

      // リクエストパラメタ定義
      interface Parameters {
        storeCode: string;
      }

      // リクエストパラメタから店舗CDを取得
      const callManagementInfoGetRequest: Parameters = {
        storeCode: req.params.storeCode,
      };
      logger.info(`callManagementInfoGetRequest: ${JSON.stringify(callManagementInfoGetRequest)}`);

      // デジタル基盤層: 呼出し管理情報取得を呼び出す
      const callManagementInfoGetResponse = await sendApiRequest(getCallManagement, callManagementInfoGetRequest, requestHeader);
      if (!callManagementInfoGetResponse.ok) {
        throw callManagementInfoGetResponse;
      }
      logger.info(`callManagementInfoGetResponse: ${JSON.stringify(callManagementInfoGetResponse)}`);

      // レスポンスデータ加工
      const callManagementInfoGetData = callManagementInfoGetResponse.data.callManagementInfo;
      const data = {
        timeRequiredUntilCall: callManagementInfoGetData.timeRequiredUntilCall,
        availableLines: callManagementInfoGetData.availableLines,
        receptionCloseTime: callManagementInfoGetData.receptionCloseTime,
        processingCloseTime: callManagementInfoGetData.processingCloseTime
      };
      logger.info(`data: ${JSON.stringify(data)}`);

      res.status(200).send(data);

      return;
    } catch (error: any) {
      if(error.status === 404){
        res.status(200).send({});
      }else{
        res.status(error.status).json(error.data);
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };
}
