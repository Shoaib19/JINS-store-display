import { Fetcher } from "openapi-typescript-fetch";
import dotenv from "dotenv";
import { services } from "~/src/compornents/services";
import { logger } from "~/src/logging/logger";
import crypto from "crypto";

dotenv.config();

const fetcher = Fetcher.for<any>(); // 型は適宜指定

fetcher.configure({
  baseUrl: process.env.DUMMY_SERVER, // デフォルトのベースURL
  init: {
    keepalive: true,
  },
});

/**
 * APIメソッド定義
 */
type ApiMethod = {
  path: string;
  method: string;
  service: string;
  call: (params: unknown, fetchOptions?: RequestInit) => Promise<unknown>;
};

/**
 * API呼び出しを作成する関数
 * @param path - path
 * @param method - method
 * @param service - service
 * @returns ApiMethod
 */
export const createApiMethod = (
  path: string,
  method: string,
  service: string,
): ApiMethod => {
  const call = async (params: unknown, fetchOptions?: RequestInit) => {
    return fetcher.path(path).method(method).create()(params, fetchOptions);
  };

  return { path, method, service, call };
};

/**
 * APIメソッドを呼び出す際に、動的にベースURLを設定
 * @param method - method
 * @param service - service
 * @returns baseUrl
 */
const getBaseUrl = (method: string, service: string): string => {
  if (method === "get") {
    switch (service) {
      case services.DIAMETER:
        return process.env.DIAMETER_SERVICE_US as string;
      case services.SALESORDER:
        return process.env.SALESORDER_SERVICE_US as string;
      case services.OMS:
        return process.env.OMS_SERVICE_US as string;
      case services.WARRANTY:
        return process.env.WARRANTY_SERVICE_US as string;
      case services.CART:
        return process.env.CART_SERVICE_US as string;
      case services.CATALOG:
        return process.env.CATALOG_SERVICE_US as string;
      case services.LOCATION:
        return process.env.LOCATION_SERVICE_US as string;
      case services.INVENTORY:
        return process.env.INVENTORY_DATA_SERVICE_US as string;
      case services.STAFFS:
        return process.env.STAFF_SERVICE_US as string;
    }
  } else {
    switch (service) {
      case services.DIAMETER:
        return process.env.DIAMETER_SERVICE_JP as string;
      case services.SALESORDER:
        return process.env.SALESORDER_SERVICE_JP as string;
      case services.OMS:
        return process.env.OMS_SERVICE_JP as string;
      case services.WARRANTY:
        return process.env.WARRANTY_SERVICE_JP as string;
      case services.CART:
        return process.env.CART_SERVICE_JP as string;
      case services.CATALOG:
        return process.env.CATALOG_SERVICE_JP as string;
      case services.LOCATION:
        return process.env.LOCATION_SERVICE_JP as string;
      case services.INVENTORY:
        return process.env.INVENTORY_DATA_SERVICE_JP as string;
      case services.BFF_VALIDATOR:
        return process.env.BFF_VALIDATOR as string;
    }
  }
  return method.toLowerCase() === "get"
    ? // ? process.env.DUMMY_SERVER2 || ""
      // : process.env.DUMMY_SERVER || "";
      (process.env.CART_SERVICE_JP as string)
    : (process.env.CART_SERVICE_US as string);
};

/**
 * 環境変数からリトライの設定を取得
 * @returns リトライ, バックオフ
 */
const getRetrySettings = () => {
  const retries = parseInt(process.env.API_RETRIES || "3", 10);
  const backoff = parseInt(process.env.API_BACKOFF || "500", 10);
  return { retries, backoff };
};

/**
 * API呼び出しをリトライする関数
 * @param call - call
 * @param params - params
 * @param fetchOptions - fetchOptions
 */
const retryApiRequest = async (
  call: (params: unknown, fetchOptions?: RequestInit) => Promise<unknown>,
  params: unknown,
  fetchOptions?: RequestInit,
) => {
  const { retries, backoff: initialBackoff } = getRetrySettings();
  let backoff = initialBackoff; // バックオフの初期値を変数に代入

  for (let i = 0; i < retries; i++) {
    try {
      return await call(params, fetchOptions); // API呼び出し
    } catch (error) {
      // リトライ対象かどうかを確認
      if (i === retries - 1) {
        throw error; // 最後のリトライかリトライ対象でないエラーの場合は再スロー
      }
      await new Promise((resolve) => setTimeout(resolve, backoff)); // バックオフ
      backoff *= 2; // バックオフ時間を倍増
    }
  }
};

/**
 * APIメソッドの呼び出し用のラッパー関数
 * @param apiMethod - ApiMethod
 * @param params - params
 * @param headers - headers
 * @param url - url
 * @returns retryApiRequest
 */
export const sendApiRequest = async (
  apiMethod: ApiMethod,
  params: unknown,
  headers?: Headers,
  url?: string,
) => {
  const baseUrl = url ? url : getBaseUrl(apiMethod.method, apiMethod.service);
  logger.info(
    `baseUrl: ${baseUrl} method: ${apiMethod.method} service: ${apiMethod.service}`,
  );

  // FIXME: for safe exponential, for now.
  if (headers != undefined) {
    headers.set("jins-trace-id", crypto.randomUUID());
  }
  // ヘッダーを設定
  const fetchOptions: RequestInit = {
    headers: headers || {}, // 受け取ったヘッダーを使用、デフォルトは空オブジェクト
  };

  // ベースURLを設定（APIメソッド呼び出し前に）
  fetcher.configure({ baseUrl });

  return await retryApiRequest(apiMethod.call, params, fetchOptions); // リトライ処理を呼び出し
};
