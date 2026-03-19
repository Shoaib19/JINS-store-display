// フレーム交換回数
export const frameExchangeCount: number = 1;

// レンズ交換回数
export const lensExchangeCount: number = 1;

// 保証情報取得APIレスポンス
// 使用項目は以下の3項目（全てnullableでない）
// warrantyItems.warrantyStartDate
// warrantyItems.itemType
// warrantyItems.exchangeCount
export const findWarrantiesResponse = {
  // ケース１：正常系交換可
  case1: {
    ok: true,
    status: 200,
    data: {
      warrantyInfo: {
        warrantyNumber: '250501US000001-1',
        receptionNumber: '250501US000001',
        orderNumber: "USA123456",
        isExchangeLens: false,
        powerId: 1234567890,
        storeId: 1143416,
        storeCode: '83005',
        exchangeCount: 0,
        deletedFlag: 0,
        optimisticLockVerNo: 1,
        warrantyItems: [
          {
            warrantyItemId: 1,
            warrantyNumber: '250501US000001-1',
            purchaseDate: '2025-05-01T12:34:56',
            warrantyStartDate: '2025-05-01T13:34:56',
            channel: 'S',
            storeId: 1143416,
            storeCode: '83005',
            itemType: '001',
            exchangeCount: 0,
            deletedFlag: 0,
            optimisticLockVerNo: 1
          }, {
            warrantyItemId: 2,
            warrantyNumber: '250501US000001-1',
            purchaseDate: '2025-05-01T12:34:56',
            warrantyStartDate: '2025-05-01T13:34:56',
            channel: 'S',
            storeId: 1143416,
            storeCode: '83005',
            itemType: '002',
            exchangeCount: 0,
            deletedFlag: 0,
            optimisticLockVerNo: 1
          }
        ]
      }
    }
  },

  // ケース２：正常系交換不可_期限切れ
  case2: {
    ok: true,
    status: 200,
    data: {
      warrantyInfo: {
        warrantyNumber: '250501US000001-1',
        receptionNumber: '250501US000001',
        orderNumber: "USA123456",
        isExchangeLens: false,
        powerId: 1234567890,
        storeId: 1143416,
        storeCode: '83005',
        exchangeCount: 0,
        deletedFlag: 0,
        optimisticLockVerNo: 1,
        warrantyItems: [
          {
            warrantyItemId: 1,
            warrantyNumber: '250501US000001-1',
            purchaseDate: '2025-05-01T12:34:56',
            warrantyStartDate: '2024-02-28T13:34:56',
            channel: 'S',
            storeId: 1143416,
            storeCode: '83005',
            itemType: '001',
            //exchangeCount: 0,
            deletedFlag: 0,
            optimisticLockVerNo: 1
          }, {
            warrantyItemId: 2,
            warrantyNumber: '250501US000001-1',
            purchaseDate: '2025-05-01T12:34:56',
            warrantyStartDate: '2025-05-01T13:34:56',
            channel: 'S',
            storeId: 1143416,
            storeCode: '83005',
            itemType: '002',
            //exchangeCount: 0,
            deletedFlag: 0,
            optimisticLockVerNo: 1
          }
        ]
      }
    }
  },

  // ケース３：正常系交換不可_回数切れ
  case3: {
    ok: true,
    status: 200,
    data: {
      warrantyInfo: {
        warrantyNumber: '250501US000001-1',
        receptionNumber: '250501US000001',
        orderNumber: "USA123456",
        isExchangeLens: false,
        powerId: 1234567890,
        storeId: 1143416,
        storeCode: '83005',
        exchangeCount: frameExchangeCount + lensExchangeCount,
        deletedFlag: 0,
        optimisticLockVerNo: 1,
        warrantyItems: [
          {
            warrantyItemId: 1,
            warrantyNumber: '250501US000001-1',
            purchaseDate: '2025-05-01T12:34:56',
            //warrantyStartDate: '2025-05-01T13:34:56',
            channel: 'S',
            storeId: 1143416,
            storeCode: '83005',
            itemType: '001',
            exchangeCount: frameExchangeCount,
            deletedFlag: 0,
            optimisticLockVerNo: 1
          }, {
            warrantyItemId: 2,
            warrantyNumber: '250501US000001-1',
            purchaseDate: '2025-05-01T12:34:56',
            //warrantyStartDate: '2025-05-01T13:34:56',
            channel: 'S',
            storeId: 1143416,
            storeCode: '83005',
            itemType: '002',
            exchangeCount: lensExchangeCount,
            deletedFlag: 0,
            optimisticLockVerNo: 1
          }
        ]
      }
    }
  },

  // ケース４：正常系交換可（保証対象無し）
  case4: {
    ok: true,
    status: 200,
    data: {
      warrantyInfo: {
        warrantyNumber: '250501US000001-1',
        receptionNumber: '250501US000001',
        orderNumber: "USA123456",
        isExchangeLens: false,
        powerId: 1234567890,
        storeId: 1143416,
        storeCode: '83005',
        //exchangeCount: 0,
        deletedFlag: 0,
        optimisticLockVerNo: 1,
      }
    }
  },

  // ケース５：正常系交換可_１件目保証開始日無し
  case5: {
    ok: true,
    status: 200,
    data: {
      warrantyInfo: {
        warrantyNumber: '250501US000001-1',
        receptionNumber: '250501US000001',
        orderNumber: "USA123456",
        isExchangeLens: false,
        powerId: 1234567890,
        storeId: 1143416,
        storeCode: '83005',
        exchangeCount: 0,
        deletedFlag: 0,
        optimisticLockVerNo: 1,
        warrantyItems: [
          {
            warrantyItemId: 1,
            warrantyNumber: '250501US000001-1',
            purchaseDate: '2025-05-01T12:34:56',
            //warrantyStartDate: null,
            channel: 'S',
            storeId: 1143416,
            storeCode: '83005',
            itemType: '001',
            exchangeCount: 0,
            deletedFlag: 0,
            optimisticLockVerNo: 1
          }, {
            warrantyItemId: 2,
            warrantyNumber: '250501US000001-1',
            purchaseDate: '2025-05-01T12:34:56',
            warrantyStartDate: '2025-05-01T13:34:56',
            channel: 'S',
            storeId: 1143416,
            storeCode: '83005',
            itemType: '002',
            exchangeCount: 0,
            deletedFlag: 0,
            optimisticLockVerNo: 1
          }
        ]
      }
    }
  },

  // ケース６：正常系交換可_２件目保証開始日無し
  case6: {
    ok: true,
    status: 200,
    data: {
      warrantyInfo: {
        warrantyNumber: '250501US000001-1',
        receptionNumber: '250501US000001',
        orderNumber: "USA123456",
        isExchangeLens: false,
        powerId: 1234567890,
        storeId: 1143416,
        storeCode: '83005',
        exchangeCount: 0,
        deletedFlag: 0,
        optimisticLockVerNo: 1,
        warrantyItems: [
          {
            warrantyItemId: 1,
            warrantyNumber: '250501US000001-1',
            purchaseDate: '2025-05-01T12:34:56',
            warrantyStartDate: '2025-05-01T13:34:56',
            channel: 'S',
            storeId: 1143416,
            storeCode: '83005',
            itemType: '001',
            exchangeCount: 0,
            deletedFlag: 0,
            optimisticLockVerNo: 1
          }, {
            warrantyItemId: 2,
            warrantyNumber: '250501US000001-1',
            purchaseDate: '2025-05-01T12:34:56',
            //warrantyStartDate: null,
            channel: 'S',
            storeId: 1143416,
            storeCode: '83005',
            itemType: '002',
            exchangeCount: 0,
            deletedFlag: 0,
            optimisticLockVerNo: 1
          }
        ]
      }
    }
  },

  // ケース７：正常系交換不可_期限切れ_閏日
  case7: {
    ok: true,
    status: 200,
    data: {
      warrantyInfo: {
        warrantyNumber: '250501US000001-1',
        receptionNumber: '250501US000001',
        orderNumber: "USA123456",
        isExchangeLens: false,
        powerId: 1234567890,
        storeId: 1143416,
        storeCode: '83005',
        exchangeCount: 0,
        deletedFlag: 0,
        optimisticLockVerNo: 1,
        warrantyItems: [
          {
            warrantyItemId: 1,
            warrantyNumber: '250501US000001-1',
            purchaseDate: '2025-05-01T12:34:56',
            warrantyStartDate: '2024-02-29T12:34:56',
            channel: 'S',
            storeId: 1143416,
            storeCode: '83005',
            itemType: '001',
            exchangeCount: 0,
            deletedFlag: 0,
            optimisticLockVerNo: 1
          }, {
            warrantyItemId: 2,
            warrantyNumber: '250501US000001-1',
            purchaseDate: '2025-05-01T12:34:56',
            warrantyStartDate: '2025-05-01T13:34:56',
            channel: 'S',
            storeId: 1143416,
            storeCode: '83005',
            itemType: '002',
            exchangeCount: 0,
            deletedFlag: 0,
            optimisticLockVerNo: 1
          }
        ]
      }
    }
  },

  // ケース８：正常系_交換可_商品タイプ無し
  case8: {
    ok: true,
    status: 200,
    data: {
      warrantyInfo: {
        warrantyNumber: '250501US000001-1',
        receptionNumber: '250501US000001',
        orderNumber: "USA123456",
        isExchangeLens: false,
        powerId: 1234567890,
        storeId: 1143416,
        storeCode: '83005',
        exchangeCount: 0,
        deletedFlag: 0,
        optimisticLockVerNo: 1,
        warrantyItems: [
          {
            warrantyItemId: 1,
            warrantyNumber: '250501US000001-1',
            purchaseDate: '2025-05-01T12:34:56',
            warrantyStartDate: '2025-05-01T13:34:56',
            channel: 'S',
            storeId: 1143416,
            storeCode: '83005',
            //itemType: null,
            exchangeCount: 0,
            deletedFlag: 0,
            optimisticLockVerNo: 1
          }, {
            warrantyItemId: 2,
            warrantyNumber: '250501US000001-1',
            purchaseDate: '2025-05-01T12:34:56',
            warrantyStartDate: '2025-05-01T13:34:56',
            channel: 'S',
            storeId: 1143416,
            storeCode: '83005',
            //itemType: null,
            exchangeCount: 0,
            deletedFlag: 0,
            optimisticLockVerNo: 1
          }
        ]
      }
    }
  },

  // ケース９：異常系_ステータス404
  case9: {
    ok: false,
    status: 404,
    data: {
      "code": "COM_0002",
      "message": "Specified data not found."
    }
  },

  // ケース１０：異常系_ステータス429
  case10: {
    ok: false,
    status: 429,
    data: {
      "code": "COM_0004",
      "message": "Duplicate api invocation detected."
    }
  },

  // ケース１１：正常系_データ無し
  case11: {
    ok: true,
    status: 200,
    data: {}
  },
};

