
import { NextFunction, Request, Response } from "express";
import type { IItemGroupDeletePresenter } from "~/src/presenters/interfaces";

import { injectable } from "inversify";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { deleteItemGroups } from "~/src/clients/carts/cartsClient";
import { COUNTRY_CODE_ALPHA2 } from "~/src/components/const";
import { generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";
import { ItemGroupsDeleteRequest } from "~/src/clients/carts/cartsClientTypes";
import { ApiResponse } from "openapi-typescript-fetch";

/**
 * 商品グループ削除API
 */
@injectable()
export class ItemGroupDeletePresenter implements IItemGroupDeletePresenter {
  /**
   * 商品グループ削除処理
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

      const itemGroupsDeleteRequest: ItemGroupsDeleteRequest = {
        itemGroupCode: String(req.params.itemGroupCode),
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
      };

      logger.info(`getItemGroupsDeleteRequest: ${JSON.stringify(itemGroupsDeleteRequest)}`);

      // デジタル基盤層APIを呼び出す
      const apiResponse: ApiResponse<unknown> = await sendApiRequest(
        deleteItemGroups,
        itemGroupsDeleteRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );

      logger.info(`getItemGroupsDeleteResponse: ${JSON.stringify(apiResponse)}`);

      res.status(200).send();
      return;
    } catch (error) {
      next(error);
    }
  };
}
