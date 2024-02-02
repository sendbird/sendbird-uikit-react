import React from 'react';

import type { GroupChannelHeaderProps } from '../GroupChannelHeader';
import type { MessageListProps } from '../../../Channel/components/MessageList';
import type { GroupChannelMessageListProps } from '../MessageList';
import { RenderCustomSeparatorProps, RenderMessageParamsType } from '../../../../types';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import { GroupChannelUIView } from './GroupChannelUIView';
import type { MessageContentProps } from '../../../../ui/MessageContent';
import { MessageInputWrapperProps } from '../MessageInputWrapper';
import {useIIFE} from '@sendbird/uikit-tools';
import {getSuggestedReplies, isSendableMessage} from '../../../../utils';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import MessageInputWrapper from '../../../Channel/components/MessageInputWrapper';

export interface GroupChannelUIProps {
  renderPlaceholderLoader?: () => React.ReactElement;
  renderPlaceholderInvalid?: () => React.ReactElement;
  renderPlaceholderEmpty?: () => React.ReactElement;
  renderChannelHeader?: (props: GroupChannelHeaderProps) => React.ReactElement;
  renderMessage?: (props: RenderMessageParamsType) => React.ReactElement;
  renderMessageContent?: (props: MessageContentProps) => React.ReactElement;
  renderMessageList?: (props: MessageListProps | GroupChannelMessageListProps) => React.ReactElement;
  renderMessageInput?: () => React.ReactElement;
  renderFileUploadIcon?: () => React.ReactElement;
  renderVoiceMessageIcon?: () => React.ReactElement;
  renderSendMessageIcon?: () => React.ReactElement;
  renderTypingIndicator?: () => React.ReactElement;
  renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
  renderFrozenNotification?: () => React.ReactElement;
}

const GroupChannelUI = (props: GroupChannelUIProps) => {
  const { config } = useSendbirdStateContext();
  const context = useGroupChannelContext();
  const {
    currentChannel,
    channelUrl,
    loading,
    messages,
  } = context;

  const lastMessage = messages[messages.length - 1];
  const isLastMessageSuggestedRepliesEnabled = useIIFE(() => {
    if (!config?.groupChannel?.enableSuggestedReplies) return false;
    if (getSuggestedReplies(lastMessage).length === 0) return false;
    if (lastMessage && isSendableMessage(lastMessage) && lastMessage.sendingStatus !== 'succeeded') return false;

    return true;
  });
  const disableMessageInput = isLastMessageSuggestedRepliesEnabled
    && !!lastMessage.extendedMessagePayload?.['disable_chat_input'];

  return (
    <GroupChannelUIView
      {...props}
      {...context}
      requestedChannelUrl={channelUrl}
      loading={loading}
      isInvalid={channelUrl && !currentChannel}
      renderMessageInput={() => (
        props.renderMessageInput?.()
        ?? <MessageInputWrapper {...props} disabled={disableMessageInput} />
      )}
    />
  );
};

export default GroupChannelUI;
