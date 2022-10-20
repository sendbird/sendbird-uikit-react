import React from 'react';

import type { DesktopLayoutProps } from './types';

import ChannelList from '../ChannelList';
import Channel from '../Channel';
import ChannelSettings from '../ChannelSettings';
import MessageSearchPannel from '../MessageSearch';

export function DesktopLayout(props: DesktopLayoutProps) {
  const {
    isReactionEnabled,
    replyType,
    isMessageGroupingEnabled,
    allowProfileEdit,
    showSearchIcon,
    onProfileEditSuccess,
    disableAutoSelect,
    currentChannelUrl,
    setCurrentChannelUrl,
    showSettings,
    setShowSettings,
    showSearch,
    setShowSearch,
    highlightedMessage,
    setHighlightedMessage,
    startingPoint,
    setStartingPoint,
  } = props;
  return (
    <div className="sendbird-app__wrap">
      <div className="sendbird-app__channellist-wrap">
        <ChannelList
          allowProfileEdit={allowProfileEdit}
          onProfileEditSuccess={onProfileEditSuccess}
          disableAutoSelect={disableAutoSelect}
          onChannelSelect={(channel) => {
            setStartingPoint(null);
            setHighlightedMessage(null);
            if (channel?.url) {
              setCurrentChannelUrl(channel.url);
            } else {
              setCurrentChannelUrl('');
            }
          }}
        />
      </div>
      <div
        className={`
          ${showSettings ? 'sendbird-app__conversation--settings-open' : ''}
          ${showSearch ? 'sendbird-app__conversation--search-open' : ''}
          sendbird-app__conversation-wrap
        `}
      >
        <Channel
          channelUrl={currentChannelUrl}
          onChatHeaderActionClick={() => {
            setShowSearch(false);
            setShowSettings(!showSettings);
          }}
          onSearchClick={() => {
            setShowSettings(false);
            setShowSearch(!showSearch);
          }}
          showSearchIcon={showSearchIcon}
          startingPoint={startingPoint}
          highlightedMessage={highlightedMessage}
          isReactionEnabled={isReactionEnabled}
          replyType={replyType}
          isMessageGroupingEnabled={isMessageGroupingEnabled}
        />
      </div>
      {showSettings && (
        <div className="sendbird-app__settingspanel-wrap">
          <ChannelSettings
            className="sendbird-channel-settings"
            channelUrl={currentChannelUrl}
            onCloseClick={() => {
              setShowSettings(false);
            }}
          />
        </div>
      )}
      {showSearch && (
        <div className="sendbird-app__searchpanel-wrap">
          <MessageSearchPannel
            channelUrl={currentChannelUrl}
            onResultClick={(message) => {
              if (message.messageId === highlightedMessage) {
                setHighlightedMessage(null);
                setTimeout(() => {
                  setHighlightedMessage(message.messageId);
                });
              } else {
                setStartingPoint(message.createdAt);
                setHighlightedMessage(message.messageId);
              }
            }}
            onCloseClick={() => {
              setShowSearch(false);
            }}
          />
        </div>
      )}
    </div>
  )
}
