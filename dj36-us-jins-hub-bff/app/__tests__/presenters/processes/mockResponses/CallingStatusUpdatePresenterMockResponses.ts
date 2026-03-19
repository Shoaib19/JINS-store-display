// 受付情報検索API
const reception_Info_Base = {
  registeredDate: "2025-03-28",
  visitingPurposeCode: "010",
  customerIssueCode: "001",
  prescriptionRegistCode: "001",
  callingNumber: "A44",
  receptionNumber: "241230US00001",
  statusCode: "100",
  callingStatusCode: "001",
  countryCodeAlpha2: "US",
  storeId: 83005,
  customerName: "John Doe",
  phoneNumber: "07012345678",
  jinsAccountId: null,
  registeredUserId: "JINS0001",
  registeredProgram: "Step2_test",
  registeredDatetime: "2025-03-28T05:01:00",
  updatedUserId: "JINS0001",
  updatedProgram: "Step2_test",
  updatedDatetime: "2025-03-28T05:01:00",
};

const receptionInfo_カート登録 = {
  ...reception_Info_Base,
  statusCode: "200",
  callingStatusCode: "000",
};

const receptionInfo_会計_呼出待 = {
  ...reception_Info_Base,
  statusCode: "300",
  callingStatusCode: "001",
};

const receptionInfo_会計_不在 = {
  ...reception_Info_Base,
  statusCode: "300",
  callingStatusCode: "090",
};

const receptionInfo_GeneralHelp_呼出待 = {
  ...reception_Info_Base,
  statusCode: "402",
  callingStatusCode: "001",
};

const receptionInfo_GeneralHelp_不在 = {
  ...reception_Info_Base,
  statusCode: "402",
  callingStatusCode: "090",
};

const receptionInfo_測定_呼出待 = {
  ...reception_Info_Base,
  statusCode: "100",
  callingStatusCode: "001",
};

const receptionInfo_測定_呼出中 = {
  ...reception_Info_Base,
  statusCode: "100",
  callingStatusCode: "002",
};

const receptionInfo_測定_呼出済 = {
  ...reception_Info_Base,
  statusCode: "100",
  callingStatusCode: "003",
};

const receptionInfo_測定_不在 = {
  ...reception_Info_Base,
  statusCode: "100",
  callingStatusCode: "090",
};

const receptionInfo_度数登録_呼出待 = {
  ...reception_Info_Base,
  statusCode: "101",
  callingStatusCode: "001",
};

const receptionInfo_度数登録_呼出中 = {
  ...reception_Info_Base,
  statusCode: "101",
  callingStatusCode: "002",
};

const receptionInfo_度数登録_呼出済 = {
  ...reception_Info_Base,
  statusCode: "101",
  callingStatusCode: "003",
};

const receptionInfo_度数登録_不在 = {
  ...reception_Info_Base,
  statusCode: "101",
  callingStatusCode: "090",
};

const receptionInfo_調整_呼出待 = {
  ...reception_Info_Base,
  statusCode: "401",
  callingStatusCode: "001",
};

const receptionInfo_調整_呼出中 = {
  ...reception_Info_Base,
  statusCode: "401",
  callingStatusCode: "002",
};

const receptionInfo_調整_呼出済 = {
  ...reception_Info_Base,
  statusCode: "401",
  callingStatusCode: "003",
};

const receptionInfo_調整_不在 = {
  ...reception_Info_Base,
  statusCode: "401",
  callingStatusCode: "090",
};

const receptionInfo_受付キャンセル = {
  ...reception_Info_Base,
  statusCode: "900",
};

export const responseSearchReceptionInformation_レコードなし = {
  ReceptionInfoAllItems: [],
};

export const responseSearchReceptionInformation_カート登録 = {
  ReceptionInfoAllItems: [receptionInfo_カート登録],
};

export const responseSearchReceptionInformation_会計_呼出待 = {
  ReceptionInfoAllItems: [receptionInfo_会計_呼出待],
};

export const responseSearchReceptionInformation_会計_呼出中 = {
  ReceptionInfoAllItems: [receptionInfo_会計_呼出待],
};

export const responseSearchReceptionInformation_会計_不在 = {
  ReceptionInfoAllItems: [receptionInfo_会計_不在],
};

export const responseSearchReceptionInformation_測定_呼出待 = {
  ReceptionInfoAllItems: [receptionInfo_測定_呼出待],
};

export const responseSearchReceptionInformation_測定_呼出中 = {
  ReceptionInfoAllItems: [receptionInfo_測定_呼出待],
};

export const responseSearchReceptionInformation_測定_呼出済 = {
  ReceptionInfoAllItems: [receptionInfo_測定_呼出済],
};

export const responseSearchReceptionInformation_測定_不在 = {
  ReceptionInfoAllItems: [receptionInfo_測定_不在],
};

export const responseSearchReceptionInformation_度数登録_呼出待 = {
  ReceptionInfoAllItems: [receptionInfo_度数登録_呼出待],
};

export const responseSearchReceptionInformation_度数登録_呼出中 = {
  ReceptionInfoAllItems: [receptionInfo_度数登録_呼出待],
};

export const responseSearchReceptionInformation_度数登録_呼出済 = {
  ReceptionInfoAllItems: [receptionInfo_度数登録_呼出済],
};

export const responseSearchReceptionInformation_度数登録_不在 = {
  ReceptionInfoAllItems: [receptionInfo_度数登録_不在],
};

export const responseSearchReceptionInformation_調整_呼出待 = {
  ReceptionInfoAllItems: [receptionInfo_調整_呼出待],
};

export const responseSearchReceptionInformation_調整_呼出中 = {
  ReceptionInfoAllItems: [receptionInfo_調整_呼出中],
};

