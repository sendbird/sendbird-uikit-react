import React, { ReactElement, useState } from 'react';

import './community.scss';
import './theme.scss';

import Sendbird from '../../lib/Sendbird';
import OpenChannel from '../OpenChannel';
import OpenChannelSettings from '../OpenChannelSettings';
import CommunityChannelList from './components/CommunityChannelList';

interface Props {
  appId: string;
  userId: string;
  nickname: string;
  theme?: string;
}

export default function Community({
  appId,
  userId,
  theme,
  nickname,
}: Props): ReactElement {
  const [showSettings, setShowSettings] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<SendBird.OpenChannel>(null);
  const [channels, setChannels] = useState<Array<SendBird.OpenChannel>>([]);
  const currentChannelUrl = currentChannel ? currentChannel.url : '';
  return (
    <Sendbird
      appId={appId}
      userId={userId}
      theme={theme}
      nickname={nickname}
    >
      <div className="community-app">
        <div className="channel-list">
          <CommunityChannelList
            currentChannelUrl={currentChannelUrl}
            setCurrentChannel={setCurrentChannel}
            channels={channels}
            setChannels={setChannels}
          />
        </div>
        <div className="community-open-channel">
          <OpenChannel
            channelUrl={currentChannelUrl}
            onChatHeaderActionClick={() => {
              setShowSettings(true);
            }}
          />
        </div>
        {
          showSettings && (
            <OpenChannelSettings
              channelUrl={currentChannelUrl}
              onCloseClick={() => {
                setShowSettings(false);
              }}
              onDeleteChannel={(openChannel: SendBird.OpenChannel) => {
                setShowSettings(false);
                const isCurrent = currentChannelUrl === openChannel.url;
                const updatedChannels = channels.filter(c => c.url !== openChannel.url);
                setChannels(updatedChannels);
                if (isCurrent && updatedChannels.length > 0) {
                  setCurrentChannel(updatedChannels[0]);
                }
              }}
            />
          )
        }
      </div>
      <div className="sendbird-modal-root" />
    </Sendbird>
  );
}
