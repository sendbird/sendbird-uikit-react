import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useCallback, useContext, useMemo } from 'react';
import { SendbirdError, User } from '@sendbird/chat';

import { SendbirdContext } from '../SendbirdContext';
import { LoggerInterface } from '../../../Logger';
import { MessageTemplatesInfo, SdkStore, SendbirdState, WaitingTemplateKeyData } from '../../types';
import { initSDK, setupSDK, updateAppInfoStore, updateSdkStore, updateUserStore } from '../../utils';

const NO_CONTEXT_ERROR = 'No sendbird state value available. Make sure you are rendering `<SendbirdProvider>` at the top of your app.';
export const useSendbird = () => {
  const store = useContext(SendbirdContext);
  if (!store) throw new Error(NO_CONTEXT_ERROR);
  const state: SendbirdState = useSyncExternalStore(store.subscribe, store.getState);

  /* AppInfo */
  const appInfoActions = {
    initMessageTemplateInfo: useCallback(({ payload }: { payload: MessageTemplatesInfo }) => {
      store.setState((state): SendbirdState => (
        updateAppInfoStore(state, {
          messageTemplatesInfo: payload,
          waitingTemplateKeysMap: {},
        })
      ));
    }, [store]),

    upsertMessageTemplates: useCallback(({ payload }) => {
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
    }, [store, state.stores.appInfoStore]),

    upsertWaitingTemplateKeys: useCallback(({ payload }) => {
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
    }, [store, state.stores.appInfoStore]),

    markErrorWaitingTemplateKeys: useCallback(({ payload }) => {
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
    }, [store, state.stores.appInfoStore]),
  };

  /* SDK */
  const sdkActions = {
    setSdkLoading: useCallback((payload) => {
      store.setState((state): SendbirdState => (
        updateSdkStore(state, {
          initialized: false,
          loading: payload,
        })
      ));
    }, [store]),

    sdkError: useCallback(() => {
      store.setState((state): SendbirdState => (
        updateSdkStore(state, {
          initialized: false,
          loading: false,
          error: true,
        })
      ));
    }, [store]),

    initSdk: useCallback((payload) => {
      store.setState((state): SendbirdState => (
        updateSdkStore(state, {
          sdk: payload,
          initialized: true,
          loading: false,
          error: false,
        })
      ));
    }, [store]),

    resetSdk: useCallback(() => {
      store.setState((state): SendbirdState => (
        updateSdkStore(state, {
          sdk: {} as SdkStore['sdk'],
          initialized: false,
          loading: false,
          error: false,
        })
      ));
    }, [store]),
  };

  /* User */
  const userActions = {
    initUser: useCallback((payload) => {
      store.setState((state): SendbirdState => (
        updateUserStore(state, {
          initialized: true,
          loading: false,
          user: payload,
        })
      ));
    }, [store]),

    resetUser: useCallback(() => {
      store.setState((state): SendbirdState => (
        updateUserStore(state, {
          initialized: false,
          loading: false,
          user: {} as User,
        })
      ));
    }, [store]),

    updateUserInfo: useCallback((payload: User) => {
      store.setState((state): SendbirdState => (
        updateUserStore(state, {
          user: payload,
        })
      ));
    }, [store]),
  };

  /* Connection */
  const disconnect = useCallback(async ({ logger }: { logger: LoggerInterface }) => {
    sdkActions.setSdkLoading(true);

    const sdk = state.stores.sdkStore.sdk;

    if (sdk?.disconnectWebSocket) {
      await sdk.disconnectWebSocket();
    }

    sdkActions.resetSdk();
    userActions.resetUser();
    logger.info?.('SendbirdProvider | useSendbird/disconnect completed');
  }, [
    store,
    state.stores.sdkStore?.sdk,
    sdkActions,
    userActions,
  ]);

  const connect = useCallback(async (params) => {
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
    await disconnect({ logger });

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

    sdkActions.setSdkLoading(true);

    try {
      const user = await sdk.connect(userId, accessToken);
      userActions.initUser(user);

      if (nickname || profileUrl) {
        await sdk.updateCurrentUserInfo({
          nickname: nickname || user.nickname || '',
          profileUrl: profileUrl || user.profileUrl,
        });
      }

      await initializeMessageTemplatesInfo?.(sdk);
      await initDashboardConfigs?.(sdk);

      sdkActions.initSdk(sdk);

      eventHandlers?.connection?.onConnected?.(user);
    } catch (error) {
      const sendbirdError = error as SendbirdError;
      sdkActions.resetSdk();
      userActions.resetUser();
      logger.error?.('SendbirdProvider | useSendbird/connect failed', sendbirdError);
      eventHandlers?.connection?.onFailed?.(sendbirdError);
    }
  }, [
    store,
    sdkActions,
    userActions,
    disconnect,
  ]);

  const actions = useMemo(() => ({
    ...appInfoActions,
    ...sdkActions,
    ...userActions,
    disconnect,
    connect,
  }), [
    appInfoActions,
    sdkActions,
    userActions,
    disconnect,
    connect,
  ]);

  return { state, actions };
};

export default useSendbird;
