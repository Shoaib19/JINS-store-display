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
import { CartResponse } from "~/src/clients/carts/cartsClientTypes";
import { findCartQuery } from "~/src/clients/carts/cartsClientTypes";
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
import { Suite } from "~/src/models/sales/Suite";
import { sendApiRequest } from "~/src/utils/fetchService";
import {
  getRegistResult,
  getSuccessRegistResult,
  mergeRegistResult,
  SalesOperationRegistResult,
} from "~/src/models/sales/SalesOperationRegistResult";
import { WarrantyExchange } from "~/src/compornents/rootType";
import { COUNTRY_CODE_ALPHA2 } from "~/src/compornents/const";

// 処理結果
export type SalesOperationResult = {
  status: number;
  data: any;
};

/**
 * SaleOperationModel の基底クラス
 */

export abstract class SaleOperationModelTemplate {
  /**
   * 実行
   * @param dpfmRequestInfo
   * @param SalesRequest
   * @return Promise<SalesOperationResult> 処理結果
   */
  public abstract execute(
    dpfmRequestInfo: DpfmRequestInfo,
    SalesRequest: any,
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
    const cartInfoGetRequest: findCartQuery = {
      cartId: cartId,
      deleteFlag: false,
    };
    const requestHeader = makeDpfmRequestHeader(dpfmRequestInfo);
    logger.info(`cartInfoGetRequest: ${JSON.stringify(cartInfoGetRequest)}`);
    const apiResponse = await sendApiRequest(
      getCartInfo,
      cartInfoGetRequest,
      requestHeader,
      process.env.CART_SERVICE_JP,
    );
    logger.info(`cartInfoGetResponse: ${JSON.stringify(apiResponse)}`);

    if (!apiResponse.ok) {
      throw apiResponse;
    }
    const cartResponse: CartResponse = apiResponse.data;
    const cart = new Cart(cartResponse, warrantyExchange);
    logger.info("Got the cart items. (No3.1)");
    return cart;
  }

