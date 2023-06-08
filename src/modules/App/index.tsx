/**
 * This is a drop in Chat solution
 * Can also be used as an example for creating
 * default chat apps
 */
import React, { useState } from 'react';
import type { Locale } from 'date-fns';

import Sendbird from '../../lib/Sendbird';
import type SendBirdTypes from '../../types';

import { AppLayout } from './AppLayout';

import './index.scss';
import { VOICE_RECORDER_DEFAULT_MAX, VOICE_RECORDER_DEFAULT_MIN } from '../../utils/consts';
import { ReplyType } from '../../types';

interface Props {
  // Required
  appId: string;
  userId: string;

  // Optional
  accessToken?: string;
  customApiHost?: string;
  customWebSocketHost?: string;
  breakpoint?: string | boolean;
  theme?: 'light' | 'dark';
  userListQuery?: SendBirdTypes.UserListQuery;
  nickname?: string;
  profileUrl?: string;
  dateLocale?: Locale,
  allowProfileEdit?: boolean;
  onProfileEditSuccess?: () => void;
  config?: {
    logLevel: string | string[];
    isREMUnitEnabled: boolean;
  };
  voiceRecord?: {
    maxRecordingTime: number;
    minRecordingTime: number;
  };
  imageCompression?: {
    compressionRate: number,
    resizingWidth: number | string;
    resizingHeight: number | string;
  };
  disableAutoSelect?: boolean;
  isMessageGroupingEnabled?: boolean,
  colorSet?: Record<string, string>;
  stringSet?: Record<string, string>;
  disableMarkAsDelivered?: boolean;
  renderUserProfile?: () => React.ReactElement;

  replyType?: ReplyType;
  isMentionEnabled?: boolean;
  isReactionEnabled?: boolean;
  disableUserProfile?: boolean;
  isVoiceMessageEnabled?: boolean;
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
  showSearchIcon?: boolean;
}
export default function App(props: Props) {
  const {
    appId,
    userId,
    accessToken = '',
    customApiHost = '',
    customWebSocketHost = '',
    breakpoint,
    theme = 'light',
    userListQuery,
    nickname = '',
    profileUrl = '',
    dateLocale,
    config = {},
    voiceRecord = {
      maxRecordingTime: VOICE_RECORDER_DEFAULT_MAX,
      minRecordingTime: VOICE_RECORDER_DEFAULT_MIN,
    },
    isMessageGroupingEnabled = true,
    colorSet,
    stringSet,
    allowProfileEdit = false,
    disableMarkAsDelivered = false,
    renderUserProfile,
    onProfileEditSuccess,
    imageCompression = {},
    disableAutoSelect = false,

    // The below configs are duplicates of the Dashboard UIKit Configs.
    // Since their default values will be set in the Sendbird component, we don't need to set them here.
    disableUserProfile,
    replyType,
    showSearchIcon,
    isReactionEnabled,
    isMentionEnabled,
    isVoiceMessageEnabled,
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
    >
      <AppLayout
        isReactionEnabled={isReactionEnabled}
        replyType={replyType}
        isMessageGroupingEnabled={isMessageGroupingEnabled}
        allowProfileEdit={allowProfileEdit}
        showSearchIcon={showSearchIcon}
        onProfileEditSuccess={onProfileEditSuccess}
        disableAutoSelect={disableAutoSelect}
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
      />
    </Sendbird>
  );
}
