import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IReceptionsSearchPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { ValidationError } from "~/src/components/errors";
import { COUNTRY_CODE_ALPHA2 } from "~/src/components/const";
import { ApiResponse } from "openapi-typescript-fetch";
import {
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { ReceptionInformationSearchRequest, ReceptionInformationSearchResponse } from "~/src/clients/carts/cartsClientTypes";
import { searchReceptionInformation } from "~/src/clients/carts/cartsClient";
import { fixDatetimeForFrontFromDpfm } from "~/src/utils/fixDatetime";
import { components } from "~/src/interfaces/root";

// 受付情報検索API
type RcptSearchGetResponse = components["schemas"]["RcptSearchGetResponse"];

/**
 * 受付情報検索API
 */
@injectable()
export class ReceptionsSearchPresenter implements IReceptionsSearchPresenter {
  /**
   * 受付検索処理
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
      const sortKey = this.setSortKey(req);

      // 管理用注文検索API呼出
      const dpfmRequestInfo = generateDpfmRequestInfo(req);
      const header = makeDpfmRequestHeader(dpfmRequestInfo);
      const cursor = header.get("x-cursor") && !isNaN(Number(header.get("x-cursor"))) ? Number(header.get("x-cursor")) : undefined; // 次回レコード開始位置
      const limit = process.env.PAGE_SIZE ? Number(process.env.PAGE_SIZE) : undefined; // 取得制限数
      const receptionInformationSearchRequest: ReceptionInformationSearchRequest = {
        offset: cursor,
        limit: limit,
        sortKey: sortKey,
        keyword: req.query.keyword ? String(req.query.keyword) : undefined,
        storeCode: req.params.storeCode,
        registeredDateTimeFrom: req.query.fromReceptionDate ? this.removeTimezone(String(req.query.fromReceptionDate)) : undefined,
        registeredDateTimeTo: req.query.toReceptionDate ? this.removeTimezone(String(req.query.toReceptionDate)) : undefined,
        countryCodeAlpha2: req.query.countryCodeAlpha2 ? String(req.query.countryCodeAlpha2) : COUNTRY_CODE_ALPHA2,
        receptionStatusCode: req.query.receptionStatusCode ? String(req.query.receptionStatusCode) : undefined
      };

      logger.info(`receptionInformationSearchRequest: ${JSON.stringify(receptionInformationSearchRequest)}`);

      // デジタル基盤層APIを呼び出す
      const apiResponse: ApiResponse<ReceptionInformationSearchResponse> =
        await sendApiRequest(
          searchReceptionInformation,
          receptionInformationSearchRequest,
          header
        );

      logger.info(`receptionInformationSearchResponse: ${JSON.stringify(apiResponse)}`);

      const receptionInformationSearchResponse = apiResponse.data

      // レスポンスボディの初期化
      const data: RcptSearchGetResponse = {
        receptionInfoList: [],
        totalMatchCount: receptionInformationSearchResponse.totalResults
      };

      // レスポンスボディ注文情報一覧セット
      receptionInformationSearchResponse.ReceptionInfoAllItems?.map((receptionInfo) => {
        data.receptionInfoList?.push({
          receptionNumber: receptionInfo.receptionNumber,
          orderStatusCode: receptionInfo.statusCode,
          customerName: receptionInfo.customerName,
          receptionDate: fixDatetimeForFrontFromDpfm(receptionInfo.registeredDatetime) ?? undefined,
          callingNumber: receptionInfo.callingNumber
        })
      })
   
      if (receptionInformationSearchResponse.hasMore) {
        const nextPage = cursor != undefined && receptionInformationSearchResponse.count != undefined ? cursor + receptionInformationSearchResponse.count : 0;
        res.setHeader("x-cursor", nextPage?.toString() ?? "");
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
   * ソート順設定
   * @param req - Request
   * @returns string
   */
  private setSortKey(req: Request): string {
    if (!req.query.sortKey) return "registeredDatetime:ASC"
    const sortKeys = String(req.query.sortKey).split(",");
    const arrSort: string[] = []
    sortKeys.map((sortKey: string) => {
      const [reqItem, order] = sortKey.split(":");
      let item = reqItem
      switch (reqItem) {
        case "fromReceptionDate":
          item = "registeredDatetime";
          break;
        case "receptionStatusCode":
          item = "statusCode";
          break;
      }
      arrSort.push(`${item}:${order}`)
    })
    return arrSort.join();
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
