import { CallingNumber } from "./callingTypes";

export interface WaitTimeRange {
  earliest?: number | String;
  latest: number | String;
}

export type waitingList = CallingNumber[];

