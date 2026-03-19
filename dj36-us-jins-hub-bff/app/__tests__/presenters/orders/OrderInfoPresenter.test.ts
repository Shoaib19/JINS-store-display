import request from "supertest";
import { logger } from "~/src/logging/logger";

import app from "~/app";

import {
  ApiError,
  ApiResponse
} from "openapi-typescript-fetch";

import * as mockResponse
  from "~/__tests__/presenters/orders/mockResponses/OrderInfoPresenterMockResponse";

import {
  getCartInfo,
  postCartInfo
} from "~/src/clients/carts/cartsClient";
import {
  getOrderByReceptionNumber
} from "~/src/clients/salesOrder/salesOrderClient";
import {
  getPowersById
} from "~/src/clients/warranties/warrantiesClient";
import {
  findWarranties,
  findWarrantyHistories,
} from "~/src/clients/warranties/warrantiesClient";
import {
    searchReceptionInformation
} from "~/src/clients/carts/cartsClient";

import * as fetchService from "~/src/utils/fetchService";

class TestInfo {
  static readonly url = "/api/sales/orders";
  static readonly jinsTraceId = crypto.randomUUID();
  static readonly staffid = "guest";
}

type MockSendApiResult = {
  getCartInfo?: (object | undefined | null);
  searchReceptionInformation?: (object | undefined | null);
  postCartInfo?: (object | undefined | null);
  getOrderByReceptionNumber?: (object | undefined | null);
  getPowersById?: (object | undefined | null);
  findWarranties?: (object | undefined | null);
  findWarrantyHistories?: (object | undefined | null);
};
function setupSendApiMock(sendApiRequestSpy: jest.SpyInstance, result : MockSendApiResult){
  sendApiRequestSpy.mockImplementation((apiMethod: any, params: any, headers?: Headers, url?: string) => {
    logger.info(`★ ${apiMethod.path} ${apiMethod.method}} ★`);
    var res: object|number|undefined|null = undefined;
    switch(apiMethod) {
      case getCartInfo:
        res = result?.getCartInfo;
        break;
      case searchReceptionInformation:
        res = result?.searchReceptionInformation;
        break;
      case postCartInfo:
        res = result?.postCartInfo;
        break;
      case getOrderByReceptionNumber:
        res = result?.getOrderByReceptionNumber;
        break;
      case getPowersById:
        res = result?.getPowersById;
        break;
      case findWarranties:
        res = result?.findWarranties;
        break;
      case findWarrantyHistories:
        res = result?.findWarrantyHistories;
        break;
    }
    if (res === undefined) {
      // 未定義の場合、NGで返却
      throw new ApiError( { ok: false, status: 400, data: undefined } as ApiResponse);
    } else if (res === null) {
      // nullの場合、OK データ部なしで返却
      return { ok: true, status: 200, data: res };

    } else {
      // レコードなし時の対応
      let json = JSON.parse(JSON.stringify(res));
      if (json.conditions == "error") {
        throw new ApiError( { ok: false, status: json.status, data: undefined } as ApiResponse);
      } else if (json.conditions == "throw") {
        throw new ApiError( { ok: false, status: json.status, data: undefined } as ApiResponse);
      }
    }
    return { ok: true, status: 200, data: res };
  });
};

