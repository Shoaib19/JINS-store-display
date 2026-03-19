import { components } from "~/src/interfaces/clients/diameters/diametersClient";

// 径不足チェックAPI
type CheckDiameterBody = components["schemas"]["DiametersPostRequest"];
export type DiametersPostRequest = CheckDiameterBody;
export type DiametersPostResponse = components["schemas"]["DiametersPostResponse"];
