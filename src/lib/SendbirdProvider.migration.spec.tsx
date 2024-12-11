/* eslint-disable no-console */
import React from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import SendbirdProvider, { SendbirdProviderProps } from './Sendbird';
import useSendbirdStateContext from '../hooks/useSendbirdStateContext';
import { match } from 'ts-pattern';
import { DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT, DEFAULT_UPLOAD_SIZE_LIMIT } from '../utils/consts';

const mockProps: SendbirdProviderProps = {
  appId: 'test-app-id',
  userId: 'test-user-id',
  accessToken: 'test-access-token',
  customApiHost: 'api.sendbird.com',
  customWebSocketHost: 'socket.sendbird.com',
  theme: 'light',
  config: { logLevel: 'info', isREMUnitEnabled: true },
  nickname: 'test-nickname',
  colorSet: { primary: '#000' },
  stringSet: { CHANNEL_PREVIEW_MOBILE_LEAVE: 'Leave Channel' },
  dateLocale: {} as Locale,
  profileUrl: 'test-profile-url',
  voiceRecord: { maxRecordingTime: 3000, minRecordingTime: 1000 },
  userListQuery: () => ({ limit: 10 } as any),
  imageCompression: { compressionRate: 0.8, outputFormat: 'png' },
  allowProfileEdit: true,
  disableMarkAsDelivered: false,
  breakpoint: '768px',
  htmlTextDirection: 'ltr',
  forceLeftToRightMessageLayout: true,
  uikitOptions: { groupChannel: { enableReactions: true } },
  isUserIdUsedForNickname: true,
  sdkInitParams: { localCacheEnabled: true },
  customExtensionParams: { feature: 'custom' },
  isMultipleFilesMessageEnabled: true,
  renderUserProfile: jest.fn(),
  onStartDirectMessage: jest.fn(),
  onUserProfileMessage: jest.fn(),
  eventHandlers: {},
  children: <div>Test Child</div>,
};

const mockDisconnect = jest.fn();
const mockConnect = jest.fn();
const mockUpdateCurrentUserInfo = jest.fn();

/**
 * Mocking Sendbird SDK
 * sdk.connect causes DOMException issue in jest.
 * Because it retries many times to connect indexDB.
 */
jest.mock('@sendbird/chat', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        connect: mockConnect.mockResolvedValue({
          userId: 'test-user-id',
          nickname: 'test-nickname',
          profileUrl: 'test-profile-url',
        }),
        disconnect: mockDisconnect.mockResolvedValue(null),
        updateCurrentUserInfo: mockUpdateCurrentUserInfo.mockResolvedValue(null),
        GroupChannel: { createMyGroupChannelListQuery: jest.fn() },
        appInfo: {
          uploadSizeLimit: 1024 * 1024 * 5, // 5MB
          multipleFilesMessageFileCountLimit: 10,
        },
      };
    }),
  };
});

