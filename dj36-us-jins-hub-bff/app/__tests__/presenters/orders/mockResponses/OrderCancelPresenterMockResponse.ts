// sales-order 注文詳細取得APIレスポンス
export const getOrderByReceptionNumberResponses = {
  // ケース１：正常系
  case1: {
    ok: true,
    status: 200,
    data: {
      cartId: 0,
      channel: "string",
      countryCodeAlpha2: "US",
      currencyCode: "USD",
      customerId: "string",
      customerName: "string",
      discountLines: [],
      feeLines: [],
      glassLines: [
        {
          glassLineCode:"example",
          itemGroupCode: "250114US000011-1",
        },
      ],
      orderCode: "example",
      orderDate: "2025-01-14",
      orderStatus: "ORDER_PAYMENT_PROCESSING",
      payments: [],
      phoneNumber: "string",
      receptionDate: "2025-01-14",
      receptionNumber: "250114US000011",
      receptionStoreCode: "83005",
      receptionStoreId: 0,
      receptionStoreName: "string",
      registerPrincipal: "example",
      registerTimestamp: 0,
      taxLines: [],
      totalAmount: 0,
      totalDiscountAmount: 0,
      totalFeeAmount: 0,
      totalListAmount: 0,
      totalSellingAmount: 0,
      totalTaxAmount: 0,
      updatePrincipal: "example",
      updateTimestamp: 0,
      version: 1
    }
  },
  // ケース2：メガネ行コードなし
  case2: {
    ok: true,
    status: 200,
    data: {
      cartId: 0,
      channel: "string",
      countryCodeAlpha2: "US",
      currencyCode: "USD",
      customerId: "string",
      customerName: "string",
      discountLines: [],
      feeLines: [],
      glassLines: [
        {
          itemGroupCode: "250114US000011-1",
        },
      ],
      orderCode: "example",
      orderDate: "2025-01-14",
      orderStatus: "ORDER_PAYMENT_PROCESSING",
      payments: [],
      phoneNumber: "string",
      receptionDate: "2025-01-14",
      receptionNumber: "250114US000011",
      receptionStoreCode: "83005",
      receptionStoreId: 0,
      receptionStoreName: "string",
      registerPrincipal: "example",
      registerTimestamp: 0,
      taxLines: [],
      totalAmount: 0,
      totalDiscountAmount: 0,
      totalFeeAmount: 0,
      totalListAmount: 0,
      totalSellingAmount: 0,
      totalTaxAmount: 0,
      updatePrincipal: "example",
      updateTimestamp: 0,
      version: 1
    }
  },
  // ケース3：異常系ステータス５００
  case3: {
    ok: false,
    status: 500,
    data: {}
  },
    // ケース4：正常系_必須項目のみ
    case4: {
      ok: true,
      status: 200,
      data: {
        orderCode: "example",
        orderDate: "2025-01-14",
        orderStatus: "ORDER_PAYMENT_PROCESSING",
        registerPrincipal: "example",
        registerTimestamp: 0,
        updatePrincipal: "example",
        updateTimestamp: 0,
        version: 1
      }
    },
}


//注文キャンセルAPI
export const postOrderCancelResponses = {
  // ケース１：正常系
  case1: {
    ok: true,
    status: 200,
    data: {
      "order": {
        "cartId": 0,
        "channel": "string",
        "countryCodeAlpha2": "string",
        "currencyCode": "string",
        "customerId": "string",
        "customerName": "string",
        "discountLines": [],
        "feeLines": [],
        "glassLines": [],
        "orderCode": "string",
        "orderDate": "string",
        "orderStatus": "string",
        "payments": [],
        "phoneNumber": "string",
        "receptionDate": "string",
        "receptionNumber": "string",
        "receptionStoreCode": "string",
        "receptionStoreId": 0,
        "receptionStoreName": "string",
        "registerPrincipal": "string",
        "registerTimestamp": 0,
        "returns": [],
        "taxLines": [],
        "totalAmount": 0,
        "totalDiscountAmount": 0,
        "totalFeeAmount": 0,
        "totalListAmount": 0,
        "totalSellingAmount": 0,
        "totalTaxAmount": 0,
        "updatePrincipal": "string",
        "updateTimestamp": 0,
        "version": 0
      }
    }
  },
    // ケース2：異常系
    case2: {
      ok: false,
      status: 500,
      data: {
        code: "COM_0002",
        message: "Specified data not found.",
      }
    },
      // ケース3：正常系_必須項目のみ
  case3: {
    ok: true,
    status: 200,
    data: {
    }
  },
}


// 注文返品API
export const postReturnsResponses = {
  // ケース１：正常系
  case1: {
    ok: true,
    status: 200,
    data: {
      "customerId": "CUSTOMER001",
      "customerName": "山田 太郎",
      "glassLineCode": "GLASS001",
      "orderCode": "ORDER001",
      "returnDateTime": "2025-01-15T12:34:56",
      "returnReasonCode": "91",
      "returnStoreCode": "STORE001"
    }
  },
  // ケース2：異常系
  case2: {
    ok: false,
    status: 500,
    data: {
      code: "COM_0002",
      message: "Specified data not found.",
    }
  },
}