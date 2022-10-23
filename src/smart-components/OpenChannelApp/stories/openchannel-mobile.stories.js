import React, { useState } from 'react';

import OpenChannelList from '../../OpenChannelList';
import OpenChannel from '../../OpenChannel';
import OpenChannelSettings from '../../OpenChannelSettings';
import SendbirdProvider from '../../../lib/Sendbird';

const appId = process.env.STORYBOOK_APP_ID;
// const userId = 'sendbirdian84'; // nickname in customized samples
// const nickname = 'Sendbirdian2020';

const PANELS = {
  CHANNEL_LIST: 'CHANNEL_LIST',
  CHANNEL: 'CHANNEL',
  CHANNEL_SETTINGS: 'CHANNEL_SETTINGS',
  MESSAGE_SEARCH: 'MESSAGE_SEARCH',
};

export default { title: 'OpenChannelMobileApp' };

export const OpenChannelApp = () => {
  const [panel, setPanel] = useState(PANELS?.CHANNEL_LIST);
  const [currentChannelUrl, setCurrentChannelUrl] = useState(null);
  return (
    <SendbirdProvider appId={appId} userId='sendbird' nickname="sendbird">
      {
        panel === PANELS?.CHANNEL_LIST && (
          <div className='sb_mobile__panelwrap'>
            <OpenChannelList
              onChannelSelected={(channel) => {
                setCurrentChannelUrl(channel?.url);
                setPanel(PANELS.CHANNEL);
              }}
              disableAutoSelect
            />
          </div>
        )
      }
      {
        panel === PANELS?.CHANNEL && (
          <div className='sb_mobile__panelwrap'>
            <OpenChannel
              channelUrl={currentChannelUrl}
              onBackClick={() => {
                setPanel(PANELS.CHANNEL_LIST);
              }}
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
            <OpenChannelSettings
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
    </SendbirdProvider>
  );
}

