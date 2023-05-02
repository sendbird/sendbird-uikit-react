import React, { ReactElement, useMemo } from 'react';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';

import { ThreadListStateTypes } from '../../types';

export interface UseMemorizedThreadListProps {
  threadListState: ThreadListStateTypes;
  renderThreadListPlaceHolder?: (tyep: ThreadListStateTypes) => React.ReactElement;
}

const useMemorizedThreadList = ({
  threadListState,
  renderThreadListPlaceHolder,
}: UseMemorizedThreadListProps): ReactElement => useMemo(() => {
  if (threadListState === ThreadListStateTypes.NIL
    || threadListState === ThreadListStateTypes.LOADING
    || threadListState === ThreadListStateTypes.INVALID
  ) {
    if (typeof renderThreadListPlaceHolder === 'function') {
      return renderThreadListPlaceHolder(threadListState);
    }
    switch (threadListState) {
      case ThreadListStateTypes.LOADING: {
        return (
          <PlaceHolder
            className="sendbird-thread-ui__thread-list placeholder-loading"
            type={PlaceHolderTypes.LOADING}
            iconSize="64px"
          />
        );
      }
      case ThreadListStateTypes.INVALID: {
        return (
          <PlaceHolder
            className="sendbird-thread-ui__thread-list placeholder-invalid"
            type={PlaceHolderTypes.WRONG}
            iconSize="64px"
          />
        );
      }
      case ThreadListStateTypes.NIL: {
        return <></>;
      }
      default: {
        return null;
      }
    }
  }
  return null;
}, [
  threadListState,
  renderThreadListPlaceHolder,
]);

export default useMemorizedThreadList;
