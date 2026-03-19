import request from "supertest";
import app from "~/app";
import { fixDatetimeForFront } from "~/src/utils/fixDatetime";
import { WaitingStatus } from "~/src/compornents/const";
import {
  currentSystemTime,
  findReceptionsResponses,
  getCallManagementResponses,
  getOrderByReceptionNumberResponses,
} from "~/__tests__/presenters/receptions/mockResponses/ReceptionPresenterMockResponses";
import { addMinutes } from "date-fns";
import { roundUpToNextMinute } from "~/src/utils/datetimeUtils";
import { encryptText } from "~/src/utils/encryptText";

const fetchService = require("~/src/utils/fetchService");

// テスト用定数
const testInfo = {
  url: "/api/sales/receptions",
  contentType: "application/json",
  storeCode: "83005",
  receptionNumbers: [
    "250114US000001",
    "250114US000002",
    "250114US000003",
    "250114US000004",
    "250114US000005",
    "250114US000006",
    "250114US000007",
    "250114US000008",
    "250114US000011",
    "250114US000012",
    "250114US000090",
    "250114US000099",
    "250114US000013",
    "250114US000014",
    "250114US000015",
    "250114US000016",
    "250114US000017",
  ],
  itemGroupCodes: [
    "250114US000011-1",
    "250114US000011-2",
    "250114US000011-3",
  ],
  jinsTraceId: crypto.randomUUID(),
  xCursor: "test",
};

