import React from 'react';
import { GroupChannel as GroupChannelClass } from '@sendbird/chat/groupChannel';

import type { DesktopLayoutProps } from './types';

import GroupChannel, { GroupChannelProps } from '../GroupChannel';
import GroupChannelList, { GroupChannelListProps } from '../GroupChannelList';

import Channel, { ChannelProps } from '../Channel';
import ChannelList, { ChannelListProps } from '../ChannelList';
import ChannelSettings from '../ChannelSettings';
import MessageSearchPannel from '../MessageSearch';
import Thread from '../Thread';
import { SendableMessageType } from '../../utils';
import { classnames } from '../../utils/utils';
import { APP_LAYOUT_ROOT } from './const';

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
      setCurrentChannel(null ?? undefined);
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

  const channelListProps: GroupChannelListProps & ChannelListProps = {
    allowProfileEdit,
    activeChannelUrl: currentChannel?.url,
    onProfileEditSuccess: onProfileEditSuccess,
    disableAutoSelect: disableAutoSelect,
    onChannelSelect: updateFocusedChannel,
    // for GroupChannelList
    selectedChannelUrl: currentChannel?.url,
    onChannelCreated: updateFocusedChannel,
    onUserProfileUpdated: onProfileEditSuccess,
  };

  const channelProps: ChannelProps & GroupChannelProps = {
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
    startingPoint: startingPoint ?? undefined,
    isReactionEnabled: isReactionEnabled,
    replyType: replyType,
    isMessageGroupingEnabled: isMessageGroupingEnabled,
    isMultipleFilesMessageEnabled: isMultipleFilesMessageEnabled,
    // for GroupChannel
    animatedMessageId: highlightedMessage,
    onReplyInThreadClick: onClickThreadReply,
  };

  return (
    <div className="sendbird-app__wrap" id={APP_LAYOUT_ROOT}>
      <div className="sendbird-app__channellist-wrap">
        {enableLegacyChannelModules ? <ChannelList {...channelListProps} /> : <GroupChannelList {...channelListProps} />}
      </div>
      <div
        className={classnames(
          'sendbird-app__conversation-wrap',
          showSettings && 'sendbird-app__conversation--settings-open',
          showSearch && 'sendbird-app__conversation--search-open',
        )}
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
            setTimeout(() => {
              if (message?.messageId !== highlightedMessage) {
                setStartingPoint?.(message?.createdAt);
              }
            }, 200);
            setTimeout(() => {
              setStartingPoint?.(null);
              setHighlightedMessage?.(message?.messageId);
            }, 500);
          }}
        />
      )}
    </div>
  );
};
