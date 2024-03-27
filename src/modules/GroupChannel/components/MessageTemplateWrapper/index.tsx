import React, { ReactElement } from 'react';
import { BaseMessage } from '@sendbird/chat/message';
import MessageTemplate, { MessageTemplateProps } from '../../../../ui/MessageTemplate';
import { MessageProvider as MessageTemplateProvider } from '@sendbird/react-uikit-message-template-view';

export interface MessageTemplateWrapperProps extends MessageTemplateProps {
  message: BaseMessage;
}

export const MessageTemplateWrapper = ({
  message,
  templateVersion,
  templateItems,
}: MessageTemplateWrapperProps): ReactElement => {
  return <MessageTemplateProvider message={message}>
    <MessageTemplate templateVersion={templateVersion} templateItems={templateItems} />
  </MessageTemplateProvider>;
};

export default MessageTemplateWrapper;
