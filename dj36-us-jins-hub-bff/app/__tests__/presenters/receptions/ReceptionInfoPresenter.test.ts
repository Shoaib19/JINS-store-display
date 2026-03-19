import { ApiError, ApiResponse } from "openapi-typescript-fetch";
import request from "supertest";
import {
  getCartInfoResponse,
  getItemsResponse,
  getSalesLensSearchResponse,
  postCalculateAmount,
  postCartInfoResponse,
  postLineitems,
  postReceptionEvents,
  postReceptionInfoResponseCase1,
  postReceptionInfoResponseCase2,
  postReceptionInfoResponseCase3,
  postReceptionInfoResponseCase4
} from "~/__tests__/presenters/receptions/mockResponses/ReceptionInfoPresenterMockResponse";
import app from "~/app";
import { SMSConfig } from "~/src/components/const";
import { getAppDownloadMessage, getReceptionCompleteMessage } from "~/src/utils/createMessage";
import { encryptText } from "~/src/utils/encryptText";
import * as fetchService from "~/src/utils/fetchService";
import * as fetchService4SMS from "~/src/utils/fetchService4SMS";

class TestInfo {
  static readonly url = "/api/sales/receptions";
  static readonly jinsTraceId = crypto.randomUUID();
}


describe("POST " + TestInfo.url, () => {
  let sendApiRequestSpy: jest.SpyInstance;
  let SMSNotifierSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    SMSNotifierSpy = jest.spyOn(fetchService4SMS, "SMSNotifier");
  });
  afterEach(() => {
    sendApiRequestSpy.mockClear();
    SMSNotifierSpy.mockClear();
  });

  test("正常系_受付番号発番API_困りごと度数登録方法指定あり_度数登録フレーム登録なし", async () => {

    // BFF層リクエストボディ
    const body = {
      "storeCode": "83005",
      "visitingPurposeCode": "020",
      "customerIssueCode": "001",
      "prescriptionRegistCode": "002",
      "customerName": "Michael Brown",
      "phoneNumber": "6179432056"
    };

    // const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");

    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      postReceptionInfoResponseCase1
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    const receptionNumber = "250123US000001"

    // レスポンス想定
    const expected = {
      receptionNumber: receptionNumber,
      callingNumber: "F1",
      encryptionReceptionNumber: encryptText(receptionNumber)
    }

    // テスト実施
    const storeCode: String = "83005";
    const pathParameter = `/${storeCode}`;
    const response = await request(app)
      .post(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    const SMSCallCount = [SMSConfig.receptionCompleteMessageEnabled, SMSConfig.appDownloadMessageEnabled].filter((b) => b).length;
    expect(SMSNotifierSpy).toHaveBeenCalledTimes(SMSCallCount);
    let nthCall = 0;
    if (SMSConfig.receptionCompleteMessageEnabled) {
      expect(SMSNotifierSpy).toHaveBeenNthCalledWith(
        ++nthCall,
        expect.anything(),
        `${getReceptionCompleteMessage(
          postReceptionInfoResponseCase1.data.callingNumber,
          postReceptionInfoResponseCase1.data.receptionNumber,
        )}`,
        expect.anything()
      );
    }
    if (SMSConfig.appDownloadMessageEnabled) {
      expect(SMSNotifierSpy).toHaveBeenNthCalledWith(
        ++nthCall,
        expect.anything(),
        `${getAppDownloadMessage()}`,
        expect.anything()
      );
    }
  }, 20000);

  test("正常系_受付番号発番API_困りごと度数登録方法指定なし_フレーム登録なし", async () => {

    // BFF層リクエストボディ
    const body = {
      "visitingPurposeCode": "040",
      "storeCode": "83005",
      "customerName": "David Wilson",
      "phoneNumber": "2063218904"
    }

    // const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");

    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      postReceptionInfoResponseCase2,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    const receptionNumber = "250123US000002"

    // レスポンス想定
    const expected = {
      receptionNumber: "250123US000002",
      callingNumber: "P1",
      encryptionReceptionNumber: encryptText(receptionNumber)
    }

    const storeCode: String = "83005";
    const pathParameter = `/${storeCode}`;

    const response = await request(app)
      .post(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  }, 20000);

  test("正常系_受付番号発番API_フレーム登録あり", async () => {

    const body = {
      "storeCode": "83005",
      "visitingPurposeCode": "010",
      "prescriptionRegistCode": "002",
      "customerName": "John Smith",
      "phoneNumber": "4158726498",
      "frameCode": "MRF-23A-011-128"
    }

    // const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");

    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      postReceptionInfoResponseCase3,
      postCartInfoResponse,
      getCartInfoResponse,
      getSalesLensSearchResponse,
      postCalculateAmount,
      postLineitems,
      postReceptionEvents
    ]

    const receptionNumber = "250123US000003"

    // レスポンス想定
    const expected = {
      receptionNumber: "250123US000003",
      callingNumber: "A1",
      encryptionReceptionNumber: encryptText(receptionNumber)
    }

    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    const storeCode: String = "83005";
    const pathParameter = `/${storeCode}`;

    const response = await request(app)
      .post(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  }, 20000);

  test("正常系_受付番号発番API_困りごと度数登録方法指定なし_フレーム登録なし_電話番号なし", async () => {

    // BFF層リクエストボディ
    const body = {
      "visitingPurposeCode": "040",
      "storeCode": "83005",
      "customerName": "Robert Johnson",
    }

    // const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");

    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      postReceptionInfoResponseCase2,
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    const receptionNumber = "250123US000002"

    // レスポンス想定
    const expected = {
      receptionNumber: "250123US000002",
      callingNumber: "P1",
      encryptionReceptionNumber: encryptText(receptionNumber)
    }

    const storeCode: String = "83005";
    const pathParameter = `/${storeCode}`;

    const response = await request(app)
      .post(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  }, 20000);

  test("正常系_受付番号発番API_フレーム登録あり_電話番号なし", async () => {

    const body = {
      "storeCode": "83005",
      "visitingPurposeCode": "010",
      "prescriptionRegistCode": "002",
      "customerName": "John Smith",
      "frameCode": "MRF-23A-011-128"
    }

    // const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");

    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      postReceptionInfoResponseCase3,
      postCartInfoResponse,
      getCartInfoResponse,
      getSalesLensSearchResponse,
      postCalculateAmount,
      postLineitems,
      postReceptionEvents
    ]

    const receptionNumber = "250123US000003"

    // レスポンス想定
    const expected = {
      receptionNumber: "250123US000003",
      callingNumber: "A1",
      encryptionReceptionNumber: encryptText(receptionNumber)
    }

    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    const storeCode: String = "83005";
    const pathParameter = `/${storeCode}`;

    const response = await request(app)
      .post(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    const SMSCallCount = [SMSConfig.receptionCompleteMessageEnabled, SMSConfig.appDownloadMessageEnabled].filter((b) => b).length;
    expect(SMSNotifierSpy).toHaveBeenCalledTimes(0);
    // let nthCall = 0;
    // if (SMS.enableReceptionComplete) {
    //   expect(SMSNotifierSpy).toHaveBeenNthCalledWith(
    //     ++nthCall,
    //     expect.anything(),
    //     `${getReceptionCompleteMessage(
    //       postReceptionInfoResponseCase1.data.callingNumber,
    //       postReceptionInfoResponseCase1.data.receptionNumber,
    //     )}`,
    //     expect.anything()
    //   );
    // }
    // if (SMS.enableAppDownload) {
    //   expect(SMSNotifierSpy).toHaveBeenNthCalledWith(
    //     ++nthCall,
    //     expect.anything(),
    //     `${getAppDownloadMessage()}`,
    //     expect.anything()
    //   );
    // }
  }, 20000);

  test("正常系_受付番号発番API_困りごと度数登録方法指定null_フレーム登録あり", async () => {

    const body = {
      "storeCode": "83005",
      "visitingPurposeCode": "020",
      "customerIssueCode": null,
      "prescriptionRegistCode": null,
      "customerName": "Michael Brown",
      "phoneNumber": "6179432056",
      "frameCode": "MRF-23A-011-128"
    };

    // const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");

    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      postReceptionInfoResponseCase3,
      postCartInfoResponse,
      getCartInfoResponse,
      getSalesLensSearchResponse,
      postCalculateAmount
    ]

    const receptionNumber = "250123US000003"

    // レスポンス想定
    const expected = {
      receptionNumber: "250123US000003",
      callingNumber: "A1",
      encryptionReceptionNumber: encryptText(receptionNumber)
    }

    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    const storeCode: String = "83005";
    const pathParameter = `/${storeCode}`;

    const response = await request(app)
      .post(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);
  }, 20000);

  test("異常系_受付番号発番API_受付情報新規作成APIで例外", async () => {
    const apiError = {
      headers: new Headers(),
      url: "string",
      status: 500,
      statusText: "",
      data: undefined,
    };

    const body = {
      "storeCode": "83005",
      "visitingPurposeCode": "020",
      "customerIssueCode": "001",
      "prescriptionRegistCode": "002",
      "customerName": "Michael Brown",
      "phoneNumber": "6179432056"
    };

    // const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
    sendApiRequestSpy.mockImplementation(() => {
      throw new ApiError(apiError);
    });
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    const storeCode: String = "83005";
    const pathParameter = `/${storeCode}`;

    const response = await request(app)
      .post(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .send(`${JSON.stringify(body)}`);
    expect(response.statusCode).toBe(500);
  });

  test("異常系_受付番号発番API_フレーム登録あり_フレーム登録時に例外", async () => {

    const apiError = {
      headers: new Headers(),
      url: "string",
      status: 500,
      statusText: "",
      data: undefined,
    };
    const body = {
      "storeCode": "83005",
      "visitingPurposeCode": "010",
      "prescriptionRegistCode": "002",
      "customerName": "John Smith",
      "phoneNumber": "4158726498",
      "frameCode": "MRF-23A-011-128"
    }

    // const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");

    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      postReceptionInfoResponseCase3,
      postCartInfoResponse,
      getCartInfoResponse,
      // getSalesLensSearchResponse,
      // postCalculateAmount
    ]

    const receptionNumber = "250123US000003"

    // レスポンス想定
    const expected = {
      receptionNumber: "250123US000003",
      callingNumber: "A1",
      encryptionReceptionNumber: encryptText(receptionNumber)
    }

    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    sendApiRequestSpy.mockImplementationOnce(() => {
      throw new ApiError(apiError);
    });
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    const storeCode: String = "83005";
    const pathParameter = `/${storeCode}`;

    const response = await request(app)
      .post(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(500);
  });

  test("異常系_受付番号発番API_フレーム登録あり_フレーム登録時に400エラー", async () => {
    const body = {
      "storeCode": "83005",
      "visitingPurposeCode": "010",
      "prescriptionRegistCode": "002",
      "customerName": "John Smith",
      "phoneNumber": "4158726498",
      "frameCode": "XXX-23A-011-128"
    }

    // const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");

    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      postReceptionInfoResponseCase3,
      postCartInfoResponse,
      getCartInfoResponse,
      getSalesLensSearchResponse,
      // // getItemsResponse,
      // postCalculateAmount
    ]

    const receptionNumber = "250123US000003"

    // レスポンス想定
    const expected = {
      receptionNumber: "250123US000003",
      callingNumber: "A1",
      encryptionReceptionNumber: encryptText(receptionNumber)
    }

    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    SMSNotifierSpy.mockImplementation((url: string, data: string, phoneNumber: string) => {});

    const storeCode: String = "83005";
    const pathParameter = `/${storeCode}`;

    const response = await request(app)
      .post(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
  });

  test("異常系_受付番号発番API_SMS通知失敗", async () => {

    // BFF層リクエストボディ
    const body = {
      "storeCode": "83005",
      "visitingPurposeCode": "020",
      "customerIssueCode": "001",
      "prescriptionRegistCode": "002",
      "customerName": "Michael Brown",
      "phoneNumber": "6179432056"
    };

    // const sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");

    // デジタル基盤層のAPIを呼び出す際のレスポンス定義
    const mockResponses = [
      postReceptionInfoResponseCase1
    ]
    for (const mockResponse of mockResponses) {
      if(mockResponse.ok) {
        sendApiRequestSpy.mockResolvedValueOnce(mockResponse);
      } else {
        sendApiRequestSpy.mockRejectedValueOnce(new ApiError(mockResponse as ApiResponse));
      }
    }
    SMSNotifierSpy.mockRejectedValue("error");

    const receptionNumber = "250123US000001"

    // レスポンス想定
    const expected = {
      receptionNumber: receptionNumber,
      callingNumber: "F1",
      encryptionReceptionNumber: encryptText(receptionNumber)
    }

    // テスト実施
    const storeCode: String = "83005";
    const pathParameter = `/${storeCode}`;
    const response = await request(app)
      .post(TestInfo.url + pathParameter)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expected);

    // const SMSCallCount = [SMS.enableReceptionComplete, SMS.enableAppDownload].filter((b) => b).length;
    // expect(SMSNotifierSpy).toHaveBeenCalledTimes(SMSCallCount);
    // let nthCall = 0;
    // if (SMS.enableReceptionComplete) {
    //   expect(SMSNotifierSpy).toHaveBeenNthCalledWith(
    //     ++nthCall,
    //     expect.anything(),
    //     `${getReceptionCompleteMessage(
    //       postReceptionInfoResponseCase1.data.callingNumber,
    //       postReceptionInfoResponseCase1.data.receptionNumber,
    //     )}`,
    //     expect.anything()
    //   );
    // }
    // if (SMS.enableAppDownload) {
    //   expect(SMSNotifierSpy).toHaveBeenNthCalledWith(
    //     ++nthCall,
    //     expect.anything(),
    //     `${getAppDownloadMessage()}`,
    //     expect.anything()
    //   );
    // }
  });

});
