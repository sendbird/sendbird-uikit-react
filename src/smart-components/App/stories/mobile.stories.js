import './mobile.scss';

import React, { useState } from 'react';

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
  const [panel, setPanel] = useState('');
  const [channel, setChannel] = useState('');
  return (
    <>
      {
        panel === PANELS?.CHANNEL_LIST || !panel && (
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
            />
          </div>
        )
      }
    </>
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
