import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IOrderCancelPresenter } from "~/src/presenters/interfaces";

import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { ExecuteCode, ReasonCode } from "~/src/compornents/const";
import { operations as omsOperations } from "~/src/interfaces/clients/oms/omsClient";
import { postOrderCodeCancel, postOrderCodeGlassLinesCancel , postReturns } from "~/src/clients/oms/omsClient";
import { components } from "~/src/interfaces/root";
import { ErrorResponse } from "~/src/compornents/errors";
import { makeErrorResponse400 } from "~/src/utils/makeErrorResponse400";
import { getOrderByReceptionNumber } from "~/src/clients/salesOrder/salesOrderClient";
import { CommonErrorCode } from "~/src/compornents/errorCode";

/**
 * オーダーキャンセルAPI
 */
@injectable()
export class OrderCancelPresenter extends BasePresenter implements IOrderCancelPresenter {
  /**
   * オーダー確定処理
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
      requestHeader.set("jins-user-id", req.header("staffID") ?? "");
      if (cursor) {
        requestHeader.set("X-Cursor", cursor);
      }

      // バリデーションチェック
      const validateError = this.validateRequest(req);
      if (validateError) {
        throw validateError;
      }

      const body: components["schemas"]["OrderCancelPutRequest"] = req.body;

      // OMSの注文詳細取得API呼出
      requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
      const orderGetResponse = await sendApiRequest(
        getOrderByReceptionNumber,
        {receptionNumber: req.params.receptionNumber},
        requestHeader,
      );
      logger.info(`orderGetResponse: ${JSON.stringify(orderGetResponse)}`);
      if (!orderGetResponse.ok) {
        throw orderGetResponse
      }

      const glassLineCode =
      orderGetResponse.data.glassLines.find(
        (glassLine: { itemGroupCode: string }) =>
          glassLine.itemGroupCode === req.query.itemGroupCode
      )?.glassLineCode;

      // 取消の場合
      if(body.executeCode == ExecuteCode.PRE_CANCEL){
        // 注文キャンセルAPI呼出
        const cancelOrderPathParameters: omsOperations["cancelOrder"]["parameters"]["path"] = {
          orderCode: orderGetResponse.data.orderCode,
        };
        const cancelOrderContent: omsOperations["cancelOrder"]["requestBody"]["content"]["application/json"] = {
          cancelReasonCode: body.reasonCode,
          version: orderGetResponse.data.version,
        };
        const cancelOrder = {
          ...cancelOrderPathParameters,
          ...cancelOrderContent,
        };
        logger.info(`cancelOrder: ${JSON.stringify(cancelOrder)}`);
        // デジタル基盤層APIを呼び出す
        requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
        const calcelOrderResponse = await sendApiRequest(postOrderCodeCancel, cancelOrder, requestHeader)
        logger.info(`calcelOrderResponse: ${JSON.stringify(calcelOrderResponse)}`);

        if (!calcelOrderResponse.ok) {
          throw calcelOrderResponse;
        }
      // キャンセルの場合
      }else if(body.executeCode == ExecuteCode.POST_CANCEL){
        if(glassLineCode == null){
          const error: ErrorResponse = makeErrorResponse400(["Specified data not found."],
            req,
            CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.CODE,
            CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.MESSAGE);
            throw error;
        }
          // 注文メガネ行は、glassLineCodeが一致しているもの
          const glassLine =
          orderGetResponse.data.glassLines.find(
            (glassLine: { itemGroupCode: string ,version: number}) =>
              glassLine.itemGroupCode === req.query.itemGroupCode
          )?? undefined;
        // 注文キャンセルAPIの注文部分キャンセル呼出
        const cancelGlassLinePathParameters: omsOperations["cancelGlassLine"]["parameters"]["path"] = {
          orderCode: orderGetResponse.data.orderCode,
          glassLineCode: glassLine.glassLineCode
        };
        const cancelGlassLineContent: omsOperations["cancelGlassLine"]["requestBody"]["content"]["application/json"] = {
          cancelReasonCode: body.reasonCode,
          version: glassLine.version,
        };
        const cancelGlassLine = {
          ...cancelGlassLinePathParameters,
          ...cancelGlassLineContent,
        };
        logger.info(`cancelGlassLine: ${JSON.stringify(cancelGlassLine)}`);
        // デジタル基盤層APIを呼び出す
        requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
        const calcelGlassLineResponse = await sendApiRequest(postOrderCodeGlassLinesCancel, cancelGlassLine, requestHeader)
        logger.info(`calcelGlassLineResponse: ${JSON.stringify(calcelGlassLineResponse)}`);

        if (!calcelGlassLineResponse.ok) {
          throw calcelGlassLineResponse;
        }
      // 返品の場合
      }else if(body.executeCode == ExecuteCode.RETURN){
        if(glassLineCode == null){
          const error: ErrorResponse = makeErrorResponse400(["Specified data not found."],
            req,
            CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.CODE,
            CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.MESSAGE);
            throw error;
        }
        // 注文返品API呼出
        const ReturnContent: omsOperations["returnOrder"]["requestBody"]["content"]["application/json"] = {
          orderCode: orderGetResponse.data.orderCode,
          returnReasonCode: body.reasonCode,
          returnStoreCode: orderGetResponse.data.receptionStoreCode,
          glassLineCode: glassLineCode,
        };
        logger.info(`ReturnContent: ${JSON.stringify(ReturnContent)}`);
        // デジタル基盤層APIを呼び出す
        const ReturnContentResponse = await sendApiRequest(postReturns, ReturnContent, requestHeader)
        logger.info(`ReturnContentResponse: ${JSON.stringify(ReturnContentResponse)}`);

        if (!ReturnContentResponse.ok) {
          throw ReturnContentResponse;
        }
      }

      res.status(204).send();
      return;
    } catch (error: any) {
      if (error.status === 400 || error.status === 404 || (error.hasOwnProperty("details")
        && JSON.parse(error.details).hasOwnProperty("status")
        && JSON.parse(error.details).status == 400)) {
        res.status(400).json(error.data);
      } else {
        res.status(error.status).json(error.data);
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };

  /**
   * リクエストバリデート
   * @param req - Request
   * @returns ErrorResponse | undefined
   */
  private validateRequest(req: Request): ErrorResponse | undefined {
    const body: components["schemas"]["OrderCancelPutRequest"] = req.body;

    // 実行コードと商品グループコードの組み合わせチェック
    if(!this.isValidItemGroupCode(body.executeCode,req)){
      return makeErrorResponse400(["You must specify either executeCode or itemGroupCode."], req);
    }

    // 実行コードと理由コードの組み合わせチェック
    if(!this.isValidReasonCode(body.executeCode,body.reasonCode)){
      return makeErrorResponse400(["You must specify either executeCode or reasonCode."], req);
    }
  }

