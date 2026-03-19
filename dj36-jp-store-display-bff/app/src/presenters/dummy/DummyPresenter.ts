import { Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IDummyPresenter } from "~/src/presenters/interfaces";
import { getStatus } from "~/src/clients/dummy/dummyCrient";

import { logger } from "~/src/logging/logger";

/**
 * ステータス
 */
@injectable()
export class DummyPresenter extends BasePresenter implements IDummyPresenter {
  /*
   * ダミーサーバーのステータス取得処理
   * @param req Request
   * @param res Response
   * @returns Promise<void>
   */
  public show = async (req: Request, res: Response): Promise<void> => {
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

      if (!dummyResponse.ok) {
        throw dummyResponse;
      }

      res.status(200).send(dummyResponse.data);

      return;
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  };
}
