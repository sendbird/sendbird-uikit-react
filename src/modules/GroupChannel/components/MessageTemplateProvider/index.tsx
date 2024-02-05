import React from 'react';
import { mockBaseMessage } from '../../../../ui/MessageTemplate/messageTemplateDummyData.mock';
import { BaseMessage } from '@sendbird/chat/message';
import MessageTemplate, { MessageTemplateProps } from '../../../../ui/MessageTemplate';
import { MessageProvider } from '@sendbird/react-uikit-message-template-view';

export interface MessageTemplateProviderProps extends MessageTemplateProps {}

export const MessageTemplateProvider = ({ templateItems }: MessageTemplateProviderProps) => {
  return <MessageProvider message={mockBaseMessage as unknown as BaseMessage}>
    <MessageTemplate templateItems={templateItems} />
  </MessageProvider>;
};

export default MessageTemplateProvider;
