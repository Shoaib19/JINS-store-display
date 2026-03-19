import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IOrderSearchPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { getGlassLinesSearch } from "~/src/clients/salesOrder/salesOrderClient";
import { ErrorResponse } from "~/src/compornents/errors";
import { makeErrorResponse400 } from "~/src/utils/makeErrorResponse400";
import { COUNTRY_CODE_ALPHA2, customerStaffId, DeliveryStatus, OrderStatus } from "~/src/compornents/const";
import { components, operations } from "~/src/interfaces/root";

/**
 * オーダー情報検索API
 */
@injectable()
export class OrderSearchPresenter extends BasePresenter implements IOrderSearchPresenter {
  /**
   * オーダー検索処理
   * @param req - Request
   * @param res - Response
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let traceBranchNo: number = 0; // jins-trace-id-branch-no
      const cursor = req.header("x-cursor");

      const requestHeader: HeadersInit = new Headers();
      requestHeader.set("Accept", req.header("accept") ?? "");
      requestHeader.set("Accept-Language", req.header("accept-language") ?? "");
      requestHeader.set("Content-Type", req.header("content-type") ?? "");
      requestHeader.set("Authorization", req.header("authorization") ?? "");
      requestHeader.set("X-API-KEY", process.env.CRM_API_KEY ?? "");
      requestHeader.set("jins-trace-id", req.header("jins-trace-id") ?? "");
      requestHeader.set("jins-user-id", req.header("staffID") ?? customerStaffId);
      if (cursor) {
        requestHeader.set("X-Cursor", cursor);
      }

      // バリデーションチェック
      const validateError = this.validateRequest(req);
      if (validateError) {
        res.status(400).json(validateError);
        return;
      }

      // ソート順設定
      const sort = this.setSort(req);

      // 注文ステータスコード設定
      const deliveryStatus = this.setDeliveryStatus(req);

      // 管理用注文検索API呼出
      interface GlassLinesSearchGetRequest {
        count: string;
        page?: string;
        page_size?: string;
        sort?: string;
        "q.keyword"?: string;
        "q.receptionStoreCode"?: string;
        "q.receptionDateFrom"?: string,
        "q.receptionDateTo"?: string,
        "q.deliveryStatus"?: string;
        "q.orderDateFrom"?: string;
        "q.orderDateTo"?: string;
        "q.countryCodeAlpha2": string;
      }

      const glassLinesSearchGetRequest: GlassLinesSearchGetRequest = {
        count: "100",
        page: cursor,
        page_size: process.env.PAGE_SIZE,
        sort: sort,
        "q.keyword": req.query.isSearchingByJinsAccountId
           ? (req.query.jinsAccountId ? String(req.query.jinsAccountId) : undefined)
           : (req.query.keyword ? String(req.query.keyword) : undefined),
        "q.receptionStoreCode": !req.query.countryCodeAlpha2 ? req.params.storeCode : undefined,
        "q.receptionDateFrom": req.query.fromReceptionDate ? String(req.query.fromReceptionDate) : undefined,
        "q.receptionDateTo": req.query.toReceptionDate ? String(req.query.toReceptionDate) : undefined,
        "q.deliveryStatus": deliveryStatus,
        "q.orderDateFrom": req.query.fromPurchaseDate ? String(req.query.fromPurchaseDate) : undefined,
        "q.orderDateTo": req.query.toPurchaseDate ? String(req.query.toPurchaseDate) : undefined,
        "q.countryCodeAlpha2": req.query.countryCodeAlpha2 ? String(req.query.countryCodeAlpha2) : COUNTRY_CODE_ALPHA2
      };

      logger.info(`glassLinesSearchGetRequest: ${JSON.stringify(glassLinesSearchGetRequest)}`);

      // デジタル基盤層APIを呼び出す
      requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
      const glassLinesSearchGetResponse = await sendApiRequest(
        getGlassLinesSearch,
        glassLinesSearchGetRequest,
        requestHeader
      );

      logger.info(`glassLinesSearchGetResponse: ${JSON.stringify(glassLinesSearchGetResponse)}`);

      if (!glassLinesSearchGetResponse.ok) {
        res.status(400).json(glassLinesSearchGetResponse.data);
        return;
      }

      let data: components["schemas"]["OrderSearchResponse"] = {
        orderInfoList: [],
        totalMatchCount: glassLinesSearchGetResponse.data.totalCount
      };

      glassLinesSearchGetResponse.data.nodes.map((node: any) => {
        data.orderInfoList?.push({
          receptionNumber: node.receptionNumber,
          itemGroupCode: node.glassLineCode,
          isMultipleOrder: glassLinesSearchGetResponse.data.totalCount >= 2,
          orderStatusCode: this.setOrderStatus(node.deliveryStatus),
          customerName: node.customerName,
          receptionDate: node.receptionDate,
          callingNumber: node.callingNumber
        })
      })
      logger.info(`orderSearchResponse: ${JSON.stringify(data)}`);
      res.status(200).send(data);
      return;
    } catch (error: any) {
      interface ErrorData {
        code: string;
        message: string;
        jinsTraceId: string;
        details: any | null;
      }
      let errorData : ErrorData = error.data;
      errorData.details = errorData.details.debugMessage ?? "";    
      res.status(400).json(errorData);
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };

  /**
   * リクエストバリデート
   * @param req - Request
   * @returns ErrorResponse | undefined
   */
  private validateRequest(req: Request): ErrorResponse | undefined {
    const fromReceptionDate = req.query.fromReceptionDate ? String(req.query.fromReceptionDate) : undefined;
    const toReceptionDate = req.query.toReceptionDate ? String(req.query.toReceptionDate) : undefined;
    if (this.isReceptionDate(fromReceptionDate, toReceptionDate)) {
      return makeErrorResponse400(
        ["Both fromReceptionDate and toReceptionDate are required when either one is provided."],
        req
      );
    }

    const fromPurchaseDate = req.query.fromPurchaseDate ? String(req.query.fromPurchaseDate) : undefined;
    const toPurchaseDate = req.query.toPurchaseDate ? String(req.query.toPurchaseDate) : undefined;
    if (this.isPurchaseDate(fromPurchaseDate, toPurchaseDate)) {
      return makeErrorResponse400(
        ["Both fromPurchaseDate and toPurchaseDate are required when either one is provided."],
        req
      );
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
    let item = reqItem === "fromReceptionDate" ? "receptionDate" : reqItem ;
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
   * @param req - Request
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
}
