import request from "supertest";
import { logger } from "~/src/logging/logger";

import app from "~/app";

import {
  getCartInfo,
  getCallManagement,
} from "~/src/clients/carts/cartsClient";
import {
  getStoreAttributes,
} from "~/src/clients/locations/locationsClient";
// import {
//   getLensUniqueAttributes,
// } from "~/src/clients/items/itemsClient";
import {
  getInventoriesServer
} from "~/src/clients/inventories/inventoriesClient";
import {
  findWarranties,
} from "~/src/clients/warranties/warrantiesClient";

import * as mockResponse
  from "~/__tests__/presenters/deliveries/mockResponses/DeliveriesCheckPresenterMockResponse";

import * as fetchService from "~/src/utils/fetchService";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";
// ★テスト共通情報(接続先URL)
class TestInfo {
  static readonly url = `/api/sales/deliveries-check`;
  static readonly jinsTraceId = crypto.randomUUID();
  static readonly staffid = "guest";
}

let counter: number = 0;
type MockSendApiResult = {
  getCartInfo?: (object | undefined | null);
  getCallManagement?: (object | undefined | null);
  getStoreAttributes?: (object | undefined | null);
  // getLensUniqueAttributes?: (object | undefined | null);
  getInventoriesServer?: (object | undefined | null)[];
  findWarranties?: (object | undefined | null);
  getSystemDateTime?: (object | undefined | null);
  getSystemDate?: (object | undefined | null);
  restoreTimeZoneTime?: (object | undefined | null);
  isCompareDateTime?: (object | undefined | null);
};
function setupSendApiMock(sendApiRequestSpy: jest.SpyInstance, result : MockSendApiResult){
  sendApiRequestSpy.mockImplementation((apiMethod: any, params: any, headers?: Headers, url?: string) => {
    logger.info(`★ ${apiMethod.path} ${apiMethod.method}} ★`);
    var res = undefined;
    switch(apiMethod) {
      case getCartInfo:
          res = result?.getCartInfo;
          break;
      case getCallManagement: 
          res = result?.getCallManagement;
          break;
      case getStoreAttributes:
          res = result?.getStoreAttributes;
          break;
      // case getLensUniqueAttributes:
      //     res = result?.getLensUniqueAttributes;
      //     break;
      case getInventoriesServer: 
          res = result?.getInventoriesServer?.at(counter++);
          break;
      case findWarranties:
          res = result?.findWarranties;
          break;
    }
    if (res === undefined) {
      // 未定義の場合、NGで返却
      throw new ApiError({ ok: false, status: 400, data: undefined } as ApiResponse);
    } else if (res === null) {
      // nullの場合、OK データ部なしで返却
      return { ok: true, status: 200, data: res };
    } else if (res == ("404").toString) {
      // レコードなし時の対応
      throw new ApiError({ ok: false, status: 404, data: undefined } as ApiResponse);
    }
    return { ok: true, status: 200, data: res };
  });
};

