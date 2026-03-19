import request from "supertest";
import app from "~/app";
import * as fetchService from "~/src/utils/fetchService";
import * as fetchService4SMS from "~/src/utils/fetchService4SMS";
import { logger } from "~/src/logging/logger";

// Mock対象DPFM側API定義
import {
  postReceptionEvents,
  searchReceptionInformation
} from "~/src/clients/carts/cartsClient";
import {
  postDeliveryCompleted,
  postPaymentCompleted,
  postReadyForDelivery,
} from "~/src/clients/oms/omsClient";
import {
  getOrderByReceptionNumber,
} from "~/src/clients/salesOrder/salesOrderClient";
import {
  findWarranties,
  findWarrantyHistories,
  putWarranties,
  putWarrantyHistories,
} from "~/src/clients/warranties/warrantiesClient";

import * as mockResponse from "~/__tests__/presenters/orders/mockResponses/OrderStatusUpdatePresenterMockResponse";
import { SMSConfig } from "~/src/components/const";
import { getReadyForPickupMessage } from "~/src/utils/createMessage";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";

class TestInfo {
  static readonly url = "/api/sales/orders-status";
  static readonly jinsTraceId = crypto.randomUUID();
  static readonly staffid = "guest";
}
type MockSendApiResult = {
  postReceptionEvents?: (object | undefined | null);
  searchReceptionInformation?: (object | undefined | null);
  postDeliveryCompleted?: (object | undefined | null);
  postPaymentCompleted?: (object | undefined | null);
  postReadyForDelivery?: (object | undefined | null);
  getOrderByReceptionNumber?: (object | undefined | null)[];
  putWarranties?: (object | undefined | null);
  findWarrantyHistories?: (object | undefined | null);
  findWarranties?: (object | undefined | null);
  putWarrantyHistories?: (object | undefined | null);
};

let counterGetOrderByReceptionNumber: number = 0;


function setupSendApiMock(sendApiRequestSpy: jest.SpyInstance, result : MockSendApiResult){
  sendApiRequestSpy.mockImplementation((apiMethod: any, params: any, headers?: Headers, url?: string) => {
    logger.info(`★ ${apiMethod.path} ${apiMethod.method}} ★`);
    var res = undefined;
    switch(apiMethod) {
      case postReceptionEvents:
        res = result?.postReceptionEvents;
        break;
      case searchReceptionInformation:
        res = result?.searchReceptionInformation;
        break;
      case postDeliveryCompleted:
        res = result?.postDeliveryCompleted;
        break;
      case postPaymentCompleted:
        res = result?.postPaymentCompleted;
        break;
      case postReadyForDelivery:
        res = result?.postReadyForDelivery;
        break;
      case getOrderByReceptionNumber:
        res = result?.getOrderByReceptionNumber?.at(counterGetOrderByReceptionNumber++);
        break;
      case putWarranties:
        res = result?.putWarranties;
        break;
      case findWarrantyHistories:
        res = result?.findWarrantyHistories;
        break;
      case findWarranties:
        res = result?.findWarranties;
        break;
      case putWarrantyHistories:
        res = result?.putWarrantyHistories;
        break;
    }
    if (res === undefined) {
      // 未定義の場合、NGで返却
      throw new ApiError({ ok: false, status: 400, data: undefined } as ApiResponse);
    } else if (res === null) {
      // nullの場合、404で返却
      throw new ApiError({ ok: false, status: 404, data: res } as ApiResponse);
    }
    return { ok: true, status: 200, data: res };
  });
}

