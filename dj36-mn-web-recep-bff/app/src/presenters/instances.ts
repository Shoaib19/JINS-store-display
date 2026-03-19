import "reflect-metadata";
import { container } from "~/src/inversify.config";

import { PresenterTypes } from "~/src/presenters/PresenterTypes";
import {
  IStatusPresenter,
  INotFoundPresenter,
  IDummyPresenter,
  IReceptionsPresenter,
  IReceptionInfoPresenter,
  IStoreByCodePresenter,
  IItemCaseInfoPresenter,
  IItemSalesColorInfoPresenter,
  IItemSalesLensSpecInfoPresenter,
  IItemSalesLensAttributesInfoPresenter,
  IReceptionEventPresenter,
  IReceptionEventCancelPresenter,
  IReceptionTicketPresenter,
  ICartInfoPresenter,
  IOrderInfoPresenter,
  IDeliveriesCheckPresenter,
  IDeliveriesPresenter,
  IPrescriptionsPresenter,
  IPrescriptionsInfoPresenter,
  IOrdersPresenter,
  IStaffLoginPresenter,
  ICallManagementInfoPresenter,
  ICallManagementUpdatePresenter,
  IItemGroupPostPresenter,
  IItemGroupDeletePresenter,
  IOrderSearchPresenter,
  IOrderCancelPresenter,
  ICallingStatusUpdatePresenter,
  IOrderStatusUpdatePresenter,
  IProcessesListPresenter,
  IReceptionEventCustomerPresenter,
  IWarrantyReplacementsPostPresenter,
  IWarrantiesInfoPresenter,
  IJobTicketsPresenter,
} from "~/src/presenters/interfaces";

export const status = container.get<IStatusPresenter>(
  PresenterTypes.IStatusPresenter
);
export const notFound = container.get<INotFoundPresenter>(
  PresenterTypes.INotFoundPresenter
);
export const dummy = container.get<IDummyPresenter>(
  PresenterTypes.IDummyPresenter
);
export const reception = container.get<IReceptionsPresenter>(
  PresenterTypes.IReceptionsPresenter
);
export const receptionInfo = container.get<IReceptionInfoPresenter>(
  PresenterTypes.IReceptionInfoPresenter
);
export const storeByCode = container.get<IStoreByCodePresenter>(
  PresenterTypes.IStoreByCodePresenter
);

export const itemCaseInfo = container.get<IItemCaseInfoPresenter>(
  PresenterTypes.IItemCaseInfoPresenter
);

export const itemSalesColorInfo = container.get<IItemSalesColorInfoPresenter>(
  PresenterTypes.IItemSalesColorInfoPresenter
);

export const itemSalesLensSpecInfo = container.get<IItemSalesLensSpecInfoPresenter>(
  PresenterTypes.IItemSalesLensSpecInfoPresenter
);

export const itemSalesLensAttributesInfo = container.get<IItemSalesLensAttributesInfoPresenter>(
  PresenterTypes.IItemSalesLensAttributesInfoPresenter
);

export const receptionEvent = container.get<IReceptionEventPresenter>(
  PresenterTypes.IReceptionEventPresenter
);

export const receptionEventCancel = container.get<IReceptionEventCancelPresenter>(
  PresenterTypes.IReceptionEventCancelPresenter
);

export const receptionTicket = container.get<IReceptionTicketPresenter>(
  PresenterTypes.IReceptionTicketPresenter
);

export const cartInfo = container.get<ICartInfoPresenter>(
  PresenterTypes.ICartInfoPresenter
);

export const orderInfo = container.get<IOrderInfoPresenter>(
  PresenterTypes.IOrderInfoPresenter
);

export const deliveriesCheck = container.get<IDeliveriesCheckPresenter>(
  PresenterTypes.IDeliveriesCheckPresenter
);

export const delivery = container.get<IDeliveriesPresenter>(
  PresenterTypes.IDeliveriesPresenter
);

export const prescriptions = container.get<IPrescriptionsPresenter>(
  PresenterTypes.IPrescriptionsPresenter
);

export const prescriptionsInfo = container.get<IPrescriptionsInfoPresenter>(
  PresenterTypes.IPrescriptionsInfoPresenter
);

export const order = container.get<IOrdersPresenter>(
  PresenterTypes.IOrdersPresenter
);

export const staffs = container.get<IStaffLoginPresenter>(
  PresenterTypes.IStaffLoginPresenter
);

export const callManagementInfo = container.get<ICallManagementInfoPresenter>(
  PresenterTypes.ICallManagementInfoPresenter
);

export const callManagementUpdate = container.get<ICallManagementUpdatePresenter>(
  PresenterTypes.ICallManagementUpdatePresenter
);

export const postItemGroups = container.get<IItemGroupPostPresenter>(
  PresenterTypes.IItemGroupPostPresenter
);

export const deleteItemGroups = container.get<IItemGroupDeletePresenter>(
  PresenterTypes.IItemGroupDeletePresenter
)

export const orderSearch = container.get<IOrderSearchPresenter>(
  PresenterTypes.IOrderSearchPresenter
)

export const orderCancel = container.get<IOrderCancelPresenter>(
  PresenterTypes.IOrderCancelPresenter
)

export const processesList = container.get<IProcessesListPresenter>(
  PresenterTypes.IProcessesListPresenter
)

export const receptionEventCustomer = container.get<IReceptionEventCustomerPresenter>(
  PresenterTypes.IReceptionEventCustomerPresenter
)

export const orderStatusUpdate = container.get<IOrderStatusUpdatePresenter>(
  PresenterTypes.IOrderStatusUpdatePresenter
)

export const callingStatusUpdate = container.get<ICallingStatusUpdatePresenter>(
  PresenterTypes.ICallingStatusUpdatePresenter
)

export const postWarrantyReplacement = container.get<IWarrantyReplacementsPostPresenter>(
  PresenterTypes.IWarrantyReplacementsPostPresenter
)

export const warrantiesInfo = container.get<IWarrantiesInfoPresenter>(
  PresenterTypes.IWarrantiesInfoPresenter
)

export const jobTickets = container.get<IJobTicketsPresenter>(
  PresenterTypes.IJobTicketsPresenter
)