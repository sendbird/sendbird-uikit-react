import { useEffect } from 'react';

import { StaticTypes, TriggerTypes } from './types';
import { connect } from './connect';

export default function useConnect({
  userId,
  appId,
  accessToken,
}: TriggerTypes, {
  logger,
  nickname,
  profileUrl,
  configureSession,
  customApiHost,
  customWebSocketHost,
  sdk,
  sdkDispatcher,
  userDispatcher,
}: StaticTypes) {
  useEffect(() => {
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
}
