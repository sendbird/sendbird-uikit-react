import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { MessageSearchProvider } from '../../context/MessageSearchProvider';
import useMessageSearch from '../../context/hooks/useMessageSearch';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageSearchQuery } from '@sendbird/chat/message';

const mockState = {
  stores: {
    sdkStore: {
      sdk: {
        createMessageSearchQuery: jest.fn(() => ({
          next: jest.fn().mockResolvedValue([{ messageId: 1 }]),
        })),
      },
      initialized: true,
    },
  },
  config: { logger: console },
};
jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({ state: mockState })),
  useSendbird: jest.fn(() => ({ state: mockState })),
}));

describe('useMessageSearch', () => {
  const wrapper = ({ children }) => (
    <MessageSearchProvider channelUrl="test-channel">
      {children}
    </MessageSearchProvider>
  );

  it('provides initial state', () => {
    const { result } = renderHook(() => useMessageSearch(), { wrapper });

    expect(result.current.state).toEqual(expect.objectContaining({
      allMessages: [],
      loading: false,
      isInvalid: false,
      initialized: false,
      currentChannel: null,
      currentMessageSearchQuery: null,
      hasMoreResult: false,
    }));
  });

  it('updates state when setCurrentChannel is called', () => {
    const { result } = renderHook(() => useMessageSearch(), { wrapper });

    act(() => {
      result.current.actions.setCurrentChannel({ url: 'test-channel' } as GroupChannel);
    });

    expect(result.current.state.currentChannel).toEqual({ url: 'test-channel' });
    expect(result.current.state.initialized).toBe(true);
  });

  it('updates state when startMessageSearch is called', () => {
    const { result } = renderHook(() => useMessageSearch(), { wrapper });

    act(() => {
      result.current.actions.startMessageSearch();
    });

    expect(result.current.state.isInvalid).toBe(false);
    expect(result.current.state.loading).toBe(false);
  });

  it('updates state when getSearchedMessages is called', () => {
    const { result } = renderHook(() => useMessageSearch(), { wrapper });
    const messages = [{ messageId: 1 }, { messageId: 2 }];
    const mockQuery = { channelUrl: 'test-channel', hasNext: true } as MessageSearchQuery;

    act(() => {
      result.current.actions.startGettingSearchedMessages(mockQuery);
      result.current.actions.getSearchedMessages(messages as any, mockQuery);
    });

    expect(result.current.state.allMessages).toEqual(messages);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.hasMoreResult).toBe(true);
  });

  it('updates state when setQueryInvalid is called', () => {
    const { result } = renderHook(() => useMessageSearch(), { wrapper });

    act(() => {
      result.current.actions.setQueryInvalid();
    });

    expect(result.current.state.isInvalid).toBe(true);
  });

  it('updates state when getNextSearchedMessages is called', () => {
    const { result } = renderHook(() => useMessageSearch(), { wrapper });
    const initialMessages = [{ messageId: 1 }];
    const newMessages = [{ messageId: 2 }, { messageId: 3 }];
    const mockQuery = { channelUrl: 'test-channel', hasNext: false } as MessageSearchQuery;

    act(() => {
      result.current.actions.startGettingSearchedMessages(mockQuery);
      result.current.actions.getSearchedMessages(initialMessages as any, mockQuery);
      result.current.actions.getNextSearchedMessages(newMessages as any);
    });

    expect(result.current.state.allMessages).toEqual([...initialMessages, ...newMessages]);
    expect(result.current.state.hasMoreResult).toBe(false);
  });

  it('updates state when resetSearchString is called', () => {
    const { result } = renderHook(() => useMessageSearch(), { wrapper });
    const mockQuery = { channelUrl: 'test-channel', hasNext: false } as MessageSearchQuery;

    act(() => {
      result.current.actions.startGettingSearchedMessages(mockQuery);
      result.current.actions.getSearchedMessages([{ messageId: 1 }] as any, {} as any);
      result.current.actions.resetSearchString();
    });

    expect(result.current.state.allMessages).toEqual([]);
  });

  it('updates state when handleRetryToConnect is called', () => {
    const { result } = renderHook(() => useMessageSearch(), { wrapper });

    act(() => {
      result.current.actions.handleRetryToConnect();
    });

    expect(result.current.state.retryCount).toBe(1);
  });
});
