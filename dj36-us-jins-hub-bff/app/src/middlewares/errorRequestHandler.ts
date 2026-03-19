import { Request, Response, NextFunction } from "express";
import { OpenAPIRequestValidatorError } from "openapi-request-validator"
import { ValidationError} from "~/src/components/errors";
import { logger } from "~/src/logging/logger";
import i18n from 'i18n';

// openapi-request-validator で発生するエラーオブジェクト 
interface OpenApiValidationError {
  errors: Array<OpenAPIRequestValidatorError>;
}

/**
 * エラーリクエストハンドラー
 * @param err - Error
 * @param req - Request
 * @param res - Response
 * @param next - NextFunction
 */
export const errorRequestHandler = async (
  err: unknown,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {

  if (isOpenApiValidationError(err)) {
    // oasの定義でのバリデーションエラーが発生
    logger.info(`errorRequestHandler: ${JSON.stringify(err)}`);
    const details = {
      status: 400,
      errors: err.errors.map((error) => {
        const fieldLabel = error.path ? i18n.__(error.path) : "unknown";
        let message;
        if (error.errorCode === "maxLength.openapi.requestValidation") {
          const maxLengthMatch = error.message.match(/must NOT have more than (\d+) characters/);
          const maxLength = maxLengthMatch ? maxLengthMatch[1] : "unknown";
          message = i18n.__("validation.max_length", {field: fieldLabel, limit: maxLength});
        } else if (error.errorCode === "required.openapi.requestValidation") {
          message = i18n.__("validation.required", { field: fieldLabel });
        } else {
          message = i18n.__("validation.field_error", { field: fieldLabel });
        }
        return {
          path: error.path,
          errorCode: error.errorCode,
          message: message,
          location: error.location,
        };
      }),
    };
    next(new ValidationError(details));
  } else {
    next(err);
  }
};

/**
 * エラーがopenapi-request-validator で発生したエラーかを判定
 * @param err エラー
 * @returns 判定結果
 */
const isOpenApiValidationError = (err: unknown): err is OpenApiValidationError => {
  if (
    typeof err === "object" && err !== null &&
    "errors" in err && Array.isArray((err as { errors: unknown }).errors)
  ) {
    // 配列であることのみをチェック
    return true;
  }
  return false;
};
