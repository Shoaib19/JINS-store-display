import { components } from "~/src/interfaces/root";

export type ErrorResponse = components["schemas"]["ApplicationError"];

/**
 * 外部で発生したエラーを取得する
 * @param error
 * @param traceId
 * @returns
 */
export const getExternalError = (
  error: string,
  traceId: string,
  errorCode: string,
) => {
  return {
    "Jins-Trace-ID": traceId,
    timestamp: new Date().toISOString(),
    code: errorCode,
    systemName: "ExternalSystem",
    message: error ?? "Internal Server Error",
    details: error ?? "Unhandled Error occurred.",
  };
};
