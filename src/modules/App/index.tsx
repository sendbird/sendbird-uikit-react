/**
 * This is a drop in Chat solution
 * Can also be used as an example for creating
 * default chat apps
 */
import React, { useState } from 'react';

import Sendbird, { SendbirdProviderProps } from '../../lib/Sendbird';

import { AppLayout } from './AppLayout';

import './index.scss';

import { AppLayoutProps } from './types';

export interface AppProps {
  appId: SendbirdProviderProps['appId'];
  userId: SendbirdProviderProps['userId'];
  accessToken?: SendbirdProviderProps['accessToken'];
  customApiHost?: SendbirdProviderProps['customApiHost'];
  customWebSocketHost?: SendbirdProviderProps['customWebSocketHost'];
  breakpoint?: SendbirdProviderProps['breakpoint'];
  theme?: SendbirdProviderProps['theme'];
  userListQuery?: SendbirdProviderProps['userListQuery'];
  nickname?: SendbirdProviderProps['nickname'];
  profileUrl?: SendbirdProviderProps['profileUrl'];
  dateLocale?: SendbirdProviderProps['dateLocale'];
  config?: SendbirdProviderProps['config'];
  isReactionEnabled?: SendbirdProviderProps['isReactionEnabled'];
  isMentionEnabled?: SendbirdProviderProps['isMentionEnabled'];
  isVoiceMessageEnabled?: SendbirdProviderProps['isVoiceMessageEnabled'];
  voiceRecord?: SendbirdProviderProps['voiceRecord'];
  replyType?: SendbirdProviderProps['replyType'];
  isMultipleFilesMessageEnabled?: SendbirdProviderProps['isMultipleFilesMessageEnabled'];
  colorSet?: SendbirdProviderProps['colorSet'];
  stringSet?: SendbirdProviderProps['stringSet'];
  allowProfileEdit?: SendbirdProviderProps['allowProfileEdit'];
  disableUserProfile?: SendbirdProviderProps['disableUserProfile'];
  disableMarkAsDelivered?: SendbirdProviderProps['disableMarkAsDelivered'];
  renderUserProfile?: SendbirdProviderProps['renderUserProfile'];
  showSearchIcon?: SendbirdProviderProps['showSearchIcon'];
  imageCompression?: SendbirdProviderProps['imageCompression'];
  isTypingIndicatorEnabledOnChannelList?: SendbirdProviderProps['isTypingIndicatorEnabledOnChannelList'];
  isMessageReceiptStatusEnabledOnChannelList?: SendbirdProviderProps['isMessageReceiptStatusEnabledOnChannelList'];
  uikitOptions?: SendbirdProviderProps['uikitOptions'];
  isUserIdUsedForNickname?: SendbirdProviderProps['isUserIdUsedForNickname'];
  sdkInitParams?: SendbirdProviderProps['sdkInitParams'];
  customExtensionParams?: SendbirdProviderProps['customExtensionParams'];
  eventHandlers?: SendbirdProviderProps['eventHandlers'];

  isMessageGroupingEnabled?: AppLayoutProps['isMessageGroupingEnabled'];
  disableAutoSelect?: AppLayoutProps['disableAutoSelect'];
  onProfileEditSuccess?: AppLayoutProps['onProfileEditSuccess'];

  /**
   * The default value is false.
   * If this option is enabled, it uses legacy modules (Channel, ChannelList) that are not applied local caching.
   * */
  enableLegacyChannelModules?: boolean;
}

export default function App(props: AppProps) {
  const {
    appId,
    userId,
    accessToken = '',
    customApiHost = '',
    customWebSocketHost = '',
    breakpoint = null,
    theme = 'light',
    userListQuery = null,
    nickname = '',
    profileUrl = '',
    dateLocale = null,
    config = {},
    voiceRecord,
    isMessageGroupingEnabled = true,
    colorSet = null,
    stringSet = null,
    allowProfileEdit = false,
    disableMarkAsDelivered = false,
    renderUserProfile = null,
    onProfileEditSuccess = null,
    imageCompression = {},
    disableAutoSelect = false,
    sdkInitParams,
    customExtensionParams,
    eventHandlers,
    uikitOptions,
    // The below configs are duplicates of the Dashboard UIKit Configs.
    // Since their default values will be set in the Sendbird component,
    // we don't need to set them here.
    showSearchIcon,
    isMentionEnabled,
    isReactionEnabled,
    replyType,
    disableUserProfile,
    isVoiceMessageEnabled,
    isMultipleFilesMessageEnabled,
    isTypingIndicatorEnabledOnChannelList,
    isMessageReceiptStatusEnabledOnChannelList,
    isUserIdUsedForNickname = true,
    enableLegacyChannelModules = false,
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
      isMultipleFilesMessageEnabled={isMultipleFilesMessageEnabled}
      voiceRecord={voiceRecord}
      onUserProfileMessage={(channel) => {
        setCurrentChannel(channel);
      }}
      isTypingIndicatorEnabledOnChannelList={
        isTypingIndicatorEnabledOnChannelList
      }
      isMessageReceiptStatusEnabledOnChannelList={
        isMessageReceiptStatusEnabledOnChannelList
      }
      replyType={replyType}
      showSearchIcon={showSearchIcon}
      uikitOptions={uikitOptions}
      isUserIdUsedForNickname={isUserIdUsedForNickname}
      sdkInitParams={sdkInitParams}
      customExtensionParams={customExtensionParams}
      eventHandlers={eventHandlers}
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
        enableLegacyChannelModules={enableLegacyChannelModules}
      />
    </Sendbird>
  );
}
