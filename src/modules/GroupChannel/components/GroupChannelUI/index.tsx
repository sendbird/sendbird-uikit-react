import React from 'react';

import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import { RenderCustomSeparatorProps, RenderMessageProps } from '../../../../types';
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
  const {
    currentChannel,
    channelUrl,
    loading,
  } = useGroupChannelContext();

  return (
    <GroupChannelUIView
      {...props}
      requestedChannelUrl={channelUrl}
      loading={loading}
      isInvalid={channelUrl && !currentChannel}
    />
  );
};

export default GroupChannelUI;
