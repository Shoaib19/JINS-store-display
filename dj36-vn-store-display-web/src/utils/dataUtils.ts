import { QueuesData } from "../types/queueTypes";

export const jsonParser = (json: string) => {
  try {
    const parsed = JSON.parse(json);
    return parsed;
  } catch (error) {
    console.error("JSON parsing error:", error);
    return null;
  }
};

export const isMissingKeyInJSON = (data: string, key: string): boolean => {
  const parsedData = jsonParser(data);
  if (!parsedData) return true;

  return !Object.hasOwn(parsedData, key);
};

export const filterQueueData = ({
  calledList,
  waitingList
}: QueuesData) => {
  const hasNoData = calledList.length === 0 && waitingList.length === 0
  if (hasNoData) return { calledList: [], waitingList: []};

  return {
    calledList: calledList.slice(0, 10),
    waitingList: waitingList.slice(0, 5),
  };
};
