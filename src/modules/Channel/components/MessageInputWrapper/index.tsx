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
    quoteMessage,
    localMessages,
    currentGroupChannel,
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
      sendUserMessage={(params) => {
        return sendMessage({
          message: params.message,
          mentionTemplate: params.mentionedMessageTemplate,
          mentionedUsers: params.mentionedUsers,
          quoteMessage,
        });
      }}
      sendFileMessage={(params) => {
        return sendFileMessage(params.file as File, quoteMessage);
      }}
      sendVoiceMessage={({ file }, duration) => {
        return sendVoiceMessage(file as File, duration, quoteMessage);
      }}
      sendMultipleFilesMessage={({ fileInfoList }) => {
        return sendMultipleFilesMessage(fileInfoList.map((fileInfo) => fileInfo.file) as File[], quoteMessage);
      }}
    />
  );
};

export default MessageInputWrapper;
