import { Request, Response } from "express";
import { ErrorResponse } from "~/src/compornents/errors";
import { CommonErrorCode } from "~/src/compornents/errorCode";
import { logger } from "~/src/logging/logger";

/*
 * バリデーションエラーハンドラー
 * @param err Error
 * @param req Request
 * @param res Response
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const validationErrorHandler = async (
  err: Error,
  req: Request,
  res: Response,
) => {
  logger.error(`validationErrorHandler: ${JSON.stringify(err)}`);

  const error: ErrorResponse = {
    "Jins-Trace-ID": req.header("jins-trace-id") ?? "",
    timestamp: new Date().toISOString(),
    code: CommonErrorCode.COM_0001_VALIDATION_ERROR,
    systemName: "BFF",
    message: "Bad request",
    details: `${JSON.stringify(err)}`,
  };
  res.header("content-type", "application/json");
  res.header("jins-trace-id", req.header("jins-trace-id") ?? "");
  res.header("jins-system-version", process.env.npm_package_version ?? "0.0.0");
  res.header("x-amzn-RequestId", req.header("x-amzn-RequestId") ?? "");
  res.status(400).json(error);
};
