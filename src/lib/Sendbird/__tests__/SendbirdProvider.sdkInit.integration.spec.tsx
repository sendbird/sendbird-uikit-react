import React, { act } from 'react';
import { waitFor } from '@testing-library/react';
import SendbirdChat from '@sendbird/chat';
import type { SendbirdProviderProps } from '../index';
import type { SessionHandler } from '@sendbird/chat';
import { renderWithSendbird } from '../../../utils/testMocks/renderWithSendbird';

// Mount the REAL SendbirdProvider and mock ONLY the '@sendbird/chat' boundary, so the whole
// prop -> SendbirdContextManager -> useSendbird.connect -> initSDK/setupSDK chain runs. This
// proves no layer drops/mutates a customer-provided value on its way to the SDK — the seam the
// existing segment tests (utils.spec.ts / useSendbird.spec.tsx / SendbirdProvider.spec.tsx) skip.
vi.mock('@sendbird/chat', async () => (
  await import('../../../utils/testMocks/sendbirdChat')
).createSendbirdChatMock());

const sdk = SendbirdChat as any;

const mountProvider = async (props: Partial<SendbirdProviderProps>) => {
  await act(async () => {
    renderWithSendbird(<div />, props);
  });
};

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

  it('initializes SendbirdChat with the customer-provided connection params + sdkInitParams', async () => {
    await mountProvider({
      appId: 'test-app-id',
      userId: 'test-user-id',
      accessToken: 'test-access-token',
      customApiHost: 'https://api.custom',
      customWebSocketHost: 'wss://ws.custom',
      sdkInitParams: { localCacheEnabled: false },
    });

    await waitFor(() => expect(sdk.init).toHaveBeenCalledWith(
      expect.objectContaining({
        appId: 'test-app-id',
        customApiHost: 'https://api.custom',
        customWebSocketHost: 'wss://ws.custom',
        localCacheEnabled: false, // sdkInitParams override survives the whole chain
        modules: expect.any(Array),
      }),
    ));
  });

  it('connects with exactly (userId, accessToken)', async () => {
    await mountProvider({ appId: 'test-app-id', userId: 'user-42', accessToken: 'token-abc' });

    await waitFor(() => expect(sdk.connect).toHaveBeenCalledWith('user-42', 'token-abc'));
  });

  it('updates current user info with the provided nickname/profileUrl', async () => {
    await mountProvider({
      appId: 'test-app-id',
      userId: 'user-42',
      nickname: 'Alice',
      profileUrl: 'https://img/alice.png',
    });

    await waitFor(() => expect(sdk.updateCurrentUserInfo).toHaveBeenCalledWith(
      expect.objectContaining({ nickname: 'Alice', profileUrl: 'https://img/alice.png' }),
    ));
  });

  it('does NOT update current user info when neither nickname nor profileUrl is provided', async () => {
    await mountProvider({ appId: 'test-app-id', userId: 'user-42' });

    await waitFor(() => expect(sdk.connect).toHaveBeenCalled());
    // let the post-connect continuation (the nickname/profileUrl decision) run
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(sdk.updateCurrentUserInfo).not.toHaveBeenCalled();
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
      expect.any(Array),
      expect.objectContaining({ platform: 'WEB' }),
      { feature: 'custom' },
    );
    expect(configureSession).toHaveBeenCalledWith(sdk);
    expect(sdk.setSessionHandler).toHaveBeenCalledWith(sessionHandler);
  });

  it('initializes as a new instance on first mount', async () => {
    await mountProvider({ appId: 'test-app-id', userId: 'user-42' });

    await waitFor(() => expect(sdk.init).toHaveBeenCalledWith(
      expect.objectContaining({ newInstance: true }),
    ));
  });

  it('calls eventHandlers.connection.onConnected with the connected user', async () => {
    const onConnected = vi.fn();
    await mountProvider({ appId: 'test-app-id', userId: 'user-42', eventHandlers: { connection: { onConnected } } });

    await waitFor(() => expect(onConnected).toHaveBeenCalledWith(expect.objectContaining({ userId: 'test-user-id' })));
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
