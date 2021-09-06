import React, { useEffect, useState } from 'react';

import pkg from '../../../../package-lock.json'

import App from '../index';
import Sendbird from '../../../lib/Sendbird';
import ChannelList from '../../ChannelList';
import Conversation from '../../Conversation';
import { fitPageSize } from './utils';

const appId = process.env.STORYBOOK_APP_ID;
// const userId = 'leo.sub';
const userId = 'sendbird';

export default { title: 'App-Component' };

export const versionInfo = () => {
  const [showAll, setshowAll] = useState(false);
  return (
    <>
      <div>UIKit: {pkg.version}</div>
      <div>Sendbird SDK: {pkg.dependencies.sendbird.version}</div>
      <button onClick={() => { setshowAll(!showAll)}}>Show all</button>
      {
        showAll && (
        <div>
          {
            Object.keys(pkg.dependencies)
              .map((p) => (
                <div key={p}>{p}: {pkg.dependencies[p].version}</div>
              ))
          }
        </div>
        )
      }
    </>
  );
}

export const basicSDK = () => fitPageSize(
  <App
    appId={appId}
    userId={userId}
    nickname={userId}
    showSearchIcon
    /*config={{ logLevel: 'all' }}*/
  />
);

export const darkTheme = () => fitPageSize(
  <App
    appId={appId}
    userId={'leo.sub'}
    theme={'dark'}
    showSearchIcon
    config={{ logLevel: 'all' }}
  />
);

export const login = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [userId, setUserId] = useState('hoon100');
  const [nickname, setNickname] = useState('hoon100');
  const [theme, setTheme] = useState('light');
  const [messageSearch, setMessageSearch] = useState(true);
  const [profileEdit, setProfileEdit] = useState(true);
  return isLoginPage
    ? fitPageSize(
      <div
        className="login-container"
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <h1>LogIn</h1>
        <input
          className="input__user-id"
          type="text"
          placeholder="user id"
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          className="input__nickname"
          type="text"
          placeholder="nickname"
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          className="input__toggle-theme"
          type="button"
          value={`Use ${theme} theme`}
          onClick={() => {
            if (theme === 'light') {
              setTheme('dark');
            } else {
              setTheme('light');
            }
          }}
        />
        <input
          className="input__toggle-message-search"
          type="button"
          value={
            messageSearch
            ? 'Use MessageSearch'
            : 'Not use MessageSearch'
          }
          onClick={() => setMessageSearch(!messageSearch)}
        />
        <input
          className="input__toggle-profile-edit"
          type="button"
          value={
            profileEdit
            ? 'Use ProfileEdit'
            : 'Not use ProfileEdit'
          }
          onClick={() => setProfileEdit(!profileEdit)}
        />
        <input
          className="login-submit"
          type="submit"
          value="Submit"
          onClick={() => setIsLoginPage(false)}
        />
      </div>
    )
    : fitPageSize(
      <App
        appId={appId}
        userId={userId}
        nickname={nickname}
        theme={theme}
        showSearchIcon={messageSearch}
        allowProfileEdit={profileEdit}
      />
    )
};

export const updateProfile = () => {
  return fitPageSize(
    <App
      appId={appId}
      userId='leo.sub'
      theme='dark'
      onProfileEditSuccess={(user) => {
        alert(user.nickname);
      }}
      showSearchIcon
      allowProfileEdit
      config={{ logLevel: 'all' }}
    />
  );
};

const age = 60;
const array = [
  `hoon${age}1`,
  `hoon${age}2`,
  `hoon${age}3`,
  `eunseo${age}1`,
];
const addProfile = null; // 'https://static.sendbird.com/sample/profiles/profile_12_512px.png';

