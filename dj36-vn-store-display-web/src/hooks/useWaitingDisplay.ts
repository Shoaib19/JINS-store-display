import { use } from 'react'
import { WebSocketContext } from '../context/WebSocketContext';
import { LOCAL_DISPLAY } from '../constants/localeDisplay';

const useWaitingDisplay = () => {
    const {data, calledList, waitingList } = use(WebSocketContext);
    // handle region based content 
    const { eyeExamWaitTime: heading, eyeExamWaitTime_eyeExam, eyeExamWaitTime_wait, eyeExamWaitTime_time } = LOCAL_DISPLAY;

    const {earliest, latest} = data?.waitTimeRange ?? {earliest: '', latest: ''};
    // conditional variables
    const hasCalled = calledList.length > 0;
    const hasWaiting = waitingList.length > 0;
    const hasEarliest = earliest || earliest === 0;
    const hasCalledAndWaiting = hasCalled && hasWaiting;
    const hasCalledLongList = calledList.length > 5;
    const noWaitingWithCalledLongList = !hasWaiting && hasCalledLongList;
    const waitingWithCalledLongList = hasWaiting && hasCalledLongList;
    // functions based on the conditions
    const hasBothOrOnlyOneWithLongList = () => hasCalledAndWaiting || noWaitingWithCalledLongList;
    const hasBothOrLongList = () => hasCalledAndWaiting || hasCalledLongList;
    const longListWithCalledOrWaiting = () => waitingWithCalledLongList;
    const shouldUseSmallGap = () => hasCalledAndWaiting || longListWithCalledOrWaiting();
    const subheadings = [eyeExamWaitTime_eyeExam, eyeExamWaitTime_wait, eyeExamWaitTime_time];
    const getPadding = () => {
        if((longListWithCalledOrWaiting() && hasEarliest) || (noWaitingWithCalledLongList ||   hasWaiting && (hasCalled && calledList.length < 5))) {
            return "pb-[72px]"
        }else if ((!hasCalled && !hasWaiting) || ( (!hasWaiting && !hasCalledLongList) || (hasWaiting && !hasCalled) )) {
            return "pb-[24px]"
        }

        return ''
    }


    return {hasEarliest, hasBothOrOnlyOneWithLongList, shouldUseSmallGap, longListWithCalledOrWaiting, hasBothOrLongList, heading, subheadings, earliest, latest, getPadding}
}

export default useWaitingDisplay