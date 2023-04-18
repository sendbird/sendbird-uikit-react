import { disconnectSdk } from "./disconnectSdk";
import { setUpConnection } from "./setupConnection";
import { ConnectTypes } from "./types";

export async function connect({
  logger,
  sdkDispatcher,
  userDispatcher,
  userId,
  appId,
  customApiHost,
  customWebSocketHost,
  configureSession,
  nickname,
  profileUrl,
  accessToken,
  sdk,
}: ConnectTypes) {
  await disconnectSdk({
    logger,
    sdkDispatcher,
    userDispatcher,
    sdk,
  });
  setUpConnection({
    logger,
    sdkDispatcher,
    userDispatcher,
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