// 見出し部
describe("GET " + testInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    jest.useFakeTimers();
    jest.setSystemTime(currentSystemTime);
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });
  
  // テスト実施
  test("正常系_店舗指定のみ", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 店舗コード指定時待ち状況
    const storeCodeReceptionInfo = {
      earliest: 0,
      latest: 5,
      otherWaitPeople: 1,
      waitPeople: 1,
      waitingStatusCode: null
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, storeCodeReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: storeCodeReceptionInfo.earliest,
          latest: storeCodeReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: storeCodeReceptionInfo.waitPeople + storeCodeReceptionInfo.otherWaitPeople,
      waitingStatusCode: storeCodeReceptionInfo.waitingStatusCode,
      callingNumber: null,
      isReceptionClose: false
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_店舗指定のみ-2", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1, 
      getCallManagementResponses.case5, // 待ち列の数:2
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 店舗コード指定時待ち状況
    const storeCodeReceptionInfo = {
      earliest: 0,
      latest: 5,
      otherWaitPeople: 1,
      waitPeople: 1,
      waitingStatusCode: null
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, storeCodeReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: storeCodeReceptionInfo.earliest,
          latest: storeCodeReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: storeCodeReceptionInfo.waitPeople + storeCodeReceptionInfo.otherWaitPeople,
      waitingStatusCode: storeCodeReceptionInfo.waitingStatusCode,
      callingNumber: null,
      isReceptionClose: false
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_店舗指定のみ-3", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1, 
      getCallManagementResponses.case4, // 待ち列の数:1
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 店舗コード指定時待ち状況
    const storeCodeReceptionInfo = {
      earliest: 200,
      latest: 205,
      otherWaitPeople: 1,
      waitPeople: 1,
      waitingStatusCode: null
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, storeCodeReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: storeCodeReceptionInfo.earliest,
          latest: storeCodeReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: storeCodeReceptionInfo.waitPeople + storeCodeReceptionInfo.otherWaitPeople,
      waitingStatusCode: storeCodeReceptionInfo.waitingStatusCode,
      callingNumber: null,
      isReceptionClose: false
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_店舗指定のみ-2", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1, // A1x3, B1x4, F1x1, G1x1, P1x1
      getCallManagementResponses.case5, // 待ち列の数:2
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 店舗コード指定時待ち状況
    const storeCodeReceptionInfo = {
      otherWaitPeople: 1,
      earliest: 0,
      latest: 5,
      waitPeople: 1,
      waitingStatusCode: null
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, storeCodeReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: storeCodeReceptionInfo.earliest,
          latest: storeCodeReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: storeCodeReceptionInfo.waitPeople + storeCodeReceptionInfo.otherWaitPeople,
      waitingStatusCode: storeCodeReceptionInfo.waitingStatusCode,
      callingNumber: null,
      isReceptionClose: false,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_店舗指定のみ-3", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1, // A1x3, B1x4, F1x1, G1x1, P1x1
      getCallManagementResponses.case4, // 待ち列の数:1
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 店舗コード指定時待ち状況
    const storeCodeReceptionInfo = {
      otherWaitPeople: 1,
      earliest: 200,
      latest: 205,
      waitPeople: 1,
      waitingStatusCode: null
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, storeCodeReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: storeCodeReceptionInfo.earliest,
          latest: storeCodeReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: storeCodeReceptionInfo.waitPeople + storeCodeReceptionInfo.otherWaitPeople,
      waitingStatusCode: storeCodeReceptionInfo.waitingStatusCode,
      callingNumber: null,
      isReceptionClose: false,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_呼出状態：呼出待_待ち状況：まもなく呼出", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      otherWaitPeople: 1,
      waitPeople: 1,
      waitingStatusCode: WaitingStatus.RECEPTION_COMPLETE
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "A1",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[0],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[0])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_呼出状態：呼出中", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      otherWaitPeople: 0,
      waitPeople: 1,
      waitingStatusCode: WaitingStatus.CALLED
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "B1",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[1],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[1])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_呼出状態：対応中", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      otherWaitPeople: 1,
      waitPeople: 1,
      waitingStatusCode: WaitingStatus.CALLED
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "F1",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[2],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[2])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_呼出状態：取消", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      otherWaitPeople: 1,
      waitPeople: 1,
      waitingStatusCode: WaitingStatus.RECEPTIONS_CANCEL
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "G1",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[3],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[3])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_呼出状態：不在", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      otherWaitPeople: 1,
      waitPeople: 1,
      waitingStatusCode: WaitingStatus.CALLED
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "P1",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[4],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[4])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_呼出状態：対象外", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      otherWaitPeople: 1,
      waitPeople: 1,
      waitingStatusCode: WaitingStatus.CALLED
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "B4",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[5],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[5])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_呼出状態：その他", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      otherWaitPeople: 1,
      waitPeople: 1,
      waitingStatusCode: null
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "B2",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[6],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[6])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_受付ステータス：カート登録", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      otherWaitPeople: 1,
      waitPeople: 1,
      waitingStatusCode: WaitingStatus.RECEPTION_COMPLETE
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "B3",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[7],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[7])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

   test("正常系_受付番号指定_受付ステータス：会計", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      waitPeople: 1,
      otherWaitPeople: 1,
      waitingStatusCode: WaitingStatus.CALLED
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "A5",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[12],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[12])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

    test("正常系_受付番号指定_受付ステータス：調整", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      waitPeople: 1,
      otherWaitPeople: 1,
      waitingStatusCode: WaitingStatus.CALLED
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "F6",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[13],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[13])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

    test("正常系_受付番号指定_受付ステータス：default", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      waitPeople: 1,
      otherWaitPeople: 1,
      waitingStatusCode: null
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "G7",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[14],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[14])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

      test("正常系_受付番号指定_受付ステータス：調整_不在", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      waitPeople: 0,
      otherWaitPeople: 1,
      waitingStatusCode: WaitingStatus.CALLED
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "F8",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[15],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[15])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_受付ステータス：なし", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      waitPeople: 1,
      otherWaitPeople: 1,
      waitingStatusCode: WaitingStatus.CALLED
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "F10",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[16],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[16])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_待ち列に不在あり_受付更新時間1時間未満", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case2,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      otherWaitPeople: 1,
      waitPeople: 1,
      waitingStatusCode: WaitingStatus.RECEPTION_COMPLETE
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "B5",
      isReceptionClose: true,
      receptionNumber: testInfo.receptionNumbers[9],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[9])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_待ち列に不在あり_受付更新時間1時間以前", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case3,
      getCallManagementResponses.case2,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      otherWaitPeople: 1,
      waitPeople: 0,
      waitingStatusCode: WaitingStatus.RECEPTION_COMPLETE
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "A1",
      isReceptionClose: true,
      receptionNumber: testInfo.receptionNumbers[9],
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[9])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_商品グループコード指定_受け渡し準備完了", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
      getOrderByReceptionNumberResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 期待値の設定
    const expected = {
      waitTimeRange: null,
      callTime: null,
      waitPeople: null,
      waitingStatusCode: WaitingStatus.READY_FOR_DELIVERY,
      callingNumber: "A2",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[8],
      itemGroupCode: testInfo.itemGroupCodes[0], 
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionItemGroupCode: encryptText(testInfo.itemGroupCodes[0])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_商品グループコード指定_キャンセル済", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
      getOrderByReceptionNumberResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 期待値の設定
    const expected = {
      waitTimeRange: null,
      callTime: null,
      waitPeople: null,
      waitingStatusCode: WaitingStatus.RECEPTIONS_CANCEL,
      callingNumber: "A2",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[8],
      itemGroupCode: testInfo.itemGroupCodes[1], 
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionItemGroupCode: encryptText(testInfo.itemGroupCodes[1])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_商品グループコード指定_呼び出し済み", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
      getOrderByReceptionNumberResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 期待値の設定
    const expected = {
      waitTimeRange: null,
      callTime: null,
      waitPeople: null,
      waitingStatusCode: WaitingStatus.CALLED,
      callingNumber: "A2",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[8],
      itemGroupCode: testInfo.itemGroupCodes[2], 
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[8])})
      .query({encryptionItemGroupCode: encryptText(testInfo.itemGroupCodes[2])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("異常系_受付番号復号化失敗", async () => {
    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: testInfo.receptionNumbers[0]})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_商品グループコード復号化失敗", async () => {
    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionItemGroupCode: testInfo.itemGroupCodes[0]})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_DPFM待ち状況取得の受付ステータスがnull", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      earliest: 0,
      latest: 5,
      otherWaitPeople: 1,
      waitPeople: 1,
      waitingStatusCode: null
    }
    
    // 呼出時間の設定
    const callTime = addMinutes(currentSystemTime, receptionNumberReceptionInfo.earliest); // 現在の分に待ち時間加算

    // 期待値の設定
    const expected = {
      waitTimeRange: {
          earliest: receptionNumberReceptionInfo.earliest,
          latest: receptionNumberReceptionInfo.latest
      },
      callTime: fixDatetimeForFront(roundUpToNextMinute(callTime)),
      waitPeople: receptionNumberReceptionInfo.waitPeople + receptionNumberReceptionInfo.otherWaitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: "A4",
      isReceptionClose: false,
      receptionNumber: testInfo.receptionNumbers[10],
    };

    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[10])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("異常系_リクエストされた受付番号がDPFM待ち状況取得のレスポンスにない", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[11])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_cart待ち状況取得APIエラー", async () => {
    sendApiRequestSpy.mockResolvedValue(findReceptionsResponses.case2);
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_cart呼出管理情報取得APIエラー", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case3,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[0])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_sales-order注文詳細取得APIエラー", async () => {
    // DPFM層API mockレスポンス
    const mockResponses = [
      findReceptionsResponses.case1,
      getCallManagementResponses.case1,
      getOrderByReceptionNumberResponses.case2,
    ];
    for (const mockResponse of mockResponses) {
      sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
    }

    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(testInfo.receptionNumbers[8])})
      .query({encryptionItemGroupCode: encryptText(testInfo.itemGroupCodes[1])})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(500);
  });
});
