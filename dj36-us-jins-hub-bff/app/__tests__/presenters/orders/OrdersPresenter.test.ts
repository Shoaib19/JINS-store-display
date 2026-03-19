import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import request from "supertest";
import {
  getCartInfoResponse,
  putItemGroupsResponses,
  postPlaceOrderByCart,
} from "~/__tests__/presenters/orders/mockResponses/OrdersPresenterMockResponse";
import app from "~/app";
import { logger } from "~/src/logging/logger";
import * as fetchService from "~/src/utils/fetchService";

// テスト用定数
const testInfo = {
  url: "/api/sales/orders",
  receptionNumber: "241031US00001",
  jinsTraceId: crypto.randomUUID(),
  staffId: "U00001",
  customerName: "John Doe",
  phoneNumber: "07012345678",
  jinsAccountId: "00028",
  xCursor: "test",
}

// BFF層リクエストボディ
const body = {
  "customerName": "John Doe",
  "phoneNumber": "07012345678",
  "jinsAccountId": "00028"
};

describe("POST " + testInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
    sendApiRequestSpy.mockReset();
  });

  test("正常系_オーダー確定API", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case1,
      putItemGroupsResponses.case1,
      putItemGroupsResponses.case1,
      postPlaceOrderByCart.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
  });

  test("正常系_会員IDなし_オーダー確定API", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case1,
      postPlaceOrderByCart.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify({...body,jinsAccountId: undefined}));
    expect(response.statusCode).toBe(200);
  });

  test("異常系_カートなし", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case5,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/\"code\":\"COM_0002\"/);
    expect(response.text).toMatch(/\"message\":\"Specified data not found.\"/);
  });

  test("異常系_商品グループなし", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case6,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/\"code\":\"COM_0002\"/);
    expect(response.text).toMatch(/\"message\":\"Specified data not found.\"/);
  });

  test("異常系_カート必須情報なし_受取方法登録エラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/\"code\":\"COM_0001\"/);
    expect(response.text).toMatch(/\"message\":\"Validation error occurred.\"/);
  });

  test("異常系_カート・カタログ取得エラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case3,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(500);
  });

  test("異常系_受取方法登録エラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case1,
      putItemGroupsResponses.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(500);
  });

  test("異常系_注文確定エラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case1,
      putItemGroupsResponses.case1,
      putItemGroupsResponses.case1,
      postPlaceOrderByCart.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(500);
  });

  test("異常系_特注レンズエラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case1,
      putItemGroupsResponses.case1,
      putItemGroupsResponses.case1,
      postPlaceOrderByCart.case3,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("BFF_USSTORESTAFF_0030");
    expect(response.body.message).toBe("(Set 2) The selected lens stock type is incorrect. Please select \"Special order lenses\".")
  });

  test("異常系_特注レンズエラー_商品グループコードがレスポンスに設定なし", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case1,
      putItemGroupsResponses.case1,
      putItemGroupsResponses.case1,
      postPlaceOrderByCart.case4,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("BFF_USSTORESTAFF_0030");
    expect(response.body.message).toBe("The selected lens stock type is incorrect. Please select \"Special order lenses\".")
  });
  test("異常系_フレームエラー_在庫データなし", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case1,
      putItemGroupsResponses.case1,
      putItemGroupsResponses.case1,
      postPlaceOrderByCart.case5,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("BFF_USSTORESTAFF_0030");
    expect(response.body.message).toBe("The selected lens stock type is incorrect. Please select \"Special order lenses\".")
  });
  test("正常系_注文種類それ以外", async () => {
    logger.info("正常系_注文種類それ以外")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case4,
      putItemGroupsResponses.case1,
      postPlaceOrderByCart.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
  });

  test("正常系_保証交換部位ALL", async () => {
    logger.info("正常系_保証交換部位ALL")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case4,
      putItemGroupsResponses.case1,
      postPlaceOrderByCart.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const requestBody = {
      "customerName": "John Doe",
      "phoneNumber": "07012345678",
      "jinsAccountId": "00028",
      "warrantyExchange": {
        "warrantyNumber": "241201US00001-1",
        "replacementPart": "000"
      },
    };

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(requestBody));
    expect(response.statusCode).toBe(200);
  });

   test("正常系_保証交換部位フレーム", async () => {
    logger.info("正常系_保証交換部位フレーム")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case4,
      putItemGroupsResponses.case1,
      postPlaceOrderByCart.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const requestBody = {
      "customerName": "John Doe",
      "phoneNumber": "07012345678",
      "jinsAccountId": "00028",
      "warrantyExchange": {
        "warrantyNumber": "241201US00001-1",
        "replacementPart": "001"
      },
    };

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(requestBody));
    expect(response.statusCode).toBe(200);
  });

  test("正常系_保証交換部位レンズ", async () => {
    logger.info("正常系_保証交換部位レンズ")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case4,
      putItemGroupsResponses.case1,
      postPlaceOrderByCart.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const requestBody = {
      "customerName": "John Doe",
      "phoneNumber": "07012345678",
      "jinsAccountId": "00028",
      "warrantyExchange": {
        "warrantyNumber": "241201US00001-1",
        "replacementPart": "002"
      },
    };

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(requestBody));
    expect(response.statusCode).toBe(200);
  });


  test("正常系_オーダー確定API_配送先情報null", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case7,
      putItemGroupsResponses.case1,
      putItemGroupsResponses.case1,
      postPlaceOrderByCart.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
  });

  test("正常系_オーダー確定API_リクエスト注文者名未設定", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case1,
      putItemGroupsResponses.case1,
      putItemGroupsResponses.case1,
      postPlaceOrderByCart.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    const requestBody = {
      "customerName": null,
      "phoneNumber": "07012345678",
      "jinsAccountId": "00028",
      "warrantyExchange": {
        "warrantyNumber": "241201US00001-1",
        "replacementPart": "002"
      },
    };
    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(requestBody));
    expect(response.statusCode).toBe(400);
  });

  test("正常系_オーダー確定API_リクエスト電話番号未設定", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case1,
      putItemGroupsResponses.case1,
      putItemGroupsResponses.case1,
      postPlaceOrderByCart.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    const requestBody = {
      "customerName": "John Doe",
      "phoneNumber": undefined,
      "jinsAccountId": "00028",
      "warrantyExchange": {
        "warrantyNumber": "241201US00001-1",
        "replacementPart": "002"
      },
    };
    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(requestBody));
    expect(response.statusCode).toBe(200);
  });


  test("異常系_カート必須情報なし_受取方法登録エラー2", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      getCartInfoResponse.case8,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url + `/${testInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/\"code\":\"COM_0001\"/);
    expect(response.text).toMatch(/\"message\":\"Validation error occurred.\"/);
  });


});
