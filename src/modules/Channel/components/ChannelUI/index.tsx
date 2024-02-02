import React from 'react';

import type { MessageContentProps } from '../../../../ui/MessageContent';
import type { GroupChannelHeaderProps } from '../../../GroupChannel/components/GroupChannelHeader';
import type { RenderCustomSeparatorProps } from '../../../../types';
import { RenderMessageParamsType } from '../../../../types';
import { useChannelContext } from '../../context/ChannelProvider';
import { GroupChannelUIView } from '../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';
import ChannelHeader from '../ChannelHeader';
import MessageList from '../MessageList';
import MessageInputWrapper from '../MessageInputWrapper';
import { getSuggestedReplies } from '../../../../utils';
import type { UserMessage } from '@sendbird/chat/message';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

export interface ChannelUIProps {
  isLoading?: boolean;
  renderPlaceholderLoader?: () => React.ReactElement;
  renderPlaceholderInvalid?: () => React.ReactElement;
  renderPlaceholderEmpty?: () => React.ReactElement;
  renderChannelHeader?: (props: GroupChannelHeaderProps) => React.ReactElement;
  renderMessage?: (props: RenderMessageParamsType) => React.ReactElement;
  renderMessageContent?: (props: MessageContentProps) => React.ReactElement;
  renderMessageInput?: () => React.ReactElement;
  renderFileUploadIcon?: () => React.ReactElement;
  renderVoiceMessageIcon?: () => React.ReactElement;
  renderSendMessageIcon?: () => React.ReactElement;
  renderTypingIndicator?: () => React.ReactElement;
  renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
  renderFrozenNotification?: () => React.ReactElement;
}

const ChannelUI = (props: ChannelUIProps) => {
  const { config } = useSendbirdStateContext();
  const context = useChannelContext();
  const {
    channelUrl,
    isInvalid,
    loading,
    localMessages,
    currentGroupChannel,
  } = context;

  const lastMessage = currentGroupChannel?.lastMessage;
  const isLastMessageSuggestedRepliesEnabled = config?.groupChannel?.enableSuggestedReplies
    && lastMessage
    && getSuggestedReplies(lastMessage).length > 0
    && (
      !localMessages
      || localMessages.length === 0
      || localMessages.every((message) => (message as UserMessage).sendingStatus === 'succeeded')
    );
  const disableMessageInput = isLastMessageSuggestedRepliesEnabled
    && !!lastMessage.extendedMessagePayload?.['disable_chat_input'];

  return (
    <GroupChannelUIView
      {...props}
      {...context}
      requestedChannelUrl={channelUrl}
      loading={props?.isLoading ?? loading}
      isInvalid={isInvalid}
      renderChannelHeader={(props) => (<ChannelHeader {...props} />)}
      renderMessageList={(props) => (<MessageList {...props} />)}
      renderMessageInput={() => (
        props.renderMessageInput?.()
        ?? <MessageInputWrapper {...props} disabled={disableMessageInput} />
      )}
    />
  );
};

export default ChannelUI;
