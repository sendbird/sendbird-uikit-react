import React, { useState, useEffect, useRef } from 'react';
import './integrated-app.scss';

import App from '../index';
import Community from '../../OpenChannelApp/Community';
import Streamnig from '../../OpenChannelApp/Streaming';

import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../ui/Icon';
import Checkbox from '../../../ui/Checkbox';
import Button, { ButtonSizes, ButtonTypes } from '../../../ui/Button';
import { MediaQueryProvider } from '../../../lib/MediaQueryContext';
import { TypingIndicatorType } from '../../../types';

const STORAGE_KEY = 'sendbird-integrated-app-v1-groupchannel';

function storeCurrentSampleOptions({
  store,
  sampleOptions,
  globalEnvironments,
}) {
  store.current.setItem(STORAGE_KEY, JSON.stringify({
    login: false,
    currentAppId: sampleOptions.appId,
    apps: {
      ...globalEnvironments?.apps,
      [sampleOptions.appId]: {
        currentUserId: sampleOptions.userId,
        users: {
          ...globalEnvironments?.apps?.[sampleOptions.appId]?.users,
          [sampleOptions.userId]: sampleOptions,
        },
      },
    },
  }));
}

/**
 * Polyfill for localStorage
 * localStorage wont work in some browsers, in incognito
 * and no-cookie modes
 * @returns { getItem: (key), setItem: (key, value) }
 */
const storePolyfill = () =>{
  let _store = {};
  return {
    /**
     * @param {string} key
     * @returns {string | null} value
     */
    getItem: (key) => {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        return _store[key];
      }
    },
    /**
     * @param {string} key
     * @param {string} value
     * @returns {undefined}
     */
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, value)
      } catch (error) {
        _store[key] = value;
      }
    }
  }
}

// Local storage format
// key: sendbird-integrated-app-v1-groupchannel
// value: {
//   login: true,
//   currentAppId: '',
//   apps: {
//     [appId]: {
//       currentUserId: '',
//       users: {
//         [userId]: {
//           ...application options
//         },
//       }
//     },
//   },
// }

export default { title: 'Integrated-App' };

const ThemeType = {
  light: 'light',
  dark: 'dark',
};
const ReplyType = {
  NONE: 'NONE',
  QUOTE_REPLY: 'QUOTE_REPLY',
  THREAD: 'THREAD',
};
const ChannelType = {
  GROUP: 'GROUP',
  COMMUNITY: 'COMMUNITY',
  LIVE: 'LIVE',
};

const TYPES = {
  TOGGLE: 'TOGGLE',
};

const toggleItems = {
  messageSearch: {
    title: 'Message Search',
    defaultValue: true,
  },
  editUserProfile: {
    title: 'Edit User Profile',
    defaultValue: true,
  },
  messageGrouping: {
    title: 'Message Grouping',
    defaultValue: true,
  },
  emojiReaction: {
    title: 'Emoji Reaction',
    defaultValue: true,
  },
  isVoiceMessageEnabled: {
    title: 'Voice Message',
    defaultValue: true,
  },
  mention: {
    title: 'Mention',
    defaultValue: true,
  },
  typingIndicator: {
    title: 'Typing Indicator',
    defaultValue: true,
  },
  messageStatus: {
    title: 'Message Status',
    defaultValue: true,
  },
  multipleFiles: {
    title: "Multiple Files",
    defaultValue: true,
  },
};

const ModerationOptionItem = ({
  subTitle,
  description,
  children,
  type,
}) => {
  return (
    <div
      className={`
        sendbird-integrated-sample-app__moderations__option
        ${type === TYPES.TOGGLE ? 'sendbird-integrated-sample-app__moderations__option--toggle' : '' }
      `}
    >
      <div className='sendbird-integrated-sample-app__moderations__option__name'>
        <Label
          type={LabelTypography.SUBTITLE_1}
          color={LabelColors.ONBACKGROUND_1}
        >
          {subTitle}
        </Label>
      </div>
      <div>
        <Label
            type={LabelTypography.SUBTITLE_2}
            color={LabelColors.ONBACKGROUND_3}
          >
          {description}
        </Label>
      </div>
      <div className='sendbird-integrated-sample-app__moderations__option__input'>
        {children}
      </div>
    </div>
  );
};

