import request from "supertest";
import app from "~/app";
import { logger } from "~/src/logging/logger";
import * as fetchService from "~/src/utils/fetchService";

import { postEyepointmeasure, postEyesightcombi } from "~/src/clients/bffValidators/bffValidatorsClient";
import { getCartInfo, postLineitems, postReceptionEvents } from "~/src/clients/carts/cartsClient";
import { postDiameters } from "~/src/clients/diameters/diametersClient";
import { getInventoriesServer } from "~/src/clients/inventories/inventoriesClient";
import { getFrameUniqueAttributes, getItemsServer, getLensUniqueAttributes, getSalesLensSearchServer } from "~/src/clients/items/itemsClient";
import { postCalculateAmount } from "~/src/clients/oms/omsClient";

// テスト実行コマンド
//   npx jest app/__tests__/presenters/xxxx/yyyyPresenter.test.ts
//   ※実行前にMockサーバは起動しておくこと

// ★リクエストボディ定義
import * as testRequest from "~/__tests__/presenters/sales/requests/CartInfoPresenterRequest";
import * as mockResponse from "~/__tests__/presenters/sales/responses/CartInfoPresenterMockResponse";

import { CartGetResponse, Lineitem } from "~/src/clients/carts/cartsClientTypes";
import { Cart } from "~/src/models/sales/Cart";
import { CartItemFactory } from "~/src/models/sales/CartItemFactory";
import { ItemType } from "~/src/models/sales/Suite";
import { generateDpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { ApiError, ApiResponse } from "openapi-typescript-fetch";

type MockSendApiResult = {
  getCartInfo?: (object | undefined | null)[];
  getFrameUniqueAttributes?: (object | undefined | null)[];
  getSalesLensSearchServer?: (object | undefined | null)[];
  postEyesightcombi?: (object | undefined | null)[];
  postDiameters?: (object | undefined | null)[];
  postEyepointmeasure?: (object | undefined | null)[];
  getInventoriesServer?: (object | undefined | null)[];
  getLensUniqueAttributes?: (object | undefined | null)[];
  getItemsServer?: (object | undefined | null)[];
  postCalculateAmount?: (object | undefined | null)[];
  postLineitems?: (object | undefined | null)[];
  postReceptionEvents?: (object | undefined | null)[];
};

let counterGetCartInfo: number = 0;
let counterGetFrameUniqueAttributes: number = 0;
let counterGetSalesLensSearchServer: number = 0;
let counterPostEyesightcombi: number = 0;
let counterPostDiameters: number = 0;
let counterPostEyepointmeasure: number = 0;
let counterGetInventoriesServer: number = 0;
let counterGetLensUniqueAttributes: number = 0;
let counterGetItemsServer: number = 0;
let counterPostCalculateAmount: number = 0;
let counterPostLineitems: number = 0;
let counterPostReceptionEvents: number = 0;

function setupSendApiMock(
  sendApiRequestSpy: jest.SpyInstance,
  result: MockSendApiResult
) {
  sendApiRequestSpy.mockImplementation(
    (apiMethod: any, params: any, headers?: Headers, url?: string) => {
      logger.info(`★ ${apiMethod.path} ${apiMethod.method}} ★`);
      var res = undefined;
      switch (apiMethod) {
        case getCartInfo:
          res = result?.getCartInfo?.at(counterGetCartInfo++);
          break;
        case getFrameUniqueAttributes:
          res = result?.getFrameUniqueAttributes?.at(
            counterGetFrameUniqueAttributes++
          );
          break;
        case getSalesLensSearchServer:
          res = result?.getSalesLensSearchServer?.at(
            counterGetSalesLensSearchServer++
          );
          break;
        case postEyesightcombi:
          res = result?.postEyesightcombi?.at(counterPostEyesightcombi++);
          break;
        case postDiameters:
          res = result?.postDiameters?.at(counterPostDiameters++);
          break;
        case postEyepointmeasure:
          res = result?.postEyepointmeasure?.at(counterPostEyepointmeasure++);
          break;
        case getInventoriesServer:
          res = result?.getInventoriesServer?.at(counterGetInventoriesServer++);
          break;
        case getLensUniqueAttributes:
          res = result?.getLensUniqueAttributes?.at(
            counterGetLensUniqueAttributes++
          );
          break;
        case getItemsServer:
          res = result?.getItemsServer?.at(counterGetItemsServer++);
          break;
        case postCalculateAmount:
          res = result?.postCalculateAmount?.at(counterPostCalculateAmount++);
          break;
        case postLineitems:
          res = result?.postLineitems?.at(counterPostLineitems++);
          break;
        case postReceptionEvents:
          res = result?.postReceptionEvents?.at(counterPostReceptionEvents++);
          break;
      }
      if (res === undefined) {
        // 未定義の場合、NGで返却
        if (apiMethod == getCartInfo) {
          // カバレッジのため、カート取得はステータス404を返す
          throw new ApiError({ ok: false, status: 404, data: undefined } as ApiResponse);
        } else {
          throw new ApiError({ ok: false, status: 400, data: undefined } as ApiResponse);
        }
      } else if (res === null) {
        // nullの場合、OK データ部なしで返却
        return { ok: true, status: 200, data: res };
      }
      return { ok: true, status: 200, data: res };
    }
  );
}

/**
 * URL ​/api/sales/carts
 */
// ★テスト共通情報(接続先URL)
class TestInfo {
  static readonly url = `/api/sales/carts`;
  static readonly jinsTraceId = crypto.randomUUID();
  static readonly staffid = "00028";
}

describe("POST /api/sales/carts", () => {
  // モック定義と初期化
  let sendApiRequestSpy: jest.SpyInstance;
  beforeAll(() => {
    sendApiRequestSpy = jest.spyOn(fetchService, "sendApiRequest");
  });
  // 各テストの前処理
  beforeEach(() => {
    counterGetCartInfo = 0;
    counterGetFrameUniqueAttributes = 0;
    counterGetSalesLensSearchServer = 0;
    counterPostEyesightcombi = 0;
    counterPostDiameters = 0;
    counterPostEyepointmeasure = 0;
    counterGetInventoriesServer = 0;
    counterGetLensUniqueAttributes = 0;
    counterGetItemsServer = 0;
    counterPostCalculateAmount = 0;
    counterPostLineitems = 0;
    counterPostReceptionEvents = 0;
  });
  // 各テストの後処理
  afterEach(() => {
    // 初期化(mockFn.mock.calls、mockFn.mock.instances)
    sendApiRequestSpy.mockClear();
  });

  //
  // フレーム登録
  //
  test("正常系_POST_フレーム登録", async () => {
    logger.info(`正常系_POST_フレーム登録`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録;

    const mockResult: MockSendApiResult = {
      //getCartInfo: [mockResponse.cart_商品なし],
      getCartInfo: [mockResponse.cart_レンズ交換一式],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Case01, mockResponse.getItemsServerMockResponse_Cerrito],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_フレーム登録（商品コード指定誤り）", async () => {
    logger.info(`異常系_POST_フレーム登録（商品コード指定誤り）`);
    // ★リクエストパラメタ
    const body = structuredClone(testRequest.postCartInfoRequest_フレーム登録);
    body.itemGroups[0].frame.frameCode = "noItem";

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Case01, mockResponse.getItemsServerMockResponse_Cerrito],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_フレーム更新", async () => {
    logger.info(`正常系_POST_フレーム更新`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  //
  // フレーム登録（レンズ交換）
  //
  test("正常系_POST_フレーム登録_レンズ交換", async () => {
    logger.info(`正常系_POST_フレーム登録_レンズ交換`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録_レンズ交換;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Case01, mockResponse.getItemsServerMockResponse_Cerrito],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_フレーム更新_レンズ交換", async () => {
    logger.info(`正常系_POST_フレーム更新_レンズ交換`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録_レンズ交換;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_フレーム更新_保証交換_メガネ交換", async () => {
    logger.info(`正常系_POST_フレーム更新`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録_保証交換;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        // mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_フレーム更新_保証交換_フレーム交換", async () => {
    logger.info(`正常系_POST_フレーム更新`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録_保証フレーム交換;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        // mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        // mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  //
  // ケース登録
  //
  test("正常系_POST_ケース登録", async () => {
    logger.info(`正常系_POST_ケース登録`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_ケース登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Case01],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_ケースなし→ケース登録", async () => {
    logger.info(`正常系_POST_ケースなし→ケース登録`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_ケース登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_ケースなしだけ],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Case01],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_ケースのみ→ケースなし", async () => {
    logger.info(`正常系_POST_ケースのみ→ケースなし`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_ケースなし;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_ケースだけ],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_ケースあり→ケースなし", async () => {
    logger.info(`正常系_POST_ケースあり→ケースなし`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_ケースなし;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_ケース登録（商品コード指定誤り）", async () => {
    logger.info(`異常系_POST_ケース登録（商品コード指定誤り`);
    // ★リクエストパラメタ
    const body = structuredClone(testRequest.postCartInfoRequest_ケース登録);
    body.itemGroups[0].caseCode = "noItem";

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Case01],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_ケース更新", async () => {
    logger.info(`正常系_POST_ケース更新`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_ケース登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Case01],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  //
  // セリート登録
  //
  test("正常系_POST_セリート登録", async () => {
     logger.info(`正常系_POST_セリート登録`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_セリート登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Cerrito],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_セリートなし→セリート登録", async () => {
    logger.info(`正常系_POST_セリートなし→セリート登録`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_セリート登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_セリートなしだけ],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Cerrito],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_セリートのみ→セリートなし", async () => {
    logger.info(`正常系_POST_セリートのみ→セリートなし`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_セリートなし;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_セリートだけ],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Cerrito],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_セリートあり→セリートなし", async () => {
    logger.info(`正常系_POST_セリートあり→セリートなし`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_セリートなし;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Cerrito],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

   test("異常系_POST_セリート登録（商品コード指定誤り）", async () => {
    logger.info(`異常系_POST_セリート登録（商品コード指定誤り`);
    // ★リクエストパラメタ
    const body = structuredClone(testRequest.postCartInfoRequest_セリート登録);
    body.itemGroups[0].cerritoCode = "noItem";

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Cerrito],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_セリート更新", async () => {
    logger.info(`正常系_POST_セリート更新`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_セリート登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Cerrito],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  //
  // 度数情報登録
  //
  test("正常系_POST_度数情報登録", async () => {
    logger.info(`正常系_POST_度数情報登録`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_度数情報登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_度数情報更新", async () => {
    logger.info(`正常系_POST_度数情報更新`);
    // ★リクエストパラメタ
    const body = structuredClone(testRequest.postCartInfoRequest_度数情報登録);
body.itemGroups[0].prescription.prescriptionExpiration ='2026-04-11T00:00:00Z';

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

    test("正常系_POST_度数情報登録_vision設定", async () => {
    logger.info(`正常系_POST_度数情報登録_vision設定`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_度数情報登録_vision設定;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_度数情報あり_vision設定],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_度数情報登録（焦点分類コードが見つからない）", async () => {
    logger.info(`異常系_POST_度数情報登録（焦点分類コードが見つからない）`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_度数情報登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        // 販売用レンズ検索項目検索APIの戻りを焦点分類コード以外の戻りデータにしてコードなしをテスト
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  //
  // レンズオプション登録
  //
  test("正常系_POST_レンズOP登録", async () => {
    logger.info(`正常系_POST_レンズOP登録`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_レンズOP登録（販売用カラー名称コード指定誤り）", async () => {
    logger.info(`異常系_POST_レンズOP登録（販売用カラー名称コード指定誤り）`);
    // ★リクエストパラメタ
    const body = structuredClone(testRequest.postCartInfoRequest_レンズOP登録);
    body.itemGroups[0].lensOptionCode.salesColorNameItemCode = "noItem";

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_レンズOP登録（販売用レンズ仕様コード指定誤り）", async () => {
    logger.info(`異常系_POST_レンズOP登録（販売用レンズ仕様コード指定誤り）`);
    // ★リクエストパラメタ
    const body = structuredClone(testRequest.postCartInfoRequest_レンズOP登録);
    body.itemGroups[0].lensOptionCode.salesLensSpecItemCode = "noItem";

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_レンズOP登録（累進分類コード指定誤り）", async () => {
    logger.info(`異常系_POST_レンズOP登録（累進分類コード指定誤り）`);
    // ★リクエストパラメタ
    const body = structuredClone(testRequest.postCartInfoRequest_レンズOP登録);
    body.itemGroups[0].lensOptionCode.progressiveCategoryItemCode = "noItem";

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_レンズOP登録（屈折率名称コード指定誤り）", async () => {
    logger.info(`異常系_POST_レンズOP登録（屈折率名称コード指定誤り）`);
    // ★リクエストパラメタ
    const body = structuredClone(testRequest.postCartInfoRequest_レンズOP登録);
    body.itemGroups[0].lensOptionCode.refractiveIndexNameItemCode = "noItem";

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_レンズOP更新", async () => {
    logger.info(`正常系_POST_レンズOP更新`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      //        getFrameUniqueAttributes: [mockResponse.getFrameUniqueAttributesMockResponse],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      // getItemsServer: [mockResponse.getItemsServerMockResponse_Case01, mockResponse.getItemsServerMockResponse_Cerrito],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_レンズOP更新_レンズ交換", async () => {
    logger.info(`正常系_POST_レンズOP更新_レンズ交換`);
    // ★リクエストパラメタ
    // const body = testRequest.postCartInfoRequest_レンズOP登録_レンズ交換;
    const body = testRequest.postCartInfoRequest_レンズOP登録_レンズ交換_レンズ交換分類コード無し;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      getItemsServer: [
        mockResponse.getItemsServerMockResponse_lensReplacement01,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_レンズOP更新_レンズ交換(レンズ交換レコードなし)", async () => {
    logger.info(`正常系_POST_レンズOP更新_レンズ交換(レンズ交換レコードなし)`);
    // ★リクエストパラメタ
    // const body = testRequest.postCartInfoRequest_レンズOP登録_レンズ交換;
    const body = testRequest.postCartInfoRequest_レンズOP登録_レンズ交換_レンズ交換分類コード無し;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      getItemsServer: [
        mockResponse.getItemsServerMockResponse_lensReplacement01,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_レンズOP更新_レンズ交換(レンズ交換分類コード誤り)", async () => {
    logger.info(
      `異常系_POST_レンズOP更新_レンズ交換(レンズ交換分類コード誤り)`
    );
    // ★リクエストパラメタ
    const body = structuredClone(
      testRequest.postCartInfoRequest_レンズOP登録_レンズ交換
    );
    body.itemGroups[0].lensReplacement.lensReplacementTypeCode = "noItem";

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      getItemsServer: [
        mockResponse.getItemsServerMockResponse_lensReplacement01,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_レンズOP削除", async () => {
    logger.info(`正常系_POST_レンズOP削除`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP削除;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      getItemsServer: [
        mockResponse.getItemsServerMockResponse_lensReplacement01,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  //
  // 処方箋画像登録
  //
  test("正常系_POST_処方箋画像登録", async () => {
    logger.info(`正常系_POST_処方箋画像登録`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_処方箋画像登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_処方箋画像更新", async () => {
    logger.info(`正常系_POST_処方箋画像更新`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_処方箋画像登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  //
  // 備考登録
  //
  test("正常系_POST_備考更新", async () => {
    logger.info(`正常系_POST_備考更新`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_備考登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  //
  // チェックアウト
  //
  test("正常系_POST_チェックアウト（１メガネ）", async () => {
    logger.info(`正常系_POST_チェックアウト`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_チェックアウト_処方箋不要", async () => {
    logger.info(`正常系_POST_チェックアウト`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式_処方箋画像不要],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_チェックアウト（複数メガネ）", async () => {
    logger.info(`正常系_POST_チェックアウト`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_複数メガネ],
      postEyesightcombi: [
        mockResponse.postEyesightcombiMockResponse_OK,
        mockResponse.postEyesightcombiMockResponse_OK,
      ],
      postDiameters: [
        mockResponse.postDiametersMockResponse_OK,
        mockResponse.postDiametersMockResponse_OK,
      ],
      postEyepointmeasure: [
        mockResponse.postEyepointmeasureMockResponse_OK,
        mockResponse.postEyepointmeasureMockResponse_OK,
      ],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_チェックアウト（１メガネ・ケースNone）", async () => {
    logger.info(`正常系_POST_チェックアウト（１メガネ・ケースNone）`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式_ケースNone],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_チェックアウト（１メガネ・セリートNone）", async () => {
    logger.info(`正常系_POST_チェックアウト（１メガネ・セリートNone）`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式_セリートNone],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_チェックアウト_保証交換一式", async () => {
    logger.info(`正常系_POST_チェックアウト_保証交換一式`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト_保証交換;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        // mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        // mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_チェックアウト_保証交換フレーム", async () => {
    logger.info(`正常系_POST_チェックアウト_保証交換フレーム`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト_保証交換_フレーム;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        // mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        // mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        // mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_チェックアウト_保証交換レンズ", async () => {
    logger.info(`正常系_POST_チェックアウト_保証交換レンズ`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト_保証交換_レンズ;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        // mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        // mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        // mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_チェックアウト_処方箋画像なし", async () => {
    logger.info(`異常系_POST_チェックアウト_処方箋画像なし`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_処方箋画像なし],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_チェックアウト_フレームなし", async () => {
    logger.info(`異常系_POST_チェックアウト_フレームなし`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレームなし],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_チェックアウト_ケースなし", async () => {
    logger.info(`異常系_POST_チェックアウト_ケースなし`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_ケースなし],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_チェックアウト_セリートなし", async () => {
    logger.info(`異常系_POST_チェックアウト_セリートなし`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_セリートなし],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_チェックアウト_レンズOPなし", async () => {
    logger.info(`異常系_POST_チェックアウト_レンズOPなし`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_レンズOPなし],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_チェックアウト_度数情報不足", async () => {
    logger.info(`異常系_POST_チェックアウト_度数情報不足`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_度数情報不足],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_チェックアウト_処方箋有効期限指定なし", async () => {
    logger.info(`異常系_POST_チェックアウト_処方箋有効期限指定なし`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_処方箋有効期限指定なし],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });


  test("異常系_POST_チェックアウト_遠中近区分不正", async () => {
    logger.info(`異常系_POST_チェックアウト_遠中近区分不正`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_遠中近区分不正],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  // test("正常系_POST_チェックアウト_フレーム在庫なし", async () => {
  //   logger.info(`正常系_POST_チェックアウト_フレーム在庫なし`);
  //   // ★リクエストパラメタ
  //   const body = testRequest.postCartInfoRequest_チェックアウト;

  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: [mockResponse.cart_メガネ一式],
  //     postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
  //     postDiameters: [mockResponse.postDiametersMockResponse_OK],
  //     postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
  //     getInventoriesServer: [
  //       mockResponse.getInventoriesServerMockResponse_フレーム在庫なし,
  //       mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
  //       mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
  //     ],
  //     getLensUniqueAttributes: [
  //       mockResponse.getLensUniqueAttributesMockResponse,
  //       mockResponse.getLensUniqueAttributesMockResponse,
  //     ],
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // 処理発砲
  //   const response = await request(app)
  //     .post(TestInfo.url)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //     .send(JSON.stringify(body));
  //   expect(response.statusCode).toBe(400);
  //   logger.info(`${JSON.stringify(response)}`);
  //   const expectMessage='(Set [0-9]+) The frame selected is out of stock. Please select a different item.';
  //   expect(JSON.stringify(response.body)).toMatch(new RegExp(`.*${expectMessage.replaceAll('\(', '\\(').replaceAll('\)', '\\)').replaceAll('\.', '\\.')}.*`));
  // });

  // test("正常系_POST_チェックアウト_ケース在庫なし", async () => {
  //   logger.info(`正常系_POST_チェックアウト_ケース在庫なし`);
  //   // ★リクエストパラメタ
  //   const body = testRequest.postCartInfoRequest_チェックアウト;

  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: [mockResponse.cart_メガネ一式],
  //     postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
  //     postDiameters: [mockResponse.postDiametersMockResponse_OK],
  //     postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
  //     getInventoriesServer: [
  //       mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
  //       mockResponse.getInventoriesServerMockResponse_ケース在庫なし,
  //       mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
  //     ],
  //     getLensUniqueAttributes: [
  //       mockResponse.getLensUniqueAttributesMockResponse,
  //       mockResponse.getLensUniqueAttributesMockResponse,
  //     ],
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // 処理発砲
  //   const response = await request(app)
  //     .post(TestInfo.url)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //     .send(JSON.stringify(body));
  //   expect(response.statusCode).toBe(400);
  //   logger.info(`${JSON.stringify(response)}`);
  //   const expectMessage='(Set [0-9]+) The glasses case selected is out of stock. Please select a different item.';
  //   expect(JSON.stringify(response.body)).toMatch(new RegExp(`.*${expectMessage.replaceAll('\(', '\\(').replaceAll('\)', '\\)').replaceAll('\.', '\\.')}.*`));
  // });

  // test("異常系_POST_チェックアウト_レンズ固有属性検索API_レンズレコードなし", async () => {
  //   logger.info(`異常系_POST_チェックアウト_レンズ固有属性検索API_レンズレコードなし`);
  //   // ★リクエストパラメタ
  //   const body = testRequest.postCartInfoRequest_チェックアウト;

  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: [mockResponse.cart_メガネ一式],
  //     postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
  //     postDiameters: [mockResponse.postDiametersMockResponse_OK],
  //     postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
  //     getInventoriesServer: [
  //       mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
  //       mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
  //       mockResponse.getInventoriesServerMockResponse_レンズ在庫なし,
  //     ],
  //     getLensUniqueAttributes: [
  //       mockResponse.getLensUniqueAttributesMockResponse,
  //       mockResponse.getLensUniqueAttributesMockResponse_レコードなし,
  //     ],
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // 処理発砲
  //   const response = await request(app)
  //     .post(TestInfo.url)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //     .send(JSON.stringify(body));
  //   expect(response.statusCode).toBe(200);
  //   logger.info(`${JSON.stringify(response)}`);
  //   const expectMessage='(Set [0-9]+) The lens specified cannot be picked up today.';
  //   expect(JSON.stringify(response.body)).toMatch(new RegExp(`.*${expectMessage.replaceAll('\(', '\\(').replaceAll('\)', '\\)').replaceAll('\.', '\\.')}.*`));
  // });

  // test("正常系_POST_チェックアウト_レンズ在庫なし", async () => {
  //   logger.info(`正常系_POST_チェックアウト_レンズ在庫なし`);
  //   // ★リクエストパラメタ
  //   const body = testRequest.postCartInfoRequest_チェックアウト;

  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: [mockResponse.cart_メガネ一式],
  //     postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
  //     postDiameters: [mockResponse.postDiametersMockResponse_OK],
  //     postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
  //     getInventoriesServer: [
  //       mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
  //       mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
  //       mockResponse.getInventoriesServerMockResponse_レンズ在庫なし,
  //     ],
  //     getLensUniqueAttributes: [
  //       mockResponse.getLensUniqueAttributesMockResponse,
  //       mockResponse.getLensUniqueAttributesMockResponse,
  //     ],
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // 処理発砲
  //   const response = await request(app)
  //     .post(TestInfo.url)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //     .send(JSON.stringify(body));
  //   expect(response.statusCode).toBe(200);
  //   logger.info(`${JSON.stringify(response)}`);
  //   const expectMessage='(Set [0-9]+) The lens specified cannot be picked up today.';
  //   expect(JSON.stringify(response.body)).toMatch(new RegExp(`.*${expectMessage.replaceAll('\(', '\\(').replaceAll('\)', '\\)').replaceAll('\.', '\\.')}.*`));
  // });

  //
  // 異常系(全体のパラメータ不正)
  //
  test("異常系_POST_商品分類コード不正", async () => {
    logger.info(`異常系_POST_商品分類コード不正`);
    // ★リクエストパラメタ
    const body = structuredClone(testRequest.postCartInfoRequest_フレーム登録);
    body.itemCategoryCode = "99";

    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_itemGroups未設定", async () => {
    logger.info(`異常系_POST_itemGroups未設定`);
    // ★リクエストパラメタ(itemGroupsにundefined にできないのでチェックアウトから作成)
    const body = structuredClone(
      testRequest.postCartInfoRequest_チェックアウト
    );
    body.itemCategoryCode = "01";

    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_itemGroupId不正", async () => {
    logger.info(`異常系_POST_itemGroupId不正`);
    // ★リクエストパラメタ
    const body = structuredClone(testRequest.postCartInfoRequest_フレーム登録);
    body.itemGroups[0].itemGroupCode = "invalid";

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  //
  // 異常系(APIエラー)
  //
  test("異常系_POST_カート・カタログ取得APIエラー", async () => {
    logger.info(`異常系_POST_カート・カタログ取得APIエラー`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: undefined,
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);

    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_フレーム固有属性検索APIエラー", async () => {
    logger.info(`異常系_POST_フレーム固有属性検索APIエラー`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Case01, mockResponse.getItemsServerMockResponse_Cerrito],
      postCalculateAmount: [undefined],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_商品マスタ検索APIエラー", async () => {
    logger.info(`異常系_POST_商品マスタ検索APIエラー`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_ケース登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getItemsServer: [undefined],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_販売用レンズ検索項目検索APIエラー", async () => {
    logger.info(`異常系_POST_販売用レンズ検索項目検索APIエラー`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        undefined,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_販売用レンズ検索項目検索API応答レコードなし", async () => {
    logger.info(`異常系_POST_販売用レンズ検索項目検索API応答レコードなし`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSearchServerMockResponse_NoList,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_度数組合せチェックAPIエラー", async () => {
    logger.info(`異常系_POST_度数組合せチェックAPIエラー`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      postEyesightcombi: [undefined],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_径不足チェックAPIエラー", async () => {
    logger.info(`異常系_POST_径不足チェックAPIエラー`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [undefined],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_径不足チェックAPI応答データなし", async () => {
    logger.info(`異常系_POST_径不足チェックAPI応答データなし`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_NoList],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_アイポイント測定チェックAPIエラー", async () => {
    logger.info(`異常系_POST_アイポイント測定チェックAPIエラー`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [undefined],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  // test("異常系_POST_レンズ固有属性検索APIエラー", async () => {
  //   logger.info(`異常系_POST_レンズ固有属性検索APIエラー`);
  //   // ★リクエストパラメタ
  //   const body = testRequest.postCartInfoRequest_度数情報登録;

  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: [mockResponse.cart_商品なし],
  //     getSalesLensSearchServer: [
  //       mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
  //     ],
  //     postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
  //     getInventoriesServer: [
  //       mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
  //     ],
  //     getLensUniqueAttributes: [
  //       mockResponse.getLensUniqueAttributesMockResponse,
  //       undefined,
  //     ],
  //     postCalculateAmount: [
  //       mockResponse.postCalculateAmountMockResponse_メガネ一式,
  //     ],
  //     postLineitems: [mockResponse.postLineitemsMockResponse],
  //     postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // 処理発砲
  //   const response = await request(app)
  //     .post(TestInfo.url)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //     .send(JSON.stringify(body));
  //   expect(response.statusCode).toBe(400);
  //   logger.info(`${JSON.stringify(response)}`);
  // });

  // test("異常系_POST_在庫取得APIエラー", async () => {
  //   logger.info(`異常系_POST_在庫取得APIエラー`);
  //   // ★リクエストパラメタ
  //   const body = testRequest.postCartInfoRequest_度数情報登録;

  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: [mockResponse.cart_商品なし],
  //     getSalesLensSearchServer: [
  //       mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
  //     ],
  //     postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
  //     getInventoriesServer: [undefined],
  //     getLensUniqueAttributes: [
  //       mockResponse.getLensUniqueAttributesMockResponse,
  //       mockResponse.getLensUniqueAttributesMockResponse,
  //     ],
  //     postCalculateAmount: [
  //       mockResponse.postCalculateAmountMockResponse_メガネ一式,
  //     ],
  //     postLineitems: [mockResponse.postLineitemsMockResponse],
  //     postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // 処理発砲
  //   const response = await request(app)
  //     .post(TestInfo.url)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //     .send(JSON.stringify(body));
  //   expect(response.statusCode).toBe(500);
  //   logger.info(`${JSON.stringify(response)}`);
  // });

  test("異常系_POST_在庫取得API応答レコードなし", async () => {
    logger.info(`異常系_POST_在庫取得API応答レコードなし`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_度数情報登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_NoList,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_価格・税計算APIエラー", async () => {
    logger.info(`異常系_POST_価格・税計算APIエラー`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getFrameUniqueAttributes: [undefined],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Case01, mockResponse.getItemsServerMockResponse_Cerrito],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_カート情報登録APIエラー", async () => {
    logger.info(`異常系_POST_カート情報登録APIエラー`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Case01, mockResponse.getItemsServerMockResponse_Cerrito],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [undefined],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_受付履歴更新APIエラー", async () => {
    logger.info(`異常系_POST_受付履歴更新APIエラー`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Case01, mockResponse.getItemsServerMockResponse_Cerrito],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [undefined],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_呼出されないコードの呼出し(CartItem)", async () => {
    logger.info(`正常系_呼出されないコードの呼出し(CartItem)`);
    const cartItemTypes: ItemType[] = [
      "frame",
      "case",
      "frame", // フレーム
      "case", // ケース
      "cerrito", // セリート
      // "right_lens", // 右レンズ
      // "left_lens", // 左レンズ
      "prescriptionInfo", // 度数情報
      "salesColorName", // レンズOP（販売用カラー名称）
      "salesLensSpec", // レンズOP（販売用レンズ仕様）
      "focusCategory", // レンズOP（焦点分類）
      "progressiveCategory", // レンズOP（累進分類）
      "refractiveIndexName", // レンズOP（屈折率名称）
      // "rimlessFinishingCategory", // リムレス仕上げ分類
      "lensReplacement", // レンズ交換OP
    ];
    const lineItem: Lineitem = {
      operationCode: "01",
    };
    const dpfmRequestInfo = generateDpfmRequestInfo(undefined!);

    cartItemTypes.forEach(async (itemType) => {
      const cartItem = CartItemFactory.create(itemType, lineItem);
      const itemId = await cartItem?.findItemId(dpfmRequestInfo);
      expect(itemId).toBe(undefined);
    });
    const unknownItem = CartItemFactory.create("frame", {});
    expect(unknownItem).toBe(undefined);
  });

  test("正常系_呼出されないコードの呼出し(Suite)", async () => {
    logger.info(`正常系_呼出されないコードの呼出し(Suite)`);
    const cart = new Cart(mockResponse.cart_商品なし as unknown as  CartGetResponse);
    const itemCode = await cart.suites[0].getLensItemCode(undefined!, "Right");
    expect(itemCode).toBe(null);
  });


  test("異常系_POST_処方箋レンズ不一致", async () => {
    logger.info(`異常系_POST_処方箋レンズ不一致`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_度数情報登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [mockResponse.getSalesLensFocusCategorySearchServerMockResponse,],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_NG,],
      getInventoriesServer: [mockResponse.getInventoriesServerMockResponse_レンズ在庫なし,],
      getLensUniqueAttributes: [mockResponse.getLensUniqueAttributesMockResponse,
                                mockResponse.getLensUniqueAttributesMockResponse,],
      postCalculateAmount: [mockResponse.postCalculateAmountMockResponse_メガネ一式,],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_径不足チェック_フレームの商品コード未指定", async () => {
    logger.info(`正常系_POST_径不足チェック_フレームの商品コード未指定`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_レンズ交換一式],
      getSalesLensSearchServer: [mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
                                 mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
                                 mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
                                 mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [undefined],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
                             mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
                             mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
                             mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,],
      getLensUniqueAttributes: [mockResponse.getLensUniqueAttributesMockResponse,
                                mockResponse.getLensUniqueAttributesMockResponse,],
      postCalculateAmount: [mockResponse.postCalculateAmountMockResponse_メガネ一式,],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_径不足チェックエラー_径不足が含まれていない", async () => {
    logger.info(`異常系_POST_径不足チェックエラー_径不足が含まれていない`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報_処方箋画像],
      getSalesLensSearchServer: [mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
                                 mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
                                 mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
                                 mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_NG],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
                             mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
                             mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
                             mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,],
      getLensUniqueAttributes: [mockResponse.getLensUniqueAttributesMockResponse,
                                mockResponse.getLensUniqueAttributesMockResponse,],
      postCalculateAmount: [mockResponse.postCalculateAmountMockResponse_メガネ一式,],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_径不足チェック正常_径不足が含まれている", async () => {
    logger.info(`正常系_POST_径不足チェック正常_径不足が含まれている`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報_処方箋画像],
      getSalesLensSearchServer: [mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
                                 mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
                                 mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
                                 mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_径不足],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
                             mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
                             mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
                             mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,],
      getLensUniqueAttributes: [mockResponse.getLensUniqueAttributesMockResponse,
                                mockResponse.getLensUniqueAttributesMockResponse,],
      postCalculateAmount: [mockResponse.postCalculateAmountMockResponse_メガネ一式,],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_アイポイント測定チェックAPIエラー", async () => {
    logger.info(`異常系_POST_アイポイント測定チェックAPIエラー`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報_処方箋画像],
      getSalesLensSearchServer: [mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
                                 mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
                                 mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
                                 mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_径不足],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_LeftNG],
      getInventoriesServer: [mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
                             mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
                             mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
                             mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,],
      getLensUniqueAttributes: [mockResponse.getLensUniqueAttributesMockResponse,
                                mockResponse.getLensUniqueAttributesMockResponse,],
      postCalculateAmount: [mockResponse.postCalculateAmountMockResponse_メガネ一式,],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_度数組合せチェックAPIエラー", async () => {
    logger.info(`異常系_POST_度数組合せチェックAPIエラー`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報_処方箋画像],
      getSalesLensSearchServer: [mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
                                 mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
                                 mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
                                 mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_LeftNG],
      postDiameters: [mockResponse.postDiametersMockResponse_径不足],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_LeftNG],
      getInventoriesServer: [mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
                             mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
                             mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
                             mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,],
      getLensUniqueAttributes: [mockResponse.getLensUniqueAttributesMockResponse,
                                mockResponse.getLensUniqueAttributesMockResponse,],
      postCalculateAmount: [mockResponse.postCalculateAmountMockResponse_メガネ一式,],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_処方箋画像エラー", async () => {
    logger.info(`異常系_POST_処方箋画像エラー_画像フォーマットチェック`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_処方箋画像登録;
    body.itemGroups[0].prescription.prescriptionData = "";

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報_処方箋画像],
      getSalesLensSearchServer: [mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
                                 mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
                                 mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
                                 mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_LeftNG],
      getInventoriesServer: [mockResponse.getInventoriesServerMockResponse_フレーム在庫なし,
                             mockResponse.getInventoriesServerMockResponse_ケース在庫なし,
                             mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
                             mockResponse.getInventoriesServerMockResponse_レンズ在庫なし,],
      getLensUniqueAttributes: [mockResponse.getLensUniqueAttributesMockResponse,
                                mockResponse.getLensUniqueAttributesMockResponse,],
      postCalculateAmount: [mockResponse.postCalculateAmountMockResponse_メガネ一式,],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_フレーム登録_レンズ交換_レンズ交換OP（あれば削除）", async () => {
    logger.info(`正常系_POST_フレーム登録_レンズ交換_レンズ交換OP（あれば削除）`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録_レンズ交換;
    body.itemGroups[0].lensReplacement.lensReplacementFlag = false;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_レンズ交換一式],
      getFrameUniqueAttributes: [mockResponse.getFrameUniqueAttributesMockResponse,],
      getSalesLensSearchServer: [mockResponse.getSalesLensFocusCategorySearchServerMockResponse,],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,],
      getLensUniqueAttributes: [mockResponse.getLensUniqueAttributesMockResponse,
                                mockResponse.getLensUniqueAttributesMockResponse,],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Case01, mockResponse.getItemsServerMockResponse_Cerrito],
      postCalculateAmount: [mockResponse.postCalculateAmountMockResponse_メガネ一式,],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  //
  // カバレッジ用各種分岐確認
  //
  test("カバレッジ確認_POST_perspectiveTypeCode＝近々", async () => {
    logger.info(`カバレッジ確認_POST_perspectiveTypeCode＝近々`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_度数情報登録;
    body.itemGroups[0].prescription.prescriptionInfo.perspectiveTypeCode = "005"; //近々

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報],
      getSalesLensSearchServer: [mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
                                 mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
                                 mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
                                 mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
                             mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
                             mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
                             mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,],
      getLensUniqueAttributes: [mockResponse.getLensUniqueAttributesMockResponse,
                                mockResponse.getLensUniqueAttributesMockResponse,],
      postCalculateAmount: [mockResponse.postCalculateAmountMockResponse_メガネ一式,],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("カバレッジ確認_POST_処方箋の有効期限_未設定", async () => {
    logger.info(`カバレッジ確認_POST_処方箋の有効期限_未設定`);
    // ★リクエストパラメタ
    const body = structuredClone(testRequest.postCartInfoRequest_フレーム登録_レンズ交換);

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報_有効期限未設定],
      getSalesLensSearchServer: [mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
                                 mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
                                 mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
                                 mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
                             mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
                             mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
                             mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,],
      getLensUniqueAttributes: [mockResponse.getLensUniqueAttributesMockResponse,
                                mockResponse.getLensUniqueAttributesMockResponse,],
      postCalculateAmount: [mockResponse.postCalculateAmountMockResponse_メガネ一式,],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("カバレッジ確認_POST_処方箋の有効期限_不正", async () => {
    logger.info(`カバレッジ確認_POST_処方箋の有効期限_不正`);
    // ★リクエストパラメタ
    const body = structuredClone(testRequest.postCartInfoRequest_フレーム登録_レンズ交換);

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報_有効期限不正],
      getSalesLensSearchServer: [mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
                                 mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
                                 mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
                                 mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
                             mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
                             mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
                             mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,],
      getLensUniqueAttributes: [mockResponse.getLensUniqueAttributesMockResponse,
                                mockResponse.getLensUniqueAttributesMockResponse,],
      postCalculateAmount: [mockResponse.postCalculateAmountMockResponse_メガネ一式,],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_度数情報登録_度数情報未設定", async () => {
    logger.info(`異常系_POST_度数情報登録_度数情報未設定`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_度数情報登録_度数情報なし;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報未設定],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("異常系_POST_度数情報登録_遠中近区分コード不正", async () => {
    logger.info(`異常系_POST_度数情報登録_遠中近区分コード不正`);
    // ★リクエストパラメタ
    const body = structuredClone(testRequest.postCartInfoRequest_遠中近区分コード不正);

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("カバレッジ確認_POST_処方箋画像登録（PNG)", async () => {
    logger.info(`カバレッジ確認_POST_処方箋画像登録（PNG)`);
    // ★リクエストパラメタ
    const body = structuredClone(testRequest.postCartInfoRequest_処方箋画像登録);
    body.itemGroups[0].prescription.prescriptionData = "iVBOR/hoge.png";

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報],
      getSalesLensSearchServer: [mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
                                 mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
                                 mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
                                 mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
                             mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
                             mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
                             mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,],
      getLensUniqueAttributes: [mockResponse.getLensUniqueAttributesMockResponse,
                                mockResponse.getLensUniqueAttributesMockResponse,],
      postCalculateAmount: [mockResponse.postCalculateAmountMockResponse_メガネ一式,],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  // test("カバレッジ確認_POST_ファイルサイズ超過", async () => {
  //   logger.info(`カバレッジ確認_POST_ファイルサイズ超過)`);
  //   // ★リクエストパラメタ
  //   const body = structuredClone(testRequest.postCartInfoRequest_処方箋画像登録);
  //   const fileData = Buffer.allocUnsafe(Math.ceil(MAXIMUM_IMAGE_BYTE_SIZE*8/6)).fill('a').toString();
  //   body.itemGroups[0].prescription.prescriptionData = "iVBOR/" + fileData;

  //   const mockResult: MockSendApiResult = {
  //     getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報],
  //     getSalesLensSearchServer: [mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
  //                                mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
  //                                mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
  //                                mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,],
  //     postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
  //     postDiameters: [mockResponse.postDiametersMockResponse_OK],
  //     postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
  //     getInventoriesServer: [mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
  //                            mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
  //                            mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,],
  //     getLensUniqueAttributes: [mockResponse.getLensUniqueAttributesMockResponse,
  //                               mockResponse.getLensUniqueAttributesMockResponse,],
  //     postCalculateAmount: [mockResponse.postCalculateAmountMockResponse_メガネ一式,],
  //     postLineitems: [mockResponse.postLineitemsMockResponse],
  //     postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
  //   };
  //   setupSendApiMock(sendApiRequestSpy, mockResult);
  //   // 処理発砲
  //   const response = await request(app)
  //     .post(TestInfo.url)
  //     .set("Content-Type", "application/json")
  //     .set("jins-trace-id", TestInfo.jinsTraceId)
  //     .set("staffid", TestInfo.staffid)
  //     .set("x-cursor", "cursor")
  //     .send(JSON.stringify(body));
  //   expect(response.statusCode).toBe(400);
  //   logger.info(`${JSON.stringify(response)}`);
  // }, 60000);

  test("カバレッジ確認_POST_度数情報登録_右度数情報なし", async () => {
    logger.info(`カバレッジ確認_POST_度数情報登録_右度数情報なし`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_度数情報登録_右度数情報なし;
    body.itemGroups[0].prescription.prescriptionInfo.perspectiveTypeCode = "005";

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報],
      getSalesLensSearchServer: [mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
                                 mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
                                 mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
                                 mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
                             mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
                             mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
                             mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,],
      getLensUniqueAttributes: [mockResponse.getLensUniqueAttributesMockResponse,
                                mockResponse.getLensUniqueAttributesMockResponse,],
      postCalculateAmount: [mockResponse.postCalculateAmountMockResponse_メガネ一式,],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });


  test("正常系_POST_度数情報登録_処方箋", async () => {
    logger.info(`正常系_POST_度数情報登録_処方箋`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_度数情報登録;
    body.itemGroups[0].prescription.registrationMethodCode = "002";
    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("正常系_POST_度数情報登録_処方箋以外", async () => {
    logger.info(`正常系_POST_度数情報登録_処方箋以外`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_度数情報登録;
    body.itemGroups[0].prescription.registrationMethodCode = "004";
    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_リクエスト必須のみ", async () => {
    logger.info(`テストケース確認_POST_リクエスト必須のみ`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録_必須のみ;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_レンズ交換一式],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_フレーム更新_保証交換_フレーム交換_リクエストnull", async () => {
    logger.info(`テストケース確認_POST_フレーム更新_保証交換_フレーム交換_リクエストnull`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録_保証フレーム交換_null;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_メガネ一式],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_度数情報登録_度数情報null", async () => {
    logger.info(`テストケース確認_POST_度数情報登録_度数情報null`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_度数情報登録_度数情報null;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_フレーム_ケース_セリート_度数情報null],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_チェックアウト_レンズOP_null", async () => {
    logger.info(`テストケース確認_POST_チェックアウト_レンズOP_null`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_チェックアウト;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_レンズOP_null],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_フレーム在庫あり,
        mockResponse.getInventoriesServerMockResponse_ケース在庫あり,
        mockResponse.getInventoriesServerMockResponse_セリート在庫あり,
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_レンズ交換_null", async () => {
    logger.info(`テストケース確認_POST_レンズ交換_null`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録_必須のみ;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_レンズ交換_null],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_レンズOP登録_販売用レンズ検索項目検索API(販売用カラー名称)_null", async () => {
    logger.info(`テストケース確認_POST_レンズOP登録_販売用レンズ検索項目検索API(販売用カラー名称)_null`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse_null,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_レンズOP登録_販売用レンズ検索項目検索API(販売用レンズ仕様)_null", async () => {
    logger.info(`テストケース確認_POST_レンズOP登録_販売用レンズ検索項目検索API(販売用レンズ仕様)_null`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse_null,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_レンズOP登録_販売用レンズ検索項目検索API(焦点分類)_null", async () => {
    logger.info(`テストケース確認_POST_レンズOP登録_販売用レンズ検索項目検索API(焦点分類)_null`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_度数情報登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse_null,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_レンズOP登録_販売用レンズ検索項目検索API(累進分類)_null", async () => {
    logger.info(`テストケース確認_POST_レンズOP登録_販売用レンズ検索項目検索API(累進分類)_null`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse_null,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_レンズOP登録_販売用レンズ検索項目検索API(屈折率名称)_null", async () => {
    logger.info(`テストケース確認_POST_レンズOP登録_販売用レンズ検索項目検索API(屈折率名称)_null`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_商品なし],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensSalesColorNameSearchServerMockResponse,
        mockResponse.getSalesLensSalesLensSpecSearchServerMockResponse,
        mockResponse.getSalesLensProgressiveCategorySearchServerMockResponse,
        mockResponse.getSalesLensRefractiveIndexNameSearchServerMockResponse_null,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_フレーム登録_径不足チェック＆レンズ固有属性検索_null", async () => {
    logger.info(`テストケース確認_POST_フレーム登録_径不足チェック＆レンズ固有属性検索_null`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_レンズ交換一式],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_null],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse_null,
        mockResponse.getLensUniqueAttributesMockResponse_null,
      ],
      getItemsServer: [mockResponse.getItemsServerMockResponse_Case01, mockResponse.getItemsServerMockResponse_Cerrito],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_カートカタログ取得_必須のみ", async () => {
    logger.info(`テストケース確認_POST_カートカタログ取得_必須のみ`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_レンズOP登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_required_only],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_フレーム固有属性検索_必須のみ", async () => {
    logger.info(`テストケース確認_POST_フレーム固有属性検索_必須のみ`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_レンズ交換一式],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse_required_only,
      ],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      getItemsServer: [
        mockResponse.getItemsServerMockResponse_Case01,
        mockResponse.getItemsServerMockResponse_Cerrito
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_商品マスタ検索_必須のみ", async () => {
    logger.info(`テストケース確認_POST_商品マスタ検索_必須のみ`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_レンズ交換一式],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      getItemsServer: [
        mockResponse.getItemsServerMockResponse_required_only,
        mockResponse.getItemsServerMockResponse_required_only,
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_度数組合せチェック_必須のみ", async () => {
    logger.info(`テストケース確認_POST_度数組合せチェック_必須のみ`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_レンズ交換一式],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_required_only],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      getItemsServer: [
        mockResponse.getItemsServerMockResponse_Case01,
        mockResponse.getItemsServerMockResponse_Cerrito
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

  test("テストケース確認_POST_アイポイント測定チェック_必須のみ", async () => {
    logger.info(`テストケース確認_POST_アイポイント測定チェック_必須のみ`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_レンズ交換一式],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_required_only],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      getItemsServer: [
        mockResponse.getItemsServerMockResponse_Case01,
        mockResponse.getItemsServerMockResponse_Cerrito
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(400);
    logger.info(`${JSON.stringify(response)}`);
  });

    test("テストケース確認_POST_レンズ固有属性検索_必須のみ", async () => {
    logger.info(`テストケース確認_POST_レンズ固有属性検索_必須のみ`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_レンズ交換一式],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse_レコードなし,
        mockResponse.getLensUniqueAttributesMockResponse_レコードなし,
      ],
      getItemsServer: [
        mockResponse.getItemsServerMockResponse_Case01,
        mockResponse.getItemsServerMockResponse_Cerrito
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_メガネ一式,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

    test("テストケース確認_POST_価格・税計算_必須のみ", async () => {
    logger.info(`テストケース確認_POST_価格・税計算_必須のみ`);
    // ★リクエストパラメタ
    const body = testRequest.postCartInfoRequest_フレーム登録;

    const mockResult: MockSendApiResult = {
      getCartInfo: [mockResponse.cart_レンズ交換一式],
      getFrameUniqueAttributes: [
        mockResponse.getFrameUniqueAttributesMockResponse,
      ],
      getSalesLensSearchServer: [
        mockResponse.getSalesLensFocusCategorySearchServerMockResponse,
      ],
      postEyesightcombi: [mockResponse.postEyesightcombiMockResponse_OK],
      postDiameters: [mockResponse.postDiametersMockResponse_OK],
      postEyepointmeasure: [mockResponse.postEyepointmeasureMockResponse_OK],
      getInventoriesServer: [
        mockResponse.getInventoriesServerMockResponse_レンズ在庫あり,
      ],
      getLensUniqueAttributes: [
        mockResponse.getLensUniqueAttributesMockResponse,
        mockResponse.getLensUniqueAttributesMockResponse,
      ],
      getItemsServer: [
        mockResponse.getItemsServerMockResponse_Case01,
        mockResponse.getItemsServerMockResponse_Cerrito
      ],
      postCalculateAmount: [
        mockResponse.postCalculateAmountMockResponse_required_only,
      ],
      postLineitems: [mockResponse.postLineitemsMockResponse],
      postReceptionEvents: [mockResponse.postReceptionEventsMockResponse],
    };
    setupSendApiMock(sendApiRequestSpy, mockResult);
    // 処理発砲
    const response = await request(app)
      .post(TestInfo.url)
      .set("Content-Type", "application/json")
      .set("jins-trace-id", TestInfo.jinsTraceId)
      .set("staffid", TestInfo.staffid)
      .set("x-cursor", "cursor")
      .send(JSON.stringify(body));
    expect(response.statusCode).toBe(200);
    logger.info(`${JSON.stringify(response)}`);
  });

});
