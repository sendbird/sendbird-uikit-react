import './channel-ui.scss';

import React from 'react';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

import { useChannelContext } from '../../context/ChannelProvider';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import ConnectionStatus from '../../../../ui/ConnectionStatus';
import ChannelHeader from '../ChannelHeader';
import MessageList from '../MessageList';
import TypingIndicator from '../TypingIndicator';
import MessageInputWrapper from '../MessageInput';
import { RenderCustomSeparatorProps, RenderMessageProps } from '../../../../types';

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
}

const ChannelUI: React.FC<ChannelUIProps> = ({
  isLoading,
  renderPlaceholderLoader,
  renderPlaceholderInvalid,
  renderPlaceholderEmpty,
  renderChannelHeader,
  renderMessage,
  renderMessageInput,
  renderTypingIndicator,
  renderCustomSeparator,
  renderFileUploadIcon,
  renderVoiceMessageIcon,
  renderSendMessageIcon,
}: ChannelUIProps) => {
  const {
    channelUrl,
    isInvalid,
  } = useChannelContext();

  const globalStore = useSendbirdStateContext();
  const sdkError = globalStore?.stores?.sdkStore?.error;
  const logger = globalStore?.config?.logger;
  const isOnline = globalStore?.config?.isOnline;

  if (isLoading) {
    return (<div className="sendbird-conversation">
      {
        renderPlaceholderLoader?.() || (
          <PlaceHolder type={PlaceHolderTypes.LOADING} />
        )
      }
    </div>);
  }

  if (!channelUrl) {
    return (<div className="sendbird-conversation">
      {
        renderPlaceholderInvalid?.() || (
          <PlaceHolder type={PlaceHolderTypes.NO_CHANNELS} />
        )
      }
    </div>);
  }
  if (isInvalid) {
    return (
      <div className="sendbird-conversation">
        {
          renderPlaceholderInvalid?.() || (
            <PlaceHolder type={PlaceHolderTypes.WRONG} />
          )
        }
      </div>
    );
  }
  if (sdkError) {
    return (
      <div className="sendbird-conversation">
        {
          renderPlaceholderInvalid?.() || (
            <PlaceHolder
              type={PlaceHolderTypes.WRONG}
              retryToConnect={() => {
                logger.info('Channel: reconnecting');
                // reconnect();
              }}
            />
          )
        }
      </div>
    );
  }
  return (
    <div className='sendbird-conversation'>
      {renderChannelHeader?.() || (
        <ChannelHeader className="sendbird-conversation__channel-header" />
      )}
      <MessageList
        className="sendbird-conversation__message-list"
        renderMessage={renderMessage}
        renderPlaceholderEmpty={renderPlaceholderEmpty}
        renderCustomSeparator={renderCustomSeparator}
        renderPlaceholderLoader={renderPlaceholderLoader}
      />
      <div className="sendbird-conversation__footer">
        {
          renderMessageInput?.() || (
            <MessageInputWrapper
              renderFileUploadIcon={renderFileUploadIcon}
              renderVoiceMessageIcon={renderVoiceMessageIcon}
              renderSendMessageIcon={renderSendMessageIcon}
            />
          )
        }
        <div className="sendbird-conversation__footer__typing-indicator">
          {
            renderTypingIndicator?.() || (
              <TypingIndicator />
            )
          }
          {
            !isOnline && (
              <ConnectionStatus />
            )
          }
        </div>
      </div>
    </div>
  );
}

export default ChannelUI;
