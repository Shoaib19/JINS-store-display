import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import request from "supertest";
import app from "~/app";
import { putCallManagement } from "~/src/clients/carts/cartsClient";

import * as fetchService from "~/src/utils/fetchService";

describe("PUT /api/sales/call-management", () => {
  const url = "/api/sales/call-management";

  const storeCode = "83005";
  const pathParameter = `${storeCode}`;
  const jinsTraceId = "ab623ca6-b1e4-3796-a761-ca05605da64a";
  const staffid = "00028";
  const body = {
    timeRequiredUntilCall: 10,
    availableLines: 2,
    openingHourAvailableLines: 2,
    lineSettings: [
      {
        startTime: "11:00:00",
        availableLines: 3,
      },
      {
        startTime: "12:00:00",
        availableLines: 4,
      }
    ],
    receptionCloseTime: "18:00:00",
    processingCloseTime: "20:00:00",
    inStockLensPickupTime: "08:00:00",
    awaitingDeliveryLensPickupTime: "20:00:00"
  };
  const bodyNoLineSettings = structuredClone(body) as any;
  delete bodyNoLineSettings.lineSettings;

  afterEach(() => {
    // mockのリセット
    jest.resetAllMocks();
  });

  test("正常系_lineSettings設定あり", async () => {
    const mockResponse = {
      ok: true,
      status: 204,
      statusText: "No Content",
    };

    const expectedPutCallManagementRequest = {
        storeCode: storeCode,
        ...bodyNoLineSettings,
    } as any;
    delete expectedPutCallManagementRequest.openingHourAvailableLines;

    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockResolvedValue(mockResponse as ApiResponse);

    const response = await request(app)
      .put(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .send(JSON.stringify(bodyNoLineSettings));
    expect(response.statusCode).toBe(200);
    expect(sendApiRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendApiRequestSpy).toHaveBeenNthCalledWith(
      1,
      putCallManagement,
      expectedPutCallManagementRequest,
      expect.anything()
    );
  });

  test("正常系_lineSettings設定なし", async () => {
    const mockResponse = {
      ok: true,
      status: 204,
      statusText: "No Content",
    };

    const expectedPutCallManagementRequest = {
        storeCode: storeCode,
        ...body,
    } as any;
    delete expectedPutCallManagementRequest.openingHourAvailableLines;
    delete expectedPutCallManagementRequest.lineSettings;

    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockResolvedValue(mockResponse as ApiResponse);

    const response = await request(app)
      .put(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(bodyNoLineSettings)}`);
    expect(response.statusCode).toBe(200);
    expect(sendApiRequestSpy).toHaveBeenCalledTimes(1);
    expect(sendApiRequestSpy).toHaveBeenNthCalledWith(
      1,
      putCallManagement,
      expectedPutCallManagementRequest,
      expect.anything()
    );
  });

  test("異常系_呼出し管理情報登録API呼び出し_OK以外", async () => {
    const mockResponse = {
      ok: false,
      status: 204,
      statusText: "No Content",
    };

    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockRejectedValue(new ApiError(mockResponse as ApiResponse));

    const response = await request(app)
      .put(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(body)}`);
    expect(response.statusCode).toBe(204);
  });

  test("異常系_呼出し管理情報登録API呼び出し_例外発生", async () => {
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
      .put(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .send(`${JSON.stringify(body)}`);
    expect(response.statusCode).toBe(500);
  });
  
  test("異常系_呼出し管理情報登録API呼び出し_404エラー発生", async () => {
    const apiError = {
      headers: new Headers(),
      url: "string",
      status: 404,
      statusText: "Not Found",
      data: {}, 
    };

    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockImplementation(() => {
      throw new ApiError(apiError);
    });

    const response = await request(app)
      .put(`${url}/${pathParameter}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", jinsTraceId)
      .set("staffid", staffid)
      .send(`${JSON.stringify(body)}`);
    expect(response.statusCode).toBe(400); 
  });
});
