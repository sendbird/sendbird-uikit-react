import React from 'react';
import { GroupChannel as GroupChannelClass } from '@sendbird/chat/groupChannel';

import type { DesktopLayoutProps } from './types';

import GroupChannel from '../GroupChannel';
import GroupChannelList from '../GroupChannelList';

import Channel from '../Channel';
import ChannelList from '../ChannelList';
import ChannelSettings from '../ChannelSettings';
import MessageSearchPannel from '../MessageSearch';
import Thread from '../Thread';
import { SendableMessageType } from '../../utils';

export const DesktopLayout: React.FC<DesktopLayoutProps> = (props: DesktopLayoutProps) => {
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
    enableLegacyChannelModules,
  } = props;

  const updateFocusedChannel = (channel: GroupChannelClass) => {
    setStartingPoint?.(null);
    setHighlightedMessage?.(null);
    if (channel) {
      setCurrentChannel(channel);
    } else {
      setCurrentChannel(null);
    }
  };

  const onClickThreadReply = ({ message }: { message: SendableMessageType }) => {
    // parent message
    setShowSettings(false);
    setShowSearch(false);
    if (replyType === 'THREAD') {
      setThreadTargetMessage(message);
      setShowThread(true);
    }
  };

  const channelListProps = {
    allowProfileEdit,
    activeChannelUrl: currentChannel?.url,
    onProfileEditSuccess: onProfileEditSuccess,
    disableAutoSelect: disableAutoSelect,
    onChannelSelect: updateFocusedChannel,
    // for GroupChannelList
    selectedChannelUrl: currentChannel?.url,
    onCreateChannel: updateFocusedChannel,
    onUpdatedUserProfile: onProfileEditSuccess,
  };

  const channelProps = {
    channelUrl: currentChannel?.url || '',
    onChatHeaderActionClick: () => {
      setShowSearch(false);
      setShowThread(false);
      setShowSettings(!showSettings);
    },
    onSearchClick: () => {
      setShowSettings(false);
      setShowThread(false);
      setShowSearch(!showSearch);
    },
    onReplyInThread: onClickThreadReply,
    onQuoteMessageClick: ({ message }) => {
      // thread message
      setShowSettings(false);
      setShowSearch(false);
      if (replyType === 'THREAD') {
        setThreadTargetMessage(message);
        setShowThread(true);
      }
    },
    animatedMessage: highlightedMessage,
    onMessageAnimated: () => setHighlightedMessage?.(null),
    showSearchIcon: showSearchIcon,
    startingPoint: startingPoint,
    isReactionEnabled: isReactionEnabled,
    replyType: replyType,
    isMessageGroupingEnabled: isMessageGroupingEnabled,
    isMultipleFilesMessageEnabled: isMultipleFilesMessageEnabled,
    // for GroupChannel
    animatedMessageId: highlightedMessage,
    onReplyInThreadClick: onClickThreadReply,
  };

  return (
    <div className="sendbird-app__wrap">
      <div className="sendbird-app__channellist-wrap">
        {enableLegacyChannelModules ? <ChannelList {...channelListProps} /> : <GroupChannelList {...channelListProps} />}
      </div>
      <div
        className={`
          ${showSettings ? 'sendbird-app__conversation--settings-open' : ''}
          ${showSearch ? 'sendbird-app__conversation--search-open' : ''}
          sendbird-app__conversation-wrap
        `}
      >
        {enableLegacyChannelModules ? <Channel {...channelProps} /> : <GroupChannel {...channelProps} />}
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
