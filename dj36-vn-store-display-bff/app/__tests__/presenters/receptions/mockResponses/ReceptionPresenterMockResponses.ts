import { fixDatetimeForDpfm } from "~/src/utils/fixDatetime";
import { addSeconds, subHours } from "date-fns";
import { TZDate } from "@date-fns/tz/date";
import { CallingStatus, DEFAULT_STORE_TIME_ZONE, ReceptionStatus } from "~/src/compornents/const";

export const currentSystemTime = new TZDate(2024, 8-1, 29, 17, 34, 56, DEFAULT_STORE_TIME_ZONE);
const oneHourAgo = subHours(currentSystemTime, 1);
const updatedDatetimeNow = fixDatetimeForDpfm(currentSystemTime);
const updatedDatetime2HoursAgo = fixDatetimeForDpfm(subHours(currentSystemTime, 2));

const receptionBase = {
  registeredDate: "2025-01-14",
  visitingPurposeCode: "010",
  customerIssueCode: "001",
  prescriptionRegistCode: "001",
  callingNumber: "A1",    // MAIN_MEASUREMENT
  receptionNumber: "250114US000001",
  statusCode: "100",
  callingStatusCode: "001",   // WAITING
  countryCodeAlpha2: "US",
  storeId: "1143416",
  customerName: "John Doe",
  phoneNumber: "07012345678",
  jinsAccountId: null,
  registeredUserId: "JINS0001",
  registeredProgram: "Step2_test",
  registeredDatetime: "2025-03-28T05:01:00",
  updatedUserId: "JINS0001",
  updatedProgram: "Step2_test",
  updatedDatetime: updatedDatetimeNow,
}

