import React from 'react';
import './index.scss';
import { ParentMessageStateTypes, ThreadListStateTypes } from '../../types';
import { SendableMessageType } from '../../../../utils';
export interface ThreadUIProps {
    renderHeader?: () => React.ReactElement;
    renderParentMessageInfo?: () => React.ReactElement;
    renderMessage?: (props: {
        message: SendableMessageType;
        chainTop: boolean;
        chainBottom: boolean;
        hasSeparator: boolean;
    }) => React.ReactElement;
    renderFileUploadIcon?: () => React.ReactElement;
    renderVoiceMessageIcon?: () => React.ReactElement;
    renderSendMessageIcon?: () => React.ReactElement;
    renderMessageInput?: () => React.ReactElement;
    renderCustomSeparator?: () => React.ReactElement;
    renderParentMessageInfoPlaceholder?: (type: ParentMessageStateTypes) => React.ReactElement;
    renderThreadListPlaceHolder?: (type: ThreadListStateTypes) => React.ReactElement;
}
declare const ThreadUI: React.FC<ThreadUIProps>;
export default ThreadUI;
