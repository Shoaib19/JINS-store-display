import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { WebSocketManager } from "~/src/utils/websocket/WebSocketManager";
import { reception } from "~/src/presenters/instances";

jest.mock("ws");
jest.mock("~/src/presenters/instances");

describe("WebSocketManager", () => {
  let wsManager: WebSocketManager;
  let mockServer: Server;
  let mockWs: jest.Mocked<WebSocket>;
  let mockWss: jest.Mocked<WebSocketServer>;

  beforeEach(() => {
    jest.useFakeTimers();
    mockWs = {
      send: jest.fn(),
      close: jest.fn(),
      on: jest.fn(),
    } as unknown as jest.Mocked<WebSocket>;

    mockWss = {
      on: jest.fn(),
    } as unknown as jest.Mocked<WebSocketServer>;

    const MockedWebSocketServer = WebSocketServer as unknown as jest.Mock;
    MockedWebSocketServer.mockImplementation(() => {
      return mockWss;
    });
    mockServer = new Server();
    wsManager = new WebSocketManager();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test("should setup WebSocket server with correct path", () => {
    wsManager.setup(mockServer);
    expect(WebSocketServer).toHaveBeenCalledWith({
      server: mockServer,
      path: "/ws",
    });
  });

  test("should reject connection when storeId is missing", () => {
    wsManager.setup(mockServer);
    const connectionHandler = mockWss.on.mock.calls[0][1];
    const mockReq: { url: string } = { url: "/ws" };
    connectionHandler.call(mockWss, mockWs, mockReq);

    expect(mockWs.close).toHaveBeenCalledWith(
      1000,
      "Missing storeId in query string",
    );
  });

  test("should establish connection with valid storeId", () => {
    wsManager.setup(mockServer);
    const connectionHandler = mockWss.on.mock.calls[0][1];
    const mockReq: { url: string } = { url: "/ws?storeid=123" };
    connectionHandler.call(mockWss, mockWs, mockReq);

    expect(mockWs.close).not.toHaveBeenCalled();
  });

  test("should handle errors during polling", async () => {
    const error = new Error("Test error");
    (reception.show as jest.Mock).mockRejectedValue(error);

    wsManager.setup(mockServer);
    const connectionHandler = mockWss.on.mock.calls[0][1];
    const mockReq: { url: string } = { url: "/ws?storeid=123" };
    connectionHandler.call(mockWss, mockWs, mockReq);

    jest.advanceTimersByTime(30000);
    await Promise.resolve();

    expect(mockWs.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: "error",
        message: error,
        code: 4000,
      }),
    );
  });

  test("should clear interval on connection close", async () => {
    wsManager.setup(mockServer);
    const connectionHandler = mockWss.on.mock.calls[0][1];
    const mockReq: { url: string } = { url: "/ws?storeid=123" };
    connectionHandler.call(mockWss, mockWs, mockReq);

    jest.advanceTimersByTime(0);
    await Promise.resolve();
    expect(reception.show).toHaveBeenCalledTimes(1);

    const closeCall = mockWs.on.mock.calls.find((call) => call[0] === "close");
    expect(closeCall).toBeDefined();
    const closeHandler = closeCall![1];
    closeHandler.call(mockWs);

    jest.clearAllMocks();
    jest.advanceTimersByTime(30000);
    await Promise.resolve();

    expect(reception.show).not.toHaveBeenCalled();
  });

  test("should send error when reception is closed", async () => {
    const mockData = { isReceptionClose: true };
    (reception.show as jest.Mock).mockResolvedValue(mockData);

    wsManager.setup(mockServer);
    const connectionHandler = mockWss.on.mock.calls[0][1];
    const mockReq: { url: string } = { url: "/ws?storeid=123" };
    connectionHandler.call(mockWss, mockWs, mockReq);

    jest.advanceTimersByTime(1500);
    await Promise.resolve();

    expect(mockWs.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: "error",
        message: "Reception is closed",
        code: 4000,
      }),
    );
  });

  test("should send error when no data or invalid storeId", async () => {
    const mockErrorResponse = {
      code: "DPFM_RCPT_0001",
      message: "There are no records that match the store code.",
      jinsTraceId: "2389c607-f5ed-4789-95a3-eyx78be2s8dz",
      details: null,
    };
    (reception.show as jest.Mock).mockResolvedValue(mockErrorResponse);

    wsManager.setup(mockServer);

    const connectionHandler = mockWss.on.mock.calls.find(
      (call): call is [string, (ws: WebSocket, req: any) => void] =>
        call[0] === "connection",
    )?.[1];
    expect(connectionHandler).toBeDefined();

    const mockReq = { url: "/ws?storeid=431" };

    connectionHandler!.call(mockWss, mockWs, mockReq as any);

    jest.advanceTimersByTime(1500);
    await Promise.resolve();

    expect(mockWs.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: "error",
        message: "invalid storeId",
        code: 4000,
      }),
    );
  });

  test("should send data when valid data is available", async () => {
    const mockData = { queuesData: { callingNumber: "A123" } };
    (reception.show as jest.Mock).mockResolvedValue(mockData);

    wsManager.setup(mockServer);
    const connectionHandler = mockWss.on.mock.calls[0][1];
    const mockReq: { url: string } = { url: "/ws?storeid=123" };
    connectionHandler.call(mockWss, mockWs, mockReq);

    jest.advanceTimersByTime(1500);
    await Promise.resolve();

    expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(mockData));
  });

  test("should log heartbeat every 15 seconds", () => {
    wsManager.setup(mockServer);
    const connectionHandler = mockWss.on.mock.calls[0][1];
    const mockReq: { url: string } = { url: "/ws?storeid=123" };
    connectionHandler.call(mockWss, mockWs, mockReq);

    jest.advanceTimersByTime(15000);

    expect(mockWs.send).not.toHaveBeenCalled();
  });
});
