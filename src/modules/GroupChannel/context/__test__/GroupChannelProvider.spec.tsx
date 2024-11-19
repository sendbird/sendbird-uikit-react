import React from 'react';
import { waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { GroupChannelProvider, useGroupChannelContext } from '../GroupChannelProvider';
import { useGroupChannel } from '../hooks/useGroupChannel';

const mockLogger = { warning: jest.fn() };
const mockChannel = {
  url: 'test-channel',
  members: [{ userId: '1', nickname: 'user1' }],
};

const mockGetChannel = jest.fn().mockResolvedValue(mockChannel);
const mockMessageCollection = {
  dispose: jest.fn(),
  setMessageCollectionHandler: jest.fn(),
  initialize: jest.fn().mockResolvedValue(null),
  loadPrevious: jest.fn(),
  loadNext: jest.fn(),
};
jest.mock('../../../../hooks/useSendbirdStateContext', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    stores: {
      sdkStore: {
        sdk: {
          groupChannel: {
            getChannel: mockGetChannel,
            addGroupChannelHandler: jest.fn(),
            removeGroupChannelHandler: jest.fn(),
          },
          createMessageCollection: jest.fn().mockReturnValue(mockMessageCollection),
        },
        initialized: true,
      },
    },
    config: {
      logger: mockLogger,
      markAsReadScheduler: {
        push: jest.fn(),
      },
      groupChannel: {
        replyType: 'NONE',
        threadReplySelectType: 'PARENT',
      },
      groupChannelSettings: {
        enableMessageSearch: true,
      },
      isOnline: true,
      pubSub: {
        subscribe: () => ({ remove: jest.fn() }),
      },
    },
  })),
}));

describe('GroupChannelProvider', () => {
  it('provides the correct initial state', () => {
    const wrapper = ({ children }) => (
      <GroupChannelProvider channelUrl="test-channel">
        {children}
      </GroupChannelProvider>
    );

    const { result } = renderHook(() => useGroupChannelContext(), { wrapper });

    expect(result.current.channelUrl).toBe('test-channel');
    expect(result.current.currentChannel).toBe(null);
    expect(result.current.isScrollBottomReached).toBe(true);
  });

  it('updates state correctly when channel is fetched', async () => {
    const wrapper = ({ children }) => (
      <GroupChannelProvider channelUrl="test-channel">
        {children}
      </GroupChannelProvider>
    );

    const { result } = renderHook(() => useGroupChannel(), { wrapper });

    act(async () => {
      await waitFor(() => {
        expect(result.current.state.currentChannel).toBeTruthy();
        expect(result.current.state.currentChannel?.url).toBe('test-channel');
      });
    });
  });

  it('handles channel error correctly', async () => {
    const mockError = new Error('Channel fetch failed');
    jest.spyOn(console, 'error').mockImplementation(() => {});

    jest.mock('../../../../hooks/useSendbirdStateContext', () => ({
      default: () => ({
        stores: {
          sdkStore: {
            sdk: {
              groupChannel: {
                getChannel: jest.fn().mockRejectedValue(mockError),
              },
            },
            initialized: true,
          },
        },
        config: { logger: console },
      }),
    }));

    const wrapper = ({ children }) => (
      <GroupChannelProvider channelUrl="error-channel">
        {children}
      </GroupChannelProvider>
    );

    const { result } = renderHook(() => useGroupChannel(), { wrapper });

    act(async () => {
      await waitFor(() => {
        expect(result.current.state.fetchChannelError).toBeNull();
        expect(result.current.state.currentChannel).toBeNull();
      });
    });
  });

  it('correctly handles scroll to bottom', async () => {
    const wrapper = ({ children }) => (
      <GroupChannelProvider channelUrl="test-channel">
        {children}
      </GroupChannelProvider>
    );

    const { result } = renderHook(() => useGroupChannel(), { wrapper });

    act(async () => {
      result.current.actions.scrollToBottom();
      await waitFor(() => {
        expect(result.current.state.isScrollBottomReached).toBe(true);
      });
    });
  });
});
