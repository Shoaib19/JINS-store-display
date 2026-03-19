import { Request, Response, NextFunction } from "express";

import { injectable } from "inversify";
import type { INotFoundPresenter } from "~/src/presenters/interfaces";
import { NotFoundError } from "~/src/components/errors";

/**
 * Not Found
 */
@injectable()
export class NotFoundPresenter
  implements INotFoundPresenter
{
  /**
   * Not Foundを表示する
   * @param req - Request
   * @param _res - Response
   * @param next - NextFunction
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    return next(new NotFoundError(`The requested API endpoint [${req.url}] does not exist.`));
  };
}
