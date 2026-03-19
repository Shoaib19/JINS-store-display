import { unmanaged } from "inversify/lib/inversify";

// /** カート情報登録ベース */
// export const postCartInfoRequest = {
//     // body: {
//         "cartId": 123,
//         "itemCategoryCode": "91",
//         "checkoutFlag": true,
//         "customerName": "John Doe",
//         "phoneNumber": "07012345678",
//         "itemGroups": [{
//             "itemGroupCode": "241031US000001-1",
//             "prescription": {
//                 "prescriptionId": null,
//                 "registrationMethodCode": "002",
//                 "prescriptionInfo": {
//                     "vision": null,
//                     "perspectiveTypeCode": "4",
//                     "eyepointRight": 1,
//                     "eyepointLeft": -1,
//                     "pdRight": 40,
//                     "pdLeft": 60,
//                     "sphRight": 29,
//                     "sphLeft": 26.75,
//                     "cylRight": 8.75,
//                     "cylLeft": -1.5,
//                     "axisRight": 180,
//                     "axisLeft": 170,
//                     "addRight": 9,
//                     "addLeft": 2.5,
//                     "prismFlag": true,
//                     "prism01Right": 1,
//                     "prism01Left": 1,
//                     "baseHRight": "BO",
//                     "baseHLeft": "BO",
//                     "prism02Right": 0.5,
//                     "prism02Left": 0.5,
//                     "baseVRight": "BU",
//                     "baseVLeft": "BD"
//                 },
//                 "prescriptionExpiration": "2024-12-30T08:00:00Z",
//                 "prescriptionData": "/9j/4AAQSkZJRgABAQEAAAAAAAD/..."
//             },
//             "frame": {
//                 "frameCode": "MRF-23A-011-128",
//                 "lot": "AB"
//             },
//             "lensOptionCode": {
//                 "salesColorNameItemCode": "LOP-C110001",
//                 "salesLensSpecItemCode": "LOP-L110001",
//                 "focusCategoryItemCode": "LOP-U130001",
//                 "progressiveCategoryItemCode": "LOP-P130001",
//                 "refractiveIndexNameItemCode": "LOP-I110001"
//             },
//             "caseCode": "YC-0065-C",
//             "cerritoCode": ""MMF-24S-U019U-94""
//             "lensReplacement": {
//                 "lensReplacementFlag": true,
//                 "lensReplacementTypeCode": "LOP-R110001"
//             },
//             "note": "John Doe is a member in good standing. Last login was on August 30, 2024, with no outstanding issues."
//         }]
//     // }
// };

const itemGroupCode_01 = "241031US000001-1";
const itemGroupCode_02 = "241031US000001-2";
/** カート情報登録用（フレーム） */
export const postCartInfoRequest_フレーム登録 = {
  cartId: 123,
  itemCategoryCode: "01",
  checkoutFlag: false,
  customerName: "John Doe",
  phoneNumber: "07012345678",
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      frame: {
        frameCode: "MRF-23A-011-128",
        lot: "AB"
      },
      lensReplacement: {
        lensReplacementFlag: false,
      },
      note: "Frame test data.",
    },
  ],
};

/** カート情報登録用（フレーム） */
export const postCartInfoRequest_フレーム登録_保証交換 = {
  cartId: 123,
  itemCategoryCode: "01",
  checkoutFlag: false,
  customerName: "John Doe",
  phoneNumber: "07012345678",
  warrantyExchange: {
    warrantyNumber: "241201US00001-1",
    replacementPart: "000",
  },
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      frame: {
        frameCode: "MRF-23A-011-128",
        lot: "AB"
      },
      lensReplacement: {
        lensReplacementFlag: false,
      },
      note: "Frame test data.",
    },
  ],
};

export const postCartInfoRequest_フレーム登録_保証フレーム交換 = {
  cartId: 123,
  itemCategoryCode: "01",
  checkoutFlag: false,
  customerName: "John Doe",
  phoneNumber: "07012345678",
  warrantyExchange: {
    warrantyNumber: "241201US00001-1",
    replacementPart: "001",
  },
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      frame: {
        frameCode: "MRF-23A-011-128",
        lot: "AB"
      },
      lensReplacement: {
        //lensReplacementFlag: false,
        lensReplacementFlag: true,
        lensReplacementTypeCode: "LOP-R110001",
      },
      note: "Frame test data.",
    },
  ],
};

