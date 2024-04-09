import React, {
  ReactElement,
  useState,
} from 'react';
import { OpenChannel } from '@sendbird/chat/openChannel';

import './streaming.scss';
import './theme.scss';

import Sendbird from '../../lib/Sendbird';

import OpenChannelConversation from '../OpenChannel';
import OpenChannelSettings from '../OpenChannelSettings';

import ChannelList from './components/StreamingChannelList';
import DummyStream from './components/DummyStream';

import { Collapse, Expand, Members } from './assets/Icons';

interface ChannelTitleProps {
  onCloseClick(): void,
  onCollapseClick(): void,
}

const ChannelTitle = (props: ChannelTitleProps) => {
  const {
    onCloseClick,
    onCollapseClick,
  } = props;
  return (
    <div className="channel-title">
      <div className="collapse" onClick={onCollapseClick}>
        <Collapse />
      </div>
      <div className="channel-title-text">
        Live Chat
      </div>
      <div
        className="close"
        onClick={onCloseClick}
      >
        <Members />
      </div>
    </div>
  );
};
interface Props {
  appId: string;
  userId: string;
  nickname: string;
  theme?: 'light' | 'dark';
}

export default function Streaming({
  appId,
  userId,
  theme,
  nickname,
}: Props): ReactElement {
  const [showSettings, setShowSettings] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [currentChannel, setCurrentChannel] = useState<OpenChannel | null>(null);
  const currentChannelUrl = currentChannel ? currentChannel.url : '';
  return (
    <Sendbird
      appId={appId}
      userId={userId}
      theme={theme}
      nickname={nickname}
    >
      <div className="streaming-app">
        <div className="channel-list">
          <ChannelList
            currentChannelUrl={currentChannelUrl}
            setCurrentChannel={setCurrentChannel}
          />
        </div>
        <div className="stream">
          <DummyStream
            currentChannel={currentChannel}
          />
        </div>
        {
          showPanel && (
            <div className="chat-panel">
              {
                showSettings ? (
                  <OpenChannelSettings
                    channelUrl={currentChannelUrl}
                    onCloseClick={() => {
                      setShowSettings(false);
                    }}
                  />
                )
                  : (
                  <OpenChannelConversation
                    channelUrl={currentChannelUrl}
                    renderHeader={() => {
                      return (
                        <ChannelTitle
                          onCloseClick={() => { setShowSettings(true); }}
                          onCollapseClick={() => { setShowPanel(false); }}
                        />
                      );
                    }}
                  />
                  )
              }
            </div>

          )
        }
        {
          !showPanel && (
            <div
              className="expand-icon"
              onClick={() => { setShowPanel(true); }}
            >
              <Expand />
            </div>
          )
        }
      </div>
    </Sendbird>
  );
}
