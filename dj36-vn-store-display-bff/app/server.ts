import app from "~/app";
import http from "http";
import { wsManager } from "~/src/presenters/instances";
import { logger } from "~/src/logging/logger";

const port: string = process.env.SERVER_PORT ?? "3000";
const server = http.createServer(app);

wsManager.setup(server);

server.listen(port, () => {
  logger.info(`App start on port ${port}`);
});
