import { renderHook, act } from '@testing-library/react';
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { useChannelHandler } from '../context/hooks/useChannelHandler';

// jest.mock('../../../utils/uuid', () => ({
//   v4: jest.fn(() => 'mock-uuid'),
// }));

const mockLogger = {
  warning: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
};

const mockSdk = {
  groupChannel: {
    addGroupChannelHandler: jest.fn(),
    removeGroupChannelHandler: jest.fn(),
  },
};

const mockForceUpdateUI = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useChannelHandler', () => {
  it('logs a warning if SDK or groupChannel is not available', () => {
    renderHook(() => useChannelHandler({ sdk: null, channelUrl: 'test-channel', logger: mockLogger, forceUpdateUI: mockForceUpdateUI }),
    );

    expect(mockLogger.warning).toHaveBeenCalledWith('ChannelSettings: SDK or GroupChannelModule is not available');
  });

  it('adds and removes GroupChannelHandler correctly', () => {
    const { unmount } = renderHook(() => useChannelHandler({
      sdk: mockSdk,
      channelUrl: 'test-channel',
      logger: mockLogger,
      forceUpdateUI: mockForceUpdateUI,
    }),
    );

    expect(mockSdk.groupChannel.addGroupChannelHandler).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(GroupChannelHandler),
    );

    act(() => {
      unmount();
    });

    expect(mockSdk.groupChannel.removeGroupChannelHandler).toHaveBeenCalled();
  });

  it('calls forceUpdateUI when a user leaves the channel', () => {
    mockSdk.groupChannel.addGroupChannelHandler.mockImplementation((_, handler) => {
      handler.onUserLeft({ url: 'test-channel' }, { userId: 'user1' });
    });

    renderHook(() => useChannelHandler({ sdk: mockSdk, channelUrl: 'test-channel', logger: mockLogger, forceUpdateUI: mockForceUpdateUI }),
    );

    expect(mockForceUpdateUI).toHaveBeenCalled();
  });

  it('calls forceUpdateUI when a user is banned from the channel', () => {
    mockSdk.groupChannel.addGroupChannelHandler.mockImplementation((_, handler) => {
      handler.onUserBanned({ url: 'test-channel', isGroupChannel: () => true }, { userId: 'user1' });
    });

    renderHook(() => useChannelHandler({ sdk: mockSdk, channelUrl: 'test-channel', logger: mockLogger, forceUpdateUI: mockForceUpdateUI }),
    );

    expect(mockForceUpdateUI).toHaveBeenCalled();
  });
});
