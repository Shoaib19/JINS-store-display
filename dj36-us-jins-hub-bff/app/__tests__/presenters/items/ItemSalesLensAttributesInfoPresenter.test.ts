import request from "supertest";
import app from "~/app";
import {
  findCartResponses,
  getSalesLensSearchResponsesProgressiveCategory,
  getSalesLensSearchResponsesRefractiveIndexName,
  impossibleErrorResponses,
} from "~/__tests__/presenters/items/mockResponses/ItemSalesLensAttributesInfoPresenterMockResponse";
import { CommonErrorCode } from "~/src/components/errorCode";

import * as fetchService from "~/src/utils/fetchService";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";

// テスト用定数
const testInfo = {
  url: "/api/sales/item-saleslensattributes",
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

  test("正常系_必須パラメータのみ_対象データ有", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case1,
      getSalesLensSearchResponsesProgressiveCategory.case1,
      getSalesLensSearchResponsesRefractiveIndexName.case1,
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
      itemProgressCategoryInfo: [
        {
          categoryName: "Progressive Lens Design",
          lensOptionList: [
            {
              lensOptionName: "None",
              lensOptionId: 20000001,
              lensOptionCode: "LOP-P110001",
              price: 29.8,
              disableFlag: false,
              selectedFlag: true,
            }, {
              lensOptionName: "Soft",
              lensOptionId: 20000002,
              lensOptionCode: "LOP-P120001",
              price: 39.8,
              disableFlag: false,
              selectedFlag: false,
            }, {
              lensOptionName: "Hard",
              lensOptionId: 20000003,
              lensOptionCode: "LOP-P130001",
              price: 49.8,
              disableFlag: false,
              selectedFlag: false,
            },
          ]
        }
      ],
      itemRefractiveIndexNameInfo: [
        {
          categoryName: "Refractive Index",
          lensOptionList: [
            {
              lensOptionName: "Thin 1.50",
              lensOptionId: 30000001,
              lensOptionCode: "LOP-R110001",
              price: 39.8,
              disableFlag: false,
              selectedFlag: true,
            }, {
              lensOptionName: "Thin 1.60",
              lensOptionId: 30000002,
              lensOptionCode: "LOP-R120001",
              price: 45.2,
              disableFlag: false,
              selectedFlag: false,
            }, {
              lensOptionName: "Thin 1.67",
              lensOptionId: 30000003,
              lensOptionCode: "LOP-R130001",
              price: 49.8,
              disableFlag: true,
              selectedFlag: false,
            }
          ]
        }
      ],
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

  test("正常系_必須パラメータのみ_対象データ無", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case2,
      getSalesLensSearchResponsesProgressiveCategory.case2,
      getSalesLensSearchResponsesRefractiveIndexName.case2,
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
      itemProgressCategoryInfo: [
        {
          categoryName: "Progressive Lens Design",
          lensOptionList: []
        }
      ],
      itemRefractiveIndexNameInfo: [
        {
          categoryName: "Refractive Index",
          lensOptionList: []
        }
      ],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/241031US000001-X`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_全パラメータ_対象データ有", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case3,
      getSalesLensSearchResponsesProgressiveCategory.case3,
      getSalesLensSearchResponsesRefractiveIndexName.case3,
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
      itemProgressCategoryInfo: [
        {
          categoryName: "Progressive Lens Design",
          lensOptionList: [
            {
              lensOptionName: "None",
              lensOptionId: 20000001,
              lensOptionCode: "LOP-P110001",
              price: 29.8,
              disableFlag: false,
              selectedFlag: true,
            },
          ]
        }
      ],
      itemRefractiveIndexNameInfo: [
        {
          categoryName: "Refractive Index",
          lensOptionList: [
            {
              lensOptionName: "Thin 1.50",
              lensOptionId: 30000001,
              lensOptionCode: "LOP-R110001",
              price: 39.8,
              disableFlag: false,
              selectedFlag: true,
            },
          ]
        }
      ],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .query(`salesColorNameId=${testInfo.salesColorNameId}`)
      .query(`salesLensSpecId=${testInfo.salesLensSpecId}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("異常系_カートカタログ取得APIエラー", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case4,
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
    expect(response.body.code).toEqual(expected.code);
    expect(response.body.message).toEqual(expected.message);
  });

  test("異常系_販売用レンズ検索項目検索API（累進分類）エラー", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case3,
      getSalesLensSearchResponsesProgressiveCategory.case4,
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
      message: "Unexpected error occurred.",
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(500);
    expect(response.body.code).toEqual(expected.code);
    expect(response.body.message).toEqual(expected.message);
  });

  test("異常系_販売用レンズ検索項目検索API（屈折率名称）エラー", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case3,
      getSalesLensSearchResponsesProgressiveCategory.case3,
      getSalesLensSearchResponsesRefractiveIndexName.case4,
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
      message: "Unexpected error occurred.",
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(500);
    expect(response.body.code).toEqual(expected.code);
    expect(response.body.message).toEqual(expected.message);
  });

  test("異常系_発生不可能エラーステータス無し", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      impossibleErrorResponses.case3,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(500);
  });

  test("正常系_必須パラメータのみ_対象データ有(DPFM:null）", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case1,
      getSalesLensSearchResponsesProgressiveCategory.case5,
      getSalesLensSearchResponsesRefractiveIndexName.case5,
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
      itemProgressCategoryInfo: [
        {
          categoryName: "Progressive Lens Design",
          lensOptionList: [
            {
              disableFlag: true,
              selectedFlag: false,
            },
          ]
        }
      ],
      itemRefractiveIndexNameInfo: [
        {
          categoryName: "Refractive Index",
          lensOptionList: [
            {
              disableFlag: true,
              selectedFlag: false,
            }
          ]
        }
      ],
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