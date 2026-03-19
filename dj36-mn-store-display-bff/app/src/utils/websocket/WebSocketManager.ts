import { WebSocketServer, WebSocket } from "ws";
import { injectable } from "inversify";
import { IncomingMessage, Server as HTTPServer } from "http";
import { Server as HTTPSServer } from "https";
import { components as components } from "~/src/interfaces/root";

import { reception } from "~/src/presenters/instances";
import { logger } from "~/src/logging/logger";
import {
  ErrorCodes,
  PingInterval,
  WS_ERROR_CODES,
} from "~/src/compornents/const";
import { isAfter, differenceInSeconds } from "date-fns";

/**
 * 指定された HTTP サーバーの WebSocket 接続を管理します。
 * 新しい接続が確立されると、このクラスは 'reception' プレゼンターからデータをポーリングし、クライアントに送信します。
 */
export interface ClientConnection {
  ws: WebSocket;
  receptionNumber?: string;
}

const { ONE_AND_HALF_SEC, THIRTY_SEC, ONE_MIN, FIFTEEN_SEC } = PingInterval;
const { CLOSE_CONNECTION, ERROR } = WS_ERROR_CODES;

@injectable()
export class WebSocketManager {
  /**
   * 指定された HTTP サーバー上に WebSocket サーバーを設定し、
   * パス "/ws" で待機します。新しい接続ごとに、
   * 1.5 秒間隔で 'reception.show' からデータをポーリングします。
   *
   * @param server 接続するHTTPサーバーインスタンス
   */
  public setup(server: HTTPServer | HTTPSServer): void {
    // /ws をリッスンする WebSocket サーバーを作成する
    const wss = new WebSocketServer({ server, path: "/ws" });

    // 新しいクライアント接続を処理する
    wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
      // URL を解析してクエリ パラメータ (storeId、receptionNumber) を抽出します。
      const url = new URL(req.url!, "http://localhost");
      const storeId = url.searchParams.get("storeid");
      const receptionNumber =
        url.searchParams.get("receptionNumber") || undefined;

      logger.info(`New WebSocket connection. storeId=${storeId}`);

      // storeIdが見つからない場合は、直ちに接続を閉じます
      if (!storeId) {
        logger.error(`Missing storeId in query string. Closing WebSocket.`);
        ws.close(CLOSE_CONNECTION, "Missing storeId in query string");
        return;
      }

      // 動的間隔時間を設定する
      const pollIntervalRef = {
        current: null as ReturnType<typeof setInterval> | null,
      };
      const currentPollIntervalRef = { value: ONE_AND_HALF_SEC };

      const startDynamicPolling = (
        intervalMs: number,
        callback: () => Promise<void>,
        currentIntervalRef: { value: number },
        intervalRef: { current: ReturnType<typeof setInterval> | null },
      ) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(callback, intervalMs);
        currentIntervalRef.value = intervalMs;
      };

      let previousCallingNumber:
        | {
            callingNumber?: string | undefined;
            registeredDate?: string | undefined;
            updatedDatetime?: string | undefined;
          }
        | null
        | undefined = {
        callingNumber: "-1",
        registeredDate: "1970-01-01",
        updatedDatetime: "1970-01-01T00:00:00.000Z",
      };

