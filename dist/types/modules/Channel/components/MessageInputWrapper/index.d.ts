import React from 'react';
import { GroupChannelUIBasicProps } from '../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';
export interface MessageInputWrapperProps {
    value?: string;
    disabled?: boolean;
    acceptableMimeTypes?: string[];
    renderFileUploadIcon?: GroupChannelUIBasicProps['renderFileUploadIcon'];
    renderVoiceMessageIcon?: GroupChannelUIBasicProps['renderVoiceMessageIcon'];
    renderSendMessageIcon?: GroupChannelUIBasicProps['renderSendMessageIcon'];
}
export declare const MessageInputWrapper: (props: MessageInputWrapperProps) => React.JSX.Element;
export default MessageInputWrapper;
