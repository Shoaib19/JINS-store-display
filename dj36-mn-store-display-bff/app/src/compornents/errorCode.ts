/**
 * 共通エラーコード
 */
export const CommonErrorCode = {
  /** 想定外のランタイムエラー. */
  COM_0000_UNEXPECTED_ERROR: "COM_0000",
  /** 項目レベルのバリデーションエラー. */
  COM_0001_VALIDATION_ERROR: "COM_0001",
  /** APIリクエストで指定のリソースが存在しない. */
  COM_0002_RESOURCE_NOT_FOUND: "COM_0002",
  /** 楽観ロック失敗. */
  COM_0003_OPTIMISTIC_LOCK_FAILED: "COM_0003",
  /** API重複呼び出し検出. */
  COM_0004_DUPLICATE_API_CALL: "COM_0004",
  /** API呼出し不正: path誤り,MEDIA TYPE不正等. */
  COM_0005_INVALID_API_REQUEST: "COM_0005",
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
