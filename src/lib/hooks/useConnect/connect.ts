import { disconnectSdk } from './disconnectSdk';
import { setUpConnection } from './setupConnection';
import { ConnectTypes } from './types';

export async function connect({
  logger,
  sdkDispatcher,
  userDispatcher,
  uikitConfigDispatcher,
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
    uikitConfigDispatcher,
    sdk,
  });
  await setUpConnection({
    logger,
    sdkDispatcher,
    userDispatcher,
    uikitConfigDispatcher,
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
