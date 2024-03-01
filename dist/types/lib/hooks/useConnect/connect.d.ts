import { ConnectTypes } from './types';
export declare function connect({ logger, sdkDispatcher, userDispatcher, initDashboardConfigs, userId, appId, customApiHost, customWebSocketHost, configureSession, nickname, profileUrl, accessToken, sdk, sdkInitParams, customExtensionParams, isMobile, eventHandlers, isUserIdUsedForNickname, }: ConnectTypes): Promise<void>;
