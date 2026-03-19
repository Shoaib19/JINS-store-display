import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IReceptionInfoPresenter } from "~/src/presenters/interfaces";

import { postCartInfo, postReceptionInfoServer } from "~/src/clients/carts/cartsClient";
import { logger } from "~/src/logging/logger";
import { getAppDownloadMessage, getReceptionCompleteMessage } from "~/src/utils/createMessage";
import { sendApiRequest } from "~/src/utils/fetchService";

import { components } from "~/src/interfaces/root";

import { SalesRegisterFrameModel } from "~/src/models/sales/SalesRegisterFrameModel";
import { DpfmRequestInfo, generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";
import { CartInfoPostRequest, SalesOperationResult } from "~/src/models/sales/SalesOperationModelTemplate";

import { SMSNotifier } from "~/src/utils/fetchService4SMS";
import { COUNTRY_CODE_ALPHA2, SMSConfig } from "~/src/components/const";
import { Cart, CartPostRequest, CartPostResponse, ReceptionPostRequest, ReceptionPostResponse } from "~/src/clients/carts/cartsClientTypes";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import { getCountryTimeZone } from "~/src/utils/getTimeZone";
import { encryptText } from "~/src/utils/encryptText";
import { ApiResponse } from "openapi-typescript-fetch";
import { isSuccessRegisterStatus } from "~/src/models/sales/SalesOperationRegisterResult";

/**
 * 受付番号発番処理
 */
@injectable()
export class ReceptionInfoPresenter
  implements IReceptionInfoPresenter
{
  /**
   * 受付番号発番API
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
      const dpfmRequestInfo: DpfmRequestInfo = generateDpfmRequestInfo(req);
      const body: components["schemas"]["RcptInfoPostRequest"] = req.body;

      // 受付情報作成
      const reception = await this.createReception(dpfmRequestInfo, body);

      if (body.frameCode != undefined) {
        // カート新規作成
        const cart = await this.createCart(
          dpfmRequestInfo,
          reception.receptionNumber!
        );

        // カートにフレームを登録
        const result = await this.addFrameToCart(
          dpfmRequestInfo,
          cart.cartId!,
          cart.itemGroups![0].itemGroupCode!,
          body.frameCode
        );
        if (!isSuccessRegisterStatus(result.status)) {
          res.status(result.status).send(result.data);
          return;
        }
      }

      if (body.phoneNumber !== undefined && body.phoneNumber !== null) {
        // 電話番号が入力されている場合のみSMS通知
        try {
          const smsnotifierUrl = process.env.SMS_NOTIFIER + "/smsnotifier/JINSUS";
          if (SMSConfig.receptionCompleteMessageEnabled) {
            // 受付終了メッセージ
            const receptionCompleteMessage= getReceptionCompleteMessage(reception.callingNumber!, reception.receptionNumber!);
            logger.info(`receptionCompleteMessage: ${receptionCompleteMessage}`);
            await SMSNotifier(smsnotifierUrl, receptionCompleteMessage, body.phoneNumber);
          }
          if (SMSConfig.appDownloadMessageEnabled) {
            // アプリの案内メッセージ
            const appDownloadMessage = getAppDownloadMessage();
            logger.info(`appDownloadMessage: ${appDownloadMessage}`);
            await SMSNotifier(smsnotifierUrl, appDownloadMessage, body.phoneNumber);
          }
        } catch (error) {
          logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
          // SMS通知のエラーは無視して処理継続
        }
      }

      //レスポンスデータ加工
      const response: components["schemas"]["RcptInfoPostResponse"] = {
        callingNumber: reception.callingNumber,
        receptionNumber: reception.receptionNumber,
        encryptionReceptionNumber: encryptText(reception.receptionNumber!),
      };

      res.status(200).send(response);
      return;
    } catch (error) {
      next(error);
    }
  };

  /**
   * 受付情報作成
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param body 受付番号発番APIのリクエスト
   * @returns 受付情報
   */
  private createReception = async (
    dpfmRequestInfo: DpfmRequestInfo,
    body: components["schemas"]["RcptInfoPostRequest"]
  ): Promise<ReceptionPostResponse> => {
    // 受付情報新規作成API呼出
    const rcptInfoPostRequest: ReceptionPostRequest = {
      registeredDate : fixSystemDate(getCountryTimeZone()),
      countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
      storeCode: body.storeCode ?? "",
      visitingPurposeCode: body.visitingPurposeCode ?? "",
      customerIssueCode: body.customerIssueCode ?? undefined,
      prescriptionRegistCode: body.prescriptionRegistCode ?? undefined,
      customerName: body.customerName ?? "",
      phoneNumber: body.phoneNumber,
    }

    logger.info(`postReceptionInfoServerRequest: ${JSON.stringify(rcptInfoPostRequest)}`);

    const apiResponse: ApiResponse<ReceptionPostResponse> =
      await sendApiRequest(
        postReceptionInfoServer,
        rcptInfoPostRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );

    logger.info(`postReceptionInfoServerResponse: ${JSON.stringify(apiResponse)}`);

    return apiResponse.data;
  };

  /**
   * カート作成
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @returns カート情報
   */
  private createCart = async (
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string,
  ): Promise<Cart> => {
      // カート新規作成API呼出
      const cartInfoPostRequest: CartPostRequest = {
        receptionNumber: receptionNumber,
      };
      logger.info(`postCartInfoRequest: ${JSON.stringify(cartInfoPostRequest)}`);

      const apiResponse: ApiResponse<CartPostResponse> = await sendApiRequest(
        postCartInfo,
        cartInfoPostRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );

      logger.info(`postCartInfoResponse: ${JSON.stringify(apiResponse)}`);

      return apiResponse.data.cart!;      
  };

  /**
   * フレーム追加
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param cartId カートID
   * @param itemGroupCode 商品グループコード
   * @param frameCode フレームコード 
   * @returns 追加結果
   */
  private addFrameToCart = async (
    dpfmRequestInfo: DpfmRequestInfo,
    cartId: number,
    itemGroupCode: string,
    frameCode: string,
  ): Promise<SalesOperationResult>=> {
    const model = new SalesRegisterFrameModel();
    const itemGroupRequestInfo: CartInfoPostRequest = {
      cartId: cartId,
      itemCategoryCode: "01",
      checkoutFlag: false,
      itemGroups: [
        {
          frame: {
            frameCode: frameCode
          },
          itemGroupCode: itemGroupCode,
        },
      ],
    };
    return await model.execute(dpfmRequestInfo, itemGroupRequestInfo);
  };
}
