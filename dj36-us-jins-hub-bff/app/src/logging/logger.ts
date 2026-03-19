import { createLogger, format, transports } from "winston";

const isLocal = process.env.NODE_ENV === 'develop'; // 'develop' が開発環境

export const logger = createLogger({
  level: isLocal ? "debug" : "info", // 開発環境では debug レベルを出力
  exitOnError: false,
  format: format.combine(
    format.json(),
    format.timestamp({ format: new Date().toISOString() }),
    format.errors({ stack: true }),
  ),
  transports: [new transports.Console(),
    new transports.File({ filename: 'logs/application.log' }), // ファイルへの出力
  ],
});
