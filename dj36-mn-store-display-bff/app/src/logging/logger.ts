import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info",
  exitOnError: false,
  format: format.combine(
    format.json(),
    format.timestamp({ format: new Date().toISOString() }),
    format.errors({ stack: true }),
  ),
  transports: [new transports.Console()],
});