// cart 待ち状況取得APIレスポンス
export const findReceptionsResponses = {
  // ケース１：正常系データ有
  // ┌－－－－－┬－－－－－－－－┬－－－－┬－－－－－－－－－－┬－－－－－┬－－－┬－－－－－－－－－－－┬－－－－－－－－－－－－－－－－－－－－－┐
  // │　　　　　│Prescription　　│No eye　│　　　Adjustment　　│カート登録│会計　│会計後　　　　　　　　│－　　　　　　　　　　　　　　　　　　　　│
  // │　　　　　│/Eye exam 　　　│　exam　│　　　　　　　　　　│　　　　　│　　　│　　　　　　　　　　　│　　　　　　　　　　　　　　　　　　　　　│
  // ├－－－－－┼－－－－┬－－－┼－－－－┼－－－┬－－－－－－┼－－－－－┼－－－┼－－－┬－－－┬－－－┼－－－－－－－－－－－－－－－－－－－－－┤
  // │　　　　　│度数登録│測定　│度数登録│調整　│General Help│カート登録│会計　│加工　│受取　│完了　│　　　　　　　　　　　　　　　　　　　　　│
  // ├－－－－－┼－－－－┼－－－┼－－－－┼－－－┼－－－－－－┼－－－－－┼－－－┼－－－┼－－－┼－－－┼－－－－－－－－－－－－－－－－－－－－－┤
  // │対象外　　│　　　　│　　　│　　　　│　　　│　　　　　　│B4　　　　│　　　│A2　　│　　　│　　　│　　　　　　　　　　　　　　　　　　　　　│
  // ├－－－－－┼－－－－┼－－－┼－－－－┼－－－┼－－－－－－┼－－－－－┼－－－┼－－－┼－－－┼－－－│A4  ：受付ステータスがnull　　　　　　　　│
  // │呼出済　　│A12 　　│　　　│　　　　│F6　　│　　　　　　│　　　　　│　　　│　　　│　　　│　　　│F1  ：度数登録列タイプ不正　　　　　　　　│
  // ├－－－－－┼－－－－┼－－－┼－－－－┼－－－┼－－－－－－┼－－－－－┼－－－┼－－－┼－－－┼－－－│　　　　　　　　　　　　　　　　　　　　　│
  // │不在※　　│A13 　　│A14 　│　　　　│　　　│　　　　　　│　　　　　│P1　　│　　　│　　　│　　　│F10 ：キャンセル済み　　　　　　　　　　　│
  // │　　　　　│　　　　│(1h超)│　　　　│　　　│　　　　　　│　　　　　│　　　│　　　│　　　│　　　│　　　　　　　　　　　　　　　　　　　　　│
  // ├－－－－－┼－－－－┼－－－┼－－－－┼－－－┼－－－－－－┼－－－－－┼－－－┼－－－┼－－－┼－－－│G1  ：受付キャンセル　　　　　　　　　　　│
  // │呼出中※　│　　　　│A1　　│B1　　　│　　　│　　　　　　│　　　　　│　　　│　　　│　　　│　　　│F11 ：受付キャンセル・呼出ステータス不正　│
  // ├－－－－－┼－－－－┼－－－┼－－－－┼－－－┼－－－－－－┼－－－－－┼－－－┼－－－┼－－－┼－－－│　　　　　　　　　　　　　　　　　　　　　│
  // │まもなく　│A10 　　│　　　│  　　　│　　　│　　　　　　│  　　　　│A5　　│　　　│　　　│　　　│　　　　　　　　　　　　　　　　　　　　　│
  // ├－－－－－┼－－－－┼－－－┼－－－－┼－－－┼－－－－－－┼－－－－－┼－－－┼－－－┼－－－┼－－－│　　　　　　　　　　　　　　　　　　　　　│
  // │呼出待※　│A11 　　│　　　│B5　　　│　　　│　　　　　　│B3　　　　│A6　　│　　　│　　　│　　　│　　　　　　　　　　　　　　　　　　　　　│
  // │　　　　　│    　　│　　　│　　　　│　　　│G7　　　　　│　　　　　│  　　│　　　│　　　│　　　│　　　　　　　　　　　　　　　　　　　　　│
  // │　　　　　│    　　│　　　│　　　　│F8　　│　　　　　　│　　　　　│　　　│　　　│　　　│　　　│　　　　　　　　　　　　　　　　　　　　　│
  // ├－－－－－┼－－－－┼－－－┼－－－－┼－－－┼－－－－－－┼－－－－－┼－－－┼－－－┼－－－┼－－－│　　　　　　　　　　　　　　　　　　　　　│
  // │外出※　　│A9　　　│　　　│　　　　│　　　│　　　　　　│　　　　　│　　　│　　　│　　　│　　　│　　　　　　　　　　　　　　　　　　　　　│
  // ├－－－－－┼－－－－┼－－－┼－－－－┼－－－┼－－－－－－┼－－－－－┼－－－┼－－－┼－－－┼－－－│　　　　　　　　　　　　　　　　　　　　　│
  // │キャンセル│　　　　│　　　│　　　　│　　　│　　　　　　│　　　　　│　　　│　　　│　　　│　　　│　　　　　　　　　　　　　　　　　　　　　│
  // └－－－－－┴－－－－┴－－－┴－－－－┴－－－┴－－－－－－┴－－－－－┴－－－┴－－－┴－－－┴－－－┴－－－－－－－－－－－－－－－－－－－－－┘
  // 
  case1: {
    ok: true,
    status: 200,
    data: {
      receptionInfos: [
        {
          ...receptionBase,
          callingNumber: "A1",    // MAIN_MEASUREMENT
          receptionNumber: "250114US000001",
          statusCode: ReceptionStatus.MEASUREMENT,
          callingStatusCode: CallingStatus.CALLING,   // CALLING
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1001)),
        }, {
          ...receptionBase,
          callingNumber: "B1",    // OTHER_MEASUREMENT
          receptionNumber: "250114US000002",
          statusCode: ReceptionStatus.REGISTERED,
          callingStatusCode: CallingStatus.CALLING,   // CALLING
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1002)),
        }, {
          ...receptionBase,
          callingNumber: "F1",    // 列不正
          receptionNumber: "250114US000003",
          statusCode: ReceptionStatus.REGISTERED,
          callingStatusCode: CallingStatus.IN_SERVICE,   // IN_SERVICE
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1003)),
        }, {
          ...receptionBase,
          callingNumber: "G1",    // HELP
          receptionNumber: "250114US000004",
          statusCode: ReceptionStatus.CANCEL,      // CANCEL
          callingStatusCode: CallingStatus.CANCEL,   // CANCEL
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1004)),
        }, {
          ...receptionBase,
          callingNumber: "P1",    // PACKAGE
          receptionNumber: "250114US000005",
          statusCode: ReceptionStatus.PAYMENT,
          callingStatusCode: CallingStatus.NO_SHOW,   // NO_SHOW
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 3505)),
        }, {
          ...receptionBase,
          callingNumber: "B4",
          receptionNumber: "250114US000006",
          statusCode: ReceptionStatus.ORDER_NEW,
          callingStatusCode: CallingStatus.NONE,   // NONE
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1006)),
        }, {
          ...receptionBase,
          callingNumber: "A9",
          receptionNumber: "250114US000007",
          statusCode: ReceptionStatus.REGISTERED,
          callingStatusCode: CallingStatus.GOING_OUT,   // GOING_OUT
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1007)),
        }, {
          ...receptionBase,
          callingNumber: "B3",
          receptionNumber: "250114US000008",
          statusCode: ReceptionStatus.ORDER_NEW,
          callingStatusCode: CallingStatus.WAITING,
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 2008)),
        }, {
          ...receptionBase,
          callingNumber: "A2",
          receptionNumber: "250114US000011",
          statusCode: ReceptionStatus.PROCESSING,
          callingStatusCode: CallingStatus.WAITING,   // WAITING
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1011)),
        }, {
          ...receptionBase,
          callingNumber: "B5",    // MAIN_MEASUREMENT
          receptionNumber: "250114US000012",
          statusCode: ReceptionStatus.REGISTERED,
          callingStatusCode: CallingStatus.WAITING,   // WAITING
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1012)),
        }, {
          ...receptionBase,
          callingNumber: "A4",
          receptionNumber: "250114US000090",
          statusCode: null,
          callingStatusCode: CallingStatus.WAITING,   // WAITING
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1012)),
        },{
          ...receptionBase,
          callingNumber: "A5",
          receptionNumber: "250114US000013",
          statusCode: ReceptionStatus.PAYMENT,
          callingStatusCode: CallingStatus.SOON_CALL,  
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 3500)),
        },{
          ...receptionBase,
          callingNumber: "A6",
          receptionNumber: "250114US000091",
          statusCode: ReceptionStatus.PAYMENT,
          callingStatusCode: CallingStatus.WAITING,  
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 3501)),
        },{
          ...receptionBase,
          callingNumber: "F6",
          receptionNumber: "250114US000014",
          statusCode: ReceptionStatus.ADJUSTMENT,
          callingStatusCode: CallingStatus.IN_SERVICE, 
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1014)),
        },{
          ...receptionBase,
          callingNumber: "G7",
          receptionNumber: "250114US000015",
          statusCode: ReceptionStatus.GENERAL_HELP,
          callingStatusCode: CallingStatus.WAITING,
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1015)),
         },{
          ...receptionBase,
          callingNumber: "F8",
          receptionNumber: "250114US000016",
          statusCode: ReceptionStatus.ADJUSTMENT,
          callingStatusCode: CallingStatus.WAITING,
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1016)),
         },{
          ...receptionBase,
          callingNumber: "F10",
          receptionNumber: "250114US000017",
          statusCode: ReceptionStatus.CANCEL,
          callingStatusCode: CallingStatus.NO_SHOW,   // NO_SHOW
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1017)),
         },{
          ...receptionBase,
          callingNumber: "A10",
          receptionNumber: "250114US000018",
          statusCode: ReceptionStatus.REGISTERED,
          callingStatusCode: CallingStatus.SOON_CALL,   // SOON_CALL
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1018)),
         },{
          ...receptionBase,
          callingNumber: "A11",
          receptionNumber: "250114US000019",
          statusCode: ReceptionStatus.REGISTERED,
          callingStatusCode: CallingStatus.WAITING,   // WAITING
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1019)),
         },{
          ...receptionBase,
          callingNumber: "A12",
          receptionNumber: "250114US000020",
          statusCode: ReceptionStatus.REGISTERED,
          callingStatusCode: CallingStatus.IN_SERVICE,
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1021)),
         },{
          ...receptionBase,
          callingNumber: "A13",
          receptionNumber: "250114US000021",
          statusCode: ReceptionStatus.REGISTERED,
          callingStatusCode: CallingStatus.NO_SHOW,
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1021)),
         },{
          ...receptionBase,
          callingNumber: "A14",
          receptionNumber: "250114US000022",
          statusCode: ReceptionStatus.MEASUREMENT,
          callingStatusCode: CallingStatus.NO_SHOW,
          updatedDatetime: updatedDatetime2HoursAgo,
        }, {
          ...receptionBase,
          callingNumber: "F11",
          receptionNumber: "250114US000023",
          statusCode: ReceptionStatus.CANCEL,      // CANCEL
          callingStatusCode: CallingStatus.WAITING,   // 不正
          updatedDatetime: fixDatetimeForDpfm(addSeconds(oneHourAgo, 1004)),
         },
      ]
    }
  },
  // ケース２：異常系ステータス５００
  case2: {
    ok: false,
    status: 500,
    data: {
      code: "COM_0000",
      message: "Unexpected error occurred."
    }
  },
  // ケース４：受付なし
  case4: {
    ok: true,
    status: 200,
    data: {
      receptionInfos: [
      ]
    }
  }
};


