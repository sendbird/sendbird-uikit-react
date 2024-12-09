import SendbirdChat from '@sendbird/chat';

import type { SendbirdState, SdkStore, UserStore, AppInfoStore, SendbirdStateConfig } from '../types';
import { updateAppInfoStore, updateSdkStore, updateUserStore, initSDK, setupSDK } from '../utils';

jest.mock('@sendbird/chat', () => ({
  init: jest.fn(),
  GroupChannelModule: jest.fn(),
  OpenChannelModule: jest.fn(),
  DeviceOsPlatform: {
    MOBILE_WEB: 'mobile_web',
    WEB: 'web',
  },
  SendbirdPlatform: {
    JS: 'js',
  },
  SendbirdProduct: {
    UIKIT_CHAT: 'uikit_chat',
  },
}));

describe('State Update Functions', () => {
  const initialState: SendbirdState = {
    config: {
      appId: 'testAppId',
    } as SendbirdStateConfig,
    stores: {
      appInfoStore: {
        waitingTemplateKeysMap: {},
        messageTemplatesInfo: undefined,
      },
      sdkStore: {
        error: false,
        initialized: false,
        loading: false,
        sdk: {} as any,
      },
      userStore: {
        initialized: false,
        loading: false,
        user: {} as any,
      },
    },
    eventHandlers: undefined,
    emojiManager: {} as any,
    utils: {} as any,
  };

  test('updateAppInfoStore merges payload with existing appInfoStore', () => {
    const payload: Partial<AppInfoStore> = { messageTemplatesInfo: { templateKey: 'templateValue' } };
    const updatedState = updateAppInfoStore(initialState, payload);

    expect(updatedState.stores.appInfoStore).toEqual({
      waitingTemplateKeysMap: {},
      messageTemplatesInfo: { templateKey: 'templateValue' },
    });
  });

  test('updateSdkStore merges payload with existing sdkStore', () => {
    const payload: Partial<SdkStore> = { initialized: true, error: true };
    const updatedState = updateSdkStore(initialState, payload);

    expect(updatedState.stores.sdkStore).toEqual({
      error: true,
      initialized: true,
      loading: false,
      sdk: {} as any,
    });
  });

  test('updateUserStore merges payload with existing userStore', () => {
    const payload: Partial<UserStore> = { initialized: true, loading: true };
    const updatedState = updateUserStore(initialState, payload);

    expect(updatedState.stores.userStore).toEqual({
      initialized: true,
      loading: true,
      user: {} as any,
    });
  });
});

describe('initSDK', () => {
  it('initializes SendbirdChat with required parameters', () => {
    const params = { appId: 'testAppId' };
    initSDK(params);

    expect(SendbirdChat.init).toHaveBeenCalledWith(
      expect.objectContaining({
        appId: 'testAppId',
        modules: expect.any(Array),
        localCacheEnabled: true,
      }),
    );
  });

  it('includes customApiHost and customWebSocketHost if provided', () => {
    const params = {
      appId: 'testAppId',
      customApiHost: 'https://custom.api',
      customWebSocketHost: 'wss://custom.websocket',
    };
    initSDK(params);

    expect(SendbirdChat.init).toHaveBeenCalledWith(
      expect.objectContaining({
        customApiHost: 'https://custom.api',
        customWebSocketHost: 'wss://custom.websocket',
      }),
    );
  });
});

const mockSdk = {
  addExtension: jest.fn(),
  addSendbirdExtensions: jest.fn(),
  setSessionHandler: jest.fn(),
};
const mockLogger = {
  info: jest.fn(),
};

describe('setupSDK', () => {
  it('sets up SDK with extensions and session handler', () => {
    const params = {
      logger: mockLogger,
      sessionHandler: { onSessionExpired: jest.fn() },
      isMobile: false,
      customExtensionParams: { customKey: 'customValue' },
    };

    setupSDK(mockSdk, params);

    expect(mockLogger.info).toHaveBeenCalledWith(
      'SendbirdProvider | useConnect/setupConnection/setVersion',
      expect.any(Object),
    );
    expect(mockSdk.addExtension).toHaveBeenCalledWith('sb_uikit', expect.any(String));
    expect(mockSdk.addSendbirdExtensions).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Object),
      { customKey: 'customValue' },
    );
    expect(mockSdk.setSessionHandler).toHaveBeenCalledWith(params.sessionHandler);
  });

  it('does not set session handler if not provided', () => {
    const params = { logger: mockLogger };

    setupSDK(mockSdk, params);

    expect(mockSdk.setSessionHandler).not.toHaveBeenCalled();
  });
});
