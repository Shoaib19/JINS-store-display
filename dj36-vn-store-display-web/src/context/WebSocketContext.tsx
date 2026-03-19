import { createContext, useState, useEffect, useRef, useCallback } from "react";
import {
  WebSocketContextProps,
  WebSocketProviderProps,
  WebSocketResponse,
} from "../types/webSocketTypes";
import { useSearchParams } from "react-router-dom";
import { defaultContext } from "../constants/webSocket";
import { isValidCountryCode, isMissingKeyInJSON, filterQueueData } from "../utils";

const WebSocketContext = createContext<WebSocketContextProps>(defaultContext);

const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [data, setData] = useState<WebSocketResponse>();
  const callingNumber = data?.queuesData?.callingNumber?.callingNumber ?? "";
  const [showJinsDiplay, setJinsDiplay] = useState(true);
  const [callingTitleClass, setCallingTitleClass] = useState("");
  const [callingNumberClass, setCallingNumberClass] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeid") || "";
  const countryCode = (searchParams.get("countrycode") || "").toLowerCase();
  const queuesData = {
    calledList: data?.queuesData?.calledList ?? [],
    waitingList: data?.queuesData?.waitingList ?? []
  };
  const { calledList, waitingList } = filterQueueData({ ...queuesData });
  const WS_URL = `${
    import.meta.env.VITE_BFF_ENDPOINT
  }/ws?storeid=${storeId}&countrycode=${countryCode}`;
  
  const resetState = () => {
    setJinsDiplay(true);
    setCurrentTime('');
  }

  const handleWebSocketMessage = (event: MessageEvent) => {
    try {
      if (!event?.data || isMissingKeyInJSON(event.data, "isReceptionClose")) {
        resetState();
        return;
      }
      const data: WebSocketResponse = JSON.parse(event.data);
      setData(data);
      if (data?.currentTime) {
        setCurrentTime(data.currentTime);
      }
      setTimeout(() => {
        setJinsDiplay(false);
      }, 1000);
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  const connect = useCallback(() => {
    if (socketRef.current || !storeId || !isValidCountryCode(countryCode)) {
      return;
    }

    socketRef.current = new WebSocket(WS_URL);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = handleWebSocketMessage;

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setJinsDiplay(true);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      setJinsDiplay(true);
    };
  }, [WS_URL]);

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    setCallingTitleClass("!opacity-0");
    setCallingNumberClass("!opacity-0");
  }, [callingNumber]);

  return (
    <WebSocketContext
      value={{
        data,
        showJinsDiplay,
        callingTitleClass,
        setCallingTitleClass,
        callingNumberClass,
        setCallingNumberClass,
        callingNumber,
        calledList,
        waitingList,
        currentTime,
        countryCode,
      }}
    >
      {children}
    </WebSocketContext>
  );
};

export { WebSocketProvider, WebSocketContext };