import React, { useEffect, useState } from 'react';
import kr from 'date-fns/locale/ko';

import pkg from '../../../../package-lock.json'

import App from '../index';
import Sendbird from '../../../lib/Sendbird';
import ChannelList from '../../ChannelList';
import Channel from '../../Channel';
import ChannelSettings from '../../ChannelSettings';
import MessageSearch from '../../MessageSearch';
import { withSendBird } from '../../..';
import { sendBirdSelectors } from '../../..';
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
      <div>Sendbird SDK: {pkg.dependencies['@sendbird/chat'].version}</div>
      <button onClick={() => { setshowAll(!showAll) }}>Show all</button>
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
    config={{ logLevel: 'all' }}
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
  const [useReply, setUseReply] = useState(true);
  const [useMention, setUseMention] = useState(true);
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
          className="input__toggle-use-reply"
          type="button"
          value={
            useReply
              ? 'Use Reply'
              : 'Not use Reply'
          }
          onClick={() => setUseReply(!useReply)}
        />
        <input
          className="input__toggle-user-mention"
          type="button"
          value={
            useMention
              ? 'Use Mention'
              : 'Not use Mention'
          }
          onClick={() => setUseMention(!useMention)}
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
        isMentionEnabled={useMention}
        showSearchIcon={messageSearch}
        allowProfileEdit={profileEdit}
        replyType={useReply ? 'QUOTE_REPLY' : 'NONE'}
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

const age = 73;
const array = [
  `hoon${age}1`,
  `hoon${age}2`,
  `hoon${age}3`,
  `hoon${age}4`,
  `eunseo${age}1`,
];
const addProfile = null; // 'https://static.sendbird.com/sample/profiles/profile_12_512px.png';

export const Korean = () => fitPageSize(
  <App
    appId={appId}
    userId={array[0]}
    nickname={array[0]}
    showSearchIcon
    dateLocale={kr}
    stringSet={{
      CHANNEL_LIST__TITLE: '채널 목록',
      CHANNEL__MESSAGE_INPUT__PLACE_HOLDER: '메시지 보내기',
      CHANNEL__MESSAGE_INPUT__PLACE_HOLDER__DISABLED: '입력이 불가능 합니다',
      CHANNEL__MESSAGE_INPUT__PLACE_HOLDER__MUTED: '음소거 되었습니다',
    }}
    isMentionEnabled
    isTypingIndicatorEnabledOnChannelList
    isMessageReceiptStatusEnabledOnChannelList
  />
);

export const user1 = () => fitPageSize(
  <App
    appId={appId}
    userId={array[0]}
    nickname={array[0]}
    profileUrl={addProfile}
    showSearchIcon
    allowProfileEdit
    config={{
      logLevel: 'all',
      userMention: {
        maxMentionCount: 2,
      }
    }}
    queries={{}}
    replyType="QUOTE_REPLY"
    isMentionEnabled
    isTypingIndicatorEnabledOnChannelList
    isMessageReceiptStatusEnabledOnChannelList
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
    config={{ logLevel: 'all', userMention: { maxMentionCount: 2, maxSuggestionCount: 5 } }}
    replyType="QUOTE_REPLY"
    useMessageGrouping={false}
    disableAutoSelect
    imageCompression={{
      compressionRate: 0.5,
      resizingWidth: 100,
      resizingHeight: '100px',
    }}
    isMentionEnabled
    isTypingIndicatorEnabledOnChannelList
    isMessageReceiptStatusEnabledOnChannelList
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
    config={{ logLevel: 'all' }}
    replyType="QUOTE_REPLY"
    isMentionEnabled
    isTypingIndicatorEnabledOnChannelList
    isMessageReceiptStatusEnabledOnChannelList
  />
);
export const user4 = () => fitPageSize(
  <App
    appId={appId}
    userId={array[3]}
    nickname={array[3]}
    theme="dark"
    showSearchIcon
    allowProfileEdit
    useMessageGrouping={false}
    profileUrl={addProfile}
    config={{ logLevel: 'all' }}
    replyType="QUOTE_REPLY"
  />
);

const UseSendbirdChannelList = (props) => {
  const [queries] = useState({ channelListQuery: { customTypesFilter: ['apple'] } });
  const sdk = sendBirdSelectors.getSdk(props);
  const { setChannelUrl } = props;

  return (
    <ChannelList
      onChannelSelect={(channel) => channel && setChannelUrl(channel.url)}
      queries={queries}
      onBeforeCreateChannel={(selectedUserIds) => {
        const params = new sdk.GroupChannelParams();
        params.addUserIds(selectedUserIds);
        params.isDistinct = false;
        params.customType = 'apple';
        return params;
      }}
    />
  );
};
const SBChannelList = withSendBird(UseSendbirdChannelList);
const SBChannel = withSendBird((props) => {
  const {
    channelUrl,
    onSearchClick,
    onChatHeaderActionClick,
    showSearchIcon,
  } = props;

  return (
    <Channel
      channelUrl={channelUrl}
      showSearchIcon={showSearchIcon}
      onSearchClick={onSearchClick}
      onChatHeaderActionClick={onChatHeaderActionClick}
    // renderChatItem={({ message }) => {
    //   return (
    //     <div>{message.message || '하잉'}</div>
    //   )
    // }}
    // renderCustomMessage={(message) => {
    //   if (message.messageType === 'user') {
    //     return () => (
    //       <CustomMessageItem
    //         message={message}
    //       />
    //     )
    //   }
    // }}
    />
  );
});
const CustomApp = () => {
  const [channelUrl, setChannelUrl] = useState('');
  const [channelSettings, setChannelSettings] = useState(false);
  const [channelSearch, setChannelSearch] = useState(false);
  return (
    <Sendbird
      appId={appId}
      userId={array[4]}
      nickname={array[4]}
      theme="dark"
      showSearchIcon
      allowProfileEdit
      profileUrl={addProfile}
      imageCompression={{ compressionRate: 0.5, resizingWidth: 100, resizingHeight: '100px' }}
    >
      <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row' }}>
        <SBChannelList setChannelUrl={setChannelUrl} />
        <div style={{ height: '100%', width: '100%', display: 'inline-flex', flexDirection: 'row' }}>
          <div style={{ width: '100%' }}>
            <SBChannel
              channelUrl={channelUrl}
              onChatHeaderActionClick={() => {
                setChannelSearch(false);
                setChannelSettings(true);
              }}
              showSearchIcon
              onSearchClick={() => {
                setChannelSettings(false);
                setChannelSearch(true);
              }}
            />
          </div>
          {channelSearch && (
            <div style={{ width: '100%' }}>
              <MessageSearch
                channelUrl={channelUrl}
                onChatHeaderActionClick={() => {
                  setChannelSearch(false);
                  setChannelSettings(true);
                }}
                showSearchIcon
                onSearchClick={() => {
                  setChannelSettings(false);
                  setChannelSearch(true);
                }}
                renderCustomMessage={() => {
                  return null;
                }}
              />
            </div>
          )}
          {channelSettings && (
            <div style={{ display: 'inline-flex' }}>
              <ChannelSettings
                channelUrl={channelUrl}
                onCloseClick={() => setChannelSettings(false)}
              />
            </div>
          )}
        </div>
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
