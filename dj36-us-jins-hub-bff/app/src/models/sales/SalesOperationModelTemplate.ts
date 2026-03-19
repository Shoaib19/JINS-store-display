import {
  postEyesightcombi,
  postEyepointmeasure,
} from "~/src/clients/bffValidators/bffValidatorsClient";
import { getCartInfo } from "~/src/clients/carts/cartsClient";
import { postDiameters } from "~/src/clients/diameters/diametersClient";
import {
  DpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { logger } from "~/src/logging/logger";
import { Cart } from "~/src/models/sales/Cart";
import { CartGetResponse } from "~/src/clients/carts/cartsClientTypes";
import { CartGetRequest } from "~/src/clients/carts/cartsClientTypes";
import {
  EyesightCombiPostRequest,
  EyesightCombiPostResponse,
  EyepointMeasurePostRequest,
  EyepointMeasurePostResponse,
} from "~/src/clients/bffValidators/bffValidatorsClientTypes";
import {
  DiametersPostRequest,
  DiametersPostResponse,
} from "~/src/clients/diameters/diametersClientTypes";
import {
  isPerspectiveTypeCode,
  perspectiveTypeCodeMap,
} from "~/src/models/sales/PerspectiveTypeCodeMap";
import { Suite, WarrantyExchange } from "~/src/models/sales/Suite";
import { sendApiRequest } from "~/src/utils/fetchService";
import {
  getSuccessRegisterResult,
  mergeSuccessRegisterResult,
  SalesOperationRegisterResult,
  SalesOperationStatus,
  SuccessRegisterResult,
} from "~/src/models/sales/SalesOperationRegisterResult";
import { COUNTRY_CODE_ALPHA2 } from "~/src/components/const";
import { ApiResponse } from "openapi-typescript-fetch";
import { ApplicationError } from "~/src/components/errors";
import { components } from "~/src/interfaces/root";

// カート登録・更新リクエスト
export type CartInfoPostRequest = components["schemas"]["CartInfoPostRequest"];
/**
 * カート登録・更新処理結果
 */ 
export type SalesOperationResult = {
  status: SalesOperationStatus;
  data: SalesOperationRegisterResult;
};

/** Verify関数型 */
export type VerifyFunction = (dpfmRequestInfo: DpfmRequestInfo, suite: Suite) => Promise<SuccessRegisterResult>;

/**
 * SaleOperationModel の基底クラス
 */
export abstract class SaleOperationModelTemplate {
  /**
   * 実行
   * @param dpfmRequestInfo
   * @param SalesRequest
   * @returns Promise<SalesOperationResult> 処理結果
   */
  public abstract execute(
    dpfmRequestInfo: DpfmRequestInfo,
    SalesRequest: CartInfoPostRequest,
  ): Promise<SalesOperationResult>;

  /**
   * カート情報取得
   * カート・カタログ取得APIを呼び出し、カートクラスを作成する。
   * @param dpfmRequestInfo
   * @param cartId
   * @param warrantyExchange
   * @returns Promise<Cart>
   */
  protected async getCart(
    dpfmRequestInfo: DpfmRequestInfo,
    cartId: number,
    warrantyExchange? : WarrantyExchange
  ): Promise<Cart> {
    // カート・カタログ取得API
    const cartInfoGetRequest: CartGetRequest = {
      cartId: cartId,
      deleteFlag: false,
    };
    const requestHeader = makeDpfmRequestHeader(dpfmRequestInfo);

    logger.info(`getCartInfoRequest: ${JSON.stringify(cartInfoGetRequest)}`);

    const apiResponse: ApiResponse<CartGetResponse> = await sendApiRequest(
      getCartInfo,
      cartInfoGetRequest,
      requestHeader,
      process.env.CART_SERVICE_JP,
    );
    logger.info(`getCartInfoResponse: ${JSON.stringify(apiResponse)}`);

    const cartResponse = apiResponse.data;
    const cart = new Cart(cartResponse, warrantyExchange);
    logger.info("Got the cart items. (No3.1)");
    return cart;
  }

  /**
   * 検証関数呼出
   * @param dpfmRequestInfo 
   * @param suite 
   * @param verifyFns 
   * @returns 
   */
  protected async verifyFnList(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
    verifyFns: VerifyFunction[],
  ): Promise<SuccessRegisterResult> {
    let result = getSuccessRegisterResult();
    for (const fn of verifyFns) {
      const verifyResult = await fn(dpfmRequestInfo, suite);
      result = mergeSuccessRegisterResult([result, verifyResult]);
    }
    return result;
  }

  /**
   * 度数組合せチェック
   *  呼出元で、度数情報が設定されていることを確認すること
   * @param dpfmRequestInfo
   * @param suite
   * @returns
   */
  protected async verifyEyesightCombi(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    const prescription = suite.getPrescription();
    const perspectiveTypeCode = prescription.getPerspectiveTypeCode();
    if (
      prescription.isDefined() &&
      isPerspectiveTypeCode(perspectiveTypeCode)
    ) {
      logger.info(`prescription: ${JSON.stringify(prescription)}`);
      const eyesightCombiPostRequest: EyesightCombiPostRequest = {
        sphericalPowerLeft: prescription.getSphLeft()!,
        astigmatismPrescriptionLeft: prescription.getCylLeft()!,
        addPowerLeft: prescription.getAddLeft(),
        sphericalPowerRight: prescription.getSphRight()!,
        astigmatismPrescriptionRight: prescription.getCylRight()!,
        addPowerRight: prescription.getAddRight(),
        lensPint:
          perspectiveTypeCodeMap[
            perspectiveTypeCode
          ].lensPint,
        salesColorNameId: suite.getItemId("salesColorName"),
        salesLensSpecId: suite.getItemId("salesLensSpec"),
        focusCategoryId: suite.getItemId("focusCategory"),
        progressiveCategoryId: suite.getItemId("progressiveCategory"),
        refractiveIndexNameId: suite.getItemId("refractiveIndexName"),
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
      };
      const requestHeader = makeDpfmRequestHeader(dpfmRequestInfo);

      logger.info(`postEyesightcombiRequest: ${JSON.stringify(eyesightCombiPostRequest)}`,);

      const apiResponse: ApiResponse<EyesightCombiPostResponse> = await sendApiRequest(
        postEyesightcombi,
        eyesightCombiPostRequest,
        requestHeader,
      );

      logger.info(`postEyesightcombiResponse: ${JSON.stringify(apiResponse)}`);

      const eyesightCombiPostResponse = apiResponse.data;
      if (
        eyesightCombiPostResponse.resCodeLeft != 0 ||
        eyesightCombiPostResponse.resCodeRight != 0
      ) {
        const messages: string[] = []
        if (eyesightCombiPostResponse.resCodeLeft == 1 || eyesightCombiPostResponse.resCodeRight == 1) {
          if (suite.isLensOptionRegistered()) {
            //BFF_USSTORESTAFF_0010
            messages.push(
              `(Set ${suite.getSuiteNo()}) No lenses matching the selected lens options and prescription information were found. Please review the lens options and prescription details.`,
            );
          } else {
            //BFF_USSTORESTAFF_0013
            messages.push(
              `(Set ${suite.getSuiteNo()}) No lenses were found match prescription information. Please check if there are any errors in the entered prescription.`,
            );
          }
        }

        if (
          eyesightCombiPostResponse.resCodeLeft == 2 ||
          eyesightCombiPostResponse.resCodeRight == 2
        ) {
          messages.push(`(Set ${suite.getSuiteNo()}) The add degree has not been specified. Please enter the add degree.`)
        }

        if (
          eyesightCombiPostResponse.resCodeLeft == 3 ||
          eyesightCombiPostResponse.resCodeRight == 3
        ) {
          messages.push(`(Set ${suite.getSuiteNo()}) Cumulative classification is not set.`)
        }

        if (
          eyesightCombiPostResponse.resCodeLeft == 4 ||
          eyesightCombiPostResponse.resCodeRight == 4
        ) {
          messages.push(`(Set ${suite.getSuiteNo()}) Please set the progressive classification to None.`)
        }
        throw new ApplicationError(
          messages
        );

      }
    }
    logger.info("Checked the lens power pairing. (No5.3)");
    return getSuccessRegisterResult();
  }

  /**
   * 径不足チェック
   *  呼出元で、度数情報・レンズオプションが設定されていることを確認すること
   *  フレームの商品コードが指定されていない場合はSuccessを返却する。
   * @param dpfmRequestInfo
   * @param suite
   * @returns
   */
  protected async verifyDiameterShortage(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    if (suite.getItemCode("frame") == undefined) {
      // フレームの商品コードが指定されていないときはチェックしない
      return getSuccessRegisterResult();
    }
    const prescription = suite.getPrescription();
    const perspectiveTypeCode = prescription.getPerspectiveTypeCode();
    if (
      prescription != undefined &&
      isPerspectiveTypeCode(perspectiveTypeCode)
    ) {
      logger.info(`prescription: ${JSON.stringify(prescription)}`);
      const requestHeader = makeDpfmRequestHeader(dpfmRequestInfo);
      const diametersPostRequest: DiametersPostRequest = {
        records: [
          {
            frameItemCode: suite.getItemCode("frame")??undefined,
            sphericalPowerLeft: prescription.getSphLeft()!,
            astigmatismPrescriptionLeft:
              prescription.getCylLeft()!,
            addPowerLeft: prescription.getAddLeft()!,
            pupillaryDistanceLeft: prescription.getPdLeft()!,
            eyePointLeft:
              prescription.getEyepointLeft(),
            //standardDiameterLeft: null, //NOTE: 9-11では未入力固定
            sphericalPowerRight: prescription.getSphRight()!,
            astigmatismPrescriptionRight:
              prescription.getCylRight()!,
            addPowerRight: prescription.getAddRight(),
            pupillaryDistanceRight: prescription.getPdRight()!,
            eyePointRight:
              prescription.getEyepointRight(),
            //standardDiameterRight: null, //NOTE: 9-11では未入力固定
            lensPint:
              perspectiveTypeCodeMap[
                perspectiveTypeCode
              ].lensPint,
            //refractiveIndex: undefined, // REVIEW: required????
            salesColorNameId: suite.getItemId("salesColorName")!,
            salesLensSpecId: suite.getItemId("salesLensSpec")!,
            focusCategoryId: suite.getItemId("focusCategory")!,
            progressiveCategoryId: suite.getItemId("progressiveCategory")!,
            refractiveIndexNameId: suite.getItemId("refractiveIndexName")!,
            countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
          },
        ],
      };

      logger.info(`postDiametersRequest: ${JSON.stringify(diametersPostRequest)}`,);

      const apiResponse: ApiResponse<DiametersPostResponse> = await sendApiRequest(
        postDiameters,
        diametersPostRequest,
        requestHeader,
      );

      logger.info(`postDiametersResponse: ${JSON.stringify(apiResponse)}`);

      const diametersPostResponse = apiResponse.data;
      //logger.info(`resData: ${JSON.stringify(apiResponse.data)}`);
      const diametersResult = diametersPostResponse.at(0);
      if (diametersResult == undefined) {
        // データがない場合
        throw new ApplicationError(
          `(Set ${suite.getSuiteNo()}) The data of lens diameter response is undefined.`
        );
      }
      if (diametersResult.resCode !== 0 && diametersResult.resCode !== 3) {
        // resCodeが「0:OK」以外
        if (diametersResult.lensLists?.some((lens) => lens.lensResCode === 1)) {
          // レンズ処理結果コード(lensResCode)に「1:径不足」が含まれている
          // BFF_USSTORESTAFF_0019
          const messages: string[] = [];
          diametersResult.lensLists
            ?.filter((lens) => lens.lensResCode === 1)
            .forEach((lens) => {
              // 径不足のレンズの左右組み合わせでメッセージを変える。
              if (lens.lensResCodeRight === 1 && lens.lensResCodeLeft === 1) {
                messages.push(
                  `(Set ${suite.getSuiteNo()}) The registered lens is too small in diameter for this frame. Short by ${lens.lensShortageWidthRight}mm on the right, ${lens.lensShortageWidthLeft}mm on the left.`,
                );
              } else if (lens.lensResCodeRight === 1) {
                messages.push(
                  `(Set ${suite.getSuiteNo()}) The registered lens is too small in diameter for this frame. Short by ${lens.lensShortageWidthRight}mm on the right.`,
                );
              } else if (lens.lensResCodeLeft === 1) {
                messages.push(
                  `(Set ${suite.getSuiteNo()}) The registered lens is too small in diameter for this frame. Short by ${lens.lensShortageWidthLeft}mm on the left.`,
                );
              }
            });
          return getSuccessRegisterResult(messages);
        } else {
          // 径不足が含まれていない
          // BFF_USSTORESTAFF_0011
          throw new ApplicationError(
            `(Set ${suite.getSuiteNo()}) The lens diameter is insufficient. Please reselect the frame or lens option.`);
        }
      }
    }
    logger.info("Checked the lens diameters. (No5.3)");
    return getSuccessRegisterResult();
  }

  /**
   * アイポイントチェック
   *  呼出元で、度数情報・レンズオプションが設定されていることを確認すること
   * @param dpfmRequestInfo
   * @param suite
   * @returns
   */
  protected async verifyEyePoint(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    const prescription = suite.getPrescription();
    const perspectiveTypeCode = prescription.getPerspectiveTypeCode();
    if (
      prescription != undefined &&
      isPerspectiveTypeCode(perspectiveTypeCode)
    ) {
      logger.info(`prescription: ${JSON.stringify(prescription)}`);
      const eyepointMeasurePostRequest: EyepointMeasurePostRequest = {
        sphericalPowerLeft: prescription.getSphLeft()!,
        astigmatismPrescriptionLeft: prescription.getCylLeft()!,
        addPowerLeft: prescription.getAddLeft(),
        eyePointLeft: prescription.getEyepointLeft(),
        sphericalPowerRight: prescription.getSphRight()!,
        astigmatismPrescriptionRight: prescription.getCylRight()!,
        addPowerRight: prescription.getAddRight(),
        eyePointRight: prescription.getEyepointRight(),
        lensPint:
          perspectiveTypeCodeMap[
            perspectiveTypeCode
          ].lensPint,
        salesColorNameId: suite.getItemId("salesColorName")!,
        salesLensSpecId: suite.getItemId("salesLensSpec")!,
        focusCategoryId: suite.getItemId("focusCategory")!,
        progressiveCategoryId: suite.getItemId("progressiveCategory")!,
        refractiveIndexNameId: suite.getItemId("refractiveIndexName")!,
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
      };

      const requestHeader = makeDpfmRequestHeader(dpfmRequestInfo);

      logger.info(`postEyepointmeasureRequest: ${JSON.stringify(eyepointMeasurePostRequest)}`,);

      const apiResponse: ApiResponse<EyepointMeasurePostResponse> = await sendApiRequest(
        postEyepointmeasure,
        eyepointMeasurePostRequest,
        requestHeader,
      );

      logger.info(`postEyepointmeasureResponse: ${JSON.stringify(apiResponse)}`);

      const eyepointMeasurePostResponse = apiResponse.data;
      if (
        eyepointMeasurePostResponse.resCodeLeft != 0 ||
        eyepointMeasurePostResponse.resCodeRight != 0
      ) {
        const messages: string[] = [];

        if (
          eyepointMeasurePostResponse.resCodeLeft == 1 ||
          eyepointMeasurePostResponse.resCodeRight == 1
        ) {
          messages.push(`(Set ${suite.getSuiteNo()}) The eye point has not been specified. Please enter the eye point.`)
        }

        if (
          eyepointMeasurePostResponse.resCodeLeft == 2 ||
          eyepointMeasurePostResponse.resCodeRight == 2
        ) {
          messages.push(`(Set ${suite.getSuiteNo()}) The add degree has not been specified. Please enter the add degree.`)
        }

        if (
          eyepointMeasurePostResponse.resCodeLeft == 3 ||
          eyepointMeasurePostResponse.resCodeRight == 3
        ) {
          messages.push(`(Set ${suite.getSuiteNo()}) Cumulative classification is not set.`)
        }

        if (
          eyepointMeasurePostResponse.resCodeLeft == 4 ||
          eyepointMeasurePostResponse.resCodeRight == 4
        ) {
          messages.push(`(Set ${suite.getSuiteNo()}) Please set the progressive classification to None.`)
        }

        //NOTE: BFF_USSTORESTAFF_0012
        throw new ApplicationError(
          messages
        );
      }
    }
    logger.info("Checked the lens eye point measure. (No5.3)");
    return getSuccessRegisterResult();
  }

  /**
   * 店舗在庫照会(フレーム)
   *  商品ID指定なし(カートに入れていない)→在庫あり
   *  商品ID指定あり(カートに入っている)　→在庫切れの商品がないなら在庫あり
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SuccessRegisterResult>
   */
  protected async checkFrameStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    const frameItemCode = suite.getItemCode("frame");
    if (
      frameItemCode != undefined &&
      suite.needFrameStock() &&
      (await suite.hasStockInStore(dpfmRequestInfo, [frameItemCode])) == false
    ) {
      //NOTE: future, will not occur the error. (search the processable store)
      throw new ApplicationError(
        `(Set ${suite.getSuiteNo()}) The frame selected is out of stock. Please select a different item.`);
    }
    logger.info("Inquiry about store inventory of frame. (No6.2)");
    return getSuccessRegisterResult();
  }

  /**
   * 店舗在庫照会(ケース)
   *  商品ID指定なし(カートに入れていない)→在庫あり
   *  商品ID指定あり(カートに入っている)　→在庫切れの商品がないなら在庫あり
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SuccessRegisterResult>
   */
  protected async checkCaseStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    const caseItemCode = suite.getItemCode("case");
    if (
      caseItemCode != undefined &&
      suite.needCaseStock() &&
      (await suite.hasStockInStore(dpfmRequestInfo, [caseItemCode])) == false
    ) {
      //NOTE: future, will not occur the error. (search the processable store)
      throw new ApplicationError(
        `(Set ${suite.getSuiteNo()}) The glasses case selected is out of stock. Please select a different item.`);
    }
    logger.info("Inquiry about store inventory of case. (No6.2)");
    return getSuccessRegisterResult();
  }
  
  /**
   * 店舗在庫照会(セリート)
   *  商品ID指定なし(カートに入れていない)→在庫あり
   *  商品ID指定あり(カートに入っている)　→在庫切れの商品がないなら在庫あり
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SuccessRegisterResult>
   */
  protected async checkCerritoStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    const cerritoItemCode = suite.getItemCode("cerrito");
    if (
      cerritoItemCode != undefined &&
      suite.needCerritoStock() &&
      (await suite.hasStockInStore(dpfmRequestInfo, [cerritoItemCode])) == false
    ) {
      //NOTE: future, will not occur the error. (search the processable store)
      throw new ApplicationError(
        `(Set ${suite.getSuiteNo()}) The cerrito selected is out of stock. Please select a different item.`);
    }
    logger.info("Inquiry about store inventory of case. (No6.2)");
    return getSuccessRegisterResult();
  }

  /**
   * 店舗在庫照会（レンズ）
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SuccessRegisterResult>
   */
  protected async checkLensStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SuccessRegisterResult> {
    // if(suite.needLensStock() ) {
    //   // 6.3 レンズの在庫照会
    //   const lensItemCodes = [
    //     await suite.getLensItemCode(dpfmRequestInfo, "Right"),
    //     await suite.getLensItemCode(dpfmRequestInfo, "Left"),
    //   ];
    //   if (lensItemCodes.some((itemCode) => itemCode == undefined)) {
    //     return getSuccessRegisterResult(
    //       `(Set ${suite.getSuiteNo()}) The lens specified cannot be picked up today.`,
    //     );
    //   }
    //   const lensItemCodesFiltered = lensItemCodes.filter(
    //     (itemCode): itemCode is string => itemCode != undefined,
    //   );

    //   if (
    //     (await suite.hasStockInStore(dpfmRequestInfo, lensItemCodesFiltered)) ==
    //     false
    //   ) {
    //     //NOTE: future, will not occur the error. (search the processable store)
    //     return getSuccessRegisterResult(
    //       `(Set ${suite.getSuiteNo()}) The lens specified cannot be picked up today.`,
    //     );
    //   }
    // }
    logger.info("Lens inventory inquiry. (No6.3)");
    return getSuccessRegisterResult();
  }
}
