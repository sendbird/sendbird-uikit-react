import React, { act } from 'react';
import { waitFor } from '@testing-library/react';
import SendbirdChat from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';
import { OpenChannelModule } from '@sendbird/chat/openChannel';
import type { SendbirdProviderProps } from '../index';
import type { SessionHandler } from '@sendbird/chat';
import { renderWithSendbird } from '../../../utils/testMocks/renderWithSendbird';

// Mount the REAL SendbirdProvider and mock ONLY the '@sendbird/chat' boundary, so the whole
// prop -> SendbirdContextManager -> useSendbird.connect -> initSDK/setupSDK chain runs. This
// proves no layer drops/mutates/injects a customer-provided value on its way to the SDK — the
// seam the existing segment tests (utils.spec.ts / useSendbird.spec.tsx / SendbirdProvider.spec.tsx)
// skip. Every argument is asserted in full: a subset match would not catch an injected param.
vi.mock('@sendbird/chat', async () => (
  await import('../../../utils/testMocks/sendbirdChat')
).createSendbirdChatMock());

const sdk = SendbirdChat as any;

const mountProvider = async (props: Partial<SendbirdProviderProps>) => {
  await act(async () => {
    renderWithSendbird(<div />, props);
  });
};

const initParams = (overrides: Record<string, unknown> = {}) => ({
  appId: 'test-app-id',
  localCacheEnabled: true,
  modules: [expect.any(GroupChannelModule), expect.any(OpenChannelModule)],
  ...overrides,
});

