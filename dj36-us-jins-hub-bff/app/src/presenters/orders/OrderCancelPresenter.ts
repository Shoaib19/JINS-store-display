import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import type { IOrderCancelPresenter } from "~/src/presenters/interfaces";
import { ApiResponse } from "openapi-typescript-fetch";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { ExecuteCode, ReasonCode, USE_INVENTORY } from "~/src/components/const";
import { postOrderCodeCancel, postOrderCodeGlassLinesCancel , postReturns } from "~/src/clients/oms/omsClient";
import { components, operations } from "~/src/interfaces/root";
import { ApplicationError, ValidationError } from "~/src/components/errors";
import { getOrderByReceptionNumber } from "~/src/clients/salesOrder/salesOrderClient";
import { OrderByReceptionNumberGetRequest, OrderGetResponse, } from "~/src/clients/salesOrder/salesOrderClientTypes";
import { 
  CancelOrderPostRequest, 
  CancelGlassLinePostRequest, 
  CancelOrderPostResponse, 
  ReturnOrderRequest, 
  ReturnOrderResponse,
} from "~/src/clients/oms/omsClientTypes";
import { CommonErrorCode } from "~/src/components/errorCode";
import {
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";

/**
 * オーダーキャンセルAPI
 */
@injectable()
export class OrderCancelPresenter implements IOrderCancelPresenter {
  /**
   * オーダー確定処理
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

      const dpfmRequestInfo = generateDpfmRequestInfo(req);

      const body: components["schemas"]["OrderCancelPutRequest"] = req.body;
      const path = req.params as operations["putOrderCancel"]["parameters"]["path"];

      // OMSの注文詳細取得API呼出
      const orderGetRequest: OrderByReceptionNumberGetRequest = {
        receptionNumber: path.receptionNumber,
      };
      logger.info(`getOrderRequest: ${JSON.stringify(path.receptionNumber)}`);
      const orderGetResponse : ApiResponse<OrderGetResponse>  = await sendApiRequest(
        getOrderByReceptionNumber,
        orderGetRequest,
        makeDpfmRequestHeader(dpfmRequestInfo),
      );
      
      logger.info(`getOrderResponse: ${JSON.stringify(orderGetResponse)}`);

      const glassLine =
      orderGetResponse.data.glassLines?.find(
        glassLine => glassLine.itemGroupCode === req.query.itemGroupCode
      )?? undefined;

      const glassLineCode = glassLine?.glassLineCode

      // 取消の場合
      if(body.executeCode == ExecuteCode.PRE_CANCEL){
        // 注文キャンセルAPI呼出
        const cancelOrderRequest: CancelOrderPostRequest = {
          orderCode: orderGetResponse.data.orderCode,
          cancelReasonCode: body.reasonCode,
          version: orderGetResponse.data.version,
          useInventory: USE_INVENTORY
        };

        logger.info(`postCancelOrderRequest: ${JSON.stringify(cancelOrderRequest)}`);
        // デジタル基盤層APIを呼び出す
        const cancelOrderResponse : ApiResponse<CancelOrderPostResponse> = 
          await sendApiRequest(
            postOrderCodeCancel,
            cancelOrderRequest,
            makeDpfmRequestHeader(dpfmRequestInfo),
          );
        logger.info(`postCancelOrderResponse: ${JSON.stringify(cancelOrderResponse)}`);

      // キャンセルの場合
      }else if(body.executeCode == ExecuteCode.POST_CANCEL){
        if(glassLine == null){
          throw new ApplicationError(
            CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND,
            "Specified data not found."
          );
        }

          // 注文キャンセルAPIの注文部分キャンセル呼出
          const cancelGlassLine :CancelGlassLinePostRequest = {
            orderCode: orderGetResponse.data.orderCode,
            glassLineCode: glassLineCode!,
            cancelReasonCode: body.reasonCode,
            version: glassLine.version!,
            useInventory: USE_INVENTORY  
          };

          logger.info(`postCancelGlassLineRequest: ${JSON.stringify(cancelGlassLine)}`);
          // デジタル基盤層APIを呼び出す
          const cancelGlassLineResponse : ApiResponse<CancelOrderPostResponse> = await sendApiRequest(
            postOrderCodeGlassLinesCancel,
            cancelGlassLine,
            makeDpfmRequestHeader(dpfmRequestInfo),
          );

          logger.info(`postCancelGlassLineResponse: ${JSON.stringify(cancelGlassLineResponse)}`);

      // 返品の場合
      }else if(body.executeCode == ExecuteCode.RETURN){
        if(glassLineCode == null){
          throw new ApplicationError(
            CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND,
            "Specified data not found."
          );
        }
        // 注文返品API呼出
        const ReturnContent: ReturnOrderRequest = {
          orderCode: orderGetResponse.data.orderCode,
          returnReasonCode: body.reasonCode,
          returnStoreCode: orderGetResponse.data.receptionStoreCode!,
          glassLineCode: glassLineCode,
        };
        logger.info(`postReturnContentRequest: ${JSON.stringify(ReturnContent)}`);
        // デジタル基盤層APIを呼び出す
        const ReturnContentResponse : ApiResponse<ReturnOrderResponse> = await sendApiRequest(
          postReturns,
          ReturnContent,
          makeDpfmRequestHeader(dpfmRequestInfo),
        );

        logger.info(`postReturnContentResponse: ${JSON.stringify(ReturnContentResponse)}`);
      }

      res.status(204).send();
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
    const body: components["schemas"]["OrderCancelPutRequest"] = req.body;

    // 実行コードと商品グループコードの組み合わせチェック
    if(!this.isValidItemGroupCode(body.executeCode,req)){
      throw new ValidationError("You must specify either executeCode or itemGroupCode.");
    }

    // 実行コードと理由コードの組み合わせチェック
    if(!this.isValidReasonCode(body.executeCode,body.reasonCode)){
      throw new ValidationError("You must specify either executeCode or reasonCode.");
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
