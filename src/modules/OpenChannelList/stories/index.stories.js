import React, { useState } from 'react';

import OpenChannel from '../../OpenChannel';
import OpenChannelList from '../index';
import SendbirdProvider from '../../../lib/Sendbird';
import { fitPageSize } from '../../OpenChannelApp/stories/utils';

const appId = process.env.STORYBOOK_APP_ID;

export default { title: 'OpenChannelList' };

const CustomApp = () => {
  const [currentChannel, setCurrentChannel] = useState();
  return (
    <SendbirdProvider
      appId={appId}
      userId="hoon751"
      nickname="hoon751"
      theme="light"
    >
      <div style={{
        display: 'inline-flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
      }}>
        <OpenChannelList
          onChannelSelected={(channel) => {
            setCurrentChannel(channel);
          }}
        />
        <OpenChannel
          channelUrl={currentChannel?.url}
        />
      </div>
    </SendbirdProvider>
  );
}
export const OpenChannelListDefault = () => fitPageSize(<CustomApp />);
