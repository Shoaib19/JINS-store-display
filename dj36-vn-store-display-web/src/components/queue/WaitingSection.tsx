import QueueGrid from "./QueueGrid";
import Title from "./Title";
import Container from "./Container";
import { useQueueDisplay } from "../../hooks/useQueueDisplay";
import { LOCAL_DISPLAY } from '../../constants/localeDisplay.ts';

const WaitingSection = () => {

  const {
    waitingList,
    hasWaiting,
    waitingContainerClasses,
    waitingQueueGridClasses,
  } = useQueueDisplay();

  return (
    <Container style={waitingContainerClasses()}>
      <Title title={LOCAL_DISPLAY.waiting} style="text-black" />
      {hasWaiting && (
        <QueueGrid
          list={waitingList}
          textColor="text-black"
          bgColor="bg-white"
          gridClass={waitingQueueGridClasses()}
        />
      )}
    </Container>
  );
};

export default WaitingSection;
