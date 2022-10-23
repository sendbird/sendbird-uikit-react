import './mobile.scss';

import type { BaseMessage } from '@sendbird/chat/message';
import React, { useState, useEffect } from 'react';

import type { MobileLayoutProps } from './types';

import ChannelList from '../ChannelList';
import Channel from '../Channel';
import ChannelSettings from '../ChannelSettings';
import MessageSearch from '../MessageSearch';

enum PANELS {
  CHANNEL_LIST = 'CHANNEL_LIST',
  CHANNEL = 'CHANNEL',
  CHANNEL_SETTINGS = 'CHANNEL_SETTINGS',
  MESSAGE_SEARCH = 'MESSAGE_SEARCH',
}

export function MobileLayout(
  props: MobileLayoutProps,
): React.FC<MobileLayoutProps> {
  const {
    replyType,
    isMessageGroupingEnabled,
    allowProfileEdit,
    isReactionEnabled,
    showSearchIcon,
    onProfileEditSuccess,
    currentChannelUrl,
    setCurrentChannelUrl,
    highlightedMessage,
    setHighlightedMessage,
    startingPoint,
    setStartingPoint,
  } = props;
  const [panel, setPanel] = useState(PANELS?.CHANNEL_LIST);

  const goToMessage = (message?: BaseMessage | null) => {
    setStartingPoint(message?.createdAt);
    setTimeout(() => {
      setHighlightedMessage(message?.messageId);
    });
  };

  useEffect(() => {
    if (panel !== PANELS?.CHANNEL) {
      goToMessage();
    }
  }, [panel]);

  return (
    <div>
      {
        panel === PANELS?.CHANNEL_LIST && (
          <div className='sb_mobile__panelwrap'>
            <ChannelList
              onProfileEditSuccess={onProfileEditSuccess}
              onChannelSelect={(channel) => {
                setCurrentChannelUrl(channel?.url);
                setPanel(PANELS.CHANNEL);
              }}
              allowProfileEdit={allowProfileEdit}
              // this condition must be true for mobile
              disableAutoSelect
            />
          </div>
        )
      }
      {
        panel === PANELS?.CHANNEL && (
          <div className='sb_mobile__panelwrap'>
            <Channel
              replyType={replyType}
              channelUrl={currentChannelUrl}
              onSearchClick={() => {
                setPanel(PANELS.MESSAGE_SEARCH);
              }}
              onBackClick={() => {
                setPanel(PANELS.CHANNEL_LIST);
              }}
              isReactionEnabled={isReactionEnabled}
              showSearchIcon={showSearchIcon}
              isMessageGroupingEnabled={isMessageGroupingEnabled}
              startingPoint={startingPoint}
              highlightedMessage={highlightedMessage}
              onChatHeaderActionClick={() => {
                setPanel(PANELS.CHANNEL_SETTINGS);
              }}
            />
          </div>
        )
      }
      {
        panel === PANELS?.CHANNEL_SETTINGS && (
          <div className='sb_mobile__panelwrap'>
            <ChannelSettings
              channelUrl={currentChannelUrl}
              onCloseClick={() => {
                setPanel(PANELS.CHANNEL);
              }}
              onLeaveChannel={() => {
                setPanel(PANELS.CHANNEL_LIST);
              }}
            />
          </div>
        )
      }
      {
        panel === PANELS?.MESSAGE_SEARCH && (
          <div className='sb_mobile__panelwrap'>
            <MessageSearch
              channelUrl={currentChannelUrl}
              onCloseClick={() => {
                setPanel(PANELS.CHANNEL);
              }}
              onResultClick={(message) => {
                setPanel(PANELS.CHANNEL);
                goToMessage(message);
              }}
            />
          </div>
        )
      }
    </div>
  );
}
