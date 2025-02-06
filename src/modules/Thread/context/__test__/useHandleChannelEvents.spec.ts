import { act, renderHook } from '@testing-library/react-hooks';
import { GroupChannel, GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { UserMessage } from '@sendbird/chat/message';
import { User } from '@sendbird/chat';
import useHandleChannelEvents from '../hooks/useHandleChannelEvents';
import { waitFor } from '@testing-library/react';

const mockThreadActions = {
  onMessageReceived: jest.fn(),
  onMessageUpdated: jest.fn(),
  onMessageDeleted: jest.fn(),
  onReactionUpdated: jest.fn(),
  onUserMuted: jest.fn(),
  onUserUnmuted: jest.fn(),
  onUserBanned: jest.fn(),
  onUserUnbanned: jest.fn(),
  onUserLeft: jest.fn(),
  onChannelFrozen: jest.fn(),
  onChannelUnfrozen: jest.fn(),
  onOperatorUpdated: jest.fn(),
  onTypingStatusUpdated: jest.fn(),
};

jest.mock('../useThread', () => ({
  __esModule: true,
  default: () => ({
    actions: mockThreadActions,
  }),
}));

const mockLogger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

describe('useHandleChannelEvents', () => {
  const mockUser = { userId: 'user1' } as User;
  const mockMessage = { messageId: 1 } as UserMessage;
  const mockReactionEvent = { messageId: 1, key: 'like' };

  const createMockChannel = () => ({
    url: 'channel-url',
    getTypingUsers: jest.fn().mockReturnValue([mockUser]),
  }) as unknown as GroupChannel;

  const createMockSdk = (addHandler = jest.fn(), removeHandler = jest.fn()) => ({
    groupChannel: {
      addGroupChannelHandler: addHandler,
      removeGroupChannelHandler: removeHandler,
    },
  });

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
    jest.clearAllMocks();
  });

  it('should add channel handler on mount', () => {
    const mockAddHandler = jest.fn();
    const sdk = createMockSdk(mockAddHandler);

    renderChannelEventsHook({ sdk });

    expect(mockAddHandler).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(GroupChannelHandler),
    );
  });

  it('should remove channel handler on unmount', () => {
    const mockRemoveHandler = jest.fn();
    const sdk = createMockSdk(jest.fn(), mockRemoveHandler);

    const { unmount } = renderChannelEventsHook({ sdk });
    unmount();

    expect(mockRemoveHandler).toHaveBeenCalledWith(expect.any(String));
  });

  it('should handle message received event', () => {
    const mockAddHandler = jest.fn();
    const sdk = createMockSdk(mockAddHandler);
    const channel = createMockChannel();

    renderChannelEventsHook({ sdk, currentChannel: channel });

    const handler = mockAddHandler.mock.calls[0][1];
    handler.onMessageReceived(channel, mockMessage);

    expect(mockThreadActions.onMessageReceived).toHaveBeenCalledWith(
      channel,
      mockMessage,
    );
  });

  it('should handle message updated event', () => {
    const mockAddHandler = jest.fn();
    const sdk = createMockSdk(mockAddHandler);
    const channel = createMockChannel();

    renderChannelEventsHook({ sdk, currentChannel: channel });

    const handler = mockAddHandler.mock.calls[0][1];
    handler.onMessageUpdated(channel, mockMessage);

    expect(mockThreadActions.onMessageUpdated).toHaveBeenCalledWith(
      channel,
      mockMessage,
    );
  });

  it('should handle reaction updated event', () => {
    const mockAddHandler = jest.fn();
    const sdk = createMockSdk(mockAddHandler);
    const channel = createMockChannel();

    renderChannelEventsHook({ sdk, currentChannel: channel });

    const handler = mockAddHandler.mock.calls[0][1];
    handler.onReactionUpdated(channel, mockReactionEvent);

    expect(mockThreadActions.onReactionUpdated).toHaveBeenCalledWith(
      mockReactionEvent,
    );
  });

  it('should handle typing status updated event', () => {
    const mockAddHandler = jest.fn();
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

  it('should not add handler when sdk or currentChannel is missing', async () => {
    const mockAddHandler = jest.fn();
    const sdk = createMockSdk(mockAddHandler);

    await act(async () => {
      renderChannelEventsHook({ sdk, currentChannel: undefined });
      await waitFor(() => {
        expect(mockAddHandler).not.toHaveBeenCalled();
      });
    });
  });
});
