import { useCallback, useEffect } from 'react';

import { ReconnectType, StaticTypes, TriggerTypes } from './types';
import { connect } from './connect';

export default function useConnect(triggerTypes: TriggerTypes, staticTypes: StaticTypes): ReconnectType {
  const { userId, appId, accessToken, isMobile, isUserIdUsedForNickname } = triggerTypes;
  const {
    logger,
    nickname,
    profileUrl,
    configureSession,
    customApiHost,
    customWebSocketHost,
    sdk,
    sdkDispatcher,
    userDispatcher,
    initDashboardConfigs,
    sdkInitParams,
    customExtensionParams,
    eventHandlers,
  } = staticTypes;
  logger?.info?.('SendbirdProvider | useConnect', { ...triggerTypes, ...staticTypes });

  useEffect(() => {
    logger?.info?.('SendbirdProvider | useConnect/useEffect', { userId, appId, accessToken });
    connect({
      userId,
      appId,
      accessToken,
      logger,
      nickname,
      profileUrl,
      configureSession,
      customApiHost,
      customWebSocketHost,
      sdk,
      sdkDispatcher,
      userDispatcher,
      initDashboardConfigs,
      isUserIdUsedForNickname,
      sdkInitParams,
      customExtensionParams,
      isMobile,
      eventHandlers,
    }).catch(error => {
      logger?.error?.('SendbirdProvider | useConnect/useEffect', error);
    });
  }, [userId, appId]);
  const reconnect = useCallback(async () => {
    logger?.info?.('SendbirdProvider | useConnect/reconnect/useCallback', { sdk });

    try {
      await connect({
        userId,
        appId,
        accessToken,
        logger,
        nickname,
        profileUrl,
        configureSession,
        customApiHost,
        customWebSocketHost,
        sdk,
        sdkDispatcher,
        userDispatcher,
        initDashboardConfigs,
        isUserIdUsedForNickname,
        sdkInitParams,
        customExtensionParams,
        isMobile,
        eventHandlers,
      });
    } catch (error) {
      logger?.error?.('SendbirdProvider | useConnect/reconnect/useCallback', error);
    }
  }, [sdk]);
  return reconnect;
}
