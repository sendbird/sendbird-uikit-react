import { vi } from 'vitest';

/**
 * Shared '@sendbird/chat' mock for integration tests that mount a real SendbirdProvider.
 *
 * `vi.mock` is hoisted above imports and cannot close over module-scope variables, so load
 * this via a dynamic import inside an async factory:
 *
 *   vi.mock('@sendbird/chat', async () => (
 *     await import('../../../utils/testMocks/sendbirdChat')
 *   ).createSendbirdChatMock());
 *   import SendbirdChat from '@sendbird/chat';
 *   // SendbirdChat === the mock sdk; SendbirdChat.init/connect/... are vi.fn() spies.
 *
 * Only '@sendbird/chat' is mocked. GroupChannelModule/OpenChannelModule come from
 * '@sendbird/chat/groupChannel' and '/openChannel' (separate specifiers) and stay real,
 * so `new GroupChannelModule()` in initSDK still works.
 */
export function createMockSdk() {
  const mockSdk: Record<string, any> = {
    init: vi.fn(),
    connect: vi.fn().mockResolvedValue({
      userId: 'test-user-id',
      nickname: 'test-nickname',
      profileUrl: 'test-profile-url',
    }),
    disconnect: vi.fn().mockResolvedValue(null),
    disconnectWebSocket: vi.fn().mockResolvedValue(null),
    updateCurrentUserInfo: vi.fn().mockResolvedValue(null),
    addExtension: vi.fn().mockReturnThis(),
    addSendbirdExtensions: vi.fn().mockReturnThis(),
    setSessionHandler: vi.fn(),
    getUIKitConfiguration: vi.fn().mockResolvedValue({ json: {} }),
    GroupChannel: { createMyGroupChannelListQuery: vi.fn() },
    groupChannel: { createMyGroupChannelListQuery: vi.fn() },
    message: {
      getMessageTemplatesByToken: vi.fn().mockResolvedValue({ hasMore: false, token: null, templates: [] }),
    },
    appInfo: {
      uploadSizeLimit: 1024 * 1024 * 5,
      multipleFilesMessageFileCountLimit: 10,
      // Fields the provider reads on connect(): dashboard config (uikit-tools) + message templates.
      uikitConfigInfo: { lastUpdatedAt: 0 },
      messageTemplateInfo: { token: null },
      applicationAttributes: [],
    },
  };
  // `SendbirdChat.init(...)` returns the same sdk, so init/connect/updateCurrentUserInfo
  // spies are all reachable from the default import in tests.
  mockSdk.init.mockImplementation(() => mockSdk);
  return mockSdk;
}

export function createSendbirdChatMock() {
  const mockSdk = createMockSdk();
  return {
    __esModule: true,
    default: mockSdk,
    SendbirdProduct: { UIKIT_CHAT: 'UIKIT_CHAT' },
    SendbirdPlatform: { JS: 'JS' },
    DeviceOsPlatform: { WEB: 'WEB', MOBILE_WEB: 'MOBILE_WEB' },
  };
}
