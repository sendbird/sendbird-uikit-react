import { useContext, useMemo, useSyncExternalStore } from 'react';
import { SendbirdError, User } from '@sendbird/chat';

import { SendbirdContext } from '../SendbirdContext';
import { LoggerInterface } from '../../../Logger';
import { MessageTemplatesInfo, SendbirdState, WaitingTemplateKeyData } from '../../types';
import { initSDK, setupSDK, updateAppInfoStore, updateSdkStore, updateUserStore } from '../../utils';

const NO_CONTEXT_ERROR = 'No sendbird state value available. Make sure you are rendering `<SendbirdProvider>` at the top of your app.';
export const useSendbird = () => {
  const store = useContext(SendbirdContext);
  if (!store) throw new Error(NO_CONTEXT_ERROR);

  const state: SendbirdState = useSyncExternalStore(store.subscribe, store.getState);
  const actions = useMemo(() => ({
    /* Example: How to set the state basically */
    // exampleAction: () => {
    //   store.setState((state): SendbirdState => ({
    //     ...state,
    //     example: true,
    //   })),
    // },

    /* AppInfo */
    initMessageTemplateInfo: ({ payload }: { payload: MessageTemplatesInfo }) => {
      store.setState((state): SendbirdState => (
        updateAppInfoStore(state, {
          messageTemplatesInfo: payload,
          waitingTemplateKeysMap: {},
        })
      ));
    },
    upsertMessageTemplates: ({ payload }) => {
      const appInfoStore = state.stores.appInfoStore;
      const templatesInfo = appInfoStore.messageTemplatesInfo;
      if (!templatesInfo) return state; // Not initialized. Ignore.

      const waitingTemplateKeysMap = { ...appInfoStore.waitingTemplateKeysMap };
      payload.forEach((templatesMapData) => {
        const { key, template } = templatesMapData;
        templatesInfo.templatesMap[key] = template;
        delete waitingTemplateKeysMap[key];
      });
      store.setState((state): SendbirdState => (
        updateAppInfoStore(state, {
          waitingTemplateKeysMap,
          messageTemplatesInfo: templatesInfo,
        })
      ));
    },
    upsertWaitingTemplateKeys: ({ payload }) => {
      const appInfoStore = state.stores.appInfoStore;
      const { keys, requestedAt } = payload;
      const waitingTemplateKeysMap = { ...appInfoStore.waitingTemplateKeysMap };
      keys.forEach((key) => {
        waitingTemplateKeysMap[key] = {
          erroredMessageIds: waitingTemplateKeysMap[key]?.erroredMessageIds ?? [],
          requestedAt,
        };
      });
      store.setState((state): SendbirdState => (
        updateAppInfoStore(state, {
          waitingTemplateKeysMap,
        })
      ));
    },
    markErrorWaitingTemplateKeys: ({ payload }) => {
      const appInfoStore = state.stores.appInfoStore;
      const { keys, messageId } = payload;
      const waitingTemplateKeysMap = { ...appInfoStore.waitingTemplateKeysMap };
      keys.forEach((key) => {
        const waitingTemplateKeyData: WaitingTemplateKeyData | undefined = waitingTemplateKeysMap[key];
        if (waitingTemplateKeyData && waitingTemplateKeyData.erroredMessageIds.indexOf(messageId) === -1) {
          waitingTemplateKeyData.erroredMessageIds.push(messageId);
        }
      });
      store.setState((state): SendbirdState => (
        updateAppInfoStore(state, {
          waitingTemplateKeysMap,
        })
      ));
    },

    /* SDK */
    setSdkLoading: (payload) => {
      store.setState((state): SendbirdState => (
        updateSdkStore(state, {
          initialized: false,
          loading: payload,
        })
      ));
    },
    sdkError: () => {
      store.setState((state): SendbirdState => (
        updateSdkStore(state, {
          initialized: false,
          loading: false,
          error: true,
        })
      ));
    },
    initSdk: (payload) => {
      store.setState((state): SendbirdState => (
        updateSdkStore(state, {
          sdk: payload,
          initialized: true,
          loading: false,
          error: false,
        })
      ));
    },
    resetSdk: () => {
      store.setState((state): SendbirdState => (
        updateSdkStore(state, {
          sdk: null,
          initialized: false,
          loading: false,
          error: false,
        })
      ));
    },

    /* User */
    initUser: (payload) => {
      store.setState((state): SendbirdState => (
        updateUserStore(state, {
          initialized: true,
          loading: false,
          user: payload,
        })
      ));
    },
    resetUser: () => {
      store.setState((state): SendbirdState => (
        updateUserStore(state, {
          initialized: false,
          loading: false,
          user: null,
        })
      ));
    },
    updateUserInfo: (payload: User) => {
      store.setState((state): SendbirdState => (
        updateUserStore(state, {
          user: payload,
        })
      ));
    },

    /* Connection */
    connect: async (params) => {
      const {
        logger,
        userId,
        appId,
        accessToken,
        nickname,
        profileUrl,
        isMobile,
        sdkInitParams,
        customApiHost,
        customWebSocketHost,
        customExtensionParams,
        eventHandlers,
        initializeMessageTemplatesInfo,
        configureSession,
        initDashboardConfigs,
      } = params;

      // clean up previous ws connection
      await actions.disconnect({ logger });

      const sdk = initSDK({
        appId,
        customApiHost,
        customWebSocketHost,
        sdkInitParams,
      });

      setupSDK(sdk, {
        logger,
        isMobile,
        customExtensionParams,
        sessionHandler: configureSession ? configureSession(sdk) : undefined,
      });

      actions.setSdkLoading(true);

      try {
        const user = await sdk.connect(userId, accessToken);
        actions.initUser(user);

        if (nickname || profileUrl) {
          await sdk.updateCurrentUserInfo({
            nickname: nickname || user.nickname || '',
            profileUrl: profileUrl || user.profileUrl,
          });
        }

        await initializeMessageTemplatesInfo?.(sdk);
        await initDashboardConfigs?.(sdk);

        actions.initSdk(sdk);

        eventHandlers?.connection?.onConnected?.(user);
      } catch (error) {
        const sendbirdError = error as SendbirdError;
        actions.resetSdk();
        actions.resetUser();
        logger.error?.('SendbirdProvider | useSendbird/connect failed', sendbirdError);
        eventHandlers?.connection?.onFailed?.(sendbirdError);
      }
    },
    disconnect: async ({ logger }: { logger: LoggerInterface }) => {
      actions.setSdkLoading(true);

      const sdk = state.stores.sdkStore.sdk;

      if (sdk?.disconnectWebSocket) {
        await sdk.disconnectWebSocket();
      }

      actions.resetSdk();
      actions.resetUser();
      logger.info?.('SendbirdProvider | useSendbird/disconnect completed');
    },
  }), [store, state.stores.appInfoStore]);

  return { state, actions };
};

export default useSendbird;
