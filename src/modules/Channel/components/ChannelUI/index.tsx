import React from 'react';

import { useChannelContext } from '../../context/ChannelProvider';
import { RenderCustomSeparatorProps, RenderMessageProps } from '../../../../types';
import { GroupChannelUIView } from '../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';
import MessageList from '../MessageList';

export interface ChannelUIProps {
  isLoading?: boolean;
  renderPlaceholderLoader?: () => React.ReactElement;
  renderPlaceholderInvalid?: () => React.ReactElement;
  renderPlaceholderEmpty?: () => React.ReactElement;
  renderChannelHeader?: () => React.ReactElement;
  renderMessage?: (props: RenderMessageProps) => React.ReactElement;
  renderMessageInput?: () => React.ReactElement;
  renderFileUploadIcon?: () => React.ReactElement;
  renderVoiceMessageIcon?: () => React.ReactElement;
  renderSendMessageIcon?: () => React.ReactElement;
  renderTypingIndicator?: () => React.ReactElement;
  renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
  renderFrozenNotification?: () => React.ReactElement;
}

const ChannelUI = (props: ChannelUIProps) => {
  const context = useChannelContext();
  const {
    currentGroupChannel,
    channelUrl,
    isInvalid,
    initialized,
    sendMessage,
  } = context;

  return (
    <GroupChannelUIView
      {...props}
      {...context}
      requestedChannelUrl={channelUrl}
      loading={props?.isLoading ?? !initialized}
      isInvalid={isInvalid}
      currentChannel={currentGroupChannel}
      sendUserMessage={sendMessage}
      renderMessageList={(props) => (<MessageList {...props} />)}
    />
  );
};

export default ChannelUI;
