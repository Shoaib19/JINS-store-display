import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import request from "supertest";
import app from "~/app";

import * as fetchService from "~/src/utils/fetchService";

// 見出し部
describe("GET /api/sales/call-management", () => {
  const url = "/api/sales/call-management";
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });

  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  // テストの実施
  test("正常系_レコードあり_呼出し管理情報取得", async () => {
    const expected = {
      timeRequiredUntilCall: 200,
      availableLines: 10,
      openingHourAvailableLines: 3,
      lineSettings:[
        {
          "startTime": "12:00:00",
          "availableLines": 4
        },
      ],
      processingCloseTime: "20:00:00",
      receptionCloseTime: "08:00:00",
      inStockLensPickupTime: "08:00:00",
      awaitingDeliveryLensPickupTime: "20:00:00",
    };
    const storeCode = "83005";
    const jinsTraceId = "ab623ca6-b1e4-3796-a761-ca05605da64a";
    const mockResponse = {
      ok: true,
      status: 200,
      data: {
          "callManagementInfo": {
            "timeRequiredUntilCall": 200,
            "availableLines": 10,
            "lineSettings":[
              {
                "startTime": "11:00:00",
                "availableLines": 3
              },
              {
                "startTime": "12:00:00",
                "availableLines": 4
              },
            ],
            "receptionCloseTime": "08:00:00",
            "processingCloseTime": "20:00:00",
            "inStockLensPickupTime": "08:00:00",
            "awaitingDeliveryLensPickupTime": "20:00:00"
          }
      },
    };
    sendApiRequestSpy.mockResolvedValue(mockResponse);
    const response = await request(app)
      .get(`${url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", "guest")
      .set("x-cursor", "test");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_レコードなし_呼出し管理情報取得", async () => {
    const expected = {
      timeRequiredUntilCall: null,
      availableLines: null,
      openingHourAvailableLines: null,
      // lineSettings: null,
      processingCloseTime: null,
      receptionCloseTime: null,
      inStockLensPickupTime: null,
      awaitingDeliveryLensPickupTime: null,
    };
    const storeCode = "83005";
    const jinsTraceId = "ab623ca6-b1e4-3796-a761-ca05605da64a";
    const mockResponse = {
      ok: true,
      status: 200,
      data: {},
    };
    sendApiRequestSpy.mockResolvedValue(mockResponse);
    const response = await request(app)
      .get(`${url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", "guest")
      .set("x-cursor", "test");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("異常系_レコードなし_呼出し管理情報取得", async () => {
    const expected = {
      timeRequiredUntilCall: null,
      availableLines: null,
      openingHourAvailableLines: null,
      // lineSettings: null,
      processingCloseTime: null,
      receptionCloseTime: null,
      inStockLensPickupTime: null,
      awaitingDeliveryLensPickupTime: null,
    };
    const storeCode = "83005";
    const jinsTraceId = "ab623ca6-b1e4-3796-a761-ca05605da64a";
    const mockResponse = {
      ok: false,
      status: 404,
      data: {},
    };
    sendApiRequestSpy.mockRejectedValue(new ApiError(mockResponse as ApiResponse));
    const response = await request(app)
      .get(`${url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", "guest");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("異常系_その他エラー_呼出し管理情報取得", async () => {
    const storeCode = "83005";
    const jinsTraceId = "ab623ca6-b1e4-3796-a761-ca05605da64a";
    const mockResponse = {
      ok: false,
      status: 500,
      data: {},
    };
    sendApiRequestSpy.mockRejectedValue(new ApiError(mockResponse as ApiResponse));
    const response = await request(app)
      .get(`${url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", "guest");
    expect(response.statusCode).toBe(500);
  });
});
