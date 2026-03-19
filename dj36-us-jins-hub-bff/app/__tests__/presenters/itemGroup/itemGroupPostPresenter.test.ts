import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import request from "supertest";
import { postCartInfoResponse, searchReceptionInformationResponse } from "~/__tests__/presenters/itemGroup/mockResponses/ItemGroupPostPresenterMockResponse";
import app from "~/app";
import { logger } from "~/src/logging/logger";

import * as fetchService from "~/src/utils/fetchService";

// 見出し部
describe("POST /api/item-groups", () => {
  const url = "/api/sales/item-groups";
  const receptionNumber: string = "240123US000001";
  const cartId: number = 123
  const jinsTraceId = crypto.randomUUID();
  const staffid = "00028";

  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });

  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  // テスト実施
  test("正常系_登録完了_商品グループ追加", async () => {
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      postCartInfoResponse.case1
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const pathParameter = `/${receptionNumber}/${cartId}`;
    const response = await request(app)
      .post(url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
    logger.info(`response: ${JSON.stringify(response)}`);
    expect(response.statusCode).toBe(200);
  });

  test("正常系_登録完了_商品グループ追加_null項目確認", async () => {
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      postCartInfoResponse.case4
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const pathParameter = `/${receptionNumber}/${cartId}`;
    const response = await request(app)
      .post(url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
    logger.info(`response: ${JSON.stringify(response)}`);
    expect(response.statusCode).toBe(200);
  });


  test("異常系_レコードなし_商品グループ追加", async () => {

    const pathParameter = `/${receptionNumber}`;
    const response = await request(app)
      .post(url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", "guest");
    expect(response.statusCode).toBe(404);
  });

  test("異常系_カート新規作成_受付番号国コードエラー_商品グループ追加", async () => {
    const mockResponses = [
      searchReceptionInformationResponse.case2,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }

    const errReceptionNumber: string = "240123XX000001";

    const pathParameter = `/${errReceptionNumber}/${cartId}`;
    const response = await request(app)
      .post(url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", "guest");
    expect(response.statusCode).toBe(400);
  });

  test("異常系_その他エラー_商品グループ追加", async () => {
    const mockResponses = [
      searchReceptionInformationResponse.case1,
      postCartInfoResponse.case3
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    
    const pathParameter = `/${receptionNumber}/${cartId}`;
    const response = await request(app)
      .post(url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", "guest");
    expect(response.statusCode).toBe(500);
  });
});
