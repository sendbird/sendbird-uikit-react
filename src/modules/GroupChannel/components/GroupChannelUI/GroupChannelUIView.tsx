import './index.scss';
import React from 'react';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

import TypingIndicator from '../TypingIndicator';
import { TypingIndicatorType } from '../../../../types';
import ConnectionStatus from '../../../../ui/ConnectionStatus';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';

import type { RenderCustomSeparatorProps, RenderMessageParamsType } from '../../../../types';
import type { GroupChannelHeaderProps } from '../GroupChannelHeader';
import type { GroupChannelMessageListProps } from '../MessageList';
import type { MessageContentProps } from '../../../../ui/MessageContent';

export interface GroupChannelUIBasicProps {
  // Components
  renderPlaceholderLoader?: () => React.ReactElement;
  renderPlaceholderInvalid?: () => React.ReactElement;
  renderPlaceholderEmpty?: () => React.ReactElement;
  renderChannelHeader?: (props: GroupChannelHeaderProps) => React.ReactElement;
  renderMessageList?: (props: GroupChannelMessageListProps) => React.ReactElement;
  renderMessageInput?: () => React.ReactElement;

  // Sub components
  //  MessageList
  renderMessage?: (props: RenderMessageParamsType) => React.ReactElement;
  renderMessageContent?: (props: MessageContentProps) => React.ReactElement;
  renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
  renderFrozenNotification?: () => React.ReactElement;

  //  MessageInput
  renderFileUploadIcon?: () => React.ReactElement;
  renderVoiceMessageIcon?: () => React.ReactElement;
  renderSendMessageIcon?: () => React.ReactElement;
  renderTypingIndicator?: () => React.ReactElement;
}

export interface GroupChannelUIViewProps extends GroupChannelUIBasicProps {
  isLoading?: boolean;
  isInvalid: boolean;
  channelUrl: string;
  renderChannelHeader: GroupChannelUIBasicProps['renderChannelHeader'];
  renderMessageList: GroupChannelUIBasicProps['renderMessageList'];
  renderMessageInput: GroupChannelUIBasicProps['renderMessageInput'];
}

export const GroupChannelUIView = (props: GroupChannelUIViewProps) => {
  const {
    isLoading,
    isInvalid,
    channelUrl,
    renderChannelHeader,
    renderMessageList,
    renderMessageInput,
    renderTypingIndicator,
    renderPlaceholderLoader,
    renderPlaceholderInvalid,
  } = props;

  const { stores, config } = useSendbirdStateContext();
  const sdkError = stores?.sdkStore?.error;
  const { logger, isOnline } = config;

  // Note: This is not a loading status of the message list.
  //  It is just for custom props from the Channel module and is not used in the GroupChannel module. (We should remove this in v4)
  if (isLoading) {
    return <div className="sendbird-conversation">{renderPlaceholderLoader?.() || <PlaceHolder type={PlaceHolderTypes.LOADING} />}</div>;
  }

  if (!channelUrl) {
    return (
      <div className="sendbird-conversation">{renderPlaceholderInvalid?.() || <PlaceHolder type={PlaceHolderTypes.NO_CHANNELS} />}</div>
    );
  }

  if (isInvalid) {
    return <div className="sendbird-conversation">{renderPlaceholderInvalid?.() || <PlaceHolder type={PlaceHolderTypes.WRONG} />}</div>;
  }

  if (sdkError) {
    return (
      <div className="sendbird-conversation">
        {renderPlaceholderInvalid?.() || (
          <PlaceHolder
            type={PlaceHolderTypes.WRONG}
            retryToConnect={() => {
              logger.info('Channel: reconnecting');
              // reconnect();
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="sendbird-conversation">
      {renderChannelHeader?.({ className: 'sendbird-conversation__channel-header' })}
      {renderMessageList?.(props)}
      <div className="sendbird-conversation__footer">
        {renderMessageInput?.()}
        <div className="sendbird-conversation__footer__typing-indicator">
          {renderTypingIndicator?.()
            || (config?.groupChannel?.enableTypingIndicator && config?.groupChannel?.typingIndicatorTypes?.has(TypingIndicatorType.Text) && (
              <TypingIndicator channelUrl={channelUrl} />
            ))}
          {!isOnline && <ConnectionStatus />}
        </div>
      </div>
    </div>
  );
};