/** カート情報登録用（フレーム）_必須のみ */
export const postCartInfoRequest_フレーム登録_必須のみ = {
  cartId: 123,
  itemCategoryCode: "01",
  checkoutFlag: false,
};

export const postCartInfoRequest_フレーム登録_保証フレーム交換_null = {
  cartId: 123,
  itemCategoryCode: "01",
  checkoutFlag: false,
  customerName: "John Doe",
  phoneNumber: "07012345678",
  warrantyExchange: {
    warrantyNumber: "241201US00001-1",
    replacementPart: null,
  },
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      frameCode: null,
      lensReplacement: {
        lensReplacementFlag: true,
        lensReplacementTypeCode: "LOP-R110001",
      },
      note: "Frame test data.",
    },
  ],
};

/** カート情報登録用（レンズ交換） */
export const postCartInfoRequest_フレーム登録_レンズ交換 = {
  cartId: 123,
  itemCategoryCode: "01",
  checkoutFlag: false,
  customerName: "John Doe",
  phoneNumber: "07012345678",
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      frame: undefined,
      lensReplacement: {
        lensReplacementFlag: true,
      },
      note: "Frame test data.",
    },
  ],
};

/** カート情報登録用(ケース) */
export const postCartInfoRequest_ケース登録 = {
  cartId: 123,
  itemCategoryCode: "04",
  checkoutFlag: false,
  customerName: undefined,
  phoneNumber: undefined,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      caseCode: "YC0109-10",
      note: "Case test data.",
    },
  ],
};

/** カート情報登録用(ケース) */
export const postCartInfoRequest_ケースなし = {
  cartId: 123,
  itemCategoryCode: "04",
  checkoutFlag: false,
  customerName: undefined,
  phoneNumber: undefined,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      caseCode: null,
      note: "Case none test data.",
    },
  ],
};

/** カート情報登録用(セリート) */
export const postCartInfoRequest_セリート登録 = {
  cartId: 123,
  itemCategoryCode: "05",
  checkoutFlag: false,
  customerName: undefined,
  phoneNumber: undefined,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      cerritoCode: "MMF-24S-U019U-94",
      note: "Cerrito test data.",
    },
  ],
};

/** カート情報登録用(セリート) */
export const postCartInfoRequest_セリートなし = {
  cartId: 123,
  itemCategoryCode: "05",
  checkoutFlag: false,
  customerName: undefined,
  phoneNumber: undefined,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      cerritoCode: null,
      note: "Cerrito none test data.",
    },
  ],
};

/** カート情報登録用(度数情報) */
export const postCartInfoRequest_度数情報登録 = {
  cartId: 123,
  itemCategoryCode: "11",
  checkoutFlag: false,
  customerName: undefined,
  phoneNumber: undefined,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      prescription: {
        prescriptionId: null,
        registrationMethodCode: "002",
        prescriptionInfo: {
          vision: null,
          perspectiveTypeCode: "004",
          eyepointRight: 1,
          eyepointLeft: -1,
          pdRight: 40,
          pdLeft: 60,
          sphRight: 29,
          sphLeft: 26.75,
          cylRight: 8.75,
          cylLeft: -1.5,
          axisRight: 180,
          axisLeft: 170,
          addRight: 9,
          addLeft: 2.5,
          prismFlag: true,
          prism01Right: 1,
          prism01Left: 1,
          baseHRight: "BO",
          baseHLeft: "BO",
          prism02Right: 0.5,
          prism02Left: 0.5,
          baseVRight: "BU",
          baseVLeft: "BD",
        },
        prescriptionExpiration: "12/24/2024",
      },
      note: "Prescription test data",
    },
  ],
};

export const postCartInfoRequest_度数情報登録_右度数情報なし = {
  cartId: 123,
  itemCategoryCode: "11",
  checkoutFlag: false,
  customerName: undefined,
  phoneNumber: undefined,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      prescription: {
        prescriptionId: null,
        registrationMethodCode: "002",
        prescriptionInfo: {
          vision: null,
          perspectiveTypeCode: "004",
          eyepointRight: 1,
          eyepointLeft: -1,
          pdRight: 40,
          pdLeft: 60,
          sphRight: 29,
          sphLeft: 26.75,
          cylRight: 8.75,
          cylLeft: -1.5,
          axisRight: 180,
          axisLeft: 170,
          addRight: undefined,
          addLeft: 2.5,
          prismFlag: true,
          prism01Right: 1,
          prism01Left: 1,
          baseHRight: "BO",
          baseHLeft: "BO",
          prism02Right: 0.5,
          prism02Left: 0.5,
          baseVRight: "BU",
          baseVLeft: "BD",
        },
        prescriptionExpiration: "12/24/2024",
      },
      note: "Prescription test data",
    },
  ],
};

