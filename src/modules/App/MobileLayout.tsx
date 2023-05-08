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
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import uuidv4 from '../../utils/uuid';

enum PANELS {
  CHANNEL_LIST = 'CHANNEL_LIST',
  CHANNEL = 'CHANNEL',
  CHANNEL_SETTINGS = 'CHANNEL_SETTINGS',
  MESSAGE_SEARCH = 'MESSAGE_SEARCH',
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
  } = props;
  const [panel, setPanel] = useState(PANELS?.CHANNEL_LIST);

  const store = useSendbirdStateContext();
  const sdk = store?.stores?.sdkStore?.sdk as SendbirdGroupChat;
  const userId = store?.config?.userId;

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
                goToMessage(message);
              }}
            />
          </div>
        )
      }
    </div>
  );
};
