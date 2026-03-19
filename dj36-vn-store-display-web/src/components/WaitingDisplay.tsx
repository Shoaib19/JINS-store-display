import useWaitingDisplay from "../hooks/useWaitingDisplay";
import TimeDisplay from "./common/TimeDisplay";
import { LOCAL_DISPLAY } from '../constants/localeDisplay';

function WaitingDisplay() {
  const { shouldUseSmallGap, hasBothOrOnlyOneWithLongList, longListWithCalledOrWaiting, hasBothOrLongList, hasEarliest, earliest, latest, heading, getPadding } = useWaitingDisplay();
  
  return (
    <div className="bg-white overflow-hidden flex flex-1 h-full flex-col relative justify-center items-center 2xl:p-12 p-6">
    <div className="p-3 3xl:p-6 w-full h-full">
      <div className="relative h-full flex flex-col justify-center">
        {/* Current time display on top right corner */}
          <TimeDisplay textColor="text-black"/>
        {/* Centered Time Box */}
        <div className={`flex flex-col justify-center items-center ${shouldUseSmallGap() ? '3xl:gap-[64px]' : '3xl:gap-[100px]'} 4xl:gap-[100px] gap-12 ${getPadding()} `}>
          {hasBothOrOnlyOneWithLongList() ? (
            <h6 className={`flex 3xl:text-[80px] font-medium flex-col 4xl:text-[120px] 2xl:text-[68px] text-[44px] 3xl:leading-[112px] 3xl:tracking-[1.76px] 4xl:leading-[150px] leading-none  text-black text-center px-10`}>{heading}</h6>
          ) : (
            <h6 className="3xl:text-[96px] w-full max-w-[1376px] font-bold 4xl:text-[120px] 2xl:text-[75px] text-[60px] 3xl:leading-[134.4px] 4xl:leading-[150px] leading-none text-black text-center tracking-[1.92px] ">{heading}</h6>
          )}
          <div className="text-center flex flex-col 3xl:gap-2">
            <div className={`flex justify-center pl-10 ${hasBothOrOnlyOneWithLongList() ? 'gap-4' : 'gap-6'} items-baseline`}>
              <div className={`flex ${hasBothOrOnlyOneWithLongList() ? 'gap-2' : 'gap-4'} `}>
                {hasEarliest && (
                  <>
                    <h1 className={`${longListWithCalledOrWaiting() ? '3xl:text-[128px] 3xl:leading-[128px]' : hasBothOrOnlyOneWithLongList() ? '3xl:text-[176px] 3xl:leading-[176px] 3xl:tracking-[3.52px]' : '3xl:text-[250px] 3xl:leading-[250px] 3xl:tracking-[5px]' } leading-none 4xl:text-[250px] 2xl:text-[120px] text-[90px] font-normal text-black number `}>
                      {earliest}
                    </h1>
                    <span className={`${longListWithCalledOrWaiting() ? '3xl:text-[128px] 3xl:leading-[128px] 2xl:bottom-[25px]' : hasBothOrOnlyOneWithLongList() ? '3xl:text-[176px] 3xl:leading-[176px] 3xl:tracking-[3.52px] 2xl:bottom-[25px]' : '3xl:text-[250px] 3xl:leading-[250px] 3xl:tracking-[5px] 2xl:bottom-[30px] 3xl:bottom-[55px]' } relative leading-none 4xl:text-[250px] 2xl:text-[120px] text-[64px] font-normal text-black`}>-</span>
                  </>
                )}
                <h1 className={`${longListWithCalledOrWaiting() && hasEarliest ? '3xl:text-[128px] 3xl:leading-[128px]' : hasBothOrOnlyOneWithLongList() ? '3xl:text-[176px] 3xl:leading-[176px] 3xl:tracking-[3.52px]' : '3xl:text-[250px] 3xl:leading-[250px] 3xl:tracking-[5px]' } leading-none 4xl:text-[250px] 2xl:text-[120px] text-[90px] font-normal text-black number `}>
                  {latest}
                </h1>
              </div>
              <h6 className={`${hasBothOrLongList() ? '3xl:text-[80px] 3xl:py-3 3xl:leading-[96px] 3xl:tracking-[1.8px]' : '3xl:text-[90px] 3xl:py-5 3xl:leading-[108px] 3xl:tracking-[3px]' } gap-2  2xl:text-[70px] text-[50px] font-bold text-black`}>{LOCAL_DISPLAY.min}</h6>
            </div>
            {!hasEarliest && (
                <h6 className="4xl:text-[80px] 2xl:text-[56px] text-[44px] font-normal  2xl:font-medium text-black tracking-[1.28px] leading-[67.2px]">{LOCAL_DISPLAY.orMore}</h6>
              )}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
}

export default WaitingDisplay;
