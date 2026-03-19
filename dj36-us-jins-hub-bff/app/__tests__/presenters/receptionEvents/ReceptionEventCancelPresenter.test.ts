import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import request from "supertest";
import app from "~/app";
import { encryptText } from "~/src/utils/encryptText";
import * as fetchService from "~/src/utils/fetchService";

// 受付キャンセルAPI
describe("PUT /api/receptions", () => {
  const url = "/api/sales/receptions";
  const jinsTraceId = crypto.randomUUID();
  const staffid = "00028";
  const storeCode = "84403";
  const receptionNumber = "240115US000001";
  const encryptionReceptionNumber = encryptText(receptionNumber);
  afterEach(() => {
    // mockのリセット
    jest.resetAllMocks();
  });

  // テスト実施
  test("正常系_受付キャンセルAPI_暗号化受付番号", async () => {
    const mockResponse = {
      ok: true,
      status: 204,
      statusText: "No Content",
    };
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockResolvedValue(mockResponse as ApiResponse);
    const response = await request(app)
      .put(`${url}/${storeCode}/${encryptionReceptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
  });

  test("異常系_受付情報更新APIエラー", async () => {
    const mockResponse = {
      ok: false,
      status: 204,
      statusText: "No Content",
    };
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockRejectedValue(new ApiError(mockResponse as ApiResponse));
    const response = await request(app)
      .put(`${url}/${storeCode}/${encryptionReceptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(204);
  });

  test("異常系_例外発生", async () => {
    const apiError = {
      headers: new Headers(),
      url: "string",
      status: 500,
      statusText: "",
      data: undefined,
    };
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockImplementation(() => {
      throw new ApiError(apiError);
    });
    const response = await request(app)
      .put(`${url}/${storeCode}/${encryptionReceptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
    expect(response.statusCode).toBe(500);
  });

  test("異常系_暗号化されていない受付番号", async () => {
    const mockResponse = {
      ok: true,
      status: 204,
      statusText: "No Content",
    };
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockResolvedValue(mockResponse as ApiResponse);
    const response = await request(app)
      .put(`${url}/${storeCode}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
    expect(response.statusCode).toBe(400);
  });

  test("異常系_ステータス404", async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      data: {
        "code": "COM_0002",
        "message": "Specified data not found."
      },
    };
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockRejectedValue(new ApiError(mockResponse as ApiResponse));
    const response = await request(app)
      .put(`${url}/${storeCode}/${encryptionReceptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
    expect(response.statusCode).toBe(400);
  });

});
