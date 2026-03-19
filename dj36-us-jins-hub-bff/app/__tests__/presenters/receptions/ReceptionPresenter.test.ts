import request from "supertest";
import app from "~/app";
import { fixDatetimeForFront } from "~/src/utils/fixDatetime";
import { WaitingStatus } from "~/src/components/const";
import {
  currentSystemTime,
  findReceptionsResponses,
  getCallManagementResponses,
  getOrderByReceptionNumberResponses,
} from "~/__tests__/presenters/receptions/mockResponses/ReceptionPresenterMockResponses";
import { addMinutes } from "date-fns";
import { roundUpToNextMinute } from "~/src/utils/datetimeUtils";
import { encryptText } from "~/src/utils/encryptText";

import * as fetchService from "~/src/utils/fetchService";
import { logger } from "~/src/logging/logger";
import { getCallManagement, getReceptionsServer } from "~/src/clients/carts/cartsClient";
import { getOrderByReceptionNumber } from "~/src/clients/salesOrder/salesOrderClient";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";

// テスト用定数
const testInfo = {
  url: "/api/sales/receptions",
  contentType: "application/json",
  storeCode: "83005",
  jinsTraceId: crypto.randomUUID(),
  xCursor: "test",
};

let getReceptionsServerCallCounter : number;
type MockSendApiResult = {
  getReceptionsServer?: (object | undefined | null)[];
  getCallManagement?: (object | undefined | null);
  getOrderByReceptionNumber?: (object | undefined | null)
};
function setupSendApiMock(sendApiRequestSpy: jest.SpyInstance, result : MockSendApiResult){
  sendApiRequestSpy.mockImplementation((apiMethod: any, params: any, headers?: Headers, url?: string) => {
    logger.info(`★ ${apiMethod.path} ${apiMethod.method}} ★`);

    let res = undefined;
    switch(apiMethod) {
      case getReceptionsServer:
        res = result?.getReceptionsServer?.at(getReceptionsServerCallCounter++);
        break;
      case getCallManagement:
        res = result?.getCallManagement;
        break;
      case getOrderByReceptionNumber:
        res = result?.getOrderByReceptionNumber;
        break;
    }
    const apiResponse: ApiResponse|undefined = res?res as ApiResponse:undefined;
    if(apiResponse != undefined && apiResponse.ok===false){
       throw new ApiError(apiResponse);
    }
    return apiResponse
    // return res;
  });
}

// 呼出時間の設定
const toCallTime = (waitTimeRange: any) => {
  if(waitTimeRange?.earliest != undefined) {
    return fixDatetimeForFront(roundUpToNextMinute(addMinutes(currentSystemTime, waitTimeRange.earliest)));
  }
  return null;
} 
// 
const filterReceptionsResponses = (findReceptionsResponses: any, receptionNumber: string) => {
  const clone = structuredClone(findReceptionsResponses);
  let found = false;
  clone.data.receptionInfos = clone.data.receptionInfos.filter((r: any) => {
    if(r.receptionNumber == receptionNumber) found = true;
    return (r.receptionNumber == receptionNumber || !found);
  })
  return clone;
}

