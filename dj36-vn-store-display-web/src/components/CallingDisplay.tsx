import { use } from "react";
import TimeDisplay from "./common/TimeDisplay";
import { useCallingDisplay } from "../hooks/useCallingDisplay";
import { WebSocketContext } from "../context/WebSocketContext";
import { LOCAL_DISPLAY } from '../constants/localeDisplay';

const CallingDisplay = () => {
  const { callingNumberClass, callingTitleClass, callingNumber } = use(WebSocketContext);
  const { overlayRef, textRef, titleRef } = useCallingDisplay();
  return (
    <div className="relative bg-white flex flex-1 h-full flex-col items-center overflow-hidden 2xl:p-12 p-6">
      <div ref={overlayRef} className="bg-red w-full h-full absolute z-5 top-0 opacity-0"></div>
      <div className="p-3 3xl:p-6 w-full h-full flex flex-col justify-center relative gap-38">
        <div className=" h-full z-10 relative">
          <TimeDisplay textColor="text-white" />
          <div className="absolute min-w-[792px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center flex flex-col 2xl:gap-10">
          {/* calling heading */}
            <h2 ref={textRef} className={`2xl:text-[90px] 3xl:text-[130px] text-[60px] font-bold tracking-[2.6px] leading-[182px] ${callingTitleClass}`}>
              {LOCAL_DISPLAY.calling}
            </h2>
            {/* calling number */}
            <h1 ref={titleRef} className={`text-[140px] 2xl:text-[200px] number tracking-[6.08px] 3xl:text-[304px] xl:leading-[204px] 3xl:leading-[304px] m-0 font-normal ${callingNumberClass}`}>
              {callingNumber}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallingDisplay;
