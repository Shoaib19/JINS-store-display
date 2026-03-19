import { NextFunction, Request, Response } from "express";

import { injectable } from "inversify";
import type { ICartInfoPresenter } from "~/src/presenters/interfaces";

import dotenv from "dotenv";

import { DpfmRequestInfo, generateDpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { SalesOperationModelFactory } from "~/src/models/sales/SalesOperationModelFactory";
import { components } from "~/src/interfaces/root";

dotenv.config();

type CartInfoPostRequest = components["schemas"]["CartInfoPostRequest"];

@injectable()
export class CartInfoPresenter implements ICartInfoPresenter {
  /**
   * カート登録・変更処理
   * @param req - Request
   * @param res - Response
   * @param next - NextFunction
   * @returns Promise<void>
   */
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dpfmRequestInfo: DpfmRequestInfo = generateDpfmRequestInfo(req);
      const cartInfoPostRequest: CartInfoPostRequest = req.body;

      const model = SalesOperationModelFactory.create(req, cartInfoPostRequest);
      const result = await model.execute(dpfmRequestInfo, cartInfoPostRequest);
      res.status(result.status).send(result.data);
      return;
    } catch (error) {
      next(error);
    }
  };
}
