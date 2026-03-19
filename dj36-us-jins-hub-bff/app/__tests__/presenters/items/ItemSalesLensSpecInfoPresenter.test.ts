import request from "supertest";
import app from "~/app";
import {
  cartInfoGetResponse,
  salesLensSearchGetResponse,
} from "~/__tests__/presenters/items/mockResponses/ItemSalesLensSpecInfoPresenterMockResponse";

import * as fetchService from "~/src/utils/fetchService";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";

// テスト用定数
const testInfo = {
  url: "/api/sales/item-saleslensspec",
  storeCode: "83005",
  receptionNumber: "250424US000001",
  itemGroupCode: "250424US000001-1",
  salesColorNameId: 1,
  jinsTraceId: crypto.randomUUID(),
  staffId: "U00001",
  xCursor: "test",
}

describe("GET " + `${testInfo.url}/${testInfo.storeCode}/${testInfo.receptionNumber}`
  + `/${testInfo.itemGroupCode}?salesColorNameId=${testInfo.salesColorNameId}`, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  test("正常系_データ有", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      cartInfoGetResponse.case1,
      salesLensSearchGetResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンスボディ期待値
    const expected = {
      itemSalesLensSpecInfo: [
        {
          categoryName: "Lens Coating",
          lensOptionList: [
            {
              lensOptionName: "Standard",
              lensOptionId: 4110001,
              lensOptionCode: "LOP-L-110001",
              price: 0,
              disableFlag: true,
              selectedFlag: true
            },
            {
              lensOptionName: "Anti-fog",
              lensOptionId: 4110002,
              lensOptionCode: "LOP-L-110002",
              price: 60,
              disableFlag: true,
              selectedFlag: false
            },
            {
              lensOptionName: "Invincible",
              lensOptionId: 4110004,
              lensOptionCode: "LOP-L-110004",
              price: 100,
              disableFlag: true,
              selectedFlag: false
            },
            {
              lensOptionName: "Gold Mirror",
              lensOptionId: 4110006,
              lensOptionCode: "LOP-L-110006",
              price: 100,
              disableFlag: true,
              selectedFlag: false
            },
            {
              lensOptionName: "Blue Mirror",
              lensOptionId: 4110007,
              lensOptionCode: "LOP-L-110007",
              price: 100,
              disableFlag: true,
              selectedFlag: false
            }
          ]
        }
      ]
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .query(`salesColorNameId=${testInfo.salesColorNameId}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expected);
  });

  test("異常系_ステータス404", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      cartInfoGetResponse.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンスボディ期待値
    const expected = {
      code: "COM_0002",
      message: "Specified data not found."
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe(expected.code);
      expect(response.body.message).toBe(expected.message);
  });

  test("異常系_ステータス500", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      cartInfoGetResponse.case1,
      salesLensSearchGetResponse.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンスボディ期待値
    const expected = {
      code: "COM_0000",
      message: "Unexpected error occurred."
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
      expect(response.statusCode).toBe(500);
      expect(response.body.code).toBe(expected.code);
      expect(response.body.message).toBe(expected.message);
  });

  test("正常系_データ無", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      cartInfoGetResponse.case3,
      salesLensSearchGetResponse.case3,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンスボディ期待値
    const expected = {
      itemSalesLensSpecInfo: [
        {
          categoryName: "Lens Coating",
          lensOptionList: [],
        },
      ]
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expected);
  });

  test("正常系_データnull", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      cartInfoGetResponse.case4,
      salesLensSearchGetResponse.case4,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンスボディ期待値
    const expected = {
      itemSalesLensSpecInfo: [
        {
          categoryName: "Lens Coating",
          lensOptionList: [
            {
              "disableFlag": true,
              "selectedFlag": true,
            }
          ],
        },
      ]
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expected);
  });

});