describe('SendbirdProvider Props & Context Interface Validation', () => {
  const originalConsoleError = console.error;
  let originalFetch;

  beforeAll(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));

    console.error = jest.fn((...args) => {
      if (typeof args[0] === 'string'
          && (args[0].includes('Warning: An update to %s inside a test was not wrapped in act')
           || args[0].includes('WebSocket connection'))) {
        return;
      }
      originalConsoleError(...args);
    });
  });

  afterAll(() => {
    console.error = originalConsoleError;
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockConnect.mockClear();
    mockDisconnect.mockClear();
    mockUpdateCurrentUserInfo.mockClear();

    global.MediaRecorder = {
      isTypeSupported: jest.fn((type) => {
        const supportedMimeTypes = ['audio/webm', 'audio/wav'];
        return supportedMimeTypes.includes(type);
      }),
    } as any;

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it('should accept all legacy props without type errors', async () => {
    const { rerender } = render(
      <SendbirdProvider {...mockProps}>
        {mockProps.children}
      </SendbirdProvider>,
    );

    rerender(
      <SendbirdProvider {...mockProps}>
        {mockProps.children}
      </SendbirdProvider>,
    );
  });

  it('should provide all expected keys in context', () => {
    const expectedKeys = [
      'config',
      'stores',
      'dispatchers',
      'eventHandlers',
      'emojiManager',
      'utils',
    ];

    const TestComponent = () => {
      const context = useSendbirdStateContext();
      return (
        <div>
          {Object.keys(context).map((key) => (
            <div key={key} data-testid={`context-${key}`}>
              {match(context[key])
                .with('function', () => 'function')
                .with('object', () => JSON.stringify(context[key]))
                .with('string', () => String(context[key]))
                .otherwise(() => 'unknown')}
            </div>
          ))}
        </div>
      );
    };

    render(
      <SendbirdProvider appId="test-app-id" userId="test-user-id">
        <TestComponent />
      </SendbirdProvider>,
    );

    expectedKeys.forEach((key) => {
      const element = screen.getByTestId(`context-${key}`);
      expect(element).toBeInTheDocument();
    });
  });

  it('should pass all expected values to the config object', () => {
    const mockProps: SendbirdProviderProps = {
      appId: 'test-app-id',
      userId: 'test-user-id',
      theme: 'light',
      allowProfileEdit: true,
      disableMarkAsDelivered: false,
      voiceRecord: { maxRecordingTime: 3000, minRecordingTime: 1000 },
      config: {
        userMention: { maxMentionCount: 5, maxSuggestionCount: 10 },
      },
      imageCompression: { compressionRate: 0.7, resizingWidth: 800 },
      htmlTextDirection: 'ltr',
      forceLeftToRightMessageLayout: false,
      isMultipleFilesMessageEnabled: true,
    };

    const wrapper = ({ children }) => (
      <SendbirdProvider {...mockProps}>{children}</SendbirdProvider>
    );

    const { result } = renderHook(() => useSendbirdStateContext(), { wrapper });

    const config = result.current.config;

    expect(config.appId).toBe(mockProps.appId);
    expect(config.userId).toBe(mockProps.userId);
    expect(config.theme).toBe(mockProps.theme);
    expect(config.allowProfileEdit).toBe(mockProps.allowProfileEdit);
    expect(config.disableMarkAsDelivered).toBe(mockProps.disableMarkAsDelivered);
    expect(config.voiceRecord.maxRecordingTime).toBe(mockProps.voiceRecord?.maxRecordingTime);
    expect(config.voiceRecord.minRecordingTime).toBe(mockProps.voiceRecord?.minRecordingTime);
    expect(config.userMention.maxMentionCount).toBe(mockProps.config?.userMention?.maxMentionCount);
    expect(config.userMention.maxSuggestionCount).toBe(mockProps.config?.userMention?.maxSuggestionCount);
    expect(config.imageCompression.compressionRate).toBe(mockProps.imageCompression?.compressionRate);
    expect(config.imageCompression.resizingWidth).toBe(mockProps.imageCompression?.resizingWidth);
    expect(config.htmlTextDirection).toBe(mockProps.htmlTextDirection);
    expect(config.forceLeftToRightMessageLayout).toBe(mockProps.forceLeftToRightMessageLayout);
    expect(config.isMultipleFilesMessageEnabled).toBe(mockProps.isMultipleFilesMessageEnabled);

    // Default values validation
    expect(config.uikitUploadSizeLimit).toBe(DEFAULT_UPLOAD_SIZE_LIMIT);
    expect(config.uikitMultipleFilesMessageLimit).toBe(DEFAULT_MULTIPLE_FILES_MESSAGE_LIMIT);
    expect(config.logger).toBeDefined();
    expect(config.pubSub).toBeDefined();
    expect(config.markAsReadScheduler).toBeDefined();
    expect(config.markAsDeliveredScheduler).toBeDefined();
  });

  it('should handle optional and default values correctly', () => {
    const wrapper = ({ children }) => (
      <SendbirdProvider {...mockProps} appId="test-app-id" userId="test-user-id">
        {children}
      </SendbirdProvider>
    );

    const { result } = renderHook(() => useSendbirdStateContext(), { wrapper });

    expect(result.current.config.pubSub).toBeDefined();
    expect(result.current.config.logger).toBeDefined();
    expect(result.current.config.imageCompression.compressionRate).toBe(0.8);
  });
});
