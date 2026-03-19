import { Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IStatusPresenter } from "~/src/presenters/interfaces";

/**
 * ステータス
 */
@injectable()
export class StatusPresenter extends BasePresenter implements IStatusPresenter {
  /*
   * ヘルスチェック
   * @param req Request
   * @param res Response
   * @returns Promise<void>
   */
  public show = async (req: Request, res: Response): Promise<void> => {
    res.type("text/plain");
    res.send("status:healthy");
  };
}
