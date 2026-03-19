import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { components } from "~/src/interfaces/root";
import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import type { IWarrantiesInfoPresenter } from "~/src/presenters/interfaces";
import { findWarranties, findWarrantyHistories } from "~/src/clients/warranties/warrantiesClient";
import {
  WarrantyInfo,
  warrantyItemInfo,
  WarrantyHistoriesGetRequest,
  WarrantyHistoriesGetResponse,
  WarrantyHistories,
  WarrantiesGetRequest,
  WarrantiesGetResponse,
} from "~/src/clients/warranties/warrantiesClientTypes";
import { addDays, getWarrantyExpirationDate, isBefore } from "~/src/utils/datetimeUtils";
import { toUTCDateFromString } from "~/src/utils/fixDatetime";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";
import { TZDate } from "@date-fns/tz/date";
import { ApiResponse } from "openapi-typescript-fetch";
import { isNotFoundResponse, ValidationError } from "~/src/components/errors";

// 交換回数
type ExchangeCount = {
  frame: number,
  lens: number
};

/**
 * 保証状態確認API
 */
@injectable()
export class WarrantiesInfoPresenter implements IWarrantiesInfoPresenter {

  /**
   * 保証状態確認API
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

      // リクエストパラメータチェック
      const warrantyNumber = req.params.warrantyNumber;
      const tmpReceptionNumber: string = warrantyNumber.substring(0, warrantyNumber.indexOf("-"));

      const receptionNumber = req.params.receptionNumber;
      
      if(tmpReceptionNumber === receptionNumber){
        throw new ValidationError("warrantyNumber and the receptionNumber are the same");
      }

      // 保証情報取得
      const warrantyInfo: WarrantyInfo | undefined = await this.getWarrantyInfo(
        dpfmRequestInfo, req.params.warrantyNumber);
      if (!warrantyInfo) {
        throw new ValidationError("The warranty info is not found.");
      }

      // 保証履歴取得
      const warrantyHistory: WarrantyHistories | null = await this.getWarrantyHistory(
        dpfmRequestInfo, req.params.warrantyNumber, req.params.receptionNumber);

      // 保証期限切れ判定
      let isExpired: boolean = false;
      const timeZone = getStoreTimeZone(req);
      const warrantyStartDate = toUTCDateFromString(
        this.getWarrantyStartDate(warrantyInfo.warrantyItems),
        timeZone
      );
      const warrantyEndDate = getWarrantyExpirationDate(
        warrantyStartDate ?? undefined,
        timeZone
      );
      if (warrantyEndDate) {
        // 有効期限が切れるのは、有効期限日の翌日の0:00
        const expiredDate = addDays(warrantyEndDate, 1);
        const now = new Date();
        isExpired = !isBefore(now, expiredDate);
        if (!isBefore(now, expiredDate)) {
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
      const responseBody: components["schemas"]["WarrantyGetResponse"] = {
        replacementType: warrantyHistory?.replacementType ?? null,
        replacementPart: warrantyHistory?.replacementPart ?? null,
        replacementReason: warrantyHistory?.replacementReason ?? null,
        exchangeCountIncrementFlag: warrantyHistory?.exchangeCountIncrementFlag ?? null,
        alertCode:
          isExpired ? "Warranty Expired."
          : isExchangeCountLimit ? "Warranty limit reached."
          : null,
        alertMessage:
          isExpired ? `The warranty for this order expired on `
            + `${toLocaleDateString(warrantyEndDate, timeZone)}.`
          : isExchangeCountLimit ? `For this order, `
            + `the frame can be replaced ${remainingExchangeCount.frame} times, `
            + `and the lenses can be replaced ${remainingExchangeCount.lens} time.`
          : null,
      };

      res.status(200).json(responseBody).send();

    } catch (error) {
      next(error);
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
  ): Promise<WarrantyInfo | undefined> {
    const findWarrantiesRequest: WarrantiesGetRequest = {
      warrantyNumber: warrantyNumber
    };
    logger.info(`findWarrantiesRequest: ${JSON.stringify(findWarrantiesRequest)}`);

    // DPFM層保証情報取得API呼出
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    const findWarrantiesResponse: ApiResponse<WarrantiesGetResponse> = await sendApiRequest(
      findWarranties,
      findWarrantiesRequest,
      header
    );

    logger.info(`findWarrantiesResponse: ${JSON.stringify(findWarrantiesResponse)}`);

    return findWarrantiesResponse.data.warrantyInfo;
  }

  /**
   * 保証履歴取得
   * @param dpfmRequestInfo DPFM層へのリクエスト情報
   * @param warrantyNumber 保証書番号
   * @param receptionNumber 受付番号
   * @returns 保証履歴 | null
   */
  private async getWarrantyHistory(
    dpfmRequestInfo: DpfmRequestInfo,
    warrantyNumber: string,
    receptionNumber: string
  ): Promise<WarrantyHistories | null> {
    const findWarrantyHistoriesRequest: WarrantyHistoriesGetRequest = {
      warrantyNumber: warrantyNumber,
      receptionNumber: receptionNumber
    }
    logger.info(`findWarrantyHistoriesRequest: ${JSON.stringify(findWarrantyHistoriesRequest)}`);
    const header = makeDpfmRequestHeader(dpfmRequestInfo);
    try {
      const findWarrantyHistoriesResponse: ApiResponse<WarrantyHistoriesGetResponse> = await sendApiRequest(
        findWarrantyHistories,
        findWarrantyHistoriesRequest,
        header
      );

      logger.info(`findWarrantyHistoriesResponse: ${JSON.stringify(findWarrantyHistoriesResponse)}`);

      return (Array.isArray(findWarrantyHistoriesResponse.data.warrantyHistories)
        && findWarrantyHistoriesResponse.data.warrantyHistories.length > 0)
        ? findWarrantyHistoriesResponse.data.warrantyHistories[0] : null;

    } catch (error) {
      // Not Foundはエラーとせず正常終了する
      if (isNotFoundResponse(error)) {
        return null;
      }
      throw error;
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
}
