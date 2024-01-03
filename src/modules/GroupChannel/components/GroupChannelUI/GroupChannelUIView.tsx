import './index.scss';
import React from 'react';

import type { GroupChannelUIProps } from '.';
import type { GroupChannelProviderInterface } from '../../context/GroupChannelProvider';
import type { ChannelProviderInterface } from '../../../Channel/context/ChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

import GroupChannelHeader from '../GroupChannelHeader';
import MessageList from '../MessageList';
import TypingIndicator from '../TypingIndicator';
import { TypingIndicatorType } from '../../../../types';
import ConnectionStatus from '../../../../ui/ConnectionStatus';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import MessageInputWrapper from '../MessageInputWrapper';

export interface GroupChannelUIViewProps extends GroupChannelUIProps {
  requestedChannelUrl: string;
  loading: boolean;
  isInvalid: boolean;
}

export const GroupChannelUIView = (props: GroupChannelUIViewProps & (GroupChannelProviderInterface | ChannelProviderInterface)) => {
  const {
    requestedChannelUrl,
    loading,
    isInvalid,
    renderChannelHeader,
    renderMessageInput,
    renderTypingIndicator,
    renderPlaceholderLoader,
    renderPlaceholderInvalid,
  } = props;
  const { stores, config } = useSendbirdStateContext();
  const sdkError = stores?.sdkStore?.error;
  const { logger, isOnline } = config;

  if (loading) {
    return <div className="sendbird-conversation">{renderPlaceholderLoader?.() || <PlaceHolder type={PlaceHolderTypes.LOADING} />}</div>;
  }

  if (!requestedChannelUrl) {
    return (
      <div className="sendbird-conversation">{renderPlaceholderInvalid?.() || <PlaceHolder type={PlaceHolderTypes.NO_CHANNELS} />}</div>
    );
  }

  // TODO: only show when getChannel fails with an error
  if (isInvalid) {
    // && getCurrentChannelError
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
    <div className='sendbird-conversation'>
      {renderChannelHeader?.() || (
        <GroupChannelHeader className="sendbird-conversation__channel-header" />
      )}
      <MessageList
        {...props}
        className="sendbird-conversation__message-list"
      />
      <div className="sendbird-conversation__footer">
        {renderMessageInput?.() || (
          <MessageInputWrapper {...props} />
        )}
        <div className="sendbird-conversation__footer__typing-indicator">
          {renderTypingIndicator?.()
            || (
              config?.groupChannel?.enableTypingIndicator
              && config?.groupChannel?.typingIndicatorTypes?.has(TypingIndicatorType.Text)
              && (
                <TypingIndicator channelUrl={requestedChannelUrl} />
              )
            )
          }
          {!isOnline && <ConnectionStatus />}
        </div>
      </div>
    </div>
  );
};