export const postCartInfoRequest_処方箋情報なし = {
  cartId: 123,
  itemCategoryCode: "11",
  checkoutFlag: false,
  customerName: undefined,
  phoneNumber: undefined,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      prescription: {
        prescriptionId: null,
        registrationMethodCode: "002",
        prescriptionInfo: {
          vision: null,
          perspectiveTypeCode: "004",
          eyepointRight: 1,
          eyepointLeft: -1,
          pdRight: 40,
          pdLeft: 60,
          sphRight: 29,
          sphLeft: 26.75,
          cylRight: 8.75,
          cylLeft: -1.5,
          axisRight: 180,
          axisLeft: 170,
          addRight: 9,
          addLeft: 2.5,
          prismFlag: true,
          prism01Right: 1,
          prism01Left: 1,
          baseHRight: "BO",
          baseHLeft: "BO",
          prism02Right: 0.5,
          prism02Left: 0.5,
          baseVRight: "BU",
          baseVLeft: "BD",
        }
      },
      note: "Prescription test data",
    },
  ],
};
export const postCartInfoRequest_度数情報登録_vision設定 = {
  cartId: 123,
  itemCategoryCode: "11",
  checkoutFlag: false,
  customerName: undefined,
  phoneNumber: undefined,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      prescription: {
        prescriptionId: null,
        registrationMethodCode: "002",
        prescriptionInfo: {
          vision: 0.1,
          perspectiveTypeCode: "004",
          eyepointRight: 1,
          eyepointLeft: -1,
          pdRight: 40,
          pdLeft: 60,
          sphRight: 29,
          sphLeft: 26.75,
          cylRight: 8.75,
          cylLeft: -1.5,
          axisRight: 180,
          axisLeft: 170,
          addRight: 9,
          addLeft: 2.5,
          prismFlag: true,
          prism01Right: 1,
          prism01Left: 1,
          baseHRight: "BO",
          baseHLeft: "BO",
          prism02Right: 0.5,
          prism02Left: 0.5,
          baseVRight: "BU",
          baseVLeft: "BD",
        },
        prescriptionExpiration: "12/24/2024",
      },
      note: "Prescription test data",
    },
  ],
};

export const postCartInfoRequest_遠中近区分コード不正 = {
  cartId: 123,
  itemCategoryCode: "11",
  checkoutFlag: false,
  customerName: undefined,
  phoneNumber: undefined,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      prescription: {
        prescriptionId: null,
        registrationMethodCode: "002",
        prescriptionInfo: {
          vision: null,
          perspectiveTypeCode: "999",
          eyepointRight: 1,
          eyepointLeft: -1,
          pdRight: 40,
          pdLeft: 60,
          sphRight: 29,
          sphLeft: 26.75,
          cylRight: 8.75,
          cylLeft: -1.5,
          axisRight: 180,
          axisLeft: 170,
          addRight: 9,
          addLeft: 2.5,
          prismFlag: true,
          prism01Right: 1,
          prism01Left: 1,
          baseHRight: "BO",
          baseHLeft: "BO",
          prism02Right: 0.5,
          prism02Left: 0.5,
          baseVRight: "BU",
          baseVLeft: "BD",
        },
        prescriptionExpiration: "12/24/2024",
      },
      note: "Prescription test data",
    },
  ],
};

export const postCartInfoRequest_度数情報登録_度数情報なし = {
  cartId: 123,
  itemCategoryCode: "11",
  checkoutFlag: false,
  customerName: undefined,
  phoneNumber: undefined,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      prescription: undefined,
      note: "Prescription test data",
    },
  ],
};

export const postCartInfoRequest_度数情報登録_度数情報null = {
  cartId: 123,
  itemCategoryCode: "11",
  checkoutFlag: false,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      prescription: {
        prescriptionId: null,
        registrationMethodCode: null,
        prescriptionInfo: {
          vision: null,
          perspectiveTypeCode: null,
          eyepointRight: null,
          eyepointLeft: null,
          pdRight: null,
          pdLeft: null,
          sphRight: null,
          sphLeft: null,
          cylRight: null,
          cylLeft: null,
          axisRight: null,
          axisLeft: null,
          addRight: null,
          addLeft: null,
          prismFlag: null,
          prism01Right: null,
          prism01Left: null,
          baseHRight: null,
          baseHLeft: null,
          prism02Right: null,
          prism02Left: null,
          baseVRight: null,
          baseVLeft: null,
        },
        prescriptionExpiration: null,
        prescriptionData: null,
      },
      note: "Prescription test data",
    },
  ],
};

