import { useCallback, useEffect } from 'react';

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
    });
  }, [userId, appId, accessToken]);
  const reconnect = useCallback(() => {
    logger?.info?.('SendbirdProvider | useConnect/reconnect/useCallback', { sdk });
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
    });
  }, [sdk]);
  return reconnect;
}
