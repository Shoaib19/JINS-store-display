import request from "supertest";
import app from "~/app";
import { components } from "~/src/interfaces/root";
import { CommonErrorCode } from "~/src/components/errorCode";
import {
  getOrderResponse,
  findWarrantiesResponse,
  findWarrantyHistoriesResponse,
  getPowersResponse,
  getStoreAttributesResponse,
  getLensUniqueAttributesResponse,
} from "~/__tests__/presenters/jobTickets/mockResponses/JobTicketsPresenterMockResponse";

import * as fetchService from "~/src/utils/fetchService";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";

// テスト用定数
const testInfo = {
  url: "/api/sales/job-tickets",
  storeCode: "83005",
  receptionNumber: "250424US000010",
  itemGroupCode: "250424US000010-1",
  jinsTraceId: crypto.randomUUID(),
  staffId: "U00001",
  xCursor: "test",
}

// 保証書・加工指示書・引換票レスポンスボディ
type OrderVoucherResponse = components["schemas"]["OrderVoucherResponse"];
  
describe("GET " + `${testInfo.url}/{storeCode}/{receptionNumber}/{itemGroupCode}`, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  test("正常系_常備品", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case1,
      getPowersResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findWarrantiesResponse.case1,
      getStoreAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
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
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expectedRegular);
  });

  test("正常系_特注品", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case1,
      getPowersResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findWarrantiesResponse.case1,
      getStoreAttributesResponse.case1,
      getLensUniqueAttributesResponse.case2,
      getLensUniqueAttributesResponse.case2,
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
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expectedSpecial);
  });

  test("正常系_保証交換注文", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case2,
      getPowersResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findWarrantiesResponse.case1,
      getStoreAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンスボディ期待値
    const expected = structuredClone(expectedRegular);
    expected.customerInfo.hasJinsAccountId = false;
    expected.warrantyInfo = {
      warrantyCount: findWarrantiesResponse.case1.data.warrantyInfo.exchangeCount,
      originalReceptionNumber: findWarrantiesResponse.case1.data.warrantyInfo.receptionNumber,
    };
    expected.handOverDate = "2025-04-25T08:00:00Z";

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expected);
  });

  test("正常系_保証交換注文_保証回数カウント", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case2,
      getPowersResponse.case1,
      findWarrantyHistoriesResponse.case4,
      findWarrantiesResponse.case1,
      getStoreAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンスボディ期待値
    const expected = structuredClone(expectedRegular);
    expected.customerInfo.hasJinsAccountId = false;
    expected.warrantyInfo = {
      warrantyCount: findWarrantiesResponse.case1.data.warrantyInfo.exchangeCount + 1,
      originalReceptionNumber: findWarrantiesResponse.case1.data.warrantyInfo.receptionNumber,
    };
    expected.handOverDate = "2025-04-25T08:00:00Z";

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expected);
  });

  test("正常系_保証交換注文_保証回数カウント_保障情報なし", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case2,
      getPowersResponse.case1,
      findWarrantyHistoriesResponse.case4,
      findWarrantiesResponse.case3,
      getStoreAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンスボディ期待値
    const expected = structuredClone(expectedRegular);
    expected.purchaseDate = "";
    expected.customerInfo.hasJinsAccountId = false;
    expected.warrantyInfo = {
      warrantyCount: 1,
    };
    expected.handOverDate = "2025-04-25T08:00:00Z";

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expected);
  });

  test("正常系_度数・処方箋ステータス404", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case1,
      getPowersResponse.case2,
      findWarrantyHistoriesResponse.case1,
      findWarrantiesResponse.case1,
      getStoreAttributesResponse.case1,
      getLensUniqueAttributesResponse.case5,
      getLensUniqueAttributesResponse.case5,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // レスポンスボディ期待値
    const expected = structuredClone(expectedRegular);
    expected.prescription = null;
    expected.prescriptionInfo = null;
    expected.lensoption.LLens = "";
    expected.lensoption.RLens = "";

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expected);
  });

  test("正常系_保証履歴ステータス404", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case1,
      getPowersResponse.case1,
      findWarrantyHistoriesResponse.case2,
      findWarrantiesResponse.case1,
      getStoreAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
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
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expectedRegular);
  });

  test("正常系_nullable:null", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case1,
      getPowersResponse.case5,
      findWarrantyHistoriesResponse.case1,
      findWarrantiesResponse.case1,
      getStoreAttributesResponse.case4,
      getLensUniqueAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // テスト期待値
    const expected = structuredClone(expectedRegular);
    expected.prescription = {};
    expected.prescriptionInfo = {
      ...expected.prescriptionInfo!,
      cylLeft: null,
      cylRight: null,
      eyepointLeft: null,
      eyepointRight: null,
      pdLeft: null,
      pdRight: null,
      perspectiveTypeCode: null,
      sphLeft: null,
      sphRight: null,
      vision: null,
    };
    expected.storePhoneNumber = "";

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expected);
  });

  test("正常系_注文詳細以外データ無し", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case8,
      getPowersResponse.case4,
      findWarrantyHistoriesResponse.case5,
      findWarrantiesResponse.case3,
      getStoreAttributesResponse.case3,
      getLensUniqueAttributesResponse.case4,
      getLensUniqueAttributesResponse.case4,
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
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expectedUndefined);
  });

  test("異常系_メガネ行なし", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case3,
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
      expect(response.statusCode).toBe(400);
      expect(response.body["Jins-Trace-ID"]).toBe(testInfo.jinsTraceId);
      expect(response.body.systemName).toBe("BFF");
      expect(response.body.code).toBe(CommonErrorCode.COM_0001_VALIDATION_ERROR.code);
      expect(response.body.message).toBe(CommonErrorCode.COM_0001_VALIDATION_ERROR.message);
  });

  test("異常系_商品グループコード一致メガネ行なし", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case4,
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
      expect(response.statusCode).toBe(400);
      expect(response.body["Jins-Trace-ID"]).toBe(testInfo.jinsTraceId);
      expect(response.body.systemName).toBe("BFF");
      expect(response.body.code).toBe(CommonErrorCode.COM_0001_VALIDATION_ERROR.code);
      expect(response.body.message).toBe(CommonErrorCode.COM_0001_VALIDATION_ERROR.message);
  });

  test("異常系_度数IDなし", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case5,
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
      expect(response.statusCode).toBe(400);
      expect(response.body["Jins-Trace-ID"]).toBe(testInfo.jinsTraceId);
      expect(response.body.systemName).toBe("BFF");
      expect(response.body.code).toBe(CommonErrorCode.COM_0001_VALIDATION_ERROR.code);
      expect(response.body.message).toBe(CommonErrorCode.COM_0001_VALIDATION_ERROR.message);
  });

  test("異常系_注文日なし", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case6,
      getPowersResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findWarrantiesResponse.case1,
      getStoreAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // 期待値
    const expected = structuredClone(expectedRegular);
    expected.customerInfo.hasJinsAccountId = false;
    expected.handOverDate = "";

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expected);
  });

  test("異常系_受取予定日時なし", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case6a,
      getPowersResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findWarrantiesResponse.case1,
      getStoreAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
      getLensUniqueAttributesResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    // 期待値
    const expected = structuredClone(expectedRegular);
    expected.customerInfo.hasJinsAccountId = false;
    expected.handOverDate = "";

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expected);
  });

  test("異常系_注文詳細ステータス404", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case7,
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
      expect(response.statusCode).toBe(400);
      // expect(response.body["jins-trace-id"]).toBe(testInfo.jinsTraceId);
      // expect(response.body.systemName).toBe("DJ36-Sales");
      // expect(response.body.code).toBe(CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.code);
      // expect(response.body.message).toBe(CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.message);
  });

  test("異常系_度数・処方箋ステータス409", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case1,
      getPowersResponse.case3,
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
      expect(response.statusCode).toBe(409);
      // expect(response.body["jins-trace-id"]).toBe(testInfo.jinsTraceId);
      // expect(response.body.systemName).toBe("DJ36-Sales");
      // expect(response.body.code).toBe(CommonErrorCode.COM_0003_OPTIMISTIC_LOCK_FAILED.code);
      // expect(response.body.message).toBe(CommonErrorCode.COM_0003_OPTIMISTIC_LOCK_FAILED.message);
  });

  test("異常系_保証履歴ステータス429", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case1,
      getPowersResponse.case1,
      findWarrantyHistoriesResponse.case3,
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
      expect(response.statusCode).toBe(429);
      // expect(response.body["jins-trace-id"]).toBe(testInfo.jinsTraceId);
      // expect(response.body.systemName).toBe("DJ36-Sales");
      // expect(response.body.code).toBe(CommonErrorCode.COM_0004_DUPLICATE_API_CALL.code);
      // expect(response.body.message).toBe("Too Many Requests.");
      // expect(response.body.details).toBe(CommonErrorCode.COM_0004_DUPLICATE_API_CALL.message);
  });

  test("異常系_保証情報ステータス500", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case1,
      getPowersResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findWarrantiesResponse.case2,
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
      // expect(response.body["jins-trace-id"]).toBe(testInfo.jinsTraceId);
      // expect(response.body.systemName).toBe("DJ36-Sales");
      // expect(response.body.code).toBe(CommonErrorCode.COM_0000_UNEXPECTED_ERROR.code);
      // expect(response.body.message).toBe("Internal Server Error.");
      // expect(response.body.details).toBe(CommonErrorCode.COM_0000_UNEXPECTED_ERROR.message);
  });

  test("異常系_店舗属性情報ステータス500", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case1,
      getPowersResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findWarrantiesResponse.case1,
      getStoreAttributesResponse.case2,
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
      // expect(response.body["jins-trace-id"]).toBe(testInfo.jinsTraceId);
      // expect(response.body.systemName).toBe("DJ36-Sales");
      // expect(response.body.code).toBe(CommonErrorCode.COM_0000_UNEXPECTED_ERROR.code);
      // expect(response.body.message).toBe("Unexpected error occurred.");
      // expect(response.body.details).toBe(CommonErrorCode.COM_0000_UNEXPECTED_ERROR.message);
  });

  test("異常系_レンズ固有属性ステータス400", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      getOrderResponse.case1,
      getPowersResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findWarrantiesResponse.case1,
      getStoreAttributesResponse.case1,
      getLensUniqueAttributesResponse.case3,
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
      expect(response.statusCode).toBe(400);
      // expect(response.body["jins-trace-id"]).toBe(testInfo.jinsTraceId);
      // expect(response.body.systemName).toBe("DJ36-Sales");
      // expect(response.body.code).toBe(CommonErrorCode.COM_0001_VALIDATION_ERROR.code);
      // expect(response.body.message).toBe(CommonErrorCode.COM_0001_VALIDATION_ERROR.message);
  });

  test("異常系_発生不可能エラー", async () => {
    sendApiRequestSpy.mockResolvedValue({});

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.storeCode}/${testInfo.receptionNumber}/${testInfo.itemGroupCode}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
      expect(response.statusCode).toBe(500);
      expect(response.body["Jins-Trace-ID"]).toBe(testInfo.jinsTraceId);
      expect(response.body.systemName).toBe("BFF");
      expect(response.body.code).toBe(CommonErrorCode.COM_0000_UNEXPECTED_ERROR.code);
      expect(response.body.message).toBe(CommonErrorCode.COM_0000_UNEXPECTED_ERROR.message);
  });

});

