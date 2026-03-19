export const responsePostReceptionEvents_noContents = {};
export const responseSearchReceptionInformation_null = null;
export const responseSearchReceptionInformation_undefined = undefined;
const receptionInfo_Base = {
  "registeredDate": "2025-03-28",
  "visitingPurposeCode": "010",
  "customerIssueCode": "001",
  "prescriptionRegistCode": "001",
  "callingNumber": "A44",
  "receptionNumber": "240123US000001",
  "statusCode": "300",
  "callingStatusCode": "000",
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
};
const receptionInfo_会計 = {
  ...receptionInfo_Base,
  "statusCode": "300",
  "callingStatusCode": "000",
};
const receptionInfo_調整 = {
  ...receptionInfo_Base,
  "statusCode": "401",
  "callingStatusCode": "001",
};
const receptionInfo_GeneralHelp = {
  ...receptionInfo_Base,
  "statusCode": "402",
  "callingStatusCode": "001",
};
const receptionInfo_完了 = {
  ...receptionInfo_Base,
  "statusCode": "800",
  "callingStatusCode": "010",
};

export const responseSearchReceptionInformation_正常 = {
  "ReceptionInfoAllItems": [
    receptionInfo_会計
    ]
};
export const responseSearchReceptionInformation_調整 = {
  "ReceptionInfoAllItems": [
    receptionInfo_調整
    ]
}
export const responseSearchReceptionInformation_GeneralHelp = {
  "ReceptionInfoAllItems": [
    receptionInfo_GeneralHelp,
  ]
};

export const responseSearchReceptionInformation_レコードなし = {
  "ReceptionInfoAllItems": [
  ]
};
export const responseSearchReceptionInformation_完了 = {
  "ReceptionInfoAllItems": [
    receptionInfo_完了,
  ]
};

export const responsePostDeliveryCompleted_noContents = {};
export const responsePostPaymentCompleted_noContents = {};
export const responsePostReadyForDelivery_noContents = {}

const delivery_Base = {
  "customerName": "string",
  "deliveryBoxNumber": "string",
  "deliveryDateTime": "2024-11-30T11:59:59",
  "deliveryMethodCode": "002",
  "deliveryMethodName": "string",
  "deliveryStatus": "string",
  "deliveryStoreCode": "string",
  "deliveryStoreId": 0,
  "deliveryStoreName": "string",
  "glassLineCode": "example",
  "glassLineDeliveryCode": "example",
  "orderCode": "example",
  "phoneNumber": "string",
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "shippingAddress1": "string",
  "shippingAddress2": "string",
  "shippingAddress3": "string",
  "shippingAddress4": "string",
  "shippingAddressZip": "string",
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
}
const delivery_DELIVERY_PREPARING = {
  ...delivery_Base,
  "deliveryStatus" : "DELIVERY_PREPARING",
}
const delivery_READY_FOR_DELIVERY = {
  ...delivery_Base,
  "deliveryStatus" : "READY_FOR_DELIVERY",
}
const delivery_READY_FOR_DELIVERY_配送 = {
  ...delivery_Base,
  "deliveryStatus" : "READY_FOR_DELIVERY",
  "deliveryMethodCode" : "001",
}
const delivery_DELIVERED = {
  ...delivery_Base,
  "deliveryStatus" : "DELIVERED",
}
const delivery_DELIVERY_CANCELED = {
  ...delivery_Base,
  "deliveryStatus" : "DELIVERY_CANCELED",
}

