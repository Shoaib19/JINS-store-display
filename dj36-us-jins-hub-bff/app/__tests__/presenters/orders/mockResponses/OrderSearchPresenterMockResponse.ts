/**
 * 正常系_オーダー情報検索API
*/

export const getOrderSearchResponseCase1 = {
  ok: true,
  status: 200,
  data: {
    "orderInfoList": [
      {
        "receptionNumber": "250310US000001",
        "itemGroupCode": "glassLineCode001",
        "isMultipleOrder": true,
        "orderStatusCode": "300",
        "customerName": "John Smith",
        "receptionDate": "2025-01-01T00:00:00Z",
        "callingNumber": "callingNumber001"
      },
      {
        "receptionNumber": "250310US000002",
        "itemGroupCode": "glassLineCode002",
        "isMultipleOrder": true,
        "orderStatusCode": "801",
        "customerName": "Michael Brown",
        "receptionDate": "2025-02-01T00:00:00Z",
        "callingNumber": "callingNumber002"
      },
      {
        "receptionNumber": "250310US000003",
        "itemGroupCode": "glassLineCode003",
        "isMultipleOrder": true,
        "orderStatusCode": "400",
        "customerName": "Michael Brown",
        "receptionDate": "2025-02-01T00:00:00Z",
        "callingNumber": "callingNumber003"
      },
      {
        "receptionNumber": "250310US000004",
        "itemGroupCode": "glassLineCode004",
        "isMultipleOrder": true,
        "orderStatusCode": "500",
        "customerName": "Michael Brown",
        "receptionDate": "2025-02-01T00:00:00Z",
        "callingNumber": "callingNumber004"
      },
      {
        "receptionNumber": "250310US000005",
        "itemGroupCode": "glassLineCode005",
        "isMultipleOrder": true,
        "orderStatusCode": "901",
        "customerName": "Michael Brown",
        "receptionDate": "2025-02-01T00:00:00Z",
        "callingNumber": "callingNumber005"
      },
      {
        "receptionNumber": "250310US000006",
        "itemGroupCode": "glassLineCode006",
        "isMultipleOrder": true,
        "orderStatusCode": "300",
        "customerName": "Michael Brown",
        "receptionDate": "2025-02-01T00:00:00Z",
        "callingNumber": "callingNumber006"
      },
    ],
    "totalMatchCount": 6
  }
}

export const getOrderSearchResponse_noRecord = {
  orderInfoList: [],
  totalMatchCount: 0
}

/**
 * 管理用注文検索APIレスポンス
 */
