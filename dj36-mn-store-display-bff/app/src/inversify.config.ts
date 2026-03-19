import * as dotenv from "dotenv";
import { Container } from "inversify";
import { PresenterTypes } from "~/src/presenters/PresenterTypes";
import {
  IStatusPresenter,
  INotFoundPresenter,
  IDummyPresenter,
  IReceptionsPresenter,
  IWebSocketManager,
} from "~/src/presenters/interfaces";
import { StatusPresenter } from "~/src/presenters/system/StatusPresenter";
import { NotFoundPresenter } from "~/src/presenters/system/NotFoundPresenter";
import { DummyPresenter } from "~/src/presenters/dummy/DummyPresenter";
import { ReceptionsPresenter } from "~/src/presenters/receptions/ReceptionsPresenter";
import { WebSocketManager } from "~/src/utils/websocket/WebSocketManager";

import { logger } from "~/src/logging/logger";

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
  .bind<IWebSocketManager>(PresenterTypes.WebSocketManager)
  .to(WebSocketManager);

export { container };