const glassLine_Base = {
  "allocatedLocationCode": "string",
  "callingNumber": "example",
  "cancelDateTime": "0",
  "cancelReasonCode": "example",
  "caseItemCategoryCode": "string",
  "caseItemCode": "string",
  "caseItemId": 0,
  "caseItemName": "string",
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
  "caseSellingPrice": 0,
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
    "customerName": "string",
    "deliveryBoxNumber": "string",
    "deliveryDateTime": "2024-11-30T11:59:59",
    "deliveryMethodCode": "string",
    "deliveryMethodName": "string",
    "deliveryStatus": "DELIVERY_PREPARING",
    "deliveryStoreCode": "string",
    "deliveryStoreId": 0,
    "deliveryStoreName": "string",
    "glassLineCode": "240123US000001-1",
    "glassLineDeliveryCode": "example",
    "orderCode": "example",
    "phoneNumber": "string",
    "registerPrincipal": "example",
    "registerTimestamp": 0,
    "shippingAddress1": "string",
    "shippingAddress2": "string",
    "shippingAddress3": "string",
    "shippingAddress4": "string",
    "shippingAddressZip": "string",
    "updatePrincipal": "example",
    "updateTimestamp": 0,
    "version": 1
  },
  "frameItemCategoryCode": "string",
  "frameItemCode": "string",
  "frameItemId": 0,
  "frameItemName": "string",
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
  "glassLineCode": "example",
  "glassLineId": "string",
  "itemGroupCode": "string",
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
  "lopFocusCategoryItemCategoryCode": "string",
  "lopFocusCategoryItemCode": "string",
  "lopFocusCategoryItemId": 0,
  "lopFocusCategoryItemName": "string",
  "lopFocusCategoryLineItemId": 0,
  "lopFocusCategoryListPrice": 0,
  "lopFocusCategoryPreparation1": "string",
  "lopFocusCategoryPreparation2": "string",
  "lopFocusCategoryRegisterPrincipal": "example",
  "lopFocusCategoryRegisterTimestamp": 0,
  "lopFocusCategorySellingPrice": 0,
  "lopFocusCategoryTaxGroupCode": "string",
  "lopFocusCategoryUpdatePrincipal": "example",
  "lopFocusCategoryUpdateTimestamp": 0,
  "lopFocusCategoryVersion": 1,
  "lopProgressiveCategoryItemCategoryCode": "string",
  "lopProgressiveCategoryItemCode": "string",
  "lopProgressiveCategoryItemId": 0,
  "lopProgressiveCategoryItemName": "string",
  "lopProgressiveCategoryLineItemId": 0,
  "lopProgressiveCategoryListPrice": 0,
  "lopProgressiveCategoryPreparation1": "string",
  "lopProgressiveCategoryPreparation2": "string",
  "lopProgressiveCategoryRegisterPrincipal": "example",
  "lopProgressiveCategoryRegisterTimestamp": 0,
  "lopProgressiveCategorySellingPrice": 0,
  "lopProgressiveCategoryTaxGroupCode": "string",
  "lopProgressiveCategoryUpdatePrincipal": "example",
  "lopProgressiveCategoryUpdateTimestamp": 0,
  "lopProgressiveCategoryVersion": 1,
  "lopRefractiveIndexNameItemCategoryCode": "string",
  "lopRefractiveIndexNameItemCode": "string",
  "lopRefractiveIndexNameItemId": 0,
  "lopRefractiveIndexNameItemName": "string",
  "lopRefractiveIndexNameLineItemId": 0,
  "lopRefractiveIndexNameListPrice": 0,
  "lopRefractiveIndexNamePreparation1": "string",
  "lopRefractiveIndexNamePreparation2": "string",
  "lopRefractiveIndexNameRegisterPrincipal": "example",
  "lopRefractiveIndexNameRegisterTimestamp": 0,
  "lopRefractiveIndexNameSellingPrice": 0,
  "lopRefractiveIndexNameTaxGroupCode": "string",
  "lopRefractiveIndexNameUpdatePrincipal": "example",
  "lopRefractiveIndexNameUpdateTimestamp": 0,
  "lopRefractiveIndexNameVersion": 1,
  "lopRimlessFinishingCategoryItemCategoryCode": "string",
  "lopRimlessFinishingCategoryItemCode": "string",
  "lopRimlessFinishingCategoryItemId": 0,
  "lopRimlessFinishingCategoryItemName": "string",
  "lopRimlessFinishingCategoryLineItemId": 0,
  "lopRimlessFinishingCategoryListPrice": 0,
  "lopRimlessFinishingCategoryPreparation1": "string",
  "lopRimlessFinishingCategoryPreparation2": "string",
  "lopRimlessFinishingCategoryRegisterPrincipal": "example",
  "lopRimlessFinishingCategoryRegisterTimestamp": 0,
  "lopRimlessFinishingCategorySellingPrice": 0,
  "lopRimlessFinishingCategoryTaxGroupCode": "string",
  "lopRimlessFinishingCategoryUpdatePrincipal": "example",
  "lopRimlessFinishingCategoryUpdateTimestamp": 0,
  "lopRimlessFinishingCategoryVersion": 1,
  "lopSalesColorNameItemCategoryCode": "string",
  "lopSalesColorNameItemCode": "string",
  "lopSalesColorNameItemId": 0,
  "lopSalesColorNameItemName": "string",
  "lopSalesColorNameLineItemId": 0,
  "lopSalesColorNameListPrice": 0,
  "lopSalesColorNamePreparation1": "string",
  "lopSalesColorNamePreparation2": "string",
  "lopSalesColorNameRegisterPrincipal": "example",
  "lopSalesColorNameRegisterTimestamp": 0,
  "lopSalesColorNameSellingPrice": 0,
  "lopSalesColorNameTaxGroupCode": "string",
  "lopSalesColorNameUpdatePrincipal": "example",
  "lopSalesColorNameUpdateTimestamp": 0,
  "lopSalesColorNameVersion": 1,
  "lopSalesLensSpecItemCategoryCode": "string",
  "lopSalesLensSpecItemCode": "string",
  "lopSalesLensSpecItemId": 0,
  "lopSalesLensSpecItemName": "string",
  "lopSalesLensSpecLineItemId": 0,
  "lopSalesLensSpecListPrice": 0,
  "lopSalesLensSpecPreparation1": "string",
  "lopSalesLensSpecPreparation2": "string",
  "lopSalesLensSpecRegisterPrincipal": "example",
  "lopSalesLensSpecRegisterTimestamp": 0,
  "lopSalesLensSpecSellingPrice": 0,
  "lopSalesLensSpecTaxGroupCode": "string",
  "lopSalesLensSpecUpdatePrincipal": "example",
  "lopSalesLensSpecUpdateTimestamp": 0,
  "lopSalesLensSpecVersion": 1,
  "needsPurchaseLens": true,
  "note": "example",
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
};
const glassLine_1 = {
  ...glassLine_Base,
  "glassLineCode" : "240123US000001-1",
}
const glassLine_2 = {
  ...glassLine_Base,
  "glassLineCode" : "240123US000001-2",
}
const glassLine_1_DELIVERY_PREPARING = {
  ...glassLine_1,
  "delivery" : delivery_DELIVERY_PREPARING,
}

