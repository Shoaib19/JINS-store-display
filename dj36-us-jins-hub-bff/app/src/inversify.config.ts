import * as dotenv from "dotenv";
import { Container } from "inversify";
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
  IDeliveriesPresenter,
  IDeliveriesCheckPresenter,
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
  IReceptionsSearchPresenter,
} from "~/src/presenters/interfaces";
import { StatusPresenter } from "~/src/presenters/system/StatusPresenter";
import { NotFoundPresenter } from "~/src/presenters/system/NotFoundPresenter";
import { DummyPresenter } from "~/src/presenters/dummy/DummyPresenter";
import { ReceptionsPresenter } from "~/src/presenters/receptions/ReceptionsPresenter";
import { ReceptionInfoPresenter } from "~/src/presenters/receptions/ReceptionInfoPresenter";

import { logger } from "~/src/logging/logger";
import { StoreByCodePresenter } from "~/src/presenters/stores/StoreByCodePresenter";
import { ItemCaseInfoPresenter } from "~/src/presenters/items/ItemCaseInfoPresenter";
import { ItemSalesColorInfoPresenter } from "~/src/presenters/items/ItemSalesColorInfoPresenter";
import { ItemSalesLensSpecInfoPresenter } from "~/src/presenters/items/ItemSalesLensSpecInfoPresenter";
import { ItemSalesLensAttributesInfoPresenter } from "~/src/presenters/items/ItemSalesLensAttributesPresenter";
import { ReceptionEventPresenter } from "~/src/presenters/receptionEvents/ReceptionEventPresenter";
import { ReceptionEventCancelPresenter } from "~/src/presenters/receptionEvents/ReceptionEventCancelPresenter";
import { ReceptionTicketPresenter } from "~/src/presenters/receptionEvents/ReceptionTicketPresenter";
import { CartInfoPresenter } from "~/src/presenters/sales/CartInfoPresenter";
import { DeliveriesCheckPresenter } from "~/src/presenters/deliveries/DeliveriesCheckPresenter";
import { OrderInfoPresenter } from "~/src/presenters/orders/OrderInfoPresenter";
import { DeliveriesPresenter } from "~/src/presenters/deliveries/DeliveriesPresenter";
import { PrescriptionsInfoPresenter } from "~/src/presenters/prescriptions/PrescriptionsInfoPresenter";
import { OrdersPresenter } from "~/src/presenters/orders/OrdersPresenter";
import { StaffLoginPresenter } from "~/src/presenters/staffs/StaffLoginPresenter";
import { CallManagementInfoPresenter } from "~/src/presenters/callManagement/CallManagementInfoPresenter";
import { CallManagementUpdatePresenter } from "~/src/presenters/callManagement/CallManagementUpdatePresenter";
import { ItemGroupPostPresenter } from "~/src/presenters/itemGroup/ItemGroupPostPresenter";
import { ItemGroupDeletePresenter } from "~/src/presenters/itemGroup/ItemGroupDeletePresenter";
import { OrderSearchPresenter } from "~/src/presenters/orders/OrderSearchPresenter";
import { OrderCancelPresenter } from "~/src/presenters/orders/OrderCancelPresenter";
import { ProcessesListPresenter } from "~/src/presenters/processes/ProcessesListPresenter";
import { OrderStatusUpdatePresenter } from "~/src/presenters/orders/OrderStatusUpdatePresenter";
import { CallingStatusUpdatePresenter } from "~/src/presenters/processes/CallingStatusUpdatePresenter";
import { ReceptionEventCustomerPresenter } from "~/src/presenters/processes/ReceptionEventCustomerPresenter";
import { WarrantyReplacementsPostPresenter } from "~/src/presenters/warranty/WarrantyReplacementsPostPresenter";
import { WarrantiesInfoPresenter } from "~/src/presenters/warranties/WarrantiesInfoPresenter";
import { JobTicketsPresenter } from "~/src/presenters/jobTickets/JobTicketsPresenter";
import { ReceptionsSearchPresenter } from "~/src/presenters/receptions/ReceptionsSearchPresenter";

dotenv.config();

logger.info(`process.env.SERVER_PORT: ${process.env.SERVER_PORT}`);

const container = new Container();
container
  .bind<IStatusPresenter>(PresenterTypes.IStatusPresenter)
  .to(StatusPresenter);
container
  .bind<INotFoundPresenter>(PresenterTypes.INotFoundPresenter)
  .to(NotFoundPresenter);
container
  .bind<IDummyPresenter>(PresenterTypes.IDummyPresenter)
  .to(DummyPresenter);
container
  .bind<IReceptionsPresenter>(PresenterTypes.IReceptionsPresenter)
  .to(ReceptionsPresenter);
