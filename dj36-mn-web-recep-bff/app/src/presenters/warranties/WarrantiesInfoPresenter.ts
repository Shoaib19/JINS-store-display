import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";
import { injectable } from "inversify";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { components } from "~/src/interfaces/root";
import { CommonErrorCode } from "~/src/compornents/errorCode";
import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import type { IWarrantiesInfoPresenter } from "~/src/presenters/interfaces";
import { findWarranties, findWarrantyHistories } from "~/src/clients/warranties/warrantiesClient";
import {
  FindWarrantiesPath,
  WarrantyInfo,
  warrantyItemInfo,
  FindWarrantyHistoriesQuery,
  WarrantyHistories
} from "~/src/clients/warranties/warrantiesClientTypes";
import { addDays, getWarrantyExpirationDate, isBefore } from "~/src/utils/datetimeUtils";
import { fixDate, toUTCDateFromString } from "~/src/utils/fixDatetime";
import { getStartOfDate } from "~/src/utils/datetimeUtils";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";
import { TZDate } from "@date-fns/tz/date";

// 交換回数
type ExchangeCount = {
  frame: number,
  lens: number
};

// 保証状態確認レスポンスボディ
type WarrantyGetResponse = components["schemas"]["WarrantyGetResponse"];

/**
 * 保証状態確認API
 */
@injectable()
export class WarrantiesInfoPresenter extends BasePresenter implements IWarrantiesInfoPresenter {