  protected async verifyFnList(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
    verifyFns: ((
      dpfmRequestInfo: DpfmRequestInfo,
      suite: Suite,
    ) => Promise<SalesOperationRegistResult>)[],
  ) {
    let result = getSuccessRegistResult();
    for (const fn of verifyFns) {
      const verifyResult = await fn(dpfmRequestInfo, suite);
      if (verifyResult.status == 200) {
        result = mergeRegistResult([result, verifyResult]);
      } else {
        return verifyResult;
      }
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
  protected async verifyEeyesightCombi(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SalesOperationRegistResult> {
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
      logger.info(
        `eyesightCombiPostRequest: ${JSON.stringify(eyesightCombiPostRequest)}`,
      );
      const apiResponse = await sendApiRequest(
        postEyesightcombi,
        eyesightCombiPostRequest,
        requestHeader,
      );
      logger.info(`eyesightCombiPostResponse: ${JSON.stringify(apiResponse)}`);
      if (!apiResponse.ok) {
        throw apiResponse;
      }

      const eyesightCombiPostResponse: EyesightCombiPostResponse =
        apiResponse.data;
      if (
        eyesightCombiPostResponse.resCodeLeft != 0 ||
        eyesightCombiPostResponse.resCodeRight != 0
      ) {
        if (suite.isLensOptionRegisterd()) {
          //BFF_USSTORESSTAFF_0010
          return getRegistResult(
            400,
            `(Suite ${suite.getSuiteNo()}) No lenses matching the specified options lens and prescription information were found. Please review the options lens and prescription details.`,
          );
        } else {
          //BFF_USSTORESSTAFF_0013
          return getRegistResult(
            400,
            `(Suite ${suite.getSuiteNo()}) No lenses were found match prescription infomation. Please check if there are any errors in the entered prescription.`,
          );
        }
      }
    }
    logger.info("Checked the lens power pairing. (No5.3)");
    return getSuccessRegistResult();
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
  ): Promise<SalesOperationRegistResult> {
    if (suite.getItemCode("frame") == undefined) {
      // フレームの商品コードが指定されていないときはチェックしない
      return getSuccessRegistResult();
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
      logger.info(
        `diametersPostRequest: ${JSON.stringify(diametersPostRequest)}`,
      );
      const apiResponse = await sendApiRequest(
        postDiameters,
        diametersPostRequest,
        requestHeader,
      );
      logger.info(`diametersPostResponse: ${JSON.stringify(apiResponse)}`);
      if (!apiResponse.ok) {
        throw apiResponse;
      }

      const diametersPostResponse: DiametersPostResponse = apiResponse.data;
      logger.info(`resData: ${JSON.stringify(apiResponse.data)}`);
      const diametersResult = diametersPostResponse.at(0);
      if (diametersResult == undefined) {
        // データがない場合
        return getRegistResult(
          400,
          `(Suite ${suite.getSuiteNo()}) The data of lens diameter response is undefined.`,
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
                  `(Suite ${suite.getSuiteNo()}) The registered lens is too small in diameter for this frame. Short by ${lens.lensShortageWidthRight}mm on the right, ${lens.lensShortageWidthLeft}mm on the left.`,
                );
              } else if (lens.lensResCodeRight === 1) {
                messages.push(
                  `(Suite ${suite.getSuiteNo()}) The registered lens is too small in diameter for this frame. Short by ${lens.lensShortageWidthRight}mm on the right.`,
                );
              } else if (lens.lensResCodeLeft === 1) {
                messages.push(
                  `(Suite ${suite.getSuiteNo()}) The registered lens is too small in diameter for this frame. Short by ${lens.lensShortageWidthLeft}mm on the left.`,
                );
              }
            });
          return getRegistResult(200, messages);
        } else {
          // 径不足が含まれていない
          // BFF_USSTORESTAFF_0011
          return getRegistResult(
            400,
            `(Suite ${suite.getSuiteNo()}) The lens diameter is insufficient. Please reselect the frame or lens option.`,
          );
        }
      }
    }
    logger.info("Checked the lens diameters. (No5.3)");
    return getSuccessRegistResult();
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
  ): Promise<SalesOperationRegistResult> {
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
      logger.info(
        `eyepointMeasurePostRequest: ${JSON.stringify(eyepointMeasurePostRequest)}`,
      );
      const apiResponse = await sendApiRequest(
        postEyepointmeasure,
        eyepointMeasurePostRequest,
        requestHeader,
      );
      logger.info(`eyepointResponse: ${JSON.stringify(apiResponse)}`);
      if (!apiResponse.ok) {
        throw apiResponse;
      }
      const eyepointMeasurePostResponse: EyepointMeasurePostResponse =
        apiResponse.data;
      if (
        eyepointMeasurePostResponse.resCodeLeft != 0 ||
        eyepointMeasurePostResponse.resCodeRight != 0
      ) {
        const messages: string[] = [];

        if (
          eyepointMeasurePostResponse.resCodeLeft == 1 ||
          eyepointMeasurePostResponse.resCodeRight == 1
        ) {
          messages.push(`(Suite ${suite.getSuiteNo()}) The eye point has not been specified. Please enter the eye point.`)
        }

        if (
          eyepointMeasurePostResponse.resCodeLeft == 2 ||
          eyepointMeasurePostResponse.resCodeRight == 2
        ) {
          messages.push(`(Suite ${suite.getSuiteNo()}) The add degree has not been specified. Please enter the add degree.`)
        }

        if (
          eyepointMeasurePostResponse.resCodeLeft == 3 ||
          eyepointMeasurePostResponse.resCodeRight == 3
        ) {
          messages.push(`(Suite ${suite.getSuiteNo()}) Cumulative classification is not set.`)
        }

        if (
          eyepointMeasurePostResponse.resCodeLeft == 4 ||
          eyepointMeasurePostResponse.resCodeRight == 4
        ) {
          messages.push(`(Suite ${suite.getSuiteNo()}) Please set the progressive classification to None.`)
        }

        //NOTE: BFF_USSTORESTAFF_0012
        return getRegistResult(
          400,
          messages,
        );
      }
    }
    logger.info("Checked the lens eye point measure. (No5.3)");
    return getSuccessRegistResult();
  }

  /**
   * 店舗在庫照会(フレーム)
   *  商品ID指定なし(カートに入れていない)→在庫あり
   *  商品ID指定あり(カートに入っている)　→在庫切れの商品がないなら在庫あり
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SalesOperationResult>
   */
  protected async checkFrameStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SalesOperationRegistResult> {
    const frameItemCode = suite.getItemCode("frame");
    if (
      frameItemCode != undefined &&
      suite.needFrameStock() &&
      (await suite.hasStockInStore(dpfmRequestInfo, [frameItemCode])) == false
    ) {
      //NOTE: future, will not occur the error. (search the processable store)
      return getRegistResult(
        400,
        `(Suite ${suite.getSuiteNo()}) The frame selected is out of stock. Please select a different item.`,
      );
    }
    logger.info("Inquiry about store inventory of frame. (No6.2)");
    return getSuccessRegistResult();
  }

  /**
   * 店舗在庫照会(ケース)
   *  商品ID指定なし(カートに入れていない)→在庫あり
   *  商品ID指定あり(カートに入っている)　→在庫切れの商品がないなら在庫あり
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SalesOperationResult>
   */
  protected async checkCaseStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SalesOperationRegistResult> {
    const caseItemCode = suite.getItemCode("case");
    if (
      caseItemCode != undefined &&
      suite.needCaseStock() &&
      (await suite.hasStockInStore(dpfmRequestInfo, [caseItemCode])) == false
    ) {
      //NOTE: future, will not occur the error. (search the processable store)
      return getRegistResult(
        400,
        `(Suite ${suite.getSuiteNo()}) The glasses case selected is out of stock. Please select a different item.`,
      );
    }
    logger.info("Inquiry about store inventory of case. (No6.2)");
    return getSuccessRegistResult();
  }

  /**
   * 店舗在庫照会（レンズ）
   * @param dpfmRequestInfo
   * @param suite
   * @returns Promise<SalesOperationResult>
   */
  protected async checkLensStockInStore(
    dpfmRequestInfo: DpfmRequestInfo,
    suite: Suite,
  ): Promise<SalesOperationRegistResult> {
    if(suite.needLensStock() ) {
      // 6.3 レンズの在庫照会
      const lensItemCodes = [
        await suite.getLensItemCode(dpfmRequestInfo, "Right"),
        await suite.getLensItemCode(dpfmRequestInfo, "Left"),
      ];
      if (lensItemCodes.some((itemCode) => itemCode == undefined)) {
        return getRegistResult(
          200,
          `(Suite ${suite.getSuiteNo()}) The lens specified cannot be picked up today.`,
        );
      }
      const lensItemCodesFilterd = lensItemCodes.filter(
        (itemCode): itemCode is string => itemCode != undefined,
      );

      if (
        (await suite.hasStockInStore(dpfmRequestInfo, lensItemCodesFilterd)) ==
        false
      ) {
        //NOTE: future, will not occur the error. (search the processable store)
        return getRegistResult(
          200,
          `(Suite ${suite.getSuiteNo()}) The lens specified cannot be picked up today.`,
        );
      }
    }
    logger.info("Lens inventory inquiry. (No6.3)");
    return getSuccessRegistResult();
  }
}
