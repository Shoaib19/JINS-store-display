import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import request from "supertest";
import { getReceptionsResponses, getCallManagementResponses, cartInfoGetResponse } from "~/__tests__/presenters/receptions/mockResponses/ReceptionTicketPresenterMockResponse"
import app from "~/app";
import * as fetchService from "~/src/utils/fetchService";

// テスト用定数
const testInfo = {
  url: "/api/sales/reception-tickets",
  storeCode: "83005",
  receptionNumber: "241230US00001",
  jinsTraceId: crypto.randomUUID(),
  staffId: "U00001",
  xCursor: "test",
}

describe("GET " + testInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-08-29T12:34:56Z'));
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  test("正常系_受付票・番号票API", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getReceptionsResponses.case1,
      getCallManagementResponses.case1,
      cartInfoGetResponse.case1
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // 期待値の設定
    const expected = {
      receptionNumber: "241230US00001",
      callingNumber: "A44",
      guidanceTime:"2024-08-29T12:35:00Z",
      visitingPurposeCode: "010",
      customerIssueCode: "001",
      prescriptionRegistCode: "001",
      frameCode: "MMF-24S-U019U-94",
      frameName: "Multi size metal - Browline U019 Medium Could Be Three Lines",
    };

    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}`+ `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
    expect(response.statusCode).toBe(200);
    // response.body.guidanceTime = "";
    expect(response.body).toEqual(expected);
  });

  test("正常系_案内予定時刻なし", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getReceptionsResponses.case3,
      getCallManagementResponses.case1,
      cartInfoGetResponse.case1
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}`+ `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
    expect(response.statusCode).toBe(200);
  });

  test("異常系_受付情報がない場合", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getReceptionsResponses.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}`+ `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
    expect(response.statusCode).toBe(400);
  });

  test("異常系_待ち状況取得APIエラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getReceptionsResponses.case4,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}`+ `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
    expect(response.statusCode).toBe(500);
  });

  test("異常系_呼出し管理情報取得APIエラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getReceptionsResponses.case1,
      getCallManagementResponses.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}`+ `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
    expect(response.statusCode).toBe(500);
  });

  test("異常系_カート・カタログ取得APIエラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getReceptionsResponses.case1,
      getCallManagementResponses.case1,
      cartInfoGetResponse.case2
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}`+ `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
    expect(response.statusCode).toBe(400);
  });

  test("正常系_受付票・番号票API_待ち状況dataなし", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getReceptionsResponses.case6,
      getCallManagementResponses.case3,
      cartInfoGetResponse.case3
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // 期待値の設定
    const expected = {
      receptionNumber: "241230US00001",
      callingNumber: "A44",
      guidanceTime:"2024-08-29T12:35:00Z",
      visitingPurposeCode: "010",
      customerIssueCode: null,
      prescriptionRegistCode: null,
      frameCode: null,
      frameName: null,
    };

    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}`+ `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
    expect(response.statusCode).toBe(200);
    // response.body.guidanceTime = "";
    expect(response.body).toEqual(expected);
  });

});
