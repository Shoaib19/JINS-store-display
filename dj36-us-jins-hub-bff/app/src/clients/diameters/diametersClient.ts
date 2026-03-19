import { services } from "~/src/components/services";
import { createApiMethod } from "~/src/utils/fetchService";

///////////////
// Diameters
/**
 * 径不足チェックAPI
 */
export const postDiameters = createApiMethod("/diameter/check", "post", services.DIAMETER);
