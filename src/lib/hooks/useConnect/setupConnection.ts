import SendbirdChat from '@sendbird/chat';
import { OpenChannelModule } from '@sendbird/chat/openChannel';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';

import { SDK_ACTIONS } from '../../dux/sdk/actionTypes';
import { USER_ACTIONS } from '../../dux/user/actionTypes';
import { isTextuallyNull } from '../../../utils';
import { SetupConnectionTypes } from './types';

const { INIT_SDK, SET_SDK_LOADING, RESET_SDK, SDK_ERROR } = SDK_ACTIONS;
const { INIT_USER, UPDATE_USER_INFO, RESET_USER } = USER_ACTIONS;
const APP_VERSION_STRING = '__uikit_app_version__';
const IS_ROLLUP = '__is_rollup__';
const IS_ROLLUP_REPLACE = '__is_rollup_replace__';

export function setUpParams({
  appId,
  customApiHost,
  customWebSocketHost,
}: {
  appId: string;
  customApiHost?: string;
  customWebSocketHost?: string;
}): SendbirdChat {
  const params = {
    appId,
    modules: [
      new GroupChannelModule(),
      new OpenChannelModule(),
    ],
  };
  if (customApiHost) {
    params['customApiHost'] = customApiHost;
  }
  if (customWebSocketHost) {
    params['customWebSocketHost'] = customWebSocketHost;
  }
  const newSdk = SendbirdChat.init(params);
  return newSdk;
}

export function setUpConnection({
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
}: SetupConnectionTypes) {
  logger?.info?.('SendbirdProvider | useConnect/setupConnection/init', { userId, appId });
  sdkDispatcher({ type: SET_SDK_LOADING, payload: true });
  if (userId && appId) {
    const newSdk = setUpParams({
      appId,
      customApiHost,
      customWebSocketHost,
    });

    if (configureSession && typeof configureSession === 'function') {
      let sessionHandler = configureSession(newSdk);
      logger?.info?.('SendbirdProvider | useConnect/setupConnection/configureSession', sessionHandler);
      newSdk.setSessionHandler(sessionHandler);
    }
    // to check if code is released version from rollup and *not from storybook*
    // see rollup config file
    // @ts-ignore
    if (IS_ROLLUP === IS_ROLLUP_REPLACE) {
      logger?.info?.('SendbirdProvider | useConnect/setupConnection/setVersion', APP_VERSION_STRING);
      newSdk.addExtension('sb_uikit', APP_VERSION_STRING);
    }
    const connectCbSucess = (user) => {
      logger?.info?.('SendbirdProvider | useConnect/setupConnection/connectCbSucess', user);
      sdkDispatcher({ type: INIT_SDK, payload: newSdk });
      userDispatcher({ type: INIT_USER, payload: user });
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
          nickname: nickname || user.nickname,
          profileUrl: profileUrl || user.profileUrl,
        }).then((namedUser) => {
          logger?.info?.('SendbirdProvider | useConnect/setupConnection/updateCurrentUserInfo success', {
            nickname,
            profileUrl,
          });
          userDispatcher({ type: UPDATE_USER_INFO, payload: namedUser });
        });
      }
    };

    const connectCbError = (e) => {
      logger?.error?.('SendbirdProvider | useConnect/setupConnection/Connection failed', {
        e,
        appId,
        userId,
      });
      sdkDispatcher({ type: RESET_SDK });
      userDispatcher({ type: RESET_USER });
      sdkDispatcher({ type: SDK_ERROR });
    };

    if (accessToken) {
      logger?.info?.('SendbirdProvider | useConnect/setupConnection/connect has accessToken');
      newSdk.connect(userId, accessToken)
        .then((res) => connectCbSucess(res))
        .catch((err) => connectCbError(err));
    } else {
      logger?.info?.('SendbirdProvider | useConnect/setupConnection/connect no accessToken');
      newSdk.connect(userId)
        .then((res) => connectCbSucess(res))
        .catch((err) => connectCbError(err));
    }
  } else {
    sdkDispatcher({ type: SDK_ERROR });
    logger?.warning?.('SendbirdProvider | useConnect/setupConnection',
      `Connection failed UserId: ${userId} or appId: ${appId} missing`
    );
    logger?.warning?.('');
  }
}
