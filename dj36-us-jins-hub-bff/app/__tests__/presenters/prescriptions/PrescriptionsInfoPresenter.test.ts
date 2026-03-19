import request from "supertest";
import { logger } from "~/src/logging/logger";

import app from "~/app";

import {
  getPrescriptionServer,
} from "~/src/clients/carts/cartsClient";

import * as mockResponse
  from "~/__tests__/presenters/prescriptions/mockResponses/PrescriptionsInfoPresenterMockResponse";

import * as fetchService from "~/src/utils/fetchService";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";
// ★テスト共通情報(接続先URL)
class TestInfo {
  static readonly url = `/api/sales/prescriptions`;
  static readonly jinsTraceId = crypto.randomUUID();
  static readonly staffid = "guest";
}

let counter: number = 0;
type MockSendApiResult = {
  getPrescriptionServer?: (object | undefined | null);
};
function setupSendApiMock(sendApiRequestSpy: jest.SpyInstance, result : MockSendApiResult){
  sendApiRequestSpy.mockImplementation((apiMethod: any, params: any, headers?: Headers, url?: string) => {
    logger.info(`★ ${apiMethod.path} ${apiMethod.method}} ★`);
    var res = undefined;
    switch(apiMethod) {
      case getPrescriptionServer:
          res = result?.getPrescriptionServer;
          break;
    }
    if (res === undefined) {
      // 未定義の場合、NGで返却
      throw new ApiError( { ok: false, status: 400, data: undefined } as ApiResponse);
    } else if (res === null) {
      // nullの場合、OK データ部なしで返却
      return { ok: true, status: 200, data: res };
    } else if (res == ("404").toString) {
      // レコードなし時の対応
      throw new ApiError( { ok: false, status: 404, data: undefined } as ApiResponse);
    }
    return { ok: true, status: 200, data: res };
  });
};

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

  test("正常系_処方箋画像取得API", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getPrescriptionServer: mockResponse.getPrescriptionServerResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // ★リクエストパラメタ
    const prescriptionId: String = "240123US000001-1";
    // テスト実施
    const pathParameter = `/${prescriptionId}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_normal);
  });

  test("境界系_処方箋画像取得API_data_null", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getPrescriptionServer: mockResponse.getPrescriptionServerResponse_nulldata,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // ★リクエストパラメタ
    const prescriptionId: String = "240123US000001-1";
    // テスト実施
    const pathParameter = `/${prescriptionId}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_data_null);
  });

  test("境界系_処方箋画像取得API_data_undefined", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getPrescriptionServer: mockResponse.getPrescriptionServerResponse_nodata,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // ★リクエストパラメタ
    const prescriptionId: String = "240123US000001-1";
    // テスト実施
    const pathParameter = `/${prescriptionId}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_data_undefined);
  });

  test("境界系_処方箋画像取得API_null", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getPrescriptionServer: mockResponse.getPrescriptionServerResponse_null,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // ★リクエストパラメタ
    const prescriptionId: String = "240123US000001-1";
    // テスト実施
    const pathParameter = `/${prescriptionId}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual("");
  });

  test("異常系_処方箋画像取得API_undefined", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getPrescriptionServer: mockResponse.getPrescriptionServerResponse_undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // ★リクエストパラメタ
    const prescriptionId: String = "240123US000001-1";
    // テスト実施
    const pathParameter = `/${prescriptionId}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

});
