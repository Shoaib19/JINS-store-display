import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { IOrderStatusUpdatePresenter } from "~/src/presenters/interfaces";
import { ApiResponse } from "openapi-typescript-fetch";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import {
  postReceptionEvents,
  searchReceptionInformation,
} from "~/src/clients/carts/cartsClient";
import {
  postDeliveryCompleted,
  postPaymentCompleted,
  postReadyForDelivery,
} from "~/src/clients/oms/omsClient";
import {
  CallingStatus,
  DeliveryMethod,
  DeliveryStatus,
  OmsOrderStatus,
  OrderStatus,
  ReceptionStatus,
  ReplacementPart,
  ReplacementStatusCode,
  SMSConfig,
  WarrantyItemType,
  WarrantyStartDelayDays,
} from "~/src/components/const";
import { components, operations } from "~/src/interfaces/root";
import { isNotFoundResponse, ResourceNotFoundError, ValidationError } from "~/src/components/errors";
import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import {
  ReceptionEventsPostRequest,
  ReceptionInformation,
  ReceptionInformationSearchRequest,
  ReceptionInformationSearchResponse,
} from "~/src/clients/carts/cartsClientTypes";
import {
  OrderByReceptionNumberGetRequest,
  OrderGetResponse,
} from "~/src/clients/salesOrder/salesOrderClientTypes";
import { getOrderByReceptionNumber } from "~/src/clients/salesOrder/salesOrderClient";
import {
  UpdateGlassLinesStatusDeliveryCompletedRequest,
  UpdateGlassLinesStatusReadyForDeliveryRequest,
  UpdateOrderStatusPaymentCompletedByReceptionRequest,
} from "~/src/clients/oms/omsClientTypes";
import {
  WarrantyHistoriesGetRequest,
  WarrantiesGetResponse,
  WarrantyForUpdate,
  WarrantyHistories,
  WarrantyHistoriesGetResponse,
  WarrantyInfo,
  WarrantyItemForUpdate,
  warrantyItemInfo,
  WarrantiesGetRequest,
  WarrantiesPutRequest,
  WarrantyHistoriesPutRequest,
} from "~/src/clients/warranties/warrantiesClientTypes";
import { findWarranties, findWarrantyHistories, putWarranties, putWarrantyHistories } from "~/src/clients/warranties/warrantiesClient";
import { EventCode } from "~/src/components/eventCode";
import { fixDatetimeForDpfm } from "~/src/utils/fixDatetime";
import {
  getReadyForPickupMessage,
} from "~/src/utils/createMessage";
import { SMSNotifier } from "~/src/utils/fetchService4SMS";
import { addDays } from "~/src/utils/datetimeUtils";

/**
 * オーダーステータス更新API
 */
