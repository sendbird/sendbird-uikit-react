import Sb from 'sendbird';

import {
  INIT_SDK,
  SET_SDK_LOADING,
  RESET_SDK,
  SDK_ERROR,
} from './actionTypes';
import { INIT_USER, UPDATE_USER_INFO, RESET_USER } from '../user/actionTypes';
import { isTextuallyNull } from '../../../utils';

const APP_VERSION_STRING = '__uikit_app_version__';
const IS_ROLLUP = '__is_rollup__';
const IS_ROLLUP_REPLACE = '__is_rollup_replace__';

export const disconnectSdk = ({
  sdkDispatcher,
  userDispatcher,
  sdk,
  onDisconnect,
}) => {
  sdkDispatcher({ type: SET_SDK_LOADING, payload: true });
  if (sdk && sdk.disconnect) {
    sdk.disconnect()
      .then(() => {
        sdkDispatcher({ type: RESET_SDK });
        userDispatcher({ type: RESET_USER });
      })
      .finally(() => {
        onDisconnect();
      });
  } else {
    onDisconnect();
  }
};

export const handleConnection = ({
  userId,
  appId,
  nickname,
  profileUrl,
  accessToken,
  sdk,
  logger,
}, dispatchers) => {
  const {
    sdkDispatcher,
    userDispatcher,
  } = dispatchers;
  disconnectSdk({
    sdkDispatcher,
    userDispatcher,
    sdk,
    logger,
    onDisconnect: () => {
      logger.info('Setup connection');
      sdkDispatcher({ type: SET_SDK_LOADING, payload: true });
      if (userId && appId) {
        const newSdk = new Sb({ appId });
        // to check if code is released version from rollup and *not from storybook*
        // see rollup config file
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
            newSdk.updateCurrentUserInfo(nickname || user.nickname, profileUrl || user.profileUrl)
              .then((namedUser) => {
                userDispatcher({ type: UPDATE_USER_INFO, payload: namedUser });
              });
          }
        };

        const connectCbError = (e) => {
          logger.error('Connection failed', `${e}`);
          sdkDispatcher({ type: RESET_SDK });
          sdkDispatcher({ type: RESET_USER });
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
    },
  });
};
