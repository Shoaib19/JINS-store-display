import { useQueueDisplay } from "../../hooks/useQueueDisplay";
import { CalledSection } from "./CalledSection";
import WaitingSection from "./WaitingSection";

const QueueDisplay = () => {
  const { hasCalled, hasWaiting, leftSectionWidth, mainContentGapClass } = useQueueDisplay();

  return (
    <div
      className={`${leftSectionWidth()} flex h-full flex-col items-center justify-center bg-light-gray text-black 2xl:p-12 p-6`}
    >
      <div className="p-3 3xl:p-6 w-full h-full">
        <div
          className={`w-full h-full flex gap-8 ${mainContentGapClass()} 4xl:gap-24`}
        >
          {/* Called Numbers Section */}
          {hasCalled && <CalledSection />}

          {/* Waiting Numbers Section */}
          {hasWaiting && <WaitingSection />}
        </div>
      </div>
    </div>
  );
};

export default QueueDisplay;
