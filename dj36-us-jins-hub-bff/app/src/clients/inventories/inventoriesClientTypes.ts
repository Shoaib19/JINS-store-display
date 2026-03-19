import { operations, components } from "~/src/interfaces/clients/inventories/inventoriesClient";

// 在庫取得API
type GetInventoriesQuery = operations["getInventories"]["parameters"]["query"];
export type InventoriesGetRequest = GetInventoriesQuery;
export type InventoriesGetResponse = components["schemas"]["InventoriesGetResponse"];
