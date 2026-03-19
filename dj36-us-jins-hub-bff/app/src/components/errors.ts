import { ApiError } from "openapi-typescript-fetch";
import { CommonErrorCode } from "~/src/components/errorCode";

/**
 * カスタムエラーの基底クラス
 */
export class BaseError extends Error {
  /** ステータスコード（http status） */
  public readonly statusCode: number;
  /** code（メッセージのコード） */
  public readonly code: string;
  /** details */
  public readonly details?: unknown;
  /** messages 複数メッセージを保持 */
  public readonly messages?: string[];

  /**
   * コンストラクタ
   * @param statusCode エラーレスポンスのステータスコード
   * @param code エラーレスポンスのcode
   * @param message エラーレスポンスのmessages
   * @param details エラーレスポンスのdetails
   */
  protected constructor(
    statusCode: number,
    code: string,
    message: string | string[],
    details?: unknown
  ) {
    super(Array.isArray(message) ? message.join(",") : message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.messages = Array.isArray(message) ? message : undefined;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * APIのメソッドがない場合のエラー
 */
export class NotFoundError extends BaseError {
  /**
   * コンストラクタ
   * @param details
   */
  constructor(details: unknown) {
    super(
      404,
      CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.code,
      CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.message,
      details
    );
  }
}

// NOTE: 
// ApplicationErrorへのメッセージの指定方法
// ・固定定義のCODE/メッセージ(code未指定時はバリデーションエラーのcode)
// ・メッセージ（string）(codeはバリデーションエラーのcode)

// 固定定義の指定型
export type MessageCode = {
  code?: string;
  message: string|string[];
}

/**
 * アプリケーションエラー
 */
export class ApplicationError extends BaseError {
  /**
   * コンストラクタ
   * @param message メッセージ本文
   * @param errors エラー文言（detailsに設定される）
   */
  constructor(message: string|string[], errors: string | string[]);
  /**
   * コンストラクタ
   * @param message メッセージオブジェクト（code+message）
   * @param errors エラー文言（detailsに設定される）
   */
  constructor(message: MessageCode, errors: string | string[]);
  /**
   * コンストラクタ
   * @param message メッセージ本文
   * @param details エラーレスポンスのdetails
   */
  constructor(message: string|string[], details?: unknown);
  /**
   * コンストラクタ
   * @param message メッセージオブジェクト（code+message）
   * @param details エラーレスポンスのdetails
   */
  constructor(message: MessageCode, details?: unknown);
  constructor(messageParam: MessageCode|string|string[], detailsParams?: unknown) {
    const code = typeof messageParam === "string" || Array.isArray(messageParam) ? undefined:messageParam.code;
    const message = typeof messageParam === "string" || Array.isArray(messageParam) ? messageParam:messageParam.message;
    let details;
    if (typeof detailsParams === "string" || Array.isArray(detailsParams)) {
      details = makeResponseDetails(400, detailsParams);
    } else {
      details = detailsParams;
    }
    super(
      400,
      code ?? CommonErrorCode.COM_0001_VALIDATION_ERROR.code,
      message,
      `${JSON.stringify(details)}`
    );
  }
}

/**
 * バリデーションエラー
 */
export class ValidationError extends ApplicationError {
  /**
   * コンストラクタ
   * @param errors エラー文言（detailsに設定される）
   */
  constructor(errors: string | string[]);
  /**
   * コンストラクタ
   * @param details エラーレスポンスのdetails
   */
  constructor(details: unknown);
  constructor(params: string | string[] | unknown) {
    super(
      CommonErrorCode.COM_0001_VALIDATION_ERROR,
      params
    );
  }
}

/**
 * リソースなしエラー
 */
export class ResourceNotFoundError extends BaseError {
  constructor(details: string) {
    super(
      400,    // change 404 -> 400
      CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.code,
      CommonErrorCode.COM_0002_RESOURCE_NOT_FOUND.message,
      details
    );
  }
}

/**
 *  エラーレスポンスのdetailsのオブジェクト
 */
interface ResponseDetails {
  status: number;
  errors?: string[];
}

/**
 * details生成
 * @param status 
 * @param errors 
 * @returns ResponseDetails
 */
const makeResponseDetails = (status: number, errors: string|string[]): ResponseDetails => {
  return {
    status: status,
    errors: Array.isArray(errors) ? errors: [errors],
  } 
}

/**
 * エラーがリソースなしかを判定
 * @param error エラー
 * @returns リソースなしエラーか否か
 */

export const isNotFoundResponse = (error: unknown) => {
  return (error instanceof ApiError) && error.status === 404;
};

/**
 * エラーのコードが含まれているかを判定
 * @param error エラー
 * @param codes コード
 * @returns コードが含まれているエラーか否か
 */
export const isCodeIncludes = (error: unknown, codes: string | string[]) => {
  const targetCodes: (string | undefined)[] = Array.isArray(codes) ? codes : [codes];

  const getCode = (obj: unknown): string | undefined => {
    if(obj instanceof ApiError) {
      const data = obj.data;
      if (typeof data === 'object' && data != null && 'code' in data) {
        const code = (data as { code?: unknown }).code;
        if (typeof code === 'string') {
          return code;
        }
      }
    }
    return undefined;
  }
  return targetCodes.includes(getCode(error));
};
