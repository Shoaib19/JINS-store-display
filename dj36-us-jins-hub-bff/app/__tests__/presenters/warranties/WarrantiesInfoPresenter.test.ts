import request from "supertest";
import app from "~/app";
import {
  frameExchangeCount,
  lensExchangeCount,
  findWarrantiesResponse,
  findWarrantyHistoriesResponse,
} from "~/__tests__/presenters/warranties/mockResponses/WarrantiesInfoPresenterMockResponse";

import * as fetchService from "~/src/utils/fetchService";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";

// テスト用定数
const testInfo = {
  url: "/api/sales/warranty-replacements",
  warrantyNumber: "250501US000001-1",
  receptionNumber: "250501US000002",
  jinsTraceId: crypto.randomUUID(),
  staffId: "U00001",
  xCursor: "test",
}

describe("GET " + `${testInfo.url}/{warrantyNumber}/{receptionNumber}`, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    jest.useFakeTimers();
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  test("正常系_交換可", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantiesResponse.case1,
      findWarrantyHistoriesResponse.case1
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    jest.setSystemTime(new Date('2025-05-10T12:34:56Z'));

    // レスポンス期待値
    const expected = {
      replacementType: "001",
      replacementPart: "004",
      replacementReason: "002",
      exchangeCountIncrementFlag: true,
      alertCode: null,
      alertMessage: null
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.receptionNumber}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_交換不可_期限切れ", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantiesResponse.case2,
      findWarrantyHistoriesResponse.case1
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    jest.setSystemTime(new Date('2025-06-10T12:34:56Z'));

    // レスポンス期待値
    // const expirationDate = new Date(Number(dateBefore1Year.substring(0, 4)) + 1, Number(dateBefore1Year.substring(5, 7)) - 1, Number(dateBefore1Year.slice(-2)));
    const expirationDate = new Date(2025, 2-1, 28);
    const expected = {
      replacementType: "001",
      replacementPart: "004",
      replacementReason: "002",
      exchangeCountIncrementFlag: true,
      alertCode: "Warranty Expired.",
      alertMessage: `The warranty for this order expired on `
        + `${expirationDate.toLocaleDateString()}.`
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.receptionNumber}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_交換不可_回数切れ", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantiesResponse.case3,
      findWarrantyHistoriesResponse.case1
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    jest.setSystemTime(new Date('2025-06-10T12:34:56Z'));

    // レスポンス期待値
    const expected = {
      replacementType: "001",
      replacementPart: "004",
      replacementReason: "002",
      exchangeCountIncrementFlag: true,
      alertCode: "Warranty limit reached.",
      alertMessage: `For this order, the frame can be replaced ${1 - frameExchangeCount} times,`
        + ` and the lenses can be replaced ${1 - lensExchangeCount} time.`
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.receptionNumber}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_交換可_保証対象無し", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantiesResponse.case4,
      findWarrantyHistoriesResponse.case5
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    jest.setSystemTime(new Date('2025-06-10T12:34:56Z'));

    // レスポンス期待値
    const expected = {
      replacementType: null,
      replacementPart: null,
      replacementReason: null,
      exchangeCountIncrementFlag: null,
      alertCode: null,
      alertMessage: null
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.receptionNumber}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_交換可_１件目保証開始日無し", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantiesResponse.case5,
      findWarrantyHistoriesResponse.case1
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    jest.setSystemTime(new Date('2025-06-10T12:34:56Z'));

    // レスポンス期待値
    const expected = {
      replacementType: "001",
      replacementPart: "004",
      replacementReason: "002",
      exchangeCountIncrementFlag: true,
      alertCode: null,
      alertMessage: null
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.receptionNumber}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_交換可_２件目保証開始日無し", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantiesResponse.case6,
      findWarrantyHistoriesResponse.case1
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    jest.setSystemTime(new Date('2025-06-10T12:34:56Z'));

    // レスポンス期待値
    const expected = {
      replacementType: "001",
      replacementPart: "004",
      replacementReason: "002",
      exchangeCountIncrementFlag: true,
      alertCode: null,
      alertMessage: null
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.receptionNumber}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_交換不可_期限切れ_閏日", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantiesResponse.case7,
      findWarrantyHistoriesResponse.case1
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    jest.setSystemTime(new Date('2025-06-10T12:34:56Z'));

    // レスポンス期待値
    const expirationDate = new Date(2025, 2-1, 28);
    const expected = {
      replacementType: "001",
      replacementPart: "004",
      replacementReason: "002",
      exchangeCountIncrementFlag: true,
      alertCode: "Warranty Expired.",
      alertMessage: `The warranty for this order expired on `
        + `${expirationDate.toLocaleDateString()}.`
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.receptionNumber}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_交換可_商品タイプ無し", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantiesResponse.case8,
      findWarrantyHistoriesResponse.case1
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    jest.setSystemTime(new Date('2025-06-10T12:34:56Z'));

    // レスポンス期待値
    const expected = {
      replacementType: "001",
      replacementPart: "004",
      replacementReason: "002",
      exchangeCountIncrementFlag: true,
      alertCode: null,
      alertMessage: null
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.receptionNumber}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_交換可_保証履歴取得ステータス404", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantiesResponse.case1,
      findWarrantyHistoriesResponse.case2
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    jest.setSystemTime(new Date('2025-06-10T12:34:56Z'));

    // レスポンス期待値
    const expected = {
      replacementType: null,
      replacementPart: null,
      replacementReason: null,
      exchangeCountIncrementFlag: null,
      alertCode: null,
      alertMessage: null
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.receptionNumber}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("異常系_保証情報取得_ステータス404", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantiesResponse.case9,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    jest.setSystemTime(new Date('2025-06-10T12:34:56Z'));

    // レスポンス期待値
    const expected = {
      // "jins-trace-id": testInfo.jinsTraceId,
      // "systemName": "DJ36-Sales",
      "code": "COM_0002",
      "message": "Specified data not found.",
      // "details": ""
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.receptionNumber}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(400);
    // expect(response.body["jins-trace-id"]).toBe(expected["jins-trace-id"]);
    // expect(response.body.systemName).toBe(expected.systemName);
    expect(response.body.code).toBe(expected.code);
    expect(response.body.message).toBe(expected.message);
    // expect(response.body.details).toBe(expected.details);
  });

  test("異常系_保証情報取得_ステータス429", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantiesResponse.case10,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    jest.setSystemTime(new Date('2025-06-10T12:34:56Z'));

    // レスポンス期待値
    const expected = {
      // "jins-trace-id": testInfo.jinsTraceId,
      // "systemName": "DJ36-Sales",
      "code": "COM_0004",
      "message": "Duplicate api invocation detected.",
      // "details": "Duplicate api invocation detected."
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.receptionNumber}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(429);
    // expect(response.body["jins-trace-id"]).toBe(expected["jins-trace-id"]);
    // expect(response.body.systemName).toBe(expected.systemName);
    expect(response.body.code).toBe(expected.code);
    expect(response.body.message).toBe(expected.message);
    // expect(response.body.details).toBe(expected.details);
  });

  test("異常系_保証履歴取得_ステータス400", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantiesResponse.case1,
      findWarrantyHistoriesResponse.case3,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    jest.setSystemTime(new Date('2025-06-10T12:34:56Z'));

    // レスポンス期待値
    const expected = {
      // "jins-trace-id": testInfo.jinsTraceId,
      // "systemName": "DJ36-Sales",
      "code": "COM_0001",
      "message": "Validation error occurred.",
      // "details": ""
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.receptionNumber}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(400);
    // expect(response.body["jins-trace-id"]).toBe(expected["jins-trace-id"]);
    // expect(response.body.systemName).toBe(expected.systemName);
    expect(response.body.code).toBe(expected.code);
    expect(response.body.message).toBe(expected.message);
    // expect(response.body.details).toBe(expected.details);
  });

  test("異常系_保証履歴取得_ステータス500", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantiesResponse.case1,
      findWarrantyHistoriesResponse.case4,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    jest.setSystemTime(new Date('2025-06-10T12:34:56Z'));

    // レスポンス期待値
    const expected = {
      // "jins-trace-id": testInfo.jinsTraceId,
      // "systemName": "DJ36-Sales",
      "code": "COM_0000",
      "message": "Unexpected error occurred.",
      // "details": "Unexpected error occurred."
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.receptionNumber}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(500);
    // expect(response.body["jins-trace-id"]).toBe(expected["jins-trace-id"]);
    // expect(response.body.systemName).toBe(expected.systemName);
    expect(response.body.code).toBe(expected.code);
    expect(response.body.message).toBe(expected.message);
    // expect(response.body.details).toBe(expected.details);
  });

  test("異常系_受付番号_保証書番号同一_ステータス400", async () => {

    // レスポンス期待値
    const expected = {
      status: 400,
      "jins-trace-id": testInfo.jinsTraceId,
      systemName: "BFF",
      code: "COM_0001",
      message: "Validation error occurred.",
      details: "warrantyNumber and the receptionNumber are the same"
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.warrantyNumber.substring(0, 14)}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(expected.status);
    expect(response.body.systemName).toBe(expected.systemName);
    expect(response.body.code).toBe(expected.code);
    expect(response.body.message).toBe(expected.message);
    expect(response.body.details).toBe(JSON.stringify({status: expected.status, errors: [expected.details]}));
  });

  test("異常系_保証情報取得_保証情報無し", async () => {
    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantiesResponse.case11,
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
      status: 400,
      "jins-trace-id": testInfo.jinsTraceId,
      systemName: "BFF",
      code: "COM_0001",
      message: "Validation error occurred.",
      details: "The warranty info is not found."
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + `/${testInfo.warrantyNumber}/${testInfo.receptionNumber}`)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(expected.status);
    expect(response.body.code).toBe(expected.code);
    expect(response.body.message).toBe(expected.message);
    expect(response.body.details).toBe(JSON.stringify({status: expected.status, errors: [expected.details]}));
  });

});
