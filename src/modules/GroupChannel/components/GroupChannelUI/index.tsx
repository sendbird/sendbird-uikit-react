import React from 'react';

import type { RenderCustomSeparatorProps, RenderMessageProps } from '../../../../types';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import { GroupChannelUIView } from './GroupChannelUIView';

export interface GroupChannelUIProps {
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

const GroupChannelUI: React.FC<GroupChannelUIProps> = (props: GroupChannelUIProps) => {
  const context = useGroupChannelContext();
  const {
    currentChannel,
    channelUrl,
    loading,
  } = context;

  return (
    <GroupChannelUIView
      {...props}
      {...context}
      requestedChannelUrl={channelUrl}
      loading={loading}
      isInvalid={channelUrl && !currentChannel}
    />
  );
};

export default GroupChannelUI;
