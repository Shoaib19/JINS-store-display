import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { ICallManagementUpdatePresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { putCallManagement } from "~/src/clients/carts/cartsClient";
import { operations as cartsOperations, components as cartsComponents } from "~/src/interfaces/clients/carts/cartsClient";

import dotenv from "dotenv";
import { sendApiRequest } from "~/src/utils/fetchService";
import { customerStaffId } from "~/src/compornents/const";

dotenv.config();

/**
 * 呼出し管理情報登録
 */
@injectable()
export class CallManagementUpdatePresenter extends BasePresenter implements ICallManagementUpdatePresenter {
  /**
   * 呼出し管理情報登録API
   * @param req - Request
   * @param res - Response
   * @returns Promise<void>
   */
  public show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cursor = req.header("x-cursor");

      const requestHeader: HeadersInit = new Headers();
      requestHeader.set("Accept", req.header("accept") ?? "");
      requestHeader.set("Accept-Language", req.header("accept-language") ?? "");
      requestHeader.set("Content-Type", req.header("content-type") ?? "");
      requestHeader.set("Authorization", req.header("authorization") ?? "");
      requestHeader.set("X-API-KEY", process.env.CRM_API_KEY ?? "");
      requestHeader.set("jins-trace-id", req.header("jins-trace-id") ?? "");
      requestHeader.set("jins-user-id", req.header("staffID") ?? customerStaffId);
      if (cursor) {
        requestHeader.set("X-Cursor", cursor);
      }

      // 呼出し管理情報登録API 呼出し
      const putCallManagememtPathParameters: cartsOperations["putCallManagememt"]["parameters"]["path"] = {
        storeCode: req.params.storeCode,
      };
      const putCallManagememtContent: cartsComponents["schemas"]["CallManagementPutRequest"]=
        {
          timeRequiredUntilCall: req.body.timeRequiredUntilCall,
          availableLines: req.body.availableLines,
          receptionCloseTime: req.body.receptionCloseTime,
          processingCloseTime: req.body.processingCloseTime,
        };
      const callManagementPutRequest = {
        ...putCallManagememtPathParameters,
        ...putCallManagememtContent,
      };

      logger.info(`callManagementPutRequest: ${JSON.stringify(callManagementPutRequest)}`);

      // デジタル基盤層APIを呼び出す
      const callManagementPutResponse = await sendApiRequest(
        putCallManagement,
        callManagementPutRequest,
        requestHeader
      );

      logger.info(`callManagementPutResponse: ${JSON.stringify(callManagementPutResponse)}`);

      if (!callManagementPutResponse.ok) {
        throw callManagementPutResponse;
      }
      res.status(200).send();

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
