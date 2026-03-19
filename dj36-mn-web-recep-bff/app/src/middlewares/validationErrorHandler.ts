import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "~/src/compornents/errors";
import { CommonErrorCode } from "~/src/compornents/errorCode";
import { logger } from "~/src/logging/logger";
import i18n from 'i18n';

/**
 * バリデーションエラーハンドラー
 * @param err - Error
 * @param req - Request
 * @param res - Response
 * @param next - NextFunction
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-unused-vars


interface ValidationError extends Error {
  errors: Array<{
    path: string;
    errorCode: string;
    message: string;
    location: string;
  }>;
}

interface Detail {
  path: string;
  errorCode: string;
  message: string;
  location: string;
}

export const validationErrorHandler = async (
  err: ValidationError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(`validationErrorHandler: ${JSON.stringify(err)}`);

  const errors = err.errors || [];
  const details: Detail[] = errors.map((error) => {


    const { path, errorCode, location } = error;
    const fieldLabel = i18n.__(error.path);

    let message = i18n.__('validation.field_error', { field: fieldLabel });
  
    if (error.errorCode === 'maxLength.openapi.requestValidation') {
      const maxLengthMatch = error.message.match(/must NOT have more than (\d+) characters/);
      const maxLength = maxLengthMatch ? maxLengthMatch[1] : 'unknown';
      message = i18n.__('validation.max_length', { field: fieldLabel, limit: maxLength });
    } else if (error.errorCode === 'required.openapi.requestValidation') {
      message = i18n.__('validation.required', { field: fieldLabel});
    }
  
    return {
      path,
      errorCode,
      message,
      location,
    };
  });

  // 複数のメッセージを結合する
  const allMessages = details.map(detail => detail.message).join(', ');

    // detailsオブジェクトを構成
    const detailsResponse = {
      status: 400,
      errors: details,
    }

  
  const error: ErrorResponse = {
    "Jins-Trace-ID": req.header("jins-trace-id") ?? "",
    timestamp: new Date().toISOString(),
    code: CommonErrorCode.COM_0001_VALIDATION_ERROR.CODE,
    systemName: "BFF",
    message: CommonErrorCode.COM_0001_VALIDATION_ERROR.MESSAGE || "Bad request",
    details: `${JSON.stringify(detailsResponse)}`,
  };
  res.header("content-type", "application/json");
  res.header("jins-trace-id", req.header("jins-trace-id") ?? "");
  res.header("jins-system-version", process.env.npm_package_version ?? "0.0.0");
  res.header("x-amzn-RequestId", req.header("x-amzn-RequestId") ?? "");
  res.status(400).json(error);
};
