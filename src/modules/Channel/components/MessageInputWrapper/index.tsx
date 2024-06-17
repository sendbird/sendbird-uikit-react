import React from 'react';
import MessageInputWrapperView from '../../../GroupChannel/components/MessageInputWrapper/MessageInputWrapperView';
import { useChannelContext } from '../../context/ChannelProvider';
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
  const context = useChannelContext();
  const { quoteMessage, currentGroupChannel, sendMessage, sendFileMessage, sendVoiceMessage, sendMultipleFilesMessage } = context;

  return (
    <MessageInputWrapperView
      {...props}
      {...context}
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
