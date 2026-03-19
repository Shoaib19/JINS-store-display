import { Request } from "express";
import { customerStaffId } from "~/src/components/const";

/**
 * デジタル基盤へのリクエスト情報
 */
export type DpfmRequestInfo = {
  /** BFFで受信したリクエスト */
  bffRequest: Request;
  /** jins-trace-id-branch-no の シーケンス */
  sequence: {
    /** jins-trace-id-branch-no のプレフィックス */
    prefix?: string;
    /** jins-trace-id-branch-no のカウンター */
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
  const info: DpfmRequestInfo = {
    bffRequest: request,
    sequence: {
      prefix: prefix,
      counter: 0,
    },
  };
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

/**
 * jins-trace-id-branch-no 取得
 *  prefixが設定されているとき、「${prefix}」+「-」+「${counter}」
 *  prefixが設定されていないとき、「${counter}」
 * @param info - デジタル基盤へのリクエスト情報
 * @returns jins-trace-id-branch-no
 */
function getJinsTraceIdBranchNo(info: DpfmRequestInfo) {
  return info.sequence.prefix ?`${info.sequence.prefix}-${++info.sequence.counter}`:`${++info.sequence.counter}`;
}
