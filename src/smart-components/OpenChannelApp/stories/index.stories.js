import React, { useState } from 'react';

import { fitPageSize } from './utils';
import ProductApp from '../index';
import Streaming from '../Streaming';
import Community from '../Community';
import Login from '../components/Login';

const appId = process.env.STORYBOOK_APP_ID;
// const userId = 'sendbirdian84'; // nickname in customized samples
// const nickname = 'Sendbirdian2020';

export default { title: 'OpenChannelApps' };

export const OpenChannelApp = () => fitPageSize(
  <ProductApp
    appId={process.env.STORYBOOK_APP_ID}
    userId="hoon001"
    channelUrl="sendbird_open_channel_63320_f89be4498288aaca2d1aacda7f3f7351b679d1f3"
    // channelUrl="sendbird_open_channel_63320_57b41b4afba3100bf273dd933404994b9718f16c" // hoons test channel
    nickname="Hoon / 훈"
    theme="light"
    imageCompression={{
      compressionRate: 0.5,
      resizingWidth: 100,
      resizingHeight: '100px',
    }}
  />
);

export const user1 = () => fitPageSize(
  <ProductApp
    appId={process.env.STORYBOOK_APP_ID}
    userId="hoon002"
    channelUrl="sendbird_open_channel_63320_f89be4498288aaca2d1aacda7f3f7351b679d1f3"
    nickname="훈2"
    theme="light"
  />
);

export const user2 = () => fitPageSize(
  <ProductApp
    appId={process.env.STORYBOOK_APP_ID}
    userId="hoon003"
    channelUrl="sendbird_open_channel_63320_f89be4498288aaca2d1aacda7f3f7351b679d1f3"
    nickname="훈3"
    theme="dark"
  />
);

export const EmptyChannel = () => fitPageSize(
  <ProductApp
    appId={process.env.STORYBOOK_APP_ID}
    userId="hoon001"
    channelUrl="sendbird_open_channel_63320_a8461af5e8609fe4141e98d15daf78ba188fe58d" // empty channel
  />
);

export const StreamingAppLogin = () => {
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [darkTheme, setDarkTheme] = useState(false);
  if (!appId || !userId || !nickname) {
    return (
      <Login
        setValues={({
          userId,
          nickName,
          darkTheme,
        }) => {
          setUserId(userId);
          setNickname(nickName);
          setDarkTheme(darkTheme);
        }}
      />
    );
  }
  return (
    <Streaming
      appId={appId}
      userId={userId}
      nickname={nickname}
      theme={darkTheme ? 'dark' : 'light'}
    />
  );
}

export const CommunityAppLogin = () => {
  const [userId, setUserId] = useState('hoon1');
  const [nickname, setNickname] = useState('hoon1');
  const [darkTheme, setDarkTheme] = useState(false);
  if (!appId || !userId || !nickname) {
    return (
      <Login
        setValues={({
          userId,
          nickName,
          darkTheme,
        }) => {
          setUserId(userId);
          setNickname(nickName);
          setDarkTheme(darkTheme);
        }}
      />
    );
  }
  return (
    <Community
      appId={appId}
      userId={userId}
      nickname={nickname}
      theme={darkTheme ? 'dark' : 'light'}
    />
  );
}
