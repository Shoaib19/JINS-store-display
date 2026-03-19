import request from "supertest";
import app from "~/app";
import {
  getItemsResponses,
  inventoriesGetResponses,
  findCartResponses,
  getSellingPricesResponses,
} from "~/__tests__/presenters/items/mockResponses/ItemCaseInfoPresenterMockResponse";
import { CommonErrorCode } from "~/src/components/errorCode";

import * as fetchService from "~/src/utils/fetchService";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";

// テスト用定数
const testInfo = {
  url: "/api/sales/item-cases",
  storeCode: "83005",
  receptionNumber: "241031US000001",
  itemGroupCode: "241031US000001-1",
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

  test("正常系_必須パラメータのみ_全データ有", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case1,
      // API呼出1回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case1,
      // API呼出2回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case1,
      // API呼出3回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case1,
      // API呼出4回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case1,
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
      "itemCaseInfo": [
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 102.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "price": 103.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 102.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "price": 103.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 102.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "price": 103.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 102.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "price": 103.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
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

  test("正常系_カートプロパティのみ", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case5,
      // API呼出1回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case1,
      // API呼出2回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case1,
      // API呼出3回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case1,
      // API呼出4回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case1,
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
      "itemCaseInfo": [
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 102.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "price": 103.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 102.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "price": 103.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 102.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "price": 103.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 102.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "price": 103.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
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

  test("正常系_価格同額およびnull", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case1,
      // API呼出1回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case4,
      // API呼出2回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case4,
      // API呼出3回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case4,
      // API呼出4回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case4,
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
      "itemCaseInfo": [
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
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

  test("正常系_カートカタログ取得データ無", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case2,
      // API呼出1回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case1,
      // API呼出2回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case1,
      // API呼出3回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case1,
      // API呼出4回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case1,
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
      "itemCaseInfo": [
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 102.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "price": 103.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 102.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "price": 103.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 102.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "price": 103.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "price": 101.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "price": 102.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "price": 103.01,
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
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

  test("正常系_売価検索データ無", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case1,
      // API呼出1回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case2,
      // API呼出2回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case2,
      // API呼出3回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case2,
      // API呼出4回目
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case2,
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
      "itemCaseInfo": [
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
        },
        {
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": true
        },
        {
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "stockQuantity": 5,
          "disableFlag": false,
          "selectedFlag": false
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

  test("異常系_商品マスタ検索エラー", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case1,
      getItemsResponses.case3
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
      ok: false,
      status: 500,
      data: {
        code: CommonErrorCode.COM_0000_UNEXPECTED_ERROR.code,
        message: CommonErrorCode.COM_0000_UNEXPECTED_ERROR.message,
      }
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(500);
  });

  // test("異常系_在庫検索エラー", async () => {
  //   // DPFM層API Mockレスポンス定義
  //   const mockResponses = [
  //     findCartResponses.case1,
  //     getItemsResponses.case1,
  //     // inventoriesGetResponses.case2,
  //   ];
  //   for (const mockResponse of mockResponses) {
  //     if(mockResponse.ok) {
  //       sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
  //     } else {
  //       sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
  //     }
  //   }

  //   // レスポンス期待値
  //   const expected = {
  //     ok: false,
  //     status: 500,
  //     data: {
  //       code: CommonErrorCode.COM_0000_UNEXPECTED_ERROR.code,
  //       message: CommonErrorCode.COM_0000_UNEXPECTED_ERROR.message,
  //     }
  //   };

  //   // テスト実行
  //   const response = await request(app)
  //     .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
  //     .set("jins-trace-id", testInfo.jinsTraceId)
  //     .set("staffid", testInfo.staffId)
  //     .set("x-cursor", testInfo.xCursor);
  //   expect(response.statusCode).toBe(500);
  // });

  test("異常系_カートカタログ取得エラー", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case3,
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
      ok: false,
      status: 500,
      data: {
        code: CommonErrorCode.COM_0000_UNEXPECTED_ERROR.code,
        message: CommonErrorCode.COM_0000_UNEXPECTED_ERROR.message,
      }
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_売価検索エラー", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findCartResponses.case1,
      getItemsResponses.case1,
      // inventoriesGetResponses.case1,
      getSellingPricesResponses.case3,
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
      ok: false,
      status: 500,
      data: {
        code: CommonErrorCode.COM_0000_UNEXPECTED_ERROR.code,
        message: CommonErrorCode.COM_0000_UNEXPECTED_ERROR.message,
      }
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_カート・カタログ取得_ステータス404", async () => {
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
      "jins-trace-id": testInfo.jinsTraceId,
      "systemName": "DJ36-Sales",
      "code": "COM_0002",
      "message": "Specified data not found.",
      "details": ""
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
      expect(response.statusCode).toBe(400);
      expect(response.text).toMatch(/\"code\":\"COM_0002\"/);
      expect(response.text).toMatch(/\"message\":\"Specified data not found.\"/);
  });
});  