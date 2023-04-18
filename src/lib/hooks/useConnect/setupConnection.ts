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

export function setUpConnection ({
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
  logger.info('Setup connection');
  let sessionHandler = null;
  sdkDispatcher({ type: SET_SDK_LOADING, payload: true });
  if (userId && appId) {
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
    if (configureSession && typeof configureSession === 'function') {
      sessionHandler = configureSession(newSdk);
      newSdk.setSessionHandler(sessionHandler);
    }
    // to check if code is released version from rollup and *not from storybook*
    // see rollup config file
    // @ts-ignore
    if (IS_ROLLUP === IS_ROLLUP_REPLACE) {
      newSdk.addExtension('sb_uikit', APP_VERSION_STRING);
    }
    const connectCbSucess = (user) => {
      sdkDispatcher({ type: INIT_SDK, payload: newSdk });
      userDispatcher({ type: INIT_USER, payload: user });
      // use nickname/profileUrl if provided
      // or set userID as nickname
      if ((nickname !== user.nickname || profileUrl !== user.profileUrl)
        && !(isTextuallyNull(nickname) && isTextuallyNull(profileUrl))
      ) {
        newSdk.updateCurrentUserInfo({
          nickname: nickname || user.nickname,
          profileUrl: profileUrl || user.profileUrl,
        }).then((namedUser) => {
          userDispatcher({ type: UPDATE_USER_INFO, payload: namedUser });
        });
      }
    };

    const connectCbError = (e) => {
      logger.error('Connection failed', `${e}`);
      sdkDispatcher({ type: RESET_SDK });
      userDispatcher({ type: RESET_USER });
      sdkDispatcher({ type: SDK_ERROR });
    };

    if (accessToken) {
      newSdk.connect(userId, accessToken)
        .then((res) => connectCbSucess(res))
        .catch((err) => connectCbError(err));
    } else {
      newSdk.connect(userId)
        .then((res) => connectCbSucess(res))
        .catch((err) => connectCbError(err));
    }
  } else {
    sdkDispatcher({ type: SDK_ERROR });
    logger.warning('Connection failed', 'UserId or appId missing');
  }
}
