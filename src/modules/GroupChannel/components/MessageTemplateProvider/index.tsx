import React from 'react';
import { BaseMessage } from '@sendbird/chat/message';
import MessageTemplate, { MessageTemplateProps } from '../../../../ui/MessageTemplate';
import { MessageProvider } from '@sendbird/react-uikit-message-template-view';

export interface MessageTemplateProviderProps extends MessageTemplateProps {
  message: BaseMessage;
}

export const MessageTemplateProvider = ({ message, templateItems }: MessageTemplateProviderProps) => {
  return <MessageProvider message={message}>
    <MessageTemplate templateItems={templateItems} />
  </MessageProvider>;
};

export default MessageTemplateProvider;
