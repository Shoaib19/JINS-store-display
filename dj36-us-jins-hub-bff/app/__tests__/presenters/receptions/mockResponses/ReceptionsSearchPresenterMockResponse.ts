export const getReceptionsSearchResponse = {
  data: {
    "receptionInfoList": [
      {
        "receptionNumber": "241230US00001",
        "orderStatusCode": "100",
        "customerName": "John Doe",
        "receptionDate": "2025-03-28T05:01:00Z",
        "callingNumber": "A44"
      },
      {
        "receptionNumber": "241230US00002",
        "orderStatusCode": "101",
        "customerName": "Smith",
        "receptionDate": "2025-04-10T05:01:00Z",
        "callingNumber": "A45"
      }
    ],
    "totalMatchCount": 2
  }
}

export const getReceptionsSearchResponse_noRecord = {
  data: {
    "receptionInfoList": [],
    "totalMatchCount": 0
  }
}

export const searchReceptionInformationResponses = {
  // ケース1：正常系_継続あり_初期ページ
  case1: {
    ok: true,
    status: 200,
    data: {
      "offset": 0,
      "count": 20,
      "limit": 20,
      "totalResults": 2,
      "hasMore": true,
      "ReceptionInfoAllItems": [
        {
        "registeredDate": "2025-03-28",
        "visitingPurposeCode": "010",
        "customerIssueCode": "001",
        "prescriptionRegistCode": "001",
        "callingNumber": "A44",
        "receptionNumber": "241230US00001",
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
      },
      {
        "registeredDate": "2025-04-10",
        "visitingPurposeCode": "010",
        "customerIssueCode": "001",
        "prescriptionRegistCode": "001",
        "callingNumber": "A45",
        "receptionNumber": "241230US00002",
        "statusCode": "101",
        "callingStatusCode": "001",
        "countryCodeAlpha2": "US",
        "storeId": 83005,
        "customerName": "Smith",
        "phoneNumber": "07012345678",
        "jinsAccountId": null,
        "registeredUserId": "JINS0001",
        "registeredProgram": "Step2_test",
        "registeredDatetime": "2025-04-10T05:01:00",
        "updatedUserId": "JINS0001",
        "updatedProgram": "Step2_test",
        "updatedDatetime": "2025-04-10T05:01:00"
      }]
    }
  },
  // ケース2：正常系_継続あり_中間ページ
  case2: {
    ok: true,
    status: 200,
    data: {
      "offset": 30,
      "count": 20,
      "limit": 20,
      "totalResults": 2,
      "hasMore": true,
      "ReceptionInfoAllItems": [
        {
        "registeredDate": "2025-03-28",
        "visitingPurposeCode": "010",
        "customerIssueCode": "001",
        "prescriptionRegistCode": "001",
        "callingNumber": "A44",
        "receptionNumber": "241230US00001",
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
      },
      {
        "registeredDate": "2025-04-10",
        "visitingPurposeCode": "010",
        "customerIssueCode": "001",
        "prescriptionRegistCode": "001",
        "callingNumber": "A45",
        "receptionNumber": "241230US00002",
        "statusCode": "101",
        "callingStatusCode": "001",
        "countryCodeAlpha2": "US",
        "storeId": 83005,
        "customerName": "Smith",
        "phoneNumber": "07012345678",
        "jinsAccountId": null,
        "registeredUserId": "JINS0001",
        "registeredProgram": "Step2_test",
        "registeredDatetime": "2025-04-10T05:01:00",
        "updatedUserId": "JINS0001",
        "updatedProgram": "Step2_test",
        "updatedDatetime": "2025-04-10T05:01:00"
      }]
    }
  },
  // ケース3：正常系_継続なし
  case3: {
    ok: true,
    status: 200,
    data: {
      "offset": 0,
      "count": 20,
      "limit": 20,
      "totalResults": 2,
      "hasMore": false,
      "ReceptionInfoAllItems": [
        {
        "registeredDate": "2025-03-28",
        "visitingPurposeCode": "010",
        "customerIssueCode": "001",
        "prescriptionRegistCode": "001",
        "callingNumber": "A44",
        "receptionNumber": "241230US00001",
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
      },
      {
        "registeredDate": "2025-04-10",
        "visitingPurposeCode": "010",
        "customerIssueCode": "001",
        "prescriptionRegistCode": "001",
        "callingNumber": "A45",
        "receptionNumber": "241230US00002",
        "statusCode": "101",
        "callingStatusCode": "001",
        "countryCodeAlpha2": "US",
        "storeId": 83005,
        "customerName": "Smith",
        "phoneNumber": "07012345678",
        "jinsAccountId": null,
        "registeredUserId": "JINS0001",
        "registeredProgram": "Step2_test",
        "registeredDatetime": "2025-04-10T05:01:00",
        "updatedUserId": "JINS0001",
        "updatedProgram": "Step2_test",
        "updatedDatetime": "2025-04-10T05:01:00"
      }]
    }
  },
  // ケース4：正常系_継続なし_レコードなし
  case4: {
    ok: true,
    status: 200,
    data: {
      "offset": 0,
      "count": 0,
      "limit": 20,
      "totalResults": 0,
      "hasMore": false,
      "ReceptionInfoAllItems": []
    }
  },
  // ケース5：異常系ステータス400
  case5: {
    ok: false,
    status: 400,
    data: {
      "code": "COM_0001",
      "message": "Validation error occurred."
    }
  }
}
  
