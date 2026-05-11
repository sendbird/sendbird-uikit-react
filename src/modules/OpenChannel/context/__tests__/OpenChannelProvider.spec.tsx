import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';

import { OpenChannelProvider, useOpenChannelContext } from '../OpenChannelProvider';
import topics from '../../../../lib/pubSub/topics';

type SubscriberCallback = (payload: any) => void;

const mockLogger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};
const mockSubscribers = new Map<string, SubscriberCallback>();
const mockSubscribe = jest.fn((topic, callback) => {
  mockSubscribers.set(topic, callback);
  return { remove: jest.fn(() => mockSubscribers.delete(topic)) };
});
const mockOperator = { userId: 'operator-user' };
const mockOpenChannel = {
  url: 'open-channel-url',
  operators: [mockOperator],
  isFrozen: false,
};

function mockUseSetChannel(_params, { messagesDispatcher }) {
  React.useEffect(() => {
    messagesDispatcher({
      type: 'SET_CURRENT_CHANNEL',
      payload: mockOpenChannel,
    });
  }, [messagesDispatcher]);
}

function mockUseInitialMessagesFetch({ currentOpenChannel }, { messagesDispatcher }) {
  React.useEffect(() => {
    if (currentOpenChannel) {
      messagesDispatcher({
        type: 'GET_PREV_MESSAGES_SUCESS',
        payload: {
          currentOpenChannel,
          messages: [],
          hasMore: false,
          lastMessageTimestamp: 0,
        },
      });
    }
  }, [currentOpenChannel, messagesDispatcher]);
}

jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: {
      stores: {
        sdkStore: {
          sdk: {},
          initialized: true,
        },
        userStore: {
          user: { userId: 'operator-user' },
        },
      },
      config: {
        userId: 'operator-user',
        isOnline: true,
        logger: mockLogger,
        pubSub: { subscribe: mockSubscribe },
        imageCompression: {},
      },
    },
  })),
}));

jest.mock('../hooks/useSetChannel', () => ({ __esModule: true, default: jest.fn(mockUseSetChannel) }));
jest.mock('../hooks/useInitialMessagesFetch', () => ({ __esModule: true, default: jest.fn(mockUseInitialMessagesFetch) }));

jest.mock('../hooks/useHandleChannelEvents', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../hooks/useCheckScrollBottom', () => ({ __esModule: true, default: jest.fn(() => jest.fn(() => true)) }));
jest.mock('../hooks/useScrollCallback', () => ({ __esModule: true, default: jest.fn(() => jest.fn()) }));
jest.mock('../hooks/useSendMessageCallback', () => ({ __esModule: true, default: jest.fn(() => jest.fn()) }));
jest.mock('../hooks/useFileUploadCallback', () => ({ __esModule: true, default: jest.fn(() => jest.fn()) }));
jest.mock('../hooks/useUpdateMessageCallback', () => ({ __esModule: true, default: jest.fn(() => jest.fn()) }));
jest.mock('../hooks/useDeleteMessageCallback', () => ({ __esModule: true, default: jest.fn(() => jest.fn()) }));
jest.mock('../hooks/useResendMessageCallback', () => ({ __esModule: true, default: jest.fn(() => jest.fn()) }));
jest.mock('../hooks/useTrimMessageList', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  scrollIntoLast: jest.fn(),
}));

describe('OpenChannelProvider', () => {
  const wrapper = ({ children }) => (
    <OpenChannelProvider channelUrl={mockOpenChannel.url} messageLimit={10}>
      {children}
    </OpenChannelProvider>
  );

  beforeEach(() => {
    mockSubscribers.clear();
    jest.clearAllMocks();
  });

  it('provides channel state, props, and derived operator flags', async () => {
    const { result } = renderHook(() => useOpenChannelContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.currentOpenChannel?.url).toBe(mockOpenChannel.url);
      expect(result.current.initialized).toBe(true);
    });

    expect(result.current.channelUrl).toBe(mockOpenChannel.url);
    expect(result.current.messageLimit).toBe(10);
    expect(result.current.amIOperator).toBe(true);
    expect(result.current.amIBanned).toBe(false);
    expect(result.current.amIMuted).toBe(false);
    expect(result.current.disabled).toBe(false);
    expect(result.current.fetchMore).toBe(true);
  });

  it('subscribes to message pubSub events and updates message state', async () => {
    const { result } = renderHook(() => useOpenChannelContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.currentOpenChannel?.url).toBe(mockOpenChannel.url);
    });

    const pendingMessage = { messageId: 1, reqId: 'req-1' };
    act(() => {
      mockSubscribers.get(topics.SEND_MESSAGE_START)?.({
        channel: mockOpenChannel,
        message: pendingMessage,
      });
    });

    expect(result.current.allMessages).toEqual([pendingMessage]);

    const sentMessage = { messageId: 10, reqId: 'req-1' };
    act(() => {
      mockSubscribers.get(topics.SEND_USER_MESSAGE)?.({
        channel: mockOpenChannel,
        message: sentMessage,
      });
    });

    expect(result.current.allMessages).toEqual([sentMessage]);

    const pendingFileMessage = { messageId: 2, reqId: 'req-2' };
    act(() => {
      mockSubscribers.get(topics.SEND_MESSAGE_START)?.({
        channel: mockOpenChannel,
        message: pendingFileMessage,
      });
    });

    expect(result.current.allMessages).toEqual([sentMessage, pendingFileMessage]);

    const sentFileMessage = { messageId: 20, reqId: 'req-2' };
    act(() => {
      mockSubscribers.get(topics.SEND_FILE_MESSAGE)?.({
        channel: mockOpenChannel,
        message: sentFileMessage,
      });
    });

    expect(result.current.allMessages).toEqual([sentMessage, sentFileMessage]);
  });
});
