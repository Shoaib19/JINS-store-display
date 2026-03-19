import { ApiResponse } from "openapi-typescript-fetch";
import { getStaff } from "~/src/clients/staffs/staffsClient";
import { StaffGetRequest, StaffGetResponse } from "~/src/clients/staffs/staffsClientTypes";
import { unknownStaffName, customerStaffId, customerStaffName } from "~/src/components/const";
import { isNotFoundResponse } from "~/src/components/errors";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { DpfmRequestInfo, makeDpfmRequestHeader } from "~/src/utils/makeRequestHeader";

/**
 * スタッフ名取得
 * @param dpfmRequestInfo デジタル基盤へのリクエスト情報
 * @param staffId 取得するスタッフID
 * @param cashedStaff キャッシュする場合<スタッフID, スタッフ名>のMAP
 * @returns スタッフ名
 */
export async function getStaffName(
  dpfmRequestInfo: DpfmRequestInfo,
  staffId: string,
  cashedStaff?: Map<string, string>) {
  const getStaffNameFromStaff = async (dpfmRequestInfo: DpfmRequestInfo, staffId: string) => {
    try {
      // スタッフ情報取得API 呼出
      const getStaffRequest: StaffGetRequest = {
        staffId: staffId,
      };
      logger.info(`getStaffRequest: ${JSON.stringify(getStaffRequest)}`);

      const apiResponse: ApiResponse<StaffGetResponse> = await sendApiRequest(
        getStaff,
        getStaffRequest,
        makeDpfmRequestHeader(dpfmRequestInfo)
      );

      logger.info(`getStaffResponse: ${JSON.stringify(apiResponse)}`);

      const staffGetResponse = apiResponse.data;
      return staffGetResponse.staffName!;
    } catch (error) {
      if (isNotFoundResponse(error)) {
        // スタッフIDが見つからない場合、固定名を返却
        return unknownStaffName;
      }
      throw error;
    }
  };

  if (staffId === customerStaffId) {
    return customerStaffName;
  }
  const cashedStaffName = cashedStaff?.get(staffId);
  if (cashedStaffName != undefined) {
    return cashedStaffName;
  }
  const staffName = await getStaffNameFromStaff(dpfmRequestInfo, staffId);
  cashedStaff?.set(staffId, staffName);
  return staffName;
};