// 保証履歴取得APIレスポンス
// 使用項目は以下4項目（全てnullableでない）
// warrantyHistories[0].replacementType
// warrantyHistories[0].replacementPart
// warrantyHistories[0].replacementReason
// warrantyHistories[0].exchangeCountIncrementFlag
export const findWarrantyHistoriesResponse = {
  // ケース１：正常系
  case1: {
    ok: true,
    status: 200,
    data: {
      warrantyHistories: [
        {
          receptionNumber: '250501US000001',
          warrantyNumber: '250501US000001-1',
          previousReceptionNumber: '250430US000001',
          previousItemgroupCode: '250430US000001-1',
          receiptDatetime: '2025-05-01T13:16:01',
          retailStoreStaffNo: 'jins-user-id',
          retailStoreId: 1143416,
          deliveryStoreId: 1143416,
          retailStoreCode: '83005',
          deliveryStoreCode: '83005',
          exchangedCount: 1,
          warrantyCreatedAt: '2025-05-01T13:16:01',
          lensExchange: true,
          crmFlag: false,
          replacementPart: '004',
          replacementType: '001',
          replacementReason: '002',
          exchangeCountIncrementFlag: true,
          replacementStoreId: 1143416,
          replacementStoreCode: '83005',
          replacementStatusCode: '010',
          deletedFlag: 0,
          optimisticLockVerNo: 1
        }, {
          receptionNumber: '250430US000001',
          warrantyNumber: '250501US000001-1',
          previousReceptionNumber: '250429US000001',
          previousItemgroupCode: '250429US000001-1',
          receiptDatetime: '2025-05-01T13:16:01',
          retailStoreStaffNo: 'jins-user-id',
          retailStoreId: 1143416,
          deliveryStoreId: 1143416,
          retailStoreCode: '83005',
          deliveryStoreCode: '83005',
          exchangedCount: 1,
          warrantyCreatedAt: '2025-05-01T13:16:01',
          lensExchange: true,
          crmFlag: false,
          replacementPart: '004',
          replacementType: '001',
          replacementReason: '002',
          exchangeCountIncrementFlag: true,
          replacementStoreId: 1143416,
          replacementStoreCode: '83005',
          replacementStatusCode: '010',
          deletedFlag: 0,
          optimisticLockVerNo: 1
        }
      ]
    },
  },

  // ケース２：異常系_ステータス404
  case2: {
    ok: false,
    status: 404,
    data: {
      "code": "COM_0002",
      "message": "Specified data not found."
    }
  },

  // ケース３：異常系_ステータス400
  case3: {
    ok: false,
    status: 400,
    data: {
      "code": "COM_0001",
      "message": "Validation error occurred."
    }
  },

  // ケース４：異常系_ステータス500
  case4: {
    ok: false,
    status: 500,
    data: {
      "code": "COM_0000",
      "message": "Unexpected error occurred."
    }
  },

  // ケース５：正常系_データ無し
  case5: {
    ok: true,
    status: 200,
    data: {}
  },

};