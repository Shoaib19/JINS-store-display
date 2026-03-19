import { ApiError, ApiResponse, Fetcher } from "openapi-typescript-fetch";
import { Method } from "openapi-typescript-fetch/types";
import dotenv from "dotenv";
import { services, ServiceName } from "~/src/components/services";
import { logger } from "~/src/logging/logger";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetcher = Fetcher.for<any>(); // 型は適宜指定

fetcher.configure({
  baseUrl: process.env.DUMMY_SERVER, // デフォルトのベースURL
  init: {
    keepalive: true,
  },
});

/**
 * API呼び出し関数定義
 */
export type CallFunction = (params: unknown, fetchOptions?: RequestInit) => Promise<ApiResponse>;

/**
 * APIメソッド定義
 */
export type ApiMethod = {
  path: string;
  method: Method;
  service: ServiceName;
  call: CallFunction;
};

/**
 * API呼び出しを作成する関数
 * @param path - path
 * @param method - method
 * @param service - service
 * @returns ApiMethod
 */
export const createApiMethod = (path: string, method: Method, service: ServiceName): ApiMethod => {
  const call = async (params: unknown, fetchOptions?: RequestInit) => {
    return fetcher
      .path(path)
      .method(method as string)
      .create()(params, fetchOptions);
  };

  return { path, method, service, call };

};

/**
 * APIメソッドを呼び出す際に、動的にベースURLを設定
 * @param method - method
 * @param service - service
 * @returns baseUrl
 */
const getBaseUrl = (method: Method, service: ServiceName): string => {
  if (method === "get") {
    switch (service) {
      case services.DIAMETER:
        return process.env.DIAMETER_SERVICE_US as string
      case services.SALESORDER:
        return process.env.SALESORDER_SERVICE_US as string
      case services.OMS:
        return process.env.OMS_SERVICE_US as string
      case services.WARRANTY:
        return process.env.WARRANTY_SERVICE_US as string
      case services.CART:
        return process.env.CART_SERVICE_US as string
      case services.CATALOG:
        return process.env.CATALOG_SERVICE_US as string
      case services.LOCATION:
        return process.env.LOCATION_SERVICE_US as string
      case services.INVENTORY:
        return process.env.INVENTORY_DATA_SERVICE_US as string
      case services.STAFFS:
        return process.env.STAFF_SERVICE_US as string
      case services.BFF_VALIDATOR:
        return process.env.BFF_VALIDATOR as string
      case services.PRICE:
        return process.env.PRICE_SERVICE_US as string
    }
  } else {
    switch (service) {
      case services.DIAMETER:
        return process.env.DIAMETER_SERVICE_JP as string
      case services.SALESORDER:
        return process.env.SALESORDER_SERVICE_JP as string
      case services.OMS:
        return process.env.OMS_SERVICE_JP as string
      case services.WARRANTY:
        return process.env.WARRANTY_SERVICE_JP as string
      case services.CART:
        return process.env.CART_SERVICE_JP as string
      case services.CATALOG:
        return process.env.CATALOG_SERVICE_JP as string
      case services.LOCATION:
        return process.env.LOCATION_SERVICE_JP as string
      case services.INVENTORY:
        return process.env.INVENTORY_DATA_SERVICE_JP as string
      case services.STAFFS:
        return process.env.STAFF_SERVICE_JP as string
      case services.BFF_VALIDATOR:
        return process.env.BFF_VALIDATOR as string
      case services.PRICE:
        return process.env.PRICE_SERVICE_JP as string
    }
  }
};

/**
 * 環境変数から設定を取得
 * @returns リトライ, バックオフ
 */
const getEnvSettings = () => {
  /**
   * 環境変数の数値を取得
   * @param key 環境変数のキー 
   * @returns 環境変数の値(number)
   */
  const getEnvNumber = (key: string) => {
    const value = process.env[key];
    return value ? parseInt(value, 10) : undefined;
  }

  // API_RETRIES：送信回数（デフォルト＝1）
  const envRetries = getEnvNumber("API_RETRIES");
  const retries = envRetries && !isNaN(envRetries) ? envRetries : 1;
  // API_BACKOFF：再送時の待機間隔(ms)（デフォルト＝500、再送ごとに２倍）
  const envBackoff = getEnvNumber("API_BACKOFF");
  const backoff = envBackoff && !isNaN(envBackoff) ? envBackoff : 500;
  return { retries, backoff };
};

/**
 * API呼び出しをリトライする関数
 * @param call - call
 * @param params - params
 * @param fetchOptions - fetchOptions
 */
const retryApiRequest = async (call: CallFunction, params: unknown, fetchOptions: RequestInit) => {
  /**
   * FetchOptionsの調整
   * @param initFetchOptions FetchOptions
   * @param retryCount リトライ回数
   * @returns 調整後FetchOptions
   */
  const resolveFetchOptions = (initFetchOptions: RequestInit, retryCount : number) => {
      if (retryCount == 0) {
        return initFetchOptions;
      }
      const headers = new Headers(initFetchOptions.headers);
      const branchNo = headers.get("jins-trace-id-branch-no");
      // "jins-trace-id-branch-no"に再送用の枝番をつける
      if (branchNo) {
        headers.set("jins-trace-id-branch-no", `${branchNo}-9${retryCount}`);
      }
      const fetchOptions = {
        ...initFetchOptions,
        headers: headers,
      };
      return fetchOptions;
  }

  const { retries: maxSendCount, backoff: initialBackoff } = getEnvSettings();
  const maxRetryCount = Math.max(maxSendCount - 1, 0);
  let backoff = initialBackoff; // バックオフの初期値を変数に代入

  for (let retryCount = 0; ; retryCount++) {
    try {
      const callFetchOptions = resolveFetchOptions(fetchOptions, retryCount);
      // API呼び出し
      const apiResponse = await call(params, callFetchOptions);
      if (!apiResponse.ok) {
        throw new ApiError(apiResponse);
      }
      return apiResponse;
    } catch (error) {
      if (retryCount >= maxRetryCount ) { 
        // リトライ超過の場合は再スロー
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, backoff)); // バックオフ
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
export const sendApiRequest = async (apiMethod: ApiMethod, params: unknown, headers?: Headers, url?: string) => {
  const baseUrl = url ? url : getBaseUrl(apiMethod.method, apiMethod.service);
  logger.info(`baseUrl: ${baseUrl} method: ${apiMethod.method} service: ${apiMethod.service}`);
  
  // ヘッダーを設定
  const fetchOptions: RequestInit = {
    headers: headers || {}, // 受け取ったヘッダーを使用、デフォルトは空オブジェクト
  };

  // ベースURLを設定（APIメソッド呼び出し前に）
  fetcher.configure({ baseUrl });

  return await retryApiRequest(apiMethod.call, params, fetchOptions); // リトライ処理を呼び出し
};
