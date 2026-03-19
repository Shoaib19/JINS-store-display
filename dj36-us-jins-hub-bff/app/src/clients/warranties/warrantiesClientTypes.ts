import { components, operations } from "~/src/interfaces/clients/warranties/warrantiesClient";

// 保証情報取得API
type FindWarrantiesPath = operations["findWarranties"]["parameters"]["path"];
type FindWarrantiesQuery = operations["findWarranties"]["parameters"]["query"];
export type WarrantiesGetRequest = FindWarrantiesPath & FindWarrantiesQuery;
export type WarrantiesGetResponse = components["schemas"]["WarrantiesResponse"];
export type WarrantyInfo = components["schemas"]["warrantyInfo"];
export type warrantyItemInfo = components["schemas"]["warrantyItemInfo"];

// 保証書更新API
type PutWarrantiesPath = operations["putWarranties"]["parameters"]["path"];
type PutWarrantiesBody = components["schemas"]["WarrantiesPutRequest"];
export type WarrantiesPutRequest = PutWarrantiesPath & PutWarrantiesBody;

// 保証履歴登録API
type PostWarrantiesBody = components["schemas"]["WarrantyHistoriesPostRequest"];
export type WarrantyHistoriesPostRequest = PostWarrantiesBody;

// 保証履歴情報取得API
type FindWarrantyHistoriesQuery = operations["findWarrantyHistories"]["parameters"]["query"];
export type WarrantyHistoriesGetRequest = FindWarrantyHistoriesQuery;
export type WarrantyHistoriesGetResponse = components["schemas"]["WarrantyHistoriesResponse"];
export type WarrantyHistories = components["schemas"]["WarrantyHistories"];

// 保証履歴更新API
type PutWarrantyHistoriesPath = operations["putWarrantyHistories"]["parameters"]["path"];
type PutWarrantyHistoriesBody = components["schemas"]["WarrantyHistoriesPutRequest"];
export type WarrantyHistoriesPutRequest = PutWarrantyHistoriesPath & PutWarrantyHistoriesBody;
export type WarrantyForUpdate = components["schemas"]["WarrantyForUpdate"];
export type WarrantyItemForUpdate = components["schemas"]["WarrantyItemForUpdate"];

// 度数・処方箋情報取得API
type GetPowersPath = operations["getPowers"]["parameters"]["path"];
export type PowersGetRequest = GetPowersPath;
export type PowersGetResponse = components["schemas"]["PowersGetResponse"];

