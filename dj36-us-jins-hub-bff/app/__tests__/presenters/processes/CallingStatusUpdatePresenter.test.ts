import request from "supertest";
import app from "~/app";
import * as fetchService from "~/src/utils/fetchService";
import * as fetchService4SMS from "~/src/utils/fetchService4SMS";
import { logger } from "~/src/logging/logger";

// Mock対象DPFM側API定義
import {
    getCallManagement,
    getReceptionsServer,
    postReceptionEvents,
    searchReceptionInformation
} from "~/src/clients/carts/cartsClient";

import * as mockResponse from "~/__tests__/presenters/processes/mockResponses/CallingStatusUpdatePresenterMockResponses";
import { getCallingMessage, getCallingSoonMessage } from "~/src/utils/createMessage";
import { SMSConfig } from "~/src/components/const";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import { TZDate } from "@date-fns/tz/date";

class TestInfo {
  static readonly url = "/api/sales/reception-events/calling-status";
  static readonly jinsTraceId = crypto.randomUUID();
  static readonly staffid = "guest";
  static readonly storeTimezone = "America/Los_Angeles";
}
type MockSendApiResult = {
  searchReceptionInformation?: (object | undefined | null);
  postReceptionEvents?: (object | undefined | null);
  getReceptionsServer?: (object | undefined | null);
  getCallManagement?: (object | undefined | null);
};

let counterPostReceptionEvents: number = 0;