// レスポンスボディ期待値_常備品
const expectedRegular: OrderVoucherResponse = {
  storeName: "Del Amo",
  storePhoneNumber: "1(315)272-4132",
  receptionNumber: "250424US000010",
  warrantyNumber: "250424US000010-1",
  warrantyInfo: null,
  customerInfo: {
    phoneNumber: "7033644443",
    customerName: "Michel Moore",
    hasJinsAccountId: true
  },
  itemCaseInfo: {
    caseName: "JINS 新定番 ｻｰﾋﾞｽｹｰｽ小 ﾊｰﾄﾞ(ｸﾞﾚｰｼﾞｭ)"
  },
  lensoption: {
    salesColorNameItemName: "CLEAR",
    salesLensSpecItemName: "Standard",
    progressiveCategoryItemName: "None",
    refractiveIndexNameItemName: "1.60 Index",
    RLens: "1.60 MR-8 SV AS(In-stock)",
    LLens: "1.60 MR-8 SV AS(In-stock)",
    displayTitle: "CLEAR"
  },
  lensReplacement: {
    lensReplacementFlag: false
  },
  frame: {
    productCode: "LCF-18S-337-57"
  },
  prescription: {
    prescriptionExpiration: "2026-04-24T07:00:00Z"
  },
  prescriptionInfo: {
    vision: 1.3,
    perspectiveTypeCode: "002",
    sphRight: -1,
    sphLeft: -1,
    cylRight: -1,
    cylLeft: -1,
    axisRight: null,
    axisLeft: null,
    pdRight: 30,
    pdLeft: 30,
    addRight: null,
    addLeft: null,
    eyepointRight: 0,
    eyepointLeft: 0,
    prismFlag: false
  },
  deliveryInfo: {
    deliveryMethodCode: "000"
  },
  purchaseDate: "2025-04-24T12:34:56Z",
  handOverDate: "2025-04-26T08:00:00Z"
};

