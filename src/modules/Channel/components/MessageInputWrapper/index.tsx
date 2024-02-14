import React from 'react';

import { getSuggestedReplies } from '../../../../utils';
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
      {...context}
      disabled={disableMessageInput}
      currentChannel={currentGroupChannel}
      quoteMessage={context.quoteMessage}
      sendUserMessage={(params) => {
        return sendMessage({
          message: params.message,
          mentionTemplate: params.mentionedMessageTemplate,
          mentionedUsers: params.mentionedUsers,
          quoteMessage: context.quoteMessage,
        });
      }}
      sendFileMessage={(params) => {
        return sendFileMessage(params.file as File, context.quoteMessage);
      }}
      sendVoiceMessage={({ file }, duration) => {
        return sendVoiceMessage(file as File, duration, context.quoteMessage);
      }}
      sendMultipleFilesMessage={({ fileInfoList }) => {
        return sendMultipleFilesMessage(fileInfoList.map((fileInfo) => fileInfo.file) as File[], context.quoteMessage);
      }}
    />
  );
};

export default MessageInputWrapper;