describe("GET " + TestInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  beforeEach(() => {
    counter = 0;
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
    jest.useRealTimers();
  });

  test("異常系_受取方法チェックAPI_カートカタログ取得エラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_undefined,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
      ],
      findWarranties: mockResponse.findWarrantiesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-06T02:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: false})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  test("異常系_受取方法チェックAPI_カートカタログ取得_商品グループなし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_商品グループなし,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
      ],
      findWarranties: mockResponse.findWarrantiesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-06T02:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: false})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  test("異常系_受取方法チェックAPI_店舗属性マスタ検索_エラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse_undefined,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
      ],
      findWarranties: mockResponse.findWarrantiesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-06T02:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: false})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  test("異常系_受取方法チェックAPI_呼出し管理情報取得_エラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      getCallManagement: mockResponse.getCallManagementResponse_undefined,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
      ],
      findWarranties: mockResponse.findWarrantiesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-06T02:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: false})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  // DJ36_STORE-168対応にてレンズ固有属性検索API呼出をオミットしたためテストから除外
  // test("異常系_受取方法チェックAPI_レンズ固有属性検索_エラー", async () => {
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   // デジタル基盤層のAPIを呼び出す際のレスポンス定義
  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: mockResponse.getCartInfoResponse,
  //     getCallManagement: mockResponse.getCallManagementResponse,
  //     getStoreAttributes: mockResponse.getStoreAttributesResponse,
  //     getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse_undefined,
  //     getInventoriesServer: [
  //       mockResponse.getInventoriesServerResponse,
  //       mockResponse.getInventoriesServerResponse,
  //       mockResponse.getInventoriesServerResponse,
  //       mockResponse.getInventoriesServerResponse,
  //     ],
  //     findWarranties: mockResponse.findWarrantiesResponse,
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);

  //   // ★リクエストパラメタ
  //   const receptionNumber: String = "241031US000001";
  //   const storeCode: String = "83005";
  //   // テスト実施
  //   const pathParameter = `/${receptionNumber}/${storeCode}`;
  //   const response = await request(app)
  //     .get(TestInfo.url + pathParameter)
  //     .query({isWarrantyExchange: false})
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //   expect(response.statusCode).toBe(400);
  // });

  // DJ36_STORE-168対応にてレンズ固有属性検索API呼出をオミットしたため、テストから除外
  // test("正常系_受取方法チェックAPI_レンズ固有属性検索_レコードなし", async () => {
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   // デジタル基盤層のAPIを呼び出す際のレスポンス定義
  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: mockResponse.getCartInfoResponse,
  //     getCallManagement: mockResponse.getCallManagementResponse,
  //     getStoreAttributes: mockResponse.getStoreAttributesResponse,
  //     getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse_レコードなし,
  //     getInventoriesServer: [
  //       mockResponse.getInventoriesServerResponse,
  //       mockResponse.getInventoriesServerResponse,
  //       mockResponse.getInventoriesServerResponse,
  //       mockResponse.getInventoriesServerResponse,
  //     ],
  //     findWarranties: mockResponse.findWarrantiesResponse,
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);

  //   // ★リクエストパラメタ
  //   const receptionNumber: String = "241031US000001";
  //   const storeCode: String = "83005";
  //   // テスト実施
  //   const pathParameter = `/${receptionNumber}/${storeCode}`;
  //   const response = await request(app)
  //     .get(TestInfo.url + pathParameter)
  //     .query({isWarrantyExchange: false})
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toEqual(mockResponse.expectedJson_レンズ固有属性検索_レコードなし);
  // });

  test("異常系_受取方法チェックAPI_保証情報取得_エラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
      ],
      findWarranties: mockResponse.findWarrantiesResponse_undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: false})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  test("正常系_受取方法チェックAPI_保証情報取得_レコードなし404", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record4,
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record4,
      ],
      findWarranties: (mockResponse.findWarrantiesResponse_404).toString,
      getSystemDateTime: (mockResponse.restoreTimeZoneTime_proceeding).toString,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-06T02:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: false})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_保証情報取得_レコードなし404);
  });

  test("正常系_受取方法チェックAPI_クエリfalse", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record4,
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record4,
      ],
      findWarranties: mockResponse.findWarrantiesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-06T02:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: false})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_正常);
  });

  // test("正常系_受取方法チェックAPI_クエリfalse_在庫Count0", async () => {
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   // デジタル基盤層のAPIを呼び出す際のレスポンス定義
  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: mockResponse.getCartInfoResponse,
  //     getCallManagement: mockResponse.getCallManagementResponse,
  //     getStoreAttributes: mockResponse.getStoreAttributesResponse,
  //     getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
  //     getInventoriesServer: [
  //       mockResponse.getInventoriesServerResponse,
  //       mockResponse.getInventoriesServerResponse_在庫0,
  //       mockResponse.getInventoriesServerResponse_在庫0,
  //       mockResponse.getInventoriesServerResponse_在庫0,
  //     ],
  //     findWarranties: mockResponse.findWarrantiesResponse,
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // システム時間制御
  //   const fixed = new Date('2025-05-06T02:30:00Z');
  //   jest.useFakeTimers().setSystemTime(fixed.getTime());
  //   // ★リクエストパラメタ
  //   const receptionNumber: String = "241031US000001";
  //   const storeCode: String = "83005";
  //   // テスト実施
  //   const pathParameter = `/${receptionNumber}/${storeCode}`;
  //   const response = await request(app)
  //     .get(TestInfo.url + pathParameter)
  //     .query({isWarrantyExchange: false})
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toEqual(mockResponse.expectedJson_クエリfalse_在庫Count0);
  // });

  // test("正常系_受取方法チェックAPI_クエリfalse_在庫Recordなし", async () => {
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   // デジタル基盤層のAPIを呼び出す際のレスポンス定義
  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: mockResponse.getCartInfoResponse,
  //     getCallManagement: mockResponse.getCallManagementResponse,
  //     getStoreAttributes: mockResponse.getStoreAttributesResponse,
  //     getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
  //     getInventoriesServer: [
  //       mockResponse.getInventoriesServerResponse,
  //       mockResponse.getInventoriesServerResponse_recordなし,
  //       mockResponse.getInventoriesServerResponse_recordなし,
  //       mockResponse.getInventoriesServerResponse_recordなし,
  //     ],
  //     findWarranties: mockResponse.findWarrantiesResponse,
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // システム時間制御
  //   const fixed = new Date('2025-05-06T02:30:00Z');
  //   jest.useFakeTimers().setSystemTime(fixed.getTime());
  //   // ★リクエストパラメタ
  //   const receptionNumber: String = "241031US000001";
  //   const storeCode: String = "83005";
  //   // テスト実施
  //   const pathParameter = `/${receptionNumber}/${storeCode}`;
  //   const response = await request(app)
  //     .get(TestInfo.url + pathParameter)
  //     .query({isWarrantyExchange: false})
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toEqual(mockResponse.expectedJson_クエリfalse_在庫Recordなし);
  // });

  test("正常系_受取方法チェックAPI_クエリfalse_PULあり", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse_PULあり,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record4,
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record4,
      ],
      findWarranties: mockResponse.findWarrantiesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-06T02:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: false})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_PULあり);
  });

  test("正常系_受取方法チェックAPI_加工時間外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse_PULあり,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record4,
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record4,
      ],
      findWarranties: mockResponse.findWarrantiesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-01T03:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: false})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_加工時間外);
  });  

  test("正常系_受取方法チェックAPI_クエリtrue_フレーム", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record1,
      ],
      findWarranties: mockResponse.findWarrantiesResponse_フレーム,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-06T02:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: true})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_正常);
  });

  test("正常系_受取方法チェックAPI_クエリtrue_レンズ", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record2,
      ],
      findWarranties: mockResponse.findWarrantiesResponse_レンズ2つ,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-06T02:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: true})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_正常);
  });

  test("正常系_受取方法チェックAPI_クエリtrue_フレームレンズ", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse_record3,
        mockResponse.getInventoriesServerResponse_record3,
        mockResponse.getInventoriesServerResponse_record3,
        mockResponse.getInventoriesServerResponse_record3,
      ],
      findWarranties: mockResponse.findWarrantiesResponse_フレームレンズ,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-06T02:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: true})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_正常);
  });

  test("正常系_受取方法チェックAPI_クエリtrue_フレームレンズ_2商品", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_商品情報あり_2レコード,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse_record3,
        mockResponse.getInventoriesServerResponse_record3,
        mockResponse.getInventoriesServerResponse_record3,
        mockResponse.getInventoriesServerResponse_record3,
      ],
      findWarranties: mockResponse.findWarrantiesResponse_フレームレンズ,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-06T02:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: true})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_2レコード);
  });

  // test("正常系_受取方法チェックAPI_クエリtrue_フレームレンズ_2商品_片方在庫不足", async () => {
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   // デジタル基盤層のAPIを呼び出す際のレスポンス定義
  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: mockResponse.getCartInfoResponse_商品情報あり_2レコード,
  //     getCallManagement: mockResponse.getCallManagementResponse,
  //     getStoreAttributes: mockResponse.getStoreAttributesResponse,
  //     getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
  //     getInventoriesServer: [
  //       mockResponse.getInventoriesServerResponse_record3,
  //       mockResponse.getInventoriesServerResponse_record3,
  //       mockResponse.getInventoriesServerResponse_record3,
  //       mockResponse.getInventoriesServerResponse_record2,
  //     ],
  //     findWarranties: mockResponse.findWarrantiesResponse_フレームレンズ,
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // システム時間制御
  //   const fixed = new Date('2025-05-06T02:30:00Z');
  //   jest.useFakeTimers().setSystemTime(fixed.getTime());
  //   // ★リクエストパラメタ
  //   const receptionNumber: String = "241031US000001";
  //   const storeCode: String = "83005";
  //   // テスト実施
  //   const pathParameter = `/${receptionNumber}/${storeCode}`;
  //   const response = await request(app)
  //     .get(TestInfo.url + pathParameter)
  //     .query({isWarrantyExchange: true})
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toEqual(mockResponse.expectedJson_2レコード_片方在庫不足);
  // });

  // test("正常系_受取方法チェックAPI_クエリtrue_フレームレンズ_2商品_片方在庫なし", async () => {
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   // デジタル基盤層のAPIを呼び出す際のレスポンス定義
  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: mockResponse.getCartInfoResponse_商品情報あり_2レコード,
  //     getCallManagement: mockResponse.getCallManagementResponse,
  //     getStoreAttributes: mockResponse.getStoreAttributesResponse,
  //     getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
  //     getInventoriesServer: [
  //       mockResponse.getInventoriesServerResponse_record3,
  //       mockResponse.getInventoriesServerResponse_record3,
  //       mockResponse.getInventoriesServerResponse_record3,
  //       mockResponse.getInventoriesServerResponse_undefined,
  //     ],
  //     findWarranties: mockResponse.findWarrantiesResponse_フレームレンズ,
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // システム時間制御
  //   const fixed = new Date('2025-05-06T02:30:00Z');
  //   jest.useFakeTimers().setSystemTime(fixed.getTime());
  //   // ★リクエストパラメタ
  //   const receptionNumber: String = "241031US000001";
  //   const storeCode: String = "83005";
  //   // テスト実施
  //   const pathParameter = `/${receptionNumber}/${storeCode}`;
  //   const response = await request(app)
  //     .get(TestInfo.url + pathParameter)
  //     .query({isWarrantyExchange: true})
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toEqual(mockResponse.expectedJson_2レコード_片方在庫なし);
  // });

  // test("正常系_受取方法チェックAPI_クエリtrue_フレームレンズ_2商品_在庫inventoryQuantity0", async () => {
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   // デジタル基盤層のAPIを呼び出す際のレスポンス定義
  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: mockResponse.getCartInfoResponse_商品情報あり_2レコード,
  //     getCallManagement: mockResponse.getCallManagementResponse,
  //     getStoreAttributes: mockResponse.getStoreAttributesResponse,
  //     getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
  //     getInventoriesServer: [
  //       mockResponse.getInventoriesServerResponse_record3_inventoryQuantity0,
  //       mockResponse.getInventoriesServerResponse_record2_inventoryQuantity0,
  //       mockResponse.getInventoriesServerResponse_record3_inventoryQuantity0,
  //       mockResponse.getInventoriesServerResponse_record3,
  //     ],
  //     findWarranties: mockResponse.findWarrantiesResponse_フレームレンズ,
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // システム時間制御
  //   const fixed = new Date('2025-05-06T02:30:00Z');
  //   jest.useFakeTimers().setSystemTime(fixed.getTime());
  //   // ★リクエストパラメタ
  //   const receptionNumber: String = "241031US000001";
  //   const storeCode: String = "83005";
  //   // テスト実施
  //   const pathParameter = `/${receptionNumber}/${storeCode}`;
  //   const response = await request(app)
  //     .get(TestInfo.url + pathParameter)
  //     .query({isWarrantyExchange: true})
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toEqual(mockResponse.expectedJson_2レコード_片方在庫数0);
  // });

  test("正常系_受取方法チェックAPI_クエリtrue_フレームレンズ_2商品_パラメタ作成失敗", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_商品情報あり_2レコード_レンズ固有属性_予備空,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse_record3,
        mockResponse.getInventoriesServerResponse_record3,
        mockResponse.getInventoriesServerResponse_record3,
        mockResponse.getInventoriesServerResponse_record3,
      ],
      findWarranties: mockResponse.findWarrantiesResponse_フレームレンズ,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-06T02:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: true})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_2レコード_予備未設定);
  });

  // test("正常系_受取方法チェックAPI_クエリtrue_フレームレンズ_2商品_在庫count0", async () => {
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   // デジタル基盤層のAPIを呼び出す際のレスポンス定義
  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: mockResponse.getCartInfoResponse_商品情報あり_2レコード,
  //     getCallManagement: mockResponse.getCallManagementResponse,
  //     getStoreAttributes: mockResponse.getStoreAttributesResponse,
  //     getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
  //     getInventoriesServer: [
  //       mockResponse.getInventoriesServerResponse_record3_count0,
  //       mockResponse.getInventoriesServerResponse_record3_count0,
  //       mockResponse.getInventoriesServerResponse_record3_count0,
  //       mockResponse.getInventoriesServerResponse_record3_count0,
  //     ],
  //     findWarranties: mockResponse.findWarrantiesResponse_フレームレンズ,
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // システム時間制御
  //   const fixed = new Date('2025-05-06T02:30:00Z');
  //   jest.useFakeTimers().setSystemTime(fixed.getTime());
  //   // ★リクエストパラメタ
  //   const receptionNumber: String = "241031US000001";
  //   const storeCode: String = "83005";
  //   // テスト実施
  //   const pathParameter = `/${receptionNumber}/${storeCode}`;
  //   const response = await request(app)
  //     .get(TestInfo.url + pathParameter)
  //     .query({isWarrantyExchange: true})
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toEqual(mockResponse.expectedJson_2レコード_在庫count0);
  // });


  test("正常系_受取方法チェックAPI_prescriptionInfoなし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_予備1領域不正,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse_undefined,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
      ],
      findWarranties: mockResponse.findWarrantiesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // システム時間制御
    const fixed = new Date('2025-05-01T02:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: false})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_レンズ固有属性検索_レコードなし);
  });

  // DJ36_STORE-172対応
  test("正常系_受取方法チェックAPI_加工終了時刻未設定", async () => {
    // 時間の妥当性チェックの三項演算falseルート
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      getCallManagement: mockResponse.getCallManagementResponse_processingCloseTime_undefinded,
      getStoreAttributes: mockResponse.getStoreAttributesResponse_PULあり,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record4,
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record4,
      ],
      findWarranties: mockResponse.findWarrantiesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-01T03:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: false})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_加工時間外);
  });  

  test("正常系_受取方法チェックAPI_レンズ情報の商品コードnull", async () => {
    // 上記レンズ情報取得のNull合体演算falseルート
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse_PULあり,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse_itemCode_null,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record4,
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record4,
      ],
      findWarranties: mockResponse.findWarrantiesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-01T03:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: false})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_加工時間false);
  });  

  test("正常系_受取方法チェックAPI_レンズ固有属性検索用パラメタ作成_itemGroupの判定のorのルート", async () => {
    // 時間の妥当性チェックの三項演算falseルート
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_商品情報あり予備1なし,
      getCallManagement: mockResponse.getCallManagementResponse_processingCloseTime_undefinded,
      getStoreAttributes: mockResponse.getStoreAttributesResponse_PULあり,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record4,
        mockResponse.getInventoriesServerResponse_record2,
        mockResponse.getInventoriesServerResponse_record4,
      ],
      findWarranties: mockResponse.findWarrantiesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-01T03:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: false})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_加工時間false);
  });    

  test("異常系_受取方法チェックAPI_カートカタログ取得404", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_404.toString,
      getCallManagement: mockResponse.getCallManagementResponse,
      getStoreAttributes: mockResponse.getStoreAttributesResponse,
      // getLensUniqueAttributes: mockResponse.getLensUniqueAttributesResponse,
      getInventoriesServer: [
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
        mockResponse.getInventoriesServerResponse,
      ],
      findWarranties: mockResponse.findWarrantiesResponse,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // システム時間制御
    const fixed = new Date('2025-05-06T02:30:00Z');
    jest.useFakeTimers().setSystemTime(fixed.getTime());
    // ★リクエストパラメタ
    const receptionNumber: String = "241031US000001";
    const storeCode: String = "83005";
    // テスト実施
    const pathParameter = `/${receptionNumber}/${storeCode}`;
    const response = await request(app)
      .get(TestInfo.url + pathParameter)
      .query({isWarrantyExchange: false})
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });


});
