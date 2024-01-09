import React from 'react';

import type { DesktopLayoutProps } from './types';

import ChannelList from '../ChannelList';
import ChannelSettings from '../ChannelSettings';
import MessageSearchPannel from '../MessageSearch';
import Thread from '../Thread';
import GroupChannel from '../GroupChannel';

export const DesktopLayout: React.FC<DesktopLayoutProps> = (
  props: DesktopLayoutProps,
) => {
  const {
    isReactionEnabled,
    replyType,
    isMessageGroupingEnabled,
    isMultipleFilesMessageEnabled,
    allowProfileEdit,
    showSearchIcon,
    onProfileEditSuccess,
    disableAutoSelect,
    currentChannel,
    setCurrentChannel,
    showSettings,
    setShowSettings,
    showSearch,
    setShowSearch,
    highlightedMessage,
    setHighlightedMessage,
    startingPoint,
    setStartingPoint,
    showThread,
    setShowThread,
    threadTargetMessage,
    setThreadTargetMessage,
  } = props;
  return (
    <div className="sendbird-app__wrap">
      <div className="sendbird-app__channellist-wrap">
        <ChannelList
          allowProfileEdit={allowProfileEdit}
          activeChannelUrl={currentChannel?.url}
          onProfileEditSuccess={onProfileEditSuccess}
          disableAutoSelect={disableAutoSelect}
          onChannelSelect={(channel) => {
            setStartingPoint?.(null);
            setHighlightedMessage?.(null);
            if (channel) {
              setCurrentChannel(channel);
            } else {
              setCurrentChannel(null);
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
        <GroupChannel
          channelUrl={currentChannel?.url || ''}
          onChatHeaderActionClick={() => {
            setShowSearch(false);
            setShowThread(false);
            setShowSettings(!showSettings);
          }}
          onSearchClick={() => {
            setShowSettings(false);
            setShowThread(false);
            setShowSearch(!showSearch);
          }}
          onReplyInThreadClick={({ message }) => { // parent message
            setShowSettings(false);
            setShowSearch(false);
            if (replyType === 'THREAD') {
              setThreadTargetMessage(message);
              setShowThread(true);
            }
          }}
          onQuoteMessageClick={({ message }) => { // thread message
            setShowSettings(false);
            setShowSearch(false);
            if (replyType === 'THREAD') {
              setThreadTargetMessage(message);
              setShowThread(true);
            }
          }}
          onMessageAnimated={() => {
            setHighlightedMessage(null);
          }}
          showSearchIcon={showSearchIcon}
          startingPoint={startingPoint}
          animatedMessageId={highlightedMessage}
          isReactionEnabled={isReactionEnabled}
          replyType={replyType}
          isMessageGroupingEnabled={isMessageGroupingEnabled}
          isMultipleFilesMessageEnabled={isMultipleFilesMessageEnabled}
        />
      </div>
      {showSettings && (
        <div className="sendbird-app__settingspanel-wrap">
          <ChannelSettings
            className="sendbird-channel-settings"
            channelUrl={currentChannel?.url || ''}
            onCloseClick={() => {
              setShowSettings(false);
            }}
          />
        </div>
      )}
      {showSearch && (
        <div className="sendbird-app__searchpanel-wrap">
          <MessageSearchPannel
            channelUrl={currentChannel?.url || ''}
            onResultClick={(message) => {
              if (message.messageId === highlightedMessage) {
                setHighlightedMessage?.(null);
                setTimeout(() => {
                  setHighlightedMessage?.(message.messageId);
                });
              } else {
                setStartingPoint?.(message.createdAt);
                setHighlightedMessage?.(message.messageId);
              }
            }}
            onCloseClick={() => {
              setShowSearch(false);
            }}
          />
        </div>
      )}
      {showThread && (
        <Thread
          className="sendbird-app__thread"
          channelUrl={currentChannel?.url || ''}
          message={threadTargetMessage}
          onHeaderActionClick={() => {
            setShowThread(false);
          }}
          onMoveToParentMessage={({ message, channel }) => {
            if (channel?.url !== currentChannel?.url) {
              setCurrentChannel(channel);
            }
            if (message?.messageId !== highlightedMessage) {
              setStartingPoint?.(message?.createdAt);
            }
            setTimeout(() => {
              setHighlightedMessage(message?.messageId);
            }, 500);
          }}
        />
      )}
    </div>
  );
};
