import { Request, Response, NextFunction } from "express";
import { components as components } from "~/src/interfaces/root";
import { Server as HTTPServer } from "http";
import { Server as HTTPSServer } from "https";

/**
 * StatusPresenterのInterface
 */
export interface IStatusPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * NotFoundPresenterのInterface
 */
export interface INotFoundPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * DummyPresenterのInterface
 */
export interface IDummyPresenter {
  show(req: Request, res: Response): Promise<void>;
}

/**
 * IReceptionsPresenterのInterface
 */
export interface IReceptionsPresenter {
  show(
    storeCode: string,
    receptionNumber?: string,
  ): Promise<
    | components["schemas"]["RcptInfoResponse"]
    | components["schemas"]["RcptInfoErrorResponse"]
  >;
}

export interface IWebSocketManager {
  setup(server: HTTPServer | HTTPSServer): void;
}
