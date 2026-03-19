// 受付情報検索APIレスポンス
export const getReceptionsResponses = {
  // ケース１：正常系
  case1: {
    ok: true,
    status: 200,
    data: {
      "ReceptionInfoAllItems": [
        {
          "registeredDate": "2025-03-28",
          "visitingPurposeCode": "010",
          "customerIssueCode": "001",
          "prescriptionRegistCode": "001",
          "callingNumber": "A44",
          "receptionNumber": "241230US00001",
          "statusCode": "101",
          "callingStatusCode": "001",
          "countryCodeAlpha2": "US",
          "storeId": 83005,
          "customerName": "John Doe",
          "phoneNumber": "07012345678",
          "jinsAccountId": null,
          "registeredUserId": "JINS0001",
          "registeredProgram": "Step2_test",
          "registeredDatetime": "2999-12-31T09:01:00",
          "updatedUserId": "JINS0001",
          "updatedProgram": "Step2_test",
          "updatedDatetime": "2025/03/28T5:01:00"
        },
        {
          "registeredDate": "2025-03-28",
          "visitingPurposeCode": "010",
          "customerIssueCode": "001",
          "prescriptionRegistCode": "002",
          "callingNumber": "A45",
          "receptionNumber": "241230US00002",
          "statusCode": "101",
          "callingStatusCode": "001",
          "countryCodeAlpha2": "US",
          "storeId": 83005,
          "customerName": "Smith",
          "phoneNumber": "07012345679",
          "jinsAccountId": null,
          "registeredUserId": "JINS0001",
          "registeredProgram": "Step2_test",
          "registeredDatetime": "2025/03/28T5:01:00",
          "updatedUserId": "JINS0001",
          "updatedProgram": "Step2_test",
          "updatedDatetime": "2025/03/28T5:01:00"
        }
      ]
    }
  },
  case2: {
    ok: true,
    status: 200,
    data: {
      "ReceptionInfoAllItems": []
    }
  },
  case3: {
    ok: true,
    status: 200,
    data: {
      "ReceptionInfoAllItems": [
        {
          "registeredDate": "2025-03-28",
          "visitingPurposeCode": "010",
          "customerIssueCode": "001",
          "prescriptionRegistCode": "001",
          "callingNumber": "A44",
          "receptionNumber": "241230US00001",
          "statusCode": "101",
          "callingStatusCode": "001",
          "countryCodeAlpha2": "US",
          "storeId": 83005,
          "customerName": "John Doe",
          "phoneNumber": "07012345678",
          "jinsAccountId": null,
          "registeredUserId": "JINS0001",
          "registeredProgram": "Step2_test",
          "registeredDatetime": null,
          "updatedUserId": "JINS0001",
          "updatedProgram": "Step2_test",
          "updatedDatetime": "2025/03/28T5:01:00"
        }
      ]
    }
  },
  // ケース4：異常系ステータス５００
  case4: {
    ok: false,
    status: 500,
    data: {}
  },
  case5: {
    ok: true,
    status: 200,
    data: {
      "ReceptionInfoAllItems": [
        {
          "registeredDate": "2025-03-28",
          "visitingPurposeCode": "010",
          "customerIssueCode": "001",
          "prescriptionRegistCode": "001",
          "callingNumber": "A44",
          "receptionNumber": "241230US00001",
          "statusCode": "300",
          "callingStatusCode": "001",
          "countryCodeAlpha2": "US",
          "storeId": 83005,
          "customerName": "John Doe",
          "phoneNumber": "07012345678",
          "jinsAccountId": null,
          "registeredUserId": "JINS0001",
          "registeredProgram": "Step2_test",
          "registeredDatetime": null,
          "updatedUserId": "JINS0001",
          "updatedProgram": "Step2_test",
          "updatedDatetime": "2025/03/28T5:01:00"
        }
      ]
    }
  },
}

// 呼出し管理情報取得APIレスポンス
export const getCallManagementResponses = {
  case1: {
    ok: true,
    status: 200,
    data: {
      "callManagementInfo": {
        "timeRequiredUntilCall": 200,
        "availableLines": 10,
        "receptionCloseTime": "08:00:00",
        "processingCloseTime": "20:00:00"
      }
    }
  },
  // ケース2：異常系ステータス５００
  case2: {
    ok: false,
    status: 500,
    data: {}
  },
}