const TextInput = React.forwardRef(({ disabled, onChange, value }, ref) => {
  return (
    <input
      disabled={disabled}
      ref={ref}
      className='sendbird-integrated-sample-app-text-input'
      type="text"
      onChange={onChange}
      value={value}
    />
  );
});

const ToggleButton = ({
  isEnabled,
  onClick,
}) => {
  const [enabled, setEnabled] = useState(isEnabled);
  return (
    <div
      className='sendbird-integrated-sample-app-toggle-button'
      onClick={(e) => {
        setEnabled(!enabled);
        onClick(e);
      }}
    >
      {
        enabled
          ? (<Icon fillColor={IconColors.PRIMARY} type={IconTypes.TOGGLE_ON} width="48px" />)
          : (<Icon fillColor={IconColors.GRAY} type={IconTypes.TOGGLE_OFF} width="48px" />)
      }
    </div>
  )
};

const MultipleButtons = ({
  options,
  value,
  onClick,
}) => {
  if (typeof options === 'object' && !Array.isArray(options)) {
    const [titles] = useState(Object.keys(options));
    return (
      <div className='sendbird-integrated-sample-app-multiple-buttons'>
        {titles?.map((option) => (
          <Button
            size={ButtonSizes.BIG}
            type={option === value ? ButtonTypes.PRIMARY : ButtonTypes.SECONDARY}
            onClick={() => {
              onClick(option);
            }}
            key={option}
          >
            {option}
          </Button>
        ))}
      </div>
    )
  }
  return null;
};

