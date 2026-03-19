import request from "supertest";
import app from "~/app";
import { encryptText } from "~/src/utils/encryptText";
const fetchService = require("~/src/utils/fetchService");

// 受付キャンセルAPI
describe("PUT /api/receptions", () => {
  const url = "/api/sales/receptions";
  const jinsTraceId = crypto.randomUUID();
  const staffid = "00028";
  const storeCode = "84403";
  const receptionNumber = "240115US000001";
  afterEach(() => {
    // mockのリセット
    jest.resetAllMocks();
  });

  // テスト実施
  test("正常系_受付キャンセルAPI", async () => {
    const mockResponse = {
      ok: true,
      status: 204,
      statusText: "No Content",
    };
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockResolvedValue(mockResponse);
    const response = await request(app)
      .put(`${url}/${storeCode}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      expect(response.statusCode).toBe(200);
  });
  test("正常系_受付キャンセルAPI_暗号化受付番号", async () => {
    const mockResponse = {
      ok: true,
      status: 204,
      statusText: "No Content",
    };
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockResolvedValue(mockResponse);
    const response = await request(app)
      .put(`${url}/${storeCode}/${encryptText(receptionNumber)}`)
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
    sendApiRequestSpy.mockResolvedValue(mockResponse);
    const response = await request(app)
      .put(`${url}/${storeCode}/${receptionNumber}`)
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
      throw apiError;
    });
    const response = await request(app)
      .put(`${url}/${storeCode}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
    expect(response.statusCode).toBe(500);
  });
});
