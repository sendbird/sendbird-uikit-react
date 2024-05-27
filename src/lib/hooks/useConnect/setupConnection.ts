import SendbirdChat, {
  DeviceOsPlatform,
  SendbirdChatWith,
  SendbirdError,
  SendbirdErrorCode,
  SendbirdPlatform,
  SendbirdProduct,
  SessionHandler,
  User,
} from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';

import { SDK_ACTIONS } from '../../dux/sdk/actionTypes';
import { USER_ACTIONS } from '../../dux/user/actionTypes';

import { isTextuallyNull } from '../../../utils';

import { SetupConnectionTypes } from './types';
import { CustomExtensionParams, SendbirdChatInitParams } from '../../types';
import { LoggerInterface } from '../../Logger';

import pkg from '../../../../package.json';

const APP_VERSION_STRING: string = pkg.version;

const { INIT_SDK, SET_SDK_LOADING, RESET_SDK, SDK_ERROR } = SDK_ACTIONS;
const { INIT_USER, UPDATE_USER_INFO, RESET_USER } = USER_ACTIONS;

export function getMissingParamError({ userId, appId }: { userId?: string; appId?: string }): string {
  return `SendbirdProvider | useConnect/setupConnection/Connection failed UserId: ${userId} or appId: ${appId} missing`;
}
export function getConnectSbError(error?: SendbirdError): string {
  return `SendbirdProvider | useConnect/setupConnection/Connection failed. ${error?.code || ''} ${error?.message || ''}`;
}

export async function setUpConnection({
  logger,
  sdkDispatcher,
  userDispatcher,
  initDashboardConfigs,
  userId,
  appId,
  isNewApp,
  customApiHost,
  customWebSocketHost,
  configureSession,
  nickname,
  profileUrl,
  accessToken,
  isUserIdUsedForNickname,
  sdkInitParams,
  customExtensionParams,
  isMobile = false,
  eventHandlers,
  initializeMessageTemplatesInfo,
}: SetupConnectionTypes): Promise<void> {
  logger.info?.('SendbirdProvider | useConnect/setupConnection/init', { userId, appId });
  sdkDispatcher({ type: SET_SDK_LOADING, payload: true });

  if (!userId || !appId) {
    const errorMessage = getMissingParamError({ userId, appId });
    logger.error?.(errorMessage);
    sdkDispatcher({ type: SDK_ERROR });
    return Promise.reject(errorMessage);
  }

  return new Promise((resolve, reject) => {
    logger.info?.(`SendbirdProvider | useConnect/setupConnection/connect connecting using ${accessToken ?? userId}`);

    const sdk = initSDK({ appId, customApiHost, customWebSocketHost, isNewApp, sdkInitParams });
    const sessionHandler = typeof configureSession === 'function' ? configureSession(sdk) : undefined;
    setupSDK(sdk, { logger, sessionHandler, customExtensionParams, isMobile });

    sdk
      .connect(userId, accessToken)
      .then((user) => onConnected(user))
      .catch(async (error) => {
        // NOTE: The part that connects via the SDK must be callable directly by the customer.
        //  we should refactor this in next major version.
        if (shouldRetryWithValidSessionToken(error) && sessionHandler) {
          try {
            const sessionToken = await new Promise(sessionHandler.onSessionTokenRequired);
            if (sessionToken) {
              logger.info?.(
                `SendbirdProvider | useConnect/setupConnection/connect retry connect with valid session token: ${sessionToken.slice(0, 10) + '...'}`,
              );
              const user = await sdk.connect(userId, sessionToken);
              return onConnected(user);
            }
          } catch (error) {
            // NOTE: Filter out the error from `onSessionTokenRequired`.
            if (error instanceof SendbirdError) {
              // connect in offline mode
              // if (sdk.isCacheEnabled && sdk.currentUser) return onConnected(sdk.currentUser);
              return onConnectFailed(error);
            }
          }
        }

        return onConnectFailed(error);
      });

    const onConnected = async (user: User) => {
      logger.info?.('SendbirdProvider | useConnect/setupConnection/onConnected', user);
      sdkDispatcher({ type: INIT_SDK, payload: sdk });
      userDispatcher({ type: INIT_USER, payload: user });

      try {
        await initializeMessageTemplatesInfo(sdk);
      } catch (error) {
        logger.error?.('SendbirdProvider | useConnect/setupConnection/upsertMessageTemplateListInLocalStorage failed', { error });
      }

      try {
        await initDashboardConfigs(sdk);
        logger.info?.('SendbirdProvider | useConnect/setupConnection/getUIKitConfiguration success');
      } catch (error) {
        logger.error?.('SendbirdProvider | useConnect/setupConnection/getUIKitConfiguration failed', { error });
      }

      try {
        // use nickname/profileUrl if provided or set userID as nickname
        if ((nickname !== user.nickname || profileUrl !== user.profileUrl) && !(isTextuallyNull(nickname) && isTextuallyNull(profileUrl))) {
          logger.info?.('SendbirdProvider | useConnect/setupConnection/updateCurrentUserInfo', { nickname, profileUrl });
          const updateParams = {
            nickname: nickname || user.nickname || (isUserIdUsedForNickname ? user.userId : ''),
            profileUrl: profileUrl || user.profileUrl,
          };

          const updatedUser = await sdk.updateCurrentUserInfo(updateParams);
          logger.info?.('SendbirdProvider | useConnect/setupConnection/updateCurrentUserInfo success', updateParams);
          userDispatcher({ type: UPDATE_USER_INFO, payload: updatedUser });
        }
      } catch {
        // NO-OP
      }

      resolve();
      eventHandlers?.connection?.onConnected?.(user);
    };

    const onConnectFailed = async (e: SendbirdError) => {
      if (sdk.isCacheEnabled && shouldClearCache(e)) {
        logger.error?.(`SendbirdProvider | useConnect/setupConnection/connect clear cache [${e.code}/${e.message}]`);
        await sdk.clearCachedData();
      }

      const errorMessage = getConnectSbError(e);
      logger.error?.(errorMessage, { e, appId, userId });
      userDispatcher({ type: RESET_USER });
      sdkDispatcher({ type: RESET_SDK });
      sdkDispatcher({ type: SDK_ERROR });

      reject(errorMessage);
      eventHandlers?.connection?.onFailed?.(e);
    };
  });
}

