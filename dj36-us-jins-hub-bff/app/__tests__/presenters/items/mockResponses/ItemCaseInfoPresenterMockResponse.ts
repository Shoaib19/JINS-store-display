// カートカタログ取得APIレスポンス
export const findCartResponses = {
  // ケース１：正常系データ有
  case1 : {
    ok: true,
    status: 200,
    data: {
      cart: {
        cartId: 123,
        receptionNumber: "241031US000001",
        deletedFlag: 0,
        receptionStoreId: 111,
        receptionStoreCode: "83005",
        itemGroups: [
          {
            lineitemGroupId: 1111110,
            cartId: 123,
            caseItemCode:"MRF-23A-011-128",
            itemGroupCode: "241031US000001-1",
            lopFocusCategoryItemId: 10000001,
            lopProgressiveCategoryItemId: 20000001,
            lopRefractiveIndexNameItemId: 30000001,
          }, {
            lineitemGroupId: 1111111,
            cartId: 123,
            itemGroupCode: "241031US000001-1",
            caseItemCode:"MRF-23A-011-129",
            lopFocusCategoryItemId: 10000002,
            lopProgressiveCategoryItemId: 20000002,
            lopRefractiveIndexNameItemId: 30000002,
          }, {
            lineitemGroupId: 1111112,
            cartId: 123,
            itemGroupCode: "241031US000001-3",
            lopFocusCategoryItemId: 10000003,
            lopProgressiveCategoryItemId: 20000003,
            lopRefractiveIndexNameItemId: 30000003,
          },
        ]
      }
    }
  },
  // ケース２：正常系データ無
  case2: {
    ok: true,
    status: 200,
    data: {
      cart: null
    }
  },
  // ケース3：異常系（status:500）
  case3: {
    ok: false,
    status: 500,
    data: {
      code: "COM_0000",
      message: "Unexpected error occurred.",
    }
  },
  // ケース4：異常系（status:404）
  case4: {
    ok: false,
    status: 404,
    data: {
      "code": "COM_0002",
      "message": "Specified data not found."
    }
  },
    // ケース5：正常系_カートプロパティのみ
    case5: {
      ok: true,
      status: 200,
      data: {
        cart: {
        }
      }
    },
};

// 商品マスタ検索API
export const getItemsResponses = {
  // ケース１：正常系データ有
  case1 : {
    ok: true,
    status: 200,
    data: {
      "offset": 0,
      "count": 1,
      "limit": 100000,
      "totalResults": 1,
      "hasMore": false,
      "records": [
        {
          "itemId": 1000001,
          "itemCode": "MRF-23A-011-128",
          "itemName": "Basic Matte",
          "itemNameKana": "MRF-23A-011-128",
          "itemNameEnglish": "Basic Matte",
          "itemNameSimplified": "Basic Matte",
          "itemNameTraditional": "Basic Matte",
          "itemDivision": "1",
          "standardPlanName": null,
          "gtin": null,
          "itemDeploymentStartDate": "2013-12-31T15:00:00",
          "itemDeploymentEndDate": "2099-12-31T00:00:00",
          "storeDisplayFlag": "0",
          "price": 100.00,
          "priceUS": 100.10,
          "singleItemSalesFlag": 0,
          "ecSalesFlag": 1,
          "storeSalesFlag": 1,
          "salesItemName": "Basic Matte",
          "deletedFlag": 0,
          "updatedUserId": "Step2_test",
          "updatedDatetime": "2024-11-12T05:01:00",
          "itemSalesByCountries": [
            {
              "countryId": 1143430,
              "countryCodeAlpha2": "US",
              "countryCodeAlpha3": "USA",
              "countryName": "アメリカ合衆国"
            }
          ]
        },
        {
          "itemId": 1000002,
          "itemCode": "MRF-23A-011-129",
          "itemName": "Basic Matte",
          "itemNameKana": "MRF-23A-011-129",
          "itemNameEnglish": "Basic Matte",
          "itemNameSimplified": "Basic Matte",
          "itemNameTraditional": "Basic Matte",
          "itemDivision": "2",
          "standardPlanName": null,
          "gtin": null,
          "itemDeploymentStartDate": "2013-12-31T15:00:00",
          "itemDeploymentEndDate": "2099-12-31T00:00:00",
          "storeDisplayFlag": "0",
          "price": 100.00,
          "priceUS": 100.20,
          "singleItemSalesFlag": 0,
          "ecSalesFlag": 1,
          "storeSalesFlag": 1,
          "salesItemName": "Basic Matte",
          "deletedFlag": 0,
          "updatedUserId": "Step2_test",
          "updatedDatetime": "2024-11-12T05:01:00",
          "itemSalesByCountries": [
            {
              "countryId": 1143430,
              "countryCodeAlpha2": "US",
              "countryCodeAlpha3": "USA",
              "countryName": "アメリカ合衆国"
            }
          ]
        },
        {
          "itemId": 1000003,
          "itemCode": "MRF-23A-011-130",
          "itemName": "Basic Matte",
          "itemNameKana": "MRF-23A-011-130",
          "itemNameEnglish": "Basic Matte",
          "itemNameSimplified": "Basic Matte",
          "itemNameTraditional": "Basic Matte",
          "itemDivision": "1",
          "standardPlanName": null,
          "gtin": null,
          "itemDeploymentStartDate": "2013-12-31T15:00:00",
          "itemDeploymentEndDate": "2099-12-31T00:00:00",
          "storeDisplayFlag": "0",
          "price": 100.00,
          "priceUS": 100.30,
          "singleItemSalesFlag": 0,
          "ecSalesFlag": 1,
          "storeSalesFlag": 1,
          "salesItemName": "Basic Matte",
          "deletedFlag": 0,
          "updatedUserId": "Step2_test",
          "updatedDatetime": "2024-11-12T05:01:00",
          "itemSalesByCountries": [
            {
              "countryId": 1143430,
              "countryCodeAlpha2": "US",
              "countryCodeAlpha3": "USA",
              "countryName": "アメリカ合衆国"
            }
          ]
        },
      ]
    }
  },
  // ケース２：正常系データ無
  case2: {
    ok: true,
    status: 200,
    data: {
      "offset": 0,
      "count": 0,
      "limit": 100000,
      "totalResults": 0,
      "hasMore": false,
      "records": [],
    }
  },
  // ケース3：異常系（status:500）
  case3: {
    ok: false,
    status: 500,
    data: {
      code: "COM_0000",
      message: "Unexpected error occurred.",
    }
  },
}