export const GroupChannel = () => {
  const store = useRef(storePolyfill());
  let globalEnvironments;
  try {
    globalEnvironments = JSON.parse(store.current.getItem(STORAGE_KEY));
  } catch {
    // no-op
  }
  if (globalEnvironments === null || globalEnvironments === undefined) {
    globalEnvironments = { currentAppId: '', apps: {}, login: false };
  }
  const appIdInputRef = useRef(null);
  const userIdInputRef = useRef(null);
  const [isLoggedin, setIsLoggedin] = useState(globalEnvironments.login);
  const [sampleOptions, setSampleOptions] = useState({
    appId: '',
    userId: '',
    nickname: '',
    theme: ThemeType.light,
    compressionRate: 0.7,
    resizingHeight: '',
    resizingWidth: '',
    replyType: ReplyType.QUOTE_REPLY,
    channelType: ChannelType.GROUP,
    ...Object
      .entries(toggleItems)
      .reduce((acc, [path, item]) => ({
        ...acc,
        [path]: item.defaultValue,
      }), {})
  });

  useEffect(() => {
    if (isLoggedin) {
      const currentApp = globalEnvironments.apps?.[globalEnvironments.currentAppId];
      setSampleOptions({
        ...sampleOptions,
        ...currentApp.users?.[currentApp?.currentUserId],
      });
    } else {
      const currentAppId = globalEnvironments.currentAppId;
      const appIds = Object.keys(globalEnvironments.apps);
      if (currentAppId && appIds.includes(currentAppId)) {
        // if (appIdInputRef?.current) {
        //   appIdInputRef.current.value = currentAppId;
        // }
        // use current app info
        const currentApp = globalEnvironments.apps[currentAppId];
        const currentUserId = currentApp.currentUserId;
        const userIds = Object.keys(currentApp.users);
        if (currentUserId && userIds.includes(currentUserId)) {
          // if (userIdInputRef?.current) {
          //   userIdInputRef.current.value = currentUserId;
          // }
          // use current user info
          const userLoginInfo = currentApp.users[currentUserId];
          setSampleOptions({
            ...sampleOptions,
            ...userLoginInfo,
            userId: currentUserId,
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (appIdInputRef?.current) {
      appIdInputRef.current.value = sampleOptions.appId || globalEnvironments?.currentAppId;
    }
    if (userIdInputRef?.current) {
      userIdInputRef.current.value = sampleOptions.userId || globalEnvironments.apps?.[sampleOptions?.appId]?.currentUserId;
    }
  }, [appIdInputRef, userIdInputRef, sampleOptions.appId, sampleOptions.userId]);

  // Sendbird App
  if (isLoggedin) {
    return (
      <div className={`sendbird-integrated-sample-app sendbird-theme--${sampleOptions.theme}`}>
        <input value="Logout" type="button" onClick={() => {
          setIsLoggedin(false);
          storeCurrentSampleOptions({ store, sampleOptions, globalEnvironments });
        }} />
        <div style={{ height: 'calc(100% - 12px)' }}>
          {
            sampleOptions.channelType === ChannelType.GROUP && (
              <App
                appId={sampleOptions.appId}
                userId={sampleOptions.userId}
                nickname={sampleOptions.nickname}
                theme={sampleOptions.theme}
                allowProfileEdit
                showSearchIcon={sampleOptions.messageSearch}
                disableUserProfile={typeof sampleOptions.editUserProfile === 'boolean' ? !sampleOptions.editUserProfile : undefined}
                isMessageGroupingEnabled={sampleOptions.messageGrouping}
                isReactionEnabled={sampleOptions.emojiReaction}
                isMentionEnabled={sampleOptions.mention}
                isTypingIndicatorEnabledOnChannelList={sampleOptions.typingIndicator}
                isMessageReceiptStatusEnabledOnChannelList={sampleOptions.messageStatus}
                isVoiceMessageEnabled={sampleOptions.isVoiceMessageEnabled}
                isMultipleFilesMessageEnabled={sampleOptions.multipleFiles}
                uikitOptions={{
                  groupChannel: {
                    // enableTypingIndicator: false,
                    typingIndicatorTypes: new Set([TypingIndicatorType.Bubble, TypingIndicatorType.Text]),
                    enableFeedback: true, // This enables feedback message feature.
                    enableSuggestedReplies: true, // This enables suggested replies feature.
                    showSuggestedRepliesFor: 'all_messages', // This enables suggested replies should be displayed for all messages but not just the last message.
                  }
                }}
                imageCompression={{ compressionRate: sampleOptions.imageCompression ? 0.7 : 1 }}
                replyType={sampleOptions.replyType}
                config={{ logLevel: 'all' }}
                breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
                onProfileEditSuccess={(user) => {
                  const nextOptions = {
                    ...sampleOptions,
                    nickname: user.nickname,
                  };
                  setSampleOptions(nextOptions);
                  storeCurrentSampleOptions({ store, sampleOptions: nextOptions, globalEnvironments });
                }}
                stringSet={{
                  // CHANNEL_SETTING__MODERATION__REGISTER_AS_OPERATOR: '오퍼레이터 등록',
                  // CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR: '오퍼레이터 해제',
                  // CHANNEL_SETTING__MODERATION__MUTE: '유저 음소거',
                  // CHANNEL_SETTING__MODERATION__UNMUTE: '유저 음소거 해제',
                  // CHANNEL_SETTING__MODERATION__BAN: '유저 밴',
                  // CHANNEL_SETTING__MODERATION__UNBAN: '유저 언밴',
                  // BUTTON__CREATE: '만들다',
                  // BUTTON__INVITE: '초대하다',
                  // CHANNEL_SETTING__MODERATION__EMPTY_BAN: '차단된 된 유저가 아무도 없습니다',
                  // CHANNEL_SETTING__MODERATION__ALL_BAN: '차단된 유저 모두보기'
                }}
              />
            )
          }
          {
            sampleOptions.channelType === ChannelType.COMMUNITY && (
              <Community
                appId={sampleOptions.appId}
                userId={sampleOptions.userId}
                nickname={sampleOptions.nickname}
                theme={sampleOptions.theme}
              />
            )
          }
          {
            sampleOptions.channelType === ChannelType.LIVE && (
              <Streamnig
                appId={sampleOptions.appId}
                userId={sampleOptions.userId}
                nickname={sampleOptions.nickname}
                theme={sampleOptions.theme}
              />
            )
          }
        </div>
      </div>
    )
  }
  // Login Page
  return (
    <div
      className={`sendbird-integrated-sample-app sendbird-theme--${sampleOptions.theme}`}
      style={{
        backgroundColor: sampleOptions.theme === 'light' ? 'white' : 'black'
      }}
    >
      {/* We need it for helping QA team on mobile */}
      <MediaQueryProvider />
      <div className='sendbird-integrated-sample-app__title'>
        <Label
          type={LabelTypography.H_1}
          color={(sampleOptions.appId && sampleOptions.userId) ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_4}
        >
          Run Sendbird Group Channel Sample
        </Label>
      </div>
      <div className='sendbird-integrated-sample-app__moderations' >
        <ModerationOptionItem subTitle="App ID">
          <TextInput ref={appIdInputRef} disabled={sampleOptions.appId} />
        </ModerationOptionItem>
        {
          sampleOptions.appId
            ? (
              <ModerationOptionItem subTitle="User ID">
                <TextInput ref={userIdInputRef} disabled={sampleOptions.userId} />
              </ModerationOptionItem>
            )
            : (
              <div className='sendbird-integrated-app-submit-area'>
                <Button
                  onClick={() => {
                    setSampleOptions({
                      ...sampleOptions,
                      appId: appIdInputRef?.current.value,
                    });
                  }}
                >Next</Button>
              </div>
            )
        }
        {(sampleOptions.appId && sampleOptions.userId) && (<>
          <ModerationOptionItem subTitle="Nickname">
            <TextInput
              value={sampleOptions.nickname}
              onChange={(e) => {
                setSampleOptions({
                  ...sampleOptions,
                  nickname: e.target.value,
                });
              }}
            />
          </ModerationOptionItem>
          <ModerationOptionItem subTitle="Theme">
            <MultipleButtons
              options={ThemeType}
              value={sampleOptions.theme}
              onClick={(selectedOption) => {
                setSampleOptions({
                  ...sampleOptions,
                  theme: selectedOption,
                });
              }}
            />
          </ModerationOptionItem>
          <ModerationOptionItem
            subTitle="Reply Type"
            description={String(sampleOptions.replyType)}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {typeof sampleOptions.replyType !== 'undefined' &&
                <MultipleButtons
                  options={ReplyType}
                  value={sampleOptions.replyType}
                  onClick={(selectedOption) => {
                    setSampleOptions({
                      ...sampleOptions,
                      replyType: selectedOption,
                    })
                  }}
                />
              }
              {/** Checkbox is for setting the replyType value to 'undefined' */}
              <div style={{ marginLeft: 8 }}>
                <Checkbox
                  id="sampleOptions.replyType"
                  checked={sampleOptions.replyType}
                  onChange={() => {
                    setSampleOptions(prevOptions => ({
                      ...prevOptions,
                      replyType: prevOptions.replyType ? undefined : true,
                    }));
                  }}
                />
              </div>
            </div>
          </ModerationOptionItem>
          {Object.entries(toggleItems).map(([path, { title }]) => (
            <ModerationOptionItem key={path} subTitle={title} description={String(sampleOptions[path])} type={TYPES.TOGGLE}>
              {/** Toggle is for setting the value to true or false */}
              {typeof sampleOptions[path] === 'boolean' &&
                <ToggleButton
                  isEnabled={sampleOptions[path]}
                  onClick={() => {
                    setSampleOptions(prevOptions => ({
                      ...prevOptions,
                      [path]: !prevOptions[path],
                    }));
                  }}
                />
              }
              {/** Checkbox is for setting the value to 'undefined' */}
              <Checkbox
                id={path}
                checked={sampleOptions[path]}
                onChange={() => {
                  setSampleOptions(prevOptions => ({
                    ...prevOptions,
                    [path]: prevOptions[path] ? undefined : true,
                  }));
                }}
              />
            </ModerationOptionItem>
          ))}
          <ModerationOptionItem subTitle="Image Compression" type={TYPES.TOGGLE}>
            <ToggleButton
              isEnabled={sampleOptions.imageCompression}
              onClick={() => {
                setSampleOptions({
                  ...sampleOptions,
                  imageCompression: !sampleOptions.imageCompression,
                });
              }}
            />
            {
              sampleOptions.imageCompression && (
                <div className='sendbird-image-compression-box'>
                  {/* Compression Rate */}
                  <div className='sendbird-image-compression-box__item'>
                    <div className='sendbird-image-compression-box__item__name'>
                      <Label type={LabelTypography.SUBTITLE_2} color={LabelColors.ONBACKGROUND_4} >Compression Rate: 0.7</Label>
                    </div>
                    <div className='sendbird-image-compression-box__item__input'>

                    </div>
                  </div>
                  {/* Resizing Height */}
                  <div className='sendbird-image-compression-box__item'>
                    <div className='sendbird-image-compression-box__item__name'>
                      <Label type={LabelTypography.SUBTITLE_2} color={LabelColors.ONBACKGROUND_4} >Resizing Height</Label>
                    </div>
                    <div className='sendbird-image-compression-box__item__input'>

                    </div>
                  </div>
                  {/* Resizing Width */}
                  <div className='sendbird-image-compression-box__item'>
                    <div className='sendbird-image-compression-box__item__name'>
                      <Label type={LabelTypography.SUBTITLE_2} color={LabelColors.ONBACKGROUND_4} >Resizing Width</Label>
                    </div>
                    <div className='sendbird-image-compression-box__item__input'>

                    </div>
                  </div>
                </div>
              )
            }
          </ModerationOptionItem>
        </>)}
        {(sampleOptions.appId && !sampleOptions.userId) && (
          <div className='sendbird-integrated-app-submit-area'>
            <Button
              type={ButtonTypes.SECONDARY}
              onClick={() => {
                setSampleOptions({
                  ...sampleOptions,
                  appId: '',
                });
              }}
            >Modify AppId</Button>
            <Button
              onClick={() => {
                setSampleOptions({
                  ...sampleOptions,
                  userId: userIdInputRef?.current.value,
                });
              }}
            >Next</Button>
          </div>
        )}
        <ModerationOptionItem subTitle="Channel Type">
            <MultipleButtons
              options={ChannelType}
              value={sampleOptions.channelType}
              onClick={(selectedOption) => {
                setSampleOptions({
                  ...sampleOptions,
                  channelType: selectedOption,
                });
              }}
            />
          </ModerationOptionItem>
        {(sampleOptions.appId && sampleOptions.userId) && (
          <div className='sendbird-integrated-app-submit-area'>
            <Button
              type={ButtonTypes.SECONDARY}
              onClick={() => {
                setSampleOptions({
                  ...sampleOptions,
                  userId: '',
                });
              }}
            >Modify UserId</Button>
            <Button
              onClick={() => {
                setIsLoggedin(true);
                // save to Local Storage
                store.current.setItem(STORAGE_KEY, JSON.stringify({
                  login: true,
                  currentAppId: sampleOptions.appId,
                  apps: {
                    ...globalEnvironments?.apps,
                    [sampleOptions.appId]: {
                      currentUserId: sampleOptions.userId,
                      users: {
                        ...globalEnvironments?.apps?.[sampleOptions.appId]?.users,
                        [sampleOptions.userId]: sampleOptions,
                      },
                    },
                  },
                }));
              }}
            >RUN</Button>
          </div>
        )}
      </div>
      <div className='sendbird-integrated-sample-app__preview'></div>
    </div>
  );
};
