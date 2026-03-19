import { AnimationOptions } from "../types/callingTypes";

export const overlayAnimation: AnimationOptions = {
  element: null,
  keyframes: [
    { transform: "translateX(100%)", opacity: 1 },
    { transform: "translateX(0)", opacity: 1 },
  ],
  options: {
    duration: 500,
    easing: "ease-in-out",
    fill: "forwards",
  },
};

export const headingAnimation: AnimationOptions = {
  element: null,
  keyframes: [
    { clipPath: "inset(100% 0 0 0)", transform: "scale(0.8)", opacity: 1 },
    { clipPath: "inset(0)", transform: "scale(1)", opacity: 1 },
    { clipPath: "inset(0)", transform: "scale(1.1)", opacity: 1 },
  ],
  options: {
    duration: 600,
    easing: "ease-in-out",
    fill: "forwards",
    delay: 1,
  },
};

export const titleAnimation: AnimationOptions = {
  element: null,
  keyframes: [
    { clipPath: "inset(0 0 100% 0)", transform: "scale(1)", opacity: 1 },
    { clipPath: "inset(0)", transform: "scale(1.1)", opacity: 1 },
  ],
  options: {
    duration: 600,
    easing: "ease-in-out",
    fill: "forwards",
    delay: 1,
  },
};

export const zoomOutAnimation: Omit<AnimationOptions, "element"> = {
  keyframes: [
    { transform: "scale(1.1)" }, // Phase 1: Scale 110% (Start)
    { transform: "scale(1.05)" }, //  Hold 105% briefly
    { transform: "scale(1)" }, // Phase 2: Scale 100% (End)
  ],
  options: {
    duration: 2100, // Total duration (100ms + 2000ms)
    easing: "ease-out",
    fill: "forwards",
    delay: 200,
  },
};
