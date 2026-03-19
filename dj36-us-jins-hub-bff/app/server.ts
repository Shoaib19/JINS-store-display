import * as dotenv from 'dotenv';
import app from "~/app";
import "~/tracer";
import { logger } from "~/src/logging/logger";

dotenv.config();

const port: string = process.env.SERVER_PORT ?? "3000";
app.listen(port, () => {
  logger.info(`App start on port ${port}`);
});
