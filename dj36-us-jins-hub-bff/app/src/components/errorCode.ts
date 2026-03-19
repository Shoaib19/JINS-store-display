import { COUNTRY_CODE_ALPHA2 } from "./const";

/** code と メッセージのオブジェクト */
type ResponseMessage = {
  code: string;
  message: string;
}

/**
 * 共通エラーコード
 */
export const CommonErrorCode/*: Record<string, ResponseMessage>*/= {
  /** 想定外のランタイムエラー. */
  COM_0000_UNEXPECTED_ERROR: {
    code: "COM_0000",
    message: "Unexpected error occurred."
  },
  /** 項目レベルのバリデーションエラー. */
  COM_0001_VALIDATION_ERROR: {
    code: "COM_0001",
    message: "Validation error occurred."
  },
  /** APIリクエストで指定のリソースが存在しない. */
  COM_0002_RESOURCE_NOT_FOUND: {
    code: "COM_0002",
    message: "Specified data not found."
  },
  /** 楽観ロック失敗. */
  COM_0003_OPTIMISTIC_LOCK_FAILED: {
    code: "COM_0003",
    message: "Transaction failed due to optimistic lock failure."
  },
  /** API重複呼び出し検出. */
  COM_0004_DUPLICATE_API_CALL: {
    code: "COM_0004",
    message: "Duplicate api invocation detected."
  },
  /** API呼出し不正: path誤り,MEDIA TYPE不正等. */
  COM_0005_INVALID_API_REQUEST: {
    code: "COM_0005",
    message: "Invalid API request."
  },
  /** ApiClientがリトライオーバに達した. */
  COM_0006_API_INVOCATION_RETRY_OVER:{
    code: "COM_0006",
    message: "API invocation retry over.",
  }, 
  /** 認証が失敗した. */
  COM_0007_AUTHENTICATION_FAILED: {
    code: "COM_0007",
    message: "Authentication failed.",
  },
  /** 必要な認証情報が不足している. */
  COM_0008_AUTHENTICATION_REQUIRED: {
    code: "COM_0008",
    message: "Authentication required.",
  }
} as const;

/**
 * BFF Store Staffエラーコード
 */
export const StoreStaffErrorCode/*: Record<string, ResponseMessage>*/ = {
  BFF_USSTORESTAFF_0007_STORE_OR_ADDRESS_REQUIRED: {
    code: `BFF_${COUNTRY_CODE_ALPHA2}STORESTAFF_0007`,
    message: "At least store or address is required."
  },
  BFF_USSTORESTAFF_0030_SPECIAL_ORDER_LENS_INVENTORY: {
    code: `BFF_${COUNTRY_CODE_ALPHA2}STORESTAFF_0030`,
    message: "The selected lens stock type is incorrect. Please select \"Special order lenses\"."
  },
  BFF_USSTORESTAFF_0032: {
    code: `BFF_${COUNTRY_CODE_ALPHA2}STORESTAFF_0032`,
    message: "The reception for the customer you are about to call has already been canceled."
  }
} as const;

// メッセージ置き換え用
type MessageReplacement = {
  DPFM_CODE: string;
  BFF_MESSAGE: ResponseMessage;
};

// OMSのこのエラーが出た時に変換処理をする (DJ36_DEV-773)
export const SpecialOrderLensInventoryMessageReplacement: MessageReplacement[] = [
{
  DPFM_CODE: "DPFM_OMS_0225", 
  BFF_MESSAGE: StoreStaffErrorCode.BFF_USSTORESTAFF_0030_SPECIAL_ORDER_LENS_INVENTORY,
},
{
  DPFM_CODE: "DPFM_OMS_0228", 
  BFF_MESSAGE: StoreStaffErrorCode.BFF_USSTORESTAFF_0030_SPECIAL_ORDER_LENS_INVENTORY,
}
]