  /**
   * 実行コードと商品グループコードの組み合わせ確認
   * @param execCode 実行コード
   * @param req - Request
   * @returns boolean
   */
  private isValidItemGroupCode(execCode: string, req: Request): boolean {
    const itemGroupCode = req.query.itemGroupCode
    switch(execCode){
      // 取消
      case ExecuteCode.PRE_CANCEL:
        if(itemGroupCode != null)return false;
        return true;
      // キャンセル
      case ExecuteCode.POST_CANCEL:
        if(itemGroupCode == null)return false;
        return true;
      // 返品
      case ExecuteCode.RETURN:
        if(itemGroupCode == null)return false;
        return true;
      default:
        return false;
    }
  }


  /**
   * 実行コードと理由コードの組み合わせ確認
   * @param execCode 実行コード
   * @param reasonCode 理由コード
   * @returns boolean
   */
  private isValidReasonCode(execCode: string, reasonCode: string): boolean {
    const validReasonCodes = {
      [ExecuteCode.PRE_CANCEL]: [ReasonCode.WRONG_PRODUCT,ReasonCode.DISCOUNT_OMISSION,ReasonCode.PRICE_CHARGE,ReasonCode.MEMBER_QR_SCAN_OMISSION,ReasonCode.PRE_CANCEL_OTHERS],
      [ExecuteCode.POST_CANCEL]: [ReasonCode.PROCESSING_ERROR,ReasonCode.POST_CANCEL_CUSTOMER_REQUEST,ReasonCode.POST_CANCEL_OTHERS],
      [ExecuteCode.RETURN]:[ReasonCode.DEFECTIVE_ITEM,ReasonCode.RETURN_CUSTOMER_REQUEST,ReasonCode.RETURN_POLICY,ReasonCode.RETURN_OTHERS],
    };
      return validReasonCodes[execCode].includes(reasonCode);
  }
}
