import express from "express";
import { initialize } from "express-openapi";
import dotenv from "dotenv";
import path from "path";
import * as presenters from "~/src/presenters/instances";
import { globalErrorHandler } from "~/src/middlewares/errorHandler";
import { validationErrorHandler } from "~/src/middlewares/validationErrorHandler";
import { setCommonResponseHeaders } from "~/src/middlewares/responseHeaders";
import { expressLogger } from "~/src/middlewares/expressLogger";

dotenv.config();

const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(setCommonResponseHeaders);

app.use(expressLogger);

initialize({
  app: app,
  apiDoc: path.resolve(__dirname, "openapi/root.yaml"),
  validateApiDoc: true,
  errorMiddleware: validationErrorHandler,

  // describe API functions
  operations: {
    status: [presenters.status.show],
    dummy: [presenters.dummy.show],
  },
});

app.all("*", presenters.notFound.show);

app.use(globalErrorHandler);

export default app;