const glassLine_2_DELIVERY_PREPARING = {
  ...glassLine_2,
  "delivery" : delivery_DELIVERY_PREPARING,
}

const glassLine_1_READY_FOR_DELIVERY = {
  ...glassLine_1,
  "delivery" : delivery_READY_FOR_DELIVERY,
}

const glassLine_1_READY_FOR_DELIVERY_配送 = {
  ...glassLine_1,
  "delivery" : delivery_READY_FOR_DELIVERY_配送,
}

const glassLine_2_READY_FOR_DELIVERY = {
  ...glassLine_2,
  "delivery" : delivery_READY_FOR_DELIVERY,
}

const glassLine_1_DELIVERED = {
  ...glassLine_1,
  "delivery" : delivery_DELIVERED,
}

const glassLine_2_DELIVERED = {
  ...glassLine_2,
  "delivery" : delivery_DELIVERED,
}

export const responseGetOrderByReceptionNumber_null = null;

export const responseGetOrderByReceptionNumber_Base = {
  "cartId": 0,
  "channel": "string",
  "countryCodeAlpha2": "string",
  "currencyCode": "string",
  "customerId": "string",
  "customerName": "string",
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
      "callingNumber": "example",
      "cancelDateTime": "0",
      "cancelReasonCode": "example",
      "caseItemCategoryCode": "string",
      "caseItemCode": "string",
      "caseItemId": 0,
      "caseItemName": "string",
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
      "caseSellingPrice": 0,
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
        "customerName": "string",
        "deliveryBoxNumber": "string",
        "deliveryDateTime": "2024-11-30T11:59:59",
        "deliveryMethodCode": "string",
        "deliveryMethodName": "string",
        "deliveryStatus": "string",
        "deliveryStoreCode": "string",
        "deliveryStoreId": 0,
        "deliveryStoreName": "string",
        "glassLineCode": "example",
        "glassLineDeliveryCode": "example",
        "orderCode": "example",
        "phoneNumber": "string",
        "registerPrincipal": "example",
        "registerTimestamp": 0,
        "shippingAddress1": "string",
        "shippingAddress2": "string",
        "shippingAddress3": "string",
        "shippingAddress4": "string",
        "shippingAddressZip": "string",
        "updatePrincipal": "example",
        "updateTimestamp": 0,
        "version": 1
      },
      "frameItemCategoryCode": "string",
      "frameItemCode": "string",
      "frameItemId": 0,
      "frameItemName": "string",
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
      "glassLineCode": "240123US000001-1",
      "glassLineId": "string",
      "itemGroupCode": "string",
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
      "lopFocusCategoryItemCategoryCode": "string",
      "lopFocusCategoryItemCode": "string",
      "lopFocusCategoryItemId": 0,
      "lopFocusCategoryItemName": "string",
      "lopFocusCategoryLineItemId": 0,
      "lopFocusCategoryListPrice": 0,
      "lopFocusCategoryPreparation1": "string",
      "lopFocusCategoryPreparation2": "string",
      "lopFocusCategoryRegisterPrincipal": "example",
      "lopFocusCategoryRegisterTimestamp": 0,
      "lopFocusCategorySellingPrice": 0,
      "lopFocusCategoryTaxGroupCode": "string",
      "lopFocusCategoryUpdatePrincipal": "example",
      "lopFocusCategoryUpdateTimestamp": 0,
      "lopFocusCategoryVersion": 1,
      "lopProgressiveCategoryItemCategoryCode": "string",
      "lopProgressiveCategoryItemCode": "string",
      "lopProgressiveCategoryItemId": 0,
      "lopProgressiveCategoryItemName": "string",
      "lopProgressiveCategoryLineItemId": 0,
      "lopProgressiveCategoryListPrice": 0,
      "lopProgressiveCategoryPreparation1": "string",
      "lopProgressiveCategoryPreparation2": "string",
      "lopProgressiveCategoryRegisterPrincipal": "example",
      "lopProgressiveCategoryRegisterTimestamp": 0,
      "lopProgressiveCategorySellingPrice": 0,
      "lopProgressiveCategoryTaxGroupCode": "string",
      "lopProgressiveCategoryUpdatePrincipal": "example",
      "lopProgressiveCategoryUpdateTimestamp": 0,
      "lopProgressiveCategoryVersion": 1,
      "lopRefractiveIndexNameItemCategoryCode": "string",
      "lopRefractiveIndexNameItemCode": "string",
      "lopRefractiveIndexNameItemId": 0,
      "lopRefractiveIndexNameItemName": "string",
      "lopRefractiveIndexNameLineItemId": 0,
      "lopRefractiveIndexNameListPrice": 0,
      "lopRefractiveIndexNamePreparation1": "string",
      "lopRefractiveIndexNamePreparation2": "string",
      "lopRefractiveIndexNameRegisterPrincipal": "example",
      "lopRefractiveIndexNameRegisterTimestamp": 0,
      "lopRefractiveIndexNameSellingPrice": 0,
      "lopRefractiveIndexNameTaxGroupCode": "string",
      "lopRefractiveIndexNameUpdatePrincipal": "example",
      "lopRefractiveIndexNameUpdateTimestamp": 0,
      "lopRefractiveIndexNameVersion": 1,
      "lopRimlessFinishingCategoryItemCategoryCode": "string",
      "lopRimlessFinishingCategoryItemCode": "string",
      "lopRimlessFinishingCategoryItemId": 0,
      "lopRimlessFinishingCategoryItemName": "string",
      "lopRimlessFinishingCategoryLineItemId": 0,
      "lopRimlessFinishingCategoryListPrice": 0,
      "lopRimlessFinishingCategoryPreparation1": "string",
      "lopRimlessFinishingCategoryPreparation2": "string",
      "lopRimlessFinishingCategoryRegisterPrincipal": "example",
      "lopRimlessFinishingCategoryRegisterTimestamp": 0,
      "lopRimlessFinishingCategorySellingPrice": 0,
      "lopRimlessFinishingCategoryTaxGroupCode": "string",
      "lopRimlessFinishingCategoryUpdatePrincipal": "example",
      "lopRimlessFinishingCategoryUpdateTimestamp": 0,
      "lopRimlessFinishingCategoryVersion": 1,
      "lopSalesColorNameItemCategoryCode": "string",
      "lopSalesColorNameItemCode": "string",
      "lopSalesColorNameItemId": 0,
      "lopSalesColorNameItemName": "string",
      "lopSalesColorNameLineItemId": 0,
      "lopSalesColorNameListPrice": 0,
      "lopSalesColorNamePreparation1": "string",
      "lopSalesColorNamePreparation2": "string",
      "lopSalesColorNameRegisterPrincipal": "example",
      "lopSalesColorNameRegisterTimestamp": 0,
      "lopSalesColorNameSellingPrice": 0,
      "lopSalesColorNameTaxGroupCode": "string",
      "lopSalesColorNameUpdatePrincipal": "example",
      "lopSalesColorNameUpdateTimestamp": 0,
      "lopSalesColorNameVersion": 1,
      "lopSalesLensSpecItemCategoryCode": "string",
      "lopSalesLensSpecItemCode": "string",
      "lopSalesLensSpecItemId": 0,
      "lopSalesLensSpecItemName": "string",
      "lopSalesLensSpecLineItemId": 0,
      "lopSalesLensSpecListPrice": 0,
      "lopSalesLensSpecPreparation1": "string",
      "lopSalesLensSpecPreparation2": "string",
      "lopSalesLensSpecRegisterPrincipal": "example",
      "lopSalesLensSpecRegisterTimestamp": 0,
      "lopSalesLensSpecSellingPrice": 0,
      "lopSalesLensSpecTaxGroupCode": "string",
      "lopSalesLensSpecUpdatePrincipal": "example",
      "lopSalesLensSpecUpdateTimestamp": 0,
      "lopSalesLensSpecVersion": 1,
      "needsPurchaseLens": true,
      "note": "example",
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

