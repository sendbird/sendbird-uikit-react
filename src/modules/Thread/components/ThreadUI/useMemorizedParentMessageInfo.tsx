import React, { ReactElement, useMemo } from 'react';

import { ParentMessageStateTypes } from '../../types';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import {SendableMessageType} from "../../../../utils";

export interface UseMemorizedParentMessageInfoProps {
  parentMessage: SendableMessageType;
  parentMessageState: ParentMessageStateTypes;
  renderParentMessageInfo?: () => React.ReactElement;
  renderParentMessageInfoPlaceholder?: (type: ParentMessageStateTypes) => React.ReactElement;
}

const useMemorizedParentMessageInfo = ({
  parentMessage,
  parentMessageState,
  renderParentMessageInfo,
  renderParentMessageInfoPlaceholder,
}: UseMemorizedParentMessageInfoProps): ReactElement => useMemo(() => {
  if (parentMessageState === ParentMessageStateTypes.NIL
    || parentMessageState === ParentMessageStateTypes.LOADING
    || parentMessageState === ParentMessageStateTypes.INVALID
  ) {
    if (typeof renderParentMessageInfoPlaceholder === 'function') {
      return renderParentMessageInfoPlaceholder(parentMessageState);
    }
    switch (parentMessageState) {
      case ParentMessageStateTypes.NIL: {
        return (
          <PlaceHolder
            className="sendbird-thread-ui__parent-message-info placeholder-nil"
            type={PlaceHolderTypes.NO_RESULTS}
            iconSize="64px"
          />
        );
      }
      case ParentMessageStateTypes.LOADING: {
        return (
          <PlaceHolder
            className="sendbird-thread-ui__parent-message-info placeholder-loading"
            type={PlaceHolderTypes.LOADING}
            iconSize="64px"
          />
        );
      }
      case ParentMessageStateTypes.INVALID: {
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
  } else if (parentMessageState === ParentMessageStateTypes.INITIALIZED) {
    if (typeof renderParentMessageInfo === 'function') {
      return renderParentMessageInfo();
    }
  }
  return null;
}, [
  parentMessage,
  parentMessageState,
  renderParentMessageInfo,
  renderParentMessageInfoPlaceholder,
]);

export default useMemorizedParentMessageInfo;
