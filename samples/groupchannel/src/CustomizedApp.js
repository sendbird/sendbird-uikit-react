import React, { useState, useCallback } from "react";

import {
  Channel as SBConversation,
  ChannelList as SBChannelList,
  ChannelSettings as SBChannelSettings,
  withSendBird
} from "sendbird-uikit";

function CustomizedApp(props) {
  // default props
  const {
    stores: { sdkStore, userStore },
    config: {
      isOnline,
      userId,
      appId,
      accessToken,
      theme,
      userListQuery,
      logger,
      pubSub
    }
  } = props;
  const logDefaultProps = useCallback(() => {
    console.log(
      "SDK store list log",
      sdkStore.initialized,
      sdkStore.sdk,
      sdkStore.loading,
      sdkStore.error
    );
    console.log(
      "User store list log",
      userStore.initialized,
      userStore.user,
      userStore.loading
    );
    console.log(
      "Config list log",
      isOnline,
      userId,
      appId,
      accessToken,
      theme,
      userListQuery,
      logger,
      pubSub
    );
  }, [
    sdkStore.initialized,
    sdkStore.sdk,
    sdkStore.loading,
    sdkStore.error,
    userStore.initialized,
    userStore.user,
    userStore.loading,
    isOnline,
    userId,
    appId,
    accessToken,
    theme,
    userListQuery,
    logger,
    pubSub
  ]);
  logDefaultProps();

  // useState
  const [showSettings, setShowSettings] = useState(false);
  const [currentChannelUrl, setCurrentChannelUrl] = useState("");

  return (
    <div className="customized-app">
      <div className="sendbird-app__wrap">
        <div className="sendbird-app__channellist-wrap">
          <SBChannelList
            onChannelSelect={(channel) => {
              if (channel && channel.url) {
                setCurrentChannelUrl(channel.url);
              }
            }}
          />
        </div>
        <div className="sendbird-app__conversation-wrap">
          <SBConversation
            channelUrl={currentChannelUrl}
            onChatHeaderActionClick={() => {
              setShowSettings(true);
            }}
          />
        </div>
          {showSettings && (
            <div className="sendbird-app__settingspanel-wrap">
              <SBChannelSettings
                channelUrl={currentChannelUrl}
                onCloseClick={() => {
                  setShowSettings(false);
                }}
              />
          </div>
        )}
      </div>
    </div>
  );
}

export default withSendBird(CustomizedApp);
