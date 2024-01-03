import React from 'react';

import { useChannelContext } from '../../context/ChannelProvider';
import { RenderCustomSeparatorProps, RenderMessageProps } from '../../../../types';
import { GroupChannelUIView } from '../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';

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

const ChannelUI: React.FC<ChannelUIProps> = (props: ChannelUIProps) => {
  const context = useChannelContext();
  const {
    channelUrl,
    isInvalid,
    initialized,
  } = context;

  return (
    <GroupChannelUIView
      {...props}
      {...context}
      requestedChannelUrl={channelUrl}
      isInvalid={isInvalid}
      loading={props?.isLoading ?? !initialized}
    />
  );
};

export default ChannelUI;