  /**
   * 保証状態確認API
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
      const dpfmRequestInfo = generateDpfmRequestInfo(req);

      const toLocaleDateString = (
        warrantyEndDate: Date | null,
        timeZone: string
      ) => {
        if (warrantyEndDate == null) {
          return "";
        }
        // LocalTimeがyyyy/mm/ddのDateオブジェクトにしてtoLocaleDateString()を呼び出す。
        const tzDate = new TZDate(warrantyEndDate, timeZone);
        const localDate = new Date(tzDate.getFullYear(), tzDate.getMonth(), tzDate.getDate())
        return localDate.toLocaleDateString();
      };

      // 保証情報取得
      const warrantyInfo: WarrantyInfo = await this.getWarrantyInfo(dpfmRequestInfo, req.params.warrantyNumber);

      // 保証履歴取得
      const warrantyHistory: WarrantyHistories | null = await this.getWarranyHistory(
        dpfmRequestInfo, req.params.warrantyNumber, req.params.receptionNumber);

      // 保証期限切れ判定
      let isWarrantyExpired: boolean = false;
      const now = new Date();
      const timeZone = getStoreTimeZone(req);
      const warrantyStartDate = getStartOfDate(
        toUTCDateFromString(
          this.getWarrantyStartDate(warrantyInfo.warrantyItems),
          timeZone
        ),
        timeZone
      );
      const warrantyEndDate = getWarrantyExpirationDate(
        warrantyStartDate ?? undefined,
        timeZone
      );
      const expirationDate = warrantyEndDate;
      if (expirationDate) {
        // 有効期限が切れるのは、有効期限日の翌日の0:00
        const expirationNextDate = addDays(expirationDate, 1);
        isWarrantyExpired = !isBefore(now, expirationNextDate);
        if (isWarrantyExpired) {
          logger.info(`The warranty is expired. The warranty expiration date is ${toLocaleDateString(warrantyEndDate, timeZone)}`)
        }
      }

      // 交換回数超過判定
      const exchangeCount: ExchangeCount = this.getExchangeCount(warrantyInfo.warrantyItems);
      const isExchangeCountLimit: boolean = !(
        exchangeCount.frame < 1 &&
        exchangeCount.lens < 1 &&
        (warrantyInfo.exchangeCount ?? 0) < 2
      );
      const remainingExchangeCount: ExchangeCount = {
        frame: (warrantyInfo.exchangeCount ?? 0) < 2 && exchangeCount.frame == 0 ? 1 : 0,
        lens: (warrantyInfo.exchangeCount ?? 0) < 2 && exchangeCount.lens == 0 ? 1 : 0
      }

      // レスポンスボディをセット
      const responseBody : WarrantyGetResponse = {
        replacementType: warrantyHistory?.replacementType ?? null,
        replacementPart: warrantyHistory?.replacementPart ?? null,
        replacementReason: warrantyHistory?.replacementReason ?? null,
        exchangeCountIncrementFlag: warrantyHistory?.exchangeCountIncrementFlag ?? null,
        alertCode:
          isWarrantyExpired ? "Warranty Expired."
          : isExchangeCountLimit ? "Warranty limit reached."
          : null,
        alertMessage:
          isWarrantyExpired ? `The warranty for this order expired on `
            + `${toLocaleDateString(warrantyEndDate, timeZone)}.`
          : isExchangeCountLimit ? `For this order, `
            + `the frame can be replaced ${remainingExchangeCount.frame} times, `
            + `and the lenses can be replaced ${remainingExchangeCount.lens} time.`
          : null,
      };

      res.status(200).json(responseBody).send();

    } catch (error: any) {
        logger.info(`catch error!: ${JSON.stringify(error)}`);
        if (error.status == 404) {
          res.status(400).json(error?.data);
        } else {
          res.status(error.status).json(error?.data);
        }
        logger.error(JSON.stringify(error.data, Object.getOwnPropertyNames(error.data)));
    }
  }

  /**
   * 保証情報取得
   * @param dpfmRequestInfo DPFM層へのリクエスト情報
   * @param warrantyNumber 保証書番号
   * @returns 保証情報
   */
  private async getWarrantyInfo(
    dpfmRequestInfo: DpfmRequestInfo,
    warrantyNumber: string
  ): Promise<WarrantyInfo> {
    const findWarrantiesPath: FindWarrantiesPath = {
      warrantyNumber: warrantyNumber
    };
    const findWarrantiesRequest = {
      ...findWarrantiesPath
    };
    logger.info(`findWarrantiesRequest: ${JSON.stringify(findWarrantiesRequest)}`);

    // DPFM層保証情報取得API呼出
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    try {
      const findWarrantiesResponse = await sendApiRequest(
        findWarranties,
        findWarrantiesRequest,
        header
      );
      if (!findWarrantiesResponse.ok) {
        throw findWarrantiesResponse;
      }
      logger.info(`findWarrantiesResponse: ${JSON.stringify(findWarrantiesResponse)}`);
      return findWarrantiesResponse.data.warrantyInfo;
    } catch (error) {
      logger.info(`findWarrantiesResponse: ${JSON.stringify(error)}`);
      throw this.getErrorResponse(header, error);
    }
  }

  /**
   * 保証履歴取得
   * @param dpfmRequestInfo DPFM層へのリクエスト情報
   * @param warrantyNumber 保証書番号
   * @param receptionNumber 受付番号
   * @returns 保証履歴 | null
   */
  private async getWarranyHistory(
    dpfmRequestInfo: DpfmRequestInfo,
    warrantyNumber: string,
    receptionNumber: string
  ): Promise<WarrantyHistories | null> {
    const findWarrantyHistoriesQuery: FindWarrantyHistoriesQuery = {
      warrantyNumber: warrantyNumber,
      receptionNumber: receptionNumber
    }
    const findWarrantyHistoriesRequest = {
      ...findWarrantyHistoriesQuery,
    }
    logger.info(`findWarrantyHistoriesRequest: ${JSON.stringify(findWarrantyHistoriesRequest)}`);
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    try {
      const findWarrantyHistoriesResponse = await sendApiRequest(
        findWarrantyHistories,
        findWarrantyHistoriesRequest,
        header
      );
      if (!findWarrantyHistoriesResponse.ok) {
        throw findWarrantyHistoriesResponse;
      }
      logger.info(`findWarrantyHistoriesResponse: ${JSON.stringify(findWarrantyHistoriesResponse)}`);
      return findWarrantyHistoriesResponse.data.warrantyHistories[0];
    } catch (error: any) {
      logger.info(`findWarrantyHistoriesResponse: ${JSON.stringify(error)}`);
      // Not Foundはエラーとせず正常終了する
      if (error.status == 404) {
        return null;
      }
      throw this.getErrorResponse(header, error);
    }
  }

