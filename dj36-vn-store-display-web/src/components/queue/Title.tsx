import { titleProps } from "../../types/queueTypes";

const Title = ({ title, style }: titleProps) => {
  return (
    <h2
      className={`font-medium text-3xl 2xl:text-[42px] 3xl:text-[52px] 4xl:text-[70px] flex items-center tracking-[1.2px] min-h-[136px] ${style}`}
    >
      {title}
    </h2>
  );
};

export default Title;
