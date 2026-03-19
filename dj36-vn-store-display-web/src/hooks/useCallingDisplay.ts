import { use, useEffect, useRef } from "react";
import config from "../config.json";

import {
  overlayAnimation,
  titleAnimation,
  headingAnimation,
  zoomOutAnimation,
} from "../animations/calling";
import { WebSocketContext } from "../context/WebSocketContext";
import { AnimationOptions } from "../types/callingTypes";

export const useCallingDisplay = () => {
  const { setCallingNumberClass, setCallingTitleClass, callingNumber } = use(WebSocketContext);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Animation handler function
  const animateElement = async ({ element, keyframes, options }: AnimationOptions) => {
    if (element) {
      return element.animate(keyframes, options).finished;
    }
  };
  
  const playSound = () => {
    const sound = audioRef.current;
    if (!sound) return;

    sound.currentTime = 0;
    sound.play().catch((err) => {
      console.error("Audio play error:", err);
    });
  };

  const runAnimations = async () => {
    overlayAnimation.element = overlayRef.current;
    headingAnimation.element = textRef.current;
    titleAnimation.element = titleRef.current;

    // Play sound before title animation starts
    playSound();

    await animateElement(overlayAnimation);
    setCallingTitleClass('opacity-1');

    // Start heading animation
    await animateElement(headingAnimation);
      setCallingNumberClass('opacity-1');

    // Start title animation
    await animateElement(titleAnimation);

    // Apply zoom-out effect for both text and title in parallel
    if (textRef.current && titleRef.current) {
      const textZoomOut = animateElement({
        ...zoomOutAnimation,
        element: textRef.current,
      });
      const titleZoomOut = animateElement({
        ...zoomOutAnimation,
        element: titleRef.current,
      });

      await Promise.all([textZoomOut, titleZoomOut]);
    }
  };

  useEffect(() => {
    try {
      const tonePath = new URL(
        `../assets/media/${config.tone}`,
        import.meta.url
      ).href;
      const audio = new Audio(tonePath);
      audioRef.current = audio;
    } catch (error) {
      console.error("Failed to load sound:", error);
    }
  }, []);

  useEffect(() => {
    runAnimations();
  }, [callingNumber]);

  return { overlayRef, textRef, titleRef, callingNumber };
};
