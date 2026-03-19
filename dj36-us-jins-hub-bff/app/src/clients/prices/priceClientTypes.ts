import { components, operations } from "~/src/interfaces/clients/prices/pricesClient";

// 売価検索API
type getSellingPricesQuery = operations["getSellingPrices"]["parameters"]["query"];
export type SellingPricesGetRequest = getSellingPricesQuery;
export type SellingPricesGetResponse = components["schemas"]["SellingPricesGetResponse"];
