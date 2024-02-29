import { disconnectSdk } from './disconnectSdk';
import { setUpConnection } from './setupConnection';
import { ConnectTypes } from './types';

export async function connect({
  logger,
  sdkDispatcher,
  userDispatcher,
  appInfoDispatcher,
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
  sdkInitParams,
  customExtensionParams,
  isMobile,
  eventHandlers,
  isUserIdUsedForNickname,
  initializeMessageTemplatesInfo,
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
    appInfoDispatcher,
    initDashboardConfigs,
    userId,
    appId,
    customApiHost,
    customWebSocketHost,
    configureSession,
    nickname,
    profileUrl,
    accessToken,
    sdkInitParams,
    customExtensionParams,
    isMobile,
    eventHandlers,
    isUserIdUsedForNickname,
    initializeMessageTemplatesInfo,
  });
}
