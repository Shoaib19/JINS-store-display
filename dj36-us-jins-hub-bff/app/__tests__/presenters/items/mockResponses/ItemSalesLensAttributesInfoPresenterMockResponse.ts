// カートカタログ取得APIレスポンス
// 使用している項目は以下5項目で全てnullableでないため、nullケースなし
// lopFocusCategoryItemId,   // 焦点分類ID
// lopProgressiveCategoryItemId,   // 累進分類ID
// lopRefractiveIndexNameItemId,   // 屈折率分類ID
// isExchangeLens,   // レンズ交換フラグ
// lensReplacementTypeCode,    // レンズ交換分類コード
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
            itemGroupCode: "241031US000001-1",
            lopFocusCategoryItemId: 10000001,
            lopProgressiveCategoryItemId: 20000001,
            lopRefractiveIndexNameItemId: 30000001,
            isExchangeLens: true,
            lensReplacementTypeCode: "LWW0021",
          }, {
            lineitemGroupId: 1111111,
            cartId: 123,
            itemGroupCode: "241031US000001-2",
            lopFocusCategoryItemId: 10000002,
            lopProgressiveCategoryItemId: 20000002,
            lopRefractiveIndexNameItemId: 30000002,
            isExchangeLens: true,
            lensReplacementTypeCode: "LWW0022",
          }, {
            lineitemGroupId: 1111112,
            cartId: 123,
            itemGroupCode: "241031US000001-3",
            lopFocusCategoryItemId: 10000003,
            lopProgressiveCategoryItemId: 20000003,
            lopRefractiveIndexNameItemId: 30000003,
            isExchangeLens: false,
            lensReplacementTypeCode: null,
          },
        ]
      }
    }
  },
  // ケース２：正常系データ無
  case2: {
    ok: true,
    status: 200,
    data: {}
  },
  // ケース３：正常系データ有（全パラメータ）
  case3: {
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
            itemGroupCode: "241031US000001-1",
            lopFocusCategoryItemId: 10000001,
            lopProgressiveCategoryItemId: 20000001,
            lopRefractiveIndexNameItemId: 30000001,
            isExchangeLens: true,
            lensReplacementTypeCode: "LWW0021",
          },
        ]
      }
    }
  },
  // ケース４：異常系（status:404）
  case4: {
    ok: false,
    status: 404,
    data: {
      code: "COM_0002",
      message: "Specified data not found.",
    }
  },
};

// 販売用レンズ検索項目検索API（累進分類）
export const getSalesLensSearchResponsesProgressiveCategory = {
  // ケース１：正常系データ有
  case1: {
    ok: true,
    status: 200,
    data: {
      offset: 0,
      count: 3,
      limit: 100,
      totalResults: 3,
      hasMore: false,
      records: [
        {
          countryId: 91000000001,
          countryCodeAlpha2: "US",
          applicationStartDate: "2024-01-01",
          salesColorMajorClass: null,
          salesLensSpec: null,
          focusCategory: null,
          progressiveCategory: [
            {
              progressiveCategoryId: 20000001,
              progressiveCategoryCode: "LOP-P110001",
              progressiveCategoryName: "None",
              isSelectable: true,
              sellingPrice: {
                sellingPriceExcludingTax: 29.8,
                currencyCode: "USD",
              }            
            }, {
              progressiveCategoryId: 20000002,
              progressiveCategoryCode: "LOP-P120001",
              progressiveCategoryName: "Soft",
              isSelectable: true,
              sellingPrice: {
                sellingPriceExcludingTax: 39.8,
                currencyCode: "USD",
              }            
            }, {
              progressiveCategoryId: 20000003,
              progressiveCategoryCode: "LOP-P130001",
              progressiveCategoryName: "Hard",
              isSelectable: true,
              sellingPrice: {
                sellingPriceExcludingTax: 49.8,
                currencyCode: "USD",
              }            
            },
          ],
          refractiveIndexName: null,
        },
      ]
    }
  },
  // ケース２：正常系データ無し
  case2: {
    ok: true,
    status: 200,
    data: {}
  },
  // ケース３：正常系データ有（全パラメータ）
  case3: {
    ok: true,
    status: 200,
    data: {
      offset: 0,
      count: 1,
      limit: 100,
      totalResults: 1,
      hasMore: false,
      records: [
        {
          countryId: 91000000001,
          countryCodeAlpha2: "US",
          applicationStartDate: "2024-01-01",
          salesColorMajorClass: null,
          salesLensSpec: null,
          focusCategory: null,
          progressiveCategory: [
            {
              progressiveCategoryId: 20000001,
              progressiveCategoryCode: "LOP-P110001",
              progressiveCategoryName: "None",
              isSelectable: true,
              sellingPrice: {
                sellingPriceExcludingTax: 29.8,
                currencyCode: "USD",
              }            
            },
          ],
          refractiveIndexName: null,
        },
      ]
    }
  },
  // ケース４：異常系（status:500）
  case4: {
    ok: false,
    status: 500,
    data: {
      code: "COM_0000",
      message: "Unexpected error occurred.",
    }
  },
  // ケース５：正常系データ有（null）
  case5: {
    ok: true,
    status: 200,
    data: {
      offset: 0,
      count: 3,
      limit: 100,
      totalResults: 3,
      hasMore: false,
      records: [
        {
          countryId: 91000000001,
          countryCodeAlpha2: "US",
          applicationStartDate: "2024-01-01",
          salesColorMajorClass: null,
          salesLensSpec: null,
          focusCategory: null,
          progressiveCategory: [
            {
              progressiveCategoryId: null,
              progressiveCategoryCode: null,
              progressiveCategoryName: null,
              isSelectable: null,
              sellingPrice: null,
            },
          ],
          refractiveIndexName: null,
        },
      ]
    }
  },  
};

