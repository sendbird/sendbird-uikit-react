import React from 'react';
import type { FileMessageCreateParams } from '@sendbird/chat/message';

import { getSuggestedReplies, SendableMessageType } from '../../../../utils';
import MessageInputWrapperView from '../../../GroupChannel/components/MessageInputWrapper/MessageInputWrapperView';
import { useChannelContext } from '../../context/ChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

export interface MessageInputWrapperProps {
  value?: string;
  disabled?: boolean;
  renderFileUploadIcon?: () => React.ReactElement;
  renderVoiceMessageIcon?: () => React.ReactElement;
  renderSendMessageIcon?: () => React.ReactElement;
  acceptableMimeTypes?: string[];
}

export const MessageInputWrapper = (props: MessageInputWrapperProps) => {
  const { config } = useSendbirdStateContext();
  const context = useChannelContext();
  const {
    currentGroupChannel,
    localMessages,
    sendMessage,
    sendFileMessage,
    sendVoiceMessage,
    sendMultipleFilesMessage,
  } = context;

  const lastMessage = currentGroupChannel?.lastMessage;
  const isLastMessageSuggestedRepliesEnabled = config?.groupChannel?.enableSuggestedReplies
    && getSuggestedReplies(lastMessage).length > 0
    && localMessages?.length === 0;
  const disableMessageInput = props.disabled
    || isLastMessageSuggestedRepliesEnabled && !!lastMessage.extendedMessagePayload?.['disable_chat_input'];

  return (
    <MessageInputWrapperView
      {...props}
      disabled={disableMessageInput}
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
