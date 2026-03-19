import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { postItemGroupsServer, postReceptionEvents } from "~/src/clients/carts/cartsClient";
import {
  CallingStatus,
  customerStaffId,
  DeliveryMethod,
  ReceptionStatus,
} from "~/src/compornents/const";
import { StoreStaffErrorCode } from "~/src/compornents/errorCode";
import { ErrorResponse } from "~/src/compornents/errors";
import { EventCode, SubEventCode } from "~/src/compornents/eventCode";
import { logger } from "~/src/logging/logger";
import { BasePresenter } from "~/src/presenters/BasePresenter";
import type { IDeliveriesPresenter } from "~/src/presenters/interfaces";
import { sendApiRequest } from "~/src/utils/fetchService";
import { fixDatetimeForDpfm } from "~/src/utils/fixDatetime";
import { components } from "~/src/interfaces/root";
import { operations as cartsOperations } from "~/src/interfaces/clients/carts/cartsClient";
import { makeErrorResponse400 } from "~/src/utils/makeErrorResponse400";

/**
 * 受取方法登録・変更
 */
@injectable()
export class DeliveriesPresenter
  extends BasePresenter
  implements IDeliveriesPresenter
{
  /**
   * 受取方法登録・変更
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
      requestHeader.set("jins-user-id", req.header("staffID") ?? customerStaffId);

      if (cursor) {
        requestHeader.set("X-Cursor", cursor);
      }

      // バリデーションチェック
      const validateError = this.validateRequest(req);
      if (validateError) {
        res.status(400).json(validateError);        return;
      }
      const body: components["schemas"]["DeliveryPostRequest"] = req.body;

      // 受取方法登録API呼出
      const putItemGroupsPathParameters: cartsOperations["putItemGroups"]["parameters"]["path"] = {
        receptionNumber: req.params.receptionNumber,
        itemGroupCode: req.params.itemGroupCode,
      };
      const putItemGroupsContent: cartsOperations["putItemGroups"]["requestBody"]["content"]["application/json"] = {
        deliveryMethodCode: body.deliveryMethodCode,
        deliveryDatetime: fixDatetimeForDpfm(body.deliveryDate) ?? undefined,
        deliveryStoreCode: this.isPickupAtOtherStore(body.deliveryMethodCode)
          ? body.deliveryStoreCode
          : this.isPickupAtOwnStore(body.deliveryMethodCode)
            ? req.params.storeCode
            : undefined,
        customerName: body.deliveryAddress?.fullName,
        phoneNumber: body.deliveryAddress?.phoneNumber,
        shippingAddressZip: body.deliveryAddress?.postalCode,
        shippingAddress1: body.deliveryAddress?.state,
        shippingAddress2: body.deliveryAddress?.city,
        shippingAddress3: body.deliveryAddress?.address1,
        shippingAddress4: body.deliveryAddress?.address2,
        isWaitingLens: body.isWaitingLens,
        isDeliveryToday: body.isDeliveryToday,
      };
      const putItemGroups = {
        ...putItemGroupsPathParameters,
        ...putItemGroupsContent,
      };
      logger.info(`putItemGroups: ${JSON.stringify(putItemGroups)}`);

      // デジタル基盤層APIを呼び出す
      requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
      const itemGroupsPostResponse = await sendApiRequest(postItemGroupsServer, putItemGroups, requestHeader);

      logger.info(`itemGroupsPostResponse: ${JSON.stringify(itemGroupsPostResponse)}`);

      if (!itemGroupsPostResponse.ok) {
        throw itemGroupsPostResponse;
      }

      // 受付情報更新API呼出
      // TODO: oasのクラス定義で設定
      interface RcptEventPostRequest {
        receptionNumber: string; // 受付番号
        itemGroupCode: string; // 商品グループCD
        storeCode: string; // 配送先の店舗コード
        statusCode: string; // 受付ステータスコード
        callingStatusCode: string; // 呼出状態コード
        eventCode: string; // 処理コード
        subEventCode: string; // サブ処理コード
      }

      const rcptEventPostRequest: RcptEventPostRequest = {
        receptionNumber: req.params.receptionNumber,
        itemGroupCode: req.params.itemGroupCode,
        storeCode: req.params.storeCode,
        statusCode: ReceptionStatus.ORDER_NEW, // カート登録:200
        callingStatusCode: CallingStatus.NONE, // 対象外:000
        eventCode: EventCode.PICK_UP, // Pick-up:500
        subEventCode: SubEventCode.ADD, // add:100
      };

      logger.info(`rcptEventPostRequest: ${JSON.stringify(rcptEventPostRequest)}`);

      // デジタル基盤層APIを呼び出す
      requestHeader.set("jins-trace-id-branch-no", (++traceBranchNo).toString());
      const rcptEventPostResponse = await sendApiRequest(
        postReceptionEvents,
        rcptEventPostRequest,
        requestHeader
      );

      logger.info(`rcptEventPostResponse: ${JSON.stringify(rcptEventPostResponse)}`);

      if (!rcptEventPostResponse.ok) {
        throw rcptEventPostResponse;
      }

      res.status(200).send();
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


  /**
   * リクエストバリデート
   * @param req - Request
   * @returns ErrorResponse | undefined
   */
  private validateRequest(req: Request): ErrorResponse | undefined {
    const body: components["schemas"]["DeliveryPostRequest"] = req.body;
    if (this.isShipping(body.deliveryMethodCode)) {
      // 配送指定の場合、配送先情報が必須(配送先情報の各項目のバリデーションは実施済み)
      if (!body.deliveryAddress) {
        return makeErrorResponse400(
          [StoreStaffErrorCode.BFF_USSTORESTAFF_0007_STORE_OR_ADDRESS_REQUIRED.MESSAGE],
          req,
          StoreStaffErrorCode.BFF_USSTORESTAFF_0007_STORE_OR_ADDRESS_REQUIRED.CODE,
          StoreStaffErrorCode.BFF_USSTORESTAFF_0007_STORE_OR_ADDRESS_REQUIRED.MESSAGE
        );
      }
    } else if (this.isPickupAtOwnStore(body.deliveryMethodCode)) {
      // 自店舗受取指定の場合、チェック処理なし
    } else if (this.isPickupAtOtherStore(body.deliveryMethodCode)) {
      // 他店舗受取指定の場合、配送先の店舗コードが必須
      if (!body.deliveryStoreCode) {
        return makeErrorResponse400(
          [StoreStaffErrorCode.BFF_USSTORESTAFF_0007_STORE_OR_ADDRESS_REQUIRED.MESSAGE],
          req,
          StoreStaffErrorCode.BFF_USSTORESTAFF_0007_STORE_OR_ADDRESS_REQUIRED.CODE,
          StoreStaffErrorCode.BFF_USSTORESTAFF_0007_STORE_OR_ADDRESS_REQUIRED.MESSAGE
        );
      }
    } else {
      // 受取方法指定誤り
      return makeErrorResponse400(["Invalid deliveryMethodCode."], req);
    }
  }
  /**
   * 配送指定判定
   * @param deliveryMethodCode - 受取方法
   * @returns boolean
   */
  private isShipping(deliveryMethodCode: string) {
    return deliveryMethodCode === DeliveryMethod.SHIPPING;
  }
  /**
   * 自店舗受取指定判定
   * @param deliveryMethodCode - 受取方法
   * @returns boolean
   */
  private isPickupAtOwnStore(deliveryMethodCode: string) {
    return deliveryMethodCode === DeliveryMethod.HAND_OVER || deliveryMethodCode === DeliveryMethod.PICKUP_LOCKER;
  }
  /**
   * 他店舗受取指定判定
   * @param deliveryMethodCode - 受取方法
   * @returns boolean
   */
  private isPickupAtOtherStore(deliveryMethodCode: string) {
    return (
      deliveryMethodCode === DeliveryMethod.HAND_OVER_AT_OTHER_STORE ||
      deliveryMethodCode === DeliveryMethod.PICKUP_LOCKER_AT_OTHER_STORE
    );
  }
}