// 販売用レンズ検索項目検索API（屈折率名称）
export const getSalesLensSearchResponsesRefractiveIndexName = {
  // ケース１：正常系データ有
  case1: {
    ok: true,
    status: 200,
    data: {
      offset: 0,
      count: 3,
      limit: 100,
      totalResults: 3,
      hasMore: false,
      records: [
        {
          countryId: 91000000001,
          countryCodeAlpha2: "US",
          applicationStartDate: "2024-01-01",
          salesColorMajorClass: null,
          salesLensSpec: null,
          focusCategory: null,
          progressiveCategory: null,
          refractiveIndexName: [
            {
              refractiveIndexNameId: 30000001,
              refractiveIndexNameCode: "LOP-R110001",
              refractiveIndexName: "Thin 1.50",
              isSelectable: true,
              sellingPrice: {
                sellingPriceExcludingTax: 39.8,
                currencyCode: "USD",
              },
            }, {
              refractiveIndexNameId: 30000002,
              refractiveIndexNameCode: "LOP-R120001",
              refractiveIndexName: "Thin 1.60",
              isSelectable: true,
              sellingPrice: {
                sellingPriceExcludingTax: 45.2,
                currencyCode: "USD",
              },
            }, {
              refractiveIndexNameId: 30000003,
              refractiveIndexNameCode: "LOP-R130001",
              refractiveIndexName: "Thin 1.67",
              isSelectable: false,
              sellingPrice: {
                sellingPriceExcludingTax: 49.8,
                currencyCode: "USD",
              },
            },
          ]
        }
      ]
    }
  },
  // ケース２：正常系データ無
  case2: {
    ok: true,
    status: 200,
    data: {}
  },
  // ケース３：正常系データ有（全パラメータ）
  case3: {
    ok: true,
    status: 200,
    data: {
      offset: 0,
      count: 1,
      limit: 100,
      totalResults: 1,
      hasMore: false,
      records: [
        {
          countryId: 91000000001,
          countryCodeAlpha2: "US",
          applicationStartDate: "2024-01-01",
          salesColorMajorClass: null,
          salesLensSpec: null,
          focusCategory: null,
          progressiveCategory: null,
          refractiveIndexName: [
            {
              refractiveIndexNameId: 30000001,
              refractiveIndexNameCode: "LOP-R110001",
              refractiveIndexName: "Thin 1.50",
              isSelectable: true,
              sellingPrice: {
                sellingPriceExcludingTax: 39.8,
                currencyCode: "USD",
              },
            },
          ]
        }
      ]
    }
  },
  // ケース４：異常系（status:500）
  case4: {
    ok: false,
    status: 500,
    data: {
      code: "COM_0000",
      message: "Unexpected error occurred.",
    }
  },
  // ケース５：正常系データ有（null）
  case5: {
    ok: true,
    status: 200,
    data: {
      offset: 0,
      count: 1,
      limit: 100,
      totalResults: 1,
      hasMore: false,
      records: [
        {
          countryId: 91000000001,
          countryCodeAlpha2: "US",
          applicationStartDate: "2024-01-01",
          salesColorMajorClass: null,
          salesLensSpec: null,
          focusCategory: null,
          progressiveCategory: null,
          refractiveIndexName: [
            {
              refractiveIndexNameId: null,
              refractiveIndexNameCode: null,
              refractiveIndexName: null,
              isSelectable: null,
              sellingPrice: {
                sellingPriceExcludingTax: null,
                currencyCode: null,
              },
            },
          ]
        }
      ]
    }
  },
};

// 商品検索API
// 使用しているのはrecords.itemIdのみでnullableなしのため、nullケースなし
export const getItemsResponses = {
  // ケース１：正常系データ有
  case1: {
    ok: true,
    status: 200,
    data: {
      offset: 0,
      count: 2,
      limit: 100000,
      totalResults: 2,
      hasMore: false,
      records: [
        {
          itemId: 1207129,
          itemCode: "LWW0021",
        }, {
          itemId: 1207130,
          itemCode: "LWW0020",
        }, {
          itemId: 1207101,
          itemCode: "LWW0022",
        }
      ]      
    }
  },
  // ケース２：正常系データ無
  case2: {
    ok: true,
    status: 200,
    data: {}
  },
  // ケース３：異常系（status:500）
  case3: {
    ok: false,
    status: 500,
    data: {
      code: "COM_0000",
      message: "Unexpected error occurred.",
    }
  },
};

