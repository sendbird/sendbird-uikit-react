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
import { GroupChannel } from '@sendbird/chat/groupChannel';

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
  voiceRecord?: SendbirdProviderProps['voiceRecord'];
  isMultipleFilesMessageEnabled?: SendbirdProviderProps['isMultipleFilesMessageEnabled'];
  colorSet?: SendbirdProviderProps['colorSet'];
  stringSet?: SendbirdProviderProps['stringSet'];
  allowProfileEdit?: SendbirdProviderProps['allowProfileEdit'];
  disableMarkAsDelivered?: SendbirdProviderProps['disableMarkAsDelivered'];
  renderUserProfile?: SendbirdProviderProps['renderUserProfile'];
  imageCompression?: SendbirdProviderProps['imageCompression'];
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

  /** @deprecated Please use `uikitOptions.common.enableUsingDefaultUserProfile` instead * */
  disableUserProfile?: SendbirdProviderProps['disableUserProfile'];
  /** @deprecated Please use `uikitOptions.groupChannel.replyType` instead * */
  replyType?: SendbirdProviderProps['replyType'];
  /** @deprecated Please use `uikitOptions.groupChannel.enableReactions` instead * */
  isReactionEnabled?: SendbirdProviderProps['isReactionEnabled'];
  /** @deprecated Please use `uikitOptions.groupChannel.enableMention` instead * */
  isMentionEnabled?: SendbirdProviderProps['isMentionEnabled'];
  /** @deprecated Please use `uikitOptions.groupChannel.enableVoiceMessage` instead * */
  isVoiceMessageEnabled?: SendbirdProviderProps['isVoiceMessageEnabled'];
  /** @deprecated Please use `uikitOptions.groupChannelList.enableTypingIndicator` instead * */
  isTypingIndicatorEnabledOnChannelList?: SendbirdProviderProps['isTypingIndicatorEnabledOnChannelList'];
  /** @deprecated Please use `uikitOptions.groupChannelList.enableMessageReceiptStatus` instead * */
  isMessageReceiptStatusEnabledOnChannelList?: SendbirdProviderProps['isMessageReceiptStatusEnabledOnChannelList'];
  /** @deprecated Please use `uikitOptions.groupChannelSettings.enableMessageSearch` instead * */
  showSearchIcon?: SendbirdProviderProps['showSearchIcon'];
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
    isMultipleFilesMessageEnabled,
    isUserIdUsedForNickname = true,
    enableLegacyChannelModules = false,
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
    isTypingIndicatorEnabledOnChannelList,
    isMessageReceiptStatusEnabledOnChannelList,
  } = props;
  const [currentChannel, setCurrentChannel] = useState<GroupChannel | null>(null);

  return (
    <Sendbird
      stringSet={stringSet ?? undefined}
      appId={appId}
      userId={userId}
      accessToken={accessToken}
      customApiHost={customApiHost}
      customWebSocketHost={customWebSocketHost}
      breakpoint={breakpoint ?? undefined}
      theme={theme}
      nickname={nickname}
      profileUrl={profileUrl}
      dateLocale={dateLocale ?? undefined}
      userListQuery={userListQuery ?? undefined}
      config={config}
      colorSet={colorSet ?? undefined}
      disableMarkAsDelivered={disableMarkAsDelivered}
      renderUserProfile={renderUserProfile ?? undefined}
      imageCompression={imageCompression}
      isMultipleFilesMessageEnabled={isMultipleFilesMessageEnabled}
      voiceRecord={voiceRecord}
      onUserProfileMessage={(channel) => {
        setCurrentChannel(channel);
      }}
      uikitOptions={uikitOptions}
      isUserIdUsedForNickname={isUserIdUsedForNickname}
      sdkInitParams={sdkInitParams}
      customExtensionParams={customExtensionParams}
      eventHandlers={eventHandlers}
      isTypingIndicatorEnabledOnChannelList={
        isTypingIndicatorEnabledOnChannelList
      }
      isMessageReceiptStatusEnabledOnChannelList={
        isMessageReceiptStatusEnabledOnChannelList
      }
      replyType={replyType}
      showSearchIcon={showSearchIcon}
      disableUserProfile={disableUserProfile}
      isReactionEnabled={isReactionEnabled}
      isMentionEnabled={isMentionEnabled}
      isVoiceMessageEnabled={isVoiceMessageEnabled}
    >
      <AppLayout
        isMessageGroupingEnabled={isMessageGroupingEnabled}
        allowProfileEdit={allowProfileEdit}
        onProfileEditSuccess={onProfileEditSuccess ?? undefined}
        disableAutoSelect={disableAutoSelect}
        currentChannel={currentChannel ?? undefined}
        setCurrentChannel={setCurrentChannel}
        enableLegacyChannelModules={enableLegacyChannelModules}
        isReactionEnabled={isReactionEnabled}
        replyType={replyType}
        showSearchIcon={showSearchIcon}
      />
    </Sendbird>
  );
}
