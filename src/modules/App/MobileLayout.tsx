import './mobile.scss';

import React, { useState, useEffect } from 'react';
import type { BaseMessage } from '@sendbird/chat/message';
import type { SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';

import type { MobileLayoutProps } from './types';

import ChannelList from '../ChannelList';
import Channel from '../Channel';
import ChannelSettings from '../ChannelSettings';
import MessageSearch from '../MessageSearch';
import Thread from '../Thread';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import uuidv4 from '../../utils/uuid';

enum PANELS {
  CHANNEL_LIST = 'CHANNEL_LIST',
  CHANNEL = 'CHANNEL',
  CHANNEL_SETTINGS = 'CHANNEL_SETTINGS',
  MESSAGE_SEARCH = 'MESSAGE_SEARCH',
  THREAD = 'THREAD',
}

export const MobileLayout: React.FC<MobileLayoutProps> = (
  props: MobileLayoutProps,
) => {
  const {
    replyType,
    isMessageGroupingEnabled,
    allowProfileEdit,
    isReactionEnabled,
    showSearchIcon,
    onProfileEditSuccess,
    currentChannel,
    setCurrentChannel,
    highlightedMessage,
    setHighlightedMessage,
    startingPoint,
    setStartingPoint,
    threadTargetMessage,
    setThreadTargetMessage,
  } = props;
  const [panel, setPanel] = useState(PANELS?.CHANNEL_LIST);
  const [animatedMessageId, setAnimatedMessageId] = useState<number | null>(null);

  const store = useSendbirdStateContext();
  const sdk = store?.stores?.sdkStore?.sdk as SendbirdGroupChat;
  const userId = store?.config?.userId;

  const goToMessage = (message?: BaseMessage | null, timeoutCb?: (msgId: number | null) => void) => {
    setStartingPoint?.(message?.createdAt || null);
    setTimeout(() => {
      timeoutCb?.(message?.messageId || null);
    }, 500);
  };

  useEffect(() => {
    if (panel !== PANELS?.CHANNEL) {
      goToMessage();
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
  }, [sdk]);

  return (
    <div>
      {
        panel === PANELS?.CHANNEL_LIST && (
          <div className='sb_mobile__panelwrap'>
            <ChannelList
              onProfileEditSuccess={onProfileEditSuccess}
              onChannelSelect={(channel) => {
                setCurrentChannel(channel);
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
              channelUrl={currentChannel?.url || ''}
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
              animatedMessage={animatedMessageId}
              highlightedMessage={highlightedMessage}
              onChatHeaderActionClick={() => {
                setPanel(PANELS.CHANNEL_SETTINGS);
              }}
              onReplyInThread={({ message }) => {
                if (replyType === 'THREAD') {
                  setPanel(PANELS.THREAD);
                  setThreadTargetMessage(message);
                }
              }}
              onQuoteMessageClick={({ message }) => { // thread message
                if (replyType === 'THREAD') {
                  setThreadTargetMessage(message);
                  setPanel(PANELS.THREAD);
                }
              }}
            />
          </div>
        )
      }
      {
        panel === PANELS?.CHANNEL_SETTINGS && (
          <div className='sb_mobile__panelwrap'>
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
        )
      }
      {
        panel === PANELS?.MESSAGE_SEARCH && (
          <div className='sb_mobile__panelwrap'>
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
        )
      }
      {
        panel === PANELS?.THREAD && (
          <div className='sb_mobile__panelwrap'>
            <Thread
              channelUrl={currentChannel?.url || ''}
              message={threadTargetMessage}
              onHeaderActionClick={() => {
                setPanel(PANELS.CHANNEL);
              }}
              onMoveToParentMessage={({ message, channel }) => {
                if (channel?.url !== currentChannel?.url) {
                  setPanel(PANELS.CHANNEL);
                }
                if (message?.messageId !== animatedMessageId) {
                  goToMessage(message, (messageId) => {
                    setAnimatedMessageId(messageId);
                  });
                }
                setTimeout(() => {
                  setAnimatedMessageId(message?.messageId);
                }, 500);
              }}
            />
          </div>
        )
      }
    </div>
  );
};
