import { components, operations } from "~/src/interfaces/clients/staffs/staffsClient";

// スタッフ情報取得API
type GetStaffPath = operations["getStaff"]["parameters"]["path"];
export type StaffGetRequest = GetStaffPath;
export type StaffGetResponse = components["schemas"]["StaffGetResponse"];

// スタッフ認証API
type AuthenticateStaffQuery = operations["authenticateStaff"]["parameters"]["query"];
export type StaffAuthenticateRequest = AuthenticateStaffQuery;
export type StaffAuthenticateResponse = components["schemas"]["AuthenticationResponse"];
