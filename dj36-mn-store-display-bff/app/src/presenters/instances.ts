import "reflect-metadata";
import { container } from "~/src/inversify.config";

import { PresenterTypes } from "~/src/presenters/PresenterTypes";
import {
  IStatusPresenter,
  INotFoundPresenter,
  IDummyPresenter,
  IReceptionsPresenter,
  IWebSocketManager,
} from "~/src/presenters/interfaces";

export const status = container.get<IStatusPresenter>(
  PresenterTypes.IStatusPresenter,
);
export const notFound = container.get<INotFoundPresenter>(
  PresenterTypes.INotFoundPresenter,
);
export const dummy = container.get<IDummyPresenter>(
  PresenterTypes.IDummyPresenter,
);
export const reception = container.get<IReceptionsPresenter>(
  PresenterTypes.IReceptionsPresenter,
);

export const wsManager = container.get<IWebSocketManager>(
  PresenterTypes.WebSocketManager,
);
