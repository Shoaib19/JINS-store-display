export interface CallingNumber {
  callingNumber: string;
  registeredDate: string;
}
export type calledList = CallingNumber[];

export interface CallingDisplayProps {
  calling: CallingNumber;
}

export interface AnimationOptions {
  element: HTMLElement | null;
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
}
