import { WebSocketContextProps } from "../types/webSocketTypes";

// Provide default values to avoid undefined errors
export const defaultContext: WebSocketContextProps = {
  data: undefined,
  showJinsDiplay: true,
  callingTitleClass: "!opacity-0",
  setCallingTitleClass: () => {},
  callingNumberClass: "!opacity-0",
  setCallingNumberClass: () => {},
  callingNumber: "",
  calledList: [],
  waitingList: [],
  currentTime: "",
  countryCode: ""
};