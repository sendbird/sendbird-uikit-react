import React from 'react';
import MessageInputWrapperView from './MessageInputWrapperView';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import { useIIFE } from '@sendbird/uikit-tools';
import { getSuggestedReplies, isSendableMessage } from '../../../../utils';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { GroupChannelUIBasicProps } from '../GroupChannelUI/GroupChannelUIView';

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
  const context = useGroupChannelContext();
  const {
    messages,
    currentChannel,
  } = context;
  const lastMessage = currentChannel?.lastMessage;
  const isLastMessageSuggestedRepliesEnabled = useIIFE(() => {
    if (!config?.groupChannel?.enableSuggestedReplies) return false;
    if (getSuggestedReplies(lastMessage ?? undefined).length === 0) return false;
    const lastMessageInContext = messages[messages.length - 1];
    if (isSendableMessage(lastMessageInContext) && lastMessageInContext.sendingStatus !== 'succeeded') return false;

    return true;
  });
  const disableMessageInput = props.disabled
    || isLastMessageSuggestedRepliesEnabled && !!lastMessage?.extendedMessagePayload?.['disable_chat_input'];

  return (
    <MessageInputWrapperView
      {...props}
      {...context}
      disabled={disableMessageInput}
    />
  );
};

export {
  VoiceMessageInputWrapper,
  VoiceMessageInputWrapperProps,
} from './VoiceMessageInputWrapper';

export default MessageInputWrapper;
