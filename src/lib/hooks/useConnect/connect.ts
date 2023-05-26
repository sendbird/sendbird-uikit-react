import { disconnectSdk } from './disconnectSdk';
import { setUpConnection } from './setupConnection';
import { ConnectTypes } from './types';

export async function connect({
  logger,
  sdkDispatcher,
  userDispatcher,
  initDashboardConfigs,
  userId,
  appId,
  customApiHost,
  customWebSocketHost,
  configureSession,
  nickname,
  profileUrl,
  accessToken,
  sdk,
}: ConnectTypes): Promise<void> {
  await disconnectSdk({
    logger,
    sdkDispatcher,
    userDispatcher,
    sdk,
  });
  await setUpConnection({
    logger,
    sdkDispatcher,
    userDispatcher,
    initDashboardConfigs,
    userId,
    appId,
    customApiHost,
    customWebSocketHost,
    configureSession,
    nickname,
    profileUrl,
    accessToken,
  });
}
