import request from "supertest";
import app from "~/app";
import {
  findCartInfoResponse,
  findOrderByReceptionNumberResponse,
  findReceptionsResponse,
  findWarrantyHistoriesResponse,
  getPowersByIdResponse,
  postCartInfoResponse,
  postLineitemsResponse,
  postPrescriptionsCopyResponse,
  postWarrantyHistoriesResponse,
  postReceptionEventsResponse,
  impossibleErrorResponse,
  searchReceptionInformationResponse,
 } from "~/__tests__/presenters/warranties/mockResponses/WarrantyReplacementsPostPresenterMockResponse";
jest.mock("axios");

import * as fetchService from "~/src/utils/fetchService";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";

const testInfo = {
  url: "/api/sales/warranty-replacements",
  jinsTraceId: crypto.randomUUID(),
  staffId: "U00001",
  cursor: "cursor"
}

const requestBody = {
  warrantyNumber: "250501US000254-1",
  receptionNumber: "250507US000035",
  replacementType: "001",
  replacementPart: "001",
  replacementReason: "001",
  exchangeCountIncrementFlag: true,
};

// 見出し部
describe("GET " + testInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
    sendApiRequestSpy.mockReset();
  });

  // テスト実施
  test("正常系_保証履歴登録更新API_保証履歴有り_カート情報有り", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findReceptionsResponse.case1,
      findCartInfoResponse.case1,
      findOrderByReceptionNumberResponse.case1,
      postWarrantyHistoriesResponse.case1,
      postReceptionEventsResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.cursor)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
  });

  test("正常系_保証履歴登録更新API_保証履歴有り_カート情報有り_リクエスト項目null", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findReceptionsResponse.case1,
      findCartInfoResponse.case1,
      findOrderByReceptionNumberResponse.case1,
      postWarrantyHistoriesResponse.case1,
      postReceptionEventsResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const nullRequestBody = {
      warrantyNumber: "250501US000254-1",
      receptionNumber: "250507US000035",
      replacementType: null,
      replacementPart: null,
      replacementReason: null,
      exchangeCountIncrementFlag: true,
    };
    
    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.cursor)
      .send(`${JSON.stringify(nullRequestBody)}`);
    expect(response.statusCode).toBe(200);
  });

  test("正常系_保証履歴登録更新API_保証履歴有り_カート情報有り_レンズ交換分類商品コードなし", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findReceptionsResponse.case1,
      findCartInfoResponse.case1,
      findOrderByReceptionNumberResponse.case5,
      postWarrantyHistoriesResponse.case1,
      postReceptionEventsResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .set("x-cursor", testInfo.cursor)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
  });

  test("正常系_保証履歴登録更新API_保証履歴有り_カート情報無し", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case1,
      postWarrantyHistoriesResponse.case1,
      postCartInfoResponse.case1,
      postLineitemsResponse.case1,
      postReceptionEventsResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
  });

  test("正常系_保証履歴登録更新API_保証履歴有り_カート情報無し_商品グループ設定null", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case2,
      postWarrantyHistoriesResponse.case1,
      postCartInfoResponse.case1,
      postLineitemsResponse.case1,
      postReceptionEventsResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
  });

  test("正常系_保証履歴登録更新API_保証履歴無し_カート情報有り", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case2,
      findReceptionsResponse.case1,
      findCartInfoResponse.case1,
      findOrderByReceptionNumberResponse.case1,
      postWarrantyHistoriesResponse.case1,
      postReceptionEventsResponse.case1,
      postReceptionEventsResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
  });

  test("正常系_保証履歴登録更新API_保証履歴有り_カート情報無し_カート新規作成商品グループ無し", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case1,
      postWarrantyHistoriesResponse.case1,
      postCartInfoResponse.case2,
      postLineitemsResponse.case1,
      postReceptionEventsResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
  });

  test("正常系_保証履歴登録更新API_保証履歴有り_カート情報無し_注文詳細メガネ行無し", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case3,
      postWarrantyHistoriesResponse.case1,
      postCartInfoResponse.case1,
      postLineitemsResponse.case1,
      postReceptionEventsResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
  });

  test("正常系_保証履歴登録更新API_保証履歴無し_カート情報無し", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case2,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case1,
      getPowersByIdResponse.case1,
      postWarrantyHistoriesResponse.case1,
      postCartInfoResponse.case1,
      postLineitemsResponse.case1,
      postPrescriptionsCopyResponse.case1,
      postReceptionEventsResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
  });

  test("正常系_保証履歴登録更新API_処方箋なし", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case2,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case1,
      getPowersByIdResponse.case2,
      postWarrantyHistoriesResponse.case1,
      postCartInfoResponse.case1,
      postLineitemsResponse.case1,
      postReceptionEventsResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
  });

  test("異常系_保証履歴登録更新API_バリデーションエラー", async () => {
    const requestBody2 = structuredClone(requestBody);
    requestBody2.warrantyNumber = "250507US000035-1";

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody2)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_保証履歴登録更新API_保証履歴登録エラー", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case2,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case1,
      getPowersByIdResponse.case1,
      postWarrantyHistoriesResponse.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_保証履歴登録更新API_カート新規作成_受付番号国コードエラー", async () => {
    const requestBody2 = structuredClone(requestBody);
    requestBody2.receptionNumber = "250507XX000035";

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    
    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody2)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_保証履歴登録更新API_カート情報登録エラー", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case2,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case1,
      getPowersByIdResponse.case1,
      postWarrantyHistoriesResponse.case1,
      postCartInfoResponse.case1,
      postLineitemsResponse.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_保証履歴登録更新API_処方箋画像登録エラー", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case2,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case1,
      getPowersByIdResponse.case4,
      postWarrantyHistoriesResponse.case1,
      postCartInfoResponse.case1,
      postLineitemsResponse.case1,
      postPrescriptionsCopyResponse.case2
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_保証履歴登録更新API_受付情報更新エラー", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case1,
      postWarrantyHistoriesResponse.case1,
      postCartInfoResponse.case1,
      postLineitemsResponse.case1,
      postReceptionEventsResponse.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_保証履歴登録更新API_保証履歴取得エラー", async () => {
    const mockResponse = findWarrantyHistoriesResponse.case3;
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockRejectedValue(new ApiError(mockResponse as unknown as ApiResponse));

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_保証履歴登録更新API_受付情報取得エラー", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findReceptionsResponse.case2,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_保証履歴登録更新API_カートカタログ取得エラー", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findReceptionsResponse.case1,
      findCartInfoResponse.case3,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_保証履歴登録更新API_カート新規登録エラー", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case1,
      postWarrantyHistoriesResponse.case1,
      postCartInfoResponse.case4,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_保証履歴登録更新API_カート新規登録_カート情報無し", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      findWarrantyHistoriesResponse.case1,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case1,
      postWarrantyHistoriesResponse.case1,
      postCartInfoResponse.case3,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_保証履歴登録更新API_注文詳細取得エラー", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case1,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case4,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_保証履歴登録更新API_度数情報取得エラー", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case2,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case1,
      getPowersByIdResponse.case3,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(500);
  });

  // test("異常系_保証履歴登録更新API_発生不可能エラー１", async () => {
  //   const mockResponse = impossibleErrorResponse.case1;
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   sendApiRequestSpy.mockRejectedValue(new ApiError(mockResponse as unknown as ApiResponse));
  //   const response = await request(app)
  //     .post(testInfo.url)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", testInfo.jinsTraceId)
  //     .set("staffid", testInfo.staffId)
  //     .send(`${JSON.stringify(requestBody)}`);
  //   expect(response.statusCode).toBe(400);
  // });

  // test("異常系_保証履歴登録更新API_発生不可能エラー２", async () => {
  //   const mockResponse = impossibleErrorResponse.case2;
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   sendApiRequestSpy.mockRejectedValue(new ApiError(mockResponse as unknown as ApiResponse));
  //   const response = await request(app)
  //     .post(testInfo.url)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", testInfo.jinsTraceId)
  //     .set("staffid", testInfo.staffId)
  //     .send(`${JSON.stringify(requestBody)}`);
  //   expect(response.statusCode).toBe(500);
  // });

  // テスト実施
  test("正常系_保証履歴登録更新API_度数登録方法_処方箋（T_DJ36OMOSCM_TEST-360）", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case2,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case1,
      getPowersByIdResponse.case4,
      postWarrantyHistoriesResponse.case1,
      postCartInfoResponse.case1,
      postLineitemsResponse.case1,
      postPrescriptionsCopyResponse.case1,
      postReceptionEventsResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
  });

  test("正常系_保証履歴登録更新API_度数登録方法_処方箋以外（T_DJ36OMOSCM_TEST-360）", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case2,
      findReceptionsResponse.case1,
      findCartInfoResponse.case2,
      findOrderByReceptionNumberResponse.case1,
      getPowersByIdResponse.case5,
      postWarrantyHistoriesResponse.case1,
      postCartInfoResponse.case1,
      postLineitemsResponse.case1,
      postPrescriptionsCopyResponse.case1,
      postReceptionEventsResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
  });

    test("正常系_保証履歴登録更新API_度数情報登録_vision設定", async () => {

    // DPFM層API Mockレスポンス定義
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      findWarrantyHistoriesResponse.case2,
      findReceptionsResponse.case1,
      findCartInfoResponse.case4,
      findOrderByReceptionNumberResponse.case1,
      getPowersByIdResponse.case6,
      postWarrantyHistoriesResponse.case1,
      postCartInfoResponse.case1,
      postLineitemsResponse.case1,
      postPrescriptionsCopyResponse.case1,
      postReceptionEventsResponse.case1,
    ];
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const response = await request(app)
      .post(testInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("staffid", testInfo.staffId)
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
  });

});
