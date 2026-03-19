import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import request from "supertest";
import app from "~/app";
import { logger } from "~/src/logging/logger";
jest.mock("axios");

import * as fetchService from "~/src/utils/fetchService";

// 見出し部
describe("DELETE /api/item-groups", () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    // const fetchService = require('~/src/utils/fetchService');
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });

  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  const url = "/api/sales/item-groups";
  const itemGroupCode: string = "250123US000001-1";
  const jinsTraceId = crypto.randomUUID();
  const staffid = "00028";

  // テスト実施
  test("正常系_削除完了_商品グループ削除", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      data: {},
    };
    sendApiRequestSpy.mockResolvedValue(mockResponse);

    const pathParameter = `/${itemGroupCode}`;
    const response = await request(app)
      .delete(url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
    expect(response.statusCode).toBe(200);

  });

  test("異常系_エンドポイント誤り_商品グループ削除", async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      data: {},
    };
    sendApiRequestSpy.mockRejectedValue(new ApiError(mockResponse as ApiResponse));

    const pathParameter = `/${itemGroupCode}`;
    const response = await request(app)
      .delete(url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid);
    logger.info("response:", response)
    expect(response.statusCode).toBe(400);
  });

  test("異常系_その他エラー_商品グループ削除", async () => {
    const apiError = {
      headers: new Headers(),
      url: "string",
      status: 500,
      statusText: "",
      data: undefined,
    };

    sendApiRequestSpy.mockImplementation(() => {
      throw new ApiError(apiError);
    });

    const pathParameter = `/${itemGroupCode}`;
    const response = await request(app)
      .delete(url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid);
    expect(response.statusCode).toBe(500);
  });
});
