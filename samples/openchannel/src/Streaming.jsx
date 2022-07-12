import React, { useState } from "react";

import "./streaming.scss";
import "./theme.scss";

import {
  SendbirdProvider as Sendbird,
  OpenChannel,
  OpenChannelSettings
} from "sendbird-uikit";
import "sendbird-uikit/dist/index.css";

import ChannelList from "./components/StreamingChannelList";
import DummyStream from "./components/DummyStream";

import { Collapse, Expand, Members } from "./assets/Icons";

const ChannelTitle = (props) => {
  const { onCloseClick, onCollapseClick } = props;
  return (
    <div className="channel-title">
      <div className="collapse" onClick={onCollapseClick}>
        <Collapse />
      </div>
      <div className="channel-title-text">Live Chat</div>
      <div className="close" onClick={onCloseClick}>
        <Members />
      </div>
    </div>
  );
};

export default function Streaming({ appId, userId, theme, nickname }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [currentChannel, setCurrentChannel] = useState(null);
  const currentChannelUrl = currentChannel ? currentChannel.url : "";
  return (
    <Sendbird appId={appId} userId={userId} theme={theme} nickname={nickname}>
      <div className="streaming-app">
        <div className="channel-list">
          <ChannelList
            currentChannelUrl={currentChannelUrl}
            setCurrentChannel={setCurrentChannel}
          />
        </div>
        <div className="stream">
          <DummyStream currentChannel={currentChannel} />
        </div>
        {showPanel && (
          <div className="chat-panel">
            {showSettings ? (
              <OpenChannelSettings
                channelUrl={currentChannelUrl}
                onCloseClick={() => {
                  setShowSettings(false);
                }}
              />
            ) : (
              <OpenChannel
                channelUrl={currentChannelUrl}
                renderChannelTitle={() => {
                  return (
                    <ChannelTitle
                      onCloseClick={() => {
                        setShowSettings(true);
                      }}
                      onCollapseClick={() => {
                        setShowPanel(false);
                      }}
                    />
                  );
                }}
              />
            )}
          </div>
        )}
        {!showPanel && (
          <div
            className="expand-icon"
            onClick={() => {
              setShowPanel(true);
            }}
          >
            <Expand />
          </div>
        )}
      </div>
    </Sendbird>
  );
}
