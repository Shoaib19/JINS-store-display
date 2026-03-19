import { operations, components } from "~/src/interfaces/clients/inventories/inventoriesClient";

// 在庫取得API
export type getInventoriesQuery = operations["getInventories"]["parameters"]["query"];
export type InventoriesGetResponse = components["schemas"]["InventoriesGetResponse"];
