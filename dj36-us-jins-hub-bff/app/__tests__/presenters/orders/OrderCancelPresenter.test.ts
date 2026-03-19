import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import request from "supertest";
import { 
  getOrderByReceptionNumberResponses, 
  postOrderCancelResponses,
  postReturnsResponses,
} from "~/__tests__/presenters/orders/mockResponses/OrderCancelPresenterMockResponse";
import app from "~/app";
import * as fetchService from "~/src/utils/fetchService";

// テスト用定数
const testInfo = {
  url: "/api/sales/orders-cancel",
  receptionNumber: "241031US00001",
  jinsTraceId: crypto.randomUUID(),
  staffId: "U00001",
  itemGroupCode: "250114US000011-1",
  xCursor: "test",
}

let executeCode = "1";
let reasonCode = "01";

// BFF層リクエストボディ
const body = {
  get executeCode() {
    return executeCode;
  },
  get reasonCode() {
    return reasonCode;
  }
};

describe("PUT " + testInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  test("正常系_注文キャンセルAPI", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getOrderByReceptionNumberResponses.case1,
      postOrderCancelResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(204);
  });

  test("正常系_注文キャンセルAPI_必須項目のみ", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getOrderByReceptionNumberResponses.case4,
      // TODO
      postOrderCancelResponses.case3,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(204);
  });

  test("正常系_注文キャンセルAPI(注文部分キャンセル)", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getOrderByReceptionNumberResponses.case1,
      postOrderCancelResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    executeCode = "2";
    reasonCode = "11";

    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .query(`itemGroupCode=${testInfo.itemGroupCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(204);
  });

  test("正常系_注文返品API", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getOrderByReceptionNumberResponses.case1,
      postReturnsResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    executeCode = "3";
    reasonCode = "21";

    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .query(`itemGroupCode=${testInfo.itemGroupCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(204);
  });

  test("異常系_実行コード_商品コード_バリデーションエラー_取消", async () => {
    executeCode = "1";
    reasonCode = "01";
    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .query(`itemGroupCode=${testInfo.itemGroupCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
  });

  test("異常系_実行コード_商品コード_バリデーションエラー_キャンセル", async () => {
    executeCode = "2";
    reasonCode = "01";
    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
  });

  test("異常系_実行コード_商品コード_バリデーションエラー_返品", async () => {
    executeCode = "3";
    reasonCode = "01";
    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
  });

  test("異常系_実行コード_理由コード_バリデーションエラー", async () => {
    executeCode = "2";
    reasonCode = "01";
    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .query(`itemGroupCode=${testInfo.itemGroupCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
  });

  test("異常系_実行コード_理由コード_組み合わせなし", async () => {
    executeCode = "4";
    reasonCode = "01";
    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .query(`itemGroupCode=${testInfo.itemGroupCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
  });
  
  test("異常系_注文詳細取得エラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getOrderByReceptionNumberResponses.case3,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    executeCode = "3";
    reasonCode = "21";

    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .query(`itemGroupCode=${testInfo.itemGroupCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(500);
  });

  test("異常系_注文キャンセルエラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getOrderByReceptionNumberResponses.case1,
      postOrderCancelResponses.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    executeCode = "1";
    reasonCode = "01";

    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(500);
    expect(response.text).toMatch(/\"code\":\"COM_0002\"/);
    expect(response.text).toMatch(/\"message\":\"Specified data not found.\"/);
  });

  test("異常系_注文キャンセル(注文部分キャンセル)エラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getOrderByReceptionNumberResponses.case1,
      postOrderCancelResponses.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    executeCode = "2";
    reasonCode = "11";

    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .query(`itemGroupCode=${testInfo.itemGroupCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(500);
    expect(response.text).toMatch(/\"code\":\"COM_0002\"/);
    expect(response.text).toMatch(/\"message\":\"Specified data not found.\"/);
  });

  test("異常系_返品エラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getOrderByReceptionNumberResponses.case1,
      postReturnsResponses.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    executeCode = "3";
    reasonCode = "21";

    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .query(`itemGroupCode=${testInfo.itemGroupCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(500);
    expect(response.text).toMatch(/\"code\":\"COM_0002\"/);
    expect(response.text).toMatch(/\"message\":\"Specified data not found.\"/);
  });

  test("異常系_注文キャンセル_メガネ行コードなし", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getOrderByReceptionNumberResponses.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    executeCode = "2";
    reasonCode = "11";
    const itemGroupCode = "250114US000011-2"

    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .query(`itemGroupCode=${itemGroupCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
  });

  test("異常系_返品_メガネ行コードなし", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getOrderByReceptionNumberResponses.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    executeCode = "3";
    reasonCode = "21";

    const response = await request(app)
      .put(testInfo.url + `/${testInfo.receptionNumber}`)
      .query(`itemGroupCode=${testInfo.itemGroupCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
  });
});
