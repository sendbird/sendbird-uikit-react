import React from 'react';

import type { GroupChannelHeaderProps } from '../../../GroupChannel/components/GroupChannelHeader';
import type { RenderCustomSeparatorProps, RenderMessageProps } from '../../../../types';
import { useChannelContext } from '../../context/ChannelProvider';
import { GroupChannelUIView } from '../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';
import ChannelHeader from '../ChannelHeader';
import MessageList from '../MessageList';
import MessageInputWrapper from '../MessageInputWrapper';

export interface ChannelUIProps {
  isLoading?: boolean;
  renderPlaceholderLoader?: () => React.ReactElement;
  renderPlaceholderInvalid?: () => React.ReactElement;
  renderPlaceholderEmpty?: () => React.ReactElement;
  renderChannelHeader?: (props: GroupChannelHeaderProps) => React.ReactElement;
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
    channelUrl,
    isInvalid,
    initialized,
  } = context;

  return (
    <GroupChannelUIView
      {...props}
      {...context}
      requestedChannelUrl={channelUrl}
      loading={props?.isLoading ?? !initialized}
      isInvalid={isInvalid}
      renderChannelHeader={(props) => (<ChannelHeader {...props} />)}
      renderMessageList={(props) => (<MessageList {...props} />)}
      renderMessageInput={() => (<MessageInputWrapper {...props} />)}
    />
  );
};

export default ChannelUI;
