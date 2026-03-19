import request from "supertest";
import app from "~/app";
import * as fetchService from "~/src/utils/fetchService";
import { logger } from "~/src/logging/logger";

// Mock対象DPFM側API定義
import {
    getCallManagement,
    getCartInfo,
    searchReceptionInformation,
} from "~/src/clients/carts/cartsClient";
import {
    getStoreLocations
} from "~/src/clients/locations/locationsClient";
import {
  getGlassLinesSearch,
    getOrderByOrderCode,
    getOrderByReceptionNumber,
    listGlassLineDelivery,
} from "~/src/clients/salesOrder/salesOrderClient";

import * as mockResponse
  from "~/__tests__/presenters/processes/mockResponses/ProcessesListPresenterResponse";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";

class TestInfo {
  static readonly url = "/api/sales/processes";
  static readonly jinsTraceId = crypto.randomUUID();
  static readonly staffid = "guest";
}
type MockSendApiResult = {
  getCallManagement?: (object | undefined | null);
  getCartInfo?: (object | undefined | null);
  searchReceptionInformation?: (object | undefined | null)[];
  getStoreLocations?: (object | undefined | null);
  getOrderByOrderCode?: (object | undefined | null);
  getOrderByReceptionNumber?: (object | undefined | null);
  listGlassLineDelivery?: (object | undefined | null);
  getGlassLinesSearch?: (object | undefined | null)[];
};

let counterSearchReceptionInformation: number = 0;
let counterGetGlassLinesSearch: number = 0;

function setupSendApiMock(sendApiRequestSpy: jest.SpyInstance, result : MockSendApiResult){
  sendApiRequestSpy.mockImplementation((apiMethod: any, params: any, headers?: Headers, url?: string) => {
    logger.info(`★ ${apiMethod.path} ${apiMethod.method}} ★`);
    var res = undefined;
    switch(apiMethod) {
      case getCallManagement:
        res = result?.getCallManagement;
        break;
      case getCartInfo:
        res = result?.getCartInfo;
        break;
      case searchReceptionInformation:
//        res = result?.searchReceptionInformation;
        res = result?.searchReceptionInformation?.at(counterSearchReceptionInformation++);
        break;
      case getStoreLocations:
        res = result?.getStoreLocations;
        break;
      case getOrderByOrderCode:
        res = result?.getOrderByOrderCode;
        break;
      case getOrderByReceptionNumber:
        res = result?.getOrderByReceptionNumber;
        break;
      case listGlassLineDelivery:
        res = result?.listGlassLineDelivery;
        break;
      case getGlassLinesSearch:
        res = result?.getGlassLinesSearch?.at(counterGetGlassLinesSearch++);
        break;
      }
    if (res === undefined) {
      // 未定義の場合、NGで返却
      throw new ApiError( { ok: false, status: 400, data: undefined } as ApiResponse);
    } else if (res === null) {
      // nullの場合、OK データ部なしで返却
      return { ok: true, status: 200, data: res };
    }
    return { ok: true, status: 200, data: res };
  });
}

