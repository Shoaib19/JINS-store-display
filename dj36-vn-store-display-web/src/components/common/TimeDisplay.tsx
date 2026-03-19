import { use } from "react";
import { WebSocketContext } from "../../context/WebSocketContext";
interface TimeDisplayProps {
  textColor: string;
}

export default function TimeDisplay({ textColor }: TimeDisplayProps) {
  const { currentTime } = use(WebSocketContext);
  return (
    <h6
      className={`text-[36px] 2xl:text-[45px] leading-[68px] 3xl:text-[52px] 4xl:text-[80px] font-normal absolute top-0 right-0 ${textColor}`}
    >
      {currentTime}
    </h6>
  );
}
