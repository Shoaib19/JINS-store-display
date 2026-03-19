import { QueueGridProps } from "../../types/queueTypes";


const QueueGrid = ({list, textColor, bgColor, gridClass }: QueueGridProps) => {
  return (
    <div className={gridClass}>
      {list.map(({ callingNumber }, index) => (
        <h6
          key={index}
          className={`w-full flex items-center justify-center ${bgColor} ${textColor} number tracking-[1.5px] text-4xl 2xl:text-[60px] 3xl:text-[75px] 4xl:text-[100px] text-center font-normal rounded-[20px] leading-[75px] pt-2 3xl:pt-4`}
        >
          {callingNumber}
        </h6>
      ))}
    </div>
  );
};

export default QueueGrid;
