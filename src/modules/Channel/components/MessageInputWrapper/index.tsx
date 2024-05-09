import React from 'react';

import { getSuggestedReplies } from '../../../../utils';
import MessageInputWrapperView from '../../../GroupChannel/components/MessageInputWrapper/MessageInputWrapperView';
import { useChannelContext } from '../../context/ChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { GroupChannelUIBasicProps } from '../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';

export interface MessageInputWrapperProps {
  value?: string;
  disabled?: boolean;
  acceptableMimeTypes?: string[];
  renderFileUploadIcon?: GroupChannelUIBasicProps['renderFileUploadIcon'];
  renderVoiceMessageIcon?: GroupChannelUIBasicProps['renderVoiceMessageIcon'];
  renderSendMessageIcon?: GroupChannelUIBasicProps['renderSendMessageIcon'];
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
    || isLastMessageSuggestedRepliesEnabled && !!lastMessage?.extendedMessagePayload?.['disable_chat_input'];

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
          quoteMessage: quoteMessage ?? undefined,
        });
      }}
      sendFileMessage={(params) => {
        return sendFileMessage(params.file as File, quoteMessage ?? undefined);
      }}
      sendVoiceMessage={({ file }, duration) => {
        return sendVoiceMessage(file as File, duration, quoteMessage ?? undefined);
      }}
      sendMultipleFilesMessage={({ fileInfoList }) => {
        return sendMultipleFilesMessage(fileInfoList.map((fileInfo) => fileInfo.file) as File[], quoteMessage ?? undefined);
      }}
    />
  );
};

export default MessageInputWrapper;
