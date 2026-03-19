/**
 * 正常系_オーダー情報取得API_受付番号指定
*/
export const getOrderInfoResponseCase1 = {
  cartId: 3,
  memberId: null,
  customerName: 'David Williams',
  phoneNumber: '4158726498',
  subtotal: 0,
  totalDiscountAmount: 0,
  totalTaxPrice: 0,
  totalSalesPrice: 0,
  promotionCodes: "002",
  reasonCode: "002",
  itemGroups: [
    {
      itemGroupCode: '250404US000001-1',
      callingNumber: 'A3',
      frame: null,
      lensoption: null,
      itemCaseInfo: null,
      deliveryInfo: {
        deliveryDate: "2024-11-30T11:59:59Z",
        deliveryMethodCode: "002",
        deliveryMethodName: "Hand over",
        shippingInfo: {
          fullName: "David Williams",
          phoneNumber: "4158726498"
        }
      },
      prescription: {
        prescriptionId: null,
        prescriptionInfo: {
          addLeft: 0,
          addRight: 0,
          axisLeft: 0,
          axisRight: 0,
          baseHLeft: "BU",
          baseHRight: "BD",
          baseVLeft: "BO",
          baseVRight: "BI",
          cylLeft: 8.75,
          cylRight: 8.75,
          eyepointLeft: 2,
          eyepointRight: 2,
          pdLeft: 0,
          pdRight: 0,
          perspectiveTypeCode: "2",
          prism01Left: 0,
          prism01Right: 0,
          prism02Left: 0,
          prism02Right: 0,
          prismFlag: true,
          sphLeft: -0.5,
          sphRight: -0.25,
          vision: 1.0,
        }
      },
      discountAmount: 0,
      orderTotal: 0,
      orderStatusCode: "300",
      orderStatusName: null,
    }
  ]
};

export const getOrderInfoResponseCase2 = {
 cartId: 1,
  customerName: 'John Smith',
  phoneNumber: '4158726498',
  subtotal: 0,
  totalDiscountAmount: 0,
  totalTaxPrice: 0,
  totalSalesPrice: 0,
  promotionCodes: "002",
  reasonCode: "002",
  itemGroups: [
    {
      itemGroupCode: '250212US000001-1',
      callingNumber: 'A1',
      prescription: {
        prescriptionId: null,
        prescriptionRegistCode: "002",
      },
      frame: null,
      lensoption: null,
      itemCaseInfo: null,
      deliveryInfo: {
        deliveryMethodCode: "001",
        shippingInfo: {
          fullName: "John Smith",
          phoneNumber: "4158726498"
        }
      },
      discountAmount: 0,
      orderTotal: 0,
      lensReplacement: {
        lensReplacementFlag: true,
        lensReplacementTypeCode: "LOP-I110001"
      },
      orderStatusCode: null,
      orderStatusName: null,
      receptionStatusCode: '101',
      receptionStatusName: 'Order New'
    }
  ]
};

export const getOrderInfoResponseCase3 = {
  cartId: 2,
  customerName: 'Michael Brown',
  phoneNumber: '07012345678',
  subtotal: 0,
  totalTaxPrice: 0,
  totalSalesPrice: 0,
  totalDiscountAmount: 0,
  promotionCodes: "002",
  reasonCode: "002",
  itemGroups: [
    {
      itemGroupCode: '250212US000002-1',
      callingNumber: 'A1',
      prescription: {
        prescriptionId: null,
        prescriptionRegistCode: "002",
      },
      frame: null,
      lensoption: null,
      itemCaseInfo: null,
      orderTotal: 0,
      orderStatusCode: null,
      orderStatusName: null,
      receptionStatusCode: '101',
      receptionStatusName: 'Order New',
      deliveryInfo: {
        deliveryMethodCode: "001",
        shippingInfo: {
          fullName: "Michael Brown",
          phoneNumber: "07012345678"
        }
      },
      discountAmount: 0,
      lensReplacement: {
        lensReplacementFlag: true,
        lensReplacementTypeCode: "LOP-I110001"
      },
    }
  ]
};

export const getOrderInfoResponseCase4 = {
  "cartId": 1,
  "customerName": "John Smith",
  "subtotal": 0,
  "totalTaxPrice": 0,
  "totalSalesPrice": 0,
  "totalDiscountAmount": 0,
  "promotionCodes": "002",
  "reasonCode": "002",
  "itemGroups": [
    {
      "itemGroupCode": "250212US000001-1",
      "callingNumber": "A1",
      "prescription": {
        "prescriptionId": null,
        "prescriptionRegistCode": "002",
      },
      "frame": null,
      "lensoption": null,
      "itemCaseInfo": {
        "isCaseNone": false
      },
      "lensReplacement": {
        "lensReplacementFlag": true,
        "lensReplacementTypeCode": "LOP-I110001"
      },
      "deliveryInfo": {
        "deliveryMethodCode": "001",
        "shippingInfo": {
          "fullName": "John Smith"
        }
      },
      "discountAmount": 0,
      "orderTotal": 0,
      "orderStatusCode": null,
      "orderStatusName": null,
      "receptionStatusCode": "101",
      "receptionStatusName": "Order New"
    }
  ]
};

export const getOrderInfoResponseCase5 = {
  "cartId": 1,
  "customerName": "John Smith",
  "subtotal": 0,
  "totalTaxPrice": 0,
  "totalSalesPrice": 0,
  "totalDiscountAmount": 0,
  "promotionCodes": "002",
  "reasonCode": "002",
  "itemGroups": [
    {
      "itemGroupCode": "250212US000001-1",
      "callingNumber": "A1",
      "prescription": {
        "prescriptionId": null,
        "prescriptionRegistCode": "002",
      },
      "discountAmount": 0,
      "frame": null,
      "lensoption": null,
      "itemCaseInfo": {
        "productCode": "YC-0065-C",
        "productName": "EDUCATION CASE",
        "price": 0,
        "isCaseNone": true
      },
      "lensReplacement": {
        "lensReplacementFlag": true,
        "lensReplacementTypeCode": "LOP-I110001"
      },
      "deliveryInfo": {
        "deliveryMethodCode": "001",
        "shippingInfo": {
          "fullName": "John Smith"
        }
      },
      "orderTotal": 0,
      "orderStatusCode": null,
      "orderStatusName": null,
      "receptionStatusCode": "101",
      "receptionStatusName": "Order New"
    }
  ]
};

