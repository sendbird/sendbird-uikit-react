import React from 'react';
import { BaseMessage } from '@sendbird/chat/message';
import MessageTemplate, { MessageTemplateProps } from '../../../../ui/MessageTemplate';
import { MessageProvider } from '@sendbird/react-uikit-message-template-view';

export interface MessageTemplateWrapperProps extends MessageTemplateProps {
  message: BaseMessage;
}

export const MessageTemplateWrapper = ({ message, templateItems }: MessageTemplateWrapperProps) => {
  return <MessageProvider message={message}>
    <MessageTemplate templateItems={templateItems} />
  </MessageProvider>;
};

export default MessageTemplateWrapper;
