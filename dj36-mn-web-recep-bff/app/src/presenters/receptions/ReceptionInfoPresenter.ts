import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IReceptionInfoPresenter } from "~/src/presenters/interfaces";

import { postCartInfo, postReceptionInfoServer } from "~/src/clients/carts/cartsClient";
import { logger } from "~/src/logging/logger";
import { getAppDownloadMessage, getReceptionCompleteMessage } from "~/src/utils/createMessage";
import { sendApiRequest } from "~/src/utils/fetchService";

import { components } from "~/src/interfaces/root";

import { SalesRegistFrameModel } from "~/src/models/sales/SalesRegistFrameModel";
import { DpfmRequestInfo, generateDpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { SalesOperationResult } from "~/src/models/sales/SaleOperationModelTemplate";

import { SMSNotifier } from "~/src/utils/fetchService4SMS";
import { COUNTRY_CODE_ALPHA2, customerStaffId } from "~/src/compornents/const";
import { ReceptionPostRequest } from "~/src/clients/carts/cartsClientTypes";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import { getCountryTimeZone } from "~/src/utils/getTimeZone";
import { encryptText } from "~/src/utils/encryptText";
import { checkReceptionNumberCountryCode } from "~/src/utils/commonError";
import { makeErrorResponse400 } from "~/src/utils/makeErrorResponse400";

/**
 * 受付番号発番処理
 */
@injectable()
export class ReceptionInfoPresenter extends BasePresenter implements IReceptionInfoPresenter {
  /**
   * 受付番号発番処理
   * @param req - Request
   * @param res - Response
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const cursor = req.header("x-cursor");

      const requestHeader: HeadersInit = new Headers();
      requestHeader.set("Accept", req.header("accept") ?? "");
      requestHeader.set("Accept-Language", req.header("accept-language") ?? "");
      requestHeader.set("Content-Type", req.header("content-type") ?? "");
      requestHeader.set("Authorization", req.header("authorization") ?? "");
      requestHeader.set("X-API-KEY", process.env.CRM_API_KEY ?? "");
      requestHeader.set("jins-trace-id", req.header("jins-trace-id") ?? "");
      requestHeader.set("jins-user-id", customerStaffId);
      if (cursor) {
        requestHeader.set("X-Cursor", cursor);
      }

      const body = req.body;

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

      logger.info(`rcptInfoPostRequest: ${JSON.stringify(rcptInfoPostRequest)}`);

      // デジタル基盤層APIを呼び出す
      const rcptInfoPostResponse = await sendApiRequest(postReceptionInfoServer, rcptInfoPostRequest, requestHeader);

      logger.info(`rcptInfoPostResponse: ${JSON.stringify(rcptInfoPostResponse)}`);

      if (!rcptInfoPostResponse.ok) {
        throw rcptInfoPostResponse;
      }

      if (body.frameCode != undefined) {

        // カート新規作成時、受付事業国と異なる場合はエラー
        const message: string | null = checkReceptionNumberCountryCode(rcptInfoPostResponse.data.receptionNumber);
        if (message) {
          const error =  makeErrorResponse400([message], req);
          res.status(400).json(error);
          return;
        }

        // カート新規作成API呼出
        interface CartInfoPostRequest {
          receptionNumber: string; // 受付番号
        }

        const cartInfoPostRequest: CartInfoPostRequest = {
          receptionNumber: rcptInfoPostResponse.data.receptionNumber
        }
        logger.info(`cartInfoPostRequest: ${JSON.stringify(cartInfoPostRequest)}`);

        const cartInfoPostResponse = await sendApiRequest(postCartInfo, cartInfoPostRequest, requestHeader)

        logger.info(`cartInfoPostResponse: ${JSON.stringify(cartInfoPostResponse)}`);

        if (!cartInfoPostResponse.ok) {
          throw cartInfoPostResponse;
        }

        const dpfmRequestInfo: DpfmRequestInfo = generateDpfmRequestInfo(req);
        const model = new SalesRegistFrameModel();
        const itemGroupRequestInfo : components["schemas"]["CartInfoPostRequest"] = {
          cartId: cartInfoPostResponse.data.cart.cartId,
          itemCategoryCode: "01",
          checkoutFlag: false,
          itemGroups: [
            {
              frameCode: body.frameCode,
              itemGroupCode: cartInfoPostResponse.data.cart.itemGroups[0].itemGroupCode
            }
          ]
        }
        const result: SalesOperationResult | undefined = await model.execute(dpfmRequestInfo, itemGroupRequestInfo);
        if (result.status != 200) {
          res.status(result.status).send(result.data);
          return
        }

      }

      // MN版ではSMS通知は行わない
      // // 電話番号が入力されている場合のみ通知
      // if (body.phoneNumber !== undefined && body.phoneNumber !== null) {
      //   // SMS通知
      //   // 受付終了メッセージ
      //   try {
      //     const smsnotifierUrl = process.env.SMS_NOTIFIER + "/smsnotifier/JINSUS"
      //     const receptionCompleteMessage: string = getReceptionCompleteMessage(rcptInfoPostResponse.data.callingNumber, rcptInfoPostResponse.data.receptionNumber);
      //     logger.info(`receptionCompleteMessage: ${receptionCompleteMessage}`);
      //     await SMSNotifier(smsnotifierUrl, receptionCompleteMessage, body.phoneNumber);
      //     // アプリの案内メッセージ
      //     const appDownloadMessage = getAppDownloadMessage();
      //     logger.info(`appDownloadMessage: ${appDownloadMessage}`);
      //     await SMSNotifier(smsnotifierUrl, appDownloadMessage, body.phoneNumber);
      //   } catch (error: any) {
      //     logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
      //   }
      // }

      //レスポンスデータ加工
      const response: components["schemas"]["RcptInfoPostResponse"]={
        callingNumber: rcptInfoPostResponse.data.callingNumber,
        receptionNumber: rcptInfoPostResponse.data.receptionNumber,
        encryptionReceptionNumber: encryptText(rcptInfoPostResponse.data.receptionNumber),
      };

      res.status(200).send(response);
      return;
    } catch (error: any) {
      if(error.status === 404){
        res.status(400).send(error.data);
      }else{
        res.status(error.status).json(error.data);
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };
}
