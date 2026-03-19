import { components, operations } from "~/src/interfaces/clients/warranties/warrantiesClient";

// 保証情報取得API
export type FindWarrantiesPath = operations["findWarranties"]["parameters"]["path"];
export type FindWarrantiesQuery = operations["findWarranties"]["parameters"]["query"];
export type WarrantiesResponse = components["schemas"]["WarrantiesResponse"];
export type WarrantyInfo = components["schemas"]["warrantyInfo"];
export type warrantyItemInfo = components["schemas"]["warrantyItemInfo"];

// 保証書更新API
export type PutWarrantiesPath = operations["putWarranties"]["parameters"]["path"];
export type WarrantiesPutRequest = components["schemas"]["WarrantiesPutRequest"];

// 保証履歴登録API
export type WarrantyHistoriesPostRequest = components["schemas"]["WarrantyHistoriesPostRequest"];

// 保証履歴情報取得API
export type FindWarrantyHistoriesQuery = operations["findWarrantyHistories"]["parameters"]["query"]
export type WarrantyHistoriesResponse = components["schemas"]["WarrantyHistoriesResponse"];
export type WarrantyHistories = components["schemas"]["WarrantyHistories"];

// 保証履歴更新API
export type PutWarrantyHistoriesPath = operations["putWarrantyHistories"]["parameters"]["path"];
export type WarrantyHistoriesPutRequest = components["schemas"]["WarrantyHistoriesPutRequest"];
export type WarrantyForUpdate = components["schemas"]["WarrantyForUpdate"];
export type WarrantyItemForUpdate = components["schemas"]["WarrantyItemForUpdate"];

// 度数・処方箋情報取得API
export type GetPowersPath = operations["getPowers"]["parameters"]["path"];
export type GetPowersResponse = components["schemas"]["PowersGetResponse"];

