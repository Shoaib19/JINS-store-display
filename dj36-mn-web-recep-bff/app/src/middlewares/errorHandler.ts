import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "~/src/compornents/errors";
import { CommonErrorCode } from "~/src/compornents/errorCode";
import { logger } from "~/src/logging/logger";

/*
 * グローバルエラーハンドラー
 * @param err Error
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(`globalErrorHandler: ${JSON.stringify(err)}`);

  const error: ErrorResponse = {
    "Jins-Trace-ID": req.header("jins-trace-id") ?? "",
    timestamp: new Date().toISOString(),
    code: CommonErrorCode.COM_0000_UNEXPECTED_ERROR.CODE,
    systemName: "BFF",
    message: CommonErrorCode.COM_0000_UNEXPECTED_ERROR.MESSAGE,
    details: `${err.name} ${err.message}`,
  };
  res.header("content-type", "application/json");
  res.header("jins-trace-id", req.header("jins-trace-id") ?? "");
  res.header("jins-system-version", process.env.npm_package_version ?? "0.0.0");
  res.header("x-amzn-RequestId", req.header("x-amzn-RequestId") ?? "");
  res.status(500).json(error);

  next();
};
