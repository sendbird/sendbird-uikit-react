import { useCallback, useEffect } from 'react';

import { useUIKitConfig } from '../../UIKitConfigProvider';

import { ReconnectType, StaticTypes, TriggerTypes } from './types';
import { connect } from './connect';

export default function useConnect(triggerTypes: TriggerTypes, staticTypes: StaticTypes): ReconnectType {
  const { userId, appId, accessToken } = triggerTypes;
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
  } = staticTypes;
  logger?.info?.('SendbirdProvider | useConnect', { ...triggerTypes, ...staticTypes });

  const { initDashboardConfigs } = useUIKitConfig();

  useEffect(() => {
    logger?.info?.('SendbirdProvider | useConnect/useEffect', { userId, appId, accessToken });
    try {
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
      });
    } catch (error) {
      logger?.error?.('SendbirdProvider | useConnect/useEffect', error);
    }
  }, [userId, appId, accessToken]);
  const reconnect = useCallback(() => {
    logger?.info?.('SendbirdProvider | useConnect/reconnect/useCallback', { sdk });
    try {
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
      });
    } catch (error) {
      logger?.error?.('SendbirdProvider | useConnect/reconnect/useCallback', error);
    }
  }, [sdk]);
  return reconnect;
}