export const getGlassLinesSearchResponses = {
  // ケース1：正常系(継続あり_初期ページ)
  case1: {
    ok: true,
    status: 200,
    data: {
      "nodes": [
        {
          "callingNumber": "callingNumber001",
          "customerId": "customerId",
          "customerName": "John Smith",
          "deliveryDate": "2023-11-03",
          "deliveryStatus": "BEFORE_PREPARING",
          "glassLineCode": "glassLineCode001",
          "orderCode": "orderCode001",
          "orderDate": "2025-01-01",
          "orderStatus": "orderStatusCode001",
          "paymentCode": "paymentCode001",
          "paymentDate": "2025-01-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-01-01T00:00:00",
          "receptionNumber": "250310US000001"
        },
        {
          "callingNumber": "callingNumber002",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "DELIVERED",
          "glassLineCode": "glassLineCode002",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode002",
          "paymentCode": "paymentCode002",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000002"
        },
        {
          "callingNumber": "callingNumber003",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "DELIVERY_PREPARING",
          "glassLineCode": "glassLineCode003",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode003",
          "paymentCode": "paymentCode003",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000003"
        },
        {
          "callingNumber": "callingNumber004",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "READY_FOR_DELIVERY",
          "glassLineCode": "glassLineCode004",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode004",
          "paymentCode": "paymentCode004",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000004"
        },
        {
          "callingNumber": "callingNumber005",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "DELIVERY_CANCELED",
          "glassLineCode": "glassLineCode005",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode005",
          "paymentCode": "paymentCode005",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000005"
        },
        {
          "callingNumber": "callingNumber006",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "",
          "glassLineCode": "glassLineCode006",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode006",
          "paymentCode": "paymentCode006",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000006"
        },
      ],
      "pageInfo": {
        "currentPage": 1,
        "hasNext": true,
        "hasPrevious": true,
        "nextPage": 2,
        "previousPage": 0,
        "totalPageCount": 10
      },
      "totalCount": 6
    }
  },
  // ケース2：正常系(継続あり_中間ページ)
  case2: {
    ok: true,
    status: 200,
    data: {
      "nodes": [
        {
          "callingNumber": "callingNumber001",
          "customerId": "customerId",
          "customerName": "John Smith",
          "deliveryDate": "2023-11-03",
          "deliveryStatus": "BEFORE_PREPARING",
          "glassLineCode": "glassLineCode001",
          "orderCode": "orderCode001",
          "orderDate": "2025-01-01",
          "orderStatus": "orderStatusCode001",
          "paymentCode": "paymentCode001",
          "paymentDate": "2025-01-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-01-01T00:00:00",
          "receptionNumber": "250310US000001"
        },
        {
          "callingNumber": "callingNumber002",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "DELIVERED",
          "glassLineCode": "glassLineCode002",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode002",
          "paymentCode": "paymentCode002",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000002"
        },
        {
          "callingNumber": "callingNumber003",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "DELIVERY_PREPARING",
          "glassLineCode": "glassLineCode003",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode003",
          "paymentCode": "paymentCode003",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000003"
        },
        {
          "callingNumber": "callingNumber004",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "READY_FOR_DELIVERY",
          "glassLineCode": "glassLineCode004",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode004",
          "paymentCode": "paymentCode004",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000004"
        },
        {
          "callingNumber": "callingNumber005",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "DELIVERY_CANCELED",
          "glassLineCode": "glassLineCode005",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode005",
          "paymentCode": "paymentCode005",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000005"
        },
        {
          "callingNumber": "callingNumber006",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "",
          "glassLineCode": "glassLineCode006",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode006",
          "paymentCode": "paymentCode006",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000006"
        },
      ],
      "pageInfo": {
        "currentPage": 3,
        "hasNext": true,
        "hasPrevious": true,
        "nextPage": 4,
        "previousPage": 0,
        "totalPageCount": 10
      },
      "totalCount": 6
    }
  },
  // ケース3：正常系(継続なし)
  case3: {
    ok: true,
    status: 200,
    data: {
      "nodes": [
        {
          "callingNumber": "callingNumber001",
          "customerId": "customerId",
          "customerName": "John Smith",
          "deliveryDate": "2023-11-03",
          "deliveryStatus": "BEFORE_PREPARING",
          "glassLineCode": "glassLineCode001",
          "orderCode": "orderCode001",
          "orderDate": "2025-01-01",
          "orderStatus": "orderStatusCode001",
          "paymentCode": "paymentCode001",
          "paymentDate": "2025-01-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-01-01T00:00:00",
          "receptionNumber": "250310US000001"
        },
        {
          "callingNumber": "callingNumber002",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "DELIVERED",
          "glassLineCode": "glassLineCode002",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode002",
          "paymentCode": "paymentCode002",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000002"
        },
        {
          "callingNumber": "callingNumber003",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "DELIVERY_PREPARING",
          "glassLineCode": "glassLineCode003",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode003",
          "paymentCode": "paymentCode003",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000003"
        },
        {
          "callingNumber": "callingNumber004",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "READY_FOR_DELIVERY",
          "glassLineCode": "glassLineCode004",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode004",
          "paymentCode": "paymentCode004",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000004"
        },
        {
          "callingNumber": "callingNumber005",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "DELIVERY_CANCELED",
          "glassLineCode": "glassLineCode005",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode005",
          "paymentCode": "paymentCode005",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000005"
        },
        {
          "callingNumber": "callingNumber006",
          "customerId": "customerId",
          "customerName": "Michael Brown",
          "deliveryDate": "2023-11-05",
          "deliveryStatus": "",
          "glassLineCode": "glassLineCode006",
          "orderCode": "orderCode002",
          "orderDate": "2025-02-01",
          "orderStatus": "orderStatusCode006",
          "paymentCode": "paymentCode006",
          "paymentDate": "2025-02-01",
          "paymentStatus": "PAID",
          "receptionDateTime": "2025-02-01T00:00:00",
          "receptionNumber": "250310US000006"
        },
      ],
      "pageInfo": {
        "currentPage": 1,
        "hasNext": false,
        "hasPrevious": true,
        "nextPage": undefined,
        "previousPage": 0,
        "totalPageCount": 1
      },
      "totalCount": 6
    }
  },
  // ケース4：正常系(継続なし_レコードなし)
  case4: {
    ok: true,
    status: 200,
    data: {
      "nodes": [],
      "pageInfo": {
        "currentPage": 1,
        "hasNext": false,
        "hasPrevious": false,
        "nextPage": undefined,
        "previousPage": 0,
        "totalPageCount": 1
      },
      "totalCount": 0
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