export const responseGetOrderByReceptionNumber_null有 = {
  "cartId": 0,
  "channel": "string",
  "countryCodeAlpha2": "string",
  "currencyCode": "string",
  "customerId": "string",
  "customerName": "string",
  "discountLines": [
    {
      "discountAmount": null,
      "discountCode": "string",
      "discountGlassLineItems": [
        {
          "discountAmount": null,
          "discountCode": "string",
          "discountGlassLineItemCode": "example",
          "discountablePrice": null,
          "glassLineCode": "example",
          "glassLineItemCode": "example",
          "itemCategoryCode": null,
          "itemCode": null,
          "itemId": null,
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
      "discountRatePercentage": null,
      "discountReasonCode": null,
      "discountType": null,
      "discountableAmount": null,
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
      "feeAmount": null,
      "feeCode": null,
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
      "taxAmount": null,
      "taxGroupCode": null,
      "taxable": null,
      "updatePrincipal": "example",
      "updateTimestamp": 0,
      "version": 1
    }
  ],
  "glassLines": [
    {
      "allocatedLocationCode": "string",
      "callingNumber": "example",
      "cancelDateTime": "0",
      "cancelReasonCode": "example",
      "caseItemCategoryCode": "string",
      "caseItemCode": "string",
      "caseItemId": 0,
      "caseItemName": "string",
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
      "caseSellingPrice": 0,
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
        "customerName": null,
        "deliveryBoxNumber": null,
        "deliveryDateTime": null,
        "deliveryMethodCode": "string",
        "deliveryMethodName": "string",
        "deliveryStatus": "string",
        "deliveryStoreCode": null,
        "deliveryStoreId": null,
        "deliveryStoreName": null,
        "glassLineCode": "example",
        "glassLineDeliveryCode": "example",
        "orderCode": "example",
        "phoneNumber": null,
        "registerPrincipal": "example",
        "registerTimestamp": 0,
        "shippingAddress1": null,
        "shippingAddress2": null,
        "shippingAddress3": null,
        "shippingAddress4": null,
        "shippingAddressZip": null,
        "updatePrincipal": "example",
        "updateTimestamp": 0,
        "version": 1
      },
      "frameItemCategoryCode": "string",
      "frameItemCode": "string",
      "frameItemId": 0,
      "frameItemName": "string",
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
      "glassLineCode": "240123US000001-1",
      "glassLineId": "string",
      "itemGroupCode": "string",
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
      "lopFocusCategoryItemCategoryCode": "string",
      "lopFocusCategoryItemCode": "string",
      "lopFocusCategoryItemId": 0,
      "lopFocusCategoryItemName": "string",
      "lopFocusCategoryLineItemId": 0,
      "lopFocusCategoryListPrice": 0,
      "lopFocusCategoryPreparation1": "string",
      "lopFocusCategoryPreparation2": "string",
      "lopFocusCategoryRegisterPrincipal": "example",
      "lopFocusCategoryRegisterTimestamp": 0,
      "lopFocusCategorySellingPrice": 0,
      "lopFocusCategoryTaxGroupCode": "string",
      "lopFocusCategoryUpdatePrincipal": "example",
      "lopFocusCategoryUpdateTimestamp": 0,
      "lopFocusCategoryVersion": 1,
      "lopProgressiveCategoryItemCategoryCode": "string",
      "lopProgressiveCategoryItemCode": "string",
      "lopProgressiveCategoryItemId": 0,
      "lopProgressiveCategoryItemName": "string",
      "lopProgressiveCategoryLineItemId": 0,
      "lopProgressiveCategoryListPrice": 0,
      "lopProgressiveCategoryPreparation1": "string",
      "lopProgressiveCategoryPreparation2": "string",
      "lopProgressiveCategoryRegisterPrincipal": "example",
      "lopProgressiveCategoryRegisterTimestamp": 0,
      "lopProgressiveCategorySellingPrice": 0,
      "lopProgressiveCategoryTaxGroupCode": "string",
      "lopProgressiveCategoryUpdatePrincipal": "example",
      "lopProgressiveCategoryUpdateTimestamp": 0,
      "lopProgressiveCategoryVersion": 1,
      "lopRefractiveIndexNameItemCategoryCode": "string",
      "lopRefractiveIndexNameItemCode": "string",
      "lopRefractiveIndexNameItemId": 0,
      "lopRefractiveIndexNameItemName": "string",
      "lopRefractiveIndexNameLineItemId": 0,
      "lopRefractiveIndexNameListPrice": 0,
      "lopRefractiveIndexNamePreparation1": "string",
      "lopRefractiveIndexNamePreparation2": "string",
      "lopRefractiveIndexNameRegisterPrincipal": "example",
      "lopRefractiveIndexNameRegisterTimestamp": 0,
      "lopRefractiveIndexNameSellingPrice": 0,
      "lopRefractiveIndexNameTaxGroupCode": "string",
      "lopRefractiveIndexNameUpdatePrincipal": "example",
      "lopRefractiveIndexNameUpdateTimestamp": 0,
      "lopRefractiveIndexNameVersion": 1,
      "lopRimlessFinishingCategoryItemCategoryCode": "string",
      "lopRimlessFinishingCategoryItemCode": "string",
      "lopRimlessFinishingCategoryItemId": 0,
      "lopRimlessFinishingCategoryItemName": "string",
      "lopRimlessFinishingCategoryLineItemId": 0,
      "lopRimlessFinishingCategoryListPrice": 0,
      "lopRimlessFinishingCategoryPreparation1": "string",
      "lopRimlessFinishingCategoryPreparation2": "string",
      "lopRimlessFinishingCategoryRegisterPrincipal": "example",
      "lopRimlessFinishingCategoryRegisterTimestamp": 0,
      "lopRimlessFinishingCategorySellingPrice": 0,
      "lopRimlessFinishingCategoryTaxGroupCode": "string",
      "lopRimlessFinishingCategoryUpdatePrincipal": "example",
      "lopRimlessFinishingCategoryUpdateTimestamp": 0,
      "lopRimlessFinishingCategoryVersion": 1,
      "lopSalesColorNameItemCategoryCode": "string",
      "lopSalesColorNameItemCode": "string",
      "lopSalesColorNameItemId": 0,
      "lopSalesColorNameItemName": "string",
      "lopSalesColorNameLineItemId": 0,
      "lopSalesColorNameListPrice": 0,
      "lopSalesColorNamePreparation1": "string",
      "lopSalesColorNamePreparation2": "string",
      "lopSalesColorNameRegisterPrincipal": "example",
      "lopSalesColorNameRegisterTimestamp": 0,
      "lopSalesColorNameSellingPrice": 0,
      "lopSalesColorNameTaxGroupCode": "string",
      "lopSalesColorNameUpdatePrincipal": "example",
      "lopSalesColorNameUpdateTimestamp": 0,
      "lopSalesColorNameVersion": 1,
      "lopSalesLensSpecItemCategoryCode": "string",
      "lopSalesLensSpecItemCode": "string",
      "lopSalesLensSpecItemId": 0,
      "lopSalesLensSpecItemName": "string",
      "lopSalesLensSpecLineItemId": 0,
      "lopSalesLensSpecListPrice": 0,
      "lopSalesLensSpecPreparation1": "string",
      "lopSalesLensSpecPreparation2": "string",
      "lopSalesLensSpecRegisterPrincipal": "example",
      "lopSalesLensSpecRegisterTimestamp": 0,
      "lopSalesLensSpecSellingPrice": 0,
      "lopSalesLensSpecTaxGroupCode": "string",
      "lopSalesLensSpecUpdatePrincipal": "example",
      "lopSalesLensSpecUpdateTimestamp": 0,
      "lopSalesLensSpecVersion": 1,
      "needsPurchaseLens": true,
      "note": "example",
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
      "paymentDateTime": null,
      "paymentMethod": null,
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
      "taxAmount": null,
      "taxCode": null,
      "taxFeeLines": [
        {
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": null,
          "taxFeeLineCode": "example",
          "taxRateCode": "string",
          "taxableAmount": null,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
        }
      ],
      "taxGlassLineItems": [
        {
          "glassLineCode": "example",
          "glassLineItemCode": "example",
          "itemId": null,
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxAmount": null,
          "taxGlassLineItemCode": "example",
          "taxRateCode": "string",
          "taxablePrice": null,
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
        }
      ],
      "taxGroupCode": null,
      "taxRateCode": "string",
      "taxRatePercentage": null,
      "taxableAmount": null,
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

export const responseGetOrderByReceptionNumber_required = {
  "discountLines": [
    {
      "discountCode": "string",
      "discountGlassLineItems": [
        {
          "discountCode": "string",
          "discountGlassLineItemCode": "example",
          "glassLineCode": "example",
          "glassLineItemCode": "example",
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
      "updatePrincipal": "example",
      "updateTimestamp": 0,
      "version": 1
    }
  ],
  "glassLines": [
    {
      "allocatedLocationCode": "string",
      "callingNumber": "example",
      "cancelDateTime": "0",
      "cancelReasonCode": "example",
      "caseItemCategoryCode": "string",
      "caseItemCode": "string",
      "caseItemId": 0,
      "caseItemName": "string",
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
      "caseSellingPrice": 0,
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
        "deliveryMethodCode": "string",
        "deliveryMethodName": "string",
        "deliveryStatus": "string",
        "glassLineCode": "example",
        "glassLineDeliveryCode": "example",
        "orderCode": "example",
        "registerPrincipal": "example",
        "registerTimestamp": 0,
        "updatePrincipal": "example",
        "updateTimestamp": 0,
        "version": 1
      },
      "glassLineId": "string",
      "itemGroupCode": "string",
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
      "paymentStatus": "string",
      "registerPrincipal": "example",
      "registerTimestamp": 0,
      "updatePrincipal": "example",
      "updateTimestamp": 0,
      "version": 1
    }
  ],
  "registerPrincipal": "example",
  "registerTimestamp": 0,
  "taxLines": [
    {
      "orderCode": "example",
      "registerPrincipal": "example",
      "registerTimestamp": 0,
      "taxFeeLines": [
        {
          "feeLineCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxFeeLineCode": "example",
          "taxRateCode": "string",
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
        }
      ],
      "taxGlassLineItems": [
        {
          "glassLineCode": "example",
          "glassLineItemCode": "example",
          "orderCode": "example",
          "registerPrincipal": "example",
          "registerTimestamp": 0,
          "taxGlassLineItemCode": "example",
          "taxRateCode": "string",
          "updatePrincipal": "example",
          "updateTimestamp": 0,
          "version": 1
        }
      ],
      "taxRateCode": "string",
      "updatePrincipal": "example",
      "updateTimestamp": 0,
      "version": 1
    }
  ],
  "updatePrincipal": "example",
  "updateTimestamp": 0,
  "version": 1
}

export const responseGetOrderByReceptionNumber_正常 = {
  ...responseGetOrderByReceptionNumber_Base,
};

// メガネ＃１・＃２ 会計前
export const responseGetOrderByReceptionNumber_ORDER_PAYMENT_PROCESSING = {
  ...responseGetOrderByReceptionNumber_Base,
  "orderStatus": "ORDER_PAYMENT_PROCESSING",
  "glassLines" : [
    glassLine_1_DELIVERY_PREPARING,
    glassLine_2_DELIVERY_PREPARING,
  ]
}

// メガネ＃１・＃２ 会計済み
export const responseGetOrderByReceptionNumber_ORDER_DELIVERY_PROCESSING = {
  ...responseGetOrderByReceptionNumber_Base,
  "orderStatus": "ORDER_DELIVERY_PROCESSING",
  "glassLines" : [
    glassLine_1_DELIVERY_PREPARING,
    glassLine_2_DELIVERY_PREPARING,
  ]
}

// メガネ＃１・＃２ 会計済み（null有）
export const responseGetOrderByReceptionNumber_ORDER_DELIVERY_PROCESSING_null有 = {
  ...responseGetOrderByReceptionNumber_null有,
  "orderStatus": "ORDER_DELIVERY_PROCESSING",
  "glassLines" : [
    glassLine_1_DELIVERY_PREPARING,
    glassLine_2_DELIVERY_PREPARING,
  ]
}

// メガネ＃１受け渡し準備完了
export const responseGetOrderByReceptionNumber_READY_FOR_DELIVERY = {
  ...responseGetOrderByReceptionNumber_Base,
  "orderStatus": "ORDER_DELIVERY_PROCESSING",
  "glassLines" : [
    glassLine_1_READY_FOR_DELIVERY,
    glassLine_2_DELIVERY_PREPARING,
  ]
}

// メガネ＃１受け渡し準備完了（受け渡し方法：配送）
export const responseGetOrderByReceptionNumber_READY_FOR_DELIVERY_配送 = {
  ...responseGetOrderByReceptionNumber_Base,
  "orderStatus": "ORDER_DELIVERY_PROCESSING",
  "glassLines" : [
    glassLine_1_READY_FOR_DELIVERY_配送,
    glassLine_2_DELIVERY_PREPARING,
  ]
}

// メガネ＃１受け渡し準備完了(required有)
export const responseGetOrderByReceptionNumber_READY_FOR_DELIVERY_required = {
  ...responseGetOrderByReceptionNumber_required,
  "orderStatus": "ORDER_DELIVERY_PROCESSING",
  "glassLines" : [
    glassLine_1_READY_FOR_DELIVERY,
    glassLine_2_DELIVERY_PREPARING,
  ]
}

// メガネ＃１受け渡し完了。メガネ＃２ 加工前
export const responseGetOrderByReceptionNumber_DELIVERED = {
  ...responseGetOrderByReceptionNumber_Base,
  "orderStatus": "ORDER_DELIVERY_PROCESSING",
  "glassLines" : [
    glassLine_1_DELIVERED,
    glassLine_2_DELIVERY_PREPARING,
  ]
}

// メガネ＃１・＃２とも受け渡し完了
export const responseGetOrderByReceptionNumber_ORDER_COMPLETED = {
  ...responseGetOrderByReceptionNumber_Base,
  "orderStatus": "ORDER_COMPLETED",
  "glassLines" : [
    glassLine_1_DELIVERED,
    glassLine_2_DELIVERED,
  ]
}


export const responsePutWarranties_noContents = {};


const findWarrantyHistories_warrantyHistories_base = {
  visitorId: null,
  receptionNumber: "241201US000008",
  orderNumber: null,
  claimTicketCreatedAt: null,
  boxNo: null,
  warrantyNumber: "241201US000001-1",
  previousReceptionNumber: "241201US000007",
  previousItemgroupCode: "241201US000007-1",
  receiptDatetime: "2025-12-25T13:16:01",
  note: null,
  retailStoreStaffNo: "jins-user-id",
  deliveryStoreStaffNo: null,
  retailStoreId: 1143416,
  deliveryStoreId: 1143416,
  retailStoreCode: "83005",
  deliveryStoreCode: "83005",
  warrantyItemIdList: null,
  warrantyItemCodeList: null,
  exchangedCount: 1,
  warrantyCreatedAt: "2025-12-25T13:16:01",
  lensExchange: false,
  isExchangeLensTicket: null,
  isPosAccounting: null,
  isSfdcLensOrder: null,
  isSfdcLensArrive: null,
  measurementCode: null,
  signatureFileUrl: null,
  signatureFileName: null,
  isLensOrder: null,
  codeProductionNote: null,
  measurementTypeForPrint: null,
  isFrameBringIn: null,
  isLensReorder: null,
  shippingAddress: null,
  shippingDate: null,
  shippingMethodCode: null,
  shippingPostalCode: null,
  crmFlag: false,
  handOverDate: null,
  handOverMethod: null,
  replacementPart: "000",
  replacementType: "001",
  replacementReason: "002",
  exchangeCountIncrementFlag: true,
  replacementStoreId: 1143416,
  replacementStoreCode: "83005",
  replacementStatusCode: "011",
  deletedFlag: 0,
  optimisticLockVerNo: 1,
}

export const findWarrantyHistories_保証履歴なし = {
  warrantyHistories: [
  ],
};

export const findWarrantyHistories_保証履歴あり_一式交換 = {
  warrantyHistories: [
    {
      ...findWarrantyHistories_warrantyHistories_base,
      lensExchange: false,
      replacementPart: "000",
    },
  ],
};
export const findWarrantyHistories_保証履歴あり_フレーム交換 = {
  warrantyHistories: [
    {
      ...findWarrantyHistories_warrantyHistories_base,
      lensExchange: false,
      replacementPart: "001",
    },
  ],
};

export const findWarrantyHistories_保証履歴あり_レンズ交換 = {
  warrantyHistories: [
    {
      ...findWarrantyHistories_warrantyHistories_base,
      lensExchange: false,
      replacementPart: "002",
    },
  ],
};

export const findWarrantyHistories_保証履歴あり_交換レンズのみ = {
  warrantyHistories: [
    {
      ...findWarrantyHistories_warrantyHistories_base,
      lensExchange: true,
      replacementPart: "002",
    },
  ],
};

export const findWarrantyHistories_保証履歴あり_交換レンズだけど一式 = {
  warrantyHistories: [
    {
      ...findWarrantyHistories_warrantyHistories_base,
      lensExchange: true,
      replacementPart: "000",
    },
  ],
};

export const findWarrantyHistories_保証履歴あり_加算対象外 = {
  warrantyHistories: [
    {
      ...findWarrantyHistories_warrantyHistories_base,
      exchangeCountIncrementFlag: false,
    },
  ],
};

const findWarranties_warrantyItem_base = {
  warrantyItemId: 1,
  warrantyNumber: "2241201US000001-1",
  purchaseDate: "2024-12-01T12:34:56",
  warrantyStartDate: "2024-12-08T12:34:56",
  channel: "S",
  storeId: 1143416,
  storeCode: "83005",
  itemType: "003",
  exchangeCount: undefined,
  deletedFlag: 0,
  optimisticLockVerNo: 3,
};

const findWarranties_warrantyItem_Frame = {
  ...findWarranties_warrantyItem_base,
  warrantyItemId: 1,
  itemType: "001",
  exchangeCount: 2,
}

const findWarranties_warrantyItem_LensLeft = {
  ...findWarranties_warrantyItem_base,
  warrantyItemId: 2,
  itemType: "003",
  exchangeCount: 1,
}

const findWarranties_warrantyItem_LensRight = {
  ...findWarranties_warrantyItem_base,
  warrantyItemId: 3,
  itemType: "004",
  exchangeCount: 3,
}

const findWarranties_warrantyInfo_base = {
  warrantyNumber: "241201US000001-1",
  receptionNumber: "241201US000001",
  orderNumber: "USA123456",
  isExchangeLens: false,
  powerId: 1234561234561234700,
  storeId: 1143416,
  storeCode: "83005",
  lensCoatCode: null,
  lensProcessingCode: null,
  lensColorName: null,
  lensType: null,
  exchangeCount: undefined,
  deletedFlag: 0,
  optimisticLockVerNo: 1,
  warrantyItems: [
    {
      warrantyItemId: 1,
      warrantyNumber: "2241201US000001-1",
      purchaseDate: "2024-12-01T12:34:56",
      warrantyStartDate: "2024-12-08T12:34:56",
      channel: "S",
      storeId: 1143416,
      storeCode: "83005",
      itemType: "001",
      exchangeCount: undefined,
      deletedFlag: 0,
      optimisticLockVerNo: 3,
    },
    {
      warrantyItemId: 2,
      warrantyNumber: "2241201US000001-1",
      purchaseDate: "2024-12-01T12:34:56",
      warrantyStartDate: "2024-12-08T12:34:56",
      channel: "S",
      storeId: 1143416,
      storeCode: "83005",
      itemType: "003",
      exchangeCount: undefined,
      deletedFlag: 0,
      optimisticLockVerNo: 3,
    },
    {
      warrantyItemId: 3,
      warrantyNumber: "2241201US000001-1",
      purchaseDate: "2024-12-01T12:34:56",
      warrantyStartDate: "2024-12-08T12:34:56",
      channel: "S",
      storeId: 1143416,
      storeCode: "83005",
      itemType: "004",
      exchangeCount: undefined,
      deletedFlag: 0,
      optimisticLockVerNo: 3,
    },
  ],
};

export const findWarranties_一式 = {
  warrantyInfo: {
    ...findWarranties_warrantyInfo_base,
    // warrantyItems: [
    //   findWarranties_warrantyItem_Frame,
    //   findWarranties_warrantyItem_LensLeft,
    //   findWarranties_warrantyItem_LensRight,
    // ],
  },
}

export const findWarranties_交換済み = {
  warrantyInfo: {
    ...findWarranties_warrantyInfo_base,
    exchangeCount: 1,
    warrantyItems: [
      findWarranties_warrantyItem_Frame,
      findWarranties_warrantyItem_LensLeft,
      findWarranties_warrantyItem_LensRight,
    ],
  },
}
export const findWarranties_レンズだけ = {
  warrantyInfo: {
    ...findWarranties_warrantyInfo_base,
    warrantyItems: [
      // findWarranties_warrantyItem_Frame,
      findWarranties_warrantyItem_LensLeft,
      findWarranties_warrantyItem_LensRight,
    ],
  },
}

export const findWarranties_フレームだけ = {
  warrantyInfo: {
    ...findWarranties_warrantyInfo_base,
    warrantyItems: [
      findWarranties_warrantyItem_Frame,
      // findWarranties_warrantyItem_LensLeft,
      // findWarranties_warrantyItem_LensRight,
    ],
  },
}
export const putWarrantyHistories_noContents = {};
