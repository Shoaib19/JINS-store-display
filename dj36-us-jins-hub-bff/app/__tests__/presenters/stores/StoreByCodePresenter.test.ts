import request from "supertest";
import { logger } from "~/src/logging/logger";

import app from "~/app";

import * as mockResponse
  from "~/__tests__/presenters/stores/mockResponses/StoreByCodePresenterMockResponse";

import {
  getStoreLocations,
  getStoreAttributes
} from "~/src/clients/locations/locationsClient";


import * as fetchService from "~/src/utils/fetchService";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";

class TestInfo {
  static readonly url = "/api/sales/stores";
  static readonly jinsTraceId = crypto.randomUUID();
  static readonly staffid = "guest";
  static readonly storeCode: string = "83005";
}

type MockSendApiResult = {
  getStoreLocations?: (object | undefined | null);
  getStoreAttributes?: (object | undefined | null);
};
function setupSendApiMock(sendApiRequestSpy: jest.SpyInstance, result : MockSendApiResult){
  sendApiRequestSpy.mockImplementation((apiMethod: any, params: any, headers?: Headers, url?: string) => {
    logger.info(`★ ${apiMethod.path} ${apiMethod.method}} ★`);
    var res = undefined;
    switch(apiMethod) {
      case getStoreLocations:
        res = result?.getStoreLocations;
        break;
      case getStoreAttributes:
        res = result?.getStoreAttributes;
        break;
    }
    if (res === undefined) {
      // 未定義の場合、NGで返却
      throw new ApiError({ ok: false, status: 400, data: undefined } as ApiResponse) ;
    } else if (res === null) {
      // nullの場合、OK データ部なしで返却
      return { ok: true, status: 200, data: res };
    } else if (res == ("404").toString) {
      // レコードなし時の対応
      throw new ApiError({ ok: false, status: 404, data: undefined } as ApiResponse);
    }
    return { ok: true, status: 200, data: res };
  });
};

let counter: number = 0;

describe("GET " + TestInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  beforeEach(() => {
    counter = 0;
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });


  /** 正常系テスト */


 test("正常系_店舗情報取得API", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getStoreLocations: mockResponse.getStoreLocationsResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode = "83005"
    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query({storeCode: storeCode})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_正常系);
  });

   test("正常系_店舗情報取得API_ロケーションマスタrecords空", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getStoreLocations: mockResponse.getStoreLocationsResponse_records空,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode = "83005"
    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query({storeCode: storeCode})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_ロケーションマスタrecords空);
  });

  test("正常系_店舗情報取得API_店舗属性マスタrecords空", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getStoreLocations: mockResponse.getStoreLocationsResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse_records空,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode = "83005"
    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query({storeCode: storeCode})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_店舗属性マスタrecords空);
  });

  test("正常系_店舗情報取得API_null有", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getStoreLocations: mockResponse.getStoreLocationsResponse_null有,
      getStoreAttributes: mockResponse.getStoreAttributesResponse_null有,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode = "83005"
    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query({storeCode: storeCode})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_null有);
  });

  /** 異常系テスト */


test("異常系_店舗情報取得API_ロケーションマスタ取得エラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getStoreLocations: mockResponse.getStoreLocationsResponse_undefined,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode = "83005"
    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query({storeCode: storeCode})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  test("異常系_店舗情報取得API_店舗属性マスタ取得エラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getStoreLocations: mockResponse.getStoreLocationsResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse_undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode = "83005"
    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query({storeCode: storeCode})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  test("異常系_店舗情報取得API_エラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getStoreLocations: mockResponse.getStoreLocationsResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse_エラー.toString,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode = "83005"
    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query({storeCode: storeCode})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });


});
