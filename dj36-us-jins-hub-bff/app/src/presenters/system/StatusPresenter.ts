import { Request, Response } from "express";

import { injectable } from "inversify";
import type { IStatusPresenter } from "~/src/presenters/interfaces";

/**
 * ステータス
 */
@injectable()
export class StatusPresenter implements IStatusPresenter {
  /**
   * ヘルスチェック
   * @param req - Request
   * @param res - Response
   * @returns Promise<void>
   */
  public show = async (req: Request, res: Response): Promise<void> => {
    res.type("text/plain");
    res.send("status:healthy");
  };
}
