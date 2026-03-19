import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IOrderSearchPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { getGlassLinesSearch } from "~/src/clients/salesOrder/salesOrderClient";
import { ValidationError } from "~/src/components/errors";
import { COUNTRY_CODE_ALPHA2, DeliveryStatus, OrderStatus } from "~/src/components/const";
import {
  OrdersGlassLinesSearchRequest,
  OrdersGlassLinesSearchResponse
} from "~/src/clients/salesOrder/salesOrderClientTypes";
import { ApiResponse } from "openapi-typescript-fetch";
import {
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { fixDatetimeForFrontFromDpfm } from "~/src/utils/fixDatetime";
import { components } from "~/src/interfaces/root";

// オーダー情報検索API
type OrderSearchGetResponse = components["schemas"]["OrderSearchResponse"]

/**
 * オーダー情報検索API
 */
@injectable()
export class OrderSearchPresenter implements IOrderSearchPresenter {
  /**
   * オーダー検索処理
   * @param req - Request
   * @param res - Response
   * @param next - NextFunction
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // バリデーションチェック
      this.validateRequest(req);

      // ソート順設定
      const sort = this.setSort(req);

      // 注文ステータスコード設定
      const deliveryStatus = this.setDeliveryStatus(req);

      // 管理用注文検索API呼出
      const dpfmRequestInfo = generateDpfmRequestInfo(req);
      const header = makeDpfmRequestHeader(dpfmRequestInfo);
      const cursor = header.get("x-cursor") ?? undefined;
      const glassLinesSearchGetRequest: OrdersGlassLinesSearchRequest = {
        count: "100",
        page: cursor,
        page_size: process.env.PAGE_SIZE,
        sort: sort,
        "q.keyword": req.query.isSearchingByJinsAccountId
           ? (req.query.jinsAccountId ? String(req.query.jinsAccountId) : undefined)
           : (req.query.keyword ? String(req.query.keyword) : undefined),
        "q.receptionStoreCode": !req.query.countryCodeAlpha2 ? req.params.storeCode : undefined,
        "q.receptionDateTimeFrom": req.query.fromReceptionDate ? this.removeTimezone(String(req.query.fromReceptionDate)) : undefined,
        "q.receptionDateTimeTo": req.query.toReceptionDate ? this.removeTimezone(String(req.query.toReceptionDate)) : undefined,
        "q.deliveryStatus": deliveryStatus,
        "q.orderDateFrom": req.query.fromPurchaseDate ? String(req.query.fromPurchaseDate) : undefined,
        "q.orderDateTo": req.query.toPurchaseDate ? String(req.query.toPurchaseDate) : undefined,
        "q.countryCodeAlpha2": req.query.countryCodeAlpha2 ? String(req.query.countryCodeAlpha2) : COUNTRY_CODE_ALPHA2
      };

      logger.info(`getGlassLinesSearchRequest: ${JSON.stringify(glassLinesSearchGetRequest)}`);

      // デジタル基盤層APIを呼び出す
      const glassLinesSearchGetResponse: ApiResponse<OrdersGlassLinesSearchResponse> =
        await sendApiRequest(
          getGlassLinesSearch,
          glassLinesSearchGetRequest,
          header
        );

      logger.info(`getGlassLinesSearchResponse: ${JSON.stringify(glassLinesSearchGetResponse)}`);

      // レスポンスボディの初期化
      const data: OrderSearchGetResponse = {
        orderInfoList: [],
        totalMatchCount: glassLinesSearchGetResponse.data.totalCount
      };

      // レスポンスボディ注文情報一覧セット
      glassLinesSearchGetResponse.data.nodes.map((node) => {
        data.orderInfoList?.push({
          receptionNumber: node.receptionNumber,
          itemGroupCode: node.glassLineCode,
          isMultipleOrder: glassLinesSearchGetResponse.data.totalCount >= 2,
          orderStatusCode: this.setOrderStatus(node.deliveryStatus),
          customerName: node.customerName,
          receptionDate: fixDatetimeForFrontFromDpfm(node.receptionDateTime) ?? undefined,
          callingNumber: node.callingNumber
        })
      })
      if (glassLinesSearchGetResponse.data.pageInfo.hasNext) {
        res.setHeader("x-cursor", glassLinesSearchGetResponse.data.pageInfo.nextPage?.toString() ?? "");
      }
   
      res.status(200).send(data);
      return;
    } catch (error) {
      next(error);
    }
  };

  /**
   * リクエストバリデート
   * @param req - Request
   */
  private validateRequest(req: Request) {
    const fromReceptionDate = req.query.fromReceptionDate ? String(req.query.fromReceptionDate) : undefined;
    const toReceptionDate = req.query.toReceptionDate ? String(req.query.toReceptionDate) : undefined;
    if (this.isReceptionDate(fromReceptionDate, toReceptionDate)) {
      throw new ValidationError("Both fromReceptionDate and toReceptionDate are required when either one is provided.");
    }

    const fromPurchaseDate = req.query.fromPurchaseDate ? String(req.query.fromPurchaseDate) : undefined;
    const toPurchaseDate = req.query.toPurchaseDate ? String(req.query.toPurchaseDate) : undefined;
    if (this.isPurchaseDate(fromPurchaseDate, toPurchaseDate)) {
      throw new ValidationError("Both fromPurchaseDate and toPurchaseDate are required when either one is provided.");
    }
  }

  /**
   * 受付日判定
   * @param fromReceptionDate - 受付日（検索始め）
   * @param toReceptionDate - 受付日（検索終わり）
   * @returns boolean
   */
  private isReceptionDate(fromReceptionDate?: string, toReceptionDate?: string) {
    if (!fromReceptionDate && !toReceptionDate) return false
    return !fromReceptionDate  || !toReceptionDate;
  }

  /**
   * 購入日判定
   * @param fromPurchaseDate - 購入日（検索始め）
   * @param toPurchaseDate - 購入日（検索終わり）
   * @returns boolean
   */
  private isPurchaseDate(fromPurchaseDate?: string, toPurchaseDate?: string) {
    if (!fromPurchaseDate && !toPurchaseDate) return false
    return !fromPurchaseDate || !toPurchaseDate;
  }

  /**
   * ソート順設定
   * @param req - Request
   * @returns string
   */
  private setSort(req: Request): string {
    const [reqItem, order] = String(req.query.sortKey).split(":");
    const item = reqItem === "fromReceptionDate" ? "receptionDate" : reqItem ;
    let arrSort: string[] = []
    if (order == "ASC") {
      arrSort = [this.setSortOrder(item, order)].concat(["receptionNumber", "glassLineCode"])
    } else {
      arrSort = [this.setSortOrder(item, order)].concat(["-receptionNumber", "glassLineCode"])
    }
    return arrSort.join();
  }

  /**
   * 昇順ソートの場合ポジティブ、降順ソートの場合ネガティブにする
   * @param item - string
   * @param order - string
   * @returns string
   */
  private setSortOrder(item: string, order: string): string {
    return order == "ASC" ? item : `-${item}`;
  }

  /**
   * 引き渡しステータスコード設定
   * @param req - Request
   * @returns string
   */
  private setDeliveryStatus(req: Request): string {
    const arrOrderStatusCode: string[] = String(req.query.orderStatusCode).split(",");
    const arrOrderStatus = arrOrderStatusCode.map((orderStatusCode: string) => {
      switch (orderStatusCode) {
        case OrderStatus.PAYMENT:
          return DeliveryStatus.BEFORE_PREPARING
        case OrderStatus.PROCESSING:
          return DeliveryStatus.DELIVERY_PREPARING
        case OrderStatus.PICKUP:
          return DeliveryStatus.READY_FOR_DELIVERY
        case OrderStatus.ORDER_COMPLETED:
          return DeliveryStatus.DELIVERED
        case OrderStatus.ORDER_CANCELED:
          return DeliveryStatus.DELIVERY_CANCELED
        };
    });
    return arrOrderStatus.join();
  }

  /**
   * 注文ステータスコード設定
   * @param deliveryStatus - deliveryStatus
   * @returns string
   */
  private setOrderStatus(deliveryStatus: string): string {
    switch (deliveryStatus) {
      case DeliveryStatus.BEFORE_PREPARING:
        return OrderStatus.PAYMENT
      case DeliveryStatus.DELIVERY_PREPARING:
        return OrderStatus.PROCESSING
      case DeliveryStatus.READY_FOR_DELIVERY:
        return OrderStatus.PICKUP
      case DeliveryStatus.DELIVERED:
        return OrderStatus.ORDER_COMPLETED
      case DeliveryStatus.DELIVERY_CANCELED:
        return OrderStatus.ORDER_CANCELED
      default:
        return OrderStatus.PAYMENT
      };
  }

  /**
   * 日時型の文字列からタイムゾーンを除去した文字列を返す
   * @param strDatetime 
   * @returns ISO8601フォーマットの文字列（ミリ秒とタイムゾーンなし）
   */
  private removeTimezone(strDatetime: string): string | undefined {
    if (!strDatetime) return undefined;
    return new Date(strDatetime).toISOString().split('.')[0];
  }
}
