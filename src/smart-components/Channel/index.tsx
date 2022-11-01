import React from 'react';

import {
  ChannelProvider,
  ChannelContextProps,
} from './context/ChannelProvider';

import ChannelUI, { ChannelUIProps } from './components/ChannelUI';
export interface ChannelProps extends ChannelContextProps, ChannelUIProps {
}

const Channel: React.FC<ChannelProps> = (props: ChannelProps) => {
  return (
    <ChannelProvider
      channelUrl={props?.channelUrl}
      isReactionEnabled={props?.isReactionEnabled}
      isMessageGroupingEnabled={props?.isMessageGroupingEnabled}
      showSearchIcon={props?.showSearchIcon}
      highlightedMessage={props?.highlightedMessage}
      startingPoint={props?.startingPoint}
      onBeforeSendUserMessage={props?.onBeforeSendUserMessage}
      onBeforeSendFileMessage={props?.onBeforeSendFileMessage}
      onBeforeUpdateUserMessage={props?.onBeforeUpdateUserMessage}
      onChatHeaderActionClick={props?.onChatHeaderActionClick}
      onSearchClick={props?.onSearchClick}
      onBackClick={props?.onBackClick}
      replyType={props?.replyType}
      queries={props?.queries}
      renderUserProfile={props?.renderUserProfile}
      disableUserProfile={props?.disableUserProfile}
      disableMarkAsRead={props?.disableMarkAsRead}
    >
      <ChannelUI
        isLoading={props?.isLoading}
        renderPlaceholderLoader={props?.renderPlaceholderLoader}
        renderPlaceholderInvalid={props?.renderPlaceholderInvalid}
        renderPlaceholderEmpty={props?.renderPlaceholderEmpty}
        renderChannelHeader={props?.renderChannelHeader}
        renderMessage={props?.renderMessage}
        renderMessageInput={props?.renderMessageInput}
        renderTypingIndicator={props?.renderTypingIndicator}
        renderCustomSeparator={props?.renderCustomSeparator}
      />
    </ChannelProvider>
  );
};

export default Channel;
