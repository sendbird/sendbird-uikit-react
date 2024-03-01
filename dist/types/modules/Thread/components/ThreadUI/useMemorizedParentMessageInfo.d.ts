import React, { ReactElement } from 'react';
import { ParentMessageStateTypes } from '../../types';
import { SendableMessageType } from '../../../../utils';
export interface UseMemorizedParentMessageInfoProps {
    parentMessage: SendableMessageType;
    parentMessageState: ParentMessageStateTypes;
    renderParentMessageInfo?: () => React.ReactElement;
    renderParentMessageInfoPlaceholder?: (type: ParentMessageStateTypes) => React.ReactElement;
}
declare const useMemorizedParentMessageInfo: ({ parentMessage, parentMessageState, renderParentMessageInfo, renderParentMessageInfoPlaceholder, }: UseMemorizedParentMessageInfoProps) => ReactElement;
export default useMemorizedParentMessageInfo;
