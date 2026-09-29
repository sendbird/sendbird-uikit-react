import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useCallback, useContext, useMemo } from 'react';
import { ConnectionHandler, SendbirdError, SendbirdErrorCode, User } from '@sendbird/chat';

import { SendbirdContext } from '../SendbirdContext';
import { LoggerInterface } from '../../../Logger';
import { MessageTemplatesInfo, SdkStore, SendbirdState, WaitingTemplateKeyData } from '../../types';
import { initSDK, setupSDK, updateAppInfoStore, updateSdkStore, updateUserStore } from '../../utils';
import { uuidv4 } from '../../../../utils/uuid';

const NO_CONTEXT_ERROR = 'No sendbird state value available. Make sure you are rendering `<SendbirdProvider>` at the top of your app.';

/**
 * Teardown in flight for a SendbirdChat instance, keyed by that instance.
 *
 * On route navigation the outgoing provider's unmount starts `disconnectWebSocket()`. React
 * cannot await an unmount cleanup, and the incoming provider reuses the same cached instance
 * while holding a different store, so neither provider can see that a teardown is running.
 * Left unserialized, `connect()` races it, and a teardown landing mid-connect cancels the
 * connection. This lives outside the stores because it belongs to the instance, not to any
 * one provider.
 */
const pendingTeardowns = new WeakMap<object, Promise<unknown>>();

interface ConnectionSession {
  sdk: SdkStore['sdk'];
  handlerId: string;
  awaitingRecovery: boolean;
  onDelayChange?: (retryAfter: number | null) => void;
}

const connectGenerations = new WeakMap<object, number>();
const connectionSessions = new WeakMap<object, ConnectionSession>();

const claimConnectGeneration = (store: object): number => {
  const generation = (connectGenerations.get(store) ?? 0) + 1;
  connectGenerations.set(store, generation);
  return generation;
};

const endConnectionSession = (store: object) => {
  const session = connectionSessions.get(store);
  if (!session) return;
  connectionSessions.delete(store);
  session.sdk.removeConnectionHandler(session.handlerId);
  session.onDelayChange?.(null);
};

const startConnectionSession = (
  store: object,
  sdk: SdkStore['sdk'],
  { userId, onRecover, onDelayChange }: {
    userId: string;
    onRecover: (user: User) => void;
    onDelayChange?: (retryAfter: number | null) => void;
  },
): ConnectionSession => {
  endConnectionSession(store);
  const session: ConnectionSession = {
    sdk,
    handlerId: `sendbird-uikit-react-connection-${uuidv4()}`,
    awaitingRecovery: false,
    onDelayChange,
  };
  const recover = () => {
    if (!session.awaitingRecovery || connectionSessions.get(store) !== session) return;
    const user = sdk.currentUser;
    if (!user || user.userId !== userId) return;
    session.awaitingRecovery = false;
    onRecover(user);
  };
  const settleDelay = () => {
    onDelayChange?.(null);
    recover();
  };
  sdk.addConnectionHandler(session.handlerId, new ConnectionHandler({
    onConnectionDelayed: (retryAfter: number) => onDelayChange?.(retryAfter),
    onConnected: settleDelay,
    onReconnectSucceeded: settleDelay,
  }));
  connectionSessions.set(store, session);
  return session;
};

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
  const teardownConnection = useCallback(async ({ logger }: { logger: LoggerInterface }) => {
    endConnectionSession(store);
    sdkActions.setSdkLoading(true);

    const sdk = state.stores.sdkStore.sdk;

    if (sdk?.disconnectWebSocket) {
      const teardown = sdk.disconnectWebSocket();
      pendingTeardowns.set(sdk, teardown);
      try {
        await teardown;
      } finally {
        if (pendingTeardowns.get(sdk) === teardown) pendingTeardowns.delete(sdk);
      }
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

  const disconnect = useCallback(async ({ logger }: { logger: LoggerInterface }) => {
    claimConnectGeneration(store);
    await teardownConnection({ logger });
  }, [
    store,
    teardownConnection,
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
      onConnectionDelayChange,
    } = params;

    const generation = claimConnectGeneration(store);

    // clean up previous ws connection
    await teardownConnection({ logger });

    sdkActions.setSdkLoading(true);

    const failConnection = (error: unknown): SendbirdError => {
      const sendbirdError = error as SendbirdError;
      sdkActions.resetSdk();
      userActions.resetUser();
      logger.error?.('SendbirdProvider | useSendbird/connect failed', sendbirdError);
      eventHandlers?.connection?.onFailed?.(sendbirdError);
      return sendbirdError;
    };

    const completeConnection = async (sdk: SdkStore['sdk'], user: User, isCurrent: () => boolean) => {
      let connectedUser = user;
      userActions.initUser(connectedUser);

      if (nickname || profileUrl) {
        // updateCurrentUserInfo answers with the user it just wrote. Dropping that answer left the
        // store — and everything reading it, from the header to the profile editor — holding the
        // name the user had before the one the app asked for.
        connectedUser = await sdk.updateCurrentUserInfo({
          nickname: nickname || connectedUser.nickname || '',
          profileUrl: profileUrl || connectedUser.profileUrl,
        });
        userActions.updateUserInfo(connectedUser);
      }

      await initializeMessageTemplatesInfo?.(sdk);
      await initDashboardConfigs?.(sdk);

      if (!isCurrent()) return;
      sdkActions.initSdk(sdk);

      eventHandlers?.connection?.onConnected?.(connectedUser);
    };

    let session: ConnectionSession | undefined;

    // initSDK and setupSDK stay inside the try: SendbirdChat.init() rejects an empty or
    // malformed appId, which apps routinely pass while their config is still loading.
    // Outside the try that would surface as an unhandled rejection instead of onFailed.
    try {
      const sdk = initSDK({
        appId,
        customApiHost,
        customWebSocketHost,
        sdkInitParams,
      });

      // A provider unmounting elsewhere may still be tearing this instance down. Wait for
      // that before touching it; a failed teardown must not stop us from connecting.
      const teardown = pendingTeardowns.get(sdk);
      if (teardown) await teardown.catch(() => undefined);

      setupSDK(sdk, {
        logger,
        isMobile,
        customExtensionParams,
        sessionHandler: configureSession ? configureSession(sdk) : undefined,
      });

      if (connectGenerations.get(store) === generation) {
        session = startConnectionSession(store, sdk, {
          userId,
          onDelayChange: onConnectionDelayChange,
          onRecover: (user) => {
            const isCurrent = () => connectionSessions.get(store) === session;
            sdkActions.setSdkLoading(true);
            completeConnection(sdk, user, isCurrent).catch((error) => {
              if (isCurrent()) failConnection(error);
            });
          },
        });
      }

      const user = await sdk.connect(userId, accessToken);
      await completeConnection(sdk, user, () => true);
    } catch (error) {
      const sendbirdError = failConnection(error);
      if (
        session
        && connectionSessions.get(store) === session
        && sendbirdError?.code === SendbirdErrorCode.DELAYED_CONNECTING
      ) {
        session.awaitingRecovery = true;
      }
    }
  }, [
    store,
    sdkActions,
    userActions,
    teardownConnection,
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