let counter: number = 0;

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
  });

  //
  // 異常系テスト
  //
  test("異常系_オーダ情報取得API_バリデーションエラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberNoItemResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const response = await request(app)
      .get(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダ情報取得API_カート新規作成_受付番号国コードエラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_NoItem,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case2,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberNoItemResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const errReceptionNumber: string = "240123XX000001";

    // テスト実施
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: errReceptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダ情報取得API_受付番号設定なし_カート情報取得エラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_null,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(500);
  });

  test("異常系_オーダ情報取得API_カートカタログ取得エラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_エラー,
      postCartInfo: mockResponse.postCartInfoResponse_エラー,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  test("異常系_オーダ情報取得API_カート新規作成エラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_NoItem,
      postCartInfo: mockResponse.postCartInfoResponse_エラー,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_カートの受付番号なし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_NpReceptionNumber,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
    // expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定なし);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_受付情報なし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_NpReceptionNumber,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case3,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
    // expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定なし);
  });

  //
  // 正常系テスト
  //
  test("正常系_オーダ情報取得API_受付番号設定あり_フレーム交換1", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定あり_フレーム交換);
  });

  test("正常系_オーダ情報取得API_受付番号設定あり_保証開始日閏年", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_保証開始日閏年,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定あり_保証開始日閏年);
  });

  test("正常系_オーダ情報取得API_受付番号設定あり_保証開始日未設定", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_保証開始日未設定,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定あり_保証開始日未設定);
  });

  test("正常系_オーダ情報取得API_受付番号設定あり_レンズ交換", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_レンズ交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定あり_レンズ交換);
  });

  test("正常系_オーダ情報取得API_受付番号設定あり_フレームレンズ交換", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレームレンズ交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定あり_フレームレンズ交換);
  });

  test("正常系_オーダ情報取得API_受付番号設定あり_保証情報保証番号なし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_保証書番号なし,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定あり_レンズ交換);
  });

  test("正常系_オーダ情報取得API_受付番号設定あり_保証履歴なし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定あり_保証履歴なし);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定なし);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_Measurement", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const searchReceptionInformation = structuredClone(mockResponse.searchReceptionInformationResponse.case1);
    searchReceptionInformation.ReceptionInfoAllItems[0].statusCode = "100";
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: searchReceptionInformation,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const expected = structuredClone(mockResponse.expectedJson_受付番号設定なし);
    expected.itemGroups[0].receptionStatusCode = "100";
    expected.itemGroups[0].receptionStatusName = "Measurement";
    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_OrderNew", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const searchReceptionInformation = structuredClone(mockResponse.searchReceptionInformationResponse.case1);
    searchReceptionInformation.ReceptionInfoAllItems[0].statusCode = "200";
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: searchReceptionInformation,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const expected = structuredClone(mockResponse.expectedJson_受付番号設定なし);
    expected.itemGroups[0].receptionStatusCode = "200";
    expected.itemGroups[0].receptionStatusName = "Order New";
    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_Payment", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const searchReceptionInformation = structuredClone(mockResponse.searchReceptionInformationResponse.case1);
    searchReceptionInformation.ReceptionInfoAllItems[0].statusCode = "300";
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: searchReceptionInformation,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const expected = structuredClone(mockResponse.expectedJson_受付番号設定なし);
    expected.itemGroups[0].receptionStatusCode = "300";
    expected.itemGroups[0].receptionStatusName = "Payment";
    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_Processing", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const searchReceptionInformation = structuredClone(mockResponse.searchReceptionInformationResponse.case1);
    searchReceptionInformation.ReceptionInfoAllItems[0].statusCode = "400";
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: searchReceptionInformation,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const expected = structuredClone(mockResponse.expectedJson_受付番号設定なし);
    expected.itemGroups[0].receptionStatusCode = "400";
    expected.itemGroups[0].receptionStatusName = "Processing";
    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_Adjustment", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const searchReceptionInformation = structuredClone(mockResponse.searchReceptionInformationResponse.case1);
    searchReceptionInformation.ReceptionInfoAllItems[0].statusCode = "401";
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: searchReceptionInformation,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const expected = structuredClone(mockResponse.expectedJson_受付番号設定なし);
    expected.itemGroups[0].receptionStatusCode = "401";
    expected.itemGroups[0].receptionStatusName = "Adjustment";
    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_GeneralHelp", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const searchReceptionInformation = structuredClone(mockResponse.searchReceptionInformationResponse.case1);
    searchReceptionInformation.ReceptionInfoAllItems[0].statusCode = "402";
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: searchReceptionInformation,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const expected = structuredClone(mockResponse.expectedJson_受付番号設定なし);
    expected.itemGroups[0].receptionStatusCode = "402";
    expected.itemGroups[0].receptionStatusName = "General Help";
    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_pickup", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const searchReceptionInformation = structuredClone(mockResponse.searchReceptionInformationResponse.case1);
    searchReceptionInformation.ReceptionInfoAllItems[0].statusCode = "500";
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: searchReceptionInformation,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const expected = structuredClone(mockResponse.expectedJson_受付番号設定なし);
    expected.itemGroups[0].receptionStatusCode = "500";
    expected.itemGroups[0].receptionStatusName = "pick up";
    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_completed", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const searchReceptionInformation = structuredClone(mockResponse.searchReceptionInformationResponse.case1);
    searchReceptionInformation.ReceptionInfoAllItems[0].statusCode = "800";
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: searchReceptionInformation,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const expected = structuredClone(mockResponse.expectedJson_受付番号設定なし);
    expected.itemGroups[0].receptionStatusCode = "800";
    expected.itemGroups[0].receptionStatusName = "completed";
    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_receptioncompleted", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const searchReceptionInformation = structuredClone(mockResponse.searchReceptionInformationResponse.case1);
    searchReceptionInformation.ReceptionInfoAllItems[0].statusCode = "801";
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: searchReceptionInformation,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const expected = structuredClone(mockResponse.expectedJson_受付番号設定なし);
    expected.itemGroups[0].receptionStatusCode = "801";
    expected.itemGroups[0].receptionStatusName = "reception completed";
    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_ReceptionCancel", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const searchReceptionInformation = structuredClone(mockResponse.searchReceptionInformationResponse.case1);
    searchReceptionInformation.ReceptionInfoAllItems[0].statusCode = "900";
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: searchReceptionInformation,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const expected = structuredClone(mockResponse.expectedJson_受付番号設定なし);
    expected.itemGroups[0].receptionStatusCode = "900";
    expected.itemGroups[0].receptionStatusName = "Reception Cancel";
    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_Ordercancel", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const searchReceptionInformation = structuredClone(mockResponse.searchReceptionInformationResponse.case1);
    searchReceptionInformation.ReceptionInfoAllItems[0].statusCode = "901";
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: searchReceptionInformation,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const expected = structuredClone(mockResponse.expectedJson_受付番号設定なし);
    expected.itemGroups[0].receptionStatusCode = "901";
    expected.itemGroups[0].receptionStatusName = "Order cancel";
    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_other", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const searchReceptionInformation = structuredClone(mockResponse.searchReceptionInformationResponse.case1);
    searchReceptionInformation.ReceptionInfoAllItems[0].statusCode = "999";
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: searchReceptionInformation,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const expected = structuredClone(mockResponse.expectedJson_受付番号設定なし) as any;
    expected.itemGroups[0].receptionStatusCode = "999";
    expected.itemGroups[0].receptionStatusName = undefined;
    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_保証情報なし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_レコードなし,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定なし_保証情報なし);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_保証履歴なし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定なし_保証履歴なし);
  });

  test("正常系_オーダ情報取得API_カート新規作成", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_NoItem,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カート新規作成);
  });

  test("正常系_オーダ情報取得API_受付番号設定あり_フレーム交換2_商品グループコード指定あり", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const itemGroupCode: string = "250404US000001-2";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .query({itemGroupCode: itemGroupCode})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定あり_商品グループコード指定あり);
  });

  test("正常系_オーダ情報取得API_受付番号設定なし_商品グループコード指定あり", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const itemGroupCode: string = "250404US000001-2";
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .query({itemGroupCode: itemGroupCode})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定なし_商品グループコード指定あり);
  });

  test("正常系_オーダ情報取得API_受付番号設定あり_保証対象レコードなし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_保証対象レコードなし,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_保証対象レコードなし);
  });

  test("正常系_オーダ情報取得API_交換情報追加_レンズ交換分類商品コードあり", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_保証情報あり,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_注文情報取得_保証情報追加);
  });

  test("正常系_オーダ情報取得API_交換情報追加_レンズ交換分類商品コードなし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_保証情報あり_レンズ交換分類商品コードなし,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_注文情報取得_保証情報追加_レンズ交換分類商品コードなし);
  });

  test("正常系_オーダ情報取得API_度数登録方法_処方箋（T_DJ36OMOSCM_TEST-360）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常_度数登録方法あり_処方箋,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_度数登録方法_処方箋);
  });
  
  test("正常系_オーダ情報取得API_度数登録方法_処方箋以外004（T_DJ36OMOSCM_TEST-360）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常_度数登録方法あり_度数不要,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_度数登録方法_処方箋以外);
  });

  test("正常系_オーダ情報取得API_カート_処方箋情報あり", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_度数登録_処方箋,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      // postCartInfo: mockResponse.postCartInfoResponse,
      // getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_保証情報あり,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_注文情報取得_保証情報追加_処方箋);
  });
  test("正常系_オーダ情報取得API_カート_処方箋情報あり_調整で受付", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_度数登録_処方箋_調整,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      // postCartInfo: mockResponse.postCartInfoResponse,
      // getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_保証情報あり,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_注文情報取得_保証情報追加_処方箋_調整);
  });
  test("正常系_オーダ情報取得API_カート_処方箋情報あり_vision設定", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_度数登録_vision設定,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      // postCartInfo: mockResponse.postCartInfoResponse,
      // getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_保証情報あり,
      getPowersById: mockResponse.getPowersById_正常_vision設定,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_注文情報取得_度数情報_vision設定);
  });

  // feature/DJ36_STORE-256
  test("正常系_オーダ情報取得API_カバレッジ取得1_カート情報周り", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_カバレッジ取得_カート情報周り,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      getPowersById: mockResponse.getPowersById_正常_vision設定,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_カート情報周り);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得2-1_度数情報周り", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_カバレッジ取得_度数情報周り,
      getPowersById: mockResponse.getPowersById_カバレッジ取得_度数情報周り,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_度数情報周り);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得2-2_度数情報周り", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_カバレッジ取得_度数情報周り_poweridなし,
      getPowersById: mockResponse.getPowersById_カバレッジ取得_度数情報周り,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_度数情報周り_nullリターン);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得3_オーダ情報周り", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_カバレッジ取得_オーダ情報周り,
      postCartInfo: mockResponse.postCartInfoResponse_カバレッジ取得_オーダ情報周り,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_カバレッジ取得_オーダ情報周り,
      getPowersById: mockResponse.getPowersById_カバレッジ取得_オーダ情報周り,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_オーダ情報周り);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得4_保証情報周り", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_保証開始日未設定,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_受付日時なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const itemGroupCode: string = "250404US000001-2";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .query({itemGroupCode: itemGroupCode})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_保証情報周り);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得5_レンズオプション設定（注文詳細）_LOP-P-110004", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_カバレッジ取得_レンズオプション設定_注文詳細,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse_カバレッジ取得_レンズオプション設定_注文詳細,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_カバレッジ取得_CORRIDOR_LENGTH_11MM,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const itemGroupCode: string = "250404US000001-2";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .query({itemGroupCode: itemGroupCode})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定あり_商品グループコード指定あり);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得5_レンズオプション設定（注文詳細）_LOP-P-110005", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_カバレッジ取得_レンズオプション設定_注文詳細,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse_カバレッジ取得_レンズオプション設定_注文詳細,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_カバレッジ取得_CORRIDOR_LENGTH_13MM,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };

    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const itemGroupCode: string = "250404US000001-2";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .query({itemGroupCode: itemGroupCode})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定あり_商品グループコード指定あり);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得6-1_レンズオプション設定（カート情報）_LOP-P-110004", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_NoItem,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse_CORRIDOR_LENGTH_11MM,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_レンズオプション設定_カート情報1);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得6-2_レンズオプション設定（カート情報）_LOP-P-110005", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_NoItem,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse_CORRIDOR_LENGTH_13MM,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_レンズオプション設定_カート情報2);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得7-1_商品グループ情報設定（注文詳細）", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_カバレッジ取得_レンズオプション設定_注文詳細,
      postCartInfo: mockResponse.postCartInfoResponse_カバレッジ取得_レンズオプション設定_注文詳細,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_カバレッジ取得_商品グループ情報設定_注文詳細,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const itemGroupCode: string = "250404US000001-2";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .query({itemGroupCode: itemGroupCode})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定あり_商品グループコード指定あり);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得7-2_商品グループ情報設定（注文詳細）_レンズ交換判定true", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_カバレッジ取得_レンズオプション設定_注文詳細,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse_カバレッジ取得_レンズオプション設定_注文詳細,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_カバレッジ取得_商品グループ情報設定_注文詳細_レンズ交換判定true,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const itemGroupCode: string = "250404US000001-2";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .query({itemGroupCode: itemGroupCode})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定あり_商品グループコード指定あり);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得7-3_商品グループ情報設定_return_undefined", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_カバレッジ取得_レンズオプション設定_注文詳細,
      postCartInfo: mockResponse.postCartInfoResponse_カバレッジ取得_itemGroups_undefined,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_カバレッジ取得_discountLines_undefined,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const itemGroupCode: string = "250404US000001-2";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .query({itemGroupCode: itemGroupCode})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_商品グループ情報配列設定_return_undefined);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得8-1_注文ステータスコード設定_case1", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_カバレッジ取得_deliveryStatus_BEFORE_PREPARING,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_注文ステータスコード設定_case1);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得8-2_注文ステータスコード設定_case2", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_カバレッジ取得_deliveryStatus_DELIVERY_PREPARING,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_注文ステータスコード設定_case2);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得8-3_注文ステータスコード設定_case3", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_カバレッジ取得_deliveryStatus_READY_FOR_DELIVERY,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_注文ステータスコード設定_case3);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得8-4_注文ステータスコード設定_case4", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_カバレッジ取得_deliveryStatus_DELIVERED,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_注文ステータスコード設定_case4);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得8-5_注文ステータスコード設定_case5", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse_カバレッジ取得_deliveryStatus_DELIVERY_CANCELED,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_注文ステータスコード設定_case5);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得9-1_price_null", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_カバレッジ取得_price_null,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse_カバレッジ取得_price_null,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定なし);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得9-2_price_undefined", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_カバレッジ取得_price_undefined,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse_カバレッジ取得_price_undefined,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定なし);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得10_商品グループ情報配列設定_itemGroupなし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_カバレッジ取得_itemGroups_undefined,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse_カバレッジ取得_itemGroups_undefined,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_商品グループ情報配列設定_itemGroupなし);
  });
  test("異常系_オーダ情報取得API_カバレッジ取得11-1_保証履歴取得API_throw400", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_throw400,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
    //expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_保証履歴取得API_throw400);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得11-2_保証履歴取得API_throw404", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_throw404,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_保証履歴取得API_throw404);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得12_保証情報取得用キー生成NG", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_保証書番号なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_保証情報取得用キー生成NG);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得13_受付番号設定なし_保証情報なし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_throw400,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得14_度数情報取得エラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_error400,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_度数情報取得エラー);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得15_交換回数取得_0未満", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_交換回数取得_0未満,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_受付番号設定あり_フレーム交換);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得16_カート新規作成エラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_NoItem,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case1,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_保証履歴なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const cartId: number = 123;
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({cartId: cartId, receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_カート新規作成エラー);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得17", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_throw404,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse.case2,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberNoItemResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const errReceptionNumber: string = "240123XX000001";

    // テスト実施
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: errReceptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得18_度数情報設定のNAME取得", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberResponse,
      getPowersById: mockResponse.getPowersById_カバレッジ取得_度数情報設定のNAME取得,
      findWarranties: mockResponse.findWarrantiesResponse_正常_フレーム交換あり,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const receptionNumber: string = "250212US000001";
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: receptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse.expectedJson_カバレッジ取得_度数情報設定のNAME取得);
  });
  test("正常系_オーダ情報取得API_カバレッジ取得19_度数情報設定のNAME取得", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      getCartInfo: mockResponse.getCartInfoResponse_NoItem,
      searchReceptionInformation: mockResponse.searchReceptionInformationResponse_test,
      postCartInfo: mockResponse.postCartInfoResponse,
      getOrderByReceptionNumber: mockResponse.getOrderByReceptionNumberNoItemResponse,
      getPowersById: mockResponse.getPowersById_正常,
      findWarranties: mockResponse.findWarrantiesResponse_正常,
      findWarrantyHistories: mockResponse.findWarrantyHistoriesResponse_正常,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const errReceptionNumber: string = "240123XX000001";

    // テスト実施
    const response = await request(app)
      .get(TestInfo.url)
      .query({receptionNumber: errReceptionNumber})
      .set("Content-Type", "application/json")
      .set("staffID", "00028")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
    expect(response.statusCode).toBe(400);
  });

});
