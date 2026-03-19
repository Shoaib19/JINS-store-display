import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import { deleteItemGroups, getCallManagement, postCartInfo, putCallManagement } from "~/src/clients/carts/cartsClient";
import { CallManagementGetRequest, CallManagementPutRequest, CartPostRequest, ItemGroupsDeleteRequest } from "~/src/clients/carts/cartsClientTypes";
import { services } from "~/src/components/services";
import { ApiMethod, CallFunction, createApiMethod, sendApiRequest } from "~/src/utils/fetchService";

describe("fetchService", () => {

  const createValidHeaders = () => {
    const header = new Headers();
    header.set("Accept", "");
    header.set("Accept-Language", "en");
    header.set("Content-Type", "application/json");
    header.set("Authorization", "");
    header.set("X-API-KEY", process.env.CRM_API_KEY ?? "");
    header.set("jins-trace-id", crypto.randomUUID());
    header.set("jins-trace-id-branch-no", "1");
    header.set("jins-user-id", "guest");
    return header;
  }
  const createInvalidHeaders = (): Headers => {
    const header = createValidHeaders();
    header.delete("jins-trace-id");
    return header;
  }

  const callResolveOkFunction: CallFunction = async (params: unknown, fetchOptions?: RequestInit) =>{
    const apiResponse: ApiResponse = {
      headers: new Headers(),
      url: "",
      ok: true,
      status: 200,
      statusText: "ok result",
      data: {}
    }
    return apiResponse;
  }
  const callResolveNgFunction: CallFunction = async (params: unknown, fetchOptions?: RequestInit) =>{
    const apiResponse: ApiResponse = {
      headers: new Headers(),
      url: "",
      ok: false,
      status: 400,
      statusText: "ng result",
      data: {}
    }
    return apiResponse;
  }
  const callRejectFunction: CallFunction = async (params: unknown, fetchOptions?: RequestInit) =>{
    const apiResponse: ApiResponse = {
      headers: new Headers(),
      url: "",
      ok: false,
      status: 400,
      statusText: "reject",
      data: {}
    }
    throw new ApiError(apiResponse);
  }

    const getCallManagementRequest: CallManagementGetRequest = {
          storeCode: "83005",
    };
    const putCallManagementRequest: CallManagementPutRequest = {
          storeCode: "83005",
          timeRequiredUntilCall: 10,
          availableLines: 2,
          receptionCloseTime: "18:00:00",
          processingCloseTime: "20:00:00",
          inStockLensPickupTime: "12:00:00",
          awaitingDeliveryLensPickupTime: "14:00:00",
    };
    const postCartInfoRequest: CartPostRequest = {

    };
    const deleteItemGroupsRequest: ItemGroupsDeleteRequest = {
      itemGroupCode: "240123US000001-1",
    };

    test("正常系_Prism使用", async () => {
    process.env.API_RETRIES = "1";
    process.env.API_BACKOFF = "200";

    interface TestCase {
      apiMethod: ApiMethod;
      params: unknown;
      headers?: Headers;
      url?: string;
      expect: any;
    }
    const tests: TestCase[] = [
      {
        // API呼出 get (url指定)
        apiMethod: getCallManagement,
        params: getCallManagementRequest,
        headers: createValidHeaders(),
        url: process.env.CART_SERVICE_JP,
        expect: undefined,
      },
      {
        // API呼出 put 
        apiMethod: putCallManagement,
        params: putCallManagementRequest,
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        // API呼出 post 
        apiMethod: postCartInfo,
        params: postCartInfoRequest,
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        // API呼出 delete 
        apiMethod: deleteItemGroups,
        params: deleteItemGroupsRequest,
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        // API呼出 patch 
        apiMethod: createApiMethod('/cart/carts/{cartId}', 'patch', services.CART),
        params: {
          cartId : 123,
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
    ];
    for(const test of tests) {
      const actual = sendApiRequest(
        test.apiMethod,
        test.params,
        test.headers,
        test.url
      );
      // 例外が発生しないことを検証
      await expect(actual).resolves.not.toThrow();
    };
  });

  test("正常系_サービス網羅_Call折り返し", async () => {
    process.env.API_RETRIES = "1";
    process.env.API_BACKOFF = "200";

    interface TestCase {
      apiMethod: ApiMethod;
      params: unknown;
      headers?: Headers;
      url?: string;
      expect: any;
    }
    const tests: TestCase[] = [
      // サービス✖メソッド(get/get以外)の組み合わせ
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.DIAMETER),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'post', services.DIAMETER),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.SALESORDER),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'post', services.SALESORDER),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.OMS),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'post', services.OMS),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.WARRANTY),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'post', services.WARRANTY),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.CART),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'post', services.CART),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.CATALOG),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'post', services.CATALOG),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.LOCATION),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'post', services.LOCATION),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.INVENTORY),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'post', services.INVENTORY),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.STAFFS),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'post', services.STAFFS),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.BFF_VALIDATOR),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'post', services.BFF_VALIDATOR),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.PRICE),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      {
        apiMethod: {
          ...createApiMethod('url', 'post', services.PRICE),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      // headers指定なし
      {
        apiMethod: {
          ...createApiMethod('url', 'post', services.CART),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: undefined,
        url: undefined,
        expect: undefined,
      },
      // URL指定
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.CART),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: process.env.CART_SERVICE_JP,
        expect: undefined,
      },
    ];
    for(const test of tests) {
      const actual = sendApiRequest(
        test.apiMethod,
        test.params,
        test.headers,
        test.url
      );
      // 例外が発生しないことを検証
      await expect(actual).resolves.not.toThrow();
    };
  });

  test("正常系_定義値不正_未指定", async () => {
    delete process.env.API_RETRIES;
    delete process.env.API_BACKOFF;

    interface TestCase {
      apiMethod: ApiMethod;
      params: unknown;
      headers?: Headers;
      url?: string;
      expect: any;
    }
    const tests: TestCase[] = [
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.CART),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
    ];

    for(const test of tests) {
      const actual = sendApiRequest(
        test.apiMethod,
        test.params,
        test.headers,
        test.url
      );
      // 例外が発生しないことを検証
      await expect(actual).resolves.not.toThrow();
    };
  });

  test("正常系_定義値不正_不正値", async () => {
    process.env.API_RETRIES = 'API_RETRIES';
    process.env.API_BACKOFF = 'API_BACKOFF';

    interface TestCase {
      apiMethod: ApiMethod;
      params: unknown;
      headers?: Headers;
      url?: string;
      expect: any;
    }
    const tests: TestCase[] = [
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.CART),
          call: callResolveOkFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
    ];

    for(const test of tests) {
      const actual = sendApiRequest(
        test.apiMethod,
        test.params,
        test.headers,
        test.url
      );
      // 例外が発生しないことを検証
      await expect(actual).resolves.not.toThrow();
    };
  });

  test("異常系_エラーレスポンス_Prism使用", async () => {
    process.env.API_RETRIES = '3';
    process.env.API_BACKOFF = '10';

    interface TestCase {
      apiMethod: ApiMethod;
      params: unknown;
      headers?: Headers;
      url?: string;
      expect: any;
    }
    const tests: TestCase[] = [
      // ok以外
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.CART),
          call: callResolveNgFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      // ApiError送出
      {
        apiMethod: {
          ...createApiMethod('url', 'get', services.CART),
          call: callRejectFunction,
        },
        params: {
        },
        headers: createValidHeaders(),
        url: undefined,
        expect: undefined,
      },
      // fetchから例外受信(Prism使用)
      {
        apiMethod: getCallManagement,
        params: getCallManagementRequest,
        // ヘッダを不正にする
        headers: createInvalidHeaders(),
        url: undefined,
        expect: undefined,
      },
    ];

    for(const test of tests) {
      const actual = sendApiRequest(
        test.apiMethod,
        test.params,
        test.headers,
        test.url
      );
      // 例外が発生することを検証
      await expect(actual).rejects.toBeInstanceOf(ApiError);
    };
  });
});
