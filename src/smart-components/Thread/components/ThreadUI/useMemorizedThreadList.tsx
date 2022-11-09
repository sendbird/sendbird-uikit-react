import React, { useMemo } from 'react';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';

import { ThreadListStateTypes } from '../../types';

export interface UseMemorizedThreadListProps {
  threadListStatus: ThreadListStateTypes;
  renderThreadListPlaceHolder?: (tyep: ThreadListStateTypes) => React.ReactElement;
}

const useMemorizedThreadList = ({
  threadListStatus,
  renderThreadListPlaceHolder,
}: UseMemorizedThreadListProps) => useMemo(() => {
  if (threadListStatus === ThreadListStateTypes.NIL
    || threadListStatus === ThreadListStateTypes.LOADING
    || threadListStatus === ThreadListStateTypes.INVALID
  ) {
    if (typeof renderThreadListPlaceHolder === 'function') {
      return renderThreadListPlaceHolder(threadListStatus);
    }
    switch (threadListStatus) {
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
  threadListStatus,
  renderThreadListPlaceHolder,
]);

export default useMemorizedThreadList;
