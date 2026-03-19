
import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";
import type { IItemGroupPostPresenter } from "~/src/presenters/interfaces";

import { injectable } from "inversify";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { postCartInfo } from "~/src/clients/carts/cartsClient";
import { customerStaffId } from "~/src/compornents/const";

/**
 * 商品グループ追加API
 */
@injectable()
export class ItemGroupPostPresenter extends BasePresenter implements IItemGroupPostPresenter {
  /**
   * 商品グループ追加処理
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

      interface CartPostParameters {
        receptionNumber: string;
        cartId: number;
      }

      const cartPostRequest: CartPostParameters = {
        receptionNumber: String(req.params.receptionNumber),
        cartId:  Number(req.params.cartId),
      };

      // TODO: 1月以降はアーキ側で冪等性担保の対応が追加されるので、暫定対応
      requestHeader.set("jins-trace-id", crypto.randomUUID());
      logger.info(`cartPostRequest: ${JSON.stringify(cartPostRequest)}`);

      // デジタル基盤層APIを呼び出す
      const cartInfoGetResponse = await sendApiRequest(
        postCartInfo,
        cartPostRequest,
        requestHeader
      );

      logger.info(`cartInfoGetResponse: ${JSON.stringify(cartInfoGetResponse)}`);

      if (!cartInfoGetResponse.ok) {
        throw cartInfoGetResponse;
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
