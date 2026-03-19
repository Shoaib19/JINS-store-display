/**
 * 共通エラーコード
 */
export const CommonErrorCode = {
  /** 想定外のランタイムエラー. */
  COM_0000_UNEXPECTED_ERROR: {
    CODE: "COM_0000",
    MESSAGE: "Unexpected error occurred."
  },
  /** 項目レベルのバリデーションエラー. */
  COM_0001_VALIDATION_ERROR: {
    CODE: "COM_0001",
    MESSAGE: "Validation error occurred."
  },
  /** APIリクエストで指定のリソースが存在しない. */
  COM_0002_RESOURCE_NOT_FOUND: {
    CODE: "COM_0002",
    MESSAGE: "Specified data not found."
  },
  /** 楽観ロック失敗. */
  COM_0003_OPTIMISTIC_LOCK_FAILED: {
    CODE: "COM_0003",
    MESSAGE: "Transaction failed due to optimistic lock failure."
  },
  /** API重複呼び出し検出. */
  COM_0004_DUPLICATE_API_CALL: {
    CODE: "COM_0004",
    MESSAGE: "Duplicate api invocation detected."
  },
  /** API呼出し不正: path誤り,MEDIA TYPE不正等. */
  COM_0005_INVALID_API_REQUEST: {
    CODE: "COM_0005",
    MESSAGE: "Invalid API request."
  },
  /** ApiClientがリトライオーバに達した. */
  COM_0006_API_INVOCATION_RETRY_OVER: "COM_0006",
  /** 認証が失敗した. */
  COM_0007_AUTHENTICATION_FAILED: "COM_0007",
  /** 必要な認証情報が不足している. */
  COM_0008_AUTHENTICATION_REQUIRED: "COM_0008",
};

/**
 * エラーコード
 */
export const InternalErrorCode = {
  APP_0001_FAILED_TO_CALL_EXTERNAL_API: "APP_0001",
};

/**
 * BFF Store Staffエラーコード
 */
export const StoreStaffErrorCode = {
  BFF_USSTORESTAFF_0007_STORE_OR_ADDRESS_REQUIRED: {
    CODE: "BFF_USSTORESTAFF_0007",
    MESSAGE: "At least store or address is required."
  },
}

export const SpecialOrderLensInventoryErrorCode = {
  BFF_USSTORESTAFF_0030: {
    OMS_CODE: "DPFM_OMS_0225", // OMSのこのエラーが出た時に変換処理をする (DJ36_DEV-773)
    BFF_CODE: "BFF_USSTORESTAFF_0030",
    MESSAGE: "The selected Lens stock status is incorrect. Please select 'Waiting for lens delivery'."
  }
}