function setupSendApiMock(sendApiRequestSpy: jest.SpyInstance, result : MockSendApiResult){
  sendApiRequestSpy.mockImplementation((apiMethod: any, params: any, headers?: Headers, url?: string) => {
    logger.info(`★ ${apiMethod.path} ${apiMethod.method}} ★`);

    var res = undefined;
    switch(apiMethod) {
      case searchReceptionInformation:
        res = result?.searchReceptionInformation;
        break;
      case postReceptionEvents:
        res = Array.isArray(result?.postReceptionEvents) ? 
        result?.postReceptionEvents.at(counterPostReceptionEvents++) :
        result?.postReceptionEvents;
        break;
      case getReceptionsServer:
        res = result?.getReceptionsServer;
        break;
      case getCallManagement:
        res = result?.getCallManagement;
        break;
    }

    if (res === undefined) {
      // 未定義の場合、NGで返却
      throw new ApiError({ ok: false, status: 400, data: undefined } as ApiResponse);
    } else if (res === null) {
      // nullの場合、OK データ部なしで返却
      return { ok: true, status: 200, data: res };
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
    jest.useFakeTimers();
  });
  beforeEach(() => {
    counterPostReceptionEvents = 0;
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
    SMSNotifierSpy.mockClear();
  });

  test("正常系_呼出ステータス更新API_測定_呼出待→呼出中", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_測定_呼出待→呼出中")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_測定_呼出待,
      postReceptionEvents: {},  // noContents
      // getReceptionsServer: mockResponse.responseGetReceptionsServer,
      // getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "002",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    const SMSCallCount = [SMSConfig.eyeExamCallingMessageEnabled].filter((b) => b).length;
    expect(SMSNotifierSpy).toHaveBeenCalledTimes(SMSCallCount);
    if (SMSConfig.eyeExamCallingMessageEnabled) {
      expect(SMSNotifierSpy).toHaveBeenLastCalledWith(
        expect.anything(),
        `${getCallingMessage(
          mockResponse.responseSearchReceptionInformation_度数登録_呼出待
            .ReceptionInfoAllItems[0].callingNumber,
          mockResponse.responseSearchReceptionInformation_度数登録_呼出待
            .ReceptionInfoAllItems[0].receptionNumber
        )}`,
        expect.anything()
      );
    }
  });

  test("正常系_呼出ステータス更新API_測定_呼出中→呼出済", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_測定_呼出中→呼出済")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_測定_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_呼出ステータス更新API_測定_呼出中→呼出待", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_測定_呼出中→呼出待")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_測定_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "001",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_呼出ステータス更新API_測定_呼出中→不在", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_測定_呼出中→不在")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_測定_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "090",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_呼出ステータス更新API_測定_不在→呼出待", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_測定_不在→呼出待")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_測定_不在,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "001",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_呼出ステータス更新API_度数登録_呼出待→呼出中", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_度数登録_呼出待→呼出中")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出待,
      postReceptionEvents: {},  // noContents
      // getReceptionsServer: mockResponse.responseGetReceptionsServer,
      // getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "002",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    const SMSCallCount = [SMSConfig.eyeExamCallingMessageEnabled].filter((b) => b).length;
    expect(SMSNotifierSpy).toHaveBeenCalledTimes(SMSCallCount);
    if (SMSConfig.eyeExamCallingMessageEnabled) {
      expect(SMSNotifierSpy).toHaveBeenLastCalledWith(
        expect.anything(),
        `${getCallingMessage(
          mockResponse.responseSearchReceptionInformation_度数登録_呼出待
            .ReceptionInfoAllItems[0].callingNumber,
          mockResponse.responseSearchReceptionInformation_度数登録_呼出待
            .ReceptionInfoAllItems[0].receptionNumber
        )}`,
        expect.anything()
      );
    }
  });

  test("正常系_呼出ステータス更新API_度数登録_呼出中→呼出済", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_度数登録_呼出中→呼出済")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    if (SMSConfig.eyeExamCallingSoonMessageEnabled) {
      expect(SMSNotifierSpy).toHaveBeenCalledTimes(1);
      expect(SMSNotifierSpy).toHaveBeenLastCalledWith(
        expect.anything(),
        `${getCallingSoonMessage(
          mockResponse.responseGetReceptionsServer.receptionInfos[2].receptionNumber
        )}`,
        expect.anything()
      );
    } else {
      expect(SMSNotifierSpy).toHaveBeenCalledTimes(0);
    }
  });

  test("正常系_呼出ステータス更新API_度数登録_呼出中→呼出済_測定ライン数_時間ごと減少", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_度数登録_呼出中→呼出済_測定ライン数_時間ごと減少")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement_時間ごと設定あり,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});
    const currentSystemTime = new TZDate(2024, 8-1, 29, 10, 20, 30, TestInfo.storeTimezone);
    jest.setSystemTime(currentSystemTime);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("jins-store-timezone", TestInfo.storeTimezone)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    expect(SMSNotifierSpy).toHaveBeenCalledTimes(0);
    // if (SMSConfig.eyeExamCallingSoonMessageEnabled) {
    //   expect(SMSNotifierSpy).toHaveBeenCalledTimes(1);
    //   expect(SMSNotifierSpy).toHaveBeenLastCalledWith(
    //     expect.anything(),
    //     `${getCallingSoonMessage(
    //       mockResponse.responseGetReceptionsServer.receptionInfos[2].receptionNumber
    //     )}`,
    //     expect.anything()
    //   );
    // } else {
    //   expect(SMSNotifierSpy).toHaveBeenCalledTimes(0);
    // }
  });

   test("正常系_呼出ステータス更新API_度数登録_呼出中→呼出済_測定ライン数_時間ごと増加", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_度数登録_呼出中→呼出済_測定ライン数_時間ごと増加")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement_時間ごと設定あり,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});
    const currentSystemTime = new TZDate(2024, 8-1, 29, 12, 20, 30, TestInfo.storeTimezone);
    jest.setSystemTime(currentSystemTime);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("jins-store-timezone", TestInfo.storeTimezone)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    if (SMSConfig.eyeExamCallingSoonMessageEnabled) {
      expect(SMSNotifierSpy).toHaveBeenCalledTimes(2);
      expect(SMSNotifierSpy).toHaveBeenNthCalledWith(
        1, 
        expect.anything(),
        `${getCallingSoonMessage(
          mockResponse.responseGetReceptionsServer.receptionInfos[2].receptionNumber
        )}`,
        expect.anything()
      );
      expect(SMSNotifierSpy).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        `${getCallingSoonMessage(
          mockResponse.responseGetReceptionsServer.receptionInfos[3].receptionNumber
        )}`,
        expect.anything()
      );
    } else {
      expect(SMSNotifierSpy).toHaveBeenCalledTimes(0);
    }
  });

  test("正常系_呼出ステータス更新API_度数登録_呼出中→呼出済_不在あり", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_度数登録_呼出中→呼出済")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer_不在の受付あり, // 不在、もうすぐ呼出、呼出待
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    if (SMSConfig.eyeExamCallingSoonMessageEnabled) {
      expect(SMSNotifierSpy).toHaveBeenCalledTimes(1);
      expect(SMSNotifierSpy).toHaveBeenLastCalledWith(
        expect.anything(),
        `${getCallingSoonMessage(
          mockResponse.responseGetReceptionsServer.receptionInfos[2].receptionNumber
        )}`,
        expect.anything()
      );
    } else {
      expect(SMSNotifierSpy).toHaveBeenCalledTimes(0);
    }
  });

  test("正常系_呼出ステータス更新API_度数登録_呼出中→呼出済_測定ライン数不正", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_度数登録_呼出中→呼出済_測定ライン数不正")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement_測定ライン数_不正,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    expect(SMSNotifierSpy).toHaveBeenCalledTimes(0);
  });

  test("正常系_呼出ステータス更新API_度数登録_呼出中→呼出待", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_度数登録_呼出中→呼出待")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "001",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_呼出ステータス更新API_度数登録_呼出中→不在", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_度数登録_呼出中→不在")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "090",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_呼出ステータス更新API_度数登録_不在→呼出待", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_度数登録_不在→呼出待")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_不在,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "001",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_呼出ステータス更新API_度数登録_不在→呼出待(まもなく呼び出し)", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_度数登録_不在→呼出待")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const searchReceptionInformation = structuredClone(mockResponse.responseSearchReceptionInformation_度数登録_不在);
    searchReceptionInformation.ReceptionInfoAllItems[0].receptionNumber = "250114US000011";
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: searchReceptionInformation,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "250114US000011",
      "callingStatusCode": "001",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });


  test("正常系_呼出ステータス更新API_調整_呼出待→呼出中", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_調整_呼出待→呼出中")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_調整_呼出待,
      postReceptionEvents: {},  // noContents
      // getReceptionsServer: mockResponse.responseGetReceptionsServer,
      // getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "002",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    const SMSCallCount = [SMSConfig.adjustmentCallingMessageEnabled].filter((b) => b).length;
    expect(SMSNotifierSpy).toHaveBeenCalledTimes(SMSCallCount);
    if (SMSConfig.adjustmentCallingMessageEnabled) {
      expect(SMSNotifierSpy).toHaveBeenLastCalledWith(
        expect.anything(),
        `${getCallingMessage(
          mockResponse.responseSearchReceptionInformation_調整_呼出待.ReceptionInfoAllItems[0].callingNumber,
          mockResponse.responseSearchReceptionInformation_調整_呼出待.ReceptionInfoAllItems[0].receptionNumber
        )}`,
        expect.anything()
      );
    }
  });

  test("正常系_呼出ステータス更新API_調整_呼出中→呼出済", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_調整_呼出中→呼出済")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_調整_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    const SMSCallCount = [SMSConfig.adjustmentCallingSoonMessageEnabled].filter((b) => b).length;
    expect(SMSNotifierSpy).toHaveBeenCalledTimes(SMSCallCount);
    if (SMSConfig.adjustmentCallingSoonMessageEnabled) {
      expect(SMSNotifierSpy).toHaveBeenLastCalledWith(
        expect.anything(),
        `${getCallingSoonMessage(
          mockResponse.responseGetReceptionsServer.receptionInfos[4].receptionNumber  // F4
        )}`,
        expect.anything()
      );
    }
  });
  test("正常系_呼出ステータス更新API_調整_呼出中→呼出済_もうすぐ呼出", async () => {

    SMSConfig.adjustmentCallingSoonMessageEnabled = true;
    logger.info("正常系_呼出ステータス更新API_調整_呼出中→呼出済_もうすぐ呼出");
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");

    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_調整_呼出中,
      postReceptionEvents: {}, // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    const SMSCallCount = [SMSConfig.adjustmentCallingSoonMessageEnabled].filter((b) => b).length;
    expect(SMSNotifierSpy).toHaveBeenCalledTimes(SMSCallCount);
    if (SMSConfig.adjustmentCallingSoonMessageEnabled) {
      const nextReception = mockResponse.responseGetReceptionsServer.receptionInfos[4]; 
      expect(SMSNotifierSpy).toHaveBeenLastCalledWith(
        expect.any(String),
        getCallingSoonMessage(nextReception.receptionNumber),
        nextReception.phoneNumber
      );
    }
  });
  
  test("正常系_呼出ステータス更新API_調整_呼出中→呼出済_次の人が不在", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_調整_呼出中→呼出済")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_調整_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer_不在の受付あり,
      getCallManagement: mockResponse.responseGetCallManagement
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    const SMSCallCount = [SMSConfig.adjustmentCallingSoonMessageEnabled].filter((b) => b).length;
    expect(SMSNotifierSpy).toHaveBeenCalledTimes(0);
  });

  test("正常系_呼出ステータス更新API_調整_呼出中→呼出待", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_調整_呼出中→呼出待")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_調整_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "001",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_呼出ステータス更新API_調整_呼出中→不在", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_調整_呼出中→不在")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_調整_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "090",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_呼出ステータス更新API_調整_不在→呼出待", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_調整_不在→呼出待")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_調整_不在,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "001",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_呼出ステータス更新API_会計_呼出待→呼出中", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_会計_呼出待→呼出中")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_会計_呼出待,
      postReceptionEvents: {},  // noContents
      //getReceptionsServer: mockResponse.responseGetReceptionsServer,
      //getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "002",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
    expect(SMSNotifierSpy).toHaveBeenCalledTimes(0);
  });

   test("正常系_呼出ステータス更新API_会計_呼出中→呼出済", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_会計_呼出中→呼出済")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_会計_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
    expect(SMSNotifierSpy).toHaveBeenCalledTimes(0);
  });

  test("正常系_呼出ステータス更新API_会計_呼出中→呼出待", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_会計_呼出中→呼出待")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_会計_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "001",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_呼出ステータス更新API_会計_呼出中→不在", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_会計_呼出中→不在")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_会計_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "090",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_呼出ステータス更新API_会計_不在→呼出待", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_会計_不在→呼出待")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_会計_不在,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "001",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

    test("正常系_呼出ステータス更新API_GeneralHelp_呼出待→呼出中", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_GeneralHelp_呼出待→呼出中")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_GeneralHelp_呼出待,
      postReceptionEvents: {},  // noContents
      // getReceptionsServer: mockResponse.responseGetReceptionsServer,
      // getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "002",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    const SMSCallCount = [SMSConfig.adjustmentCallingMessageEnabled].filter((b) => b).length;
    expect(SMSNotifierSpy).toHaveBeenCalledTimes(SMSCallCount);
    if (SMSConfig.adjustmentCallingMessageEnabled) {
      expect(SMSNotifierSpy).toHaveBeenLastCalledWith(
        expect.anything(),
        `${getCallingMessage(
          mockResponse.responseSearchReceptionInformation_GeneralHelp_呼出待.ReceptionInfoAllItems[0].callingNumber,
          mockResponse.responseSearchReceptionInformation_GeneralHelp_呼出待.ReceptionInfoAllItems[0].receptionNumber
        )}`,
        expect.anything()
      );
    }
  });

      test("正常系_呼出ステータス更新API_GeneralHelp_呼出待→呼出済", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_GeneralHelp_呼出待→呼出済")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_GeneralHelp_呼出待,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

    test("正常系_呼出ステータス更新API_GeneralHelp_呼出中→呼出待", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_GeneralHelp_呼出中→呼出待")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_GeneralHelp_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "001",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_呼出ステータス更新API_GeneralHelp_呼出中→不在", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_GeneralHelp_呼出中→不在")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_GeneralHelp_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "090",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_呼出ステータス更新API_GeneralHelp_不在→呼出待", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_GeneralHelp_不在→呼出待")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_GeneralHelp_不在,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "001",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("異常系_呼出ステータス更新API_指定呼出ステータス不正", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("異常系_呼出ステータス更新API_指定呼出ステータス不正")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出待,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "999",
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(400);
  });

  test("異常系_呼出ステータス更新API_受付キャンセル", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("異常系_呼出ステータス更新API_受付キャンセル")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_受付キャンセル,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "001",
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("BFF_USSTORESTAFF_0032");
  });

  test("異常系_呼出ステータス更新API_受付ステータス対象外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("異常系_呼出ステータス更新API_受付ステータス対象外")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_カート登録,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "001",
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(400);
  });

  test("異常系_呼出ステータス更新API_受付情報なし", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("異常系_呼出ステータス更新API_受付情報なし")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_レコードなし,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "001",
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(400);
  });

  test("異常系_呼出ステータス更新API_受付情報検索API例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("異常系_呼出ステータス更新API_受付情報検索API例外")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: undefined,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
      expect(response.statusCode).toBe(400);
  });

  test("異常系_呼出ステータス更新API_受付情報更新API例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("異常系_呼出ステータス更新API_受付情報更新API例外")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出中,
      postReceptionEvents: undefined,
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
      expect(response.statusCode).toBe(400);
  });

  test("異常系_呼出ステータス更新API_待ち状況取得API例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("異常系_呼出ステータス更新API_待ち状況取得API例外")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: undefined,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };
      const response = await request(app)
        .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
        .set("Content-Type", "application/json")
        .set("jins-trace-id", TestInfo.jinsTraceId)
        .set("staffid", TestInfo.staffid)
        .set("x-cursor", "cursor")
        .send();
        expect(response.statusCode).toBe(400);
  });

  test("異常系_呼出ステータス更新API_呼出管理情報取得API例外", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_呼出管理情報取得API例外")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(400);
  });

  test("正常系_呼出ステータス更新API_度数登録_呼出待→呼出中(SMS失敗)", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_度数登録_呼出待→呼出中(SMS失敗)")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出待,
      postReceptionEvents: {},  // noContents
      // getReceptionsServer: mockResponse.responseGetReceptionsServer,
      // getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockRejectedValue("error");

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "002",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    if(SMSConfig.eyeExamCallingMessageEnabled) {
      const response = await request(app)
        .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
        .set("Content-Type", "application/json")
        .set("jins-trace-id", TestInfo.jinsTraceId)
        .set("staffid", TestInfo.staffid)
        .set("x-cursor", "cursor")
        .send();
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expected);
    }
  });

  test("正常系_呼出ステータス更新API_度数登録_呼出中→呼出済(SMS失敗)", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_度数登録_呼出中→呼出済(SMS失敗)")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockRejectedValue("error");

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("異常系_呼出ステータス更新API_度数登録_呼出中→呼出済_受付情報更新API例外(もうすぐ呼出)", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("異常系_呼出ステータス更新API_度数登録_呼出中→呼出済_受付情報更新API例外(もうすぐ呼出)")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出中,
      postReceptionEvents: [{}, undefined],  // noContents, エラー
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: mockResponse.responseGetCallManagement,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(400);
  });

  test("正常系_呼出ステータス更新API_呼出管理情報未定義", async () => {
    const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    logger.info("正常系_呼出ステータス更新API_呼出管理情報未定義")
    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResult: MockSendApiResult = {
      searchReceptionInformation: mockResponse.responseSearchReceptionInformation_度数登録_呼出中,
      postReceptionEvents: {},  // noContents
      getReceptionsServer: mockResponse.responseGetReceptionsServer,
      getCallManagement: {},  // 未定義
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    // テスト実施
    const requestInfo = {
      "storeCode": "83005",
      "receptionNumber": "240123US000001",
      "callingStatusCode": "003",
    };
    // レスポンス想定
    const expected = {
      "callingStatusCode": requestInfo.callingStatusCode,
    };

    const response = await request(app)
      .put(`${TestInfo.url}/${requestInfo.storeCode}/${requestInfo.receptionNumber}/${requestInfo.callingStatusCode}`)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

});