describe("PUT " + TestInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-08-29T12:34:56Z'));
  });
  beforeEach(() => {
    counterSearchReceptionInformation = 0;
    counterGetGlassLinesSearch = 0;
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  test("正常系_工程情報一覧取得API_正常パターン（一気通貫）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_データあり,
          mockResponse.searchReceptionInformation_データあり,
          mockResponse.searchReceptionInformation_データあり],
        getStoreLocations: mockResponse.getStoreLocations_データあり,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(mockResponse.expectedProcesses_正常);
  });

    test("正常系_工程情報一覧取得API_正常パターン（一気通貫）null項目確認", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_データあり,
          mockResponse.searchReceptionInformation_データあり,
          mockResponse.searchReceptionInformation_データあり],
        getStoreLocations: mockResponse.getStoreLocations_データnull有,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり_null有,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり_null有,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(mockResponse.expectedProcesses_正常);
  });

  test("正常系_工程情報一覧取得API_正常パターン（一気通貫）required項目確認", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCallManagement: mockResponse.getCallManagement_データあり,
      getCartInfo: mockResponse.getCartInfo_データあり,
      searchReceptionInformation: [
        mockResponse.searchReceptionInformation_データあり,
        mockResponse.searchReceptionInformation_データあり,
        mockResponse.searchReceptionInformation_データあり],
      getStoreLocations: mockResponse.getStoreLocations_requiredのみ,
      getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり_requiredのみ,
      listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり_requiredのみ,
      getGlassLinesSearch: [
        mockResponse.getGlassLinesSearch_データあり_requiredのみ,
        mockResponse.getGlassLinesSearch_データあり_requiredのみ
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedProcesses_正常);
  });


  test("正常系_工程情報一覧取得API_正常パターン（調整）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_データあり_調整,
          mockResponse.searchReceptionInformation_データあり_調整,
          mockResponse.searchReceptionInformation_データあり_調整,
        ],
        getStoreLocations: mockResponse.getStoreLocations_データあり,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(mockResponse.expectedProcesses_正常2);
  });

  test("正常系_工程情報一覧取得API_正常パターン（調整）null項目確認", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_データあり_調整_null有,
          mockResponse.searchReceptionInformation_データあり_調整_null有,
          mockResponse.searchReceptionInformation_データあり_調整_null有,
        ],
        getStoreLocations: mockResponse.getStoreLocations_データあり,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(mockResponse.expectedProcesses_正常6);
  });


  test("正常系_工程情報一覧取得API_正常パターン（会計待ち）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_データあり_会計待ち,
          mockResponse.searchReceptionInformation_データあり_会計待ち,
          mockResponse.searchReceptionInformation_データあり_会計待ち,
        ],
        getStoreLocations: mockResponse.getStoreLocations_データあり,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(mockResponse.expectedProcesses_正常3);
  });

    test("正常系_工程情報一覧取得API_正常パターン（会計待ち）null項目確認", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_データあり_会計待ち_null有,
          mockResponse.searchReceptionInformation_データあり_会計待ち_null有,
          mockResponse.searchReceptionInformation_データあり_会計待ち_null有,
        ],
        getStoreLocations: mockResponse.getStoreLocations_データあり,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(mockResponse.expectedProcesses_正常7);
  });


  test("正常系_工程情報一覧取得API_正常パターン（カート）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_データあり_カート,
          mockResponse.searchReceptionInformation_データあり_カート,
          mockResponse.searchReceptionInformation_データあり_カート,
        ],
        getStoreLocations: mockResponse.getStoreLocations_データあり,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(mockResponse.expectedProcesses_正常4);
  });

    test("正常系_工程情報一覧取得API_正常パターン（カート）null項目確認", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_データあり_カート_null有,
          mockResponse.searchReceptionInformation_データあり_カート_null有,
          mockResponse.searchReceptionInformation_データあり_カート_null有,
        ],
        getStoreLocations: mockResponse.getStoreLocations_データあり,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(mockResponse.expectedProcesses_正常8);
  });


  test("正常系_工程情報一覧取得API_正常パターン（会計待ち_左レンズなし）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり_左レンズなし,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_データあり_会計待ち,
          mockResponse.searchReceptionInformation_データあり_会計待ち,
          mockResponse.searchReceptionInformation_データあり_会計待ち,
        ],
        getStoreLocations: mockResponse.getStoreLocations_データあり,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり_左レンズなし,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり_左レンズなし,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(mockResponse.expectedProcesses_正常3);
  });

  test("正常系_工程情報一覧取得API_ソート確認（度数登録）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_データあり_度数登録ソート確認,
          mockResponse.searchReceptionInformation_データあり_度数登録ソート確認,
          mockResponse.searchReceptionInformation_データあり_度数登録ソート確認,
        ],
        getStoreLocations: mockResponse.getStoreLocations_データあり,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(mockResponse.expectedProcesses_度数登録ソート結果);
  });

  test("正常系_工程情報一覧取得API_ソート確認（カート）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_データあり_カートソート確認,
          mockResponse.searchReceptionInformation_データあり_カートソート確認,
          mockResponse.searchReceptionInformation_データあり_カートソート確認,
        ],
        getStoreLocations: mockResponse.getStoreLocations_データあり,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(mockResponse.expectedProcesses_カートソート結果);

  });

  test("正常系_工程情報一覧取得API_ソート確認（会計待ち）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_データあり_会計待ちソート確認,
          mockResponse.searchReceptionInformation_データあり_会計待ちソート確認,
          mockResponse.searchReceptionInformation_データあり_会計待ちソート確認,
        ],
        getStoreLocations: mockResponse.getStoreLocations_データあり,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(mockResponse.expectedProcesses_会計待ちソート結果);

  });

  test("異常系_工程情報一覧取得API_ロケーションマスタ検索APIエラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [mockResponse.searchReceptionInformation_データあり],
        getStoreLocations: mockResponse.getStoreLocations_undefined,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  test("異常系_工程情報一覧取得API_呼出し管理情報取得APIエラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_undefined,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_データあり,
          mockResponse.searchReceptionInformation_データあり,
          mockResponse.searchReceptionInformation_データあり,
        ],
        getStoreLocations: mockResponse.getStoreLocations_データあり,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  test("異常系_工程情報一覧取得API_受付情報検索APIエラー1", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_undefined,
          mockResponse.searchReceptionInformation_undefined],
        getStoreLocations: mockResponse.getStoreLocations_データあり,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  // test("異常系_工程情報一覧取得API_受付情報検索APIエラー2", async () => {
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   // デジタル基盤層のAPIを呼び出す際のレスポンス定義
  //   const mockResult: MockSendApiResult = {
  //       getCallManagement: mockResponse.getCallManagement_データあり,
  //       getCartInfo: mockResponse.getCartInfo_データあり,
  //       searchReceptionInformation: [
  //         mockResponse.searchReceptionInformation_データあり,
  //         mockResponse.searchReceptionInformation_undefined],
  //       getStoreLocations: mockResponse.getStoreLocations_データあり,
  //       getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
  //       getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
  //       listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // テスト実施
  //   const storeCode: string = "83005";
  //   const response = await request(app)
  //     .get(`${TestInfo.url}/${storeCode}`)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //   expect(response.statusCode).toBe(500);
  // });

  // test("異常系_工程情報一覧取得API_カート情報取得APIエラー", async () => {
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   // デジタル基盤層のAPIを呼び出す際のレスポンス定義
  //   const mockResult: MockSendApiResult = {
  //       getCallManagement: mockResponse.getCallManagement_データあり,
  //       getCartInfo: mockResponse.getCartInfo_undefined,
  //       searchReceptionInformation: [
  //         mockResponse.searchReceptionInformation_データあり,
  //         mockResponse.searchReceptionInformation_データあり],
  //       getStoreLocations: mockResponse.getStoreLocations_データあり,
  //       getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
  //       getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
  //       listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
  //       getGlassLinesSearch: [
  //         mockResponse.getGlassLinesSearch_データあり,
  //         mockResponse.getGlassLinesSearch_データあり
  //       ],
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // テスト実施
  //   const storeCode: string = "83005";
  //   const response = await request(app)
  //     .get(`${TestInfo.url}/${storeCode}`)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //   expect(response.statusCode).toBe(500);
  // });

  // test("異常系_工程情報一覧取得API_お渡しメガネ行の一覧APIエラー", async () => {
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   // デジタル基盤層のAPIを呼び出す際のレスポンス定義
  //   const mockResult: MockSendApiResult = {
  //       getCallManagement: mockResponse.getCallManagement_データあり,
  //       getCartInfo: mockResponse.getCartInfo_データあり,
  //       searchReceptionInformation: [
  //         mockResponse.searchReceptionInformation_データあり,
  //         mockResponse.searchReceptionInformation_データあり],
  //       getStoreLocations: mockResponse.getStoreLocations_データあり,
  //       getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
  //       getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
  //       listGlassLineDelivery: mockResponse.listGlassLineDelivery_undefined,
  //       getGlassLinesSearch: [
  //         mockResponse.getGlassLinesSearch_データあり,
  //         mockResponse.getGlassLinesSearch_データあり
  //       ],
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // テスト実施
  //   const storeCode: string = "83005";
  //   const response = await request(app)
  //     .get(`${TestInfo.url}/${storeCode}`)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //   expect(response.statusCode).toBe(500);
  // });

  // test("異常系_工程情報一覧取得API_注文詳細取得API（注文コード）エラー", async () => {
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   // デジタル基盤層のAPIを呼び出す際のレスポンス定義
  //   const mockResult: MockSendApiResult = {
  //       getCallManagement: mockResponse.getCallManagement_データあり,
  //       getCartInfo: mockResponse.getCartInfo_データあり,
  //       searchReceptionInformation: [
  //         mockResponse.searchReceptionInformation_データあり,
  //         mockResponse.searchReceptionInformation_データあり],
  //       getStoreLocations: mockResponse.getStoreLocations_データあり,
  //       getOrderByOrderCode: mockResponse.getOrderByOrderCode_undefined,
  //       getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
  //       listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
  //       getGlassLinesSearch: [
  //         mockResponse.getGlassLinesSearch_データあり,
  //         mockResponse.getGlassLinesSearch_データあり
  //       ],
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // テスト実施
  //   const storeCode: string = "83005";
  //   const response = await request(app)
  //     .get(`${TestInfo.url}/${storeCode}`)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //   expect(response.statusCode).toBe(500);
  // });

  // test("異常系_工程情報一覧取得API_管理用注文検索APIエラー", async () => {
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   // デジタル基盤層のAPIを呼び出す際のレスポンス定義
  //   const mockResult: MockSendApiResult = {
  //       getCallManagement: mockResponse.getCallManagement_データあり,
  //       getCartInfo: mockResponse.getCartInfo_データあり,
  //       searchReceptionInformation: [
  //         mockResponse.searchReceptionInformation_データあり,
  //         mockResponse.searchReceptionInformation_データあり],
  //       getStoreLocations: mockResponse.getStoreLocations_データあり,
  //       getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
  //       getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
  //       listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
  //       getGlassLinesSearch: [
  //         mockResponse.getGlassLinesSearch_データあり,
  //         undefined,
  //       ],
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // テスト実施
  //   const storeCode: string = "83005";
  //   const response = await request(app)
  //     .get(`${TestInfo.url}/${storeCode}`)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //   expect(response.statusCode).toBe(500);
  // });

  test("異常系_工程情報一覧取得API_ロケーションマスタレコードなし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
        getCallManagement: mockResponse.getCallManagement_データあり,
        getCartInfo: mockResponse.getCartInfo_データあり,
        searchReceptionInformation: [
          mockResponse.searchReceptionInformation_データあり,
          mockResponse.searchReceptionInformation_データあり],
        getStoreLocations: mockResponse.getStoreLocations_データあり_レコードなし,
        getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
        getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_データあり,
        listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
        getGlassLinesSearch: [
          mockResponse.getGlassLinesSearch_データあり,
          mockResponse.getGlassLinesSearch_データあり
        ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const storeCode: string = "83005";
    const response = await request(app)
      .get(`${TestInfo.url}/${storeCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  // test("異常系_工程情報一覧取得API_注文詳細取得API（受付番号）エラー", async () => {
  //   const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  //   // デジタル基盤層のAPIを呼び出す際のレスポンス定義
  //   const mockResult: MockSendApiResult = {
  //       getCallManagement: mockResponse.getCallManagement_データあり,
  //       getCartInfo: mockResponse.getCartInfo_データあり,
  //       searchReceptionInformation: [
  //         mockResponse.searchReceptionInformation_データあり_会計待ち,
  //         mockResponse.searchReceptionInformation_データあり_会計待ち,
  //         mockResponse.searchReceptionInformation_データあり_会計待ち,
  //       ],
  //       getStoreLocations: mockResponse.getStoreLocations_データあり,
  //       getOrderByOrderCode: mockResponse.getOrderByOrderCode_データあり,
  //       getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumber_undefined,
  //       listGlassLineDelivery: mockResponse.listGlassLineDelivery_データあり,
  //       getGlassLinesSearch: [
  //         mockResponse.getGlassLinesSearch_データあり,
  //         mockResponse.getGlassLinesSearch_データあり
  //       ],
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //
  //   // テスト実施
  //   const storeCode: string = "83005";
  //   const response = await request(app)
  //     .get(`${TestInfo.url}/${storeCode}`)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //   expect(response.statusCode).toBe(500);
  // });

});