export const responseSearchReceptionInformation_調整_呼出済 = {
  ReceptionInfoAllItems: [receptionInfo_調整_呼出済],
};

export const responseSearchReceptionInformation_調整_不在 = {
  ReceptionInfoAllItems: [receptionInfo_調整_不在],
};

export const responseSearchReceptionInformation_GeneralHelp_呼出待 = {
  ReceptionInfoAllItems: [receptionInfo_GeneralHelp_呼出待],
};

export const responseSearchReceptionInformation_GeneralHelp_呼出中 = {
  ReceptionInfoAllItems: [receptionInfo_GeneralHelp_呼出待],
};

export const responseSearchReceptionInformation_GeneralHelp_不在 = {
  ReceptionInfoAllItems: [receptionInfo_GeneralHelp_不在],
};

export const responseSearchReceptionInformation_受付キャンセル = {
  ReceptionInfoAllItems: [receptionInfo_受付キャンセル],
};

// 待ち状況取得API(受付情報検索APIとはレスポンスの型は異なる)
const receptionInfoWait_Base = {
  registeredDate: "2025-01-14",
  visitingPurposeCode: "010",
  customerIssueCode: "001",
  prescriptionRegistCode: "001",
  callingNumber: "A1",
  receptionNumber: "250114US000001",
  statusCode: "100",
  callingStatusCode: "001",
  countryCodeAlpha2: "US",
  storeId: "1143416",
  customerName: "John Doe",
  phoneNumber: "07012345678",
  jinsAccountId: null,
};
const receptionInfoWait_測定_呼出待 = {
  ...receptionInfoWait_Base,
  statusCode: "100",
  callingStatusCode: "001",
};

const receptionInfoWait_測定_呼出中 = {
  ...receptionInfoWait_Base,
  statusCode: "100",
  callingStatusCode: "002",
};

const receptionInfoWait_測定_不在 = {
  ...receptionInfoWait_Base,
  statusCode: "100",
  callingStatusCode: "090",
};
const receptionInfoWait_度数登録_呼出待 = {
  ...receptionInfoWait_Base,
  statusCode: "101",
  callingStatusCode: "001",
};

const receptionInfoWait_度数登録_呼出中 = {
  ...receptionInfoWait_Base,
  statusCode: "101",
  callingStatusCode: "002",
};

const receptionInfoWait_度数登録_もうすぐ呼出 = {
  ...receptionInfoWait_Base,
  statusCode: "101",
  callingStatusCode: "004",
};

const receptionInfoWait_度数登録_不在 = {
  ...receptionInfoWait_Base,
  statusCode: "101",
  callingStatusCode: "090",
};

const receptionInfoWait_調整_呼出待 = {
  ...receptionInfoWait_Base,
  statusCode: "401",
  callingStatusCode: "001",
};

const receptionInfoWait_調整_呼出中 = {
  ...receptionInfoWait_Base,
  statusCode: "401",
  callingStatusCode: "002",
};

const receptionInfoWait_調整_不在 = {
  ...receptionInfoWait_Base,
  statusCode: "401",
  callingStatusCode: "090",
};

export const responseGetReceptionsServer = {
  receptionInfos: [
    {
      ...receptionInfoWait_度数登録_呼出中,
      callingNumber: "A1",
      receptionNumber: "250114US000011",
    },
    {
      ...receptionInfoWait_度数登録_もうすぐ呼出,
      callingNumber: "A2",
      receptionNumber: "250114US000012",
    },
    {
      ...receptionInfoWait_度数登録_呼出待,
      callingNumber: "A3",
      receptionNumber: "250114US000013",
    },
    {
      ...receptionInfoWait_度数登録_呼出待,
      callingNumber: "A4",
      receptionNumber: "250114US000014",
    },
    {
      ...receptionInfoWait_調整_呼出待,
      callingNumber: "F4",
      receptionNumber: "250114US000015",
    }
  ],
};

export const responseGetReceptionsServer_不在の受付あり = {
  receptionInfos: [
    {
      ...receptionInfoWait_度数登録_不在,
      callingNumber: "A1",
      receptionNumber: "250114US000011",
    },
    {
      ...receptionInfoWait_度数登録_もうすぐ呼出,
      callingNumber: "A2",
      receptionNumber: "250114US000012",
    },
    {
      ...receptionInfoWait_度数登録_呼出待,
      callingNumber: "A3",
      receptionNumber: "250114US000013",
    },
    {
      ...receptionInfoWait_度数登録_呼出待,
      callingNumber: "A4",
      receptionNumber: "250114US000014",
    },
    {
      ...receptionInfoWait_調整_不在,
      callingNumber: "F4",
      receptionNumber: "250114US000015",
    }
  ],
};

export const responseGetCallManagement = {
  callManagementInfo: {
    timeRequiredUntilCall: 200,
    availableLines: 2,
    receptionCloseTime: "08:00:00",
    processingCloseTime: "20:00:00",
  },
};

export const responseGetCallManagement_測定ライン数_不正 = {
  callManagementInfo: {
    timeRequiredUntilCall: 200,
    availableLines: undefined,
    receptionCloseTime: "08:00:00",
    processingCloseTime: "20:00:00",
  },
};

export const responseGetCallManagement_時間ごと設定あり = {
  callManagementInfo: {
    timeRequiredUntilCall: 200,
    availableLines: 2,
    lineSettings: [
      {startTime: "10:00:00", availableLines: 1},
      {startTime: "12:00:00", availableLines: 3},
      {startTime: "13:00:00", availableLines: 2},
    ],
    receptionCloseTime: "08:00:00",
    processingCloseTime: "20:00:00",
  },
};
