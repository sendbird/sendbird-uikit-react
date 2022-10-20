import './mobile.scss';

import React, { useState, useEffect } from 'react';

import SendbirdProvider from '../../../lib/Sendbird';
import ChannelList from '../../ChannelList';
import Channel from '../../Channel';
import ChannelSettings from '../../ChannelSettings';
import MessageSearch from '../../MessageSearch';

const appId = process.env.STORYBOOK_APP_ID;
const userId = 'sendbird';

export default { title: 'App-in-mobile' };

const PANELS = {
  CHANNEL_LIST: 'CHANNEL_LIST',
  CHANNEL: 'CHANNEL',
  CHANNEL_SETTINGS: 'CHANNEL_SETTINGS',
  MESSAGE_SEARCH: 'MESSAGE_SEARCH',
};

const MobileApp = () => {
  const [panel, setPanel] = useState(PANELS?.CHANNEL_LIST);
  const [channel, setChannel] = useState('');
  const [highlitghtedMessage, setHighlitghtedMessage] = useState('');
  const [startingPoint, setStartingPoint] = useState('');
  const goToMessage = (message) => {
    setStartingPoint(message?.createdAt);
    setTimeout(() => {
      setHighlitghtedMessage(message?.messageId);
    });
  }
  useEffect(() => {
    if (panel !== PANELS?.CHANNEL) {
      goToMessage();
    }
  }, [panel])

  return (
    <div>
      {
        panel === PANELS?.CHANNEL_LIST && (
          <div className='sb_mobile_channellist'>
            <ChannelList
              onChannelSelect={(channel) => {
                setChannel(channel?.url);
                setPanel(PANELS.CHANNEL);
              }}
              allowProfileEdit
              disableAutoSelect
            />
          </div>
        )
      }
      {
        panel === PANELS?.CHANNEL && (
          <div className='sb_mobile_channellist'>
            <Channel
              channelUrl={channel}
              onSearchClick={() => {
                setPanel(PANELS.MESSAGE_SEARCH);
              }}
              onBackClick={() => {
                setPanel(PANELS.CHANNEL_LIST);
                // setChannel('');
              }}
              startingPoint={startingPoint}
              highlightedMessage={highlitghtedMessage}
              onChatHeaderActionClick={() => {
                setPanel(PANELS.CHANNEL_SETTINGS);
              }}
              showSearchIcon
            />
          </div>
        )
      }
      {
        panel === PANELS?.CHANNEL_SETTINGS && (
          <div className='sb_mobile_channellist'>
            <ChannelSettings
              channelUrl={channel}
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
          <div className='sb_mobile_channellist'>
            <MessageSearch
              channelUrl={channel}
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
export const basicMobileApp = () => {
  return (
    <SendbirdProvider
      appId={appId}
      userId={userId}
      nickname={userId}
      // theme="dark"
      showSearchIcon
      replyType="QUOTE_REPLY"
      config={{ logLevel: 'all', isREMUnitEnabled: true }}
      isMentionEnabled
    >
      <MobileApp />
    </SendbirdProvider>
  )
};
