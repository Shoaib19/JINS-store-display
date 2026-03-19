import request from "supertest";
import app from "~/app";
import * as fetchService from "~/src/utils/fetchService";
import { logger } from "~/src/logging/logger";

// Mock対象DPFM側API定義
import {
  findReceptionEvents,
} from "~/src/clients/carts/cartsClient";
import { getStaff } from "~/src/clients/staffs/staffsClient";

import * as mockResponse from "./mockResponses/ReceptionEventPresenterMockResponse";
import { EventCode } from "~/src/components/eventCode";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";

class TestInfo {
  static readonly url = "/api/sales/reception-events";
  static readonly receptionNumber = "240115US000001";
  static readonly itemGroupCode = "240115US000001-1";
  static readonly jinsTraceId = crypto.randomUUID();
  static readonly staffid = "00028";
  static readonly pathParameter = `/${this.receptionNumber}/${this.itemGroupCode}`
}

type MockSendApiResult = {
  findReceptionEvents?: (object | undefined | null);
  getStaff?: (object | undefined | null)[];
};
type MockCalledCounter = {
  getStaff : number;
};
const initialCounter : MockCalledCounter = {
  getStaff : 0,
};
let  counter : MockCalledCounter;

function setupSendApiMock(
  sendApiRequestSpy: jest.SpyInstance,
  result: MockSendApiResult
) {
  sendApiRequestSpy.mockImplementation(
    (apiMethod: any, params: any, headers?: Headers, url?: string) => {
      logger.info(`★ ${apiMethod.path} ${apiMethod.method}} ★`);
      var res = undefined;
      switch (apiMethod) {
        case findReceptionEvents:
          res = result?.findReceptionEvents;
          break;
        case getStaff:
          res = result?.getStaff?.at(counter.getStaff++);
          break;
      }
      if (res === undefined) {
        // 未定義の場合、NG(500)で返却
        throw new ApiError( { ok: false, status: 500, data: {undefined} } as ApiResponse);
      } else if (res === null) {
        // nullの場合、NG(404)で返却
        throw new ApiError( { ok: false, status: 404, data: undefined } as ApiResponse);
      }
      return { ok: true, status: 200, data: res };
    }
  );
}

describe("PUT " + TestInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  beforeEach(() => {
    //
    counter = structuredClone(initialCounter);

  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  test("正常系_受付履歴取得API", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      findReceptionEvents: mockResponse.受付履歴取得,
      // staff003はレコードなしにする
      getStaff: [mockResponse.スタッフ情報取得_staff001, mockResponse.スタッフ情報取得_staff002, null,null],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施

    // レスポンス想定
    const expected_チェックイン = {
      eventCode:"000",
      eventName:"Check-in",
      employeeName:"Customer",
      eventDateTime:"2024-10-15T10:00:00Z",
    };
    const expected_度数登録_staff001 = {
      eventCode:"100",
      eventName:"Registered",
      employeeId:"staff001",
      employeeName:"Staff1",
      eventDateTime:"2024-10-15T10:10:00Z",
    };
    const expected_フレーム_staff002 = {
      eventCode:"200",
      eventName:"Frame",
      employeeId:"staff002",
      employeeName:"Staff2",
      eventDateTime:"2024-10-15T10:30:00Z",
    };
    const expected_ケース_staff002 = {
      eventCode:"400",
      eventName:"Case",
      employeeId:"staff002",
      employeeName:"Staff2",
      eventDateTime:"2024-10-15T10:35:00Z",
    };
    const expected_ケース_staff003 = {
      eventCode:"400",
      eventName:"Case",
      employeeId:"staff003",
      employeeName:"-",
      eventDateTime:"2024-10-15T10:35:00Z",
    };
    const expected_ケース_staff004 = {
      eventCode:"400",
      eventName:"Case",
      employeeId:"staff004",
      employeeName:"-",
      eventDateTime:undefined,
    };

    const expected = {
      rcptEvent : [
        expected_チェックイン,
        expected_度数登録_staff001,
        expected_フレーム_staff002,
        expected_ケース_staff002,
        expected_ケース_staff003,
        expected_ケース_staff004
      ]

    };
    const response = await request(app)
      .get(`${TestInfo.url}/${TestInfo.receptionNumber}/${TestInfo.itemGroupCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    // logger.info(`XXXXXXXXXXXXXXXXX: ${JSON.stringify(response)}`);
    expect(response.body).toEqual(expected);
  });

  test("異常系_受付履歴取得API_受付履歴取得API呼び出し時にエラー", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      findReceptionEvents: undefined,
      getStaff: [],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const response = await request(app)
      .get(`${TestInfo.url}/${TestInfo.receptionNumber}/${TestInfo.itemGroupCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(500);
    // logger.info(`XXXXXXXXXXXXXXXXX: ${JSON.stringify(response)}`);
    // expect(response.body).toEqual(expected);
  });
});
