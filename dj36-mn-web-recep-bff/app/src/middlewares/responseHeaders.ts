import { Request, Response, NextFunction } from "express";
import { logger } from "~/src/logging/logger";

/**
 * 共通のレスポンスヘッダーをセットする
 * @param req - Request
 * @param res - Response
 * @param next - NextFunction
 */
export const setCommonResponseHeaders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.setHeader("content-type", "application/json");
  res.setHeader(
    "jins-trace-id",
    req.header("jins-trace-id") ?? crypto.randomUUID(),
  );
  res.setHeader(
    "jins-system-version",
    process.env.npm_package_version ?? "0.0.0",
  );
  res.setHeader("x-amzn-RequestId", req.header("x-amzn-RequestId") ?? "");

  res.setHeader('Access-Control-Allow-Methods', `${process.env.CORS_ALLOWED_METHODS}`);
  res.setHeader('Access-Control-Allow-Headers', `${process.env.CORS_ALLOWED_HEADERS}`);

  next();
};
