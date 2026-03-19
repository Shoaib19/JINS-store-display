import { operations , components } from "~/src/interfaces/clients/carts/cartsClient";

// (カート)カート・カタログ取得API
export type findCartQuery = operations["findCart"]["parameters"]["query"];
export type CartResponse = components["schemas"]["CartResponse"];
export type Cart = components["schemas"]["cart"];
export type itemGroupCompleteSet = components["schemas"]["itemGroupCompleteSet"];
// (カート)カート新規作成API
export type CartPostRequest = components["schemas"]["CartPostRequest"]
// (カート)カート情報登録API
export type LineitemPostRequest = components["schemas"]["LineitemPostRequest"];
export type ItemGroup = components["schemas"]["ItemGroup"];
export type Lineitem = components["schemas"]["Lineitem"];

// (カート)受付情報新規作成API
export type ReceptionPostRequest = components["schemas"]["ReceptionPostRequest"];
// (カート)受付情報更新API
export type ReceptionEventsRequest = components["schemas"]["ReceptionEventsRequest"];

// (カート)受付履歴取得API
export type FindReceptionEventsQuery = operations["findReceptionEvents"]["parameters"]["query"];
export type FindReceptionEventsPath = operations["findReceptionEvents"]["parameters"]["path"];
export type ReceptionEventsGetResponse = components["schemas"]["ReceptionEventsGetResponse"];
export type ReceptionEvent = components["schemas"]["ReceptionEvents"];

// (カート)受付情報検索API
export type SearchReceptionInformationQuery = operations["searchReceptionInformation"]["parameters"]["query"];
export type SearchReceptionInformationResponse = components["schemas"]["ProcessesGetResponse"];
export type ReceptionInformation = components["schemas"]["ReceptionInfoAllItems"]

// （カート）待ち状況取得API
export type FindReceptionsPath = operations["findReceptions"]["parameters"]["path"];
export type FindReceptionsQuery = operations["findReceptions"]["parameters"]["query"];
export type ReceptionGetResponse = components["schemas"]["ReceptionGetResponse"];
export type ReceptionInfos = components["schemas"]["ReceptionInfos"]

// （カート）呼出管理情報取得API
export type GetCallManagementPath = operations["getCallManagement"]["parameters"]["path"];
export type CallManagementGetResponse = components["schemas"]["CallManagementGetResponse"];
export type CallManagementInfo = components["schemas"]["CallManagementInfo"];

// （カート）処方箋画像コピーAPI
export type CopyPrescriptionRequest = operations["copyPrescription"]["parameters"]["path"]