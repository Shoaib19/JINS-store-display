import { Request } from "express";
import { customerStaffId } from "~/src/compornents/const";

/**
 * リクエストヘッダー作成
 * @param req - Request
 * @returns リクエストヘッダー
 */
export function makeRequestHeader(req: Request) {
  const cursor = req.header("x-cursor");
  const requestHeader: HeadersInit = new Headers();
  requestHeader.set("Accept", req.header("accept") ?? "");
  requestHeader.set("Accept-Language", req.header("accept-language") ?? "");
  requestHeader.set("Content-Type", req.header("content-type") ?? "");
  requestHeader.set("Authorization", req.header("authorization") ?? "");
  requestHeader.set("X-API-KEY", process.env.CRM_API_KEY ?? "");
  requestHeader.set("jins-trace-id", req.header("jins-trace-id") ?? "");
  requestHeader.set("jins-user-id", req.header("staffID") ?? customerStaffId);
  if (cursor) {
    requestHeader.set("X-Cursor", cursor);
  }
  return requestHeader;
};

// 追加分
export type DpfmRequestInfo = {
  bffRequest: Request;
  seuqence: {
    prefix?: string;
    counter: number;
  };
};

/**
 * 
 * @param request デジタル基盤へのリクエスト情報生成
 * @param prefix jins-trace-id-branch-no に設定するプレフィックス
 * @returns 
 */
export function generateDpfmRequestInfo(request : Request , prefix? : string) {
  const info :DpfmRequestInfo = {
    bffRequest: request,
    seuqence: {
      prefix: prefix,
      counter: 0
    }
  }
  return info;
}

/**
 * リクエストヘッダー作成
 * @param info - デジタル基盤へのリクエスト情報
 * @returns リクエストヘッダー
 */
export function makeDpfmRequestHeader(info: DpfmRequestInfo) {
  const cursor = info.bffRequest.header("x-cursor");
  const requestHeader: HeadersInit = new Headers();
  requestHeader.set("Accept", info.bffRequest.header("accept") ?? "");
  requestHeader.set("Accept-Language", info.bffRequest.header("accept-language") ?? "en");
  requestHeader.set("Content-Type", info.bffRequest.header("content-type") ?? "application/json");
  requestHeader.set("Authorization", info.bffRequest.header("authorization") ?? "");
  requestHeader.set("X-API-KEY", process.env.CRM_API_KEY ?? "");
  requestHeader.set("jins-trace-id", info.bffRequest.header("jins-trace-id") ?? "");
  requestHeader.set("jins-trace-id-branch-no", getJinsTraceIdBranchNo(info));
  requestHeader.set("jins-user-id", info.bffRequest.header("staffID") ?? customerStaffId);
  // BFF ValidatorがStaffIDが必須のため付与
  requestHeader.set("staffID", info.bffRequest.header("staffID") ?? customerStaffId);
  if (cursor) {
    requestHeader.set("X-Cursor", cursor);
  }
  return requestHeader;
};

function getJinsTraceIdBranchNo(info: DpfmRequestInfo) {
  return info.seuqence.prefix ?`${info.seuqence.prefix}-${++info.seuqence.counter}`:`${++info.seuqence.counter}`;
}