// 見出し部
describe("GET " + testInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    jest.useFakeTimers();
    jest.setSystemTime(currentSystemTime);
  });
  beforeEach(() => {
    getReceptionsServerCallCounter = 0;
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
  });

  // テスト実施
  test("正常系_店舗指定_受付なし", async () => {
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [findReceptionsResponses.case4],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 店舗コード指定時待ち状況
    const storeCodeReceptionInfo = {
      waitTimeRange: {
        earliest: 0,
        latest: 5,
      },
      waitPeople: 0,
      waitingStatusCode: null
    }
    
    // 期待値の設定
    const expected = {
      waitTimeRange: storeCodeReceptionInfo.waitTimeRange,
      callTime: toCallTime(storeCodeReceptionInfo.waitTimeRange),
      waitPeople: storeCodeReceptionInfo.waitPeople,
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

  test("正常系_店舗指定_視力測定ライン数が10", async () => {
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [findReceptionsResponses.case1],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 店舗コード指定時待ち状況
    const storeCodeReceptionInfo = {
      waitTimeRange :{
        earliest: 0,
        latest: 5,
      },
      waitPeople: 4,
      waitingStatusCode: null
    }

    // 期待値の設定
    const expected = {
      waitTimeRange: storeCodeReceptionInfo.waitTimeRange,
      callTime: toCallTime(storeCodeReceptionInfo.waitTimeRange),
      waitPeople: storeCodeReceptionInfo.waitPeople,
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
  
  test("正常系_店舗指定_視力測定ライン数が10_受付案内終了時間なし", async () => {
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [findReceptionsResponses.case1],
      getCallManagement: getCallManagementResponses.case6,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 店舗コード指定時待ち状況
    const storeCodeReceptionInfo = {
      waitTimeRange :{
        earliest: 0,
        latest: 5,
      },
      waitPeople: 4,
      waitingStatusCode: null
    }

    // 期待値の設定
    const expected = {
      waitTimeRange: storeCodeReceptionInfo.waitTimeRange,
      callTime: toCallTime(storeCodeReceptionInfo.waitTimeRange),
      waitPeople: storeCodeReceptionInfo.waitPeople,
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

  test("正常系_店舗指定_視力測定ライン数が2", async () => {
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [findReceptionsResponses.case1],
      getCallManagement: getCallManagementResponses.case5,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 店舗コード指定時待ち状況
    const storeCodeReceptionInfo = {
      waitTimeRange :{
        earliest: 40,
        latest: 45,
      },
      waitPeople: 4,
      waitingStatusCode: null
    }
    
    // 期待値の設定
    const expected = {
      waitTimeRange: storeCodeReceptionInfo.waitTimeRange,
      callTime: toCallTime(storeCodeReceptionInfo.waitTimeRange),
      waitPeople: storeCodeReceptionInfo.waitPeople,
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

  test("正常系_店舗指定_視力測定ライン数が1、受付終了", async () => {
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [findReceptionsResponses.case1],
      getCallManagement: getCallManagementResponses.case4,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 店舗コード指定時待ち状況
    const storeCodeReceptionInfo = {
      waitTimeRange: {
        earliest: 80,
        latest: 85,
      },
      waitPeople: 4,
      waitingStatusCode: null
    }
    
    // 期待値の設定
    const expected = {
      waitTimeRange: storeCodeReceptionInfo.waitTimeRange,
      callTime: toCallTime(storeCodeReceptionInfo.waitTimeRange),
      waitPeople: storeCodeReceptionInfo.waitPeople,
      waitingStatusCode: storeCodeReceptionInfo.waitingStatusCode,
      callingNumber: null,
      isReceptionClose: true,
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

test("正常系_受付番号指定_EyeExam(度数登録)_呼出管理情報に視力測定ライン数なし", async () => {
    const receptionNumber = "250114US000019";
    const callingNumber = "A11";
    const isReceptionClose = false;

    const mockResult: MockSendApiResult = {
      getReceptionsServer: [filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)],
      getCallManagement: getCallManagementResponses.case7,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const storeCodeReceptionInfo = {
      waitTimeRange: {
        earliest: 40,
        latest: 45,
      },
      waitPeople: null,
      waitingStatusCode: WaitingStatus.RECEPTION_COMPLETE
    };

    const expected = {
      waitTimeRange: storeCodeReceptionInfo.waitTimeRange,
      callTime: toCallTime(storeCodeReceptionInfo.waitTimeRange),
      waitPeople: storeCodeReceptionInfo.waitPeople,
      waitingStatusCode: storeCodeReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({ encryptionReceptionNumber: encryptText(receptionNumber) })
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_EyeExam(度数登録)_呼出待_まもなく呼出", async () => {
    const receptionNumber = "250114US000018"; // A10
    const callingNumber = "A10";
    const isReceptionClose = false;
    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: {
        earliest: 0,
        latest: 5,
      },
      waitPeople: null,
      waitingStatusCode: WaitingStatus.SOON_CALL
    }

    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_EyeExam(度数登録)_呼出待_受付登録", async () => {
    const receptionNumber = "250114US000019"; // A11
    const callingNumber = "A11";
    const isReceptionClose = true;
    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: {
        earliest: 40,
        latest: 45,
      },
      waitPeople: null,
      waitingStatusCode: WaitingStatus.RECEPTION_COMPLETE
    }
    

    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber),
      ],
      getCallManagement: getCallManagementResponses.case4,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_EyeExam(測定)_呼出中", async () => {
    const receptionNumber = "250114US000001"; // A1
    const callingNumber = "A1";
    const isReceptionClose = false;
    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: null,
      waitingStatusCode: WaitingStatus.CALLED
    }

    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    
    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_EyeExam(度数登録)_対応中", async () => {
    const receptionNumber = "250114US000020";
    const callingNumber = "A12";
    const isReceptionClose = false

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: null,
      waitingStatusCode: WaitingStatus.CALLED
    }
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    
    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_EyeExam(度数登録)_不在", async () => {
    const receptionNumber = "250114US000021";
    const callingNumber = "A13";
    const isReceptionClose = false

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: null,
      waitingStatusCode: WaitingStatus.CALLED
    }
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    
    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_EyeExam(測定)_不在後１時間超過", async () => {
    const receptionNumber = "250114US000022";
    const callingNumber = "A14";
    const isReceptionClose = false

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: null,
      waitingStatusCode: WaitingStatus.CALLED
    }
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    
    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_EyeExam(度数登録)_外出", async () => {
    const receptionNumber = "250114US000007"; // A9
    const callingNumber = "A9";
    const isReceptionClose = false
    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: null,
      waitingStatusCode: null
    }
    
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,//
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_NoEyeExam(B列)_呼出待", async () => {
    const receptionNumber = "250114US000012";    // B5
    const callingNumber = "B5";
    const isReceptionClose = true
    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: 1,
      waitingStatusCode: WaitingStatus.RECEPTION_COMPLETE,
    }
    
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case2,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

    test("正常系_受付番号指定_Adjustment(調整)_対応中", async () => {
    const receptionNumber = "250114US000014";    // F6
    const callingNumber = "F6";
    const isReceptionClose = false
    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: null,
      waitingStatusCode: WaitingStatus.CALLED
    }
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_Adjustment(調整)_呼出待", async () => {
    const receptionNumber = "250114US000016";    // F8
    const callingNumber = "F8";
    const isReceptionClose = false
    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: 3,
      waitingStatusCode: WaitingStatus.RECEPTION_COMPLETE,
    }
    
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

    test("正常系_受付番号指定_Adjustment(GeneralHelp)_呼出待", async () => {
    const receptionNumber = "250114US000015";    // G7
    const callingNumber = "G7";
    const isReceptionClose = false
    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: 2,
      waitingStatusCode: WaitingStatus.RECEPTION_COMPLETE,
    }

    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_Cart(カート登録)_対象外", async () => {
    const receptionNumber = "250114US000006"; // B4
    const callingNumber = "B4";
    const isReceptionClose = false

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: null,
      waitingStatusCode: WaitingStatus.CALLED
    }
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    
    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_Payment(会計)_呼出待_まもなく呼出", async () => {
    const receptionNumber = "250114US000013"; // A5
    const callingNumber = "A5";
    const isReceptionClose = false
    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: 0,
      waitingStatusCode: WaitingStatus.SOON_CALL
    }
    
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber),
        findReceptionsResponses.case1
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };
    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_Payment(会計)_呼出待_受付登録", async () => {
    const receptionNumber = "250114US000091"; // A6
    const callingNumber = "A6";
    const isReceptionClose = false
    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: 1,
      waitingStatusCode: WaitingStatus.RECEPTION_COMPLETE
    }

    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber),
        findReceptionsResponses.case1
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_Payment(会計)_自分が見つからない場合_待ち受付なし", async () => {
    const receptionNumber = "250114US000091";
    const callingNumber = "A6";
    const isReceptionClose = false;

    const receptionNumberReceptionInfo = {
      waitTimeRange: null, 
      callTime: null,
      waitPeople: 0,
      waitingStatusCode: WaitingStatus.RECEPTION_COMPLETE,
      callingNumber: "A6",
      isReceptionClose: false,
      receptionNumber: "250114US000091"
    };

    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber),// 1回目：自分を含む受付情報を返す
        findReceptionsResponses.case4, // 2回目：自分の列の待ち受付が空の配列を返す
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: getOrderByReceptionNumberResponses.case1,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };
   // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });
  test("正常系_受付番号指定_Payment(会計)_不在", async () => {
    const receptionNumber = "250114US000005"; // P1
    const callingNumber = "P1";
    const isReceptionClose = false

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null, 
      waitPeople: null,
      waitingStatusCode: WaitingStatus.CALLED
    }
    

    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber),
        findReceptionsResponses.case1
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange, 
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_受付キャンセル", async () => {
    const receptionNumber = "250114US000004"; // G1
    const callingNumber = "G1";
    const isReceptionClose = false
    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: null,
      waitingStatusCode: WaitingStatus.RECEPTIONS_CANCEL
    }
    
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_受付キャンセル_呼出ステータス不正", async () => {
    const receptionNumber = "250114US000023";
    const callingNumber = "F11";
    const isReceptionClose = false
    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: null,
      waitingStatusCode: null,
    }
    
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_受付番号指定_キャンセル済", async () => {
    const receptionNumber = "250114US000017";    // F10
    const callingNumber = "F10";
    const isReceptionClose = false
    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: null,
      waitingStatusCode: WaitingStatus.CALLED
    }

    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  // test("正常系_受付番号指定_Cart(カート登録)", async () => {
  //   const receptionNumber = "250114US000008"; // B3
  //   const callingNumber = "B3";
  //   const isReceptionClose = false
  //   // 受付番号指定時の待ち状況
  //   const receptionNumberReceptionInfo = {
  //     waitTimeRange: null,
  //     waitPeople: null,
  //     waitingStatusCode: WaitingStatus.CALLED
  //   }
  //   const mockResult: MockSendApiResult = {
  //     getReceptionsServer: [
  //       filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
  //     ],
  //     getCallManagement: getCallManagementResponses.case1,
  //     getOrderByReceptionNumber: undefined,
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);

    
  //   // 期待値の設定
  //   const expected = {
  //     waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
  //     callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
  //     waitPeople: receptionNumberReceptionInfo.waitPeople,
  //     waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
  //     callingNumber: callingNumber,
  //     isReceptionClose: isReceptionClose,
  //     receptionNumber: receptionNumber,
  //   };

  //   // テスト実行
  //   const response = await request(app)
  //     .get(testInfo.url + "/" + testInfo.storeCode)
  //     .query({encryptionReceptionNumber: encryptText(receptionNumber)})
  //     .set("Content-Type", testInfo.contentType)
  //     .set("jins-trace-id", testInfo.jinsTraceId)
  //     .set("x-cursor", testInfo.xCursor);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toEqual(expected);
  // });

  test("正常系_受付番号指定_度数登録_列タイプ不正", async () => {
    const receptionNumber = "250114US000003"; // F1
    const callingNumber = "F1";
    const isReceptionClose = false

    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: null,
      waitingStatusCode: WaitingStatus.CALLED
    }
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    
    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });


  // test("正常系_受付番号指定_待ち列に不在あり_受付更新時間1時間以前", async () => {
  //   const receptionNumber = "250114US000012";
  //   const callingNumber = "A1";
  //   const isReceptionClose = true
  //   // 受付番号指定時の待ち状況
  //   const receptionNumberReceptionInfo = {
  //     waitTimeRange: {
  //       earliest: 0,
  //       latest: 5,
  //     },
  //     waitPeople: null,
  //     waitingStatusCode: WaitingStatus.SOON_CALL
  //   }
    
  //   const mockResult: MockSendApiResult = {
  //     getReceptionsServer: [
  //       filterReceptionsResponses(findReceptionsResponses.case3, receptionNumber)
  //     ],
  //     getCallManagement: getCallManagementResponses.case2,
  //     getOrderByReceptionNumber: undefined,
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);

  //   // 期待値の設定
  //   const expected = {
  //     waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
  //     callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
  //     waitPeople: receptionNumberReceptionInfo.waitPeople,
  //     waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
  //     callingNumber: callingNumber,
  //     isReceptionClose: isReceptionClose,
  //     receptionNumber: receptionNumber,
  //   };

  //   // テスト実行
  //   const response = await request(app)
  //     .get(testInfo.url + "/" + testInfo.storeCode)
  //     .query({encryptionReceptionNumber: encryptText(receptionNumber)})
  //     .set("Content-Type", testInfo.contentType)
  //     .set("jins-trace-id", testInfo.jinsTraceId)
  //     .set("x-cursor", testInfo.xCursor);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toEqual(expected);
  // });

  test("正常系_商品グループコード指定_受け渡し準備完了", async () => {
    const receptionNumber = "250114US000011"; // A2
    const itemGroupCode = "250114US000011-1";
    const callingNumber = "A2";
    const isReceptionClose = false;
    const waitingStatusCode = WaitingStatus.READY_FOR_DELIVERY;
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: getOrderByReceptionNumberResponses.case1,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: null,
      callTime: null,
      waitPeople: null,
      waitingStatusCode: waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
      itemGroupCode: itemGroupCode, 
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionItemGroupCode: encryptText(itemGroupCode)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_商品グループコード指定_キャンセル済", async () => {
    const receptionNumber = "250114US000011"; // A2
    const itemGroupCode = "250114US000011-2";
    const callingNumber = "A2";
    const isReceptionClose = false;
    const waitingStatusCode = WaitingStatus.RECEPTIONS_CANCEL;

    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: getOrderByReceptionNumberResponses.case1,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: null,
      callTime: null,
      waitPeople: null,
      waitingStatusCode: waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
      itemGroupCode: itemGroupCode, 
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionItemGroupCode: encryptText(itemGroupCode)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("正常系_商品グループコード指定_呼び出し済み", async () => {
    const receptionNumber = "250114US000011"; // A2
    const itemGroupCode = "250114US000011-3";
    const callingNumber = "A2";
    const isReceptionClose = false;
    const waitingStatusCode = WaitingStatus.CALLED;
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: getOrderByReceptionNumberResponses.case1,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: null,
      callTime: null,
      waitPeople: null,
      waitingStatusCode: WaitingStatus.CALLED,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
      itemGroupCode: itemGroupCode, 
    };

    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .query({encryptionItemGroupCode: encryptText(itemGroupCode)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("異常系_受付番号復号化失敗", async () => {
    const receptionNumber = "250114US000001";
    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: receptionNumber})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_商品グループコード復号化失敗", async () => {
    const itemGroupCode = "250114US000011-1";
    // テスト実行
    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionItemGroupCode: itemGroupCode})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_DPFM待ち状況取得の受付ステータスがnull", async () => {
    const receptionNumber = "250114US000090"; // A4
    const callingNumber = "A4";
    const isReceptionClose = false;
    // 受付番号指定時の待ち状況
    const receptionNumberReceptionInfo = {
      waitTimeRange: null,
      waitPeople: null,
      waitingStatusCode: null
    }
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 期待値の設定
    const expected = {
      waitTimeRange: receptionNumberReceptionInfo.waitTimeRange,
      callTime: toCallTime(receptionNumberReceptionInfo.waitTimeRange),
      waitPeople: receptionNumberReceptionInfo.waitPeople,
      waitingStatusCode: receptionNumberReceptionInfo.waitingStatusCode,
      callingNumber: callingNumber,
      isReceptionClose: isReceptionClose,
      receptionNumber: receptionNumber,
    };

    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  });

  test("異常系_リクエストされた受付番号がDPFM待ち状況取得のレスポンスにない", async () => {
    const receptionNumber = "250114US000099";
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId);
    expect(response.statusCode).toBe(400);
  });

  test("異常系_cart待ち状況取得APIエラー", async () => {
    const mockResult: MockSendApiResult = {
      getReceptionsServer: [findReceptionsResponses.case2],
      getCallManagement: undefined,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_cart呼出管理情報取得APIエラー", async () => {
    const receptionNumber = "250114US000001";

    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case3,
      getOrderByReceptionNumber: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_sales-order注文詳細取得APIエラー", async () => {
    const receptionNumber = "250114US000011"; // A2
    const itemGroupCode = "250114US000011-2";

    const mockResult: MockSendApiResult = {
      getReceptionsServer: [
        filterReceptionsResponses(findReceptionsResponses.case1, receptionNumber)
      ],
      getCallManagement: getCallManagementResponses.case1,
      getOrderByReceptionNumber: getOrderByReceptionNumberResponses.case2,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    const response = await request(app)
      .get(testInfo.url + "/" + testInfo.storeCode)
      .query({encryptionReceptionNumber: encryptText(receptionNumber)})
      .query({encryptionItemGroupCode: encryptText(itemGroupCode)})
      .set("Content-Type", testInfo.contentType)
      .set("jins-trace-id", testInfo.jinsTraceId)
      .set("x-cursor", testInfo.xCursor);
    expect(response.statusCode).toBe(500);
  });
});