import SendbirdChat, { DeviceOsPlatform, SendbirdError, SendbirdPlatform, SendbirdProduct, User } from '@sendbird/chat';
import { OpenChannelModule } from '@sendbird/chat/openChannel';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';

import { SDK_ACTIONS } from '../../dux/sdk/actionTypes';
import { USER_ACTIONS } from '../../dux/user/actionTypes';

import { isTextuallyNull } from '../../../utils';

import { SetupConnectionTypes } from './types';
import { CustomExtensionParams, SendbirdChatInitParams } from '../../types';

const APP_VERSION_STRING = '__react_dev_mode__';

const { INIT_SDK, SET_SDK_LOADING, RESET_SDK, SDK_ERROR } = SDK_ACTIONS;
const { INIT_USER, UPDATE_USER_INFO, RESET_USER } = USER_ACTIONS;

export function getMissingParamError({ userId, appId }: { userId?: string, appId?: string }): string {
  return `SendbirdProvider | useConnect/setupConnection/Connection failed UserId: ${userId} or appId: ${appId} missing`;
}
export function getConnectSbError(error?: SendbirdError): string {
  return `SendbirdProvider | useConnect/setupConnection/Connection failed. ${error?.code || ''} ${error?.message || ''}`;
}

export function setUpParams({
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
    modules: [new GroupChannelModule(), new OpenChannelModule()],
    newInstance: isNewApp,
    localCacheEnabled: true,
  });

  if (customApiHost) params.customApiHost = customApiHost;
  if (customWebSocketHost) params.customWebSocketHost = customWebSocketHost;
  return SendbirdChat.init(params);
}

// Steps
// 1. Check if minimum userID/appID is provided
//  1.a. If not, throw error > !reject
//  1.b. If yes, continue
// 2. Set up params with custom host if provided
// 3. Set up session handler if provided
// 4. Set up version
// 5. Connect to Sendbird -> either using user ID or (user ID + access token)
// 6. If connected, connectCbSucess
//  6.a check if nickname is to be updated -> no > !resolve immediately
//  6.b check if nickname is to be updated -> yes > update nickname > !resolve
// 7. If not connected, connectCbError > !reject
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
  return new Promise((resolve, reject) => {
    logger?.info?.('SendbirdProvider | useConnect/setupConnection/init', { userId, appId });
    const onConnectionFailed = eventHandlers?.connection?.onFailed;
    sdkDispatcher({ type: SET_SDK_LOADING, payload: true });

    if (userId && appId) {
      const newSdk = setUpParams({
        appId,
        customApiHost,
        customWebSocketHost,
        isNewApp,
        sdkInitParams,
      });

      if (configureSession && typeof configureSession === 'function') {
        const sessionHandler = configureSession(newSdk);
        logger?.info?.('SendbirdProvider | useConnect/setupConnection/configureSession', sessionHandler);
        newSdk.setSessionHandler(sessionHandler);
      }

      logger?.info?.('SendbirdProvider | useConnect/setupConnection/setVersion', { version: APP_VERSION_STRING });
      /**
       * Keep optional chaining to the addSendbirdExtensions
       * for supporting the ChatSDK v4.9.5 or less
       */
      newSdk?.addSendbirdExtensions?.(
        [
          {
            product: SendbirdProduct?.UIKIT_CHAT ?? 'uikit-chat' as SendbirdProduct,
            version: APP_VERSION_STRING,
            platform: SendbirdPlatform?.JS ?? 'js' as SendbirdPlatform,
          },
        ],
        {
          platform: (isMobile
            ? DeviceOsPlatform?.MOBILE_WEB ?? 'mobile_web'
            : DeviceOsPlatform?.WEB ?? 'web') as DeviceOsPlatform,
        },
        customExtensionParams,
      );

      newSdk.addExtension('sb_uikit', APP_VERSION_STRING);

      const connectCbSuccess = async (user: User) => {
        logger?.info?.('SendbirdProvider | useConnect/setupConnection/connectCbSuccess', user);
        sdkDispatcher({ type: INIT_SDK, payload: newSdk });
        userDispatcher({ type: INIT_USER, payload: user });

        try {
          await initializeMessageTemplatesInfo(newSdk);
        } catch (error) {
          logger?.error?.('SendbirdProvider | useConnect/setupConnection/upsertMessageTemplateListInLocalStorage failed', {
            error,
          });
        }

        initDashboardConfigs(newSdk)
          .then(config => {
            logger?.info?.('SendbirdProvider | useConnect/setupConnection/getUIKitConfiguration success', {
              config,
            });
          })
          .catch(error => {
            logger?.error?.('SendbirdProvider | useConnect/setupConnection/getUIKitConfiguration failed', {
              error,
            });
          });

        // use nickname/profileUrl if provided
        // or set userID as nickname
        if ((nickname !== user.nickname || profileUrl !== user.profileUrl)
          && !(isTextuallyNull(nickname) && isTextuallyNull(profileUrl))
        ) {
          logger?.info?.('SendbirdProvider | useConnect/setupConnection/updateCurrentUserInfo', {
            nickname,
            profileUrl,
          });
          newSdk.updateCurrentUserInfo({
            nickname: nickname || user.nickname || (isUserIdUsedForNickname ? user.userId : ''),
            profileUrl: profileUrl || user.profileUrl,
          }).then((namedUser) => {
            logger?.info?.('SendbirdProvider | useConnect/setupConnection/updateCurrentUserInfo success', {
              nickname,
              profileUrl,
            });
            userDispatcher({ type: UPDATE_USER_INFO, payload: namedUser });
          }).finally(() => {
            resolve();
          });
        } else {
          resolve();
        }
      };

      const connectCbError = (e: SendbirdError) => {
        const errorMessage = getConnectSbError(e);
        logger?.error?.(errorMessage, {
          e,
          appId,
          userId,
        });
        sdkDispatcher({ type: RESET_SDK });
        userDispatcher({ type: RESET_USER });

        sdkDispatcher({ type: SDK_ERROR });
        onConnectionFailed?.(e);
        // exit promise with error
        reject(errorMessage);
      };

      logger?.info?.(`SendbirdProvider | useConnect/setupConnection/connect connecting using ${accessToken ?? userId}`);
      newSdk.connect(userId, accessToken)
        .then((res) => connectCbSuccess(res))
        .catch((err) => connectCbError(err));
    } else {
      const errorMessage = getMissingParamError({ userId, appId });
      sdkDispatcher({ type: SDK_ERROR });
      onConnectionFailed?.({ message: errorMessage } as SendbirdError);
      logger?.error?.(errorMessage);
      // exit promise with error
      reject(errorMessage);
    }
  });
}
