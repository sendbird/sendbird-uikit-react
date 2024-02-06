import React from 'react';
import MessageInputWrapperView from './MessageInputWrapperView';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import { useIIFE } from '@sendbird/uikit-tools';
import { getSuggestedReplies, isSendableMessage } from '../../../../utils';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

export interface MessageInputWrapperProps {
  value?: string;
  disabled?: boolean;
  renderFileUploadIcon?: () => React.ReactElement;
  renderVoiceMessageIcon?: () => React.ReactElement;
  renderSendMessageIcon?: () => React.ReactElement;
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
    if (getSuggestedReplies(lastMessage).length === 0) return false;
    const lastMessageInContext = messages[messages.length - 1];
    if (isSendableMessage(lastMessageInContext) && lastMessageInContext.sendingStatus !== 'succeeded') return false;

    return true;
  });
  const disableMessageInput = props.disabled
    || isLastMessageSuggestedRepliesEnabled && !!lastMessage.extendedMessagePayload?.['disable_chat_input'];

  return (
    <MessageInputWrapperView
      {...props}
      disabled={disableMessageInput}
      {...context}
    />
  );
};

export {
  VoiceMessageInputWrapper,
  VoiceMessageInputWrapperProps,
} from './VoiceMessageInputWrapper';

export default MessageInputWrapper;
