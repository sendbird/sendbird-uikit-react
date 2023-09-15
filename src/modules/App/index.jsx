/**
 * This is a drop in Chat solution
 * Can also be used as an example for creating
 * default chat apps
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Sendbird from '../../lib/Sendbird';

import { AppLayout } from './AppLayout';

import './index.scss';
import {
  DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT,
  VOICE_RECORDER_DEFAULT_MAX,
  VOICE_RECORDER_DEFAULT_MIN,
} from '../../utils/consts';

export default function App(props) {
  const {
    appId,
    userId,
    accessToken,
    customApiHost,
    customWebSocketHost,
    breakpoint,
    theme,
    userListQuery,
    nickname,
    profileUrl,
    dateLocale,
    config = {},
    isReactionEnabled,
    isMentionEnabled,
    isVoiceMessageEnabled,
    voiceRecord,
    replyType,
    isMessageGroupingEnabled,
    colorSet,
    stringSet,
    allowProfileEdit,
    disableUserProfile,
    disableMarkAsDelivered,
    renderUserProfile,
    showSearchIcon,
    onProfileEditSuccess,
    imageCompression,
    disableAutoSelect,
    isTypingIndicatorEnabledOnChannelList,
    isMessageReceiptStatusEnabledOnChannelList,
    uikitOptions,
    isUserIdUsedForNickname,
    sdkInitParams,
    customExtensionParams,
  } = props;
  const [currentChannel, setCurrentChannel] = useState(null);
  return (
    <Sendbird
      stringSet={stringSet}
      appId={appId}
      userId={userId}
      accessToken={accessToken}
      customApiHost={customApiHost}
      customWebSocketHost={customWebSocketHost}
      breakpoint={breakpoint}
      theme={theme}
      nickname={nickname}
      profileUrl={profileUrl}
      dateLocale={dateLocale}
      userListQuery={userListQuery}
      config={config}
      colorSet={colorSet}
      disableUserProfile={disableUserProfile}
      disableMarkAsDelivered={disableMarkAsDelivered}
      renderUserProfile={renderUserProfile}
      imageCompression={imageCompression}
      isReactionEnabled={isReactionEnabled}
      isMentionEnabled={isMentionEnabled}
      isVoiceMessageEnabled={isVoiceMessageEnabled}
      voiceRecord={voiceRecord}
      onUserProfileMessage={(channel) => {
        setCurrentChannel(channel);
      }}
      isTypingIndicatorEnabledOnChannelList={isTypingIndicatorEnabledOnChannelList}
      isMessageReceiptStatusEnabledOnChannelList={isMessageReceiptStatusEnabledOnChannelList}
      replyType={replyType}
      showSearchIcon={showSearchIcon}
      uikitOptions={uikitOptions}
      isUserIdUsedForNickname={isUserIdUsedForNickname}
      sdkInitParams={sdkInitParams}
      customExtensionParams={customExtensionParams}
    >
      <AppLayout
        isReactionEnabled={isReactionEnabled}
        replyType={replyType}
        showSearchIcon={showSearchIcon}
        isMessageGroupingEnabled={isMessageGroupingEnabled}
        allowProfileEdit={allowProfileEdit}
        onProfileEditSuccess={onProfileEditSuccess}
        disableAutoSelect={disableAutoSelect}
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
      />
    </Sendbird>
  );
}

App.propTypes = {
  appId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  accessToken: PropTypes.string,
  customApiHost: PropTypes.string,
  customWebSocketHost: PropTypes.string,
  theme: PropTypes.string,
  userListQuery: PropTypes.func,
  nickname: PropTypes.string,
  profileUrl: PropTypes.string,
  breakpoint: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.bool,
  ]),
  allowProfileEdit: PropTypes.bool,
  disableUserProfile: PropTypes.bool,
  disableMarkAsDelivered: PropTypes.bool,
  renderUserProfile: PropTypes.func,
  onProfileEditSuccess: PropTypes.func,
  dateLocale: PropTypes.shape({}),
  config: PropTypes.shape({
    // None Error Warning Info 'All/Debug'
    logLevel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    isREMUnitEnabled: PropTypes.bool,
  }),
  uikitOptions: PropTypes.shape({}),
  isReactionEnabled: PropTypes.bool,
  replyType: PropTypes.oneOf(['NONE', 'QUOTE_REPLY', 'THREAD']),
  showSearchIcon: PropTypes.bool,
  isMessageGroupingEnabled: PropTypes.bool,
  stringSet: PropTypes.objectOf(PropTypes.string),
  colorSet: PropTypes.objectOf(PropTypes.string),
  imageCompression: PropTypes.shape({
    compressionRate: PropTypes.number,
    resizingWidth: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    resizingHeight: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }),
  disableAutoSelect: PropTypes.bool,
  isMentionEnabled: PropTypes.bool,
  isVoiceMessageEnabled: PropTypes.bool,
  voiceRecord: PropTypes.shape({
    maxRecordingTime: PropTypes.number,
    minRecordingTime: PropTypes.number,
  }),
  isTypingIndicatorEnabledOnChannelList: PropTypes.bool,
  isMessageReceiptStatusEnabledOnChannelList: PropTypes.bool,
  isUserIdUsedForNickname: PropTypes.bool,
  sdkInitParams: PropTypes.shape({}),
  customExtensionParams: PropTypes.shape({}),
};

App.defaultProps = {
  accessToken: '',
  customApiHost: '',
  customWebSocketHost: '',
  theme: 'light',
  nickname: '',
  profileUrl: '',
  userListQuery: null,
  breakpoint: null,
  dateLocale: null,
  allowProfileEdit: false,
  onProfileEditSuccess: null,
  disableMarkAsDelivered: false,
  renderUserProfile: null,
  config: {},
  voiceRecord: {
    maxRecordingTime: VOICE_RECORDER_DEFAULT_MAX,
    minRecordingTime: VOICE_RECORDER_DEFAULT_MIN,
  },
  isMessageGroupingEnabled: true,
  stringSet: null,
  colorSet: null,
  imageCompression: {},
  disableAutoSelect: false,
  uikitOptions: undefined,
  // The below configs are duplicates of the Dashboard UIKit Configs.
  // Since their default values will be set in the Sendbird component,
  // we don't need to set them here.
  showSearchIcon: undefined,
  isMentionEnabled: undefined,
  isReactionEnabled: undefined,
  replyType: undefined,
  disableUserProfile: undefined,
  isVoiceMessageEnabled: undefined,
  isTypingIndicatorEnabledOnChannelList: undefined,
  isMessageReceiptStatusEnabledOnChannelList: undefined,
  isUserIdUsedForNickname: true,
  sdkInitParams: undefined,
  customExtensionParams: undefined,
};
