import { Fetcher } from "openapi-typescript-fetch";
import { paths } from "~/src/interfaces/clients/dummy/dummyClient";
import dotenv from "dotenv";

dotenv.config();

const fetcher = Fetcher.for<paths>();

fetcher.configure({
  baseUrl: process.env.DUMMY_SERVER,
  init: {
    keepalive: true,
  },
});

/**
 * Status取得API
 */
export const getStatus = fetcher.path("/api/status").method("get").create();
