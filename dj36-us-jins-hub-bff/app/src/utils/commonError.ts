import { ApiResponse } from "openapi-typescript-fetch";
import { searchReceptionInformation } from "~/src/clients/carts/cartsClient";
import { ReceptionInformationSearchRequest, ReceptionInformationSearchResponse } from "~/src/clients/carts/cartsClientTypes";
import { COUNTRY_CODE_ALPHA2 } from "~/src/components/const";
import { isNotFoundResponse, ValidationError } from "~/src/components/errors";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { DpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";

/**
 * カート新規作成時、受付事業国と異なる場合はエラー
 * @param receptionNumber - 受付番号
 * @returns null
 */
export const checkReceptionNumberCountryCode = async (
  dpfmRequestInfo: DpfmRequestInfo,
  receptionNumber?: string | null
): Promise<null> => {
  if (receptionNumber) {
    try {
      // 受付情報検索API呼び出し
      const searchReceptionInformationRequest: ReceptionInformationSearchRequest = {
        receptionNumber: receptionNumber,
      };
      logger.info(
        `getSearchReceptionInformationRequest: ${JSON.stringify(searchReceptionInformationRequest)}`
      );
      const apiResponse : ApiResponse<ReceptionInformationSearchResponse> = await sendApiRequest(
        searchReceptionInformation,
        searchReceptionInformationRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );
      logger.info(
        `getSearchReceptionInformationResponse: ${JSON.stringify(apiResponse)}`
      );
      const searchReceptionInformationResponse = apiResponse.data;
      const receptionInformation = searchReceptionInformationResponse.ReceptionInfoAllItems?.at(0);
      
      if (receptionInformation?.countryCodeAlpha2 !== COUNTRY_CODE_ALPHA2) {
        throw new ValidationError("The country code in the reception number is incorrect.");
      }
    } catch (error) {
      if (isNotFoundResponse(error)) {
        throw new ValidationError("The country code in the reception number is incorrect.");
      }
      throw error;
    };
  }
  return null;
}
