
import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";
import type { IItemGroupDeletePresenter } from "~/src/presenters/interfaces";

import { injectable } from "inversify";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { deleteItemGroups } from "~/src/clients/carts/cartsClient";
import { customerStaffId } from "~/src/compornents/const";

/**
 * 商品グループ削除API
 */
@injectable()
export class ItemGroupDeletePresenter extends BasePresenter implements IItemGroupDeletePresenter {
  /**
   * 商品グループ削除処理
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
      const cursor = req.header("x-cursor");

      const requestHeader: HeadersInit = new Headers();
      requestHeader.set("Accept", req.header("accept") ?? "");
      requestHeader.set("Accept-Language", req.header("accept-language") ?? "");
      requestHeader.set("Content-Type", req.header("content-type") ?? "application/json; charset=utf-8");
      requestHeader.set("Authorization", req.header("authorization") ?? "");
      requestHeader.set("X-API-KEY", process.env.CRM_API_KEY ?? "");
      requestHeader.set("jins-trace-id", req.header("jins-trace-id") ?? "");
      requestHeader.set("jins-user-id", req.header("staffID") ?? customerStaffId);
      if (cursor) {
        requestHeader.set("X-Cursor", cursor);
      }

      interface ItemGroupsDeleteRequest {
        itemGroupCode: string;
      }

      const itemGroupsDeleteRequest: ItemGroupsDeleteRequest = {
        itemGroupCode: String(req.params.itemGroupCode),
      };

      logger.info(`itemGroupsDeleteRequest: ${JSON.stringify(itemGroupsDeleteRequest)}`);

      // デジタル基盤層APIを呼び出す
      const itemGroupsDeleteResponse = await sendApiRequest(
        deleteItemGroups,
        itemGroupsDeleteRequest,
        requestHeader
      );

      logger.info(`itemGroupsDeleteResponse: ${JSON.stringify(itemGroupsDeleteResponse)}`);

      if (!itemGroupsDeleteResponse.ok) {
        throw itemGroupsDeleteResponse;
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
