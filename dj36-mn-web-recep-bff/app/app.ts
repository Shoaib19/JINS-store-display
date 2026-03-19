import express, { Request, Response, NextFunction } from 'express';
import { initialize } from "express-openapi";
import dotenv from "dotenv";
import path from "path";
import * as presenters from "~/src/presenters/instances";
import { globalErrorHandler } from "~/src/middlewares/errorHandler";
import { validationErrorHandler } from "~/src/middlewares/validationErrorHandler";
import { setCommonResponseHeaders } from "~/src/middlewares/responseHeaders";
import { expressLogger } from "~/src/middlewares/expressLogger";
import i18n from "i18n";
import cors from "cors";

dotenv.config();

const app: express.Express = express();

const allowedMethods = process.env.CORS_ALLOWED_METHODS?.split(',') || [];
const allowedHeaders = process.env.CORS_ALLOWED_HEADERS?.split(',') || [];
const options: cors.CorsOptions = {
  methods: allowedMethods,
  allowedHeaders: allowedHeaders,
};
app.use(cors(options));
app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(setCommonResponseHeaders);
app.use(expressLogger);

i18n.configure({
  locales: ["en", "ja"], // 対応するロケール
  directory: path.join(__dirname, "locales"), // ロケールファイルのディレクトリ
  defaultLocale: "en", // デフォルトのロケール（必要に応じて変更）
  cookie: "lang", // 言語を保持するためのクッキー名
  // autoReload: process.env.NODE_ENV !== "test", // 自動リロードを有効化
  updateFiles: false, // 自動生成を無効化
});

app.use(i18n.init);

initialize({
  app: app,
  apiDoc: path.resolve(__dirname, "openapi/root.yaml"),
  validateApiDoc: true,
  errorMiddleware: validationErrorHandler,

  // describe API functions
  operations: {
    status: [presenters.status.show],
    dummy: [presenters.dummy.show],
    getReceptions: [presenters.reception.show],
    postReceptionInfo: [presenters.receptionInfo.show],
    putReceptionCancel: [presenters.receptionEventCancel.show],
    getStoreByCode: [presenters.storeByCode.show],
    getCallManagement: [presenters.callManagementInfo.show],
    putCallManagememt: [presenters.callManagementUpdate.show],
    getItemCase: [presenters.itemCaseInfo.show],
    getSalesColor: [presenters.itemSalesColorInfo.show],
    getSalesLensSpec: [presenters.itemSalesLensSpecInfo.show],
    getSalesLensAttributes: [presenters.itemSalesLensAttributesInfo.show],
    getReceptionEvent: [presenters.receptionEvent.show],
    postCartInfo: [presenters.cartInfo.show],
    getDelivery: [presenters.deliveriesCheck.show],
    getOrder: [presenters.orderInfo.show],
    postOrder: [presenters.order.show],
    postDelivery: [presenters.delivery.show],
    getPrescription: [presenters.prescriptionsInfo.show],
    getLensoption: [presenters.receptionInfo.show],
    postPrescription: [presenters.prescriptions.show],
    postItemGroups: [presenters.postItemGroups.show],
    deleteItemGroups: [presenters.deleteItemGroups.show],
    getStaffLogin: [presenters.staffs.show],
    getOrderSearch: [presenters.orderSearch.show],
    getProcessesList: [presenters.processesList.show],
    putOrderStatus: [presenters.orderStatusUpdate.show],
    getReceptionEventCustomer: [presenters.receptionEventCustomer.show],
    putCallingStatus: [presenters.callingStatusUpdate.show],
    putOrderCancel: [presenters.orderCancel.show],
    getWarranties: [presenters.warrantiesInfo.show],
    postWarranty: [presenters.postWarrantyReplacement.show],
    getReceptionTickets: [presenters.receptionTicket.show],
    getJobTickets: [presenters.jobTickets.show],
  },
});

app.all("*", presenters.notFound.show);

app.use(globalErrorHandler);

export default app;
