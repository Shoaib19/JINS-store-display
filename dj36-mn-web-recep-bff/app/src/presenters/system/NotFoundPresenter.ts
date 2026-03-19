import { Request, Response, NextFunction } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { INotFoundPresenter } from "~/src/presenters/interfaces";
import { ErrorResponse } from "~/src/compornents/errors";
import { CommonErrorCode } from "~/src/compornents/errorCode";

/**
 * Not Found
 */
@injectable()
export class NotFoundPresenter
  extends BasePresenter
  implements INotFoundPresenter
{
  /**
   * Not Foundを表示する
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
    const error: ErrorResponse = {
      "Jins-Trace-ID": req.header("jins-trace-id") ?? "",
      timestamp: new Date().toISOString(),
      code: CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.CODE,
      systemName: "BFF",
      message: CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.MESSAGE,
      details: `The requested API endpoint [${req.url}] does not exist.`,
    };

    res.status(404).json(error);
    return next();
  };
}