// 売価検索API
export const getSellingPricesResponses = {
  // ケース１：正常系データ有
  case1: {
    ok: true,
    status: 200,
    data: {
      offset: 0,
      count: 2,
      limit: 100000,
      totalResults: 2,
      hasMore: false,
      records: [
        {
          sellingPriceId: 6100000000000001,
          salesTargetId: 1207129,
          applicationStartDate: "2024-01-01",
          sellingPriceExcludingTax: 20,
          currencyCode: "USD",
          deletedFlag: 0,
          updatedUserId: "USER123456",
          updatedDatetime: "2024-01-01T11:11:00.000Z",
          sellingPriceCategory: {
            sellingPriceCategoryId: 10000012,
            sellingPriceCategoryCode: "01",
            sellingPriceCategoryName: "lens option"
          },
          country: {
            countryId: 91000000001,
            countryCodeAlpha2: "US",
            countryCodeAlpha3: "USA",
            countryName: "America"
          }
        }, {
          sellingPriceId: 6100000000000001,
          salesTargetId: 1207130,
          applicationStartDate: "2024-01-01",
          sellingPriceExcludingTax: 10,
          currencyCode: "USD",
          deletedFlag: 0,
          updatedUserId: "USER123456",
          updatedDatetime: "2024-01-01T11:11:00.000Z",
          sellingPriceCategory: {
            sellingPriceCategoryId: 10000012,
            sellingPriceCategoryCode: "01",
            sellingPriceCategoryName: "lens option"
          },
          country: {
            countryId: 91000000001,
            countryCodeAlpha2: "US",
            countryCodeAlpha3: "USA",
            countryName: "America"
          }
        }, {
          sellingPriceId: 6100000000000001,
          salesTargetId: 1207101,
          applicationStartDate: "2024-01-01",
          sellingPriceExcludingTax: 30,
          currencyCode: "USD",
          deletedFlag: 0,
          updatedUserId: "USER123456",
          updatedDatetime: "2024-01-01T11:11:00.000Z",
          sellingPriceCategory: {
            sellingPriceCategoryId: 10000012,
            sellingPriceCategoryCode: "01",
            sellingPriceCategoryName: "lens option"
          },
          country: {
            countryId: 91000000001,
            countryCodeAlpha2: "US",
            countryCodeAlpha3: "USA",
            countryName: "America"
          }
        }
      ]      
    }
  },
  // ケース２：正常系データ無
  case2: {
    ok: true,
    status: 200,
    data: {}
  },
  // ケース３：異常系（status:500）
  case3: {
    ok: false,
    status: 500,
    data: {
      code: "COM_0000",
      message: "Unexpected error occurred.",
    }
  },
  // ケース４：正常系データ有（null）
  case4: {
    ok: true,
    status: 200,
    data: {
      offset: 0,
      count: 2,
      limit: 100000,
      totalResults: 2,
      hasMore: false,
      records: [
        {
          sellingPriceId: 6100000000000001,
          salesTargetId: 1207129,
          applicationStartDate: "2024-01-01",
          sellingPriceExcludingTax: null,
          currencyCode: "USD",
          deletedFlag: 0,
          updatedUserId: "USER123456",
          updatedDatetime: "2024-01-01T11:11:00.000Z",
          sellingPriceCategory: {
            sellingPriceCategoryId: 10000012,
            sellingPriceCategoryCode: "01",
            sellingPriceCategoryName: "lens option"
          },
          country: {
            countryId: 91000000001,
            countryCodeAlpha2: "US",
            countryCodeAlpha3: "USA",
            countryName: "America"
          }
        }, {
          sellingPriceId: 6100000000000001,
          salesTargetId: 1207101,
          applicationStartDate: "2024-01-01",
          sellingPriceExcludingTax: null,
          currencyCode: "USD",
          deletedFlag: 0,
          updatedUserId: "USER123456",
          updatedDatetime: "2024-01-01T11:11:00.000Z",
          sellingPriceCategory: {
            sellingPriceCategoryId: 10000012,
            sellingPriceCategoryCode: "01",
            sellingPriceCategoryName: "lens option"
          },
          country: {
            countryId: 91000000001,
            countryCodeAlpha2: "US",
            countryCodeAlpha3: "USA",
            countryName: "America"
          }
        }
      ]      
    }
  },
};

// 発生不可能エラー
export const impossibleErrorResponses = {
  // ケース１：BFFステータス404
  case1: {
    ok: false,
    systemName: "BFF",
    details: {
      status: 404,
    }
  },
  // ケース２：BFFステータス500
  case2: {
    ok: false,
    systemName: "BFF",
    details: {
      status: 500,
    }
  },
  // ケース３：ステータス無し
  case3: {
    ok: false,
  }
};
