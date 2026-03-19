import WaitingDisplay from "../WaitingDisplay";
import CallingDisplay from "../CallingDisplay";
import QueueDisplay from "../queue/QueueDisplay";
import JinsDisplay from "../JinsDisplay";
import { WebSocketContext } from "../../context/WebSocketContext";
import { use } from "react";

const Display = () => {
  const {data, showJinsDiplay, callingNumber, calledList, waitingList } = use(WebSocketContext);
  const isReceptionClose = data?.isReceptionClose ?? false;
  const hasCalled = calledList.length > 0;
  const hasWaiting = waitingList.length > 0;
  const showLeftSection = hasCalled || hasWaiting;


  if (isReceptionClose || showJinsDiplay) {
    return <JinsDisplay />;
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-black text-white select-none">
      {/* Left Section - Called & Waiting */}
      {showLeftSection && <QueueDisplay />}
      {/* Right Section - Calling or Waiting display here */}
      {callingNumber ? (
        <CallingDisplay />
      ) : (
        <WaitingDisplay
        />
      )}
    </div>
  );
};

export default Display;
