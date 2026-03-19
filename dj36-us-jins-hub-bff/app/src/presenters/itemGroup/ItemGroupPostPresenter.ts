import { NextFunction, Request, Response } from "express";
import type { IItemGroupPostPresenter } from "~/src/presenters/interfaces";

import { injectable } from "inversify";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { postCartInfo } from "~/src/clients/carts/cartsClient";
import { checkReceptionNumberCountryCode } from "~/src/utils/commonError";
import { generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";
import { CartPostRequest, CartPostResponse } from "~/src/clients/carts/cartsClientTypes";
import { ApiResponse } from "openapi-typescript-fetch";

/**
 * 商品グループ追加API
 */
@injectable()
export class ItemGroupPostPresenter implements IItemGroupPostPresenter {
  /**
   * 商品グループ追加処理
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

      // カート新規作成時、受付事業国と異なる場合はエラー
      await checkReceptionNumberCountryCode(dpfmRequestInfo, req.params.receptionNumber);
      
      const cartPostRequest: CartPostRequest = {
        receptionNumber: String(req.params.receptionNumber),
        cartId:  Number(req.params.cartId),
      };

      logger.info(`getCartInfoRequest: ${JSON.stringify(cartPostRequest)}`);

      // デジタル基盤層APIを呼び出す
      const apiResponse: ApiResponse<CartPostResponse> = await sendApiRequest(
        postCartInfo,
        cartPostRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );

      logger.info(`getCartInfoResponse: ${JSON.stringify(apiResponse)}`);

      res.status(200).send();
      return;
    } catch (error) {
      next(error);
    }
  };
}