// 在庫検索API
export const inventoriesGetResponses = {
  case1: {
    ok: true,
    status: 200,
    data: {
        "limit": 20,
        "offset": 0,
        "count": 20,
        "totalResults": 10000,
        "hasMore": true,
        "records": [
          {
            "locationId": 100,
            "locationCode": "83001",
            "locationName": "Valley Fair",
            "itemId": 1000001,
            "itemCode": "MRF-23A-011-128",
            "itemName": "MRF-23A-011-128",
            "salesStatusId": 2,
            "salesStatusName": "For sale",
            "itemStatusId": 2,
            "itemStatusName": "Good quality item",
            "inventoryQuantity": 20,
            "updatedUserId": "inventoryUser",
            "updatedDatetime": "2024-09-13T00:00:00",
            "optimisticLockVerNo": 1
          },
          {
            "locationId": 101,
            "locationCode": "83002",
            "locationName": "Valley Fair",
            "itemId": 1000002,
            "itemCode": "MRF-23A-011-129",
            "itemName": "MRF-23A-011-129",
            "salesStatusId": 2,
            "salesStatusName": "For sale",
            "itemStatusId": 2,
            "itemStatusName": "Good quality item",
            "inventoryQuantity": 20,
            "updatedUserId": "inventoryUser",
            "updatedDatetime": "2024-09-13T00:00:00",
            "optimisticLockVerNo": 1
          },
          {
            "locationId": 102,
            "locationCode": "83003",
            "locationName": "Valley Fair",
            "itemId": 1000003,
            "itemCode": "MRF-23A-011-130",
            "itemName": "MRF-23A-011-130",
            "salesStatusId": 2,
            "salesStatusName": "For sale",
            "itemStatusId": 2,
            "itemStatusName": "Good quality item",
            "inventoryQuantity": 20,
            "updatedUserId": "inventoryUser",
            "updatedDatetime": "2024-09-13T00:00:00",
            "optimisticLockVerNo": 1
          },
        ]
    }    
  },
  // ケース2：異常系（status:500）
  case2: {
    ok: false,
    status: 500,
    data: {
      code: "COM_0000",
      message: "Unexpected error occurred.",
    }
  },
}