export const Korean = () => fitPageSize(
  <App
    appId={appId}
    userId={array[0]}
    nickname={array[0]}
    showSearchIcon
    stringSet={{
      CHANNEL_LIST__TITLE: '채널 목록',
      CHANNEL__MESSAGE_INPUT__PLACE_HOLDER: '메시지 보내기',
      CHANNEL__MESSAGE_INPUT__PLACE_HOLDER__DISABLED: '입력이 불가능 합니다',
      CHANNEL__MESSAGE_INPUT__PLACE_HOLDER__MUTED: '음소거 되었습니다',
    }}
  />
);

export const user1 = () => fitPageSize(
  <App
    appId={appId}
    userId={array[0]}
    nickname={array[0]}
    showSearchIcon
    allowProfileEdit
    profileUrl={addProfile}
    config={{ logLevel: 'all' }}
    queries={{}}
  />
);
export const user2 = () => fitPageSize(
  <App
    appId={appId}
    userId={array[1]}
    nickname={array[1]}
    showSearchIcon
    allowProfileEdit
    profileUrl={addProfile}
  // config={{ logLevel: 'all' }}
  />
);
export const user3 = () => fitPageSize(
  <App
    appId={appId}
    userId={array[2]}
    nickname={array[2]}
    theme="dark"
    showSearchIcon
    allowProfileEdit
    profileUrl={addProfile}
    imageCompression={{
      compressionRate: 0.5,
      resizingWidth: 100,
      resizingHeight: '100px',
    }}
  />
);

const CustomApp = () => {
  const [channelUrl, setChannelUrl] = useState('');
  return (
    <Sendbird
      appId={appId}
      userId={array[3]}
      nickname={array[3]}
      theme="dark"
      showSearchIcon
      allowProfileEdit
      profileUrl={addProfile}
      imageCompression={{
        compressionRate: 0.5,
        resizingWidth: 100,
        resizingHeight: '100px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
        <ChannelList
          onChannelSelect={(channel) => { setChannelUrl(channel.url) }}
          queries={{ channelListQuery: { superChannelFilter: 'super' } }}
        />
        <Conversation
          channelUrl={channelUrl}
          // queries={{ messageListParams: { senderUserIds: ['eunseo601'] } }}
        />
      </div>
    </Sendbird>
  );
};
export const customer1 = () => fitPageSize(<CustomApp />);

export const disableUserProfile = () => fitPageSize(
  <App
    showSearchIcon
    appId={appId}
    userId={array[2]}
    nickname={array[2]}
  />
);

export const renderUserProfile = () => fitPageSize(
  <App
    showSearchIcon
    appId={appId}
    userId={array[2]}
    nickname={array[2]}
    renderUserProfile={({ user }) => {
      return user.userId;
    }}
  />
);

export const randomlyChangeUserEveryFiveSeconds = () => {
  const [myUserId, setMyUserId] = useState('hoon100');
  useEffect(() => {
    function getRandomArbitrary() {
      return Math.round(Math.random() * (10) / 3);
    }
    const userIds = [
      'hoon100',
      'sravan',
      'sendbird',
    ];
    setInterval(() => {
      const randomId = getRandomArbitrary();
      setMyUserId(userIds[randomId]);
    }, 5000);
  }, []);
  return (
    fitPageSize(
      <App appId={appId} userId={myUserId} config={{ logLevel: 'all' }} />
    )
  );
}

// A member must have these three properties and userId must be unique
const Member = () => ({
  userId: Math.random() * 10000,
  profileUrl: '',
  nickname: array[Math.floor(Math.random() * 3)],
});

class CustomUserPaginatedQuery {
  constructor() {
    // Required public property to determine if more data is available.
    this.hasNext = false;
  }

  // Required public property
  next(callback) {
    const users = new Array(3).fill(0).map(() => Member());
    // Set this.hasNext
    this.hasNext = false;
    callback(users);
  }
}

const getCustomPaginatedQuery = () => new CustomUserPaginatedQuery();

export const userListQuery = () => fitPageSize(
  <App
    appId={appId}
    userId={array[2]}
    nickname={array[2]}
    userListQuery={getCustomPaginatedQuery}
  />
);;
