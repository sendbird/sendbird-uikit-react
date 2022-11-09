import React, { useMemo } from 'react';

import { ParentMessageInfoStateTypes } from '../../types';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';

export interface UseMemorizedParentMessageInfoProps {
  parentMessageInfoStatus: ParentMessageInfoStateTypes;
  renderParentMessageInfo?: () => React.ReactElement;
  renderParentMessageInfoPlaceholder?: (type: ParentMessageInfoStateTypes) => React.ReactElement;
}

const useMemorizedParentMessageInfo = ({
  parentMessageInfoStatus,
  renderParentMessageInfo,
  renderParentMessageInfoPlaceholder,
}: UseMemorizedParentMessageInfoProps) => useMemo(() => {
  if (parentMessageInfoStatus === ParentMessageInfoStateTypes.NIL
    || parentMessageInfoStatus === ParentMessageInfoStateTypes.LOADING
    || parentMessageInfoStatus === ParentMessageInfoStateTypes.INVALID
  ) {
    if (typeof renderParentMessageInfoPlaceholder === 'function') {
      return renderParentMessageInfoPlaceholder(parentMessageInfoStatus);
    }
    switch (parentMessageInfoStatus) {
      case ParentMessageInfoStateTypes.NIL: {
        return (
          <PlaceHolder
            className="sendbird-thread-ui__parent-message-info placeholder-nil"
            type={PlaceHolderTypes.NO_RESULTS}
            iconSize="64px"
          />
        );
      }
      case ParentMessageInfoStateTypes.LOADING: {
        return (
          <PlaceHolder
            className="sendbird-thread-ui__parent-message-info placeholder-loading"
            type={PlaceHolderTypes.LOADING}
            iconSize="64px"
          />
        );
      }
      case ParentMessageInfoStateTypes.INVALID: {
        return (
          <PlaceHolder
            className="sendbird-thread-ui__parent-message-info placeholder-invalid"
            type={PlaceHolderTypes.WRONG}
            iconSize="64px"
          />
        );
      }
      default: {
        return null;
      }
    }
  } else if (parentMessageInfoStatus === ParentMessageInfoStateTypes.INITIALIZED) {
    if (typeof renderParentMessageInfo === 'function') {
      return renderParentMessageInfo();
    }
  }
  return null;
}, [
  parentMessageInfoStatus,
  renderParentMessageInfo,
  renderParentMessageInfoPlaceholder,
]);

export default useMemorizedParentMessageInfo;
