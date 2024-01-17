import React, { useEffect, useState } from 'react';
import kr from 'date-fns/locale/ko';

import pkg from '../../../../package.json'

import App from '../index';
import Sendbird from '../../../lib/Sendbird';
import ChannelList from '../../ChannelList';
import GroupChannelList from '../../GroupChannelList';
import Channel from '../../Channel';
import ChannelSettings from '../../ChannelSettings';
import MessageSearch from '../../MessageSearch';
import { withSendBird } from '../../..';
import { sendbirdSelectors } from '../../..';
import { fitPageSize } from './utils';
import { TypingIndicatorType } from '../../../types';

const appId = process.env.STORYBOOK_APP_ID;
const userId = 'sendbird';
const multipleFilesMessageUserId = 'sendbird1';

export default { title: 'App-Component' };

export const versionInfo = () => {
  const [showAll, setshowAll] = useState(false);
  return (
    <div className='sendbird-welcome'>
      <div className='sendbird-welcome__content'>
        <h1>@sendbird/uikit-react</h1>
        <a href='https://www.npmjs.com/package/@sendbird/uikit-react'>npm</a>
        <h4>UIKit: {pkg.version}</h4>
        <h4>Sendbird SDK: {pkg.dependencies['@sendbird/chat']}</h4>
        <button onClick={() => { setshowAll(!showAll) }}>Show all</button>
        {
          showAll && (
            <div className='sendbird-welcome__dependencies'>
              <h5>Dependencies</h5>
              {
                Object.keys(pkg.dependencies)
                  .map((p) => (
                    <div key={p}>{p}: {pkg.dependencies[p]}</div>
                  ))
              }
              <h5>Dev.dependencies</h5>
              {
                Object.keys(pkg.devDependencies)
                  .map((p) => (
                    <div key={p}>{p}: {pkg.devDependencies[p]}</div>
                  ))
              }
            </div>
          )
        }
      </div>
    </div>
  );
}

export const basicSDK = () => fitPageSize(
  <App
    appId={appId}
    userId={userId}
    nickname={userId}
    showSearchIcon
    replyType="QUOTE_REPLY"
    isMentionEnabled
    isReactionEnabled
    isTypingIndicatorEnabledOnChannelList
    isMessageReceiptStatusEnabledOnChannelList
    config={{ logLevel: 'all', isREMUnitEnabled: true }}
  />
);

