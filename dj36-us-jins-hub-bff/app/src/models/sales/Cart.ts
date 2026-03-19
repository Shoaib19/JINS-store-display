import { postCalculateAmount } from "~/src/clients/oms/omsClient";
import {
  DpfmRequestInfo,
  makeDpfmRequestHeader,
} from "~/src/utils/makeRequestHeader";
import { logger } from "~/src/logging/logger";
import { CartGetResponse, Cart as CartType } from "~/src/clients/carts/cartsClientTypes";
import { Suite, WarrantyExchange } from "~/src/models/sales/Suite";
import { sendApiRequest } from "~/src/utils/fetchService";
import {
  CalculateAmountGlassLinesRequest,
  CalculateAmountResponse,
} from "~/src/clients/oms/omsClientTypes";
import { COUNTRY_CODE_ALPHA2, CURRENCY_CODE, DEFAULT_CALCULATION_PATTERN_CODE } from "~/src/components/const";
import { fixSystemDate } from "~/src/utils/fixDatetime";
import { getStoreTimeZone } from "~/src/utils/getTimeZone";
import { ApiResponse } from "openapi-typescript-fetch";

// （カート）カートクラスで保持する形式
type CartExtendsItemGroups = Omit<CartType, "itemGroups">;

/**
 * カート
 */
export class Cart {
  cart: CartExtendsItemGroups;
  suites: Suite[] = [];

  /**
   * コンストラクタ
   * @param cartResponse
   * @param warrantyExchange
   */
  constructor(cartResponse: CartGetResponse, warrantyExchange? : WarrantyExchange) {
    this.cart = {
      ...cartResponse.cart,
    };
    if (cartResponse.cart?.itemGroups != undefined) {
      this.suites = cartResponse.cart?.itemGroups.map(
        (itemGroup) => new Suite(itemGroup, warrantyExchange),
      );
    }
  }

  /**
   * 価格更新
   * @param dpfmRequestInfo
   * @returns Promise<void>
   */
  public async updateAmount(dpfmRequestInfo: DpfmRequestInfo): Promise<void> {
    // 7.2 価格・税計算APIの呼出し
    const requestHeader: Headers = makeDpfmRequestHeader(dpfmRequestInfo);
    // 価格・税計算APIが商品なしのSuiteがあるとエラーになるので商品有無で切り分ける
    const calcSuite = this.suites.filter((suite) => suite.hasItems());
    const noItemSuite = this.suites.filter((suite) => !suite.hasItems());
    if (calcSuite.length > 0) {
      const calculateAmountPostRequest: CalculateAmountGlassLinesRequest = {
        calculationBaseDate: fixSystemDate(getStoreTimeZone(dpfmRequestInfo.bffRequest)),
        countryCodeAlpha2: COUNTRY_CODE_ALPHA2,
        currencyCode: CURRENCY_CODE,
        calculationPatternCode : DEFAULT_CALCULATION_PATTERN_CODE,
        glassLines: calcSuite.map((suite) =>
          suite.toCalculateAmountGlassLinesWriteDto(),
        ),
        storeCode: this.cart.receptionStoreCode!,
      };
      logger.info(
        `getCalculateAmountRequest: ${JSON.stringify(calculateAmountPostRequest)}`,
      );
      const apiResponse: ApiResponse<CalculateAmountResponse> = await sendApiRequest(
        postCalculateAmount,
        calculateAmountPostRequest,
        requestHeader,
      );
      logger.info(`getCalculateAmountResponse: ${JSON.stringify(apiResponse)}`);

      const calculateAmountReadDto = apiResponse.data;
      // 7.3 価格更新
      this.cart.subtotal = calculateAmountReadDto?.totalSellingAmount ?? 0;
      this.cart.totalDiscountPrice = 0; //TODO: get discount price
      this.cart.totalTaxPrice = calculateAmountReadDto?.totalTaxAmount ?? 0;
      this.cart.totalSalesPrice = calculateAmountReadDto?.totalAmount ?? 0;

      // itemGroup
      const glassLines = calculateAmountReadDto.glassLines;
      if (glassLines != undefined) {
        calcSuite.forEach((suite) => {
          suite.updateAmount(
            glassLines
              .filter(
                (glassLine) =>
                  glassLine.glassLineCode === suite.itemGroup.itemGroupCode,
              )
              .at(0),
          );
        });
      }
    } else {
      this.cart.subtotal = 0;
      this.cart.totalDiscountPrice = 0;
      this.cart.totalTaxPrice = 0;
      this.cart.totalSalesPrice = 0;
    }
    // 商品なしのSuiteは価格情報なしで更新
    noItemSuite.forEach((suite) => suite.updateAmount(undefined));
  }
}
