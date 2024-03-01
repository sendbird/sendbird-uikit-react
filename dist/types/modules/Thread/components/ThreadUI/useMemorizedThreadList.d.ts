import React, { ReactElement } from 'react';
import { ThreadListStateTypes } from '../../types';
export interface UseMemorizedThreadListProps {
    threadListState: ThreadListStateTypes;
    renderThreadListPlaceHolder?: (tyep: ThreadListStateTypes) => React.ReactElement;
}
declare const useMemorizedThreadList: ({ threadListState, renderThreadListPlaceHolder, }: UseMemorizedThreadListProps) => ReactElement;
export default useMemorizedThreadList;
