import request from "supertest";
import app from "~/app";
import * as fetchService from "~/src/utils/fetchService";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";
/**
 * 受取方法登録・変更API
 */
describe("POST /api/sales/deliveries/{storeCode}/{receptionNumber}/{itemGroupCode}", () => {
  const url = "/api/sales/deliveries";
  const storeCode = "83005";
  const receptionNumber = "240123US000001";
  const itemGroupCode = "240123US000001-1";
  const pathParameter = `${storeCode}/${receptionNumber}/${itemGroupCode}/`;
  const jinsTraceId = "2389c607-f5ed-4789-95a3-efd78be1e8d9";
  const staffid = "00028";
  afterEach(() => {
    // mockのリセット
    jest.resetAllMocks();
  });
  test("正常系_配送", async () => {
    // リクエスト
    const body = {
      deliveryMethodCode: "001",
      deliveryStoreCode: "83004",
      deliveryAddress: {
        fullName: "Test Jins",
        address1: "123 Main Street",
        address2: "Apartment 101, Suite B",
        city: "Los Angeles",
        postalCode: "90001",
        state: "CA",
        phoneNumber: "1234567890",
      },
      deliveryDate: "2024-12-30T08:00:00Z",
      isWaitingLens: true,
      isDeliveryToday: false
    };
    // Mock設定
    const mockResponse = {
      ok: true,
      status: 204,
      statusText: "No Content",
    };
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockResolvedValue(mockResponse as ApiResponse);
    // テスト実施
    const response = await request(app)
      .post(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
  });
  test("正常系_自店舗", async () => {
    // リクエスト
    const body = {
      deliveryMethodCode: "002",
      deliveryDate: "2024-12-30T08:00:00Z",
      isWaitingLens: true,
      isDeliveryToday: false,
    };
    // Mock設定
    const mockResponse = {
      ok: true,
      status: 204,
      statusText: "No Content",
    };
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockResolvedValue(mockResponse as ApiResponse);
    // テスト実施
    const response = await request(app)
      .post(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
  });
  test("正常系_他店舗", async () => {
    // リクエスト
    const body = {
      deliveryMethodCode: "004",
      deliveryStoreCode: "83004",
      isWaitingLens: true,
      isDeliveryToday: false,
    };
    // Mock設定
    const mockResponse = {
      ok: true,
      status: 204,
      statusText: "No Content",
    };
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockResolvedValue(mockResponse as ApiResponse);
    // テスト実施
    const response = await request(app)
      .post(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
  });

  test("正常系_配送_require項目のみ", async () => {
    // リクエスト
    const body = {
      deliveryMethodCode: "001",
      //deliveryStoreCode: "83004",
      deliveryAddress: {
        fullName: "Test Jins",
        address1: "123 Main Street",
        //address2: "Apartment 101, Suite B",
        city: "Los Angeles",
        postalCode: "90001",
        state: "CA",
        phoneNumber: "1234567890",
      },
      //deliveryDate: "2024-12-30T08:00:00Z",
      isWaitingLens: true,
      isDeliveryToday: false
    };
    // Mock設定
    const mockResponse = {
      ok: true,
      status: 204,
      statusText: "No Content",
    };
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockResolvedValue(mockResponse as ApiResponse);
    // テスト実施
    const response = await request(app)
      .post(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
  });
  test("異常系_配送_配送先情報なし", async () => {
    // リクエスト
    const body = {
      deliveryMethodCode: "001",
      deliveryStoreCode: "83004",
      deliveryAddress: null,
      deliveryDate: "2024-12-30T08:00:00Z",
      isWaitingLens: true,
      isDeliveryToday: false,
    };
    // テスト実施
    const response = await request(app)
      .post(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/\"code\":\"BFF_USSTORESTAFF_0007\"/);
    // expect(response.text).toMatch(/\"message\":\"At least store or address is required.\"/);
  });
  test("異常系_他店舗_配送先の店舗コード指定なし", async () => {
    // リクエスト
    const body = {
      deliveryMethodCode: "004",
      deliveryStoreCode: undefined,
      isWaitingLens: true,
      isDeliveryToday: false,
    };
    // テスト実施
    const response = await request(app)
      .post(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/\"code\":\"BFF_USSTORESTAFF_0007\"/);
    // expect(response.text).toMatch(/\"message\":\"At least store or address is required.\"/);
  });
  test("異常系_受取方法指定誤り", async () => {
    // リクエスト
    const body = {
      deliveryMethodCode: "999",
      deliveryStoreCode: undefined,
      isWaitingLens: true,
      isDeliveryToday: false,
    };
    // テスト実施
    const response = await request(app)
      .post(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/\"code\":\"COM_0001\"/);
    // expect(response.text).toMatch(/\"message\":\"Validation error occurred.\"/);
  });
  test("異常系_必須項目なし", async () => {
    // リクエスト
    const body = {
      deliveryMethodCode: undefined,
      deliveryStoreCode: "83004",
      deliveryAddress: {
        fullName: undefined,
        address1: undefined,
        address2: "Apartment 101, Suite B",
        city: undefined,
        postalCode: undefined,
        state: undefined,
        phoneNumber: undefined,
      },
      deliveryDate: "2024-12-30T08:00:00Z",
      isWaitingLens: undefined,
      isDeliveryToday: false,
    };
    // テスト実施
    const response = await request(app)
      .post(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(/\"code\":\"COM_0001\"/);
    // expect(response.text).toMatch(/\"message\":\"Validation error occurred.\"/);
    // expect(response.text).toMatch(/Missing required field: 'deliveryMethodCode'/);
    // expect(response.text).toMatch(/Missing required field: 'isWaitingLens'/);
    // expect(response.text).toMatch(/Missing required field: 'deliveryAddress.fullName'/);
    // expect(response.text).toMatch(/Missing required field: 'deliveryAddress.address1'/);
    // expect(response.text).toMatch(/Missing required field: 'deliveryAddress.city'/);
    // expect(response.text).toMatch(/Missing required field: 'deliveryAddress.postalCode'/);
    // expect(response.text).toMatch(/Missing required field: 'deliveryAddress.state'/);
    // expect(response.text).toMatch(/Missing required field: 'deliveryAddress.phoneNumber'/);
  });

  test("異常系_受取方法登録API失敗", async () => {
    // リクエスト
    const body = {
      deliveryMethodCode: "001",
      deliveryStoreCode: "83004",
      deliveryAddress: {
        fullName: "Test Jins",
        address1: "123 Main Street",
        address2: "Apartment 101, Suite B",
        city: "Los Angeles",
        postalCode: "90001",
        state: "CA",
        phoneNumber: "1234567890",
      },
      deliveryDate: "2024-12-30T08:00:00Z",
      isWaitingLens: true,
      isDeliveryToday: false,
    };
    // Mock設定
    const mockResponse = {
      ok: true,
      status: 204,
      statusText: "No Content",
    };
    const mockNgResponse = {
      ok: false,
      status: 400,
      statusText: "No Content",
    };
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockNgResponse as ApiResponse));
    sendApiRequestSpy.mockResolvedValue(mockResponse as ApiResponse);
    // テスト実施
    const response = await request(app)
      .post(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
  });

  test("異常系_受付情報更新API失敗", async () => {
    // リクエスト
    const body = {
      deliveryMethodCode: "001",
      deliveryStoreCode: "83004",
      deliveryAddress: {
        fullName: "Test Jins",
        address1: "123 Main Street",
        address2: "Apartment 101, Suite B",
        city: "Los Angeles",
        postalCode: "90001",
        state: "CA",
        phoneNumber: "1234567890",
      },
      deliveryDate: "2024-12-30T08:00:00Z",
      isWaitingLens: true,
      isDeliveryToday: false,
    };
    // Mock設定
    const mockResponse = {
      ok: true,
      status: 204,
      statusText: "No Content",
    };
    const mockNgResponse = {
      ok: false,
      status: 400,
      statusText: "No Content",
    };
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockResolvedValueOnce(mockResponse as ApiResponse);
    sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockNgResponse as ApiResponse) );
    // テスト実施
    const response = await request(app)
      .post(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
  });

  test("異常系_sendApiRequestで例外送出", async () => {
    // リクエスト
    const body = {
      deliveryMethodCode: "001",
      deliveryStoreCode: "83004",
      deliveryAddress: {
        fullName: "Test Jins",
        address1: "123 Main Street",
        address2: "Apartment 101, Suite B",
        city: "Los Angeles",
        postalCode: "90001",
        state: "CA",
        phoneNumber: "1234567890",
      },
      deliveryDate: "2024-12-30T08:00:00Z",
      isWaitingLens: true,
      isDeliveryToday: false,
    };
    // Mock設定
    const apiRequest = {
      headers: new Headers(),
      url: url,
      status: 500,
      statusText: "test exception",
      data: undefined,
    };
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockImplementation(() => {
      throw new ApiError(apiRequest);
    });
    // テスト実施
    const response = await request(app)
      .post(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(500);
  });
});
