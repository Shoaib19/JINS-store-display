import request from "supertest";
import {
  getGlassLinesSearchResponses,
  getOrderSearchResponse_noRecord,
  getOrderSearchResponseCase1
} from "~/__tests__/presenters/orders/mockResponses/OrderSearchPresenterMockResponse";
import app from "~/app";
import * as fetchService from "~/src/utils/fetchService";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import { components, operations } from "~/src/interfaces/root";

// オーダー情報検索API
type GetOrderSearchQuery = operations["getOrderSearch"]["parameters"]["query"];
export type OrderSearchGetRequest = GetOrderSearchQuery
export type OrderSearchGetResponse = components["schemas"]["OrderSearchResponse"]

class TestInfo {
  static readonly url = "/api/sales/orders-search";
  static readonly jinsTraceId = crypto.randomUUID();
  static readonly staffID = "guest";
  static readonly storeCode: string = "83005";
}

const query: OrderSearchGetRequest = {
  keyword: "callingNumber001",
  orderStatusCode: "300,400,500,800,801,901",
  fromReceptionDate: "2025-01-01T00:00:00Z",
  toReceptionDate: "2025-03-01T00:00:00Z",
  fromPurchaseDate: "2025-01-01",
  toPurchaseDate: "2025-03-01",
  countryCodeAlpha2: "US",
  sortKey: "fromReceptionDate:ASC",
  isSearchingByJinsAccountId: false
}

describe("GET " + TestInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  test("正常系_オーダー情報検索API_継続あり_初期ページ", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getGlassLinesSearchResponses.case1,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンス想定
    const expected = getOrderSearchResponseCase1.data

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(query)
      .set("Content-Type", "application/json")
      .set("x-cursor", "test")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffID", TestInfo.staffID)

    expect(response.statusCode).toBe(200);
    expect(response.get("x-cursor")).toEqual("2");
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダー情報検索API_継続あり_中間ページ", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getGlassLinesSearchResponses.case2,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンス想定
    const expected = getOrderSearchResponseCase1.data

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(query)
      .set("Content-Type", "application/json")
      .set("x-cursor", "3")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffID", TestInfo.staffID)

    expect(response.statusCode).toBe(200);
    expect(response.get("x-cursor")).toEqual("4");
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダー情報検索API_継続なし_最終ページ", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getGlassLinesSearchResponses.case3,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンス想定
    const expected = getOrderSearchResponseCase1.data

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(query)
      .set("Content-Type", "application/json")
      .set("x-cursor", "test")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffID", TestInfo.staffID)

    expect(response.statusCode).toBe(200);
    expect(response.get("x-cursor")).toBeUndefined();
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダー情報検索API_継続なし_レコードなし", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getGlassLinesSearchResponses.case4,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンス想定
    const expected = getOrderSearchResponse_noRecord

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(query)
      .set("Content-Type", "application/json")
      .set("x-cursor", "test")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffID", TestInfo.staffID)

    expect(response.statusCode).toBe(200);
    expect(response.get("x-cursor")).toBeUndefined();
    expect(response.body).toEqual(expected);
  });

  test("異常系_オーダー情報検索API_会員ID検索フラグがtrue", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getGlassLinesSearchResponses.case1,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // queryのisSearchingByJinsAccountIdをtrueにする
    const copyQyery = structuredClone(query);
    copyQyery.isSearchingByJinsAccountId = true;

    // レスポンス想定
    const expected = getOrderSearchResponseCase1.data

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(copyQyery)
      .set("Content-Type", "application/json")
      .set("x-cursor", "test")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffID", TestInfo.staffID)

    expect(response.statusCode).toBe(200);
    expect(response.get("x-cursor")).toEqual("2");
    expect(response.body).toEqual(expected);
  });

  test("異常系_オーダー情報検索API_リクエスト必要項目のみ", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getGlassLinesSearchResponses.case1,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const query: OrderSearchGetRequest = {
      sortKey: "fromReceptionDate:ASC",
      isSearchingByJinsAccountId: false
    }

    // レスポンス想定
    const expected = getOrderSearchResponseCase1.data

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(query)
      .set("Content-Type", "application/json")
      .set("x-cursor", "test")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffID", TestInfo.staffID)

    expect(response.statusCode).toBe(200);
    expect(response.get("x-cursor")).toEqual("2");
    expect(response.body).toEqual(expected);
  });

  test("異常系_オーダー情報検索API_ソートキー複数指定", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getGlassLinesSearchResponses.case1,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // queryのsortKeyをundefinedにする
    const copyQuery = structuredClone(query);
    // リクエストのソートキー複数指定
    copyQuery.sortKey = "fromReceptionDate:ASC,receptionStoreCode:ASC";

    // レスポンス想定
    const expected = getOrderSearchResponseCase1.data

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(query)
      .set("Content-Type", "application/json")
      .set("x-cursor", "test")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffID", TestInfo.staffID)

    expect(response.statusCode).toBe(200);
    expect(response.get("x-cursor")).toEqual("2");
    expect(response.body).toEqual(expected);
  });

  test("異常系_オーダー情報検索API_不明エラー", async () => {
    const apiError = {
      headers: new Headers(),
      url: "string",
      status: 500,
      statusText: "",
      data: {details : ""},
    };

    sendApiRequestSpy.mockImplementation(() => {
      throw apiError;
    });

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(query)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", crypto.randomUUID())
    expect(response.statusCode).toBe(500);
  });

  test("異常系_オーダー情報検索API_管理用注文検索APIステータス400", async () => {
    // DPFM層APIレスポンスモック
    const mockResponses = [
      getGlassLinesSearchResponses.case5,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // queryのsortKeyのorderを変更
    const descSortQuery = structuredClone(query);
    descSortQuery.sortKey = "receptionDateTime:DESC";

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(descSortQuery)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", crypto.randomUUID());
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダー情報検索API_受付日バリデーションエラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getGlassLinesSearchResponses.case1,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // queryのtoReceptionDateをundefinedにする
    const invalidQuery = structuredClone(query);
    invalidQuery.toReceptionDate = undefined;

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(invalidQuery)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", crypto.randomUUID());
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダー情報検索API_購入日バリデーションエラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getGlassLinesSearchResponses.case1,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // queryのfromPurchaseDateをundefinedにする
    const invalidQuery = structuredClone(query);
    invalidQuery.fromPurchaseDate = undefined;

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(invalidQuery)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", crypto.randomUUID());
    expect(response.statusCode).toBe(400);
  });

});