// レスポンスボディ期待値_特注品
const expectedSpecial: OrderVoucherResponse = {
  storeName: "Del Amo",
  storePhoneNumber: "1(315)272-4132",
  receptionNumber: "250424US000010",
  warrantyNumber: "250424US000010-1",
  warrantyInfo: null,
  customerInfo: {
    phoneNumber: "7033644443",
    customerName: "Michel Moore",
    hasJinsAccountId: true
  },
  itemCaseInfo: {
    caseName: "JINS 新定番 ｻｰﾋﾞｽｹｰｽ小 ﾊｰﾄﾞ(ｸﾞﾚｰｼﾞｭ)"
  },
  lensoption: {
    salesColorNameItemName: "CLEAR",
    salesLensSpecItemName: "Standard",
    progressiveCategoryItemName: "None",
    refractiveIndexNameItemName: "1.60 Index",
    RLens: "1.60 SV AS MR-8 ETC Rx H",
    LLens: "1.60 SV AS MR-8 ETC Rx H",
    displayTitle: "CLEAR"
  },
  lensReplacement: {
    lensReplacementFlag: false
  },
  frame: {
    productCode: "LCF-18S-337-57"
  },
  prescription: {
    prescriptionExpiration: "2026-04-24T07:00:00Z"
  },
  prescriptionInfo: {
    vision: 1.3,
    perspectiveTypeCode: "002",
    sphRight: -1,
    sphLeft: -1,
    cylRight: -1,
    cylLeft: -1,
    axisRight: null,
    axisLeft: null,
    pdRight: 30,
    pdLeft: 30,
    addRight: null,
    addLeft: null,
    eyepointRight: 0,
    eyepointLeft: 0,
    prismFlag: false
  },
  deliveryInfo: {
    deliveryMethodCode: "000"
  },
  purchaseDate: "2025-04-24T12:34:56Z",
  handOverDate: "2025-05-15T07:00:00Z"
};

