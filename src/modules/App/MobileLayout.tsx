import './mobile.scss';

import React, { useState, useEffect } from 'react';
import type { BaseMessage } from '@sendbird/chat/message';
import { GroupChannelHandler, GroupChannel as GroupChannelClass } from '@sendbird/chat/groupChannel';

import type { MobileLayoutProps } from './types';

import GroupChannel from '../GroupChannel';
import GroupChannelList from '../GroupChannelList';
import Channel from '../Channel';
import ChannelList from '../ChannelList';
import ChannelSettings from '../ChannelSettings';
import MessageSearch from '../MessageSearch';
import Thread from '../Thread';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import uuidv4 from '../../utils/uuid';
import { ALL, useVoicePlayerContext } from '../../hooks/VoicePlayer';
import { SendableMessageType } from '../../utils';

enum PANELS {
  CHANNEL_LIST = 'CHANNEL_LIST',
  CHANNEL = 'CHANNEL',
  CHANNEL_SETTINGS = 'CHANNEL_SETTINGS',
  MESSAGE_SEARCH = 'MESSAGE_SEARCH',
  THREAD = 'THREAD',
}

export const MobileLayout: React.FC<MobileLayoutProps> = (props: MobileLayoutProps) => {
  const {
    replyType,
    isMessageGroupingEnabled,
    isMultipleFilesMessageEnabled,
    allowProfileEdit,
    isReactionEnabled,
    showSearchIcon,
    onProfileEditSuccess,
    currentChannel,
    setCurrentChannel,
    startingPoint,
    setStartingPoint,
    threadTargetMessage,
    setThreadTargetMessage,
    highlightedMessage,
    setHighlightedMessage,
    enableLegacyChannelModules,
  } = props;
  const [panel, setPanel] = useState(PANELS.CHANNEL_LIST);

  const store = useSendbirdStateContext();
  const sdk = store?.stores?.sdkStore?.sdk;
  const userId = store?.config?.userId;

  const { pause } = useVoicePlayerContext();

  const goToMessage = (message?: BaseMessage | null, timeoutCb?: (msgId: number | null) => void) => {
    setStartingPoint?.(message?.createdAt || null);
    setTimeout(() => {
      timeoutCb?.(message?.messageId || null);
    }, 500);
  };

  useEffect(() => {
    if (panel !== PANELS.CHANNEL) {
      goToMessage(null, () => setHighlightedMessage(null));
    }
  }, [panel]);

  useEffect(() => {
    const handlerId = uuidv4();
    if (sdk?.groupChannel?.addGroupChannelHandler) {
      const handler = new GroupChannelHandler({
        onUserBanned: (groupChannel, user) => {
          if (groupChannel.url === currentChannel?.url && user?.userId === userId) {
            setPanel(PANELS.CHANNEL_LIST);
          }
        },
        onChannelDeleted: (channelUrl) => {
          if (channelUrl === currentChannel?.url) {
            setPanel(PANELS.CHANNEL_LIST);
          }
        },
        onUserLeft: (groupChannel, user) => {
          if (groupChannel.url === currentChannel?.url && user?.userId === userId) {
            setPanel(PANELS.CHANNEL_LIST);
          }
        },
      });
      sdk?.groupChannel?.addGroupChannelHandler(handlerId, handler);
    }
    return () => {
      sdk?.groupChannel?.removeGroupChannelHandler?.(handlerId);
    };
  }, [sdk, currentChannel?.url]);

  // if currentChannel is changed while on Thread
  // then change panel type to CHANNEL
  useEffect(() => {
    if (panel === PANELS.THREAD) {
      setPanel(PANELS.CHANNEL);
    }
  }, [currentChannel?.url]);

  const channelListProps = {
    allowProfileEdit,
    onProfileEditSuccess: onProfileEditSuccess,
    disableAutoSelect: true,
    onChannelSelect: (channel: GroupChannelClass) => {
      setCurrentChannel(channel);
      setPanel(PANELS.CHANNEL);
    },
    // for GroupChannelList
    onCreateChannel: (channel: GroupChannelClass) => {
      setCurrentChannel(channel);
      setPanel(PANELS.CHANNEL);
    },
    onUpdatedUserProfile: onProfileEditSuccess,
  };

  const channelProps = {
    channelUrl: currentChannel?.url || '',
    onChatHeaderActionClick: () => {
      setPanel(PANELS.CHANNEL_SETTINGS);
    },
    onBackClick: () => {
      setPanel(PANELS.CHANNEL_LIST);
      pause(ALL);
    },
    onSearchClick: () => {
      setPanel(PANELS.MESSAGE_SEARCH);
    },
    onReplyInThread: ({ message }) => {
      if (replyType === 'THREAD') {
        setPanel(PANELS.THREAD);
        setThreadTargetMessage(message);
      }
    },
    onQuoteMessageClick: ({ message }: { message: SendableMessageType }) => {
      // thread message
      if (replyType === 'THREAD') {
        setThreadTargetMessage(message);
        setPanel(PANELS.THREAD);
      }
    },
    animatedMessage: highlightedMessage,
    onMessageAnimated: () => setHighlightedMessage?.(null),
    showSearchIcon,
    startingPoint,
    isReactionEnabled,
    replyType,
    isMessageGroupingEnabled,
    isMultipleFilesMessageEnabled,
    // for GroupChannel
    animatedMessageId: highlightedMessage,
    onReplyInThreadClick: ({ message }) => {
      if (replyType === 'THREAD') {
        setPanel(PANELS.THREAD);
        setThreadTargetMessage(message);
      }
    },
  };

  return (
    <div className="sb_mobile">
      {panel === PANELS.CHANNEL_LIST && (
        <div className="sb_mobile__panelwrap">
          {enableLegacyChannelModules ? <ChannelList {...channelListProps} /> : <GroupChannelList {...channelListProps} />}
        </div>
      )}
      {panel === PANELS.CHANNEL && (
        <div className="sb_mobile__panelwrap">
          {enableLegacyChannelModules ? <Channel {...channelProps} /> : <GroupChannel {...channelProps} />}
        </div>
      )}
      {panel === PANELS.CHANNEL_SETTINGS && (
        <div className="sb_mobile__panelwrap">
          <ChannelSettings
            channelUrl={currentChannel?.url || ''}
            onCloseClick={() => {
              setPanel(PANELS.CHANNEL);
            }}
            onLeaveChannel={() => {
              setPanel(PANELS.CHANNEL_LIST);
            }}
          />
        </div>
      )}
      {panel === PANELS.MESSAGE_SEARCH && (
        <div className="sb_mobile__panelwrap">
          <MessageSearch
            channelUrl={currentChannel?.url || ''}
            onCloseClick={() => {
              setPanel(PANELS.CHANNEL);
            }}
            onResultClick={(message) => {
              setPanel(PANELS.CHANNEL);
              goToMessage(message, (messageId) => {
                setHighlightedMessage?.(messageId);
              });
            }}
          />
        </div>
      )}
      {panel === PANELS.THREAD && (
        <div className="sb_mobile__panelwrap">
          <Thread
            channelUrl={currentChannel?.url || ''}
            message={threadTargetMessage}
            onHeaderActionClick={() => {
              setPanel(PANELS.CHANNEL);
              pause(ALL);
            }}
            onMoveToParentMessage={({ message, channel }) => {
              setCurrentChannel(channel);
              goToMessage(message, (messageId) => {
                setPanel(PANELS.CHANNEL);
                setHighlightedMessage(messageId);
              });
            }}
          />
        </div>
      )}
    </div>
  );
};
