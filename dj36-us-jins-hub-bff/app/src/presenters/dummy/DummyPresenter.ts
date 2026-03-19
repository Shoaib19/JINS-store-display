import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IDummyPresenter } from "~/src/presenters/interfaces";
import { getStatus } from "~/src/clients/dummy/dummyClient";

import { logger } from "~/src/logging/logger";

/**
 * ステータス
 */
@injectable()
export class DummyPresenter implements IDummyPresenter {
  /*
   * ダミーサーバーのステータス取得処理
   * @param req Request
   * @param res Response
   * @param next - NextFunction
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const cursor = req.header("x-cursor");

      const dummyHeaders: HeadersInit = new Headers();
      dummyHeaders.set("Accept", req.header("accept") ?? "");
      dummyHeaders.set("Accept-Language", req.header("accept-language") ?? "");
      dummyHeaders.set("Content-Type", req.header("content-type") ?? "");
      dummyHeaders.set("Authorization", req.header("authorization") ?? "");
      dummyHeaders.set("X-API-KEY", process.env.CRM_API_KEY ?? "");
      if (cursor) {
        dummyHeaders.set("X-Cursor", cursor);
      }

      const dummyResponse = await getStatus({}, { headers: dummyHeaders });

      logger.debug(`dummyResponse: ${JSON.stringify(dummyResponse)}`);

      res.status(200).send(dummyResponse.data);

      return;
    } catch (error) {
      next(error);
    }
  };
}
