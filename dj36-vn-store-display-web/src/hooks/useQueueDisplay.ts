import { use, useMemo } from "react";
import { WebSocketContext } from "../context/WebSocketContext";

export const useQueueDisplay = () => {
  const { calledList, waitingList } = use(WebSocketContext);
  return useMemo(() => {
    // --- Derived State for Readability ---
    const calledListCount = calledList.length;
    const waitingListCount = waitingList.length;
    const hasCalled = calledListCount > 0;
    const hasWaiting = waitingList.length > 0;
    const calledListGreaterThanFive = calledListCount > 5;

    // --- Calculate Dynamic Widths and Gaps ---
    const leftSectionWidth = () => {
      if (
        (hasCalled && hasWaiting) ||
        (!hasWaiting && calledListGreaterThanFive)
      ) {
        return "w-[51.25%]";
      }
      return "w-[28.12%]";
    };

    // Determine the gap between Called and Waiting sections
    const mainContentGapClass = () => {
      return calledListCount <= 5 && waitingListCount <= 5
        ? "xl:gap-12"
        : "xl:gap-[60px]";
    };

    // --- Conditional Styling for Called List Container ---
    const calledContainerClasses = () => {
      let widthClass;
      if (!hasWaiting) {
        widthClass = "w-full";
      } else {
        widthClass = calledListCount <= 5 ? "w-1/2" : "w-2/3";
      }
      return `flex flex-col gap-3 xl:gap-6 ${widthClass}`;
    };

    // --- Conditional Styling for Waiting List Container ---
    const waitingContainerClasses = () => {
      let widthClass;
      if (!hasCalled) {
        widthClass = "w-full";
      } else {
        widthClass = calledListCount <= 5 ? "w-1/2" : "w-1/3";
      }
      return `flex flex-col gap-3 xl:gap-6 ${widthClass}`;
    };

    // --- Conditional Styling for Called QueueGrid ---
    const calledGridParentClasses = () => {
      const base = "grid gap-3 h-full";
      if (calledListGreaterThanFive) {
        const xlGap = hasWaiting ? "xl:gap-6" : "xl:gap-12";
        return `${base} grid-cols-2 ${xlGap}`;
      }
      return `${base} grid-cols-1 xl:gap-6`;
    };

    const calledQueueGridClasses = () => {
      return `grid gap-3 h-full grid-cols-1 grid-rows-5 xl:gap-6`;
    };

    const waitingQueueGridClasses = () => {
      return "grid xl:gap-6 grid-rows-5 gap-3 h-full grid-cols-1";
    };

    return {
      calledList,
      waitingList,
      hasCalled,
      hasWaiting,
      leftSectionWidth,
      mainContentGapClass,
      calledContainerClasses,
      waitingContainerClasses,
      calledQueueGridClasses,
      calledGridParentClasses,
      waitingQueueGridClasses,
    };
  }, [calledList, waitingList]);
};
