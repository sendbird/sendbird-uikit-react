import React, { useState } from 'react';

import './index.scss';

import Sendbird from '../../lib/Sendbird';
import OpenChannel from '../OpenChannel';
import OpenChannelSettings from '../OpenChannelSettings';

interface Props {
  appId: string;
  channelUrl: string;
  userId: string;
  nickname: string;
  theme?: 'light' | 'dark';
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  }
}
export default function OpenChannelApp({
  appId,
  channelUrl,
  userId,
  nickname,
  theme,
  imageCompression,
}: Props): JSX.Element {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Sendbird
      appId={appId}
      userId={userId}
      nickname={nickname}
      theme={theme}
      imageCompression={imageCompression}
    >
      <div className="sendbird-openchannel-app">
        <div className="sendbird-openchannel-app__channel">
          <OpenChannel
            channelUrl={channelUrl}
            onChatHeaderActionClick={() => {
              setShowSettings(true);
            }}
          />
        </div>
        {
          showSettings && (
            <div className="sendbird-openchannel-app__settings">
              <OpenChannelSettings
                channelUrl={channelUrl}
                onCloseClick={() => {
                  setShowSettings(false);
                }}
              />
            </div>
          )
        }
      </div>
    </Sendbird>
  );
}
