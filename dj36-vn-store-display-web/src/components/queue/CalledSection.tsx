import Container from "./Container";
import QueueGrid from "./QueueGrid";
import Title from "./Title";
import { useQueueDisplay } from "../../hooks/useQueueDisplay";
import { LOCAL_DISPLAY } from "../../constants/localeDisplay";

export const CalledSection = () => {
  const {
    calledList,
    calledContainerClasses,
    calledGridParentClasses,
    calledQueueGridClasses,
  } = useQueueDisplay();

  return (
    <Container style={calledContainerClasses()}>
      <Title title={LOCAL_DISPLAY.called} style="text-red" />
      <div className={calledGridParentClasses()}>
        <QueueGrid
          list={calledList.slice(0, 5)}
          textColor="text-red"
          bgColor="bg-white"
          gridClass={calledQueueGridClasses()}
        />
        {!!(calledList.length > 5) && (
          <QueueGrid
            list={calledList.slice(5, 10)}
            textColor="text-red"
            bgColor="bg-white"
            gridClass={calledQueueGridClasses()}
          />
        )}
      </div>
    </Container>
  );
};