  /**
   * 保証開始日取得
   * @param warrantyItems 保証対象配列
   * @returns 保証開始日
   */
  private getWarrantyStartDate = (warrantyItems: warrantyItemInfo[] | undefined): string | null => {
    if (!Array.isArray(warrantyItems) || warrantyItems.length == 0) {
      return null
    }
    // 最も若い保証開始日の保証対象を取得
    const warrantyItem = warrantyItems.reduce(
      (accumulator, currentItem) => {
        if (!accumulator.warrantyStartDate) {
          return currentItem;
        }
        if (!currentItem.warrantyStartDate) {
          return accumulator;
        }
        if (new Date(accumulator.warrantyStartDate) < new Date(currentItem.warrantyStartDate)) {
          return accumulator;
        }
        return currentItem;
      }
    );
    return warrantyItem.warrantyStartDate ?? null;
  }

  /**
   * 交換回数取得
   * @param warrantyItems 保証対象配列
   * @returns 交換回数（フレーム、レンズ）
   */
  private getExchangeCount = (warrantyItems: warrantyItemInfo[] | undefined): ExchangeCount => {
    const exchangeCount: ExchangeCount = {
      frame: 0,
      lens: 0
    }
    if (Array.isArray(warrantyItems)) {
      warrantyItems.forEach( warrantyItem => {
        if (!warrantyItem.itemType) {
          return;
        }
        // All or Frame
        if (["000", "001"].includes(warrantyItem.itemType)) {
          exchangeCount.frame += warrantyItem.exchangeCount ?? 0;
        }
        // All or Lens(Both, Left, Right)
        if (["000", "002", "003", "004"].includes(warrantyItem.itemType)) {
          exchangeCount.lens += warrantyItem.exchangeCount ?? 0;
        }
      });
    }
    return exchangeCount;
  }

  /**
   * エラーレスポンス取得
   * @param requestHeader リクエストヘッダー
   * @param response DPFM層のエラーレスポンス
   * @returns エラーレスポンス
   */
  private getErrorResponse = (requestHeader: Headers, response: any): any => {
    const errorResponse = {
      status: response.status,
      data: {
        "jins-trace-id": requestHeader.get("jins-trace-id"),
        "timestamp": new Date().toISOString(),
        "systemName": "DJ36-Sales",
        "code": response.data.code,
        "message": response.data.message,
        "details": "",
      }
    };
    this.setErrorMessage(errorResponse);
    return errorResponse;
  }

  /**
   * ステータスに応じたエラーコード・メッセージをセットする
   * @param error エラーレスポンス
   */
  private setErrorMessage(error: any): void {
    switch (error.status) {
      case 400:
        error.data.code = CommonErrorCode.COM_0001_VALIDATION_ERROR.CODE;
        error.data.message = CommonErrorCode.COM_0001_VALIDATION_ERROR.MESSAGE;
        error.data.details = "";
        break;
      case 404:
        error.data.code = CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.CODE;
        error.data.message = CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.MESSAGE;
        error.data.details = "";
        break;
      case 429:
        error.data.code = CommonErrorCode.COM_0004_DUPLICATE_API_CALL.CODE;
        error.data.message = "Too Many Requests.";
        error.data.details = CommonErrorCode.COM_0004_DUPLICATE_API_CALL.MESSAGE;
        break;
      case 500:
        error.data.code = CommonErrorCode.COM_0000_UNEXPECTED_ERROR.CODE;
        error.data.message = "Internal Server Error.";
        error.data.details = CommonErrorCode.COM_0000_UNEXPECTED_ERROR.MESSAGE
        break;
    }
  }
}
