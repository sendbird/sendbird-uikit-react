import SendbirdChat from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';
import { OpenChannelModule } from '@sendbird/chat/openChannel';

import type { AppInfoStore, SdkStore, SendbirdState, UserStore } from "./types";

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
      sdkStore: {
        ...state.stores.sdkStore,
        ...payload,
      },
    },
  };
};

export function initSDK({
  appId,
  customApiHost,
  customWebSocketHost,
  sdkInitParams,
}: {
  appId: string;
  customApiHost?: string;
  customWebSocketHost?: string;
  sdkInitParams?: Record<string, any>;
}) {
  return SendbirdChat.init({
    appId,
    modules: [new GroupChannelModule(), new OpenChannelModule()],
    customApiHost,
    customWebSocketHost,
    ...sdkInitParams,
  });
}

export function setupSDK(sdk, { logger, sessionHandler, isMobile, customExtensionParams }) {
  const platform = isMobile ? 'MOBILE_WEB' : 'WEB';
  sdk.addExtension('sb_uikit', 'v1.0');
  sdk.addSendbirdExtensions([{ product: 'UIKIT_CHAT', platform }], customExtensionParams);

  if (sessionHandler) {
    sdk.setSessionHandler(sessionHandler);
  }

  logger.info?.('SDK setup completed');
}
