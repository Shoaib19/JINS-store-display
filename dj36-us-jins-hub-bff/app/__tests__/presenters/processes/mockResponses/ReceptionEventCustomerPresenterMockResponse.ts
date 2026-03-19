export const responseSearchReceptionInformation_正常 = {
  "ReceptionInfoAllItems": [
  {
  "registeredDate": "2025-03-28",
  "visitingPurposeCode": "010",
  "customerIssueCode": "001",
  "prescriptionRegistCode": "001",
  "callingNumber": "A44",
  "receptionNumber": "241230US000001",
  "statusCode": "100",
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
}

export const responseSearchReceptionInformation_もうすぐ呼出 = {
  "ReceptionInfoAllItems": [
  {
  "registeredDate": "2025-03-28",
  "visitingPurposeCode": "010",
  "customerIssueCode": "001",
  "prescriptionRegistCode": "001",
  "callingNumber": "A44",
  "receptionNumber": "241230US000001",
  "statusCode": "100",
  "callingStatusCode": "004",
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
}

export const responseSearchReceptionInformation_対応中 = {
  "ReceptionInfoAllItems": [
  {
  "registeredDate": "2025-03-28",
  "visitingPurposeCode": "010",
  "customerIssueCode": "001",
  "prescriptionRegistCode": "001",
  "callingNumber": "A44",
  "receptionNumber": "241230US000001",
  "statusCode": "100",
  "callingStatusCode": "003",
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
}

export const responseSearchReceptionInformation_undefind = {
  "ReceptionInfoAllItems": [
  {
  "registeredDate": "2025-03-28",
  "visitingPurposeCode": "010",
  "customerIssueCode": "001",
  "prescriptionRegistCode": "001",
  "callingNumber": "A44",
  "statusCode": "100",
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
  }]
}

export const responseSearchReceptionInformation_検索結果なし = {
  "ReceptionInfoAllItems": [
]
}

export const responseSearchReceptionInformation_ステータス404 = {
  "ok": false,
  "status": 404,
  "data": {
    "code": "COM_0002",
    "message": "Specified data not found."
  }
};

export const responseFindReceptionEvents_単一商品グループ = {
  "rcptEvent": [
    {
      "rowid": 1,
      "receptionNumber": "240115US000001",
      "itemGroupCode": "240115US000001-1",
      "eventCode": "000",
      "storeCode": "84403",
      "jinsAccountId": null,
      "registeredUserId": "staff001",
      "registeredProgram": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "registeredDatetime": "2024-10-15T10:00:00",
      "updatedUserId": "staff001",
      "updatedProgram": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "updatedDatetime": "2024-10-15T10: 00: 00",
      "optimisticLockVerNo": 1,
      "eventName": "Check-in",
      "staffName": "STAFF_NAME"
    }
  ]
}

export const responseFindReceptionEvents_複数商品グループ = {
  "rcptEvent": [
    {
      "rowid": 1,
      "receptionNumber": "240115US000001",
      "itemGroupCode": "240115US000001-1",
      "eventCode": "000",
      "storeCode": "84403",
      "jinsAccountId": null,
      "registeredUserId": "staff001",
      "registeredProgram": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "registeredDatetime": "2024-10-15T10:00:00",
      "updatedUserId": "staff001",
      "updatedProgram": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "updatedDatetime": "2024-10-15T10: 00: 00",
      "optimisticLockVerNo": 1,
      "eventName": "Check-in",
      "staffName": "STAFF_NAME"
    },
    {
      "rowid": 3,
      "receptionNumber": "240115US000001",
      "itemGroupCode": "240115US000001-1",
      "eventCode": "100",
      "storeCode": "84403",
      "jinsAccountId": null,
      "registeredUserId": "staff001",
      "registeredProgram": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "registeredDatetime": "2024-10-15T10:00:00",
      "updatedUserId": "staff001",
      "updatedProgram": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "updatedDatetime": "2024-10-15T10: 00: 00",
      "optimisticLockVerNo": 1,
      "eventName": "Registered",
      "staffName": "STAFF_NAME"
    },
    {
      "rowid": 17,
      "receptionNumber": "240115US000001",
      "itemGroupCode": "240115US000001-1",
      "eventCode": "200",
      "storeCode": "84403",
      "jinsAccountId": null,
      "registeredUserId": "staff001",
      "registeredProgram": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "registeredDatetime": "2024-10-15T10:00:00",
      "updatedUserId": "staff001",
      "updatedProgram": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "updatedDatetime": "2024-10-15T10: 00: 00",
      "optimisticLockVerNo": 1,
      "eventName": "Order New",
      "staffName": "STAFF_NAME"
    },
    {
      "rowid": 19,
      "receptionNumber": "240115US000001",
      "itemGroupCode": "240115US000001-2",
      "eventCode": "200",
      "storeCode": "84403",
      "jinsAccountId": null,
      "registeredUserId": "staff001",
      "registeredProgram": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "registeredDatetime": "2024-10-15T10:00:00",
      "updatedUserId": "staff001",
      "updatedProgram": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "updatedDatetime": "2024-10-15T10: 00: 00",
      "optimisticLockVerNo": 1,
      "eventName": "Order New",
      "staffName": "STAFF_NAME"
    },
    {
      "rowid": 17,
      "receptionNumber": "240115US000001",
      "itemGroupCode": "240115US000001-1",
      "eventCode": "300",
      "storeCode": "84403",
      "jinsAccountId": null,
      "registeredUserId": "staff001",
      "registeredProgram": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "registeredDatetime": "2024-10-15T10:00:00",
      "updatedUserId": "staff001",
      "updatedProgram": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "updatedDatetime": "2024-10-15T10: 00: 00",
      "optimisticLockVerNo": 1,
      "eventName": "Payment",
      "staffName": "STAFF_NAME"
    },
 ]
}

export const responseFindReceptionEvents_staffNemeNull = {
  "rcptEvent": [
    {
      "rowid": 1,
      "receptionNumber": "240115US000001",
      "itemGroupCode": "240115US000001-1",
      "eventCode": "000",
      "storeCode": "84403",
      "jinsAccountId": null,
      "registeredUserId": "staff001",
      "registeredProgram": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "registeredDatetime": "2024-10-15T10:00:00",
      "updatedUserId": "staff001",
      "updatedProgram": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "updatedDatetime": "2024-10-15T10: 00: 00",
      "optimisticLockVerNo": 1,
      "eventName": "Check-in",
      "staffName": null
    }
  ]
}
