import { Request, Response } from "express";
import crypto from "crypto";

import { injectable } from "inversify";

/**
 * Presenter Base class
 **/
@injectable()
export abstract class BasePresenter {
  static setResponseHeadersInit(req: Request, res: Response) {
    res.setHeader("content-type", "application/json");
    res.setHeader(
      "jins-trace-id",
      req.header("jins-trace-id") ?? crypto.randomUUID(),
    );
    res.setHeader(
      "jins-system-version",
      process.env.npm_package_version ?? "0.0.0",
    );
    res.setHeader("X-API-KEY", "");
  }
}
