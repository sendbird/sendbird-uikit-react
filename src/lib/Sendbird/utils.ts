import SendbirdChat, { DeviceOsPlatform, SendbirdChatWith, SendbirdPlatform, SendbirdProduct, SessionHandler } from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';
import { OpenChannelModule } from '@sendbird/chat/openChannel';

import type { AppInfoStore, CustomExtensionParams, SdkStore, SendbirdState, UserStore } from './types';
import { LoggerInterface } from '../Logger';

type UpdateAppInfoStoreType = (state: SendbirdState, payload: AppInfoStore) => SendbirdState;
export const updateAppInfoStore: UpdateAppInfoStoreType = (state, payload) => {
  return {
    ...state,
    stores: {
      ...state.stores,
      appInfoStore: {
        ...state.stores.appInfoStore,
        ...payload,
      },
    },
  };
};
type UpdateSdkStoreType = (state: SendbirdState, payload: Partial<SdkStore>) => SendbirdState;
export const updateSdkStore: UpdateSdkStoreType = (state, payload) => {
  return {
    ...state,
    stores: {
      ...state.stores,
      sdkStore: {
        ...state.stores.sdkStore,
        ...payload,
      },
    },
  };
};
type UpdateUserStoreType = (state: SendbirdState, payload: Partial<UserStore>) => SendbirdState;
export const updateUserStore: UpdateUserStoreType = (state, payload) => {
  return {
    ...state,
    stores: {
      ...state.stores,
      userStore: {
        ...state.stores.userStore,
        ...payload,
      },
    },
  };
};

export function initSDK({
  appId,
  customApiHost,
  customWebSocketHost,
  sdkInitParams = {},
}: {
  appId: string;
  customApiHost?: string;
  customWebSocketHost?: string;
  sdkInitParams?: Record<string, any>;
}) {
  const params = Object.assign(sdkInitParams, {
    appId,
    modules: [new GroupChannelModule(), new OpenChannelModule()],
    // newInstance: isNewApp,
    localCacheEnabled: true,
  });

  if (customApiHost) params.customApiHost = customApiHost;
  if (customWebSocketHost) params.customWebSocketHost = customWebSocketHost;
  return SendbirdChat.init(params);
}

const APP_VERSION_STRING = '__react_dev_mode__';
/**
 * Sets up the Sendbird SDK after initialization.
 * Configures necessary settings, adds extensions, sets the platform, and configures the session handler if provided.
 */
export function setupSDK(
  sdk: SendbirdChatWith<[GroupChannelModule, OpenChannelModule]>,
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
