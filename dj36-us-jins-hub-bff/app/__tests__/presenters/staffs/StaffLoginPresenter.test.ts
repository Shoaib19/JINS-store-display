import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import request from "supertest";
import app from "~/app";
import * as fetchService from "~/src/utils/fetchService";

// テストAPIのURL、ヘッダー
class TestInfo {
  static readonly url = "/api/sales/staffs/login";
  static readonly jinsTraceId = "2389c607-f5ed-4789-95a3-efd78be1e8d9";
  static readonly xCursor = "test";
}

describe("staff login API " + TestInfo.url, () => {
  // クエリーパラメータ型定義
  type QueryParameter = Record<"staffId" | "password", string>;

  // Mock定義
  let sendApiRequestSpy: jest.SpyInstance;

  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  test("get 正常系", async () => {

    // リクエストパラメータ
    const queryParameter: QueryParameter = {staffId: "JINS12345", password: "abcd1234"};

    // DPFM層APIモックレスポンス
    const mockResponse = {
      ok: true,
      status: 200,
      data: {
          "token": "abcdefgh12345678"
      },
    };
    sendApiRequestSpy.mockResolvedValue(mockResponse);

    // レスポンス期待値
    const expected = {
      status: 200,
      body: {
        token: "abcdefgh12345678"
      }
    };

    // テスト
    const response = await request(app)
      .get(TestInfo.url)
      .query(queryParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("x-cursor", TestInfo.xCursor);
    expect(response.statusCode).toBe(expected.status);
    expect(response.body).toEqual(expected.body);
  });

  test("get 異常系 スタッフID不一致", async () => {

    // リクエストパラメータ
    const queryParameter: QueryParameter = {staffId: "JINS23456", password: "abcd1234"};

    // DPFM層APIモックレスポンス
    const mockResponse = {
      ok: false,
      status: 400,
      data: {
        "jinsTraceId": TestInfo.jinsTraceId,
        "code": "COM_0007",
        "message": "Authentication failed.",
        "details": null
      },
    };
    sendApiRequestSpy.mockRejectedValue(new ApiError(mockResponse as unknown as ApiResponse));

    // レスポンス期待値
    const expected = {
      status: 401,
      body: {
        "Jins-Trace-ID": TestInfo.jinsTraceId,
        "timestamp": new Date().toISOString(),
        "code": mockResponse.data.code,
        "message": mockResponse.data.message,
      }
    }

    // テスト
    const response = await request(app)
      .get(TestInfo.url)
      .query(queryParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", "guest");
    expect(response.statusCode).toBe(expected.status);
    expect(response.body.code).toBe(expected.body.code);
    expect(response.body.message).toBe(expected.body.message);
  });

  test("get 異常系 パスワード不一致", async () => {

    // リクエストパラメータ
    const queryParameter: QueryParameter = {staffId: "JINS12345", password: "abc123"};

    // DPFM層APIモックレスポンス
    const mockResponse = {
      ok: false,
      status: 400,
      data: {
        "jinsTraceId": TestInfo.jinsTraceId,
        "code": "COM_0007",
        "message": "Authentication failed.",
        "details": null
      },
    };
    sendApiRequestSpy.mockRejectedValue(new ApiError(mockResponse as unknown as ApiResponse));

    // レスポンス期待値
    const expected = {
      status: 401,
      body: {
        "Jins-Trace-ID": TestInfo.jinsTraceId,
        "timestamp": new Date().toISOString(),
        "code": mockResponse.data.code,
        "message": mockResponse.data.message,
      }
    }

    // テスト
    const response = await request(app)
      .get(TestInfo.url)
      .query(queryParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", "guest");
    expect(response.statusCode).toBe(expected.status);
    expect(response.body.code).toBe(expected.body.code);
    expect(response.body.message).toBe(expected.body.message);
  });

  test("get 異常系 サーバーエラー", async () => {

    // リクエストパラメータ
    const queryParameter: QueryParameter = {staffId: "JINS12345", password: "abc123"};

    // DPFM層APIモックレスポンス
    const mockResponse = {
      ok: false,
      status: 500,
      data: {
        "jinsTraceId": TestInfo.jinsTraceId,
        "code": "COM_0000",
        "message": "Unexpected error occurred.",
        "details": null
      },
    };
    sendApiRequestSpy.mockRejectedValue(new ApiError(mockResponse as unknown as ApiResponse));

    // レスポンス期待値
    const expected = {
      status: 500,
      body: {
        "Jins-Trace-ID": TestInfo.jinsTraceId,
        "timestamp": new Date().toISOString(),
        "code": mockResponse.data.code,
        "message": mockResponse.data.message,
      }
    }

    // テスト
    const response = await request(app)
      .get(TestInfo.url)
      .query(queryParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", "guest");
    expect(response.statusCode).toBe(expected.status);
  });

  test("get 正常系_レスポンス無し", async () => {

    // リクエストパラメータ
    const queryParameter: QueryParameter = {staffId: "JINS12345", password: "abcd1234"};

    // DPFM層APIモックレスポンス
    const mockResponse = {
      ok: true,
      status: 200,
      data: {},
    };
    sendApiRequestSpy.mockResolvedValue(mockResponse);

    // レスポンス期待値
    const expected = {
      status: 200,
      body: {}
    };

    // テスト
    const response = await request(app)
      .get(TestInfo.url)
      .query(queryParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("x-cursor", TestInfo.xCursor);
    expect(response.statusCode).toBe(expected.status);
    expect(response.body).toEqual(expected.body);
  });

});