// レスポンスボディ期待値_注文詳細以外データ無し
const expectedUndefined: OrderVoucherResponse = {
  storeName: "",
  storePhoneNumber: "",
  receptionNumber: "250424US000010",
  warrantyNumber: "250424US000010-1",
  warrantyInfo: null,
  customerInfo: {
    phoneNumber: "",
    customerName: "",
    hasJinsAccountId: false
  },
  itemCaseInfo: {
    caseName: ""
  },
  lensoption: {
    salesColorNameItemName: "",
    salesLensSpecItemName: "",
    progressiveCategoryItemName: "",
    refractiveIndexNameItemName: "",
    RLens: "",
    LLens: "",
    displayTitle: ""
  },
  lensReplacement: {
    lensReplacementFlag: false
  },
  frame: {
    productCode: ""
  },
  prescription: {},
  prescriptionInfo: {
    perspectiveTypeCode: null,
    sphRight: null,
    sphLeft: null,
    cylRight: null,
    cylLeft: null,
    axisRight: null,
    axisLeft: null,
    pdRight: null,
    pdLeft: null,
    addRight: null,
    addLeft: null,
    eyepointRight: null,
    eyepointLeft: null,
    prismFlag: false
  },
  deliveryInfo: {
    deliveryMethodCode: ""
  },
  purchaseDate: "",
  handOverDate: "2025-05-15T07:00:00Z"
};
