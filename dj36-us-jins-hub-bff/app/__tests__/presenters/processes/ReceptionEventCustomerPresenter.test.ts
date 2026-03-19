import request from "supertest";
import app from "~/app";
import * as fetchService from "~/src/utils/fetchService";
import { logger } from "~/src/logging/logger";
import { encryptText } from "~/src/utils/encryptText";

// Mock対象DPFM側API定義
import {
  findReceptionEvents,
  searchReceptionInformation
} from "~/src/clients/carts/cartsClient";

import * as mockResponse from "~/__tests__/presenters/processes/mockResponses/ReceptionEventCustomerPresenterMockResponse";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";

class TestInfo {
  static readonly url = "/api/sales/reception-events-customer";
  static readonly jinsTraceId = crypto.randomUUID();
  static readonly staffid = "guest";
  static readonly storeCode = "83005";
  static readonly receptionNumber = "241230US000001"
}
type MockSendApiResult = {
  searchReceptionInformation?: (object | undefined | null);
  findReceptionEvents?: (object | undefined | null);
};

function setupSendApiMock(sendApiRequestSpy: jest.SpyInstance, result : MockSendApiResult){
  sendApiRequestSpy.mockImplementation((apiMethod: any, params: any, headers?: Headers, url?: string) => {
    logger.info(`★ ${apiMethod.path} ${apiMethod.method}} ★`);
    var res = undefined;
    switch (apiMethod) {
      case searchReceptionInformation:
        res = result?.searchReceptionInformation;
        break;
      case findReceptionEvents:
        res = result?.findReceptionEvents;
        break;
    }
    if (res === undefined) {
      // 未定義の場合、NGで返却
      throw new ApiError({ ok: false, status: 400, data: undefined } as ApiResponse);
    } else if (res === null) {
      // nullの場合、404で返却
      throw new ApiError({ ok: false, status: 404, data: undefined } as ApiResponse) ;
    }
    // モックにエラーレスポンスを定義
    if (res.hasOwnProperty("ok") && res.hasOwnProperty("status")) {
      return res as { ok: boolean, status: number, data?: any };
    }
    return { ok: true, status: 200, data: res };
  });
}

describe("GET " + TestInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  beforeEach(() => {
    //
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });


  test("正常系_顧客情報・受付履歴取得API_商品グループ指定あり", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      findReceptionEvents: mockResponse.responseFindReceptionEvents_単一商品グループ
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // レスポンス想定
    const expected = {
      callingNumber: "A44",
      receptionStatusCode: "100",
      receptionNumber: TestInfo.receptionNumber,
      encryptionReceptionNumber: encryptText(TestInfo.receptionNumber),
      customerName: "John Doe",
      callingStatusCode: "001",
      customerPhoneNumber: "07012345678",
      receptionUpdatedTime: "2025-03-28T05:01:00Z",
      itemGroups: [
        {
          itemGroupCode: "240115US000001-1",
          rcptEventList: [],
        },
      ],
    };

    // テスト実施
    const response = await request(app)
      .get(`${TestInfo.url}/${TestInfo.storeCode}/${TestInfo.receptionNumber}`)
      .query(`itemGroupCode=${"240123US000001-1"}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_顧客情報・受付履歴取得API_商品グループ指定なし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_もうすぐ呼出,
      findReceptionEvents: mockResponse.responseFindReceptionEvents_複数商品グループ
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // レスポンス想定
    const expected = {
      callingNumber: "A44",
      receptionStatusCode: "100",
      receptionNumber: TestInfo.receptionNumber,
      encryptionReceptionNumber: encryptText(TestInfo.receptionNumber),
      customerName: "John Doe",
      callingStatusCode: "001",
      customerPhoneNumber: "07012345678",
      receptionUpdatedTime: "2025-03-28T05:01:00Z",
      itemGroups: [
        {
          itemGroupCode: "240115US000001-1",
          rcptEventList: [],
        },
        {
          itemGroupCode: "240115US000001-2",
          rcptEventList: [],
        },
      ],
    };

    // テスト実施
    const response = await request(app)
      .get(`${TestInfo.url}/${TestInfo.storeCode}/${TestInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_顧客情報・受付履歴取得API_undefindあり", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_undefind,
      findReceptionEvents: mockResponse.responseFindReceptionEvents_単一商品グループ
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // レスポンス想定
    const expected = {
      callingNumber: "A44",
      receptionStatusCode: "100",
      customerName: "John Doe",
      callingStatusCode: "001",
      customerPhoneNumber: "07012345678",
      itemGroups: [
        {
          itemGroupCode: "240115US000001-1",
          rcptEventList: [],
        },
      ],
    };

    // テスト実施
    const response = await request(app)
      .get(`${TestInfo.url}/${TestInfo.storeCode}/${TestInfo.receptionNumber}`)
      .query(`itemGroupCode=${"240123US000001-1"}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_顧客情報・受付履歴取得API_null", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_対応中,
      findReceptionEvents: mockResponse.responseFindReceptionEvents_staffNemeNull
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // レスポンス想定
    const expected = {
      callingNumber: "A44",
      receptionStatusCode: "100",
      receptionNumber: TestInfo.receptionNumber,
      encryptionReceptionNumber: encryptText(TestInfo.receptionNumber),
      customerName: "John Doe",
      callingStatusCode: "003",
      customerPhoneNumber: "07012345678",
      receptionUpdatedTime: "2025-03-28T05:01:00Z",
      itemGroups: [
        {
          itemGroupCode: "240115US000001-1",
          rcptEventList: [],
        },
      ],
    };

    // テスト実施
    const response = await request(app)
      .get(`${TestInfo.url}/${TestInfo.storeCode}/${TestInfo.receptionNumber}`)
      .query(`itemGroupCode=${"240123US000001-1"}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });



  test("異常系_顧客情報・受付履歴取得API_受付情報なし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_検索結果なし,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const response = await request(app)
      .get(`${TestInfo.url}/${TestInfo.storeCode}/${TestInfo.receptionNumber}`)
      .query(`itemGroupCode=${"240123US000001-1"}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(400);
  });

  test("異常系_顧客情報・受付履歴取得API_DPFM受付情報検索APIエラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      // searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      findReceptionEvents: mockResponse.responseFindReceptionEvents_複数商品グループ
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const response = await request(app)
      .get(`${TestInfo.url}/${TestInfo.storeCode}/${TestInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(400);
  });

  test("異常系_顧客情報・受付履歴取得API_DPFM受付履歴取得APIエラー", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_正常,
      // findReceptionEvents: mockResponse.responseFindReceptionEvents_複数商品グループ
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const response = await request(app)
      .get(`${TestInfo.url}/${TestInfo.storeCode}/${TestInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(400);
  });

  test("異常系_顧客情報・受付履歴取得API_DPFM受付情報検索APIステータス404", async () => {
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: null,//mockResponse.responseSearchReceptionInformation_ステータス404,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const response = await request(app)
      .get(`${TestInfo.url}/${TestInfo.storeCode}/${TestInfo.receptionNumber}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(400);
  });

});
