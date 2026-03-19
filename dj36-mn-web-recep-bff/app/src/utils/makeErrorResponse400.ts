import { Request } from "express";
import { CommonErrorCode } from "~/src/compornents/errorCode";
import { ErrorResponse } from "~/src/compornents/errors";

/**
 * 400エラーレスポンス作成
 * @param details - 詳細
 * @param req - Request
 * @param code - エラーコード（デフォルト：バリデーションエラー）
 * @param message - エラーメッセージ（デフォルト：バリデーションエラー）
 * @returns エラーレスポンス
 */
export function makeErrorResponse400(
  details: string[],
  req: Request,
  code: string = CommonErrorCode.COM_0001_VALIDATION_ERROR.CODE,
  message: string = CommonErrorCode.COM_0001_VALIDATION_ERROR.MESSAGE
) {
  // detailsオブジェクトを構成
  const detailsResponse = {
    status: 400,
    errors: details,
  };

  const error: ErrorResponse = {
    "Jins-Trace-ID": req.header("jins-trace-id") ?? "",
    timestamp: new Date().toISOString(),
    code: code,
    systemName: "BFF",
    message: message,
    details: `${JSON.stringify(detailsResponse)}`,
  };
  return error;
}
;


/**
 * 404エラーレスポンス作成
 * @param details - 詳細
 * @param req - Request
 * @param code - エラーコード（デフォルト：リソースなしエラー）
 * @param message - エラーメッセージ（デフォルト：リソースなしエラー）
 * @returns エラーレスポンス
 */
export function makeErrorResponse404(
  details: string,
  req: Request,
  code: string = CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.CODE,
  message: string = CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.MESSAGE
) {
  const error: ErrorResponse = {
    "Jins-Trace-ID": req.header("jins-trace-id") ?? "",
    timestamp: new Date().toISOString(),
    code: code,
    systemName: "BFF",
    message: message,
    details: `${details}`,
  };
  return error;
}
;
