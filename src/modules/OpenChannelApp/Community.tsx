import React, { ReactElement, useState } from 'react';
import { OpenChannel } from '@sendbird/chat/openChannel';

import './community.scss';
import './theme.scss';

import Sendbird from '../../lib/Sendbird';
import OpenChannelConversation from '../OpenChannel';
import OpenChannelSettings from '../OpenChannelSettings';
// import CommunityChannelList from './components/CommunityChannelList';
import OpenChannelList from '../OpenChannelList';

interface Props {
  appId: string;
  userId: string;
  nickname: string;
  theme?: 'light' | 'dark';
}

export default function Community({
  appId,
  userId,
  theme,
  nickname,
}: Props): ReactElement {
  const [showSettings, setShowSettings] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<OpenChannel | null>(null);
  // const [channels, setChannels] = useState<Array<OpenChannel>>([]);
  return (
    <Sendbird
      appId={appId}
      userId={userId}
      theme={theme}
      nickname={nickname}
      config={{ logLevel: 'all' }}
    >
      <div className="community-app">
        <div className="channel-list">
          <OpenChannelList
            onChannelSelected={(channel) => {
              setCurrentChannel(channel);
            }}
          />
        </div>
        <div className="community-open-channel">
          <OpenChannelConversation
            channelUrl={currentChannel?.url ?? ''}
            onChatHeaderActionClick={() => {
              setShowSettings(true);
            }}
          />
        </div>
        {
          showSettings && (
            <OpenChannelSettings
              channelUrl={currentChannel?.url ?? ''}
              onCloseClick={() => {
                setShowSettings(false);
              }}
              // onDeleteChannel={(openChannel: OpenChannel) => {
              //   setShowSettings(false);
              //   const isCurrent = currentChannel?.url === openChannel.url;
              //   const updatedChannels = channels.filter(c => c.url !== openChannel.url);
              //   setChannels(updatedChannels);
              //   if (isCurrent && updatedChannels.length > 0) {
              //     setCurrentChannel(updatedChannels[0]);
              //   }
              // }}
            />
          )
        }
      </div>
      <div className="sendbird-modal-root" />
    </Sendbird>
  );
}