/**
 * Initializes the Sendbird SDK with the provided parameters.
 * */
export function initSDK({
  appId,
  isNewApp = false,
  customApiHost,
  customWebSocketHost,
  sdkInitParams = {},
}: {
  appId: string;
  isNewApp?: boolean;
  customApiHost?: string;
  customWebSocketHost?: string;
  sdkInitParams?: SendbirdChatInitParams;
  customExtensionParams?: CustomExtensionParams;
}) {
  const params = Object.assign(sdkInitParams, {
    appId,
    modules: [new GroupChannelModule()],
    newInstance: isNewApp,
    localCacheEnabled: true,
  });

  if (customApiHost) params.customApiHost = customApiHost;
  if (customWebSocketHost) params.customWebSocketHost = customWebSocketHost;
  return SendbirdChat.init(params);
}

/**
 * Sets up the Sendbird SDK after initialization.
 * Configures necessary settings, adds extensions, sets the platform, and configures the session handler if provided.
 */
function setupSDK(
  sdk: SendbirdChatWith<[GroupChannelModule]>,
  params: { logger: LoggerInterface; sessionHandler?: SessionHandler; isMobile?: boolean; customExtensionParams?: CustomExtensionParams },
) {
  const { logger, sessionHandler, isMobile, customExtensionParams } = params;

  logger.info?.('SendbirdProvider | useConnect/setupConnection/setVersion', { version: APP_VERSION_STRING });
  sdk.addExtension('sb_uikit', APP_VERSION_STRING);
  sdk.addSendbirdExtensions(
    [{ product: SendbirdProduct.UIKIT_CHAT, version: APP_VERSION_STRING, platform: SendbirdPlatform?.JS }],
    { platform: isMobile ? DeviceOsPlatform.MOBILE_WEB : DeviceOsPlatform.WEB },
    customExtensionParams,
  );
  if (sessionHandler) {
    logger.info?.('SendbirdProvider | useConnect/setupConnection/configureSession', sessionHandler);
    sdk.setSessionHandler(sessionHandler);
  }
}

function shouldClearCache(error: unknown): error is SendbirdError {
  if (!(error instanceof SendbirdError)) return false;

  return [
    SendbirdErrorCode.USER_AUTH_DEACTIVATED,
    SendbirdErrorCode.USER_AUTH_DELETED_OR_NOT_FOUND,
    SendbirdErrorCode.SESSION_TOKEN_EXPIRED,
    SendbirdErrorCode.SESSION_REVOKED,
  ].includes(error.code);
}

function shouldRetryWithValidSessionToken(error: unknown): error is SendbirdError {
  if (!(error instanceof SendbirdError)) return false;

  return [
    SendbirdErrorCode.SESSION_TOKEN_EXPIRED,
    /**
     * Note: INVALID_TOKEN has been added arbitrarily due to legacy constraints
     *
     * In the useEffect of the useConnect hook, authentication is being performed
     * but changes of the `accessToken` is not being detected.
     * `disconnectSdk` is called when connect is called redundantly for the same user ID, causing issues, so `accessToken` has been excluded form the deps.
     *
     * In case the `accessToken` is missed, an additional attempt to connect is made
     * */
    SendbirdErrorCode.INVALID_TOKEN,
  ].includes(error.code);
}