describe("PUT " + TestInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  let SMSNotifierSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    SMSNotifierSpy = jest.spyOn(fetchService4SMS, "SMSNotifier");
  });
  beforeEach(() => {
    //
    counterGetOrderByReceptionNumber = 0;
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
    SMSNotifierSpy.mockClear();
  });

  test("正常系_オーダーステータス更新API_注文ステータス=400_会計実施", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation:
        mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      postPaymentCompleted:
        mockResponse.responsePostPaymentCompleted_noContents,
      postReadyForDelivery:
        mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_ORDER_PAYMENT_PROCESSING,
        mockResponse.responseGetOrderByReceptionNumber_ORDER_DELIVERY_PROCESSING,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": undefined,
      "orderStatusCode": "400",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "400"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("異常系_オーダーステータス更新API_注文ステータス=400_更新不可の注文", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted: mockResponse.responsePostDeliveryCompleted_noContents,
      postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [mockResponse.responseGetOrderByReceptionNumber_ORDER_COMPLETED],
      putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": undefined,
      "orderStatusCode": "400",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "400"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("正常系_オーダーステータス更新API_注文ステータス=500_受け取り準備完了", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation:
        mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      postPaymentCompleted:
        mockResponse.responsePostPaymentCompleted_noContents,
      postReadyForDelivery:
        mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_ORDER_DELIVERY_PROCESSING,
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": (`${receptionNumber}-1`) ,
      "orderStatusCode": "500",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "500"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    const SMSCallCount = [SMSConfig.readyForPickupMessageEnabled].filter((b) => b).length;
    expect(SMSNotifierSpy).toHaveBeenCalledTimes(SMSCallCount);
    if (SMSConfig.readyForPickupMessageEnabled) {
      expect(SMSNotifierSpy).toHaveBeenLastCalledWith(
        expect.anything(),
        `${getReadyForPickupMessage(requestBody.itemGroupCode)}`,
        expect.anything()
      );
    }
  });

  test("正常系_オーダーステータス更新API_注文ステータス=500_受け取り準備完了(SMS失敗)", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation:
        mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      postPaymentCompleted:
        mockResponse.responsePostPaymentCompleted_noContents,
      postReadyForDelivery:
        mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_ORDER_DELIVERY_PROCESSING,
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockRejectedValue("error");

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": (`${receptionNumber}-1`) ,
      "orderStatusCode": "500",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "500"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    // const SMSCallCount = [SMS.enableReadyForPickup].filter((b) => b).length;
    // expect(SMSNotifierSpy).toHaveBeenCalledTimes(SMSCallCount);
    // if (SMS.enableReadyForPickup) {
    //   expect(SMSNotifierSpy).toHaveBeenLastCalledWith(
    //     expect.anything(),
    //     `${getReadyForPickupMessage(requestBody.itemGroupCode)}`,
    //     expect.anything()
    //   );
    // }
  });

  test("異常系_オーダーステータス更新API_注文ステータス=500_受け渡し済みメガネ", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted: mockResponse.responsePostDeliveryCompleted_noContents,
      postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [mockResponse.responseGetOrderByReceptionNumber_DELIVERED],
      putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": (`${receptionNumber}-1`) ,
      "orderStatusCode": "500",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "500"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("正常系_オーダーステータス更新API_注文ステータス=500_受け取り準備完了(null有)", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation:
        mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      postPaymentCompleted:
        mockResponse.responsePostPaymentCompleted_noContents,
      postReadyForDelivery:
        mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_ORDER_DELIVERY_PROCESSING_null有,
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": (`${receptionNumber}-1`) ,
      "orderStatusCode": "500",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "500"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    const SMSCallCount = [SMSConfig.readyForPickupMessageEnabled].filter((b) => b).length;
    expect(SMSNotifierSpy).toHaveBeenCalledTimes(SMSCallCount);
    if (SMSConfig.readyForPickupMessageEnabled) {
      expect(SMSNotifierSpy).toHaveBeenLastCalledWith(
        expect.anything(),
        `${getReadyForPickupMessage(requestBody.itemGroupCode)}`,
        expect.anything()
      );
    }
  });

  test("正常系_オーダーステータス更新API_注文ステータス=801_受け渡し完了", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
        mockResponse.responseGetOrderByReceptionNumber_DELIVERED,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
      findWarrantyHistories: mockResponse.findWarrantyHistories_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "801",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "801"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダーステータス更新API_注文ステータス=801_受け渡し完了（配送）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY_配送,
        mockResponse.responseGetOrderByReceptionNumber_DELIVERED,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
      findWarrantyHistories: mockResponse.findWarrantyHistories_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "801",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "801"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダーステータス更新API_注文ステータス=801_受け渡し完了（注文完了）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
        mockResponse.responseGetOrderByReceptionNumber_ORDER_COMPLETED,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
      findWarrantyHistories: mockResponse.findWarrantyHistories_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "801",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "801"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダーステータス更新API_注文ステータス=801_受け渡し完了（保証交換一式）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
        mockResponse.responseGetOrderByReceptionNumber_ORDER_COMPLETED,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
      findWarrantyHistories: mockResponse.findWarrantyHistories_保証履歴あり_一式交換,
      findWarranties : mockResponse.findWarranties_一式,
      putWarrantyHistories : mockResponse.putWarrantyHistories_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "801",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "801"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダーステータス更新API_注文ステータス=801_受け渡し完了（保証交換一式・交換済み）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
        mockResponse.responseGetOrderByReceptionNumber_ORDER_COMPLETED,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
      findWarrantyHistories: mockResponse.findWarrantyHistories_保証履歴あり_一式交換,
      findWarranties : mockResponse.findWarranties_交換済み,
      putWarrantyHistories : mockResponse.putWarrantyHistories_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "801",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "801"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダーステータス更新API_注文ステータス=801_受け渡し完了（保証交換_回数加算なし）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
        mockResponse.responseGetOrderByReceptionNumber_ORDER_COMPLETED,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
      findWarrantyHistories: mockResponse.findWarrantyHistories_保証履歴あり_加算対象外,
      findWarranties : mockResponse.findWarranties_一式,
      putWarrantyHistories : mockResponse.putWarrantyHistories_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "801",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "801"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダーステータス更新API_注文ステータス=801_受け渡し完了（保証交換一式＿保証対象ヒットしない）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
        mockResponse.responseGetOrderByReceptionNumber_ORDER_COMPLETED,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
      findWarrantyHistories: mockResponse.findWarrantyHistories_保証履歴あり_フレーム交換,
      findWarranties : mockResponse.findWarranties_レンズだけ,
      putWarrantyHistories : mockResponse.putWarrantyHistories_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "801",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "801"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

    test("正常系_オーダーステータス更新API_注文ステータス=801_受け渡し完了(required)", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY_required,
        mockResponse.responseGetOrderByReceptionNumber_DELIVERED,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
      findWarrantyHistories: mockResponse.findWarrantyHistories_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "801",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "801"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダーステータス更新API_注文ステータス=801_受け渡し完了(保証履歴404)", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY_required,
        mockResponse.responseGetOrderByReceptionNumber_DELIVERED,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
      findWarrantyHistories: null,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "801",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "801"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダーステータス更新API_注文ステータス=800（会計）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      // postDeliveryCompleted: mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      // getOrderByReceptionNumber: mockResponse.responseGetOrderByReceptionNumber_正常,
      // putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "800",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "800"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダーステータス更新API_注文ステータス=800（調整）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_調整,
      // postDeliveryCompleted: mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      // getOrderByReceptionNumber: undefined,
      // putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "800",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "800"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダーステータス更新API_注文ステータス=800（GeneralHelp）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_GeneralHelp,
      // postDeliveryCompleted: mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      // getOrderByReceptionNumber: mockResponse.responseGetOrderByReceptionNumber_正常,
      // putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "800",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "800"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("異常系_オーダーステータス更新API_注文ステータス=800_受付情報なし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      // postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_レコードなし,
      // postDeliveryCompleted: mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      // getOrderByReceptionNumber: mockResponse.responseGetOrderByReceptionNumber_正常,
      // putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "800",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "800"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_注文ステータス=800_対象外受付ステータス", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      // postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_完了,
      // postDeliveryCompleted: mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      // getOrderByReceptionNumber: mockResponse.responseGetOrderByReceptionNumber_正常,
      // putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "800",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "800"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_注文ステータス不正", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      // postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_null,
      // postDeliveryCompleted: mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      // getOrderByReceptionNumber: mockResponse.responseGetOrderByReceptionNumber_null,
      // putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": undefined,
      "orderStatusCode": "010",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "400"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_バリデーションエラー（商品グループ指定なし）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      // postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_null,
      // postDeliveryCompleted: mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [mockResponse.responseGetOrderByReceptionNumber_null],
      // putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": undefined,
      "orderStatusCode": "500",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "400"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_対象注文情報なし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      // postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      // postDeliveryCompleted: mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [mockResponse.responseGetOrderByReceptionNumber_null],
      // putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "orderStatusCode": "400",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_対象注文情報の商品グループが存在しない", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      // postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      // postDeliveryCompleted: mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [mockResponse.responseGetOrderByReceptionNumber_正常],
      // putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000099-1",
      "orderStatusCode": "500",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_searchReceptionInformation例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation: undefined,
      // postDeliveryCompleted: mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      // getOrderByReceptionNumber: mockResponse.responseGetOrderByReceptionNumber_正常,
      // putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "800",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "800"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_postReceptionEvents例外(Resolve)", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: undefined,
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      // postDeliveryCompleted: mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      // getOrderByReceptionNumber: mockResponse.responseGetOrderByReceptionNumber_正常,
      // putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "800",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "800"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_getOrderByReceptionNumber（初回）例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation:
        mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      postPaymentCompleted:
        mockResponse.responsePostPaymentCompleted_noContents,
      postReadyForDelivery:
        mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        undefined,
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": (`${receptionNumber}-1`) ,
      "orderStatusCode": "500",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "500"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_getOrderByReceptionNumber（更新後）例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation:
        mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      postPaymentCompleted:
        mockResponse.responsePostPaymentCompleted_noContents,
      postReadyForDelivery:
        mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_ORDER_DELIVERY_PROCESSING,
        undefined,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": (`${receptionNumber}-1`) ,
      "orderStatusCode": "500",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "500"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_postPaymentCompleted例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation:
        mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      postPaymentCompleted:
        undefined,
      postReadyForDelivery:
        mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_ORDER_DELIVERY_PROCESSING,
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      // "itemGroupCode": (`${receptionNumber}-1`) ,
      "orderStatusCode": "400",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "500"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_postPaymentCompleted例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation:
        mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      postPaymentCompleted:
        undefined,
      postReadyForDelivery:
        mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_ORDER_PAYMENT_PROCESSING,
        mockResponse.responseGetOrderByReceptionNumber_ORDER_DELIVERY_PROCESSING,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      // "itemGroupCode": (`${receptionNumber}-1`) ,
      "orderStatusCode": "400",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "500"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_postReadyForDelivery例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      searchReceptionInformation:
        mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      postPaymentCompleted:
        mockResponse.responsePostPaymentCompleted_noContents,
      postReadyForDelivery:
        undefined,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_ORDER_DELIVERY_PROCESSING,
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": (`${receptionNumber}-1`) ,
      "orderStatusCode": "500",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    // レスポンス想定
    const expected = {
      "orderStatusCode": "500"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("正常系_オーダーステータス更新API_postDeliveryCompleted例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        undefined,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
        mockResponse.responseGetOrderByReceptionNumber_DELIVERED,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      itemGroupCode: "240123US000001-1",
      orderStatusCode: "801", // 有効：400,500.801,800
      callingNumber: "A01",
    };
    // レスポンス想定
    const expected = {
      orderStatusCode: "801",
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("正常系_オーダーステータス更新API_putWarranties例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
        mockResponse.responseGetOrderByReceptionNumber_DELIVERED,
      ],
      putWarranties: undefined,
      findWarrantyHistories: mockResponse.findWarrantyHistories_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      itemGroupCode: "240123US000001-1",
      orderStatusCode: "801", // 有効：400,500.801,800
      callingNumber: "A01",
    };
    // レスポンス想定
    const expected = {
      orderStatusCode: "801",
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
    // expect(response.body).toEqual(expected);
  });

  test("正常系_オーダーステータス更新API_postReceptionEvents例外(注文)", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: undefined,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
        mockResponse.responseGetOrderByReceptionNumber_DELIVERED,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
      findWarrantyHistories: mockResponse.findWarrantyHistories_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      itemGroupCode: "240123US000001-1",
      orderStatusCode: "801", // 有効：400,500.801,800
      callingNumber: "A01",
    };
    // レスポンス想定
    const expected = {
      orderStatusCode: "801",
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_findWarrantyHistories例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
        mockResponse.responseGetOrderByReceptionNumber_ORDER_COMPLETED,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
      findWarrantyHistories: undefined,
      findWarranties : mockResponse.findWarranties_一式,
      putWarrantyHistories : mockResponse.putWarrantyHistories_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "801",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_findWarranties例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
        mockResponse.responseGetOrderByReceptionNumber_ORDER_COMPLETED,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
      findWarrantyHistories: mockResponse.findWarrantyHistories_保証履歴あり_一式交換,
      findWarranties : undefined,
      putWarrantyHistories : mockResponse.putWarrantyHistories_noContents,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "801",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダーステータス更新API_putWarrantyHistories例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      postReceptionEvents: mockResponse.responsePostReceptionEvents_noContents,
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      postDeliveryCompleted:
        mockResponse.responsePostDeliveryCompleted_noContents,
      // postPaymentCompleted: mockResponse.responsePostPaymentCompleted_noContents,
      // postReadyForDelivery: mockResponse.responsePostReadyForDelivery_noContents,
      getOrderByReceptionNumber: [
        mockResponse.responseGetOrderByReceptionNumber_READY_FOR_DELIVERY,
        mockResponse.responseGetOrderByReceptionNumber_ORDER_COMPLETED,
      ],
      putWarranties: mockResponse.responsePutWarranties_noContents,
      findWarrantyHistories: mockResponse.findWarrantyHistories_保証履歴あり_一式交換,
      findWarranties : mockResponse.findWarranties_一式,
      putWarrantyHistories : undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const receptionNumber: string = "240123US000001";
    const requestBody = {
      "itemGroupCode": "240123US000001-1",
      "orderStatusCode": "801",           // 有効：400,500.801,800
      "callingNumber": "A01"
    };
    const response = await request(app)
      .put(`${TestInfo.url}/${receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(`${JSON.stringify(requestBody)}`);
    expect(response.statusCode).toBe(400);
  });

});