export const darkTheme = () => fitPageSize(
  <App
    appId={appId}
    userId={userId}
    nickname={userId}
    theme="dark"
    showSearchIcon
    replyType="QUOTE_REPLY"
    config={{ logLevel: 'all', isREMUnitEnabled: true }}
    isMentionEnabled
    isTypingIndicatorEnabledOnChannelList
    isMessageReceiptStatusEnabledOnChannelList
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
  const [isTypingOnChannelListEnabled, setIsTypingOnChannelListEnabled] = useState(true);
  const [isMessageStatusOnChannelListEnabled, setIsMessageStatusOnChannelListEnabled] = useState(true);
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
          className="input__toggle-typing-indicator-on-channel-list"
          type="button"
          value={
            isTypingOnChannelListEnabled
              ? 'Use typing indicator on ChannelList'
              : 'Not use typing indicator on ChannelList'
          }
          onClick={() => setIsTypingOnChannelListEnabled(!isTypingOnChannelListEnabled)}
        />
        <input
          className="input__toggle-message-status-on-channel-list"
          type="button"
          value={
            isMessageStatusOnChannelListEnabled
              ? 'Use message status on ChannelList'
              : 'Not use message status on ChannelList'
          }
          onClick={() => setIsMessageStatusOnChannelListEnabled(!isMessageStatusOnChannelListEnabled)}
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
        config={{ logLevel: 'all' }}
        replyType={useReply ? 'QUOTE_REPLY' : 'NONE'}
        isTypingIndicatorEnabledOnChannelList
        isMessageReceiptStatusEnabledOnChannelList
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

const age = 75;
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
    breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
    stringSet={{
      CHANNEL_LIST__TITLE: '채널 목록',
      MESSAGE_INPUT__PLACE_HOLDER: '메시지 보내기',
      MESSAGE_INPUT__PLACE_HOLDER__DISABLED: '입력이 불가능 합니다',
      MESSAGE_INPUT__PLACE_HOLDER__MUTED: '음소거 되었습니다',
      DATE_FORMAT__MESSAGE_LIST__DATE_SEPARATOR: "yyyy'년' MMMM do '('ccc')'",
      DATE_FORMAT__THREAD_LIST__DATE_SEPARATOR: "yyyy'년' MMM do '('ccc')'",
      DATE_FORMAT__MESSAGE_LIST__NOTIFICATION__UNREAD_SINCE: "p '의' MMM dd",
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
    breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
    showSearchIcon
    allowProfileEdit
    config={{ logLevel: 'all' }}
    replyType="THREAD"
    isReactionEnabled
    isMentionEnabled
    isVoiceMessageEnabled
    isMultipleFilesMessageEnabled
    isMessageReceiptStatusEnabledOnChannelList
    uikitOptions={{
      groupChannel: {
        // enableTypingIndicator: false,
        typingIndicatorTypes: new Set([TypingIndicatorType.Bubble, TypingIndicatorType.Text]),
      }
    }}
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
    config={{ logLevel: 'all' }}
    breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
    replyType="THREAD"
    disableAutoSelect
    imageCompression={{
      compressionRate: 0.5,
      resizingWidth: 100,
      resizingHeight: '100px',
    }}
    isVoiceMessageEnabled
    isMentionEnabled
    isMultipleFilesMessageEnabled
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
    breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
    replyType="QUOTE_REPLY"
    isReactionEnabled
    isMentionEnabled
    isVoiceMessageEnabled
    isMultipleFilesMessageEnabled
    isTypingIndicatorEnabledOnChannelList
    isMessageReceiptStatusEnabledOnChannelList
    uikitOptions={{
      groupChannel: {
        // enableTypingIndicator: false,
        typingIndicatorTypes: new Set([TypingIndicatorType.Bubble, TypingIndicatorType.Text]),
      }
    }}
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
    isMessageGroupingEnabled={false}
    profileUrl={addProfile}
    config={{ logLevel: 'all' }}
    breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
    replyType="QUOTE_REPLY"
    isMentionEnabled
    isVoiceMessageEnabled
    isTypingIndicatorEnabledOnChannelList
    isMessageReceiptStatusEnabledOnChannelList
  />
);

const SBChannelList = ({ channelUrl, setChannelUrl }) => {
  const [query] = useState({ customTypesFilter: ['apple'] });

  const setCurrentChannel = (channel) => {
    setChannelUrl(channel?.url);
  };

  return (
    <GroupChannelList
      selectedChannelUrl={channelUrl}
      onChannelSelect={setCurrentChannel}
      onCreateChannel={setCurrentChannel}
      channelListQuery={query}
      onBeforeCreateChannel={(selectedUserIds) => {
        const params = {
          invitedUserIds: selectedUserIds,
          customType: 'apple',
          isDistinct: false,
        };
        return params;
      }}
    />
  );
};
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
      // renderFrozenNotification={() => {
      //   return (
      //     <div
      //       className="sendbird-notification sendbird-notification--frozen sendbird-conversation__messages__notification"
      //     >My custom Frozen Notification</div>
      //   );
      // }}
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
  const [channelUrl, setChannelUrl] = useState();
  const [channelSettings, setChannelSettings] = useState(false);
  const [channelSearch, setChannelSearch] = useState(false);
  return (
    <Sendbird
      appId={appId}
      userId={array[0]}
      nickname={array[0]}
      theme="dark"
      showSearchIcon
      allowProfileEdit
      profileUrl={addProfile}
      imageCompression={{ compressionRate: 0.5, resizingWidth: 100, resizingHeight: '100px' }}
      breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
    >
      <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row' }}>
        <SBChannelList channelUrl={channelUrl} setChannelUrl={setChannelUrl} />
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
);

export const multipleFilesMessage = () => fitPageSize(
  <App
    appId={appId}
    userId={multipleFilesMessageUserId}
    nickname={multipleFilesMessageUserId}
    showSearchIcon
    isMentionEnabled
    isReactionEnabled
    breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
    isTypingIndicatorEnabledOnChannelList
    isMessageReceiptStatusEnabledOnChannelList
    config={{ logLevel: 'all', isREMUnitEnabled: true }}
  />
);