      /**
       * 指定された storeId の 'reception.show' メソッドからデータをポーリングします。
       * データをクライアントに送信します。 'isReceptionClose' が true の場合、
       * 接続が閉じられ、ポーリングが停止します。
       */
      const pollData = async () => {
        function isErrorResponse(
          data:
            | components["schemas"]["RcptInfoResponse"]
            | components["schemas"]["RcptInfoErrorResponse"],
        ): data is components["schemas"]["RcptInfoErrorResponse"] {
          return "code" in data;
        }

        try {
          logger.info(`Polling data for storeId=${storeId}`);
          const data = await reception.show(storeId, receptionNumber);
          logger.info(
            `Data fetched for storeId=${storeId}: ${JSON.stringify(data)}`,
          );

          if (isErrorResponse(data)) {
            if (data.code && ErrorCodes.has(data.code)) {
              logger.info(`storeId=${storeId} is invalid.`);
              if (currentPollIntervalRef.value !== ONE_AND_HALF_SEC) {
                startDynamicPolling(
                  ONE_AND_HALF_SEC,
                  pollData,
                  currentPollIntervalRef,
                  pollIntervalRef,
                );
              }

              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "invalid storeId",
                  code: ERROR,
                }),
              );
            }
            return;
          }

          if (data.isReceptionClose === true) {
            // 受信が閉じている場合は、ポーリングを停止し、ソケットを閉じます。
            logger.info(
              `Reception closed for storeId=${storeId}. Closing WebSocket.`,
            );
            if (currentPollIntervalRef.value !== ONE_MIN) {
              startDynamicPolling(
                ONE_MIN,
                pollData,
                currentPollIntervalRef,
                pollIntervalRef,
              );
            }

            ws.send(
              JSON.stringify({
                type: "error",
                message: "Reception is closed",
                code: ERROR,
              }),
            );
          } else {
            // データはFEに送信されます
            if (currentPollIntervalRef.value !== ONE_AND_HALF_SEC) {
              startDynamicPolling(
                ONE_AND_HALF_SEC,
                pollData,
                currentPollIntervalRef,
                pollIntervalRef,
              );
            }
            // クライアントにデータを送信する
            if (
              data.queuesData &&
              previousCallingNumber &&
              previousCallingNumber.callingNumber == "-1"
            ) {
              previousCallingNumber = data.queuesData.callingNumber;
            } else if (previousCallingNumber?.updatedDatetime) {
              const updatedTime = new Date(previousCallingNumber.updatedDatetime + "Z",);
              const currentTime = new Date();
              if (
                previousCallingNumber &&
                data.queuesData &&
                previousCallingNumber.callingNumber != data.queuesData.callingNumber?.callingNumber
              ) {
                previousCallingNumber = data.queuesData.callingNumber;
              } else if (
                previousCallingNumber && data.queuesData &&
                previousCallingNumber.callingNumber == data.queuesData.callingNumber?.callingNumber &&
                previousCallingNumber.updatedDatetime == data.queuesData.callingNumber?.updatedDatetime &&
                isAfter(currentTime, updatedTime) && differenceInSeconds(currentTime, updatedTime) >= 30
              ) {
                // 前回の通話番号を保存する
                data.queuesData.callingNumber = undefined;
              } else if (
                previousCallingNumber &&
                data.queuesData &&
                previousCallingNumber.callingNumber == data.queuesData.callingNumber?.callingNumber &&
                previousCallingNumber.updatedDatetime != data.queuesData.callingNumber?.updatedDatetime
              ) {
                previousCallingNumber = data.queuesData.callingNumber;
              }
            }
            ws.send(JSON.stringify(data));
          }
        } catch (error) {
          logger.error(`Error fetching data for storeId=${storeId}: ${error}`);
          ws.send(
            JSON.stringify({
              type: "error",
              message: error,
              code: ERROR,
            }),
          );
        }
      };

      // すぐに1回ポーリングし、その後1.5秒ごとにポーリングするように設定する
      pollData();
      startDynamicPolling(
        ONE_AND_HALF_SEC,
        pollData,
        currentPollIntervalRef,
        pollIntervalRef,
      );

      // ハートビートログを15秒ごとに送信する
      const heartbeatInterval = setInterval(() => {
        logger.info(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            message: "Heartbeat",
            status: "INFO",
            storeId: storeId,
          }),
        );
      }, FIFTEEN_SEC);

      // クライアントが切断したらポーリングを停止する
      ws.on("close", () => {
        logger.info(`WebSocket closed for storeId=${storeId}`);
        pollIntervalRef.current && clearInterval(pollIntervalRef.current);
        clearInterval(heartbeatInterval);
      });
    });
  }
}
