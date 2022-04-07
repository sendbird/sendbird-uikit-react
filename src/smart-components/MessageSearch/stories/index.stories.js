import React, { useState } from 'react';
import Sendbird from '../../../lib/Sendbird';
import MessageSearch from '../index';
import MessageSearchPannel from '../messageSearchPannel';
import Conversation from '../../Conversation';

export default { title: 'MessageSearch' };

const appId = process.env.STORYBOOK_APP_ID;
const userId = process.env.STORYBOOK_USER_ID || 'sendbird';
// const channelUrl = "sendbird_group_channel_224133251_33dfa347e2bf6c42420a8faee9bab7728f263a88";
const channelUrl = "sendbird-group-channel_2893930545";

export const normal = () => {
  const [inputText, setInputText] = useState('');

  return (
    <div style={{
      height: '100vh'
    }}>
      <Sendbird
        appId={appId}
        userId={userId}
        config={{ logLevel: 'all' }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
        }}>
          <div style={{
            width: '50vw',
            height: '100vh',
          }}>
            <Conversation
              channelUrl={channelUrl}
            />
          </div>
          <div style={{
            width: '50vw',
            height: '100ch',
          }}>
            <textarea onChange={(e) => {
              console.log(e.target.value);
              setInputText(e.target.value);
            }} />
            <MessageSearch
              channelUrl={channelUrl}
              searchString={inputText}
            />
          </div>
        </div>
      </Sendbird>
    </div>
  )
};

export const containedPannel = () => {
  return (
    <div style={{
      height: '100vh'
    }}>
      <Sendbird
        appId={appId}
        userId={userId}
        config={{ logLevel: 'all' }}
      >
        <div style={{
          height: '100%'
        }}>
          <MessageSearchPannel
            channelUrl={channelUrl}
            onResultClick={(message) => {
              console.log('message is clicked', message);
            }}
            onCloseClick={() => {
              console.log('close button is clicked');
            }}
          />
        </div>
      </Sendbird>
    </div>
  );
};