export const postCartInfoResponse = {
"cart": {
    "cartId": 2,
    "customerName": "Michael Brown",
    "phoneNumber": "07012345678",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "c",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000002-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "Michael Brown",
        "phoneNumber": "07012345678",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": null,
        "caseItemName": null,
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};

export const postCartInfoResponse_エラー = undefined;
export const postCartInfoResponse_null = null;

export const postCartInfoResponse_カバレッジ取得_オーダ情報周り = {
"cart": {
    "cartId": 2,
    "customerName": "Michael Brown",
    "phoneNumber": "07012345678",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "c",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000002-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "Michael Brown",
        "phoneNumber": "07012345678",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": null,
        "caseItemName": null,
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": "",
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": "LOP-P-110004",
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const postCartInfoResponse_カバレッジ取得_レンズオプション設定_注文詳細 = {
"cart": {
    "cartId": 2,
    "customerName": "Michael Brown",
    "phoneNumber": "07012345678",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "c",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000002-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "Michael Brown",
        "phoneNumber": "07012345678",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": null,
        "caseItemName": null,
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": 10,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": 11,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": 12,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": 13,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": 14,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const postCartInfoResponse_CORRIDOR_LENGTH_11MM = {
"cart": {
    "cartId": 2,
    "customerName": "Michael Brown",
    "phoneNumber": "07012345678",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "c",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000002-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "Michael Brown",
        "phoneNumber": "07012345678",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": null,
        "caseItemName": null,
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": "LOP-P-110004",
        "lopProgressiveCategoryLensOptionName": "11mm",
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const postCartInfoResponse_CORRIDOR_LENGTH_13MM = {
"cart": {
    "cartId": 2,
    "customerName": "Michael Brown",
    "phoneNumber": "07012345678",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "c",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000002-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "Michael Brown",
        "phoneNumber": "07012345678",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": null,
        "caseItemName": null,
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": undefined,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": undefined,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": undefined,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": undefined,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": "LOP-P-110005",
        "lopProgressiveCategoryLensOptionName": "13mm",
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": undefined,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const postCartInfoResponse_カバレッジ取得_itemGroups_undefined = {
"cart": {
    "cartId": 2,
    "customerName": "Michael Brown",
    "phoneNumber": "07012345678",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "c",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": undefined
  }
};
export const postCartInfoResponse_カバレッジ取得_price_null = {
"cart": {
    "cartId": 2,
    "customerName": "Michael Brown",
    "phoneNumber": "07012345678",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "c",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000002-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "Michael Brown",
        "phoneNumber": "07012345678",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": "aaaaa",
        "caseItemName": "bbbbb",
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const postCartInfoResponse_カバレッジ取得_price_undefined = {
"cart": {
    "cartId": 2,
    "customerName": "Michael Brown",
    "phoneNumber": "07012345678",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "c",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000002-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "Michael Brown",
        "phoneNumber": "07012345678",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": undefined,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": "aaaaa",
        "caseItemName": "bbbbb",
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};



export const getCartInfoResponse = {
  "cart": {
    "cartId": 1,
    "customerName": "John Smith",
    "phoneNumber": "4158726498",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "250212US000001",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000001-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "John Smith",
        "phoneNumber": "4158726498",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": null,
        "caseItemName": null,
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const getCartInfoResponse_エラー = undefined;
export const getCartInfoResponse_null = null;
export const getCartInfoResponse_NoItem = {
  "cart": {
    "cartId": 1,
    "customerName": "John Smith",
    "phoneNumber": "4158726498",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "250212US000001",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": []
  }
};
export const getCartInfoResponse_NoPhoneNumber = {
  "cart": {
    "cartId": 1,
    "customerName": "John Smith",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "250212US000001",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000001-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "John Smith",
        "phoneNumber": null,
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": null,
        "caseItemName": null,
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "isCaseNone": false,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const getCartInfoResponse_NpReceptionNumber = {
  "cart": {
    "cartId": 1,
    "customerName": "John Smith",
    "phoneNumber": "4158726498",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    // "receptionNumber": "250212US000001",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000001-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "John Smith",
        "phoneNumber": "4158726498",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": null,
        "caseItemName": null,
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const getCartInfoResponse_CaseNone = {
  "cart": {
    "cartId": 1,
    "customerName": "John Smith",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "250212US000001",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000001-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "John Smith",
        "phoneNumber": null,
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": 0,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": "YC-0065-C",
        "caseItemName": "EDUCATION CASE",
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "isCaseNone": true,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const getCartInfoResponse_度数登録_処方箋 = {
  "cart": {
    "cartId": 1,
    "customerName": "John Smith",
    "phoneNumber": "4158726498",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "250212US000001",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000001-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "John Smith",
        "phoneNumber": "4158726498",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": null,
        "caseItemName": null,
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": 4,
        "registeredItemId": null,
        "registeredItemCategoryCode": "09",
        "registeredTaxClass": "0",
        "registeredListPrice": 0,
        "registeredDiscountPrice": 0,
        "registeredTaxPrice": 0,
        "registeredSalesPrice": 0,
        "registeredPreparation1": "{  \"prescriptionId\": null,  \"registrationMethodCode\": \"002\",  \"prescriptionInfo\": {    \"vision\": null,    \"perspectiveTypeCode\": \"004\",    \"eyepointRight\": 1.0,    \"eyepointLeft\": -1.0,    \"pdRight\": 40.00,    \"pdLeft\": 60.00,    \"sphRight\": 29.00,    \"sphLeft\": 26.75,    \"cylRight\": 8.75,    \"cylLeft\": -1.50,    \"axisRight\": 180,    \"axisLeft\": 170,    \"addRight\": 9.00,    \"addLeft\": 2.50,    \"prismFlag\": true,    \"prism01Right\": 1.00,    \"prism01Left\": 1.00,    \"baseHRight\": \"BO\",    \"baseHLeft\": \"BO\",    \"prism02Right\": 0.50,    \"prism02Left\": 0.50,    \"baseVRight\": \"BU\",    \"baseVLeft\": \"BD\"  },  \"prescriptionExpiration\": \"2025-12-24T08:00:00\" }",
        "registeredPreparation2": "aaaaa",
        "registeredDeletedFlag": 0,
        "registeredRegisteredUserId": "STAFF_A",
        "registeredRegisteredProgram": "550e8400-e29b-41d4-a716-446655440000",
        "registeredRegisteredDatetime": "2024-10-31T18:48:12",
        "registeredUpdatedUserId": "STAFF_A",
        "registeredUpdatedProgram": "550e8400-e29b-41d4-a716-446655440000",
        "registeredUpdatedDatetime": "2024-10-31T18:48:12",
        "registeredOptimisticLockVerNo": 1,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const getCartInfoResponse_度数登録_処方箋_調整 = {
  "cart": {
    "cartId": 1,
    "customerName": "John Smith",
    "phoneNumber": "4158726498",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "250212US000001",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000001-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "F1",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "John Smith",
        "phoneNumber": "4158726498",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": null,
        "caseItemName": null,
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": 4,
        "registeredItemId": null,
        "registeredItemCategoryCode": "09",
        "registeredTaxClass": "0",
        "registeredListPrice": 0,
        "registeredDiscountPrice": 0,
        "registeredTaxPrice": 0,
        "registeredSalesPrice": 0,
        "registeredPreparation1": "{  \"prescriptionId\": null,  \"registrationMethodCode\": \"002\",  \"prescriptionInfo\": {    \"vision\": null,    \"perspectiveTypeCode\": \"004\",    \"eyepointRight\": 1.0,    \"eyepointLeft\": -1.0,    \"pdRight\": 40.00,    \"pdLeft\": 60.00,    \"sphRight\": 29.00,    \"sphLeft\": 26.75,    \"cylRight\": 8.75,    \"cylLeft\": -1.50,    \"axisRight\": 180,    \"axisLeft\": 170,    \"addRight\": 9.00,    \"addLeft\": 2.50,    \"prismFlag\": true,    \"prism01Right\": 1.00,    \"prism01Left\": 1.00,    \"baseHRight\": \"BO\",    \"baseHLeft\": \"BO\",    \"prism02Right\": 0.50,    \"prism02Left\": 0.50,    \"baseVRight\": \"BU\",    \"baseVLeft\": \"BD\"  },  \"prescriptionExpiration\": \"2025-12-24T08:00:00\" }",
        "registeredPreparation2": "aaaaa",
        "registeredDeletedFlag": 0,
        "registeredRegisteredUserId": "STAFF_A",
        "registeredRegisteredProgram": "550e8400-e29b-41d4-a716-446655440000",
        "registeredRegisteredDatetime": "2024-10-31T18:48:12",
        "registeredUpdatedUserId": "STAFF_A",
        "registeredUpdatedProgram": "550e8400-e29b-41d4-a716-446655440000",
        "registeredUpdatedDatetime": "2024-10-31T18:48:12",
        "registeredOptimisticLockVerNo": 1,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const getCartInfoResponse_度数登録_vision設定 = {
  "cart": {
    "cartId": 1,
    "customerName": "John Smith",
    "phoneNumber": "4158726498",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "250212US000001",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000001-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "F1",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "John Smith",
        "phoneNumber": "4158726498",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": null,
        "caseItemName": null,
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": 4,
        "registeredItemId": null,
        "registeredItemCategoryCode": "09",
        "registeredTaxClass": "0",
        "registeredListPrice": 0,
        "registeredDiscountPrice": 0,
        "registeredTaxPrice": 0,
        "registeredSalesPrice": 0,
        "registeredPreparation1": "{  \"prescriptionId\": null,  \"registrationMethodCode\": \"002\",  \"prescriptionInfo\": {    \"vision\": 1.0,    \"perspectiveTypeCode\": \"004\",    \"eyepointRight\": 1.0,    \"eyepointLeft\": -1.0,    \"pdRight\": 40.00,    \"pdLeft\": 60.00,    \"sphRight\": 29.00,    \"sphLeft\": 26.75,    \"cylRight\": 8.75,    \"cylLeft\": -1.50,    \"axisRight\": 180,    \"axisLeft\": 170,    \"addRight\": 9.00,    \"addLeft\": 2.50,    \"prismFlag\": true,    \"prism01Right\": 1.00,    \"prism01Left\": 1.00,    \"baseHRight\": \"BO\",    \"baseHLeft\": \"BO\",    \"prism02Right\": 0.50,    \"prism02Left\": 0.50,    \"baseVRight\": \"BU\",    \"baseVLeft\": \"BD\"  },  \"prescriptionExpiration\": \"2025-12-24T08:00:00\" }",
        "registeredPreparation2": "aaaaa",
        "registeredDeletedFlag": 0,
        "registeredRegisteredUserId": "STAFF_A",
        "registeredRegisteredProgram": "550e8400-e29b-41d4-a716-446655440000",
        "registeredRegisteredDatetime": "2024-10-31T18:48:12",
        "registeredUpdatedUserId": "STAFF_A",
        "registeredUpdatedProgram": "550e8400-e29b-41d4-a716-446655440000",
        "registeredUpdatedDatetime": "2024-10-31T18:48:12",
        "registeredOptimisticLockVerNo": 1,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};

export const getCartInfoResponse_カバレッジ取得_カート情報周り = {
  "cart": {
    "cartId": 1,
    "customerName": "John Smith",
    "phoneNumber": "4158726498",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "250212US000001",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000001-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "F1",
        "deliveryMethodCode": undefined,
        "deliveryDatetime": "2025-10-01",
        "deliveryStoreId": null,
        "customerName": undefined,
        "phoneNumber": undefined,
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": undefined,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": "Case None.",
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": null,
        "caseItemName": null,
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": 4,
        "registeredItemId": null,
        "registeredItemCategoryCode": "09",
        "registeredTaxClass": "0",
        "registeredListPrice": 0,
        "registeredDiscountPrice": 0,
        "registeredTaxPrice": 0,
        "registeredSalesPrice": 0,
        "registeredPreparation1": "{  \"prescriptionId\": null,  \"registrationMethodCode\": \"002\",  \"prescriptionInfo\": null,  \"prescriptionExpiration\": null, \"prescriptionRegistDate\": \"2025-12-24T08:00:00\" }",
        "registeredPreparation2": "aaaaa",
        "registeredDeletedFlag": 0,
        "registeredRegisteredUserId": "STAFF_A",
        "registeredRegisteredProgram": "550e8400-e29b-41d4-a716-446655440000",
        "registeredRegisteredDatetime": "2024-10-31T18:48:12",
        "registeredUpdatedUserId": "STAFF_A",
        "registeredUpdatedProgram": "550e8400-e29b-41d4-a716-446655440000",
        "registeredUpdatedDatetime": "2024-10-31T18:48:12",
        "registeredOptimisticLockVerNo": 1,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        //"lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const getCartInfoResponse_カバレッジ取得_オーダ情報周り = {
  "cart": {
    "cartId": 1,
    "customerName": "John Smith",
    "phoneNumber": "4158726498",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "250212US000001",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000001-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "John Smith",
        "phoneNumber": "4158726498",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": null,
        "caseItemName": null,
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": "LOP-P-110004",
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": "LOP-P-110004",
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const getCartInfoResponse_カバレッジ取得_レンズオプション設定_注文詳細 = {
  "cart": {
    "cartId": 1,
    "customerName": "John Smith",
    "phoneNumber": "4158726498",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "250212US000001",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000001-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "John Smith",
        "phoneNumber": "4158726498",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": null,
        "caseItemName": null,
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": 10,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": 11,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": 12,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": 13,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": 14,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const getCartInfoResponse_カバレッジ取得_itemGroups_undefined = {
  "cart": {
    "cartId": 1,
    "customerName": "John Smith",
    "phoneNumber": "4158726498",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "250212US000001",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": undefined
  }
};
export const getCartInfoResponse_カバレッジ取得_price_null = {
  "cart": {
    "cartId": 1,
    "customerName": "John Smith",
    "phoneNumber": "4158726498",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "250212US000001",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000001-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "John Smith",
        "phoneNumber": "4158726498",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": null,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": "test001",
        "caseItemName": "test001name",
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const getCartInfoResponse_カバレッジ取得_price_undefined = {
  "cart": {
    "cartId": 1,
    "customerName": "John Smith",
    "phoneNumber": "4158726498",
    "discountPrice": 0,
    "subtotal": 0,
    "totalDiscountPrice": 0,
    "totalTaxPrice": 0,
    "totalSalesPrice": 0,
    "receptionNumber": "250212US000001",
    "deletedFlag": 0,
    "registeredUserId": "STAFF_A",
    "registeredProgram": "STAFF_A",
    "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
    "updatedUserId": "STAFF_A",
    "updatedProgram": "STAFF_A",
    "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
    "optimisticLockVerNo": 1,
    "receptionStoreId": 1143416,
    "receptionStoreCode": "83005",
    "itemGroups": [
      {
        "lineitemGroupId": 1,
        "itemGroupCode": "250212US000001-1",
        "statusCode": "101",
        "callingStatusCode": "001",
        "callingNumber": "A1",
        "prescriptionRegistCode": "002",
        "deliveryMethodCode": "001",
        "deliveryDatetime": null,
        "deliveryStoreId": null,
        "customerName": "John Smith",
        "phoneNumber": "4158726498",
        "shippingAddressZip": null,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "isExchangeLens": true,
        "note": null,
        "discountPrice": 0,
        "subtotal": 0,
        "totalDiscountPrice": 0,
        "totalTaxPrice": 0,
        "salesPrice": 0,
        "deletedFlag": 0,
        "registeredUserId": "STAFF_A",
        "registeredProgram": "STAFF_A",
        "registeredDatetime": "yyyy-mm-ddThh:ms:ss",
        "updatedUserId": "STAFF_A",
        "updatedProgram": "STAFF_A",
        "updatedDatetime": "yyyy-mm-ddThh:ms:ss",
        "optimisticLockVerNo": 1,
        "deliveryStoreCode": null,
        "statusName": "Order New",
        "deliveryMethodName": null,
        "frameLineitemId": null,
        "frameItemId": null,
        "frameItemCategoryCode": null,
        "frameTaxClass": null,
        "frameListPrice": null,
        "frameDiscountPrice": null,
        "frameTaxPrice": null,
        "frameSalesPrice": null,
        "framePreparation1": null,
        "framePreparation2": null,
        "frameDeletedFlag": null,
        "frameRegisteredUserId": null,
        "frameRegisteredProgram": null,
        "frameRegisteredDatetime": null,
        "frameUpdatedUserId": null,
        "frameUpdatedProgram": null,
        "frameUpdatedDatetime": null,
        "frameOptimisticLockVerNo": null,
        "frameItemCode": null,
        "frameItemName": null,
        "frameItemNameKana": null,
        "frameItemNameEnglish": null,
        "frameItemNameSimplefied": null,
        "frameItemNameTraditional": null,
        "caseLineitemId": null,
        "caseItemId": null,
        "caseItemCategoryCode": null,
        "caseTaxClass": null,
        "caseListPrice": null,
        "caseDiscountPrice": null,
        "caseTaxPrice": null,
        "caseSalesPrice": undefined,
        "casePreparation1": null,
        "casePreparation2": null,
        "caseDeletedFlag": null,
        "caseRegisteredUserId": null,
        "caseRegisteredProgram": null,
        "caseRegisteredDatetime": null,
        "caseUpdatedUserId": null,
        "caseUpdatedProgram": null,
        "caseUpdatedDatetime": null,
        "caseOptimisticLockVerNo": null,
        "caseItemCode": "test001",
        "caseItemName": "test001name",
        "caseItemNameKana": null,
        "caseItemNameEnglish": null,
        "caseItemNameSimplefied": null,
        "caseItemNameTraditional": null,
        "cerritoLineitemId": null,
        "cerritoItemId": null,
        "cerritoItemCategoryCode": null,
        "cerritoTaxClass": null,
        "cerritoListPrice": null,
        "cerritoDiscountPrice": null,
        "cerritoTaxPrice": null,
        "cerritoSalesPrice": null,
        "cerritoPreparation1": null,
        "cerritoPreparation2": null,
        "cerritoDeletedFlag": null,
        "cerritoRegisteredUserId": null,
        "cerritoRegisteredProgram": null,
        "cerritoRegisteredDatetime": null,
        "cerritoUpdatedUserId": null,
        "cerritoUpdatedProgram": null,
        "cerritoUpdatedDatetime": null,
        "cerritoOptimisticLockVerNo": null,
        "cerritoItemCode": null,
        "cerritoItemName": null,
        "cerritoItemNameKana": null,
        "cerritoItemNameEnglish": null,
        "cerritoItemNameSimplefied": null,
        "cerritoItemNameTraditional": null,
        "lensRightLineitemId": null,
        "lensRightItemId": null,
        "lensRightItemCategoryCode": null,
        "lensRightTaxClass": null,
        "lensRightListPrice": null,
        "lensRightDiscountPrice": null,
        "lensRightTaxPrice": null,
        "lensRightSalesPrice": null,
        "lensRightPreparation1": null,
        "lensRightPreparation2": null,
        "lensRightDeletedFlag": null,
        "lensRightRegisteredUserId": null,
        "lensRightRegisteredProgram": null,
        "lensRightRegisteredDatetime": null,
        "lensRightUpdatedUserId": null,
        "lensRightUpdatedProgram": null,
        "lensRightUpdatedDatetime": null,
        "lensRightOptimisticLockVerNo": null,
        "lensRightItemCode": null,
        "lensRightItemName": null,
        "lensRightItemNameKana": null,
        "lensRightItemNameEnglish": null,
        "lensRightItemNameSimplefied": null,
        "lensRightItemNameTraditional": null,
        "lensLeftLineitemId": null,
        "lensLeftItemId": null,
        "lensLeftItemCategoryCode": null,
        "lensLeftTaxClass": null,
        "lensLeftListPrice": null,
        "lensLeftDiscountPrice": null,
        "lensLeftTaxPrice": null,
        "lensLeftSalesPrice": null,
        "lensLeftPreparation1": null,
        "lensLeftPreparation2": null,
        "lensLeftDeletedFlag": null,
        "lensLeftRegisteredUserId": null,
        "lensLeftRegisteredProgram": null,
        "lensLeftRegisteredDatetime": null,
        "lensLeftUpdatedUserId": null,
        "lensLeftUpdatedProgram": null,
        "lensLeftUpdatedDatetime": null,
        "lensLeftOptimisticLockVerNo": null,
        "lensLeftItemCode": null,
        "lensLeftItemName": null,
        "lensLeftItemNameKana": null,
        "lensLeftItemNameEnglish": null,
        "lensLeftItemNameSimplefied": null,
        "lensLeftItemNameTraditional": null,
        "registeredLineitemId": null,
        "registeredItemId": null,
        "registeredItemCategoryCode": null,
        "registeredTaxClass": null,
        "registeredListPrice": null,
        "registeredDiscountPrice": null,
        "registeredTaxPrice": null,
        "registeredSalesPrice": null,
        "registeredPreparation1": null,
        "registeredPreparation2": null,
        "registeredDeletedFlag": null,
        "registeredRegisteredUserId": null,
        "registeredRegisteredProgram": null,
        "registeredRegisteredDatetime": null,
        "registeredUpdatedUserId": null,
        "registeredUpdatedProgram": null,
        "registeredUpdatedDatetime": null,
        "registeredOptimisticLockVerNo": null,
        "lopSalesColorNameLineitemId": null,
        "lopSalesColorNameItemId": null,
        "lopSalesColorNameItemCategoryCode": null,
        "lopSalesColorNameTaxClass": null,
        "lopSalesColorNameListPrice": null,
        "lopSalesColorNameDiscountPrice": null,
        "lopSalesColorNameTaxPrice": null,
        "lopSalesColorNameSalesPrice": null,
        "lopSalesColorNamePreparation1": null,
        "lopSalesColorNamePreparation2": null,
        "lopSalesColorNameDeletedFlag": null,
        "lopSalesColorNameRegisteredUserId": null,
        "lopSalesColorNameRegisteredProgram": null,
        "lopSalesColorNameRegisteredDatetime": null,
        "lopSalesColorNameUpdatedUserId": null,
        "lopSalesColorNameUpdatedProgram": null,
        "lopSalesColorNameUpdatedDatetime": null,
        "lopSalesColorNameOptimisticLockVerNo": null,
        "lopSalesColorNameLensOptionCode": null,
        "lopSalesColorNameLensOptionName": null,
        "lopSalesLensSpecLineitemId": null,
        "lopSalesLensSpecItemId": null,
        "lopSalesLensSpecItemCategoryCode": null,
        "lopSalesLensSpecTaxClass": null,
        "lopSalesLensSpecListPrice": null,
        "lopSalesLensSpecDiscountPrice": null,
        "lopSalesLensSpecTaxPrice": null,
        "lopSalesLensSpecSalesPrice": null,
        "lopSalesLensSpecPreparation1": null,
        "lopSalesLensSpecPreparation2": null,
        "lopSalesLensSpecDeletedFlag": null,
        "lopSalesLensSpecRegisteredUserId": null,
        "lopSalesLensSpecRegisteredProgram": null,
        "lopSalesLensSpecRegisteredDatetime": null,
        "lopSalesLensSpecUpdatedUserId": null,
        "lopSalesLensSpecUpdatedProgram": null,
        "lopSalesLensSpecUpdatedDatetime": null,
        "lopSalesLensSpecOptimisticLockVerNo": null,
        "lopSalesLensSpecLensOptionCode": null,
        "lopSalesLensSpecLensOptionName": null,
        "lopFocusCategoryLineitemId": null,
        "lopFocusCategoryItemId": null,
        "lopFocusCategoryItemCategoryCode": null,
        "lopFocusCategoryTaxClass": null,
        "lopFocusCategoryListPrice": null,
        "lopFocusCategoryDiscountPrice": null,
        "lopFocusCategoryTaxPrice": null,
        "lopFocusCategorySalesPrice": null,
        "lopFocusCategoryPreparation1": null,
        "lopFocusCategoryPreparation2": null,
        "lopFocusCategoryDeletedFlag": null,
        "lopFocusCategoryRegisteredUserId": null,
        "lopFocusCategoryRegisteredProgram": null,
        "lopFocusCategoryRegisteredDatetime": null,
        "lopFocusCategoryUpdatedUserId": null,
        "lopFocusCategoryUpdatedProgram": null,
        "lopFocusCategoryUpdatedDatetime": null,
        "lopFocusCategoryOptimisticLockVerNo": null,
        "lopFocusCategoryLensOptionCode": null,
        "lopFocusCategoryLensOptionName": null,
        "lopProgressiveCategoryLineitemId": null,
        "lopProgressiveCategoryItemId": null,
        "lopProgressiveCategoryItemCategoryCode": null,
        "lopProgressiveCategoryTaxClass": null,
        "lopProgressiveCategoryListPrice": null,
        "lopProgressiveCategoryDiscountPrice": null,
        "lopProgressiveCategoryTaxPrice": null,
        "lopProgressiveCategorySalesPrice": null,
        "lopProgressiveCategoryPreparation1": null,
        "lopProgressiveCategoryPreparation2": null,
        "lopProgressiveCategoryDeletedFlag": null,
        "lopProgressiveCategoryRegisteredUserId": null,
        "lopProgressiveCategoryRegisteredProgram": null,
        "lopProgressiveCategoryRegisteredDatetime": null,
        "lopProgressiveCategoryUpdatedUserId": null,
        "lopProgressiveCategoryUpdatedProgram": null,
        "lopProgressiveCategoryUpdatedDatetime": null,
        "lopProgressiveCategoryOptimisticLockVerNo": null,
        "lopProgressiveCategoryLensOptionCode": null,
        "lopProgressiveCategoryLensOptionName": null,
        "lopRefractiveIndexNameLineitemId": null,
        "lopRefractiveIndexNameItemId": null,
        "lopRefractiveIndexNameItemCategoryCode": null,
        "lopRefractiveIndexNameTaxClass": null,
        "lopRefractiveIndexNameListPrice": null,
        "lopRefractiveIndexNameDiscountPrice": null,
        "lopRefractiveIndexNameTaxPrice": null,
        "lopRefractiveIndexNameSalesPrice": null,
        "lopRefractiveIndexNamePreparation1": null,
        "lopRefractiveIndexNamePreparation2": null,
        "lopRefractiveIndexNameDeletedFlag": null,
        "lopRefractiveIndexNameRegisteredUserId": null,
        "lopRefractiveIndexNameRegisteredProgram": null,
        "lopRefractiveIndexNameRegisteredDatetime": null,
        "lopRefractiveIndexNameUpdatedUserId": null,
        "lopRefractiveIndexNameUpdatedProgram": null,
        "lopRefractiveIndexNameUpdatedDatetime": null,
        "lopRefractiveIndexNameOptimisticLockVerNo": null,
        "lopRefractiveIndexNameLensOptionCode": null,
        "lopRefractiveIndexNameLensOptionName": null,
        "lopRimlessFinishingCategoryLineitemId": null,
        "lopRimlessFinishingCategoryItemId": null,
        "lopRimlessFinishingCategoryItemCategoryCode": null,
        "lopRimlessFinishingCategoryTaxClass": null,
        "lopRimlessFinishingCategoryListPrice": null,
        "lopRimlessFinishingCategoryDiscountPrice": null,
        "lopRimlessFinishingCategoryTaxPrice": null,
        "lopRimlessFinishingCategorySalesPrice": null,
        "lopRimlessFinishingCategoryPreparation1": null,
        "lopRimlessFinishingCategoryPreparation2": null,
        "lopRimlessFinishingCategoryDeletedFlag": null,
        "lopRimlessFinishingCategoryRegisteredUserId": null,
        "lopRimlessFinishingCategoryRegisteredProgram": null,
        "lopRimlessFinishingCategoryRegisteredDatetime": null,
        "lopRimlessFinishingCategoryUpdatedUserId": null,
        "lopRimlessFinishingCategoryUpdatedProgram": null,
        "lopRimlessFinishingCategoryUpdatedDatetime": null,
        "lopRimlessFinishingCategoryOptimisticLockVerNo": null,
        "lopRimlessFinishingCategoryLensOptionCode": null,
        "lopRimlessFinishingCategoryLensOptionName": null,
        "lensReplacementTypeCode": "LOP-I110001",
      }
    ]
  }
};
export const getCartInfoResponse_throw404 = {
  conditions: "throw",
  status: 404
};


export const getOrderByReceptionNumberResponse = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": 0,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "string",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
          "delivery": {
              "customerName": "David Williams",
              "deliveryBoxNumber": "string",
              "deliveryDateTime": "2024-11-30T11:59:59",
              "deliveryMethodCode": "002",
              "deliveryMethodName": "Hand over",
              "deliveryStatus": "string",
              "deliveryStoreCode": "string",
              "deliveryStoreId": 0,
              "deliveryStoreName": "string",
              "glassLineCode": "example",
              "glassLineDeliveryCode": "example",
              "orderCode": "example",
              "phoneNumber": "4158726498",
              "registerPrincipal": "example",
              "registerTimestamp": 0,
              "shippingAddress1": null,
              "shippingAddress2": null,
              "shippingAddress3": null,
              "shippingAddress4": null,
              "shippingAddressZip": null,
              "updatePrincipal": null,
              "updateTimestamp": 0,
              "version": 1
          },
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": 0,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": 0,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": null,
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": 0,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": 0,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": 0,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": 0,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": 0,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": true,
          "note": null,
          "orderCode": "example",
          "powerId": 0,
          "prescriptionId": 0,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};
export const getOrderByReceptionNumberResponse_保証情報あり = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": 0,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "string",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
          "delivery": {
              "customerName": "David Williams",
              "deliveryBoxNumber": "string",
              "deliveryDateTime": "2024-11-30T11:59:59",
              "deliveryMethodCode": "002",
              "deliveryMethodName": "Hand over",
              "isWaitingLens": true,
              "deliveryStatus": "string",
              "deliveryStoreCode": "string",
              "deliveryStoreId": 0,
              "deliveryStoreName": "string",
              "glassLineCode": "example",
              "glassLineDeliveryCode": "example",
              "orderCode": "example",
              "phoneNumber": "4158726498",
              "registerPrincipal": "example",
              "registerTimestamp": 0,
              "shippingAddress1": null,
              "shippingAddress2": null,
              "shippingAddress3": null,
              "shippingAddress4": null,
              "shippingAddressZip": null,
              "updatePrincipal": null,
              "updateTimestamp": 0,
              "version": 1
          },
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": 0,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensReplacementTypeItemCategoryCode": "string",
          "lensReplacementTypeItemCode": "Y9100T",
          "lensReplacementTypeItemId": 0,
          "lensReplacementTypeItemName": "string",
          "lensReplacementTypeLineItemId": 0,
          "lensReplacementTypeListPrice": 0,
          "lensReplacementTypePreparation1": "string",
          "lensReplacementTypePreparation2": "string",
          "lensReplacementTypeRegisterPrincipal": "example",
          "lensReplacementTypeRegisterTimestamp": 0,
          "lensReplacementTypeSellingPrice": 0,
          "lensReplacementTypeTaxGroupCode": "string",
          "lensReplacementTypeUpdatePrincipal": "example",
          "lensReplacementTypeUpdateTimestamp": 0,
          "lensReplacementTypeVersion": 1,          
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": 0,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": null,
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": 0,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": 0,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": 0,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": 0,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": 0,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": true,
          "note": null,
          "orderCode": "example",
          "orderType": "LENSE_REPLACE",
          "powerId": 0,
          "prescriptionId": 0,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};

export const getOrderByReceptionNumberResponse_保証情報あり_レンズ交換分類商品コードなし = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": 0,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "string",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
          "delivery": {
              "customerName": "David Williams",
              "deliveryBoxNumber": "string",
              "deliveryDateTime": "2024-11-30T11:59:59",
              "deliveryMethodCode": "002",
              "deliveryMethodName": "Hand over",
              "isWaitingLens": true,
              "deliveryStatus": "string",
              "deliveryStoreCode": "string",
              "deliveryStoreId": 0,
              "deliveryStoreName": "string",
              "glassLineCode": "example",
              "glassLineDeliveryCode": "example",
              "orderCode": "example",
              "phoneNumber": "4158726498",
              "registerPrincipal": "example",
              "registerTimestamp": 0,
              "shippingAddress1": null,
              "shippingAddress2": null,
              "shippingAddress3": null,
              "shippingAddress4": null,
              "shippingAddressZip": null,
              "updatePrincipal": null,
              "updateTimestamp": 0,
              "version": 1
          },
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": 0,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensReplacementTypeItemCategoryCode": "string",
          "lensReplacementTypeItemCode": null,
          "lensReplacementTypeItemId": 0,
          "lensReplacementTypeItemName": "string",
          "lensReplacementTypeLineItemId": 0,
          "lensReplacementTypeListPrice": 0,
          "lensReplacementTypePreparation1": "string",
          "lensReplacementTypePreparation2": "string",
          "lensReplacementTypeRegisterPrincipal": "example",
          "lensReplacementTypeRegisterTimestamp": 0,
          "lensReplacementTypeSellingPrice": 0,
          "lensReplacementTypeTaxGroupCode": "string",
          "lensReplacementTypeUpdatePrincipal": "example",
          "lensReplacementTypeUpdateTimestamp": 0,
          "lensReplacementTypeVersion": 1,          
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": 0,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": null,
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": 0,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": 0,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": 0,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": 0,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": 0,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": true,
          "note": null,
          "orderCode": "example",
          "orderType": "LENSE_REPLACE",
          "powerId": 0,
          "prescriptionId": 0,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};

export const getOrderByReceptionNumberResponse_カバレッジ取得_度数情報周り = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": 0,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "string",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
          "delivery": {
              "customerName": "David Williams",
              "deliveryBoxNumber": "string",
              "deliveryDateTime": "2024-11-30T11:59:59",
              "deliveryMethodCode": "002",
              "deliveryMethodName": "Hand over",
              "deliveryStatus": "string",
              "deliveryStoreCode": "string",
              "deliveryStoreId": 0,
              "deliveryStoreName": "string",
              "glassLineCode": "example",
              "glassLineDeliveryCode": "example",
              "orderCode": "example",
              "phoneNumber": "4158726498",
              "registerPrincipal": "example",
              "registerTimestamp": 0,
              "shippingAddress1": null,
              "shippingAddress2": null,
              "shippingAddress3": null,
              "shippingAddress4": null,
              "shippingAddressZip": null,
              "updatePrincipal": null,
              "updateTimestamp": 0,
              "version": 1
          },
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": 0,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": 0,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": null,
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": 0,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": 0,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": 0,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": 0,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": 0,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": true,
          "note": null,
          "orderCode": "example",
          "powerId": 0,
          "prescriptionId": 0,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};
export const getOrderByReceptionNumberResponse_カバレッジ取得_度数情報周り_poweridなし = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": 0,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "string",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
          "delivery": {
              "customerName": "David Williams",
              "deliveryBoxNumber": "string",
              "deliveryDateTime": "2024-11-30T11:59:59",
              "deliveryMethodCode": "002",
              "deliveryMethodName": "Hand over",
              "deliveryStatus": "string",
              "deliveryStoreCode": "string",
              "deliveryStoreId": 0,
              "deliveryStoreName": "string",
              "glassLineCode": "example",
              "glassLineDeliveryCode": "example",
              "orderCode": "example",
              "phoneNumber": "4158726498",
              "registerPrincipal": "example",
              "registerTimestamp": 0,
              "shippingAddress1": null,
              "shippingAddress2": null,
              "shippingAddress3": null,
              "shippingAddress4": null,
              "shippingAddressZip": null,
              "updatePrincipal": null,
              "updateTimestamp": 0,
              "version": 1
          },
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": 0,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": 0,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": null,
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": 0,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": 0,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": 0,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": 0,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": 0,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": true,
          "note": null,
          "orderCode": "example",
          "powerId": undefined,
          "prescriptionId": 0,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};
export const getOrderByReceptionNumberResponse_カバレッジ取得_オーダ情報周り = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": 0,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "string",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
          "delivery": undefined,
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": 0,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": undefined,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": null,
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": undefined,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": undefined,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": undefined,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": undefined,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": undefined,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": true,
          "note": null,
          "orderCode": "example",
          "powerId": 0,
          "prescriptionId": undefined,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};
export const getOrderByReceptionNumberResponse_カバレッジ取得_CORRIDOR_LENGTH_11MM = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": 0,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "string",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
          "delivery": undefined,
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": 0,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": undefined,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": "LOP-P-110004",
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": undefined,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": undefined,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": undefined,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": undefined,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": undefined,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": true,
          "note": null,
          "orderCode": "example",
          "powerId": 0,
          "prescriptionId": undefined,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};
export const getOrderByReceptionNumberResponse_カバレッジ取得_CORRIDOR_LENGTH_13MM = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": 0,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "string",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
          "delivery": undefined,
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": 0,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": null,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": "LOP-P-110005",
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": null,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": null,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": null,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": null,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": undefined,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": undefined,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": true,
          "note": null,
          "orderCode": "example",
          "powerId": 0,
          "prescriptionId": undefined,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};
export const getOrderByReceptionNumberResponse_カバレッジ取得_商品グループ情報設定_注文詳細 = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": undefined,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "Case None.",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
//          "delivery": undefined,
          "delivery": {
              "customerName": "David Williams",
              "deliveryBoxNumber": "string",
              "deliveryDateTime": "2024-11-30T11:59:59",
              "deliveryMethodCode": "002",
              "deliveryMethodName": "Hand over",
              "deliveryStatus": "string",
              "deliveryStoreCode": "string",
              "deliveryStoreId": 0,
              "deliveryStoreName": "string",
              "glassLineCode": "example",
              "glassLineDeliveryCode": "example",
              "orderCode": "example",
              "phoneNumber": "4158726498",
              "registerPrincipal": "example",
              "registerTimestamp": 0,
              "shippingAddress1": null,
              "shippingAddress2": null,
              "shippingAddress3": null,
              "shippingAddress4": null,
              "shippingAddressZip": null,
              "updatePrincipal": null,
              "updateTimestamp": 0,
              "version": 1
          },
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": undefined,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": undefined,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": "LOP-P-110004",
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": undefined,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": undefined,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": undefined,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": undefined,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": undefined,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": undefined,
          "note": null,
          "orderCode": "example",
          "powerId": 0,
          "prescriptionId": undefined,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};
export const getOrderByReceptionNumberResponse_カバレッジ取得_商品グループ情報設定_注文詳細_レンズ交換判定true = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": undefined,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "LENSE_REPLACE",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
//          "delivery": undefined,
          "delivery": {
              "customerName": "David Williams",
              "deliveryBoxNumber": "string",
              "deliveryDateTime": "2024-11-30T11:59:59",
              "deliveryMethodCode": "002",
              "deliveryMethodName": "Hand over",
              "deliveryStatus": "string",
              "deliveryStoreCode": "string",
              "deliveryStoreId": 0,
              "deliveryStoreName": "string",
              "glassLineCode": "example",
              "glassLineDeliveryCode": "example",
              "orderCode": "example",
              "phoneNumber": "4158726498",
              "registerPrincipal": "example",
              "registerTimestamp": 0,
              "shippingAddress1": null,
              "shippingAddress2": null,
              "shippingAddress3": null,
              "shippingAddress4": null,
              "shippingAddressZip": null,
              "updatePrincipal": null,
              "updateTimestamp": 0,
              "version": 1
          },
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": undefined,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": undefined,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": "LOP-P-110004",
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": undefined,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": undefined,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": undefined,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": undefined,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": undefined,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": undefined,
          "note": null,
          "orderCode": "example",
          "powerId": 0,
          "prescriptionId": undefined,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};
export const getOrderByReceptionNumberResponse_カバレッジ取得_discountLines_undefined = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": undefined,
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "Case None.",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
//          "delivery": undefined,
          "delivery": {
              "customerName": "David Williams",
              "deliveryBoxNumber": "string",
              "deliveryDateTime": "2024-11-30T11:59:59",
              "deliveryMethodCode": "002",
              "deliveryMethodName": "Hand over",
              "deliveryStatus": "string",
              "deliveryStoreCode": "string",
              "deliveryStoreId": 0,
              "deliveryStoreName": "string",
              "glassLineCode": "example",
              "glassLineDeliveryCode": "example",
              "orderCode": "example",
              "phoneNumber": "4158726498",
              "registerPrincipal": "example",
              "registerTimestamp": 0,
              "shippingAddress1": null,
              "shippingAddress2": null,
              "shippingAddress3": null,
              "shippingAddress4": null,
              "shippingAddressZip": null,
              "updatePrincipal": null,
              "updateTimestamp": 0,
              "version": 1
          },
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": undefined,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": undefined,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": "LOP-P-110004",
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": undefined,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": undefined,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": undefined,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": undefined,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": undefined,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": undefined,
          "note": null,
          "orderCode": "example",
          "powerId": 0,
          "prescriptionId": undefined,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};
export const getOrderByReceptionNumberResponse_カバレッジ取得_deliveryStatus_BEFORE_PREPARING = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": 0,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "string",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
          "delivery": {
              "customerName": "David Williams",
              "deliveryBoxNumber": "string",
              "deliveryDateTime": "2024-11-30T11:59:59",
              "deliveryMethodCode": "002",
              "deliveryMethodName": "Hand over",
              "deliveryStatus": "BEFORE_PREPARING",
              "deliveryStoreCode": "string",
              "deliveryStoreId": 0,
              "deliveryStoreName": "string",
              "glassLineCode": "example",
              "glassLineDeliveryCode": "example",
              "orderCode": "example",
              "phoneNumber": "4158726498",
              "registerPrincipal": "example",
              "registerTimestamp": 0,
              "shippingAddress1": null,
              "shippingAddress2": null,
              "shippingAddress3": null,
              "shippingAddress4": null,
              "shippingAddressZip": null,
              "updatePrincipal": null,
              "updateTimestamp": 0,
              "version": 1
          },
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": 0,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": 0,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": null,
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": 0,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": 0,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": 0,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": 0,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": 0,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": true,
          "note": null,
          "orderCode": "example",
          "powerId": 0,
          "prescriptionId": 0,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};
export const getOrderByReceptionNumberResponse_カバレッジ取得_deliveryStatus_DELIVERY_PREPARING = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": 0,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "string",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
          "delivery": {
              "customerName": "David Williams",
              "deliveryBoxNumber": "string",
              "deliveryDateTime": "2024-11-30T11:59:59",
              "deliveryMethodCode": "002",
              "deliveryMethodName": "Hand over",
              "deliveryStatus": "DELIVERY_PREPARING",
              "deliveryStoreCode": "string",
              "deliveryStoreId": 0,
              "deliveryStoreName": "string",
              "glassLineCode": "example",
              "glassLineDeliveryCode": "example",
              "orderCode": "example",
              "phoneNumber": "4158726498",
              "registerPrincipal": "example",
              "registerTimestamp": 0,
              "shippingAddress1": null,
              "shippingAddress2": null,
              "shippingAddress3": null,
              "shippingAddress4": null,
              "shippingAddressZip": null,
              "updatePrincipal": null,
              "updateTimestamp": 0,
              "version": 1
          },
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": 0,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": 0,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": null,
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": 0,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": 0,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": 0,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": 0,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": 0,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": true,
          "note": null,
          "orderCode": "example",
          "powerId": 0,
          "prescriptionId": 0,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};
export const getOrderByReceptionNumberResponse_カバレッジ取得_deliveryStatus_READY_FOR_DELIVERY = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": 0,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "string",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
          "delivery": {
              "customerName": "David Williams",
              "deliveryBoxNumber": "string",
              "deliveryDateTime": "2024-11-30T11:59:59",
              "deliveryMethodCode": "002",
              "deliveryMethodName": "Hand over",
              "deliveryStatus": "READY_FOR_DELIVERY",
              "deliveryStoreCode": "string",
              "deliveryStoreId": 0,
              "deliveryStoreName": "string",
              "glassLineCode": "example",
              "glassLineDeliveryCode": "example",
              "orderCode": "example",
              "phoneNumber": "4158726498",
              "registerPrincipal": "example",
              "registerTimestamp": 0,
              "shippingAddress1": null,
              "shippingAddress2": null,
              "shippingAddress3": null,
              "shippingAddress4": null,
              "shippingAddressZip": null,
              "updatePrincipal": null,
              "updateTimestamp": 0,
              "version": 1
          },
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": 0,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": 0,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": null,
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": 0,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": 0,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": 0,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": 0,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": 0,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": true,
          "note": null,
          "orderCode": "example",
          "powerId": 0,
          "prescriptionId": 0,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};
export const getOrderByReceptionNumberResponse_カバレッジ取得_deliveryStatus_DELIVERED = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": 0,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "string",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
          "delivery": {
              "customerName": "David Williams",
              "deliveryBoxNumber": "string",
              "deliveryDateTime": "2024-11-30T11:59:59",
              "deliveryMethodCode": "002",
              "deliveryMethodName": "Hand over",
              "deliveryStatus": "DELIVERED",
              "deliveryStoreCode": "string",
              "deliveryStoreId": 0,
              "deliveryStoreName": "string",
              "glassLineCode": "example",
              "glassLineDeliveryCode": "example",
              "orderCode": "example",
              "phoneNumber": "4158726498",
              "registerPrincipal": "example",
              "registerTimestamp": 0,
              "shippingAddress1": null,
              "shippingAddress2": null,
              "shippingAddress3": null,
              "shippingAddress4": null,
              "shippingAddressZip": null,
              "updatePrincipal": null,
              "updateTimestamp": 0,
              "version": 1
          },
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": 0,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": 0,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": null,
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": 0,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": 0,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": 0,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": 0,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": 0,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": true,
          "note": null,
          "orderCode": "example",
          "powerId": 0,
          "prescriptionId": 0,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};
export const getOrderByReceptionNumberResponse_カバレッジ取得_deliveryStatus_DELIVERY_CANCELED = {
  "cartId": 3,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "David Williams",
  "discountLines": [
      {
          "discountAmount": 0,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [
      {
          "allocatedLocationCode": "string",
          "callingNumber": "A3",
          "cancelDateTime": "0",
          "cancelReasonCode": "example",
          "caseItemCategoryCode": "string",
          "caseItemCode": null,
          "caseItemId": 0,
          "caseItemName": null,
          "caseItemNameEnglish": "string",
          "caseItemNameKana": "string",
          "caseItemNameSimplified": "string",
          "caseItemNameTraditional": "string",
          "caseLineItemId": 0,
          "caseListPrice": 0,
          "casePreparation1": "string",
          "casePreparation2": "string",
          "caseRegisterPrincipal": "example",
          "caseRegisterTimestamp": 0,
          "caseSellingPrice": null,
          "caseTaxGroupCode": "string",
          "caseUpdatePrincipal": "example",
          "caseUpdateTimestamp": 0,
          "caseVersion": 1,
          "cerritoItemCategoryCode": "string",
          "cerritoItemCode": "string",
          "cerritoItemId": 0,
          "cerritoItemName": "string",
          "cerritoItemNameEnglish": "string",
          "cerritoItemNameKana": "string",
          "cerritoItemNameSimplified": "string",
          "cerritoItemNameTraditional": "string",
          "cerritoLineItemId": 0,
          "cerritoListPrice": 0,
          "cerritoPreparation1": "string",
          "cerritoPreparation2": "string",
          "cerritoRegisterPrincipal": "example",
          "cerritoRegisterTimestamp": 0,
          "cerritoSellingPrice": 0,
          "cerritoTaxGroupCode": "string",
          "cerritoUpdatePrincipal": "example",
          "cerritoUpdateTimestamp": 0,
          "cerritoVersion": 1,
          "delivery": {
              "customerName": "David Williams",
              "deliveryBoxNumber": "string",
              "deliveryDateTime": "2024-11-30T11:59:59",
              "deliveryMethodCode": "002",
              "deliveryMethodName": "Hand over",
              "deliveryStatus": "DELIVERY_CANCELED",
              "deliveryStoreCode": "string",
              "deliveryStoreId": 0,
              "deliveryStoreName": "string",
              "glassLineCode": "example",
              "glassLineDeliveryCode": "example",
              "orderCode": "example",
              "phoneNumber": "4158726498",
              "registerPrincipal": "example",
              "registerTimestamp": 0,
              "shippingAddress1": null,
              "shippingAddress2": null,
              "shippingAddress3": null,
              "shippingAddress4": null,
              "shippingAddressZip": null,
              "updatePrincipal": null,
              "updateTimestamp": 0,
              "version": 1
          },
          "frameItemCategoryCode": "string",
          "frameItemCode": null,
          "frameItemId": 0,
          "frameItemName": null,
          "frameItemNameEnglish": "string",
          "frameItemNameKana": "string",
          "frameItemNameSimplified": "string",
          "frameItemNameTraditional": "string",
          "frameLineItemId": 0,
          "frameListPrice": 0,
          "framePreparation1": "string",
          "framePreparation2": "string",
          "frameRegisterPrincipal": "example",
          "frameRegisterTimestamp": 0,
          "frameSellingPrice": 0,
          "frameTaxGroupCode": "string",
          "frameUpdatePrincipal": "example",
          "frameUpdateTimestamp": 0,
          "frameVersion": 1,
          "glassLineCode": "250404US000001-1",
          "glassLineId": "string",
          "itemGroupCode": "250404US000001-1",
          "lensLeftItemCategoryCode": "string",
          "lensLeftItemCode": "string",
          "lensLeftItemId": 0,
          "lensLeftItemName": "string",
          "lensLeftItemNameEnglish": "string",
          "lensLeftItemNameKana": "string",
          "lensLeftItemNameSimplified": "string",
          "lensLeftItemNameTraditional": "string",
          "lensLeftLineItemId": 0,
          "lensLeftPreparation1": "string",
          "lensLeftPreparation2": "string",
          "lensLeftRegisterPrincipal": "example",
          "lensLeftRegisterTimestamp": 0,
          "lensLeftUpdatePrincipal": "example",
          "lensLeftUpdateTimestamp": 0,
          "lensLeftVersion": 1,
          "lensPurchased": true,
          "lensRightItemCategoryCode": "string",
          "lensRightItemCode": "string",
          "lensRightItemId": 0,
          "lensRightItemName": "string",
          "lensRightItemNameEnglish": "string",
          "lensRightItemNameKana": "string",
          "lensRightItemNameSimplified": "string",
          "lensRightItemNameTraditional": "string",
          "lensRightLineItemId": 0,
          "lensRightPreparation1": "string",
          "lensRightPreparation2": "string",
          "lensRightRegisterPrincipal": "example",
          "lensRightRegisterTimestamp": 0,
          "lensRightUpdatePrincipal": "example",
          "lensRightUpdateTimestamp": 0,
          "lensRightVersion": 1,
          "lineItemGroupId": 0,
          "lopFocusCategoryItemCategoryCode": null,
          "lopFocusCategoryItemCode": null,
          "lopFocusCategoryItemId": 0,
          "lopFocusCategoryItemName": null,
          "lopFocusCategoryLineItemId": 0,
          "lopFocusCategoryListPrice": 0,
          "lopFocusCategoryPreparation1": null,
          "lopFocusCategoryPreparation2": null,
          "lopFocusCategoryRegisterPrincipal": null,
          "lopFocusCategoryRegisterTimestamp": 0,
          "lopFocusCategorySellingPrice": 0,
          "lopFocusCategoryTaxGroupCode": null,
          "lopFocusCategoryUpdatePrincipal": null,
          "lopFocusCategoryUpdateTimestamp": 0,
          "lopFocusCategoryVersion": 1,
          "lopProgressiveCategoryItemCategoryCode": null,
          "lopProgressiveCategoryItemCode": null,
          "lopProgressiveCategoryItemId": 0,
          "lopProgressiveCategoryItemName": null,
          "lopProgressiveCategoryLineItemId": 0,
          "lopProgressiveCategoryListPrice": 0,
          "lopProgressiveCategoryPreparation1": null,
          "lopProgressiveCategoryPreparation2": null,
          "lopProgressiveCategoryRegisterPrincipal": null,
          "lopProgressiveCategoryRegisterTimestamp": 0,
          "lopProgressiveCategorySellingPrice": 0,
          "lopProgressiveCategoryTaxGroupCode": null,
          "lopProgressiveCategoryUpdatePrincipal": null,
          "lopProgressiveCategoryUpdateTimestamp": 0,
          "lopProgressiveCategoryVersion": 1,
          "lopRefractiveIndexNameItemCategoryCode": null,
          "lopRefractiveIndexNameItemCode": null,
          "lopRefractiveIndexNameItemId": 0,
          "lopRefractiveIndexNameItemName": null,
          "lopRefractiveIndexNameLineItemId": 0,
          "lopRefractiveIndexNameListPrice": 0,
          "lopRefractiveIndexNamePreparation1": null,
          "lopRefractiveIndexNamePreparation2": null,
          "lopRefractiveIndexNameRegisterPrincipal": null,
          "lopRefractiveIndexNameRegisterTimestamp": 0,
          "lopRefractiveIndexNameSellingPrice": 0,
          "lopRefractiveIndexNameTaxGroupCode": null,
          "lopRefractiveIndexNameUpdatePrincipal": null,
          "lopRefractiveIndexNameUpdateTimestamp": 0,
          "lopRefractiveIndexNameVersion": 1,
          "lopRimlessFinishingCategoryItemCategoryCode": null,
          "lopRimlessFinishingCategoryItemCode": null,
          "lopRimlessFinishingCategoryItemId": 0,
          "lopRimlessFinishingCategoryItemName": null,
          "lopRimlessFinishingCategoryLineItemId": 0,
          "lopRimlessFinishingCategoryListPrice": 0,
          "lopRimlessFinishingCategoryPreparation1": null,
          "lopRimlessFinishingCategoryPreparation2": null,
          "lopRimlessFinishingCategoryRegisterPrincipal": null,
          "lopRimlessFinishingCategoryRegisterTimestamp": 0,
          "lopRimlessFinishingCategorySellingPrice": 0,
          "lopRimlessFinishingCategoryTaxGroupCode": null,
          "lopRimlessFinishingCategoryUpdatePrincipal": null,
          "lopRimlessFinishingCategoryUpdateTimestamp": 0,
          "lopRimlessFinishingCategoryVersion": 1,
          "lopSalesColorNameItemCategoryCode": null,
          "lopSalesColorNameItemCode": null,
          "lopSalesColorNameItemId": 0,
          "lopSalesColorNameItemName": null,
          "lopSalesColorNameLineItemId": 0,
          "lopSalesColorNameListPrice": 0,
          "lopSalesColorNamePreparation1": null,
          "lopSalesColorNamePreparation2": null,
          "lopSalesColorNameRegisterPrincipal": null,
          "lopSalesColorNameRegisterTimestamp": 0,
          "lopSalesColorNameSellingPrice": 0,
          "lopSalesColorNameTaxGroupCode": null,
          "lopSalesColorNameUpdatePrincipal": null,
          "lopSalesColorNameUpdateTimestamp": 0,
          "lopSalesColorNameVersion": 1,
          "lopSalesLensSpecItemCategoryCode": null,
          "lopSalesLensSpecItemCode": null,
          "lopSalesLensSpecItemId": 0,
          "lopSalesLensSpecItemName": null,
          "lopSalesLensSpecLineItemId": 0,
          "lopSalesLensSpecListPrice": 0,
          "lopSalesLensSpecPreparation1": null,
          "lopSalesLensSpecPreparation2": null,
          "lopSalesLensSpecRegisterPrincipal": null,
          "lopSalesLensSpecRegisterTimestamp": 0,
          "lopSalesLensSpecSellingPrice": 0,
          "lopSalesLensSpecTaxGroupCode": null,
          "lopSalesLensSpecUpdatePrincipal": null,
          "lopSalesLensSpecUpdateTimestamp": 0,
          "lopSalesLensSpecVersion": 1,
          "needsPurchaseLens": true,
          "note": null,
          "orderCode": "example",
          "powerId": 0,
          "prescriptionId": 0,
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "subtotalAmount": 0,
          "subtotalListAmount": 0,
          "subtotalSellingAmount": 0,
          "subtotalTaxAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "4158726498",
  "receptionDate": "1999-01-08",
  "receptionNumber": "250212US000001",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
};

export const getOrderByReceptionNumberNoItemResponse = {
  "cartId": 0,
  "channel": "string",
  "countryCodeAlpha2": "US",
  "currencyCode": "string",
  "customerId": null,
  "customerName": "Robert Moore",
  "discountLines": [
      {
          "discountAmount": 0,
          "discountCode": "string",
          "discountGlassLineItems": [
              {
                  "discountAmount": 0,
                  "discountCode": "string",
                  "discountGlassLineItemCode": "example",
                  "discountablePrice": 0,
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemCategoryCode": "string",
                  "itemCode": "string",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "salesItemTypes": [
                      {
                          "discountCode": "string",
                          "discountGlassLineItemCode": "example",
                          "discountGlassLineItemSalesItemTypeCode": "example",
                          "orderCode": "example",
                          "registerPrincipal": "example",
                          "registerTimestamp": 0,
                          "salesItemTypeAdminCode": "string",
                          "salesItemTypeFieldCode": "string",
                          "updatePrincipal": "example",
                          "updateTimestamp": 0,
                          "version": 1
                      }
                  ],
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "discountRatePercentage": 0,
          "discountReasonCode": "string",
          "discountType": "string",
          "discountableAmount": 0,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "feeLines": [
      {
          "feeAmount": 0,
          "feeCode": "string",
          "feeGlassLines": [
              {
                  "feeGlassLineCode": "example",
                  "feeLineCode": "example",
                  "glassLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxGroupCode": "string",
          "taxable": true,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "glassLines": [],
  "orderCode": "example",
  "orderDate": "1999-01-08",
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "payments": [
      {
          "orderCode": "example",
          "paymentAmount": 0,
          "paymentCode": "example",
          "paymentDateTime": "2024-11-30T11:59:59",
          "paymentMethod": "string",
          "paymentStatus": "string",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "phoneNumber": "string",
  "receptionDate": "1999-01-08",
  "receptionNumber": "string",
  "receptionStoreCode": "string",
  "receptionStoreId": 0,
  "receptionStoreName": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
      {
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": 0,
          "taxCode": "string",
          "taxFeeLines": [
              {
                  "feeLineCode": "example",
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxFeeLineCode": "example",
                  "taxRateCode": "string",
                  "taxableAmount": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGlassLineItems": [
              {
                  "glassLineCode": "example",
                  "glassLineItemCode": "example",
                  "itemId": 0,
                  "orderCode": "example",
                  "registerPrincipal": "example",
                  "registerTimestamp": 0,
                  "taxAmount": 0,
                  "taxGlassLineItemCode": "example",
                  "taxRateCode": "string",
                  "taxablePrice": 0,
                  "updatePrincipal": "example",
                  "updateTimestamp": 0,
                  "version": 1
              }
          ],
          "taxGroupCode": "string",
          "taxRateCode": "string",
          "taxRatePercentage": 0,
          "taxableAmount": 0,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
      }
  ],
  "totalAmount": 0,
  "totalDiscountAmount": 0,
  "totalFeeAmount": 0,
  "totalListAmount": 0,
  "totalSellingAmount": 0,
  "totalTaxAmount": 0,
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
}

export const getPrescriptionResponse = {
  "powerId": 0,
  "addLeft": 0,
  "addRight": 0,
  "axisLeft": 0,
  "axisRight": 0,
  "baseVLeft": "BO",
  "baseVRight": "BI",
  "baseHLeft": "BU",
  "baseHRight": "BD",
  "cylLeft": 8.75,
  "cylRight": 8.75,
  "pdLeft": 0,
  "pdRight": 0,
  "prism01Left": 0,
  "prism01Right": 0,
  "prism02Left": 0,
  "prism02Right": 0,
  "sphLeft": -0.5,
  "sphRight": -0.25,
  "eyepointLeft": 2,
  "eyepointRight": 2,
  "vision": 1.0,
  "perspectiveTypeCode": "2",
  "prismFlag": true,
  "powerItem": {
    "prescriptionId": 1,
    "channel": "Physical Store",
    "customerName": "AShley Jins",
    "jinsAccountId": "12345678",
    "expirationDate": "2025-03-04T08:00:00Z",
    "prescriptionFileName": "aaa"
  }
};

// 受付情報検索
export const searchReceptionInformationResponse = {
  case1: {
    // ok: true,
    // status: 200,
    // data: {
      "ReceptionInfoAllItems": [
      {
        "registeredDate": "2025-03-28",
        "visitingPurposeCode": "010",
        "customerIssueCode": "001",
        "prescriptionRegistCode": "001",
        "callingNumber": "A44",
        "receptionNumber": "240123US000001",
        "statusCode": "101",
        "callingStatusCode": "001",
        "countryCodeAlpha2": "US",
        "storeId": 83005,
        "customerName": "John Doe",
        "phoneNumber": "07012345678",
        "jinsAccountId": null,
        "registeredUserId": "JINS0001",
        "registeredProgram": "Step2_test",
        "registeredDatetime": "2025-03-28T05:01:00",
        "updatedUserId": "JINS0001",
        "updatedProgram": "Step2_test",
        "updatedDatetime": "2025-03-28T05:01:00"
      }]
    // }
  },
  case2: {
    // ok: true,
    // status: 200,
    // data: {
      "ReceptionInfoAllItems": [
      {
        "registeredDate": "2025-03-28",
        "visitingPurposeCode": "010",
        "customerIssueCode": "001",
        "prescriptionRegistCode": "001",
        "callingNumber": "A44",
        "receptionNumber": "240123XX000001",
        "statusCode": "100",
        "callingStatusCode": "001",
        "countryCodeAlpha2": "XX",
        "storeId": 83005,
        "customerName": "John Doe",
        "phoneNumber": "07012345678",
        "jinsAccountId": null,
        "registeredUserId": "JINS0001",
        "registeredProgram": "Step2_test",
        "registeredDatetime": "2025-03-28T05:01:00",
        "updatedUserId": "JINS0001",
        "updatedProgram": "Step2_test",
        "updatedDatetime": "2025-03-28T05:01:00"
      }]
    // }
  },
  case3: {
    // ok: true,
    // status: 200,
    // data: {
      "ReceptionInfoAllItems": [
      // {
      //   "registeredDate": "2025-03-28",
      //   "visitingPurposeCode": "010",
      //   "customerIssueCode": "001",
      //   "prescriptionRegistCode": "001",
      //   "callingNumber": "A44",
      //   "receptionNumber": "240123US000001",
      //   "statusCode": "101",
      //   "callingStatusCode": "001",
      //   "countryCodeAlpha2": "US",
      //   "storeId": 83005,
      //   "customerName": "John Doe",
      //   "phoneNumber": "07012345678",
      //   "jinsAccountId": null,
      //   "registeredUserId": "JINS0001",
      //   "registeredProgram": "Step2_test",
      //   "registeredDatetime": "2025-03-28T05:01:00",
      //   "updatedUserId": "JINS0001",
      //   "updatedProgram": "Step2_test",
      //   "updatedDatetime": "2025-03-28T05:01:00"
      // }
    ]
    // }
  },
}
export const searchReceptionInformationResponse_test = {
  "ReceptionInfoAllItems": [
    {
      "registeredDate": "2025-03-28",
      "visitingPurposeCode": "010",
      "customerIssueCode": "001",
      "prescriptionRegistCode": "001",
      "callingNumber": "A44",
      "receptionNumber": "240123XX000001",
      "statusCode": "100",
      "callingStatusCode": "001",
      "countryCodeAlpha2": "XX",
      "storeId": 83005,
      "customerName": "John Doe",
      "phoneNumber": "07012345678",
      "jinsAccountId": null,
      "registeredUserId": "JINS0001",
      "registeredProgram": "Step2_test",
      "registeredDatetime": "2025-03-28T05:01:00",
      "updatedUserId": "JINS0001",
      "updatedProgram": "Step2_test",
      "updatedDatetime": "2025-03-28T05:01:00"
    }
  ]
}

export const findWarrantiesResponse_正常 = {
  "warrantyInfo": {
    "warrantyNumber": "241201US000001-1",
    "receptionNumber": "241201US000001",
    "orderNumber": "USA123456",
    "isExchangeLens": false,
    "powerId": 1234561234561234700,
    "storeId": 1143416,
    "storeCode": "83005",
    "lensCoatCode": null,
    "lensProcessingCode": null,
    "lensColorName": null,
    "lensType": null,
    "exchangeCount": 1,
    "deletedFlag": 0,
    "optimisticLockVerNo": 1,
    "warrantyItems": [
      {
        "warrantyItemId": 1,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-12-08T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "003",
        "exchangeCount": 1,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      },
      {
        "warrantyItemId": 2,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-12-08T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "002",
        "exchangeCount": 2,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      }
    ]
  }
};
export const findWarrantiesResponse_正常_フレーム交換あり = {
  "warrantyInfo": {
    "warrantyNumber": "241201US000001-1",
    "receptionNumber": "241201US000001",
    "orderNumber": "USA123456",
    "isExchangeLens": false,
    "powerId": 1234561234561234700,
    "storeId": 1143416,
    "storeCode": "83005",
    "lensCoatCode": null,
    "lensProcessingCode": null,
    "lensColorName": null,
    "lensType": null,
    "exchangeCount": 1,
    "deletedFlag": 0,
    "optimisticLockVerNo": 1,
    "warrantyItems": [
      {
        "warrantyItemId": 1,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-12-08T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "001",
        "exchangeCount": 1,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      },
      {
        "warrantyItemId": 2,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-12-08T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "002",
        "exchangeCount": 2,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      }
    ]
  }
};
export const findWarrantiesResponse_正常_レンズ交換あり = {
  "warrantyInfo": {
    "warrantyNumber": "241201US000001-1",
    "receptionNumber": "241201US000001",
    "orderNumber": "USA123456",
    "isExchangeLens": false,
    "powerId": 1234561234561234700,
    "storeId": 1143416,
    "storeCode": "83005",
    "lensCoatCode": null,
    "lensProcessingCode": null,
    "lensColorName": null,
    "lensType": null,
    "exchangeCount": 1,
    "deletedFlag": 0,
    "optimisticLockVerNo": 1,
    "warrantyItems": [
      {
        "warrantyItemId": 1,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-12-08T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "003",
        "exchangeCount": 1,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      },
      {
        "warrantyItemId": 2,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-12-08T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "002",
        "exchangeCount": 2,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      }
    ]
  }
};
export const findWarrantiesResponse_正常_フレームレンズ交換あり = {
  "warrantyInfo": {
    "warrantyNumber": "241201US000001-1",
    "receptionNumber": "241201US000001",
    "orderNumber": "USA123456",
    "isExchangeLens": false,
    "powerId": 1234561234561234700,
    "storeId": 1143416,
    "storeCode": "83005",
    "lensCoatCode": null,
    "lensProcessingCode": null,
    "lensColorName": null,
    "lensType": null,
    "exchangeCount": 1,
    "deletedFlag": 0,
    "optimisticLockVerNo": 1,
    "warrantyItems": [
      {
        "warrantyItemId": 1,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-12-08T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "001",
        "exchangeCount": 1,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      },
      {
        "warrantyItemId": 2,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-12-08T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "004",
        "exchangeCount": 2,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      }
    ]
  }
};
export const findWarrantiesResponse_正常_保証開始日閏年 = {
  "warrantyInfo": {
    "warrantyNumber": "241201US000001-1",
    "receptionNumber": "241201US000001",
    "orderNumber": "USA123456",
    "isExchangeLens": false,
    "powerId": 1234561234561234700,
    "storeId": 1143416,
    "storeCode": "83005",
    "lensCoatCode": null,
    "lensProcessingCode": null,
    "lensColorName": null,
    "lensType": null,
    "exchangeCount": 1,
    "deletedFlag": 0,
    "optimisticLockVerNo": 1,
    "warrantyItems": [
      {
        "warrantyItemId": 1,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-02-29T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "001",
        "exchangeCount": 1,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      },
      {
        "warrantyItemId": 2,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-02-29T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "002",
        "exchangeCount": 2,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      }
    ]
  }
};
export const findWarrantiesResponse_正常_保証開始日未設定 = {
  "warrantyInfo": {
    "warrantyNumber": "241201US000001-1",
    "receptionNumber": "241201US000001",
    "orderNumber": "USA123456",
    "isExchangeLens": false,
    "powerId": 1234561234561234700,
    "storeId": 1143416,
    "storeCode": "83005",
    "lensCoatCode": null,
    "lensProcessingCode": null,
    "lensColorName": null,
    "lensType": null,
    "exchangeCount": 1,
    "deletedFlag": 0,
    "optimisticLockVerNo": 1,
    "warrantyItems": [
      {
        "warrantyItemId": 1,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": undefined,
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "003",
        "exchangeCount": 1,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      },
      {
        "warrantyItemId": 2,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-12-08T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "002",
        "exchangeCount": 2,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      }
    ]
  }
};
export const findWarrantiesResponse_正常_保証書番号なし = {
  "warrantyInfo": {
    "warrantyNumber": undefined,
    "receptionNumber": "241201US000001",
    "orderNumber": "USA123456",
    "isExchangeLens": false,
    "powerId": 1234561234561234700,
    "storeId": 1143416,
    "storeCode": "83005",
    "lensCoatCode": null,
    "lensProcessingCode": null,
    "lensColorName": null,
    "lensType": null,
    "exchangeCount": 1,
    "deletedFlag": 0,
    "optimisticLockVerNo": 1,
    "warrantyItems": [
      {
        "warrantyItemId": 1,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-12-08T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "003",
        "exchangeCount": 1,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      },
      {
        "warrantyItemId": 2,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-12-08T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "002",
        "exchangeCount": 2,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      }
    ]
  }
};
export const findWarrantiesResponse_正常_保証対象レコードなし = {
  "warrantyInfo": {
    "warrantyNumber": "241201US000001-1",
    "receptionNumber": "241201US000001",
    "orderNumber": "USA123456",
    "isExchangeLens": false,
    "powerId": 1234561234561234700,
    "storeId": 1143416,
    "storeCode": "83005",
    "lensCoatCode": null,
    "lensProcessingCode": null,
    "lensColorName": null,
    "lensType": null,
    "exchangeCount": 1,
    "deletedFlag": 0,
    "optimisticLockVerNo": 1,
    "warrantyItems": [
      
    ],
  }
};
export const findWarrantiesResponse_交換回数取得_0未満 = {
  "warrantyInfo": {
    "warrantyNumber": "241201US000001-1",
    "receptionNumber": "241201US000001",
    "orderNumber": "USA123456",
    "isExchangeLens": false,
    "powerId": 1234561234561234700,
    "storeId": 1143416,
    "storeCode": "83005",
    "lensCoatCode": null,
    "lensProcessingCode": null,
    "lensColorName": null,
    "lensType": null,
    "exchangeCount": 1,
    "deletedFlag": 0,
    "optimisticLockVerNo": 1,
    "warrantyItems": [
      {
        "warrantyItemId": 1,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-12-08T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "001",
        "exchangeCount": 10,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      },
      {
        "warrantyItemId": 2,
        "warrantyNumber": "2241201US000001-1",
        "purchaseDate": "2024-12-01T12:34:56",
        "warrantyStartDate": "2024-12-08T12:34:56",
        "channel": "S",
        "storeId": 1143416,
        "storeCode": "83005",
        "itemType": "002",
        "exchangeCount": 2,
        "deletedFlag": 0,
        "optimisticLockVerNo": 3
      }
    ]
  }
};
export const findWarrantiesResponse_エラー = undefined;
export const findWarrantiesResponse_null = null;
export const findWarrantiesResponse_レコードなし = {
  conditions: "error",
  status: 404
};
export const findWarrantiesResponse_throw400 = {
  conditions: "throw",
  status: 400
};

export const findWarrantyHistoriesResponse_正常 = {
  "warrantyHistories": [
    {
      "visitorId": null,
      "receptionNumber": "241201US000008",
      "orderNumber": null,
      "claimTicketCreatedAt": null,
      "boxNo": null,
      "warrantyNumber": "241201US000001-1",
      "previousReceptionNumber": "241201US000007",
      "previousItemgroupCode": "241201US000007-1",
      "receiptDatetime": "2025-12-25T13:16:01",
      "note": null,
      "retailStoreStaffNo": "jins-user-id",
      "deliveryStoreStaffNo": null,
      "retailStoreId": 1143416,
      "deliveryStoreId": 1143416,
      "retailStoreCode": "83005",
      "deliveryStoreCode": "83005",
      "warrantyItemIdList": null,
      "warrantyItemCodeList": null,
      "exchangedCount": 1,
      "warrantyCreatedAt": "2025-12-25T13:16:01",
      "lensExchange": true,
      "isExchangeLensTicket": null,
      "isPosAccounting": null,
      "isSfdcLensOrder": null,
      "isSfdcLensArrive": null,
      "measurementCode": null,
      "signatureFileUrl": null,
      "signatureFileName": null,
      "isLensOrder": null,
      "codeProductionNote": null,
      "measurementTypeForPrint": null,
      "isFrameBringIn": null,
      "isLensReorder": null,
      "shippingAddress": null,
      "shippingDate": null,
      "shippingMethodCode": null,
      "shippingPostalCode": null,
      "crmFlag": false,
      "handOverDate": null,
      "handOverMethod": null,
      "replacementPart": "001",
      "replacementType": "001",
      "replacementReason": "002",
      "exchangeCountIncrementFlag": true,
      "replacementStoreId": 1143416,
      "replacementStoreCode": "83005",
      "replacementStatusCode": "010",
      "deletedFlag": 0,
      "optimisticLockVerNo": 1
    },
    {
      "visitorId": null,
      "receptionNumber": "241201US000009",
      "orderNumber": null,
      "claimTicketCreatedAt": null,
      "boxNo": null,
      "warrantyNumber": "241201US000001-1",
      "previousReceptionNumber": "241201US000008",
      "previousItemgroupCode": "241201US000001-1",
      "receiptDatetime": "2025-12-25T13:16:01",
      "note": null,
      "retailStoreStaffNo": "jins-user-id",
      "deliveryStoreStaffNo": null,
      "retailStoreId": 1143416,
      "deliveryStoreId": 1143416,
      "retailStoreCode": "83005",
      "deliveryStoreCode": "83005",
      "warrantyItemIdList": null,
      "warrantyItemCodeList": null,
      "exchangedCount": 1,
      "warrantyCreatedAt": "2025-12-25T13:16:01",
      "lensExchange": true,
      "isExchangeLensTicket": null,
      "isPosAccounting": null,
      "isSfdcLensOrder": null,
      "isSfdcLensArrive": null,
      "measurementCode": null,
      "signatureFileUrl": null,
      "signatureFileName": null,
      "isLensOrder": null,
      "codeProductionNote": null,
      "measurementTypeForPrint": null,
      "isFrameBringIn": null,
      "isLensReorder": null,
      "shippingAddress": null,
      "shippingDate": null,
      "shippingMethodCode": null,
      "shippingPostalCode": null,
      "crmFlag": false,
      "handOverDate": null,
      "handOverMethod": null,
      "replacementPart": "004",
      "replacementType": "001",
      "replacementReason": "002",
      "exchangeCountIncrementFlag": true,
      "replacementStoreId": 1143416,
      "replacementStoreCode": "83005",
      "replacementStatusCode": "010",
      "deletedFlag": 0,
      "optimisticLockVerNo": 1
    }
  ]
};
export const findWarrantyHistoriesResponse_保証書番号なし = {
  "warrantyHistories": [
    {
      "visitorId": null,
      "receptionNumber": "241201US000008",
      "orderNumber": null,
      "claimTicketCreatedAt": null,
      "boxNo": null,
      "warrantyNumber": undefined,
      "previousReceptionNumber": "241201US000007",
      "previousItemgroupCode": "241201US000007-1",
      "receiptDatetime": "2025-12-25T13:16:01",
      "note": null,
      "retailStoreStaffNo": "jins-user-id",
      "deliveryStoreStaffNo": null,
      "retailStoreId": 1143416,
      "deliveryStoreId": 1143416,
      "retailStoreCode": "83005",
      "deliveryStoreCode": "83005",
      "warrantyItemIdList": null,
      "warrantyItemCodeList": null,
      "exchangedCount": 1,
      "warrantyCreatedAt": "2025-12-25T13:16:01",
      "lensExchange": true,
      "isExchangeLensTicket": null,
      "isPosAccounting": null,
      "isSfdcLensOrder": null,
      "isSfdcLensArrive": null,
      "measurementCode": null,
      "signatureFileUrl": null,
      "signatureFileName": null,
      "isLensOrder": null,
      "codeProductionNote": null,
      "measurementTypeForPrint": null,
      "isFrameBringIn": null,
      "isLensReorder": null,
      "shippingAddress": null,
      "shippingDate": null,
      "shippingMethodCode": null,
      "shippingPostalCode": null,
      "crmFlag": false,
      "handOverDate": null,
      "handOverMethod": null,
      "replacementPart": "001",
      "replacementType": "001",
      "replacementReason": "002",
      "exchangeCountIncrementFlag": true,
      "replacementStoreId": 1143416,
      "replacementStoreCode": "83005",
      "replacementStatusCode": "010",
      "deletedFlag": 0,
      "optimisticLockVerNo": 1
    },
    {
      "visitorId": null,
      "receptionNumber": "241201US000009",
      "orderNumber": null,
      "claimTicketCreatedAt": null,
      "boxNo": null,
      "warrantyNumber": "241201US000001-1",
      "previousReceptionNumber": "241201US000008",
      "previousItemgroupCode": "241201US000001-1",
      "receiptDatetime": "2025-12-25T13:16:01",
      "note": null,
      "retailStoreStaffNo": "jins-user-id",
      "deliveryStoreStaffNo": null,
      "retailStoreId": 1143416,
      "deliveryStoreId": 1143416,
      "retailStoreCode": "83005",
      "deliveryStoreCode": "83005",
      "warrantyItemIdList": null,
      "warrantyItemCodeList": null,
      "exchangedCount": 1,
      "warrantyCreatedAt": "2025-12-25T13:16:01",
      "lensExchange": true,
      "isExchangeLensTicket": null,
      "isPosAccounting": null,
      "isSfdcLensOrder": null,
      "isSfdcLensArrive": null,
      "measurementCode": null,
      "signatureFileUrl": null,
      "signatureFileName": null,
      "isLensOrder": null,
      "codeProductionNote": null,
      "measurementTypeForPrint": null,
      "isFrameBringIn": null,
      "isLensReorder": null,
      "shippingAddress": null,
      "shippingDate": null,
      "shippingMethodCode": null,
      "shippingPostalCode": null,
      "crmFlag": false,
      "handOverDate": null,
      "handOverMethod": null,
      "replacementPart": "004",
      "replacementType": "001",
      "replacementReason": "002",
      "exchangeCountIncrementFlag": true,
      "replacementStoreId": 1143416,
      "replacementStoreCode": "83005",
      "replacementStatusCode": "010",
      "deletedFlag": 0,
      "optimisticLockVerNo": 1
    }
  ]
};
export const findWarrantyHistoriesResponse_保証履歴なし = {
  conditions: "error",
  status: 404
};
export const findWarrantyHistoriesResponse_保証履歴null = null;

export const findWarrantyHistoriesResponse_受付日時なし = {
  "warrantyHistories": [
    {
      "visitorId": null,
      "receptionNumber": "241201US000008",
      "orderNumber": null,
      "claimTicketCreatedAt": null,
      "boxNo": null,
      "warrantyNumber": "241201US000001-1",
      "previousReceptionNumber": "241201US000007",
      "previousItemgroupCode": "241201US000007-1",
      "receiptDatetime": null,
      "note": null,
      "retailStoreStaffNo": "jins-user-id",
      "deliveryStoreStaffNo": null,
      "retailStoreId": 1143416,
      "deliveryStoreId": 1143416,
      "retailStoreCode": "83005",
      "deliveryStoreCode": "83005",
      "warrantyItemIdList": null,
      "warrantyItemCodeList": null,
      "exchangedCount": 1,
      "warrantyCreatedAt": "2025-12-25T13:16:01",
      "lensExchange": true,
      "isExchangeLensTicket": null,
      "isPosAccounting": null,
      "isSfdcLensOrder": null,
      "isSfdcLensArrive": null,
      "measurementCode": null,
      "signatureFileUrl": null,
      "signatureFileName": null,
      "isLensOrder": null,
      "codeProductionNote": null,
      "measurementTypeForPrint": null,
      "isFrameBringIn": null,
      "isLensReorder": null,
      "shippingAddress": null,
      "shippingDate": null,
      "shippingMethodCode": null,
      "shippingPostalCode": null,
      "crmFlag": false,
      "handOverDate": null,
      "handOverMethod": null,
      "replacementPart": "001",
      "replacementType": "001",
      "replacementReason": "002",
      "exchangeCountIncrementFlag": true,
      "replacementStoreId": 1143416,
      "replacementStoreCode": "83005",
      "replacementStatusCode": "010",
      "deletedFlag": 0,
      "optimisticLockVerNo": 1
    },
    {
      "visitorId": null,
      "receptionNumber": "241201US000009",
      "orderNumber": null,
      "claimTicketCreatedAt": null,
      "boxNo": null,
      "warrantyNumber": "241201US000001-1",
      "previousReceptionNumber": "241201US000008",
      "previousItemgroupCode": "241201US000001-1",
      "receiptDatetime": "2025-12-25T13:16:01",
      "note": null,
      "retailStoreStaffNo": "jins-user-id",
      "deliveryStoreStaffNo": null,
      "retailStoreId": 1143416,
      "deliveryStoreId": 1143416,
      "retailStoreCode": "83005",
      "deliveryStoreCode": "83005",
      "warrantyItemIdList": null,
      "warrantyItemCodeList": null,
      "exchangedCount": 1,
      "warrantyCreatedAt": "2025-12-25T13:16:01",
      "lensExchange": true,
      "isExchangeLensTicket": null,
      "isPosAccounting": null,
      "isSfdcLensOrder": null,
      "isSfdcLensArrive": null,
      "measurementCode": null,
      "signatureFileUrl": null,
      "signatureFileName": null,
      "isLensOrder": null,
      "codeProductionNote": null,
      "measurementTypeForPrint": null,
      "isFrameBringIn": null,
      "isLensReorder": null,
      "shippingAddress": null,
      "shippingDate": null,
      "shippingMethodCode": null,
      "shippingPostalCode": null,
      "crmFlag": false,
      "handOverDate": null,
      "handOverMethod": null,
      "replacementPart": "004",
      "replacementType": "001",
      "replacementReason": "002",
      "exchangeCountIncrementFlag": true,
      "replacementStoreId": 1143416,
      "replacementStoreCode": "83005",
      "replacementStatusCode": "010",
      "deletedFlag": 0,
      "optimisticLockVerNo": 1
    }
  ]
};
export const findWarrantyHistoriesResponse_400 = {
  conditions: "error",
  status: 400
};
export const findWarrantyHistoriesResponse_throw400 = {
  conditions: "throw",
  status: 400
};
export const findWarrantyHistoriesResponse_throw404 = {
  conditions: "throw",
  status: 404
};


export const getPowersById_正常 = {
"powerId": 0,
"addLeft": 0,
"addRight": 0,
"axisLeft": 0,
"axisRight": 0,
"baseVLeft": "BO",
"baseVRight": "BI",
"baseHLeft": "BU",
"baseHRight": "BD",
"cylLeft": 8.75,
"cylRight": 8.75,
"pdLeft": 0,
"pdRight": 0,
"prism01Left": 0,
"prism01Right": 0,
"prism02Left": 0,
"prism02Right": 0,
"sphLeft": -0.5,
"sphRight": -0.25,
"eyepointLeft": 2,
"eyepointRight": 2,
"vision": 1.0,
"perspectiveTypeCode": "2",
"prismFlag": true,
"PowerItem": {
  "prescriptionId": 1,
  "channel": "Physical Store",
  "customerName": "AShley Jins",
  "jinsAccountId": "12345678",
  "expirationDate": "2025-03-04T08:00:00",
  "prescriptionFileName": "aaa",
  "registrationMethodCode": "002"
}
};

export const getPowersById_正常_度数登録方法あり_処方箋 = {
"powerId": 0,
"addLeft": 0,
"addRight": 0,
"axisLeft": 0,
"axisRight": 0,
"baseVLeft": "BO",
"baseVRight": "BI",
"baseHLeft": "BU",
"baseHRight": "BD",
"cylLeft": 8.75,
"cylRight": 8.75,
"pdLeft": 0,
"pdRight": 0,
"prism01Left": 0,
"prism01Right": 0,
"prism02Left": 0,
"prism02Right": 0,
"sphLeft": -0.5,
"sphRight": -0.25,
"eyepointLeft": 2,
"eyepointRight": 2,
"vision": 1.0,
"perspectiveTypeCode": "2",
"prismFlag": true,
"PowerItem": {
  "prescriptionId": 1,
  "channel": "Physical Store",
  "customerName": "AShley Jins",
  "jinsAccountId": "12345678",
  "expirationDate": "2025-03-04T08:00:00",
  "prescriptionFileName": "aaa",
  "registrationMethodCode": "002"
}
};
export const getPowersById_正常_度数登録方法あり_度数不要 = {
"powerId": 0,
"addLeft": 0,
"addRight": 0,
"axisLeft": 0,
"axisRight": 0,
"baseVLeft": "BO",
"baseVRight": "BI",
"baseHLeft": "BU",
"baseHRight": "BD",
"cylLeft": 8.75,
"cylRight": 8.75,
"pdLeft": 0,
"pdRight": 0,
"prism01Left": 0,
"prism01Right": 0,
"prism02Left": 0,
"prism02Right": 0,
"sphLeft": -0.5,
"sphRight": -0.25,
"eyepointLeft": 2,
"eyepointRight": 2,
"vision": 1.0,
"perspectiveTypeCode": "2",
"prismFlag": true,
"PowerItem": {
  "prescriptionId": 1,
  "channel": "Physical Store",
  "customerName": "AShley Jins",
  "jinsAccountId": "12345678",
  "expirationDate": "2025-03-04T08:00:00",
  "prescriptionFileName": "aaa",
  "registrationMethodCode": "004"
}
};
export const getPowersById_正常_vision設定 = {
"powerId": 0,
"addLeft": 0,
"addRight": 0,
"axisLeft": 0,
"axisRight": 0,
"baseVLeft": "BO",
"baseVRight": "BI",
"baseHLeft": "BU",
"baseHRight": "BD",
"cylLeft": 8.75,
"cylRight": 8.75,
"pdLeft": 0,
"pdRight": 0,
"prism01Left": 0,
"prism01Right": 0,
"prism02Left": 0,
"prism02Right": 0,
"sphLeft": -0.5,
"sphRight": -0.25,
"eyepointLeft": 2,
"eyepointRight": 2,
"vision": 1.0,
"perspectiveTypeCode": "2",
"prismFlag": true,
"PowerItem": {
  "prescriptionId": 1,
  "channel": "Physical Store",
  "customerName": "AShley Jins",
  "jinsAccountId": "12345678",
  "expirationDate": "2025-03-04T08:00:00",
  "prescriptionFileName": "aaa",
  "registrationMethodCode": "002"
}
};
export const getPowersById_カバレッジ取得_度数情報周り = {
  "powerId": 0,
  "addLeft": undefined,
  "addRight": undefined,
  "axisLeft": undefined,
  "axisRight": undefined,
  "baseVLeft": undefined,
  "baseVRight": undefined,
  "baseHLeft": undefined,
  "baseHRight": undefined,
  "cylLeft": undefined,
  "cylRight": undefined,
  "pdLeft": undefined,
  "pdRight": undefined,
  "prism01Left": undefined,
  "prism01Right": undefined,
  "prism02Left": undefined,
  "prism02Right": undefined,
  "sphLeft": undefined,
  "sphRight": undefined,
  "eyepointLeft": undefined,
  "eyepointRight": undefined,
  "vision": 1.0,
  "perspectiveTypeCode": "2",
  "prismFlag": undefined,
  "PowerItem": {
    "prescriptionId": 1,
    "channel": "Physical Store",
    "customerName": "AShley Jins",
    "jinsAccountId": "12345678",
    "expirationDate": undefined,
    "prescriptionFileName": "aaa",
    "registrationMethodCode": "002"
  }
};
export const getPowersById_カバレッジ取得_オーダ情報周り = {
  "powerId": 0,
  "addLeft": undefined,
  "addRight": undefined,
  "axisLeft": undefined,
  "axisRight": undefined,
  "baseVLeft": undefined,
  "baseVRight": undefined,
  "baseHLeft": undefined,
  "baseHRight": undefined,
  "cylLeft": undefined,
  "cylRight": undefined,
  "pdLeft": undefined,
  "pdRight": undefined,
  "prism01Left": undefined,
  "prism01Right": undefined,
  "prism02Left": undefined,
  "prism02Right": undefined,
  "sphLeft": undefined,
  "sphRight": undefined,
  "eyepointLeft": undefined,
  "eyepointRight": undefined,
  "vision": 1.0,
  "perspectiveTypeCode": "2",
  "prismFlag": undefined,
  "PowerItem": {
    "prescriptionId": 1,
    "channel": "Physical Store",
    "customerName": "AShley Jins",
    "jinsAccountId": "12345678",
    "expirationDate": "2025-10-01",
    "prescriptionFileName": "aaa",
    "registrationMethodCode": "002"
  }
};
export const getPowersById_カバレッジ取得_度数情報設定のNAME取得 = {
  "powerId": 0,
  "addLeft": 0,
  "addRight": 0,
  "axisLeft": 0,
  "axisRight": 0,
  "baseVLeft": "BO",
  "baseVRight": "BI",
  "baseHLeft": "BU",
  "baseHRight": "BD",
  "cylLeft": 8.75,
  "cylRight": 8.75,
  "pdLeft": 0,
  "pdRight": 0,
  "prism01Left": 0,
  "prism01Right": 0,
  "prism02Left": 0,
  "prism02Right": 0,
  "sphLeft": -0.5,
  "sphRight": -0.25,
  "eyepointLeft": 2,
  "eyepointRight": 2,
  "vision": 1.0,
  "perspectiveTypeCode": "001",
  "prismFlag": true,
  "PowerItem": {
    "prescriptionId": 1,
    "channel": "Physical Store",
    "customerName": "AShley Jins",
    "jinsAccountId": "12345678",
    "expirationDate": "2025-03-04T08:00:00",
    "prescriptionFileName": "aaa",
    "registrationMethodCode": "002"
  }
};

export const getPowersById_取得エラー = undefined;
export const getPowersById_null = null;
export const getPowersById_error400 = {
  conditions: "error",
  status: 400
};

/**
 * 想定実行結果
*/
export const expectedJson_受付番号設定あり_フレーム交換 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};

export const expectedJson_受付番号設定あり_保証開始日閏年 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
            "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-02-28T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};

export const expectedJson_受付番号設定あり_保証開始日未設定 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
            "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};

export const expectedJson_受付番号設定あり_レンズ交換 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
            "prescriptionId":0
            ,"prescriptionRegistCode": null
            ,"registrationMethodCode":"002"
            ,"registrationMethodName":"prescription"
            ,"prescriptionInfo":{
              "vision":1.0
              ,"perspectiveTypeCode":"2"
              ,"eyepointRight":2
              ,"eyepointLeft":2
              ,"pdRight":0
              ,"pdLeft":0
              ,"sphRight":-0.25
              ,"sphLeft":-0.5
              ,"cylRight":8.75
              ,"cylLeft":8.75
              ,"axisRight":0
              ,"axisLeft":0
              ,"addRight":0
              ,"addLeft":0
              ,"prismFlag":true
              ,"prism01Right":0
              ,"prism01Left":0
              ,"baseHRight":"BD"
              ,"baseHLeft":"BU"
              ,"prism02Right":0
              ,"prism02Left":0
              ,"baseVRight":"BI"
              ,"baseVLeft":"BO"
            }
            ,"prescriptionExpiration":"2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};

export const expectedJson_受付番号設定あり_フレームレンズ交換 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
            "prescriptionId":0
            ,"prescriptionRegistCode": null
            ,"registrationMethodCode":"002"
            ,"registrationMethodName":"prescription"
            ,"prescriptionInfo":{
              "vision":1.0
              ,"perspectiveTypeCode":"2"
              ,"eyepointRight":2
              ,"eyepointLeft":2
              ,"pdRight":0
              ,"pdLeft":0
              ,"sphRight":-0.25
              ,"sphLeft":-0.5
              ,"cylRight":8.75
              ,"cylLeft":8.75
              ,"axisRight":0
              ,"axisLeft":0
              ,"addRight":0
              ,"addLeft":0
              ,"prismFlag":true
              ,"prism01Right":0
              ,"prism01Left":0
              ,"baseHRight":"BD"
              ,"baseHLeft":"BU"
              ,"prism02Right":0
              ,"prism02Left":0
              ,"baseVRight":"BI"
              ,"baseVLeft":"BO"
            }
            ,"prescriptionExpiration":"2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":0
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};

export const expectedJson_受付番号設定あり_保証履歴なし = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
            "prescriptionId":0
            ,"prescriptionRegistCode": null
            ,"registrationMethodCode":"002"
            ,"registrationMethodName":"prescription"
            ,"prescriptionInfo":{
              "vision":1.0
              ,"perspectiveTypeCode":"2"
              ,"eyepointRight":2
              ,"eyepointLeft":2
              ,"pdRight":0
              ,"pdLeft":0
              ,"sphRight":-0.25
              ,"sphLeft":-0.5
              ,"cylRight":8.75
              ,"cylLeft":8.75
              ,"axisRight":0
              ,"axisLeft":0
              ,"addRight":0
              ,"addLeft":0
              ,"prismFlag":true
              ,"prism01Right":0
              ,"prism01Left":0
              ,"baseHRight":"BD"
              ,"baseHLeft":"BU"
              ,"prism02Right":0
              ,"prism02Left":0
              ,"baseVRight":"BI"
              ,"baseVLeft":"BO"
            }
            ,"prescriptionExpiration":"2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"250404US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
};

export const expectedJson_受付番号設定あり_保証履歴保証番号なし = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
            "prescriptionId":0
            ,"prescriptionRegistCode": null
            ,"registrationMethodCode":"002"
            ,"registrationMethodName":"prescription"
            ,"prescriptionInfo":{
                "vision":1.0
                ,"perspectiveTypeCode":"2"
                ,"eyepointRight":2
                ,"eyepointLeft":2
                ,"pdRight":0
                ,"pdLeft":0
                ,"sphRight":-0.25
                ,"sphLeft":-0.5
                ,"cylRight":8.75
                ,"cylLeft":8.75
                ,"axisRight":0
                ,"axisLeft":0
                ,"addRight":0
                ,"addLeft":0
                ,"prismFlag":true
                ,"prism01Right":0
                ,"prism01Left":0
                ,"baseHRight":"BD"
                ,"baseHLeft":"BU"
                ,"prism02Right":0
                ,"prism02Left":0
                ,"baseVRight":"BI"
                ,"baseVLeft":"BO"
            }
            ,"prescriptionExpiration":"2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
};

export const expectedJson_受付番号設定なし = {
  "cartId":1
  ,"customerName":"John Smith"
  ,"phoneNumber":"4158726498"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250212US000001-1"
          ,"callingNumber":"A1"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":null
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement":{
              "lensReplacementFlag":true
              ,"lensReplacementTypeCode":"LOP-I110001"
          }
          ,"itemCaseInfo": null
          ,"deliveryInfo":{
              "deliveryMethodCode":"001"
              ,"shippingInfo":{
                  "fullName":"John Smith"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":null
          ,"orderStatusName":null
          ,"receptionStatusCode":"101"
          ,"receptionStatusName":"Registered"
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};

export const expectedJson_受付番号設定なし_保証情報なし = {
  "cartId":1
  ,"customerName":"John Smith"
  ,"phoneNumber":"4158726498"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250212US000001-1"
          ,"callingNumber":"A1"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":null
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement":{
              "lensReplacementFlag":true
              ,"lensReplacementTypeCode":"LOP-I110001"
          }
          ,"itemCaseInfo":null
          ,"deliveryInfo":{
              "deliveryMethodCode":"001"
              ,"shippingInfo":{
                  "fullName":"John Smith"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":null
          ,"orderStatusName":null
          ,"receptionStatusCode":"101"
          ,"receptionStatusName":"Registered"
      }
  ]
  ,"warrantyNumber":null
};

export const expectedJson_受付番号設定なし_保証履歴なし = {
  "cartId":1
  ,"customerName":"John Smith"
  ,"phoneNumber":"4158726498"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250212US000001-1"
          ,"callingNumber":"A1"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":null
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement":{
              "lensReplacementFlag":true
              ,"lensReplacementTypeCode":"LOP-I110001"
          }
          ,"itemCaseInfo": null
          ,"deliveryInfo":{
              "deliveryMethodCode":"001"
              ,"shippingInfo":{
                  "fullName":"John Smith"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":null
          ,"orderStatusName":null
          ,"receptionStatusCode":"101"
          ,"receptionStatusName":"Registered"
      }
  ]
  ,"warrantyNumber":"250212US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
};

export const expectedJson_カート新規作成 = {
  "cartId":2
  ,"customerName":"Michael Brown"
  ,"phoneNumber":"07012345678"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250212US000002-1"
          ,"callingNumber":"A1"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":null
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement":{
              "lensReplacementFlag":true
              ,"lensReplacementTypeCode":"LOP-I110001"
          }
          ,"itemCaseInfo":null
          ,"deliveryInfo":{
              "deliveryMethodCode":"001"
              ,"shippingInfo":{
                  "fullName":"Michael Brown"
                  ,"phoneNumber":"07012345678"
              }
          }
          ,"orderStatusCode":null
          ,"orderStatusName":null
          ,"receptionStatusCode":"101"
          ,"receptionStatusName":"Registered"
      }
  ]
  ,"warrantyNumber":"250212US000002-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
};

export const expectedJson_受付番号設定あり_商品グループコード指定あり = {
  "cartId":1
  ,"customerName":"John Smith"
  ,"phoneNumber":"4158726498"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
  ,"warrantyList":[
      {
          "receptionNumber":"241201US000008"
          ,"itemGroupCode":"241201US000008-1"
          ,"exchangeDate":"2025-12-25T13:16:01Z"
          ,"replaceTypeCode":"001"
          ,"replacePartCode":"001"
          ,"replaceReasonCode":"002"
      }
      ,{
          "receptionNumber":"241201US000009"
          ,"itemGroupCode":"241201US000009-1"
          ,"exchangeDate":"2025-12-25T13:16:01Z"
          ,"replaceTypeCode":"001"
          ,"replacePartCode":"004"
          ,"replaceReasonCode":"002"
      }
  ]
};

export const expectedJson_受付番号設定なし_商品グループコード指定あり = {
  "cartId":1
  ,"customerName":"John Smith"
  ,"phoneNumber":"4158726498"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
  ,"warrantyList":[
      {
          "receptionNumber":"241201US000008"
          ,"itemGroupCode":"241201US000008-1"
          ,"exchangeDate":"2025-12-25T13:16:01Z"
          ,"replaceTypeCode":"001"
          ,"replacePartCode":"001"
          ,"replaceReasonCode":"002"
      }
      ,{
          "receptionNumber":"241201US000009"
          ,"itemGroupCode":"241201US000009-1"
          ,"exchangeDate":"2025-12-25T13:16:01Z"
          ,"replaceTypeCode":"001"
          ,"replacePartCode":"004"
          ,"replaceReasonCode":"002"
      }
  ]
};

export const expectedJson_保証対象レコードなし = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
            "prescriptionId":0
            ,"prescriptionRegistCode": null
            ,"registrationMethodCode":"002"
            ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z",
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
};

export const expectedJson_注文情報取得_保証情報追加 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z",
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": true,
            "lensReplacementTypeCode": "Y9100T",
          }
          ,"itemCaseInfo":{
            "isCaseNone": false,
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};

export const expectedJson_注文情報取得_保証情報追加_レンズ交換分類商品コードなし = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z",
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false,
            "lensReplacementTypeCode": null,
          }
          ,"itemCaseInfo":{
            "isCaseNone": false,
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};

export const expectedJson_度数登録方法_処方箋 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z",
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};

export const expectedJson_度数登録方法_処方箋以外 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"004"
              ,"registrationMethodName":"non prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z",
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};

export const expectedJson_注文情報取得_保証情報追加_処方箋 = {
  "cartId":1
  ,"customerName":"John Smith"
  ,"phoneNumber":"4158726498"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250212US000001-1"
          ,"callingNumber":"A1"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":null
              ,"prescriptionRegistCode": "002"
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":null
                  ,"perspectiveTypeCode":"004"
                  ,"perspectiveTypeName":"Mid-Near"
                  ,"eyepointRight":1
                  ,"eyepointLeft":-1
                  ,"pdRight":40
                  ,"pdLeft":60
                  ,"sphRight":29
                  ,"sphLeft":26.75
                  ,"cylRight":8.75
                  ,"cylLeft":-1.5
                  ,"axisRight":180
                  ,"axisLeft":170
                  ,"addRight":9
                  ,"addLeft":2.5
                  ,"prismFlag":true
                  ,"prism01Right":1
                  ,"prism01Left":1
                  ,"baseHRight":"BO"
                  ,"baseHLeft":"BO"
                  ,"prism02Right":0.5
                  ,"prism02Left":0.5
                  ,"baseVRight":"BU"
                  ,"baseVLeft":"BD"
              }
              ,"prescriptionExpiration": "2025-12-24T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": true,
            "lensReplacementTypeCode": "LOP-I110001",
          }
          ,"itemCaseInfo": null
          ,"deliveryInfo":{
              "deliveryMethodCode":"001"
              // ,"deliveryMethodName":"Hand over"
              ,"shippingInfo":{
                  "fullName":"John Smith"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":null
          ,"orderStatusName":null
          ,"receptionStatusCode":"101"
          ,"receptionStatusName":"Registered"
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};
export const expectedJson_注文情報取得_保証情報追加_処方箋_調整 = {
  "cartId":1
  ,"customerName":"John Smith"
  ,"phoneNumber":"4158726498"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250212US000001-1"
          ,"callingNumber":"F1"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":null
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":null
                  ,"perspectiveTypeCode":"004"
                  ,"perspectiveTypeName":"Mid-Near"
                  ,"eyepointRight":1
                  ,"eyepointLeft":-1
                  ,"pdRight":40
                  ,"pdLeft":60
                  ,"sphRight":29
                  ,"sphLeft":26.75
                  ,"cylRight":8.75
                  ,"cylLeft":-1.5
                  ,"axisRight":180
                  ,"axisLeft":170
                  ,"addRight":9
                  ,"addLeft":2.5
                  ,"prismFlag":true
                  ,"prism01Right":1
                  ,"prism01Left":1
                  ,"baseHRight":"BO"
                  ,"baseHLeft":"BO"
                  ,"prism02Right":0.5
                  ,"prism02Left":0.5
                  ,"baseVRight":"BU"
                  ,"baseVLeft":"BD"
              }
              ,"prescriptionExpiration": "2025-12-24T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": true,
            "lensReplacementTypeCode": "LOP-I110001",
          }
          ,"itemCaseInfo": null
          ,"deliveryInfo":{
              "deliveryMethodCode":"001"
              // ,"deliveryMethodName":"Hand over"
              ,"shippingInfo":{
                  "fullName":"John Smith"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":null
          ,"orderStatusName":null
          ,"receptionStatusCode":"101"
          ,"receptionStatusName":"Registered"
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};
export const expectedJson_注文情報取得_度数情報_vision設定 = {
  "cartId":1
  ,"customerName":"John Smith"
  ,"phoneNumber":"4158726498"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250212US000001-1"
          ,"callingNumber":"F1"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":null
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"004"
                  ,"perspectiveTypeName":"Mid-Near"
                  ,"eyepointRight":1
                  ,"eyepointLeft":-1
                  ,"pdRight":40
                  ,"pdLeft":60
                  ,"sphRight":29
                  ,"sphLeft":26.75
                  ,"cylRight":8.75
                  ,"cylLeft":-1.5
                  ,"axisRight":180
                  ,"axisLeft":170
                  ,"addRight":9
                  ,"addLeft":2.5
                  ,"prismFlag":true
                  ,"prism01Right":1
                  ,"prism01Left":1
                  ,"baseHRight":"BO"
                  ,"baseHLeft":"BO"
                  ,"prism02Right":0.5
                  ,"prism02Left":0.5
                  ,"baseVRight":"BU"
                  ,"baseVLeft":"BD"
              }
              ,"prescriptionExpiration": "2025-12-24T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": true,
            "lensReplacementTypeCode": "LOP-I110001",
          }
          ,"itemCaseInfo": null
          ,"deliveryInfo":{
              "deliveryMethodCode":"001"
              // ,"deliveryMethodName":"Hand over"
              ,"shippingInfo":{
                  "fullName":"John Smith"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":null
          ,"orderStatusName":null
          ,"receptionStatusCode":"101"
          ,"receptionStatusName":"Registered"
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};

export const expectedJson_カバレッジ取得_カート情報周り = {
  "cartId":1
  ,"customerName":"John Smith"
  ,"phoneNumber":"4158726498"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250212US000001-1"
          ,"callingNumber":"F1"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":null
              ,"prescriptionRegistCode": null
              ,"prescriptionRegistDate": "2025-12-24T08:00:00Z"
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": true,
          }
          ,"itemCaseInfo": null
          ,"deliveryInfo":{
               "deliveryDate": "2025-10-01T00:00:00Z"
              ,"shippingInfo": null
          }
          ,"orderStatusCode":null
          ,"orderStatusName":null
          ,"receptionStatusCode":"101"
          ,"receptionStatusName":"Registered"
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};
export const expectedJson_カバレッジ取得_度数情報周り = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId": null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
           "callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionInfo":{
                "perspectiveTypeCode":"2"
                ,"vision": 1
              }
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
          }
          ,"frame":null
          ,"lensoption":null
          ,"itemGroupCode": "250404US000001-1"
          ,"lensReplacement": {
            "lensReplacementFlag": false,
          }
          ,"itemCaseInfo":{
            "isCaseNone": false,
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryDate": "2024-11-30T11:59:59Z"
              ,"deliveryMethodName": "Hand over"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};
export const expectedJson_カバレッジ取得_度数情報周り_nullリターン= {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId": null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
           "callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription": null
          ,"frame":null
          ,"lensoption":null
          ,"itemGroupCode": "250404US000001-1"
          ,"lensReplacement": {
            "lensReplacementFlag": false,
          }
          ,"itemCaseInfo":{
            "isCaseNone": false,
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryDate": "2024-11-30T11:59:59Z"
              ,"deliveryMethodName": "Hand over"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};
export const expectedJson_カバレッジ取得_オーダ情報周り = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId": null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
           "callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":null
              ,"prescriptionExpiration": "2025-10-01T00:00:00Z"
              ,"prescriptionInfo":{
                "perspectiveTypeCode":"2"
                ,"vision": 1
              }
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
          }
          ,"frame":null
          ,"lensoption":null
          ,"itemGroupCode": "250404US000001-1"
          ,"lensReplacement": {
            "lensReplacementFlag": false,
          }
          ,"itemCaseInfo":{
            "isCaseNone": false,
          }
          ,"deliveryInfo":{
               "isWaitingLens": true
              ,"shippingInfo":{
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};
export const expectedJson_カバレッジ取得_保証情報周り = {
  "cartId":1
  ,"customerName":"John Smith"
  ,"phoneNumber":"4158726498"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
  ,"warrantyList":[
      {
          "receptionNumber":"241201US000008"
          ,"itemGroupCode":"241201US000008-1"
          ,"replaceTypeCode":"001"
          ,"replacePartCode":"001"
          ,"replaceReasonCode":"002"
      }
      ,{
          "receptionNumber":"241201US000009"
          ,"itemGroupCode":"241201US000009-1"
          ,"exchangeDate":"2025-12-25T13:16:01Z"
          ,"replaceTypeCode":"001"
          ,"replacePartCode":"004"
          ,"replaceReasonCode":"002"
      }
  ]
};
export const expectedJson_カバレッジ取得_レンズオプション設定_カート情報1 = {
  "cartId":2
  ,"customerName":"Michael Brown"
  ,"phoneNumber":"07012345678"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250212US000002-1"
          ,"callingNumber":"A1"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":null
          ,"frame":null
          ,"lensoption":{
            "displayTitle": "null(11mm)"
            ,"progressiveCategoryItemCode": "LOP-P-110004"
            ,"progressiveCategoryItemName": "11mm"
            ,"totalPrice": 0
          }
          ,"lensReplacement":{
              "lensReplacementFlag":true
              ,"lensReplacementTypeCode":"LOP-I110001"
          }
          ,"itemCaseInfo":null
          ,"deliveryInfo":{
              "deliveryMethodCode":"001"
              ,"shippingInfo":{
                  "fullName":"Michael Brown"
                  ,"phoneNumber":"07012345678"
              }
          }
          ,"orderStatusCode":null
          ,"orderStatusName":null
          ,"receptionStatusCode":"101"
          ,"receptionStatusName":"Registered"
      }
  ]
  ,"warrantyNumber":"250212US000002-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
};
export const expectedJson_カバレッジ取得_レンズオプション設定_カート情報2 = {
  "cartId":2
  ,"customerName":"Michael Brown"
  ,"phoneNumber":"07012345678"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250212US000002-1"
          ,"callingNumber":"A1"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":null
          ,"frame":null
          ,"lensoption":{
            "displayTitle": "null(13mm)"
            ,"progressiveCategoryItemCode": "LOP-P-110005"
            ,"progressiveCategoryItemName": "13mm"
          }
          ,"lensReplacement":{
              "lensReplacementFlag":true
              ,"lensReplacementTypeCode":"LOP-I110001"
          }
          ,"itemCaseInfo":null
          ,"deliveryInfo":{
              "deliveryMethodCode":"001"
              ,"shippingInfo":{
                  "fullName":"Michael Brown"
                  ,"phoneNumber":"07012345678"
              }
          }
          ,"orderStatusCode":null
          ,"orderStatusName":null
          ,"receptionStatusCode":"101"
          ,"receptionStatusName":"Registered"
      }
  ]
  ,"warrantyNumber":"250212US000002-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
};
export const expectedJson_カバレッジ取得_商品グループ情報配列設定_return_undefined = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
  ,"memberId": null
  ,"warrantyList":[
      {
          "receptionNumber":"241201US000008"
          ,"itemGroupCode":"241201US000008-1"
          ,"exchangeDate":"2025-12-25T13:16:01Z"
          ,"replaceTypeCode":"001"
          ,"replacePartCode":"001"
          ,"replaceReasonCode":"002"
      }
      ,{
          "receptionNumber":"241201US000009"
          ,"itemGroupCode":"241201US000009-1"
          ,"exchangeDate":"2025-12-25T13:16:01Z"
          ,"replaceTypeCode":"001"
          ,"replacePartCode":"004"
          ,"replaceReasonCode":"002"
      }
  ]
};
export const expectedJson_カバレッジ取得_注文ステータスコード設定_case1 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":"Payment"
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};
export const expectedJson_カバレッジ取得_注文ステータスコード設定_case2 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"400"
          ,"orderStatusName":"Processing"
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};
export const expectedJson_カバレッジ取得_注文ステータスコード設定_case3 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"500"
          ,"orderStatusName":"Pick up"
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};
export const expectedJson_カバレッジ取得_注文ステータスコード設定_case4 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"801"
          ,"orderStatusName":"Order completed"
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};
export const expectedJson_カバレッジ取得_注文ステータスコード設定_case5 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"901"
          ,"orderStatusName":"Order canceled"
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};
export const expectedJson_カバレッジ取得_商品グループ情報配列設定_itemGroupなし = {
  "cartId":2
  ,"customerName":"Michael Brown"
  ,"phoneNumber":"07012345678"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":1
  ,"lensAvailableExchanges":0
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};
export const expectedJson_カバレッジ取得_保証履歴取得API_throw404 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"250404US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": undefined
};
export const expectedJson_カバレッジ取得_保証情報取得用キー生成NG = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
};
export const expectedJson_カバレッジ取得_度数情報取得エラー = {
  "cartId":1
  ,"customerName":"John Smith"
  ,"phoneNumber":"4158726498"
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250212US000001-1"
          ,"callingNumber":"A1"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription": null
          ,"receptionStatusCode":"101"
          ,"receptionStatusName":"Registered"
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": true
            ,"lensReplacementTypeCode": "LOP-I110001"
          }
          ,"itemCaseInfo":null
          ,"deliveryInfo":{
              "deliveryMethodCode":"001"
              ,"shippingInfo":{
                  "fullName":"John Smith"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode": null
          ,"orderStatusName": null
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};
export const expectedJson_カバレッジ取得_カート新規作成エラー = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"2"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"expirationDate": "2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges": 1
  ,"lensAvailableExchanges": 0
  ,"warrantyNumber": "250404US000001-1"
};
export const expectedJson_カバレッジ取得_度数情報設定のNAME取得 = {
  "cartId":3
  ,"customerName":"David Williams"
  ,"phoneNumber":"4158726498"
  ,"memberId":null
  ,"subtotal":0
  ,"totalTaxPrice":0
  ,"totalSalesPrice":0
  ,"promotionCodes":"002"
  ,"totalDiscountAmount":0
  ,"reasonCode":"002"
  ,"itemGroups":[
      {
          "itemGroupCode":"250404US000001-1"
          ,"callingNumber":"A3"
          ,"discountAmount":0
          ,"orderTotal":0
          ,"prescription":{
              "prescriptionId":0
              ,"prescriptionRegistCode": null
              ,"registrationMethodCode":"002"
              ,"registrationMethodName":"prescription"
              ,"prescriptionInfo":{
                  "vision":1.0
                  ,"perspectiveTypeCode":"001"
                  ,"perspectiveTypeName": "Distance"
                  ,"eyepointRight":2
                  ,"eyepointLeft":2
                  ,"pdRight":0
                  ,"pdLeft":0
                  ,"sphRight":-0.25
                  ,"sphLeft":-0.5
                  ,"cylRight":8.75
                  ,"cylLeft":8.75
                  ,"axisRight":0
                  ,"axisLeft":0
                  ,"addRight":0
                  ,"addLeft":0
                  ,"prismFlag":true
                  ,"prism01Right":0
                  ,"prism01Left":0
                  ,"baseHRight":"BD"
                  ,"baseHLeft":"BU"
                  ,"prism02Right":0
                  ,"prism02Left":0
                  ,"baseVRight":"BI"
                  ,"baseVLeft":"BO"
              }
              ,"prescriptionExpiration": "2025-03-04T08:00:00Z"
          }
          ,"frame":null
          ,"lensoption":null
          ,"lensReplacement": {
            "lensReplacementFlag": false
          }
          ,"itemCaseInfo": {
            "isCaseNone": false
          }
          ,"deliveryInfo":{
              "deliveryMethodCode":"002"
              ,"deliveryMethodName":"Hand over"
              ,"deliveryDate":"2024-11-30T11:59:59Z"
              ,"isWaitingLens": true
              ,"shippingInfo":{
                  "fullName":"David Williams"
                  ,"phoneNumber":"4158726498"
              }
          }
          ,"orderStatusCode":"300"
          ,"orderStatusName":""
      }
  ]
  ,"warrantyNumber":"241201US000001-1"
  ,"expirationDate":"2025-12-08T08:00:00Z"
  ,"frameAvailableExchanges":0
  ,"lensAvailableExchanges":1
  ,"warrantyList": [
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000008-1"
      ,"receptionNumber": "241201US000008"
      ,"replacePartCode": "001"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
    {
      "exchangeDate": "2025-12-25T13:16:01Z"
      ,"itemGroupCode": "241201US000009-1"
      ,"receptionNumber": "241201US000009"
      ,"replacePartCode": "004"
      ,"replaceReasonCode": "002"
      ,"replaceTypeCode": "001"
    },
  ],
};