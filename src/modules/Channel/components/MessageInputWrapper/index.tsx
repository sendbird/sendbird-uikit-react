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

/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
export const MessageInputWrapper = (props: MessageInputWrapperProps) => {
  const context = useChannelContext();
  const { quoteMessage, currentGroupChannel, sendMessage, sendFileMessage, sendVoiceMessage, sendMultipleFilesMessage } = context;

  return (
    <MessageInputWrapperView
      {...props}
      {...context}
      currentChannel={currentGroupChannel}
      messages={context.allMessages}
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
