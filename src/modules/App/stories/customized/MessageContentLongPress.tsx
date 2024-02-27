import React, { useState } from 'react';
import ChannelSettings from '../../../ChannelSettings';
import { CustomSampleAppId, CustomSampleUserNames } from './const';
import GroupChannelList from '../../../GroupChannelList';
import Channel from '../../../Channel';
import SendbirdProvider from '../../../../lib/Sendbird';
import MessageContent from '../../../../ui/MessageContent';

const userName = CustomSampleUserNames[0];
const MessageContentLongPress = () => {
  const [channelUrl, setChannelUrl] = useState();
  const [showSettings, setShowSettings] = useState(false);

  const setCurrentChannel = (channel) => {
    setChannelUrl(channel?.url);
  };

  return (
    <SendbirdProvider
      appId={CustomSampleAppId}
      userId={userName}
      nickname={userName}
      theme="dark"
      showSearchIcon
      allowProfileEdit
      breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
    >
      <div style={{ height: '100%', width: '100%', display: 'flex' }}>
        <div className="sendbird-app__channellist-wrap">
          <GroupChannelList
            selectedChannelUrl={channelUrl}
            onChannelSelect={setCurrentChannel}
            onChannelCreated={setCurrentChannel}
          />
        </div>
        <div className="sendbird-app__conversation-wrap">
          <Channel
            channelUrl={channelUrl}
            onChatHeaderActionClick={() => {
              setShowSettings(true);
            }}
            renderMessageContent={(props) => (
              <MessageContent
                {...props}
                onLongPress={(e, contentRef) => {
                  if (contentRef?.current) {
                    const belowContainer = document.createElement('div');
                    belowContainer.style.cssText = 'background-color: white;';
                    belowContainer.innerText = 'This post is appended!';
                    contentRef.current.appendChild(belowContainer);
                  }
                }}
              />
            )}
          />
        </div>
        {showSettings && (
          <div className="sendbird-app__settingspanel-wrap">
            <ChannelSettings
              channelUrl={channelUrl}
              onCloseClick={() => {
                setShowSettings(false);
              }}
            />
          </div>
        )}
      </div>
    </SendbirdProvider>
  );
};

export default MessageContentLongPress;