describe('SendbirdProvider — SDK init/connect consistency (integration)', () => {
  const originalConsoleError = globalThis.console.error.bind(globalThis.console);

  beforeAll(() => {
    // The connect() effect resolves async after mount; silence the RTL act warning noise.
    vi.spyOn(console, 'error').mockImplementation((...args) => {
      if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
      originalConsoleError(...args);
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('initializes SendbirdChat with exactly the customer-provided connection params + sdkInitParams', async () => {
    await mountProvider({
      appId: 'test-app-id',
      userId: 'test-user-id',
      accessToken: 'test-access-token',
      customApiHost: 'https://api.custom',
      customWebSocketHost: 'wss://ws.custom',
      sdkInitParams: { localCacheEnabled: false },
    });

    await waitFor(() => expect(sdk.init).toHaveBeenCalledWith(initParams({
      customApiHost: 'https://api.custom',
      customWebSocketHost: 'wss://ws.custom',
      localCacheEnabled: false,
    })));
  });

  it('leaves customApiHost/customWebSocketHost out of the init params when the app omits them', async () => {
    await mountProvider({ appId: 'test-app-id', userId: 'user-42' });

    await waitFor(() => expect(sdk.init).toHaveBeenCalledWith(initParams()));
  });

  it('treats empty-string hosts as absent rather than passing them to init', async () => {
    await mountProvider({
      appId: 'test-app-id',
      userId: 'user-42',
      customApiHost: '',
      customWebSocketHost: '',
    });

    await waitFor(() => expect(sdk.init).toHaveBeenCalledWith(initParams()));
  });

  it.each([true, false])('forwards sdkInitParams.newInstance=%s instead of deriving one', async (newInstance) => {
    await mountProvider({ appId: 'test-app-id', userId: 'user-42', sdkInitParams: { newInstance } });

    await waitFor(() => expect(sdk.init).toHaveBeenCalledWith(initParams({ newInstance })));
  });

  it('connects with exactly (userId, accessToken)', async () => {
    await mountProvider({ appId: 'test-app-id', userId: 'user-42', accessToken: 'token-abc' });

    await waitFor(() => expect(sdk.connect).toHaveBeenCalledWith('user-42', 'token-abc'));
  });

  it('updates current user info with exactly the provided nickname/profileUrl', async () => {
    await mountProvider({
      appId: 'test-app-id',
      userId: 'user-42',
      nickname: 'Alice',
      profileUrl: 'https://img/alice.png',
    });

    await waitFor(() => expect(sdk.updateCurrentUserInfo).toHaveBeenCalledWith({
      nickname: 'Alice',
      profileUrl: 'https://img/alice.png',
    }));
  });

  it('fills the omitted field from the connected user rather than blanking it', async () => {
    await mountProvider({ appId: 'test-app-id', userId: 'user-42', nickname: 'Alice' });

    await waitFor(() => expect(sdk.updateCurrentUserInfo).toHaveBeenCalledWith({
      nickname: 'Alice',
      profileUrl: 'test-profile-url',
    }));
  });

  it('does NOT update current user info when neither nickname nor profileUrl is provided', async () => {
    const onConnected = vi.fn();
    await mountProvider({
      appId: 'test-app-id',
      userId: 'user-42',
      eventHandlers: { connection: { onConnected } },
    });

    // onConnected is the last step of connect(), so it fires after the nickname/profileUrl decision.
    await waitFor(() => expect(onConnected).toHaveBeenCalled());
    expect(sdk.updateCurrentUserInfo).not.toHaveBeenCalled();
  });

  it('does NOT update current user info when nickname and profileUrl are empty strings', async () => {
    const onConnected = vi.fn();
    await mountProvider({
      appId: 'test-app-id',
      userId: 'user-42',
      nickname: '',
      profileUrl: '',
      eventHandlers: { connection: { onConnected } },
    });

    await waitFor(() => expect(onConnected).toHaveBeenCalled());
    expect(sdk.updateCurrentUserInfo).not.toHaveBeenCalled();
  });

  it('reports an init failure through onFailed instead of rejecting', async () => {
    const error = new Error('appId is required');
    sdk.init.mockImplementationOnce(() => { throw error; });
    const onFailed = vi.fn();
    const onConnected = vi.fn();

    await mountProvider({
      appId: '',
      userId: 'user-42',
      eventHandlers: { connection: { onFailed, onConnected } },
    });

    await waitFor(() => expect(onFailed).toHaveBeenCalledWith(error));
    expect(sdk.connect).not.toHaveBeenCalled();
    expect(onConnected).not.toHaveBeenCalled();
  });

  it('passes setupSDK extensions, platform, customExtensionParams and session handler through', async () => {
    const sessionHandler = { onSessionExpired: vi.fn() } as unknown as SessionHandler;
    const configureSession = vi.fn(() => sessionHandler);

    await mountProvider({
      appId: 'test-app-id',
      userId: 'user-42',
      customExtensionParams: { feature: 'custom' },
      configureSession,
    });

    await waitFor(() => expect(sdk.addSendbirdExtensions).toHaveBeenCalled());
    expect(sdk.addExtension).toHaveBeenCalledWith('sb_uikit', expect.any(String));
    expect(sdk.addSendbirdExtensions).toHaveBeenCalledWith(
      [{ product: 'UIKIT_CHAT', version: expect.any(String), platform: 'JS' }],
      { platform: 'WEB' },
      { feature: 'custom' },
    );
    expect(configureSession).toHaveBeenCalledWith(sdk);
    expect(sdk.setSessionHandler).toHaveBeenCalledWith(sessionHandler);
  });

  it('calls eventHandlers.connection.onConnected with the connected user', async () => {
    const onConnected = vi.fn();
    await mountProvider({ appId: 'test-app-id', userId: 'user-42', eventHandlers: { connection: { onConnected } } });

    await waitFor(() => expect(onConnected).toHaveBeenCalledWith({
      userId: 'test-user-id',
      nickname: 'test-nickname',
      profileUrl: 'test-profile-url',
    }));
  });

  it('calls eventHandlers.connection.onFailed on connect failure and skips updateCurrentUserInfo', async () => {
    const error = new Error('connect failed');
    sdk.connect.mockRejectedValueOnce(error);
    const onFailed = vi.fn();
    await mountProvider({
      appId: 'test-app-id',
      userId: 'user-42',
      nickname: 'Alice',
      eventHandlers: { connection: { onFailed } },
    });

    await waitFor(() => expect(onFailed).toHaveBeenCalledWith(error));
    expect(sdk.updateCurrentUserInfo).not.toHaveBeenCalled();
  });
});
