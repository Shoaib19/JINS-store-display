import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { postItemGroupsServer, postReceptionEvents } from "~/src/clients/carts/cartsClient";
import {
  CallingStatus,
  DeliveryMethod,
  ReceptionStatus,
} from "~/src/components/const";
import { StoreStaffErrorCode } from "~/src/components/errorCode";
import { ApplicationError, ValidationError } from "~/src/components/errors";
import { EventCode, SubEventCode } from "~/src/components/eventCode";
import { logger } from "~/src/logging/logger";
import type { IDeliveriesPresenter } from "~/src/presenters/interfaces";
import { sendApiRequest } from "~/src/utils/fetchService";
import { fixDatetimeForDpfm } from "~/src/utils/fixDatetime";
import { components, operations } from "~/src/interfaces/root";
import { ItemGroupsPutRequest, ReceptionEventsPostRequest } from "~/src/clients/carts/cartsClientTypes";
import { ApiResponse } from "openapi-typescript-fetch";
import { DpfmRequestInfo, generateDpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";

/**
 * 受取方法登録・変更
 */
@injectable()
export class DeliveriesPresenter
  implements IDeliveriesPresenter
{
  /**
   * 受取方法登録・変更
   * @param req - Request
   * @param res - Response
   * @param next - NextFunction
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // バリデーションチェック
      this.validateRequest(req);
      const dpfmRequestInfo = generateDpfmRequestInfo(req);
      const path = req.params as operations["postDelivery"]["parameters"]["path"];
      const body: components["schemas"]["DeliveryPostRequest"] = req.body;

      // 受取方法登録
      await this.updateItemGroup(
        dpfmRequestInfo,
        { ...path, ...body }
      );
      // 受付情報更新
      await this.updateReception(
        dpfmRequestInfo,
        path.storeCode,
        path.receptionNumber,
        path.itemGroupCode
      );

      res.status(200).send();
      return;
    } catch (error) {
      next(error);
    }
  };

  /**
   * リクエストバリデート
   * @param req - Request
   * @returns ErrorResponse | undefined
   */
  private validateRequest(req: Request): void {
    const body: components["schemas"]["DeliveryPostRequest"] = req.body;
    if (this.isShipping(body.deliveryMethodCode)) {
      // 配送指定の場合、配送先情報が必須(配送先情報の各項目のバリデーションは実施済み)
      if (!body.deliveryAddress) {
        throw new ApplicationError(
          StoreStaffErrorCode.BFF_USSTORESTAFF_0007_STORE_OR_ADDRESS_REQUIRED,
          StoreStaffErrorCode.BFF_USSTORESTAFF_0007_STORE_OR_ADDRESS_REQUIRED.message
        );
      }
    } else if (this.isPickupAtOwnStore(body.deliveryMethodCode)) {
      // 自店舗受取指定の場合、チェック処理なし
    } else if (this.isPickupAtOtherStore(body.deliveryMethodCode)) {
      // 他店舗受取指定の場合、配送先の店舗コードが必須
      if (!body.deliveryStoreCode) {
        throw new ApplicationError(
          StoreStaffErrorCode.BFF_USSTORESTAFF_0007_STORE_OR_ADDRESS_REQUIRED,
          StoreStaffErrorCode.BFF_USSTORESTAFF_0007_STORE_OR_ADDRESS_REQUIRED.message
        );
      }
    } else {
      // 受取方法指定誤り
        throw new ValidationError("Invalid deliveryMethodCode.");
    }
  };

  /**
   * 配送指定判定
   * @param deliveryMethodCode - 受取方法
   * @returns boolean
   */
  private isShipping = (deliveryMethodCode: string) => {
    return deliveryMethodCode === DeliveryMethod.SHIPPING;
  };

  /**
   * 自店舗受取指定判定
   * @param deliveryMethodCode - 受取方法
   * @returns boolean
   */
  private isPickupAtOwnStore = (deliveryMethodCode: string) => {
    return (
      deliveryMethodCode === DeliveryMethod.HAND_OVER ||
      deliveryMethodCode === DeliveryMethod.PICKUP_LOCKER
    );
  };

  /**
   * 他店舗受取指定判定
   * @param deliveryMethodCode - 受取方法
   * @returns boolean
   */
  private isPickupAtOtherStore = (deliveryMethodCode: string) =>{
    return (
      deliveryMethodCode === DeliveryMethod.HAND_OVER_AT_OTHER_STORE ||
      deliveryMethodCode === DeliveryMethod.PICKUP_LOCKER_AT_OTHER_STORE
    );
  };

  /**
   * 受付情報を更新する。
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param storeCode 店舗コード
   * @param receptionNumber 受付番号
   * @param itemGroupCode 商品グループコード
   */
  private updateReception = async (
    dpfmRequestInfo: DpfmRequestInfo,
    storeCode: string,
    receptionNumber: string,
    itemGroupCode: string
  ) => {
    const rcptEventPostRequest: ReceptionEventsPostRequest = {
      receptionNumber: receptionNumber,
      itemGroupCode: itemGroupCode,
      storeCode: storeCode,
      statusCode: ReceptionStatus.ORDER_NEW, // カート登録:200
      callingStatusCode: CallingStatus.NONE, // 対象外:000
      eventCode: EventCode.PICK_UP.CODE, // Pick-up:500
      subEventCode: SubEventCode.ADD, // add:100
    };

    logger.info(
      `postRcptEventRequest: ${JSON.stringify(rcptEventPostRequest)}`
    );

    const apiResponse: ApiResponse<unknown> = await sendApiRequest(
      postReceptionEvents,
      rcptEventPostRequest,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`postRcptEventResponse: ${JSON.stringify(apiResponse)}`);
  };

/**
   * 商品グループ更新（受取方法）
   * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
   * @param request 受取方法登録・変更APIのリクエスト(path,body)
   */
  private updateItemGroup = async (
    dpfmRequestInfo: DpfmRequestInfo,
    request: operations["postDelivery"]["parameters"]["path"] & components["schemas"]["DeliveryPostRequest"] 
  ) => {
    const putItemGroups: ItemGroupsPutRequest = {
      receptionNumber: request.receptionNumber,
      itemGroupCode: request.itemGroupCode,
      deliveryMethodCode: request.deliveryMethodCode,
      deliveryDatetime: fixDatetimeForDpfm(request.deliveryDate) ?? undefined,
      deliveryStoreCode: this.isPickupAtOtherStore(request.deliveryMethodCode)
        ? request.deliveryStoreCode
        : this.isPickupAtOwnStore(request.deliveryMethodCode)
          ? request.storeCode
          : undefined,
      customerName: request.deliveryAddress?.fullName,
      phoneNumber: request.deliveryAddress?.phoneNumber,
      shippingAddressZip: request.deliveryAddress?.postalCode,
      shippingAddress1: request.deliveryAddress?.state,
      shippingAddress2: request.deliveryAddress?.city,
      shippingAddress3: request.deliveryAddress?.address1,
      shippingAddress4: request.deliveryAddress?.address2,
      isWaitingLens: request.isWaitingLens,
      isDeliveryToday: request.isDeliveryToday,
    };
    logger.info(`putItemGroupsRequest: ${JSON.stringify(putItemGroups)}`);

    const apiResponse: ApiResponse<unknown> = await sendApiRequest(
      postItemGroupsServer,
      putItemGroups,
      makeDpfmRequestHeader(dpfmRequestInfo)
    );

    logger.info(`putItemGroupsResponse: ${JSON.stringify(apiResponse)}`);
  };
}
