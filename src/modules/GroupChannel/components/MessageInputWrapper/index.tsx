import React from 'react';
import MessageInputWrapperView from './MessageInputWrapperView';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';

export interface MessageInputWrapperProps {
  value?: string;
  disabled?: boolean;
  renderFileUploadIcon?: () => React.ReactElement;
  renderVoiceMessageIcon?: () => React.ReactElement;
  renderSendMessageIcon?: () => React.ReactElement;
}

export const MessageInputWrapper = (props: MessageInputWrapperProps) => {
  const context = useGroupChannelContext();
  return (
    <MessageInputWrapperView
      {...props}
      {...context}
    />
  );
};

export default MessageInputWrapper;