/** カート情報登録用(レンズOP) */
export const postCartInfoRequest_レンズOP登録 = {
  cartId: 123,
  itemCategoryCode: "12",
  checkoutFlag: false,
  customerName: undefined,
  phoneNumber: undefined,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      lensOptionCode: {
        salesColorNameItemCode: "LOP-C110001",
        salesLensSpecItemCode: "LOP-L110001",
        focusCategoryItemCode: "LOP-U110001",
        progressiveCategoryItemCode: "LOP-P110001",
        refractiveIndexNameItemCode: "LOP-I110001",
      },
      lensReplacement: {
        lensReplacementFlag: false,
      },
      note: "Lens test data.",
    },
  ],
};

export const postCartInfoRequest_レンズOP登録_レンズ交換 = {
  cartId: 123,
  itemCategoryCode: "12",
  checkoutFlag: false,
  customerName: undefined,
  phoneNumber: undefined,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      lensOptionCode: {
        salesColorNameItemCode: "LOP-C110001",
        salesLensSpecItemCode: "LOP-L110001",
        focusCategoryItemCode: "LOP-U110001",
        progressiveCategoryItemCode: "LOP-P110001",
        refractiveIndexNameItemCode: "LOP-I110001",
      },
      lensReplacement: {
        lensReplacementFlag: true,
        lensReplacementTypeCode: "LOP-R110001",
      },
      note: "Lens test data.",
    },
  ],
};

export const postCartInfoRequest_レンズOP登録_レンズ交換_レンズ交換分類コード無し = {
  ...postCartInfoRequest_レンズOP登録_レンズ交換,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      lensReplacement: {
        lensReplacementFlag: true,
        lensReplacementTypeCode: null,
      },
    },
  ],
}

export const postCartInfoRequest_レンズOP削除= {
  cartId: 123,
  itemCategoryCode: "12",
  checkoutFlag: false,
  customerName: undefined,
  phoneNumber: undefined,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      lensOptionCode: {
        salesColorNameItemCode: null,
        salesLensSpecItemCode: null,
        focusCategoryItemCode: null,
        progressiveCategoryItemCode: null,
        refractiveIndexNameItemCode: null,
      },
      note: "Lens test data.",
    },
  ],
};

/** カート情報登録用(処方箋画像) */
export const postCartInfoRequest_処方箋画像登録 = {
  cartId: 123,
  itemCategoryCode: "13",
  checkoutFlag: false,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      prescription: {
        prescriptionData: "/9j/4AAQSkZJRgABAQEAAAAAAAD/...",
      },
      note: "image test data.",
    },
  ],
};

/** カート情報登録用(備考) */
export const postCartInfoRequest_備考登録 = {
  cartId: 123,
  itemCategoryCode: "21",
  checkoutFlag: false,
  customerName: undefined,
  phoneNumber: undefined,
  itemGroups: [
    {
      itemGroupCode: itemGroupCode_01,
      note: "Note test data.",
    },
  ],
};

/** カート情報登録用(チェックアウト) */
export const postCartInfoRequest_チェックアウト = {
  cartId: 123,
  itemCategoryCode: "91",
  checkoutFlag: true,
};

/** カート情報登録用(チェックアウト) */
export const postCartInfoRequest_チェックアウト_保証交換 = {
  cartId: 123,
  itemCategoryCode: "91",
  checkoutFlag: true,
  warrantyExchange: {
    warrantyNumber: "241201US00001-1",
    replacementPart: "000",
  },
};

export const postCartInfoRequest_チェックアウト_保証交換_フレーム = {
  cartId: 123,
  itemCategoryCode: "91",
  checkoutFlag: true,
  warrantyExchange: {
    warrantyNumber: "241201US00001-1",
    replacementPart: "001",
  },
};

export const postCartInfoRequest_チェックアウト_保証交換_レンズ = {
  cartId: 123,
  itemCategoryCode: "91",
  checkoutFlag: true,
  warrantyExchange: {
    warrantyNumber: "241201US00001-1",
    replacementPart: "002",
  },
};
