import { act, renderHook, waitFor } from '@testing-library/react';
import { GroupChannel, GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { User } from '@sendbird/chat';
import useHandleChannelEvents from '../hooks/useHandleChannelEvents';
import type { SdkStore } from '../../../../lib/Sendbird/types';

const mockThreadActions = {
  onMessageReceived: vi.fn(),
  onMessageUpdated: vi.fn(),
  onMessageDeleted: vi.fn(),
  onReactionUpdated: vi.fn(),
  onUserMuted: vi.fn(),
  onUserUnmuted: vi.fn(),
  onUserBanned: vi.fn(),
  onUserUnbanned: vi.fn(),
  onUserLeft: vi.fn(),
  onChannelFrozen: vi.fn(),
  onChannelUnfrozen: vi.fn(),
  onOperatorUpdated: vi.fn(),
  onTypingStatusUpdated: vi.fn(),
};

vi.mock('../useThread', () => ({
  __esModule: true,
  default: () => ({
    actions: mockThreadActions,
  }),
}));

const mockLogger = {
  info: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
};

describe('useHandleChannelEvents', () => {
  const mockUser = { userId: 'user1' } as User;

  const createMockChannel = () => ({
    url: 'channel-url',
    getTypingUsers: vi.fn().mockReturnValue([mockUser]),
  }) as unknown as GroupChannel;

  const createMockSdk = (addHandler = vi.fn(), removeHandler = vi.fn()) => ({
    groupChannel: {
      addGroupChannelHandler: addHandler,
      removeGroupChannelHandler: removeHandler,
    },
  } as unknown as SdkStore['sdk']);

  const renderChannelEventsHook = ({
    sdk = createMockSdk(),
    currentChannel = createMockChannel(),
  } = {}) => {
    return renderHook(() => useHandleChannelEvents(
      {
        sdk,
        currentChannel,
      },
      {
        logger: mockLogger,
      },
    ));
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add channel handler on mount', () => {
    const mockAddHandler = vi.fn();
    const sdk = createMockSdk(mockAddHandler);

    renderChannelEventsHook({ sdk });

    expect(mockAddHandler).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(GroupChannelHandler),
    );
  });

  it('should remove channel handler on unmount', () => {
    const mockRemoveHandler = vi.fn();
    const sdk = createMockSdk(vi.fn(), mockRemoveHandler);

    const { unmount } = renderChannelEventsHook({ sdk });
    unmount();

    expect(mockRemoveHandler).toHaveBeenCalledWith(expect.any(String));
  });

  it('should handle typing status updated event', () => {
    const mockAddHandler = vi.fn();
    const sdk = createMockSdk(mockAddHandler);
    const channel = createMockChannel();

    renderChannelEventsHook({ sdk, currentChannel: channel });

    const handler = mockAddHandler.mock.calls[0][1];
    handler.onTypingStatusUpdated(channel);

    expect(mockThreadActions.onTypingStatusUpdated).toHaveBeenCalledWith(
      channel,
      [mockUser],
    );
  });

  it('should pass channel and user to onUserBanned handler', () => {
    const mockAddHandler = vi.fn();
    const sdk = createMockSdk(mockAddHandler);
    const channel = createMockChannel();
    const bannedUser = { userId: 'banned-user' } as User;

    renderChannelEventsHook({ sdk, currentChannel: channel });

    const handler = mockAddHandler.mock.calls[0][1];
    handler.onUserBanned(channel, bannedUser);

    expect(mockThreadActions.onUserBanned).toHaveBeenCalledWith(channel, bannedUser);
  });

  it('should pass channel and user to onUserLeft handler', () => {
    const mockAddHandler = vi.fn();
    const sdk = createMockSdk(mockAddHandler);
    const channel = createMockChannel();
    const leavingUser = { userId: 'leaving-user' } as User;

    renderChannelEventsHook({ sdk, currentChannel: channel });

    const handler = mockAddHandler.mock.calls[0][1];
    handler.onUserLeft(channel, leavingUser);

    expect(mockThreadActions.onUserLeft).toHaveBeenCalledWith(channel, leavingUser);
  });

  it('should not add handler when sdk or currentChannel is missing', async () => {
    const mockAddHandler = vi.fn();
    const sdk = createMockSdk(mockAddHandler);

    await act(async () => {
      renderChannelEventsHook({ sdk, currentChannel: undefined });
      await waitFor(() => {
        expect(mockAddHandler).not.toHaveBeenCalled();
      });
    });
  });
});