@injectable()
export class OrderStatusUpdatePresenter
  implements IOrderStatusUpdatePresenter
{
  /**
   * オーダーステータス更新
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
      const path = req.params as operations["putOrderStatus"]["parameters"]["path"];
      const body: components["schemas"]["OrderStatusPutRequest"] = req.body;

      if (body.orderStatusCode === OrderStatus.RESOLVE) {
        // 受付番号から受付情報取得
        const receptionInformation = await this.getReceptionInformation(
          dpfmRequestInfo,
          path.receptionNumber
        );
        if (receptionInformation == undefined) {
          // 受付情報が見つからないとき
          throw new ResourceNotFoundError(`There is no recode matched ${path.receptionNumber}.`);
        }
        if (!this.isUpdatableReception(receptionInformation)) {
          // 受付情報が、更新できないとき
          new ValidationError("The reception is not updatable.");
        }
        // 受付情報更新
        await this.updateReceptionInformationResolve(
          dpfmRequestInfo,
          receptionInformation
        );
      } else {
        // 受付番号から注文情報取得
        const orderInformation = await this.getOrderInformationIfExists(
          dpfmRequestInfo,
          path.receptionNumber
        );
        if (orderInformation == undefined) {
          // 注文情報が見つからないとき
          throw new ResourceNotFoundError(`There is no recode matched ${path.receptionNumber}.`);
        }
        if (
          body.itemGroupCode !== undefined &&
          !orderInformation.glassLines?.some(
            (glassLine) => glassLine.glassLineCode === body.itemGroupCode
          )
        ) {
          // 商品グループが見つからないとき
          throw new ResourceNotFoundError(`There is no recode matched ${body.itemGroupCode}.`);
        }
        if (!this.isUpdatableOrder(orderInformation, body.itemGroupCode)) {
          // 注文情報が、更新できないとき
          throw new ValidationError("The order is not updatable.");
        }

        switch (body.orderStatusCode) {
          case OrderStatus.PROCESSING: // 加工待ち
            await this.updateOrderStatusPaymentCompleted(
              dpfmRequestInfo,
              path.receptionNumber
            );
            break;
          case OrderStatus.PICKUP: // お渡し準備完了
            await this.updateGlassLinesStatusReadyForDelivery(
              dpfmRequestInfo,
              body.itemGroupCode!
            );
            if (orderInformation.phoneNumber != undefined && SMSConfig.readyForPickupMessageEnabled) {
              try {
                const readyForPickupMessage: string = getReadyForPickupMessage(
                  body.itemGroupCode!
                );
                logger.info(`readyForPickupMessage: ${readyForPickupMessage}`);
                const smsnotifierUrl = process.env.SMS_NOTIFIER + "/smsnotifier/JINSUS"
                await SMSNotifier(
                  smsnotifierUrl,
                  readyForPickupMessage,
                  orderInformation.phoneNumber
                );
              } catch (error) {
                logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
                // SMS通知のエラーは無視して処理継続
              }
            }
            break;
          case OrderStatus.ORDER_COMPLETED: // お渡し完了
            await this.updateGlassLinesStatusDeliveryCompleted(
              dpfmRequestInfo,
              body.itemGroupCode!
            );
            // 保証書を更新する
            await this.updateWarranty(
              dpfmRequestInfo,
              path.receptionNumber,
              body.itemGroupCode!,
              orderInformation
            );
            break;
        }
        await this.updateReceptionInformationFromOrder(
          dpfmRequestInfo,
          path.receptionNumber,
          body.orderStatusCode
        );
      }

      const response: components["schemas"]["OrderStatusResponse"] = {
        orderStatusCode: body.orderStatusCode,
      };
      res.status(200).json(response);
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
    // 対象の注文ステータスコード
    const arrowedOrderStatusCode: string[] = [
      OrderStatus.PROCESSING, // 加工待ち
      OrderStatus.PICKUP, // お渡し準備完了
      OrderStatus.ORDER_COMPLETED, // お渡し完了
      OrderStatus.RESOLVE, // 完了（resolve）
    ];

    // 商品グループコードが必要な注文ステータスコード
    const needItemGroupOrderStatusCode: string[] = [
      OrderStatus.PICKUP, // お渡し準備完了
      OrderStatus.ORDER_COMPLETED, // お渡し完了
    ];

    const body: components["schemas"]["OrderStatusPutRequest"] = req.body;
    // 注文ステータスが対象外
    if (!arrowedOrderStatusCode.includes(body.orderStatusCode)) {
      throw new ValidationError("Invalid orderStatusCode");
    }
    // 商品グループコードが必要な注文ステータスだが、商品グループコードが設定されてない
    if (
      needItemGroupOrderStatusCode.includes(body.orderStatusCode) &&
      body.itemGroupCode == undefined
    ) {
      throw new ValidationError("Invalid orderStatusCode");
    }
  }

  /**
   * 更新可能な受付情報かを判定
   * @param receptionInformation
   * @returns
   */
  private isUpdatableReception(receptionInformation: ReceptionInformation) {
    const arrowReceptionStatusCode = [
      ReceptionStatus.ADJUSTMENT,
      ReceptionStatus.PAYMENT,
      ReceptionStatus.GENERAL_HELP,
    ];
    if (!arrowReceptionStatusCode.includes(receptionInformation.statusCode!)) {
      return false;
    }
    return true;
  }

  /**
   * 更新可能な注文情報かを判定
   * @param orderInformation
   * @param itemGroup
   * @returns
   */
  private isUpdatableOrder(
    orderInformation: OrderGetResponse,
    itemGroup?: string
  ) {
    const denyOmsOrderStatus = [
      OmsOrderStatus.ORDER_COMPLETED,
      OmsOrderStatus.ORDER_CANCELED,
    ];
    if (denyOmsOrderStatus.includes(orderInformation.orderStatus)) {
      return false;
    }
    if (itemGroup != undefined) {
      const denyOmsDeliveryStatus: (string | undefined)[] = [
        DeliveryStatus.DELIVERED,
        DeliveryStatus.DELIVERY_CANCELED,
        undefined,
      ];
      const deliveryStatus = orderInformation.glassLines
        ?.filter((glassLine) => glassLine.glassLineCode === itemGroup)
        .at(0)?.delivery?.deliveryStatus;
      if (denyOmsDeliveryStatus.includes(deliveryStatus)) {
        return false;
      }
    }
    return true;
  }

  /**
   * 受付番号から受付情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @returns 受付情報 | undefined
   */
  private async getReceptionInformation(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string
  ) {
    // 受付情報検索API呼び出し
    const searchReceptionInformationRequest: ReceptionInformationSearchRequest = {
      receptionNumber: receptionNumber,
    };
    logger.info(
      `getSearchReceptionInformationRequest: ${JSON.stringify(searchReceptionInformationRequest)}`
    );
    const apiResponse : ApiResponse<ReceptionInformationSearchResponse> = await sendApiRequest(
      searchReceptionInformation,
      searchReceptionInformationRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(
      `getSearchReceptionInformationResponse: ${JSON.stringify(apiResponse)}`
    );
    const searchReceptionInformationResponse = apiResponse.data;
    return searchReceptionInformationResponse.ReceptionInfoAllItems?.at(0);
  }

  /**
   * 受付番号から注文情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @returns 注文情報 | undefined
   */
  private async getOrderInformationIfExists(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string,
  ) {
    try {
      return await this.getOrderInformation(dpfmRequestInfo, receptionNumber);
    } catch(error) {
      if (isNotFoundResponse(error)) {
        return undefined;
      }
      throw error;
    }
  }

  /**
   * 受付番号から注文情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @param url 送信先url
   * @returns 注文情報
   */
  private async getOrderInformation(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string,
    url?: string
  ) {
    // OMSの注文詳細取得API呼び出し
    const getOrderByReceptionNumberRequest: OrderByReceptionNumberGetRequest = {
      receptionNumber: receptionNumber,
    };

    logger.info(
      `getOrderByReceptionNumberRequest: ${JSON.stringify(getOrderByReceptionNumberRequest)}`
    );
    const apiResponse : ApiResponse<OrderGetResponse> = await sendApiRequest(
      getOrderByReceptionNumber,
      getOrderByReceptionNumberRequest,
      makeDpfmRequestHeader(dpfmRequestInfo),
      url
    );
    logger.info(
      `getOrderByReceptionNumberResponse: ${JSON.stringify(apiResponse)}`
    );
    const orderInformation = apiResponse.data;
    return orderInformation;
  }

  /**
   * 注文ステータスを支払い完了に更新する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   */
  private async updateOrderStatusPaymentCompleted(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string
  ) {
    // update-order-status-payment-completed-by-reception呼出
    const updateOrderStatusPaymentCompletedRequest: UpdateOrderStatusPaymentCompletedByReceptionRequest = {
        receptionNumber: receptionNumber,
    };
    logger.info(
      `updateOrderStatusPaymentCompletedRequest: ${JSON.stringify(updateOrderStatusPaymentCompletedRequest)}`
    );
    const apiResponse : ApiResponse<unknown> = await sendApiRequest(
      postPaymentCompleted,
      updateOrderStatusPaymentCompletedRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(
      `updateOrderStatusPaymentCompletedResponse: ${JSON.stringify(apiResponse)}`
    );
  }

  /**
   * 注文メガネ行ステータスをお渡し準備完了に更新する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param itemGroupCode 商品グループコード
   */
  private async updateGlassLinesStatusReadyForDelivery(
    dpfmRequestInfo: DpfmRequestInfo,
    itemGroupCode: string
  ) {
    //update-glass-lines-status-ready-for-delivery呼出
    const updateGlassLinesStatusReadyForDeliveryRequest: UpdateGlassLinesStatusReadyForDeliveryRequest =
      {
        itemGroupCode: itemGroupCode,
      };
    logger.info(
      `updateGlassLinesStatusReadyForDeliveryRequest: ${JSON.stringify(updateGlassLinesStatusReadyForDeliveryRequest)}`
    );
    const apiResponse : ApiResponse<unknown> = await sendApiRequest(
      postReadyForDelivery,
      updateGlassLinesStatusReadyForDeliveryRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(
      `updateGlassLinesStatusReadyForDeliveryResponse: ${JSON.stringify(apiResponse)}`
    );
  }

  /**
   * 注文メガネ行ステータスをお渡し完了に更新する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param itemGroupCode 商品グループコード
   */
  private async updateGlassLinesStatusDeliveryCompleted(
    dpfmRequestInfo: DpfmRequestInfo,
    itemGroupCode: string
  ) {
    //update-glass-lines-status-delivery-completed呼出
    const updateGlassLinesStatusDeliveryCompletedRequest: UpdateGlassLinesStatusDeliveryCompletedRequest =
      {
        itemGroupCode: itemGroupCode,
      };
    logger.info(
      `updateGlassLinesStatusDeliveryCompletedRequest: ${JSON.stringify(updateGlassLinesStatusDeliveryCompletedRequest)}`
    );
    const apiResponse : ApiResponse<unknown> =await sendApiRequest(
      postDeliveryCompleted,
      updateGlassLinesStatusDeliveryCompletedRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(
      `updateGlassLinesStatusDeliveryCompletedResponse: ${JSON.stringify(apiResponse)}`
    );
  }

  /**
   * 保証書更新
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @param itemGroupCode 商品グループコード
   * @param orderInformation 注文詳細
   */
  private async updateWarranty(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string,
    itemGroupCode: string,
    orderInformation: OrderGetResponse
  ) {
    const warrantyHistory = await this.findWarrantyHistory(
      dpfmRequestInfo,
      receptionNumber
    );
    if (warrantyHistory == undefined) {
      // 保証履歴がない場合（商品購入での受付）、保証を開始する(保証書番号は商品グループコード)
      await this.startWarranty(dpfmRequestInfo, itemGroupCode, orderInformation);
    } else {
      // 保証履歴がある場合(保証交換の受付)、保証書の内容を更新する
      const warranty = await this.findWarranties(
        dpfmRequestInfo,
        warrantyHistory.warrantyNumber!
      );
      await this.exchangeWarranty(dpfmRequestInfo, warranty, warrantyHistory);
    }
  }

  /**
   * 保証履歴取得
   *
   * 受付番号で保証履歴を取得することで、保証交換内容を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @returns 保証履歴（保証交換内容）|undefined
   */
  private async findWarrantyHistory(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string
  ) {
    try {
      // 保証履歴情報取得API呼出
      const findWarrantyHistoriesRequest: WarrantyHistoriesGetRequest = {
        receptionNumber: receptionNumber,
        replacementStatusCode: ReplacementStatusCode.TEMPORARY
          +","+ReplacementStatusCode.PROCESSING
          +","+ReplacementStatusCode.DONE,
      };
      logger.info(
        `getFindWarrantyHistoriesRequest: ${JSON.stringify(findWarrantyHistoriesRequest)}`
      );
      const apiResponse : ApiResponse<WarrantyHistoriesGetResponse> = await sendApiRequest(
        findWarrantyHistories,
        findWarrantyHistoriesRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );
      logger.info(
        `getFindWarrantyHistoriesResponse: ${JSON.stringify(apiResponse)}`
      );
      const warrantyHistoriesResponse = apiResponse.data;
      const warrantyHistories: WarrantyHistories | undefined =
        warrantyHistoriesResponse.warrantyHistories?.at(0);
      return warrantyHistories;
    } catch (error) {
      if (isNotFoundResponse(error)) {
         return undefined;
      }
      throw error;
    }
  }

  /**
   * 保証書開始
   *
   * 新規購入時の保証を開始する。
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param warrantyNumber 保証書番号（＝商品グループコード）
   * @param orderInformation 注文情報
   */
  private async startWarranty(
    dpfmRequestInfo: DpfmRequestInfo,
    warrantyNumber: string,
    orderInformation: OrderGetResponse
  ) {
    /**
     * 受取方法が「配送」判定
     * @param orderInformation 注文情報
     * @param itemGroupCode 商品グループコード
     * @returns true:配送、false:配送以外
     */
    const isShipping = (
      orderInformation: OrderGetResponse,
      itemGroupCode: string
    ) => {
      const deliveryMethodShipping: (string | undefined)[] = [DeliveryMethod.SHIPPING];
      const deliveryMethodCode = orderInformation.glassLines
        ?.filter((glassLine) => glassLine.glassLineCode == itemGroupCode)
        .at(0)?.delivery?.deliveryMethodCode;
      return deliveryMethodShipping.includes(deliveryMethodCode);
    };

    /**
     * 保証開始日取得
     * @param orderInformation 注文情報
     * @param itemGroupCode 商品グループコード
     * @returns 保証開始日
     */
    const getWarrantyStartDate = (
      orderInformation: OrderGetResponse,
      itemGroupCode: string
    ) => {
      const now = new Date();
      if(isShipping(orderInformation, itemGroupCode)) {
        return addDays(now, WarrantyStartDelayDays.DELIVERY_METHOD_SHIPPING);
      }
      return now;
    }

    // 保証書更新API呼出
    const updateWarrantyRequest: WarrantiesPutRequest = {
      warrantyNumber: warrantyNumber,
      warrantyStartDate: fixDatetimeForDpfm(getWarrantyStartDate(orderInformation, warrantyNumber))!,
    };
    logger.info(
      `updateWarrantyRequest: ${JSON.stringify(updateWarrantyRequest)}`
    );
    const apiResponse : ApiResponse<unknown> = await sendApiRequest(
      putWarranties,
      updateWarrantyRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`updateWarrantyResponse: ${JSON.stringify(apiResponse)}`);
  }

  /**
   * 保証情報取得
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param warrantyNumber 保証書番号
   */
  private async findWarranties(
    dpfmRequestInfo: DpfmRequestInfo,
    warrantyNumber: string
  ) {
    // 保証情報取得API呼出
    const findWarrantiesRequest: WarrantiesGetRequest = {
      warrantyNumber: warrantyNumber,
      deleteFlag: false,
    };
    logger.info(
      `getFindWarrantiesRequest: ${JSON.stringify(findWarrantiesRequest)}`
    );
    const apiResponse : ApiResponse<WarrantiesGetResponse> = await sendApiRequest(
      findWarranties,
      findWarrantiesRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`getFindWarrantiesResponse: ${JSON.stringify(apiResponse)}`);
    const warrantiesResponse = apiResponse.data;
    const warrantyInfo: WarrantyInfo = warrantiesResponse.warrantyInfo!;
    return warrantyInfo;
  }

  /**
   * 保証内容更新
   *
   * 保証交換時の保証内容（交換回数など）を更新する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param warranty 保証書
   * @param warrantyHistory 保証交換内容
   */
  private async exchangeWarranty(
    dpfmRequestInfo: DpfmRequestInfo,
    warranty: WarrantyInfo,
    warrantyHistory: WarrantyHistories
  ) {
    /**
     * 保証書更新用オブジェクト取得
     * @param warranty 保証情報
     * @param warrantyHistory 保証履歴（保証交換内容）
     * @returns 保証書更新用オブジェクト|undefined
     */
    const getExchangeWarranty = (
      warranty: WarrantyInfo,
      warrantyHistory: WarrantyHistories
    ): WarrantyForUpdate | undefined => {
      let warrantyForUpdate: WarrantyForUpdate 
      if (warrantyHistory.exchangeCountIncrementFlag !== true) {
        warrantyForUpdate = {
          warrantyNumber: warrantyHistory.warrantyNumber,
        };
      }else{
        warrantyForUpdate = {
          warrantyNumber: warrantyHistory.warrantyNumber,
          exchangeCount: (warranty.exchangeCount ?? 0) + 1,
          deletedFlag: warranty.deletedFlag,
          optimisticLockVerNo: warranty.optimisticLockVerNo,
        };
      }
      
      return warrantyForUpdate;
    };

    /**
     * 保証対象更新情報取得
     * @param warranty 保証情報
     * @param warrantyHistory 保証履歴（保証交換内容）
     * @returns 保証対象更新情報[]|undefined
     */
    const getExchangeWarrantyItems = (
      warranty: WarrantyInfo,
      warrantyHistory: WarrantyHistories
    ): WarrantyItemForUpdate[] | undefined => {
      /**
       * 保証対象更新情報
       * @param warrantyItem 保証対象
       * @returns 保証対象更新情報
       */
      const toWarrantyItemForUpdate = (
        warrantyItem: warrantyItemInfo
      ): WarrantyItemForUpdate => {
        const warrantyItemForUpdate: WarrantyItemForUpdate = {
          itemType: warrantyItem.itemType,
          exchangeCount: (warrantyItem.exchangeCount ?? 0) + 1,
          deletedFlag: warrantyItem.deletedFlag,
          optimisticLockVerNo: warrantyItem.optimisticLockVerNo,
        };
        return warrantyItemForUpdate;
      };

      if (warrantyHistory.exchangeCountIncrementFlag !== true) {
        return undefined;
      }
      const exchangeFrame: (string | undefined)[] = [
        ReplacementPart.ALL,
        ReplacementPart.FRAME,
      ];
      const exchangeLenses: (string | undefined)[] = [
        ReplacementPart.ALL,
        ReplacementPart.LENSES,
      ];
      const itemTypeFrame: (string | undefined)[] = [WarrantyItemType.FRAME];
      const itemTypeLenses: (string | undefined)[] = [
        WarrantyItemType.LENS_LEFT,
        WarrantyItemType.LENS_RIGHT,
      ];

      const warrantyItemForUpdate: WarrantyItemForUpdate[] = [];
      warranty.warrantyItems?.forEach((item) => {
        if (itemTypeFrame.includes(item.itemType)) {
          if (
            warrantyHistory.lensExchange !== true &&
            exchangeFrame.includes(warrantyHistory.replacementPart)
          ) {
            // フレームの更新回数を更新
            warrantyItemForUpdate.push(toWarrantyItemForUpdate(item));
          }
        } else if (itemTypeLenses.includes(item.itemType)) {
          if (exchangeLenses.includes(warrantyHistory.replacementPart)) {
            // レンズの更新回数を更新
            warrantyItemForUpdate.push(toWarrantyItemForUpdate(item));
          }
        }
      });
      return warrantyItemForUpdate.length !== 0
        ? warrantyItemForUpdate
        : undefined;
    };

    // 保証履歴更新API呼出
    const putWarrantyHistoriesRequest: WarrantyHistoriesPutRequest = {
      receptionNumber: warrantyHistory.receptionNumber!,
      replacementStatusCode: ReplacementStatusCode.DONE,
      optimisticLockVerNo: warrantyHistory.optimisticLockVerNo,
      warranty: getExchangeWarranty(warranty, warrantyHistory),
      warrantyItems: getExchangeWarrantyItems(warranty, warrantyHistory),
    };
    logger.info(
      `putWarrantyHistoriesRequest: ${JSON.stringify(putWarrantyHistoriesRequest)}`
    );
    const apiResponse : ApiResponse<unknown> = await sendApiRequest(
      putWarrantyHistories,
      putWarrantyHistoriesRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`putWarrantyHistoriesResponse: ${JSON.stringify(apiResponse)}`);
  }

  /**
   * 受付情報を完了に更新する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionInformation 受付情報
   */
  private async updateReceptionInformationResolve(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionInformation: ReceptionInformation
  ) {
    /**
     * 処理コードを取得する
     * @param receptionInformation 受付情報
     * @returns 処理コード
     */
    const getEventCode = (receptionInformation: ReceptionInformation) => {
      switch (receptionInformation.statusCode) {
        case ReceptionStatus.ADJUSTMENT:
          return EventCode.ADJUSTMENT.CODE;
        case ReceptionStatus.PAYMENT:
          return EventCode.PAYMENT.CODE;
        case ReceptionStatus.GENERAL_HELP:
          return EventCode.GENERAL_HELP.CODE;
      }
    };
    // 受付情報更新API呼び出し
    const receptionEventsPostRequest: ReceptionEventsPostRequest = {
      receptionNumber: receptionInformation.receptionNumber,
      statusCode: ReceptionStatus.COMPLETE,
      callingStatusCode: CallingStatus.DONE,
      eventCode: getEventCode(receptionInformation),
    };
    logger.info(
      `postReceptionEventsRequest: ${JSON.stringify(receptionEventsPostRequest)}`
    );

    const apiResponse : ApiResponse<unknown> = await sendApiRequest(
      postReceptionEvents,
      receptionEventsPostRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`postReceptionEventsResponse: ${JSON.stringify(apiResponse)}`);
  }

  /**
   * 受付情報を更新する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @param orderStatusCode 注文ステータス
   */
  private async updateReceptionInformationFromOrder(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string,
    orderStatusCode: string
  ) {
    /**
     * 受付ステータスを取得する
     * @param orderInformation 注文情報
     * @returns 受付ステータスコード
     */
    const getReceptionStatusCode = (orderInformation: OrderGetResponse) => {
      if (orderInformation.orderStatus === OmsOrderStatus.ORDER_COMPLETED) {
        return ReceptionStatus.ORDER_COMPLETE;
      }
      return orderInformation.glassLines?.some(
        (glassLine) =>
          glassLine.delivery?.deliveryStatus ===
          DeliveryStatus.READY_FOR_DELIVERY
      )
        ? ReceptionStatus.PICK_UP
        : ReceptionStatus.PROCESSING;
    };
    /**
     * 呼出状態を取得する
     * @param orderInformation 注文情報
     * @returns 呼出状態
     */
    const getCallingStatusCode = (orderInformation: OrderGetResponse) => {
      return orderInformation.orderStatus === OmsOrderStatus.ORDER_COMPLETED
        ? CallingStatus.DONE
        : CallingStatus.NONE;
    };
    /**
     * 処理コードを取得する
     * @param orderStatusCode 注文ステータス
     * @returns 処理コード
     */
    const getEventCode = (orderStatusCode: string) => {
      switch (orderStatusCode) {
        case OrderStatus.PROCESSING:
          // 加工待ちに遷移するのは、支払いが完了した時
          return EventCode.PAYMENT.CODE;
        case OrderStatus.PICKUP:
          // お渡し準備完了に遷移するのは、加工が完了したとき
          return EventCode.FINISH_PROCESSING.CODE;
        case OrderStatus.ORDER_COMPLETED:
          return EventCode.DELIVER.CODE;
      }
    };

    // 最新の注文情報を取得する(更新系のデジタル基盤呼び出し)
    const orderInformation = await this.getOrderInformation(
      dpfmRequestInfo,
      receptionNumber,
      process.env.SALESORDER_SERVICE_JP
    );

    // 受付情報更新API呼び出し
    const receptionEventsPostRequest: ReceptionEventsPostRequest = {
      receptionNumber: receptionNumber,
      statusCode: getReceptionStatusCode(orderInformation!),
      callingStatusCode: getCallingStatusCode(orderInformation!),
      eventCode: getEventCode(orderStatusCode),
    };
    logger.info(
      `postReceptionEventsRequest: ${JSON.stringify(receptionEventsPostRequest)}`
    );

    const apiResponse : ApiResponse<unknown> = await sendApiRequest(
      postReceptionEvents,
      receptionEventsPostRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`postReceptionEventsResponse: ${JSON.stringify(apiResponse)}`);
  }
}
