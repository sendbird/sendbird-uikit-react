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

export default function App(props) {
  const {
    appId,
    userId,
    accessToken,
    customApiHost,
    customWebSocketHost,
    mediaQueryBreakPoint,
    theme,
    userListQuery,
    nickname,
    profileUrl,
    dateLocale,
    config = {},
    isReactionEnabled,
    isMentionEnabled,
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
      mediaQueryBreakPoint={mediaQueryBreakPoint}
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
      onUserProfileMessage={(channel) => {
        setCurrentChannel(channel);
      }}
      isTypingIndicatorEnabledOnChannelList={isTypingIndicatorEnabledOnChannelList}
      isMessageReceiptStatusEnabledOnChannelList={isMessageReceiptStatusEnabledOnChannelList}
      replyType={replyType}
    >
      <AppLayout
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
        isReactionEnabled={isReactionEnabled}
        replyType={replyType}
        isMessageGroupingEnabled={isMessageGroupingEnabled}
        allowProfileEdit={allowProfileEdit}
        showSearchIcon={showSearchIcon}
        onProfileEditSuccess={onProfileEditSuccess}
        disableAutoSelect={disableAutoSelect}
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
  mediaQueryBreakPoint: PropTypes.string,
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
  isTypingIndicatorEnabledOnChannelList: PropTypes.bool,
  isMessageReceiptStatusEnabledOnChannelList: PropTypes.bool,
};

App.defaultProps = {
  accessToken: '',
  customApiHost: '',
  customWebSocketHost: '',
  theme: 'light',
  nickname: '',
  profileUrl: '',
  userListQuery: null,
  mediaQueryBreakPoint: null,
  dateLocale: null,
  allowProfileEdit: false,
  onProfileEditSuccess: null,
  disableUserProfile: false,
  disableMarkAsDelivered: false,
  showSearchIcon: false,
  renderUserProfile: null,
  config: {},
  isReactionEnabled: true,
  isMentionEnabled: false,
  replyType: 'NONE',
  isMessageGroupingEnabled: true,
  stringSet: null,
  colorSet: null,
  imageCompression: {},
  disableAutoSelect: false,
  isTypingIndicatorEnabledOnChannelList: false,
  isMessageReceiptStatusEnabledOnChannelList: false,
};
