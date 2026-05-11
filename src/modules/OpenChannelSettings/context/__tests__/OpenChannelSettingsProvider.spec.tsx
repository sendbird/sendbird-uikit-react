import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';

import { OpenChannelSettingsProvider, useOpenChannelSettingsContext } from '../OpenChannelSettingsProvider';

const mockLogger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};
const mockEnter = jest.fn().mockResolvedValue(undefined);
const mockExit = jest.fn().mockResolvedValue(undefined);
const mockChannel = {
  url: 'open-channel-url',
  enter: mockEnter,
  exit: mockExit,
};
const mockGetChannel = jest.fn().mockResolvedValue(mockChannel);
const mockAddOpenChannelHandler = jest.fn();
const mockRemoveOpenChannelHandler = jest.fn();

jest.mock('@sendbird/chat/openChannel', () => ({
  OpenChannelHandler: jest.fn((handlers) => handlers),
}));

jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: {
      stores: {
        sdkStore: {
          initialized: true,
          sdk: {
            currentUser: { userId: 'current-user' },
            openChannel: {
              getChannel: mockGetChannel,
              addOpenChannelHandler: mockAddOpenChannelHandler,
              removeOpenChannelHandler: mockRemoveOpenChannelHandler,
            },
          },
        },
      },
      config: {
        logger: mockLogger,
      },
    },
  })),
}));

describe('OpenChannelSettingsProvider', () => {
  const wrapper = ({ children }) => (
    <OpenChannelSettingsProvider channelUrl={mockChannel.url}>
      {children}
    </OpenChannelSettingsProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetChannel.mockResolvedValue(mockChannel);
    mockEnter.mockResolvedValue(undefined);
  });

  it('provides initial settings context state', () => {
    mockGetChannel.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useOpenChannelSettingsContext(), { wrapper });

    expect(result.current.channelUrl).toBe(mockChannel.url);
    expect(result.current.channel).toBeNull();
    expect(result.current.isChannelInitialized).toBe(false);
    expect(result.current.setChannel).toEqual(expect.any(Function));
  });

  it('fetches and enters the open channel', async () => {
    const { result } = renderHook(() => useOpenChannelSettingsContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.channel).toBe(mockChannel);
      expect(result.current.isChannelInitialized).toBe(true);
    });

    expect(mockGetChannel).toHaveBeenCalledWith(mockChannel.url);
    expect(mockEnter).toHaveBeenCalledTimes(1);
    expect(mockLogger.info).toHaveBeenCalledWith('OpenChannelSettings | Succeeded to enter channel', mockChannel.url);
  });

  it('clears channel state when fetching fails', async () => {
    const fetchError = new Error('fetch failed');
    mockGetChannel.mockRejectedValue(fetchError);

    const { result } = renderHook(() => useOpenChannelSettingsContext(), { wrapper });

    await waitFor(() => {
      expect(mockLogger.error).toHaveBeenCalledWith('open channel setting: error fetching', fetchError);
    });
    expect(result.current.channel).toBeNull();
  });

  it('keeps channel null when entering fails', async () => {
    const enterError = new Error('enter failed');
    mockEnter.mockRejectedValue(enterError);

    const { result } = renderHook(() => useOpenChannelSettingsContext(), { wrapper });

    await waitFor(() => {
      expect(mockLogger.warning).toHaveBeenCalledWith('OpenChannelSettings | Failed to enter channel', enterError);
    });
    expect(result.current.channel).toBeNull();
    expect(result.current.isChannelInitialized).toBe(false);
  });

  it('updates channel state from open channel handler events', async () => {
    const { result } = renderHook(() => useOpenChannelSettingsContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.channel).toBe(mockChannel);
      expect(mockAddOpenChannelHandler).toHaveBeenCalledTimes(1);
    });

    const handler = mockAddOpenChannelHandler.mock.calls[0][1];
    const updatedChannel = { ...mockChannel, name: 'Updated channel' };

    act(() => {
      handler.onChannelChanged(updatedChannel);
    });

    expect(result.current.channel).toBe(updatedChannel);

    act(() => {
      handler.onChannelDeleted(mockChannel.url);
    });

    expect(result.current.channel).toBeNull();
  });

  it('handles moderation events from the open channel handler', async () => {
    const { result } = renderHook(() => useOpenChannelSettingsContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.channel).toBe(mockChannel);
      expect(mockAddOpenChannelHandler).toHaveBeenCalledTimes(1);
    });

    const handler = mockAddOpenChannelHandler.mock.calls[0][1];
    const updatedChannel = { ...mockChannel, name: 'Updated by handler' };
    const currentUser = { userId: 'current-user' };
    const otherUser = { userId: 'other-user' };

    act(() => {
      handler.onOperatorUpdated(updatedChannel);
      handler.onUserMuted(updatedChannel, currentUser);
      handler.onUserUnmuted(updatedChannel, currentUser);
    });
    expect(result.current.channel).toBe(updatedChannel);

    const otherUserMutedChannel = { ...mockChannel, name: 'Other user muted' };
    const otherUserUnmutedChannel = { ...mockChannel, name: 'Other user unmuted' };

    act(() => {
      handler.onUserMuted(otherUserMutedChannel, otherUser);
    });
    expect(result.current.channel).toBe(otherUserMutedChannel);

    act(() => {
      handler.onUserUnmuted(otherUserUnmutedChannel, otherUser);
    });
    expect(result.current.channel).toBe(otherUserUnmutedChannel);

    act(() => {
      handler.onUserBanned(updatedChannel, currentUser);
    });
    expect(result.current.channel).toBeNull();

    act(() => {
      handler.onUserUnbanned(updatedChannel, currentUser);
    });
    expect(result.current.channel).toBe(updatedChannel);

    act(() => {
      handler.onUserBanned({ ...mockChannel, name: 'Ignored ban' }, otherUser);
    });
    expect(result.current.channel).toBe(updatedChannel);
  });

  it('removes the open channel handler on unmount', async () => {
    const { result, unmount } = renderHook(() => useOpenChannelSettingsContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.channel).toBe(mockChannel);
      expect(mockAddOpenChannelHandler).toHaveBeenCalledTimes(1);
    });

    const removeCallCountBeforeUnmount = mockRemoveOpenChannelHandler.mock.calls.length;
    unmount();

    expect(mockRemoveOpenChannelHandler).toHaveBeenCalledTimes(removeCallCountBeforeUnmount + 1);
    expect(mockLogger.info).toHaveBeenCalledWith(
      'OpenChannelSettings | Removing channel handlers',
      expect.any(String),
    );
  });
});