container
  .bind<IReceptionInfoPresenter>(PresenterTypes.IReceptionInfoPresenter)
  .to(ReceptionInfoPresenter);
container
  .bind<IStoreByCodePresenter>(PresenterTypes.IStoreByCodePresenter)
  .to(StoreByCodePresenter);
container
  .bind<IItemCaseInfoPresenter>(PresenterTypes.IItemCaseInfoPresenter)
  .to(ItemCaseInfoPresenter);
container
  .bind<IItemSalesColorInfoPresenter>(PresenterTypes.IItemSalesColorInfoPresenter)
  .to(ItemSalesColorInfoPresenter);
container
  .bind<IItemSalesLensSpecInfoPresenter>(PresenterTypes.IItemSalesLensSpecInfoPresenter)
  .to(ItemSalesLensSpecInfoPresenter);
container
  .bind<IItemSalesLensAttributesInfoPresenter>(PresenterTypes.IItemSalesLensAttributesInfoPresenter)
  .to(ItemSalesLensAttributesInfoPresenter);
container
  .bind<IReceptionEventPresenter>(PresenterTypes.IReceptionEventPresenter)
  .to(ReceptionEventPresenter);
container
.bind<IReceptionEventCancelPresenter>(PresenterTypes.IReceptionEventCancelPresenter)
.to(ReceptionEventCancelPresenter);
container
  .bind<IReceptionTicketPresenter>(PresenterTypes.IReceptionTicketPresenter)
  .to(ReceptionTicketPresenter);
container
  .bind<IDeliveriesCheckPresenter>(PresenterTypes.IDeliveriesCheckPresenter)
  .to(DeliveriesCheckPresenter);
container
  .bind<IOrderInfoPresenter>(PresenterTypes.IOrderInfoPresenter)
  .to(OrderInfoPresenter);
container
  .bind<ICartInfoPresenter>(PresenterTypes.ICartInfoPresenter)
  .to(CartInfoPresenter);
container
  .bind<IDeliveriesPresenter>(PresenterTypes.IDeliveriesPresenter)
  .to(DeliveriesPresenter);
container
  .bind<IPrescriptionsInfoPresenter>(PresenterTypes.IPrescriptionsInfoPresenter)
  .to(PrescriptionsInfoPresenter);
container
  .bind<IOrdersPresenter>(PresenterTypes.IOrdersPresenter)
  .to(OrdersPresenter);
container
  .bind<IStaffLoginPresenter>(PresenterTypes.IStaffLoginPresenter)
  .to(StaffLoginPresenter);
container
  .bind<ICallManagementInfoPresenter>(PresenterTypes.ICallManagementInfoPresenter)
  .to(CallManagementInfoPresenter);
container
  .bind<ICallManagementUpdatePresenter>(PresenterTypes.ICallManagementUpdatePresenter)
  .to(CallManagementUpdatePresenter);
container
  .bind<IItemGroupPostPresenter>(PresenterTypes.IItemGroupPostPresenter)
  .to(ItemGroupPostPresenter);
container
  .bind<IItemGroupDeletePresenter>(PresenterTypes.IItemGroupDeletePresenter)
  .to(ItemGroupDeletePresenter);
container
  .bind<IOrderSearchPresenter>(PresenterTypes.IOrderSearchPresenter)
  .to(OrderSearchPresenter);
  container
  .bind<IOrderCancelPresenter>(PresenterTypes.IOrderCancelPresenter)
  .to(OrderCancelPresenter);
container
  .bind<IProcessesListPresenter>(PresenterTypes.IProcessesListPresenter)
  .to(ProcessesListPresenter);
container
  .bind<IReceptionEventCustomerPresenter>(PresenterTypes.IReceptionEventCustomerPresenter)
  .to(ReceptionEventCustomerPresenter);
container
  .bind<IOrderStatusUpdatePresenter>(PresenterTypes.IOrderStatusUpdatePresenter)
  .to(OrderStatusUpdatePresenter);
container
  .bind<ICallingStatusUpdatePresenter>(PresenterTypes.ICallingStatusUpdatePresenter)
  .to(CallingStatusUpdatePresenter);
container
  .bind<IWarrantyReplacementsPostPresenter>(PresenterTypes.IWarrantyReplacementsPostPresenter)
  .to(WarrantyReplacementsPostPresenter);
container
  .bind<IWarrantiesInfoPresenter>(PresenterTypes.IWarrantiesInfoPresenter)
  .to(WarrantiesInfoPresenter);
container
  .bind<IJobTicketsPresenter>(PresenterTypes.IJobTicketsPresenter)
  .to(JobTicketsPresenter);
container
  .bind<IReceptionsSearchPresenter>(PresenterTypes.IReceptionsSearchPresenter)
  .to(ReceptionsSearchPresenter)
export { container };
