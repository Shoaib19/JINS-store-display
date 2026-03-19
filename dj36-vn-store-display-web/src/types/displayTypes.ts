import { calledList } from "./callingTypes";
import { waitingList } from "./waitingTypes";

export interface DisplayProps {
  calling: string;
  waiting: waitingList;
  called: calledList;
}
export type LocaleDisplay = {
  called: string;
  waiting: string;
  min: string;
  orMore: string;
  calling: string;
  date_time: string;
  eyeExamWaitTime: string;
  eyeExamWaitTime_eyeExam: string;
  eyeExamWaitTime_wait: string;
  eyeExamWaitTime_time: string;
}