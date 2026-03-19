import { operations , components } from "~/src/interfaces/clients/carts/cartsClient";

// (カート)カート・カタログ取得API
type FindCartQuery = operations["findCart"]["parameters"]["query"];
export type CartGetRequest = FindCartQuery;
export type CartGetResponse = components["schemas"]["CartResponse"];
export type Cart = components["schemas"]["cart"];
export type itemGroupCompleteSet = components["schemas"]["itemGroupCompleteSet"];

// (カート)カート新規作成API
type PostCartBody = components["schemas"]["CartPostRequest"];
export type CartPostRequest = PostCartBody;
export type CartPostResponse = components["schemas"]["CartResponse"];

// (カート)カート削除フラグ更新API
type PatchCartPath = operations["patchCart"]["parameters"]["path"];
type PatchCartBody =  components["schemas"]["CartPatchRequest"];
export type CartPatchRequest = PatchCartPath & PatchCartBody;

// (カート)カート情報登録API
type PostLineitemBody = components["schemas"]["LineitemPostRequest"];
export type LineitemPostRequest = PostLineitemBody;
export type ItemGroup = components["schemas"]["ItemGroup"];
export type Lineitem = components["schemas"]["Lineitem"];

// (カート)受取方法登録API
type PutItemGroupsPath = operations["putItemGroups"]["parameters"]["path"];
type PutItemGroupsBody =  components["schemas"]["ItemGroupPutRequest"];
export type ItemGroupsPutRequest = PutItemGroupsPath & PutItemGroupsBody;

// (カート)商品グループ削除API
type DeleteItemGroupsPath = operations["deleteItemGroups"]["parameters"]["path"];
type DeleteItemGroupsQuery = operations["deleteItemGroups"]["parameters"]["query"];
export type ItemGroupsDeleteRequest = DeleteItemGroupsPath & DeleteItemGroupsQuery;

// (カート)受付情報更新API
type postReceptionEventsBody = components["schemas"]["ReceptionEventsRequest"];
export type ReceptionEventsPostRequest = postReceptionEventsBody;

// (カート)受付履歴取得API
type FindReceptionEventsPath = operations["findReceptionEvents"]["parameters"]["path"];
type FindReceptionEventsQuery = operations["findReceptionEvents"]["parameters"]["query"];
export type ReceptionEventsGetRequest = FindReceptionEventsPath & FindReceptionEventsQuery;
export type ReceptionEventsGetResponse = components["schemas"]["ReceptionEventsGetResponse"];
export type ReceptionEvent = components["schemas"]["ReceptionEvents"];

// (カート)受付情報検索API
type SearchReceptionInformationQuery = operations["searchReceptionInformation"]["parameters"]["query"];
export type ReceptionInformationSearchRequest = SearchReceptionInformationQuery;
export type ReceptionInformationSearchResponse = components["schemas"]["ProcessesGetResponse"];
export type ReceptionInformation = components["schemas"]["ReceptionInfoAllItems"]

// （カート）待ち状況取得API
type FindReceptionsPath = operations["findReceptions"]["parameters"]["path"];
type FindReceptionsQuery = operations["findReceptions"]["parameters"]["query"];
export type ReceptionGetRequest = FindReceptionsPath & FindReceptionsQuery;
export type ReceptionGetResponse = components["schemas"]["ReceptionGetResponse"];
export type ReceptionInfos = components["schemas"]["ReceptionInfos"]

// (カート)受付情報新規作成API
type PostReceptionBody = components["schemas"]["ReceptionPostRequest"];
export type ReceptionPostRequest = PostReceptionBody;
export type ReceptionPostResponse = components["schemas"]["ReceptionPostResponse"];

// （カート）呼出管理情報取得API
type GetCallManagementPath = operations["getCallManagement"]["parameters"]["path"];
export type CallManagementGetRequest = GetCallManagementPath;
export type CallManagementGetResponse = components["schemas"]["CallManagementGetResponse"];
export type CallManagementInfo = components["schemas"]["CallManagementInfo"];

// （カート）呼出管理情報登録API
type PutCallManagementPath = operations["putCallManagement"]["parameters"]["path"];
type PutCallManagementBody = components["schemas"]["CallManagementPutRequest"];
export type CallManagementPutRequest = PutCallManagementPath & PutCallManagementBody;

// （カート）処方箋画像取得API
type GetPrescriptionPath = operations["getPrescription"]["parameters"]["path"];
type GetPrescriptionQuery = operations["getPrescription"]["parameters"]["query"];
export type PrescriptionGetRequest = GetPrescriptionPath & GetPrescriptionQuery;
export type PrescriptionGetResponse = components["schemas"]["PrescriptionsGetResponse"];

// （カート）処方箋画像コピーAPI
type copyPrescriptionPath = operations["copyPrescription"]["parameters"]["path"];
type copyPrescriptionQuery = operations["copyPrescription"]["parameters"]["query"];
export type PrescriptionCopyRequest = copyPrescriptionPath & copyPrescriptionQuery;