// 売価検索APIレスポンス
export const getSellingPricesResponses = {
  // ケース１：正常系データ有
  case1: {
    ok: true,
    status: 200,
    data: {
        "offset": 0,
        "count": 20,
        "limit": 20,
        "totalResults": 3,
        "hasMore": true,
        "records": [
          {
            "sellingPriceId": 6100000000000009,
            "salesTargetId": 1000001,
            "applicationStartDate": "2024-01-01",
            "sellingPriceExcludingTax": 101.01,
            "currencyCode": "USD",
            "deletedFlag": 0,
            "updatedUserId": "USER123456",
            "updatedDatetime": "2024-01-01T11:11:00",
            "sellingPriceCategory": {
              "sellingPriceCategoryId": 10000012,
              "sellingPriceCategoryCode": "01",
              "sellingPriceCategoryName": "lens option"
            },
            "country": {
              "countryId": 91000000001,
              "countryCodeAlpha2": "US",
              "countryCodeAlpha3": "USA",
              "countryName": "America"
            }
          },
          {
            "sellingPriceId": 6100000000000009,
            "salesTargetId": 1000002,
            "applicationStartDate": "2024-01-01",
            "sellingPriceExcludingTax": 103.01,
            "currencyCode": "USD",
            "deletedFlag": 0,
            "updatedUserId": "USER123456",
            "updatedDatetime": "2024-01-01T11:11:00",
            "sellingPriceCategory": {
              "sellingPriceCategoryId": 10000012,
              "sellingPriceCategoryCode": "01",
              "sellingPriceCategoryName": "lens option"
            },
            "country": {
              "countryId": 91000000001,
              "countryCodeAlpha2": "US",
              "countryCodeAlpha3": "USA",
              "countryName": "America"
            }
          },
          {
            "sellingPriceId": 6100000000000009,
            "salesTargetId": 1000003,
            "applicationStartDate": "2024-01-01",
            "sellingPriceExcludingTax": 102.01,
            "currencyCode": "USD",
            "deletedFlag": 0,
            "updatedUserId": "USER123456",
            "updatedDatetime": "2024-01-01T11:11:00",
            "sellingPriceCategory": {
              "sellingPriceCategoryId": 10000012,
              "sellingPriceCategoryCode": "01",
              "sellingPriceCategoryName": "lens option"
            },
            "country": {
              "countryId": 91000000001,
              "countryCodeAlpha2": "US",
              "countryCodeAlpha3": "USA",
              "countryName": "America"
            }
          },
        ]
    }
  },
  // ケース２：正常系データ無
  case2: {
    ok: true,
    status: 200,
    data: {
      "offset": 0,
      "count": 0,
      "limit": 20,
      "totalResults": 0,
      "hasMore": false,
      "records": []
    }
  },
  // ケース3：異常系（status:500）
  case3: {
    ok: false,
    status: 500,
    data: {
      code: "COM_0000",
      message: "Unexpected error occurred.",
    }
  },
    // ケース4：正常系データ有_価格同額およびnull
    case4: {
      ok: true,
      status: 200,
      data: {
          "offset": 0,
          "count": 20,
          "limit": 20,
          "totalResults": 3,
          "hasMore": true,
          "records": [
            {
              "sellingPriceId": 6100000000000009,
              "salesTargetId": 1000001,
              "applicationStartDate": "2024-01-01",
              "sellingPriceExcludingTax": 101.01,
              "currencyCode": "USD",
              "deletedFlag": 0,
              "updatedUserId": "USER123456",
              "updatedDatetime": "2024-01-01T11:11:00",
              "sellingPriceCategory": {
                "sellingPriceCategoryId": 10000012,
                "sellingPriceCategoryCode": "01",
                "sellingPriceCategoryName": "lens option"
              },
              "country": {
                "countryId": 91000000001,
                "countryCodeAlpha2": "US",
                "countryCodeAlpha3": "USA",
                "countryName": "America"
              }
            },
            {
              "sellingPriceId": 6100000000000009,
              "salesTargetId": 1000002,
              "applicationStartDate": "2024-01-01",
              "sellingPriceExcludingTax": null,
              "currencyCode": "USD",
              "deletedFlag": 0,
              "updatedUserId": "USER123456",
              "updatedDatetime": "2024-01-01T11:11:00",
              "sellingPriceCategory": {
                "sellingPriceCategoryId": 10000012,
                "sellingPriceCategoryCode": "01",
                "sellingPriceCategoryName": "lens option"
              },
              "country": {
                "countryId": 91000000001,
                "countryCodeAlpha2": "US",
                "countryCodeAlpha3": "USA",
                "countryName": "America"
              }
            },
            {
              "sellingPriceId": 6100000000000009,
              "salesTargetId": 1000003,
              "applicationStartDate": "2024-01-01",
              "sellingPriceExcludingTax": 101.01,
              "currencyCode": "USD",
              "deletedFlag": 0,
              "updatedUserId": "USER123456",
              "updatedDatetime": "2024-01-01T11:11:00",
              "sellingPriceCategory": {
                "sellingPriceCategoryId": 10000012,
                "sellingPriceCategoryCode": "01",
                "sellingPriceCategoryName": "lens option"
              },
              "country": {
                "countryId": 91000000001,
                "countryCodeAlpha2": "US",
                "countryCodeAlpha3": "USA",
                "countryName": "America"
              }
            },
          ]
      }
    },
}