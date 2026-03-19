import request from "supertest";
import app from "~/app";
import * as fetchService from "~/src/utils/fetchService";
import { getReceptionsSearchResponse, getReceptionsSearchResponse_noRecord, searchReceptionInformationResponses } from "~/__tests__/presenters/receptions/mockResponses/ReceptionsSearchPresenterMockResponse";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import { components, operations } from "~/src/interfaces/root";

class TestInfo {
  static readonly url = "/api/sales/receptions-search";
  static readonly jinsTraceId = crypto.randomUUID();
  static readonly staffID = "guest";
  static readonly storeCode: string = "83005";
}
// 受付情報検索API
type GetRcptSearchQuery = operations["getReceptionSearch"]["parameters"]["query"];
type RcptSearchGetRequest = GetRcptSearchQuery;
type RcptSearchGetResponse = components["schemas"]["RcptSearchGetResponse"];

const query: RcptSearchGetRequest = {
  keyword: "241230US00001",
  fromReceptionDate: "2025-03-01T00:00:00Z",
  toReceptionDate: "2025-03-21T00:00:00Z",
  countryCodeAlpha2: "US",
  sortKey: "fromReceptionDate:ASC",
  receptionStatusCode: "100"
}

describe("GET " + TestInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  test("正常系_受付情報検索API_継続あり_初期ページ", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponses.case1,
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
    // リクエストのソートキーなし
    copyQuery.sortKey = undefined;

    // レスポンス想定
    const expected = getReceptionsSearchResponse.data

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(copyQuery)
      .set("Content-Type", "application/json")
      .set("x-cursor", "0")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffID", TestInfo.staffID)

    expect(response.statusCode).toBe(200);
    expect(response.get("x-cursor")).toEqual("20");
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付情報検索API_継続あり_中間ページ", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponses.case2,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンス想定
    const expected = getReceptionsSearchResponse.data

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(query)
      .set("Content-Type", "application/json")
      .set("x-cursor", "20")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffID", TestInfo.staffID)

    expect(response.statusCode).toBe(200);
    expect(response.get("x-cursor")).toEqual("40");
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付情報検索API_継続なし_最終ページ", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponses.case3,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンス想定
    const expected = getReceptionsSearchResponse.data

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

  test("正常系_受付情報検索API_継続なし_レコードなし", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponses.case4,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンス想定
    const expected = getReceptionsSearchResponse_noRecord.data

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

  test("正常系_受付情報検索API_ソートキー複数指定", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponses.case1,
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
    copyQuery.sortKey = "fromReceptionDate:ASC,receptionStatusCode:DESC,receptionNumber:ASC";

    // レスポンス想定
    const expected = getReceptionsSearchResponse.data

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(copyQuery)
      .set("Content-Type", "application/json")
      .set("x-cursor", "0")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffID", TestInfo.staffID)

    expect(response.statusCode).toBe(200);
    expect(response.get("x-cursor")).toEqual("20");
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付情報検索API_ステータスコード複数指定", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponses.case1,
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
    copyQuery.receptionStatusCode = "100,101,200";

    // レスポンス想定
    const expected = getReceptionsSearchResponse.data

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(copyQuery)
      .set("Content-Type", "application/json")
      .set("x-cursor", "0")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffID", TestInfo.staffID)

    expect(response.statusCode).toBe(200);
    expect(response.get("x-cursor")).toEqual("20");
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付情報検索API_国コード指定なし", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponses.case1,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // queryのcountryCodeAlpha2をundefinedにする
    const copyQuery = structuredClone(query);
    copyQuery.countryCodeAlpha2 = undefined;
  
    // レスポンス想定
    const expected = getReceptionsSearchResponse.data

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(copyQuery)
      .set("Content-Type", "application/json")
      .set("x-cursor", "0")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffID", TestInfo.staffID)

    expect(response.statusCode).toBe(200);
    expect(response.get("x-cursor")).toEqual("20");
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付情報検索API_クエリパラメータ指定なし", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponses.case1,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
  
    // レスポンス想定
    const expected = getReceptionsSearchResponse.data

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .set("Content-Type", "application/json")
      .set("x-cursor", "0")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffID", TestInfo.staffID)

    expect(response.statusCode).toBe(200);
    expect(response.get("x-cursor")).toEqual("20");
    expect(response.body).toEqual(expected);
  });

  test("異常系_受付情報検索APIエラー", async () => {
    const apiError = {
      headers: new Headers(),
      url: "string",
      status: 500,
      statusText: "",
      data: {details : ""},
    };

    sendApiRequestSpy.mockImplementation(() => {
      throw new ApiError(apiError);
    });

    const response = await request(app)
      .get(TestInfo.url + `/${TestInfo.storeCode}`)
      .query(query)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", crypto.randomUUID())
    expect(response.statusCode).toBe(500);
  });

  test("異常系_受付情報検索API_受付情報検索APIステータス400", async () => {
    // DPFM層APIレスポンスモック
    const mockResponses = [
      searchReceptionInformationResponses.case5,
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

  test("異常系_受付情報検索API_店舗コード指定なし", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponses.case1,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .get(TestInfo.url)
      .query(query)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", crypto.randomUUID())
    expect(response.statusCode).toBe(404);
  });


  test("異常系_受付情報検索API_受付日バリデーションエラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponses.case1,
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

});
