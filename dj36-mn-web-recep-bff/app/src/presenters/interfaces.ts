import { Request, Response, NextFunction } from "express";

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
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IReceptionsPresenterのInterface
 */
export interface IReceptionsPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IReceptionInfoPresenterのInterface
 */
export interface IReceptionInfoPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IStoreByCodePresenterのInterface
 */
export interface IStoreByCodePresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IItemCaseInfoPresenterのInterface
 */
export interface IItemCaseInfoPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IItemSalesColorInfoPresenterのInterface
 */
export interface IItemSalesColorInfoPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}
/**
 * IItemSalesLensSpecInfoPresenterのInterface
 */
export interface IItemSalesLensSpecInfoPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}
/**
 * IItemSalesLensAttributesInfoPresenterのInterface
 */
export interface IItemSalesLensAttributesInfoPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IReceptionEventPresenterのInterface
 */
export interface IReceptionEventPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IReceptionEventCancelPresenterのInterface
 */
export interface IReceptionEventCancelPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IReceptionTicketPresenterのInterface
 */
export interface IReceptionTicketPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * ICartInfoPresenterのInterface
 */
export interface ICartInfoPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IOrderInfoPresenterのInterface
 */
export interface IOrderInfoPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IDeliveriesCheckPresenterのInterface
 */
export interface IDeliveriesCheckPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IDeliveriesPresenterのInterface
 */
export interface IDeliveriesPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IPrescriptionPresenterのInterface
 */
export interface IPrescriptionsPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IPrescriptionInfoPresenterのInterface
 */
export interface IPrescriptionsInfoPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IOrdersPresenterのInterface
 */
export interface IOrdersPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IStaffLoginPresenterのInterface
 */
export interface IStaffLoginPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * ICallManagementInfoPresenterのInterface
 */
export interface ICallManagementInfoPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}
/**
 * ICallManagementUpdatePresenterのInterface
 */
export interface ICallManagementUpdatePresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IItemGroupPostPresenterのInterface
 */
export interface IItemGroupPostPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IItemGroupDeletePresenterのInterface
 */
export interface IItemGroupDeletePresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IOrderSearchPresenterのInterface
 */
export interface IOrderSearchPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IOrderCancelPresenterのInterface
 */
export interface IOrderCancelPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}
/**
 * IProcessesListPresenterのInterface
 */
export interface IProcessesListPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IReceptionEventCustomerPresenterのInterface
 */
export interface IReceptionEventCustomerPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IOrderStatusUpdatePresenterのInterface
 */
export interface IOrderStatusUpdatePresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * ICallingStatusUpdatePresenterのInterface
 */
export interface ICallingStatusUpdatePresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * WarrantyReplacementsPostPresenterのInterface
 */
export interface IWarrantyReplacementsPostPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IWarrantiesInfoPresenterのInterface
 */
export interface IWarrantiesInfoPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * IJobTicketsPresenterのInterface
 */
export interface IJobTicketsPresenter {
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
}
