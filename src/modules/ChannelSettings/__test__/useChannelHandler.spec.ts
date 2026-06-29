import { renderHook, act } from '@testing-library/react';
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import type { SendbirdChatWith } from '@sendbird/chat';
import type { GroupChannelModule } from '@sendbird/chat/groupChannel';
import type { OpenChannelModule } from '@sendbird/chat/openChannel';
import { useChannelHandler } from '../context/hooks/useChannelHandler';

// vi.mock('../../../utils/uuid', () => ({
//   v4: vi.fn(() => 'mock-uuid'),
// }));

const mockLogger = {
  warning: vi.fn(),
  info: vi.fn(),
  error: vi.fn(),
};

const mockSdk = {
  groupChannel: {
    addGroupChannelHandler: vi.fn(),
    removeGroupChannelHandler: vi.fn(),
  },
};

const mockForceUpdateUI = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useChannelHandler', () => {
  it('logs a warning if SDK or groupChannel is not available', () => {
    renderHook(() => useChannelHandler({ sdk: null, channelUrl: 'test-channel', logger: mockLogger, forceUpdateUI: mockForceUpdateUI }),
    );

    expect(mockLogger.warning).toHaveBeenCalledWith('ChannelSettings: SDK or GroupChannelModule is not available');
  });

  it('adds and removes GroupChannelHandler correctly', () => {
    const { unmount } = renderHook(() => useChannelHandler({
      sdk: mockSdk as unknown as SendbirdChatWith<[GroupChannelModule, OpenChannelModule]>,
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

    renderHook(() => useChannelHandler({ sdk: mockSdk as unknown as SendbirdChatWith<[GroupChannelModule, OpenChannelModule]>, channelUrl: 'test-channel', logger: mockLogger, forceUpdateUI: mockForceUpdateUI }),
    );

    expect(mockForceUpdateUI).toHaveBeenCalled();
  });

  it('calls forceUpdateUI when a user is banned from the channel', () => {
    mockSdk.groupChannel.addGroupChannelHandler.mockImplementation((_, handler) => {
      handler.onUserBanned({ url: 'test-channel', isGroupChannel: () => true }, { userId: 'user1' });
    });

    renderHook(() => useChannelHandler({ sdk: mockSdk as unknown as SendbirdChatWith<[GroupChannelModule, OpenChannelModule]>, channelUrl: 'test-channel', logger: mockLogger, forceUpdateUI: mockForceUpdateUI }),
    );

    expect(mockForceUpdateUI).toHaveBeenCalled();
  });
});
