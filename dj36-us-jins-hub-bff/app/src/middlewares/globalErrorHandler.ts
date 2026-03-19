import { Request, Response, NextFunction } from "express";
import { BaseError} from "~/src/components/errors";
import { CommonErrorCode } from "~/src/components/errorCode";
import { logger } from "~/src/logging/logger";
import { ApiError } from "openapi-typescript-fetch";
import { components } from "~/src/interfaces/root";
import { fixSystemDatetimeForFront } from "~/src/utils/fixDatetime";

type ErrorResponse = components["schemas"]["ApplicationError"];

/*
 * グローバルエラーハンドラー
 * @param err Error
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const globalErrorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(`globalErrorHandler: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);

  if( err instanceof BaseError) {
    res.status(err.statusCode).json(
      buildErrorResponse(req, err.code, 'BFF', err.message, err.details)
    );
  } else if (err instanceof ApiError) {
    const statusCode = (err.status === 404 ? 400 : err.status) ?? 500;
    const data = err.data;  // any
    const code = data?.code as string ?? CommonErrorCode.COM_0000_UNEXPECTED_ERROR.code;
    const systemName = data?.systemName as string ?? "ExternalSystem";
    const message = data?.message as string ?? CommonErrorCode.COM_0000_UNEXPECTED_ERROR.message;
    const details = data?.details?.debugMessage ?? data?.details;
    res.status(statusCode).json(
        buildErrorResponse(req, code, systemName, message, details),
    );
  } else {
    res.status(500).json(
      buildErrorResponse(req, 
        CommonErrorCode.COM_0000_UNEXPECTED_ERROR.code,
        'BFF', 
        CommonErrorCode.COM_0000_UNEXPECTED_ERROR.message,
        `${err.name} ${err.message}`)
    );
  }
  next();
};
 
/**
 * エラーレスポンス生成
 * @param req Request
 * @param code エラーコード
 * @param systemName システム名
 * @param message エラーメッセージ
 * @param details エラー詳細
 * @returns エラーレスポンス
 */
const buildErrorResponse = (
  req: Request,
  code: string,
  systemName: string,
  message: string,
  details?: unknown
) => {
  const response: ErrorResponse = {
    "Jins-Trace-ID": req.header("jins-trace-id") ?? "",
    timestamp: fixSystemDatetimeForFront(),
    code: code,
    systemName: systemName,
    message: message,
    details: details ? (details as string) : "",
  };
  return response;
};
