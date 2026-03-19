import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { IOrderStatusUpdatePresenter } from "~/src/presenters/interfaces";

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
  DeliveryStatus,
  OmsOrderStatus,
  OrderStatus,
  ReceptionStatus,
  ReplacementPart,
  ReplacementStatusCode,
  WarrantyItemType,
} from "~/src/compornents/const";
import { components } from "~/src/interfaces/root";
import { ErrorResponse } from "~/src/compornents/errors";
import { makeErrorResponse400, makeErrorResponse404 } from "~/src/utils/makeErrorResponse400";
import {
  DpfmRequestInfo,
  generateDpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import {
  ReceptionEventsRequest,
  ReceptionInformation,
  SearchReceptionInformationQuery,
  SearchReceptionInformationResponse,
} from "~/src/clients/carts/cartsClientTypes";
import {
  GetOrderByReceptionNumberPath,
  OrderDetailReadDto,
} from "~/src/clients/salesOrder/salesOrderClientTypes";
import { getOrderByReceptionNumber } from "~/src/clients/salesOrder/salesOrderClient";
import {
  UpdateGlassLinesStatusDeliveryCompletedPath,
  UpdateGlassLinesStatusReadyForDeliveryPath,
  UpdateOrderStatusPaymentCompletedByReceptionPath,
} from "~/src/clients/oms/omsClientTypes";
import {
  FindWarrantiesPath,
  FindWarrantiesQuery,
  FindWarrantyHistoriesQuery,
  PutWarrantiesPath,
  PutWarrantyHistoriesPath,
  WarrantiesPutRequest,
  WarrantiesResponse,
  WarrantyForUpdate,
  WarrantyHistories,
  WarrantyHistoriesPutRequest,
  WarrantyHistoriesResponse,
  WarrantyInfo,
  WarrantyItemForUpdate,
  warrantyItemInfo,
} from "~/src/clients/warranties/warrantiesClientTypes";
import { findWarranties, findWarrantyHistories, putWarranties, putWarrantyHistories } from "~/src/clients/warranties/warrantiesClient";
import { EventCode } from "~/src/compornents/eventCode";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import {
  getReadyForPickupMessage,
} from "~/src/utils/createMessage";
import { SMSNotifier } from "~/src/utils/fetchService4SMS";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";

/**
 * オーダーステータス更新API
 */
@injectable()
export class OrderStatusUpdatePresenter
  extends BasePresenter
  implements IOrderStatusUpdatePresenter
{
  /**
   * オーダーステータス更新
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
      // バリデーションチェック
      const validateError = this.validateRequest(req);
      if (validateError != undefined) {
        res.status(400).json(validateError);
        return;
      }
      const dpfmRequestInfo = generateDpfmRequestInfo(req);
      const body: components["schemas"]["OrderStatusPutRequest"] = req.body;

      if (body.orderStatusCode === OrderStatus.RESOLVE) {
        // 受付番号から受付情報取得
        const receptionInformation = await this.getReceptionInformation(
          dpfmRequestInfo,
          req.params.receptionNumber
        );
        if (receptionInformation == undefined) {
          // 受付情報が見つからないときは404を返却
          const error: ErrorResponse = makeErrorResponse404(
            `There is no recode matched ${req.params.receptionNumber}.`,
            req
          );
          res.status(404).json(error);
          return;
        }
        if (!this.isUpdatableReception(receptionInformation)) {
          // 受付情報が、更新できないときは400を返却
          const error: ErrorResponse = makeErrorResponse400(
            ["The reception is not updatable."],
            req
          );
          res.status(400).json(error);
          return;
        }
        // 受付情報更新
        await this.updateReceptionInformationResolve(
          dpfmRequestInfo,
          receptionInformation
        );
      } else {
        // 受付番号から注文情報取得
        const orderInformation = await this.getOrderInformation(
          dpfmRequestInfo,
          req.params.receptionNumber
        );
        if (orderInformation == undefined) {
          // 注文情報が見つからないときは404を返却
          const error: ErrorResponse = makeErrorResponse404(
            `There is no recode matched ${req.params.receptionNumber}.`,
            req
          );
          res.status(404).json(error);
          return;
        }
        if (
          body.itemGroupCode !== undefined &&
          !orderInformation.glassLines?.some(
            (glassLine) => glassLine.glassLineCode === body.itemGroupCode
          )
        ) {
          // 商品グループが見つからないときは404を返却
          const error: ErrorResponse = makeErrorResponse404(
            `There is no recode matched ${body.itemGroupCode}.`,
            req
          );
          res.status(404).json(error);
          return;
        }
        if (!this.isUpdatableOrder(orderInformation, body.itemGroupCode)) {
          // 注文情報が、更新できないときは400を返却
          const error: ErrorResponse = makeErrorResponse400(
            ["The order is not updatable."],
            req
          );
          res.status(400).json(error);
          return;
        }

        switch (body.orderStatusCode) {
          case OrderStatus.PROCESSING: // 加工待ち
            await this.updateOrderStatusPaymentCompleted(
              dpfmRequestInfo,
              req.params.receptionNumber
            );
            break;
          case OrderStatus.PICKUP: // お渡し準備完了
            await this.updateGlassLinesStatusReadyForDelivery(
              dpfmRequestInfo,
              body.itemGroupCode!
            );
            // MN版ではSMS通知は行わない
            // if (orderInformation.phoneNumber != undefined) {
            //   try {
            //     const readyForPickupMessage: string = getReadyForPickupMessage(
            //       body.itemGroupCode!
            //     );
            //     logger.info(`readyForPickupMessage: ${readyForPickupMessage}`);
            //     const smsnotifierUrl = process.env.SMS_NOTIFIER + "/smsnotifier/JINSUS"
            //     await SMSNotifier(
            //       smsnotifierUrl,
            //       readyForPickupMessage,
            //       orderInformation.phoneNumber
            //     );
            //   } catch (error) {
            //     logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
            //   }
            // }
            break;
          case OrderStatus.ORDER_COMPLETED: // お渡し完了
            await this.updateGlassLinesStatusDeliveryCompleted(
              dpfmRequestInfo,
              body.itemGroupCode!
            );
            // 保証書を更新する
            await this.updateWarranty(
              dpfmRequestInfo,
              req.params.receptionNumber,
              body.itemGroupCode!
            );
            break;
        }
        await this.updateReceptionInformationFromOrder(
          dpfmRequestInfo,
          req.params.receptionNumber,
          body.orderStatusCode
        );
      }

      const response: components["schemas"]["OrderStatusResponse"] = {
        orderStatusCode: body.orderStatusCode,
      };
      res.status(200).json(response);
      return;
    } catch (error: any) {
      if (error.status == 404) {
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
      return makeErrorResponse400(["Invalid orderStatusCode"], req);
    }
    // 商品グループコードが必要な注文ステータスだが、商品グループコードが設定されてない
    if (
      needItemGroupOrderStatusCode.includes(body.orderStatusCode) &&
      body.itemGroupCode == undefined
    ) {
      return makeErrorResponse400(["Invalid orderStatusCode"], req);
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
    orderInformation: OrderDetailReadDto,
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
    const searchReceptionInformationQuery: SearchReceptionInformationQuery = {
      receptionNumber: receptionNumber,
    };

    const searchReceptionInformationRequest = {
      ...searchReceptionInformationQuery,
    };
    logger.info(
      `searchReceptionInformationRequest: ${JSON.stringify(searchReceptionInformationRequest)}`
    );
    const apiResponse = await sendApiRequest(
      searchReceptionInformation,
      searchReceptionInformationRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(
      `SearchReceptionInformationResponse: ${JSON.stringify(apiResponse)}`
    );
    if (!apiResponse.ok) {
      throw apiResponse;
    }
    const searchReceptionInformationResponse: SearchReceptionInformationResponse =
      apiResponse.data;
    return searchReceptionInformationResponse.ReceptionInfoAllItems?.at(0);
  }

  /**
   * 受付番号から注文情報を取得する
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @param newest 強制（trueを指定した場合更新系のサービスから取得）
   * @returns 注文情報 | undefined(newestがundefined/false時)
   */
  private async getOrderInformation(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string,
    newest?: boolean
  ) {
    try {
      // OMSの注文詳細取得API呼び出し
      const getOrderByReceptionNumberPath: GetOrderByReceptionNumberPath = {
        receptionNumber: receptionNumber,
      };
      const getOrderByReceptionNumberRequst = {
        ...getOrderByReceptionNumberPath,
      };

      logger.info(
        `getOrderByReceptionNumberRequst: ${JSON.stringify(getOrderByReceptionNumberRequst)}`
      );
      const apiResponse = await sendApiRequest(
        getOrderByReceptionNumber,
        getOrderByReceptionNumberRequst,
        makeDpfmRequestHeader(dpfmRequestInfo),
        newest ? process.env.SALESORDER_SERVICE_JP : undefined
      );
      logger.info(
        `getOrderByReceptionNumberResponse: ${JSON.stringify(apiResponse)}`
      );
      if (!apiResponse.ok) {
        throw apiResponse;
      }
      const orderInformation: OrderDetailReadDto = apiResponse.data;
      return orderInformation;
    } catch (error: any) {
      if (!!!newest) {
        if (typeof error === "object" && error != null) {
          if ("status" in error) {
            if (error.status === 404) {
              return undefined;
            }
          }
        }
      }
      throw error;
    }
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
    const updateOrderStatusPaymentCompletedPath: UpdateOrderStatusPaymentCompletedByReceptionPath =
      {
        receptionNumber: receptionNumber,
      };
    const updateOrderStatusPaymentCompletedRequest = {
      ...updateOrderStatusPaymentCompletedPath,
    };
    logger.info(
      `updateOrderStatusPaymentCompletedRequest: ${JSON.stringify(updateOrderStatusPaymentCompletedRequest)}`
    );
    const apiResponse = await sendApiRequest(
      postPaymentCompleted,
      updateOrderStatusPaymentCompletedRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(
      `updateOrderStatusPaymentCompletedResponse: ${JSON.stringify(apiResponse)}`
    );
    if (!apiResponse.ok) {
      throw apiResponse;
    }
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
    const updateGlassLinesStatusReadyForDeliveryPath: UpdateGlassLinesStatusReadyForDeliveryPath =
      {
        itemGroupCode: itemGroupCode,
      };
    const updateGlassLinesStatusReadyForDeliveryRequest = {
      ...updateGlassLinesStatusReadyForDeliveryPath,
    };
    logger.info(
      `updateGlassLinesStatusReadyForDeliveryRequest: ${JSON.stringify(updateGlassLinesStatusReadyForDeliveryRequest)}`
    );
    const apiResponse = await sendApiRequest(
      postReadyForDelivery,
      updateGlassLinesStatusReadyForDeliveryRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(
      `updateGlassLinesStatusReadyForDeliveryResponse: ${JSON.stringify(apiResponse)}`
    );
    if (!apiResponse.ok) {
      throw apiResponse;
    }
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
    //update-glass-lines-status-delivery-completedy呼出
    const updateGlassLinesStatusDeliveryCompletedPath: UpdateGlassLinesStatusDeliveryCompletedPath =
      {
        itemGroupCode: itemGroupCode,
      };
    const updateGlassLinesStatusDeliveryCompletedRequest = {
      ...updateGlassLinesStatusDeliveryCompletedPath,
    };
    logger.info(
      `updateGlassLinesStatusDeliveryCompletedRequest: ${JSON.stringify(updateGlassLinesStatusDeliveryCompletedRequest)}`
    );
    const apiResponse = await sendApiRequest(
      postDeliveryCompleted,
      updateGlassLinesStatusDeliveryCompletedRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(
      `updateGlassLinesStatusDeliveryCompletedResponse: ${JSON.stringify(apiResponse)}`
    );
    if (!apiResponse.ok) {
      throw apiResponse;
    }
  }

  /**
   * 保証書更新
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param receptionNumber 受付番号
   * @param itemGroupCode 商品グループコード
   */
  private async updateWarranty(
    dpfmRequestInfo: DpfmRequestInfo,
    receptionNumber: string,
    itemGroupCode: string
  ) {
    const warrantyHistory = await this.findWarrantyHistory(
      dpfmRequestInfo,
      receptionNumber
    );
    if (warrantyHistory == undefined) {
      // 保証履歴がない場合（商品購入での受付）、保証を開始する(保証書番号は商品グループコード)
      await this.startWarranty(dpfmRequestInfo, itemGroupCode);
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
      const findWarrantyHistoriesQuery: FindWarrantyHistoriesQuery = {
        receptionNumber: receptionNumber,
      };
      const findWarrantyHistoriesRequest = {
        ...findWarrantyHistoriesQuery,
      };
      logger.info(
        `findWarrantyHistories: ${JSON.stringify(findWarrantyHistoriesRequest)}`
      );
      const apiResponse = await sendApiRequest(
        findWarrantyHistories,
        findWarrantyHistoriesRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );
      logger.info(
        `findWarrantyHistoriesResponse: ${JSON.stringify(apiResponse)}`
      );
      if (!apiResponse.ok) {
        throw apiResponse;
      }
      const warrantyHistoriesResponse: WarrantyHistoriesResponse =
        apiResponse.data;
      const warrantyHistories: WarrantyHistories | undefined =
        warrantyHistoriesResponse.warrantyHistories?.at(0);
      return warrantyHistories;
    } catch (error: any) {
      if (error.status === 404) {
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
   * @param warrantyNumber 保証書番号
   */
  private async startWarranty(
    dpfmRequestInfo: DpfmRequestInfo,
    warrantyNumber: string
  ) {
    // 保証書更新API呼出
    const putWarrantiesPath: PutWarrantiesPath = {
      warrantyNumber: warrantyNumber,
    };
    const warrantiesPutRequest: WarrantiesPutRequest = {
      warrantyStartDate: fixSystemDate(getStoreTimeZone(dpfmRequestInfo.bffRequest))!,
    };
    const updatetWarrantyRequest = {
      ...putWarrantiesPath,
      ...warrantiesPutRequest,
    };
    logger.info(
      `updatetWarrantyRequest: ${JSON.stringify(updatetWarrantyRequest)}`
    );
    const apiResponse = await sendApiRequest(
      putWarranties,
      updatetWarrantyRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`updatetWarrantyResponse: ${JSON.stringify(apiResponse)}`);
    if (!apiResponse.ok) {
      throw apiResponse;
    }
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
    const findWarrantiesPathPath: FindWarrantiesPath = {
      warrantyNumber: warrantyNumber,
    };
    const findWarrantiesQuery: FindWarrantiesQuery = {
      deleteFlag: false,
    };
    const findWarrantiesRequest = {
      ...findWarrantiesPathPath,
      ...findWarrantiesQuery,
    };
    logger.info(
      `findWarrantiesRequest: ${JSON.stringify(findWarrantiesRequest)}`
    );
    const apiResponse = await sendApiRequest(
      findWarranties,
      findWarrantiesRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`findWarrantiesResponse: ${JSON.stringify(apiResponse)}`);
    if (!apiResponse.ok) {
      throw apiResponse;
    }
    const warrantiesResponse: WarrantiesResponse = apiResponse.data;
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
      if (warrantyHistory.exchangeCountIncrementFlag !== true) {
        return undefined;
      }
      const warrantyForUpdate: WarrantyForUpdate = {
        warrantyNumber: warrantyHistory.warrantyNumber,
        exchangeCount: (warranty.exchangeCount ?? 0) + 1,
        deletedFlag: warranty.deletedFlag,
        optimisticLockVerNo: warranty.optimisticLockVerNo,
      };
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
        WarrantyItemType.LENS_RIGTH,
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
    const putWarrantyHistoriesPath: PutWarrantyHistoriesPath = {
      receptionNumber: warrantyHistory.receptionNumber!,
    };
    const warrantyHistoriesPutRequest: WarrantyHistoriesPutRequest = {
      replacementStatusCode: ReplacementStatusCode.DONE,
      optimisticLockVerNo: warrantyHistory.optimisticLockVerNo,
      warranty: getExchangeWarranty(warranty, warrantyHistory),
      warrantyItems: getExchangeWarrantyItems(warranty, warrantyHistory),
    };
    const putWarrantyHistoriesRequest = {
      ...putWarrantyHistoriesPath,
      ...warrantyHistoriesPutRequest,
    };
    logger.info(
      `putWarrantyHistoriesRequest: ${JSON.stringify(putWarrantyHistoriesRequest)}`
    );
    const apiResponse = await sendApiRequest(
      putWarrantyHistories,
      putWarrantyHistoriesRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`putWarrantyHistoriesResponse: ${JSON.stringify(apiResponse)}`);
    if (!apiResponse.ok) {
      throw apiResponse;
    }
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
          return EventCode.ADJUSTMENT;
        case ReceptionStatus.PAYMENT:
          return EventCode.PAYMENT;
        case ReceptionStatus.GENERAL_HELP:
          return EventCode.PAYMENT;
      }
    };
    // 受付情報更新API呼び出し
    const receptionEventsPostRequest: ReceptionEventsRequest = {
      receptionNumber: receptionInformation.receptionNumber,
      statusCode: ReceptionStatus.COMPLETE,
      callingStatusCode: CallingStatus.DONE,
      eventCode: getEventCode(receptionInformation),
    };
    logger.info(
      `receptionEventsPostRequest: ${JSON.stringify(receptionEventsPostRequest)}`
    );

    const apiResponse = await sendApiRequest(
      postReceptionEvents,
      receptionEventsPostRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`receptionEventsPostResponse: ${JSON.stringify(apiResponse)}`);
    if (!apiResponse.ok) {
      throw apiResponse;
    }
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
    const getReceptionStatusCode = (orderInformation: OrderDetailReadDto) => {
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
    const getCallingStatusCode = (orderInformation: OrderDetailReadDto) => {
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
          return EventCode.PAYMENT;
        case OrderStatus.PICKUP:
          // お渡し準備完了に遷移するのは、加工が完了したとき
          return EventCode.FINISH_PROCESSING;
        case OrderStatus.ORDER_COMPLETED:
          return EventCode.DELIVER;
      }
    };

    // 最新の注文情報を取得する
    const orderInformation = await this.getOrderInformation(
      dpfmRequestInfo,
      receptionNumber,
      true
    );

    // 受付情報更新API呼び出し
    const receptionEventsPostRequest: ReceptionEventsRequest = {
      receptionNumber: receptionNumber,
      statusCode: getReceptionStatusCode(orderInformation!),
      callingStatusCode: getCallingStatusCode(orderInformation!),
      eventCode: getEventCode(orderStatusCode),
    };
    logger.info(
      `receptionEventsPostRequest: ${JSON.stringify(receptionEventsPostRequest)}`
    );

    const apiResponse = await sendApiRequest(
      postReceptionEvents,
      receptionEventsPostRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );
    logger.info(`receptionEventsPostResponse: ${JSON.stringify(apiResponse)}`);
    if (!apiResponse.ok) {
      throw apiResponse;
    }
  }
}
