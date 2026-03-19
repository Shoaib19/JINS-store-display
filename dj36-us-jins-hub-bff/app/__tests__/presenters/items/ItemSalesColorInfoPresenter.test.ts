import request from "supertest";
import app from "~/app";
import {
  cartInfoGetResponse,
  salesLensSearchGetResponse,
} from "~/__tests__/presenters/items/mockResponses/itemSalesColorInfoPresenterMockResponce";
import { CommonErrorCode } from "~/src/components/errorCode";

import * as fetchService from "~/src/utils/fetchService";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";

// テスト用定数
const testInfo = {
  url: "/api/sales/item-salescolor",
  storeCode: "83005",
  receptionNumber: "241031US000001",
  itemGroupCode: "241031US000001-1",
  salesColorNameId: 11001,
  salesLensSpecId: 11001,
  jinsTraceId: crypto.randomUUID(),
  staffId: "U00001",
  xCursor: "test",
}

describe("GET " + testInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  test("正常系_対象データ有", async () => {
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

    // レスポンス期待値
    const expected = {
      itemSalesColorInfo: [
        {
          categoryName: "AA",
          subcategory: [
            {
              subcategoryName: "AA",
              lensOptionList: [
                {
                  lensOptionName: "AA",
                  lensOptionId: 10000012,
                  lensOptionCode: "LOP-C110001",
                  price: 198,
                  disableFlag: false,
                  selectedFlag: false,
                }
              ]
            }
          ]
        }
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

  test("正常系_対象データ無", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      cartInfoGetResponse.case2,
      salesLensSearchGetResponse.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンス期待値
    const expected = {
      itemSalesColorInfo: []
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_対象データ有（レンズオプション複数件）", async () => {
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

    // レスポンス期待値
    const expected = {
      itemSalesColorInfo: [
        {
          categoryName: "AA",
          subcategory: [
            {
              subcategoryName: "AA",
              lensOptionList: [
                {
                  lensOptionName: "AA",
                  lensOptionId: 10000012,
                  lensOptionCode: "LOP-C110001",
                  price: 198,
                  disableFlag: false,
                  selectedFlag: true,
                },
                {
                  lensOptionName: "BB",
                  lensOptionId: 10000013,
                  lensOptionCode: "LOP-C110002",
                  price: 298,
                  disableFlag: true,
                  selectedFlag: false,
                },
                {
                  disableFlag: true,
                  selectedFlag: false,
                }
              ]
            }
          ]
        }
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
  
  test("正常系_大分類データなし（nullable-null）", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      cartInfoGetResponse.case3,
      salesLensSearchGetResponse.case4,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンス期待値
    const expected = {
      itemSalesColorInfo: []
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/241031US000001-2`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });
  
  test("正常系_小分類データなし", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      cartInfoGetResponse.case3,
      salesLensSearchGetResponse.case5,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンス期待値
    const expected = {
      itemSalesColorInfo: [
        {
          categoryName: "AA",
          subcategory: []
        }
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
  

  test("異常系_カートカタログ取得API_400エラー", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      cartInfoGetResponse.case4,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンス期待値
    const expected = {
        code: CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.code,
        message: CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.message,
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

  test("異常系_カートカタログ取得API_500エラー", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      cartInfoGetResponse.case5,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンス期待値
    const expected = {
        code: CommonErrorCode.COM_0000_UNEXPECTED_ERROR.code,
        message: CommonErrorCode.COM_0000_UNEXPECTED_ERROR.message,
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

  test("異常系_販売用レンズ検索項目検索API_500エラー", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      cartInfoGetResponse.case1,
      salesLensSearchGetResponse.case6,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンス期待値
    const expected = {
        code: CommonErrorCode.COM_0000_UNEXPECTED_ERROR.code,
        message: CommonErrorCode.COM_0000_UNEXPECTED_ERROR.message,
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
});