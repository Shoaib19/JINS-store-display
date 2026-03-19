import { components, operations } from "~/src/interfaces/clients/staffs/staffsClient";

// スタッフ情報取得API
export type GetStaffPath = operations["getStaff"]["parameters"]["path"];
export type StaffGetResponse = components["schemas"]["StaffGetResponse"];
