import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
/**
 * 共通のレスポンスヘッダーをセットする
 * @param req
 * @param res
 * @param next
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

  next();
};
