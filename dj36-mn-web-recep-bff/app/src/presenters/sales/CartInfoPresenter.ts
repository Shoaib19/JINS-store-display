import { NextFunction, Request, Response } from "express";
import { BasePresenter } from "~/src/presenters/BasePresenter";

import { injectable } from "inversify";
import type { ICartInfoPresenter } from "~/src/presenters/interfaces";

import dotenv from "dotenv";
import { ErrorResponse } from "~/src/compornents/errors";
import { logger } from "~/src/logging/logger";

import { makeErrorResponse400 } from "~/src/utils/makeErrorResponse400";
import { DpfmRequestInfo, generateDpfmRequestInfo } from "~/src/utils/makeRequestHeader";
import { SalesOperationModelFactory } from "~/src/models/sales/SalesOperationModelFactory";
import { SalesOperationResult } from "~/src/models/sales/SaleOperationModelTemplate";

dotenv.config();

@injectable()
export class CartInfoPresenter extends BasePresenter implements ICartInfoPresenter {
  /**
   * カート登録・変更処理
   * @param req - Request
   * @param res - Response
   * @param next - NextFunction
   * @returns Promise<void>
   */
  public show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dpfmRequestInfo: DpfmRequestInfo = generateDpfmRequestInfo(req);
      const cartInfoPostRequest = req.body;
      const model = SalesOperationModelFactory.create(req, cartInfoPostRequest);
      if (model == undefined) {
        //TODO: make error message
        const error: ErrorResponse = makeErrorResponse400(["itemCategoryCode is invalid."], req);
        res.status(400).json(error);
        return;
      }
      const result: SalesOperationResult = await model.execute(dpfmRequestInfo, cartInfoPostRequest);
      res.status(result?.status).send(result?.data);
      return;
    } catch (error: any) {
      if(error.status === 404){
        res.status(400).send(error.data);
      }else{
        res.status(error.status).json(error.data);
      }
      logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
  };
}
