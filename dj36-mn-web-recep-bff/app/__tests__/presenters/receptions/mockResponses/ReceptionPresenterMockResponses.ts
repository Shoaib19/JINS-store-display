import { fixDatetimeForDpfm } from "~/src/utils/fixDatetime";
import { subHours } from "date-fns";
import { TZDate } from "@date-fns/tz/date";
import { DEFAULT_STORE_TIME_ZONE } from "~/src/compornents/const";

export const currentSystemTime = new TZDate(2024, 8-1, 29, 17, 34, 56, DEFAULT_STORE_TIME_ZONE);
const updatedDatetimeNow = fixDatetimeForDpfm(currentSystemTime);
const updatedDatetime2HoursAgo = fixDatetimeForDpfm(subHours(currentSystemTime, 2));


// cart 待ち状況取得APIレスポンス
export const findReceptionsResponses = {
  // ケース１：正常系データ有
  // ┌－－－－－┬－－－－┬－－┬－－┬－－－－－－┬－－－－－┬－－┬－－－－－－－－┬－－－－－┬－－┐
  // │　　　　　│度数登録│測定│調整│General Help│カート登録│会計│加工・調整・受取│キャンセル│不正│
  // ├－－－－－┼－－－－┼－－┼－－┼－－－－－－┼－－－－－┼－－┼－－－－－－－－┼－－－－－┼－－┤
  // │対象外　　│　　　　│　　│　　│　　　　　　│B4　　　　│　　│A2　　　　　　　│　　　　　│A4　│
  // ├－－－－－┼－－－－┼－－┼－－┼－－－－－－┼－－－－－┼－－┼－－－－－－－－┼－－－－－┼－－┤
  // │呼出待　　│A1　　　│　　│F8　│G7　　　　　│　　　　　│B3　│　　　　　　　　│　　　　　│　　│
  // │　　　　　│F1　　　│　　│　　│　　　　　　│　　　　　│　　│　　　　　　　　│　　　　　│　　│
  // │　　　　　│B5　　　│　　│　　│　　　　　　│　　　　　│　　│　　　　　　　　│　　　　　│　　│
  // ├－－－－－┼－－－－┼－－┼－－┼－－－－－－┼－－－－－┼－－┼－－－－－－－－┼－－－－－┼－－┤
  // │呼出中　　│　　　　│B1　│F6　│　　　　　　│　　　　　│A5　│　　　　　　　　│　　　　　│　　│
  // ├－－－－－┼－－－－┼－－┼－－┼－－－－－－┼－－－－－┼－－┼－－－－－－－－┼－－－－－┼－－┤
  // │呼出済　　│　　　　│　　│　　│　　　　　　│　　　　　│　　│　　　　　　　　│　　　　　│　　│
  // ├－－－－－┼－－－－┼－－┼－－┼－－－－－－┼－－－－－┼－－┼－－－－－－－－┼－－－－－┼－－┤
  // │不在　　　│　　　　│　　│　　│　　　　　　│　　　　　│P1　│　　　　　　　　│　　　　　│　　│
  // ├－－－－－┼－－－－┼－－┼－－┼－－－－－－┼－－－－－┼－－┼－－－－－－－－┼－－－－－┼－－┤
  // │外出　　　│B2　　　│　　│　　│　　　　　　│　　　　　│　　│　　　　　　　　│　　　　　│　　│
  // ├－－－－－┼－－－－┼－－┼－－┼－－－－－－┼－－－－－┼－－┼－－－－－－－－┼－－－－－┼－－┤
  // │キャンセル│　　　　│　　│　　│　　　　　　│　　　　　│　　│　　　　　　　　│G1　　　　│F10 │
  // └－－－－－┴－－－－┴－－┴－－┴－－－－－－┴－－－－－┴－－┴－－－－－－－－┴－－－－－┴－－┘
  // 
  case1: {
    ok: true,
    status: 200,
    data: {
      receptionInfos: [
        {
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
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "002",
          callingNumber: "B1",    // OTHER_MEASURMENT
          receptionNumber: "250114US000002",
          statusCode: "101",
          callingStatusCode: "002",   // CALLING
          countryCodeAlpha2: "US",
          storeId: "1143416",
          customerName: "Smith",
          phoneNumber: "07012345679",
          jinsAccountId: null,
          registeredUserId: "JINS0001",
          registeredProgram: "Step2_test",
          registeredDatetime: "2025-03-28T05:01:00",
          updatedUserId: "JINS0001",
          updatedProgram: "Step2_test",
          updatedDatetime: updatedDatetimeNow,
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "003",
          callingNumber: "F1",    // REPAIR
          receptionNumber: "250114US000003",
          statusCode: "100",
          callingStatusCode: "003",   // IN_SERVICE
          countryCodeAlpha2: "US",
          storeId: "1143416",
          customerName: "Smith",
          phoneNumber: "07012345679",
          jinsAccountId: null,
          registeredUserId: "JINS0001",
          registeredProgram: "Step2_test",
          registeredDatetime: "2025-03-28T05:01:00",
          updatedUserId: "JINS0001",
          updatedProgram: "Step2_test",
          updatedDatetime: updatedDatetimeNow,
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "003",
          callingNumber: "G1",    // HELP
          receptionNumber: "250114US000004",
          statusCode: "900",      // CANCEL
          callingStatusCode: "020",   // CANCEL
          countryCodeAlpha2: "US",
          storeId: "1143416",
          customerName: "Smith",
          phoneNumber: "07012345679",
          jinsAccountId: null,
          registeredUserId: "JINS0001",
          registeredProgram: "Step2_test",
          registeredDatetime: "2025-03-28T05:01:00",
          updatedUserId: "JINS0001",
          updatedProgram: "Step2_test",
          updatedDatetime: updatedDatetimeNow,
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "003",
          callingNumber: "P1",    // PACKAGE
          receptionNumber: "250114US000005",
          statusCode: "300",
          callingStatusCode: "090",   // NO_SHOW
          countryCodeAlpha2: "US",
          storeId: "1143416",
          customerName: "Smith",
          phoneNumber: "07012345679",
          jinsAccountId: null,
          registeredUserId: "JINS0001",
          registeredProgram: "Step2_test",
          registeredDatetime: "2025-03-28T05:01:00",
          updatedUserId: "JINS0001",
          updatedProgram: "Step2_test",
          updatedDatetime: updatedDatetimeNow,
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "003",
          callingNumber: "B4",
          receptionNumber: "250114US000006",
          statusCode: "200",
          callingStatusCode: "000",   // NONE
          countryCodeAlpha2: "US",
          storeId: "1143416",
          customerName: "Smith",
          phoneNumber: "07012345679",
          jinsAccountId: null,
          registeredUserId: "JINS0001",
          registeredProgram: "Step2_test",
          registeredDatetime: "2025-03-28T05:01:00",
          updatedUserId: "JINS0001",
          updatedProgram: "Step2_test",
          updatedDatetime: updatedDatetimeNow,
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "003",
          callingNumber: "B2",
          receptionNumber: "250114US000007",
          statusCode: "100",
          callingStatusCode: "091",   // OUTING
          countryCodeAlpha2: "US",
          storeId: "1143416",
          customerName: "Smith",
          phoneNumber: "07012345679",
          jinsAccountId: null,
          registeredUserId: "JINS0001",
          registeredProgram: "Step2_test",
          registeredDatetime: "2025-03-28T05:01:00",
          updatedUserId: "JINS0001",
          updatedProgram: "Step2_test",
          updatedDatetime: updatedDatetimeNow,
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "003",
          callingNumber: "B3",
          receptionNumber: "250114US000008",
          statusCode: "300",
          callingStatusCode: "001",
          countryCodeAlpha2: "US",
          storeId: "1143416",
          customerName: "Smith",
          phoneNumber: "07012345679",
          jinsAccountId: null,
          registeredUserId: "JINS0001",
          registeredProgram: "Step2_test",
          registeredDatetime: "2025-03-28T05:01:00",
          updatedUserId: "JINS0001",
          updatedProgram: "Step2_test",
          updatedDatetime: updatedDatetimeNow,
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "001",
          callingNumber: "A2",
          receptionNumber: "250114US000011",
          statusCode: "400",
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
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "001",
          callingNumber: "B5",    // MAIN_MEASUREMENT
          receptionNumber: "250114US000012",
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
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "001",
          callingNumber: "A4",
          receptionNumber: "250114US000090",
          statusCode: null,
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
        },{
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "001",
          callingNumber: "A5",
          receptionNumber: "250114US000013",
          statusCode: "300",
          callingStatusCode: "002",  
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
        },{
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "001",
          callingNumber: "F6",
          receptionNumber: "250114US000014",
          statusCode: "401",
          callingStatusCode: "003", 
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
        },{
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "003",
          callingNumber: "G7",
          receptionNumber: "250114US000015",
          statusCode: "402",
          callingStatusCode: "091",   // WAITING
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
         },{
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "001",
          callingNumber: "F8",
          receptionNumber: "250114US000016",
          statusCode: "401",
          callingStatusCode: "090",   // WAITING
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
         },{
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "001",
          callingNumber: "F10",
          receptionNumber: "250114US000017",
          statusCode: "901",
          callingStatusCode: "090",   // NO_SHOW
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
  // ケース３：不在ステータスと受付時間1時間以上前のデータを含む
  case3: {
    ok: true,
    status: 200,
    data: {
      receptionInfos: [
        {
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
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "002",
          callingNumber: "B1",    // OTHER_MEASURMENT
          receptionNumber: "250114US000002",
          statusCode: "101",
          callingStatusCode: "002",   // CALLING
          countryCodeAlpha2: "US",
          storeId: "1143416",
          customerName: "Smith",
          phoneNumber: "07012345679",
          jinsAccountId: null,
          registeredUserId: "JINS0001",
          registeredProgram: "Step2_test",
          registeredDatetime: "2025-03-28T05:01:00",
          updatedUserId: "JINS0001",
          updatedProgram: "Step2_test",
          updatedDatetime: updatedDatetimeNow,
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "003",
          callingNumber: "F1",    // REPAIR
          receptionNumber: "250114US000003",
          statusCode: "100",
          callingStatusCode: "003",   // IN_SERVICE
          countryCodeAlpha2: "US",
          storeId: "1143416",
          customerName: "Smith",
          phoneNumber: "07012345679",
          jinsAccountId: null,
          registeredUserId: "JINS0001",
          registeredProgram: "Step2_test",
          registeredDatetime: "2025-03-28T05:01:00",
          updatedUserId: "JINS0001",
          updatedProgram: "Step2_test",
          updatedDatetime: updatedDatetimeNow,
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "003",
          callingNumber: "G1",    // HELP
          receptionNumber: "250114US000004",
          statusCode: "900",      // CANCEL
          callingStatusCode: "020",   // CANCEL
          countryCodeAlpha2: "US",
          storeId: "1143416",
          customerName: "Smith",
          phoneNumber: "07012345679",
          jinsAccountId: null,
          registeredUserId: "JINS0001",
          registeredProgram: "Step2_test",
          registeredDatetime: "2025-03-28T05:01:00",
          updatedUserId: "JINS0001",
          updatedProgram: "Step2_test",
          updatedDatetime: updatedDatetimeNow,
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "003",
          callingNumber: "P1",    // PACKAGE
          receptionNumber: "250114US000005",
          statusCode: "100",
          callingStatusCode: "090",   // NO_SHOW
          countryCodeAlpha2: "US",
          storeId: "1143416",
          customerName: "Smith",
          phoneNumber: "07012345679",
          jinsAccountId: null,
          registeredUserId: "JINS0001",
          registeredProgram: "Step2_test",
          registeredDatetime: "2025-03-28T05:01:00",
          updatedUserId: "JINS0001",
          updatedProgram: "Step2_test",
          updatedDatetime: updatedDatetime2HoursAgo,
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "003",
          callingNumber: "B1",
          receptionNumber: "250114US000006",
          statusCode: "200",
          callingStatusCode: "000",   // NONE
          countryCodeAlpha2: "US",
          storeId: "1143416",
          customerName: "Smith",
          phoneNumber: "07012345679",
          jinsAccountId: null,
          registeredUserId: "JINS0001",
          registeredProgram: "Step2_test",
          registeredDatetime: "2025-03-28T05:01:00",
          updatedUserId: "JINS0001",
          updatedProgram: "Step2_test",
          updatedDatetime: updatedDatetimeNow,
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "003",
          callingNumber: "B1",
          receptionNumber: "250114US000007",
          statusCode: "100",
          callingStatusCode: "091",   // OUTING
          countryCodeAlpha2: "US",
          storeId: "1143416",
          customerName: "Smith",
          phoneNumber: "07012345679",
          jinsAccountId: null,
          registeredUserId: "JINS0001",
          registeredProgram: "Step2_test",
          registeredDatetime: "2025-03-28T05:01:00",
          updatedUserId: "JINS0001",
          updatedProgram: "Step2_test",
          updatedDatetime: updatedDatetimeNow,
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "003",
          callingNumber: "B1",
          receptionNumber: "250114US000008",
          statusCode: "300",
          callingStatusCode: "003",
          countryCodeAlpha2: "US",
          storeId: "1143416",
          customerName: "Smith",
          phoneNumber: "07012345679",
          jinsAccountId: null,
          registeredUserId: "JINS0001",
          registeredProgram: "Step2_test",
          registeredDatetime: "2025-03-28T05:01:00",
          updatedUserId: "JINS0001",
          updatedProgram: "Step2_test",
          updatedDatetime: updatedDatetimeNow,
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "001",
          callingNumber: "A1",
          receptionNumber: "250114US000011",
          statusCode: "400",
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
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "001",
          callingNumber: "A1",    // MAIN_MEASUREMENT
          receptionNumber: "250114US000012",
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
        }, {
          registeredDate: "2025-01-14",
          visitingPurposeCode: "010",
          customerIssueCode: "001",
          prescriptionRegistCode: "001",
          callingNumber: "A1",
          receptionNumber: "250114US000090",
          statusCode: null,
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
        },
      ]
    }
  },
};

// cart 呼出管理情報取得APIレスポンス
export const getCallManagementResponses = {
  // ケース１：正常系データ有
  case1: {
    ok: true,
    status: 200,
    data: {
      callManagementInfo: {
        timeRequiredUntilCall: 200,
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
        timeRequiredUntilCall: 200,
        availableLines: 2,
        receptionCloseTime: "18:00:00",
        processingCloseTime: "20:00:00"
      }
    }
  },
  // ケース４：正常系データ有(待ち列数:1)
  case4: {
    ok: true,
    status: 200,
    data: {
      callManagementInfo: {
        timeRequiredUntilCall: 200,
        availableLines: 1,
        receptionCloseTime: "18:00:00",
        processingCloseTime: "20:00:00"
      }
    }
  },
};

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
