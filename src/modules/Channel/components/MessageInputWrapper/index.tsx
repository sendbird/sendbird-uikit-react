import React from 'react';
import type { FileMessageCreateParams } from '@sendbird/chat/message';

import type { SendableMessageType } from '../../../../utils';
import MessageInputWrapperView from '../../../GroupChannel/components/MessageInputWrapper/MessageInputWrapperView';
import { useChannelContext } from '../../context/ChannelProvider';

export interface MessageInputWrapperProps {
  value?: string;
  disabled?: boolean;
  renderFileUploadIcon?: () => React.ReactElement;
  renderVoiceMessageIcon?: () => React.ReactElement;
  renderSendMessageIcon?: () => React.ReactElement;
  acceptableMimeTypes?: string[];
}

export const MessageInputWrapper = (props: MessageInputWrapperProps) => {
  const context = useChannelContext();
  const {
    currentGroupChannel,
    sendMessage,
    sendFileMessage,
    sendVoiceMessage,
    sendMultipleFilesMessage,
  } = context;

  return (
    <MessageInputWrapperView
      {...props}
      {...context}
      currentChannel={currentGroupChannel}
      quoteMessage={context.quoteMessage}
      sendUserMessage={(params) => (
        sendMessage({ ...params, quoteMessage: { messageId: params.parentMessageId } as SendableMessageType })
      )}
      sendFileMessage={(params: FileMessageCreateParams) => (
        sendFileMessage(params.file as File, { messageId: params.parentMessageId } as SendableMessageType)
      )}
      sendVoiceMessage={({ file, parentMessageId }: FileMessageCreateParams, duration: number) => (
        sendVoiceMessage(file as File, duration, { parentMessageId } as SendableMessageType)
      )}
      sendMultipleFilesMessage={({ fileInfoList, parentMessageId }) => (
        sendMultipleFilesMessage(fileInfoList.map((fileInfo) => fileInfo.file) as File[], { parentMessageId } as SendableMessageType)
      )}
    />
  );
};

export default MessageInputWrapper;