// cart 呼出管理情報取得APIレスポンス
export const getCallManagementResponses = {
  // ケース１：正常系データ有
  case1: {
    ok: true,
    status: 200,
    data: {
      callManagementInfo: {
        timeRequiredUntilCall: 20,
        availableLines: 10,
        receptionCloseTime: "18:00:00",
        processingCloseTime: "20:00:00"
      }
    }
  },
  // ケース２：正常系データ有
  case2: {
    ok: true,
    status: 200,
    data: {
      callManagementInfo: {
        timeRequiredUntilCall: 20,
        availableLines: 4,
        receptionCloseTime: "17:00:00",
        processingCloseTime: "20:00:00"
      }
    }
  },
  // ケース３：異常系ステータス５００
  case3: {
    ok: false,
    status: 500,
    data: {
      code: "COM_0000",
      message: "Unexpected error occurred."
    }
  },
  // ケース３：正常系データ有(待ち列数:2)
  case5: {
    ok: true,
    status: 200,
    data: {
      callManagementInfo: {
        timeRequiredUntilCall: 20,
        availableLines: 2,
        receptionCloseTime: "18:00:00",
        processingCloseTime: "20:00:00"
      }
    }
  },
  // ケース４：正常系データ有(待ち列数:1)、17:00受付終了
  case4: {
    ok: true,
    status: 200,
    data: {
      callManagementInfo: {
        timeRequiredUntilCall: 20,
        availableLines: 1,
        receptionCloseTime: "17:00:00",
        processingCloseTime: "20:00:00"
      }
    }
  },
  // ケース６：正常系データ有
  case6: {
    ok: true,
    status: 200,
    data: {
      callManagementInfo: {
        timeRequiredUntilCall: 20,
        availableLines: 10,
        receptionCloseTime: undefined,
        processingCloseTime: "20:00:00"
      }
    }
  },
  // ケース７：正常系データ有
  case7: {
    ok: true,
    status: 200,
    data: {
      callManagementInfo: {
        timeRequiredUntilCall: 20,
        availableLines: undefined, // undefined に変更
        receptionCloseTime: "18:00:00",
        processingCloseTime: "20:00:00"
      }
    }
  },
};

// sales-order 注文詳細取得APIレスポンス
test('ReceptionPresenterMockResponses contains at least one test', () => {
  expect(true).toBe(true);
});

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
          delivery: {
            deliveryStatus: "READY_FOR_DELIVERY",
          },
          itemGroupCode: "250114US000011-1",
        },
        {
          delivery: {
            deliveryStatus: "DELIVERY_CANCELED",
          },
          itemGroupCode: "250114US000011-2",
        },
        {
          delivery: {
            deliveryStatus: "DELIVERY_PREPARING",
          },
          itemGroupCode: "250114US000011-3",
        }
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
  // ケース２：異常系ステータス５００
  case2: {
    ok: false,
    status: 500,
    data: {}
  },
}