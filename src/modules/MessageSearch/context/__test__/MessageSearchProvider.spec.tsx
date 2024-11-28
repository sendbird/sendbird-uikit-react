import React from 'react';
import { waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { MessageSearchQuery } from '@sendbird/chat/message';

import { MessageSearchProvider } from '../MessageSearchProvider';
import useMessageSearch from '../hooks/useMessageSearch';

jest.mock('../../../../hooks/useSendbirdStateContext', () => ({
  __esModule: true,
  default: jest.fn(() => ({
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
  })),
}));

jest.mock('../hooks/useSetChannel', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => Promise.resolve()),
}));

jest.mock('../hooks/useGetSearchedMessages', () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
}));

jest.mock('../hooks/useScrollCallback', () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
}));

jest.mock('../hooks/useSearchStringEffect', () => ({
  __esModule: true,
  default: jest.fn(() => ''),
}));

describe('MessageSearchProvider', () => {
  const initialState = {
    allMessages: [],
    loading: false,
    isQueryInvalid: false,
    initialized: false,
    currentChannel: null,
    currentMessageSearchQuery: null,
    hasMoreResult: false,
    channelUrl: 'test-channel',
    searchString: undefined,
    retryCount: 0,
    selectedMessageId: null,
    handleOnScroll: expect.any(Function),
    onScroll: expect.any(Function),
    onResultClick: undefined,
    messageSearchQuery: undefined,
    scrollRef: { current: null },
    requestString: '',
  };

  it('provides the correct initial state', () => {
    const wrapper = ({ children }) => (
      <MessageSearchProvider channelUrl="test-channel">
        {children}
      </MessageSearchProvider>
    );

    const { result } = renderHook(() => useMessageSearch(), { wrapper });

    expect(result.current.state).toEqual(expect.objectContaining(initialState));
  });

  it('updates state correctly when props change', async () => {
    const initialUrl = 'test-channel';
    const newUrl = 'new-channel';

    const wrapper = ({ children, channelUrl }) => (
      <MessageSearchProvider channelUrl={channelUrl}>
        {children}
      </MessageSearchProvider>
    );

    const { result, rerender } = renderHook(
      () => useMessageSearch(),
      {
        wrapper,
        initialProps: { channelUrl: initialUrl, children: null },
      },
    );

    expect(result.current.state.channelUrl).toBe(initialUrl);

    await act(async () => {
      rerender({ channelUrl: newUrl, children: null });

      await waitFor(() => {
        // Verify other states remain unchanged
        const newState = result.current.state;
        expect(newState.channelUrl).toBe(newUrl);
        expect(newState.allMessages).toEqual(initialState.allMessages);
        expect(newState.loading).toBe(initialState.loading);
        expect(newState.isQueryInvalid).toBe(initialState.isQueryInvalid);
      });
    });
  });

  it('provides correct actions through useMessageSearch hook', () => {
    const wrapper = ({ children }) => (
      <MessageSearchProvider channelUrl="test-channel">
        {children}
      </MessageSearchProvider>
    );

    const { result } = renderHook(() => useMessageSearch(), { wrapper });

    expect(result.current.actions).toHaveProperty('setCurrentChannel');
    expect(result.current.actions).toHaveProperty('getSearchedMessages');
    expect(result.current.actions).toHaveProperty('startMessageSearch');
    expect(result.current.actions).toHaveProperty('setQueryInvalid');
    expect(result.current.actions).toHaveProperty('startGettingSearchedMessages');
    expect(result.current.actions).toHaveProperty('getNextSearchedMessages');
    expect(result.current.actions).toHaveProperty('resetSearchString');
  });

  it('updates state correctly when setCurrentChannel is called', async () => {
    const wrapper = ({ children }) => (
      <MessageSearchProvider channelUrl="test-channel">
        {children}
      </MessageSearchProvider>
    );

    const { result } = renderHook(() => useMessageSearch(), { wrapper });
    const newChannel = { url: 'test-channel' };

    await act(async () => {
      result.current.actions.setCurrentChannel(newChannel as any);
      await waitFor(() => {
        const updatedState = result.current.state;
        expect(updatedState.currentChannel).toEqual(newChannel);
        expect(updatedState.initialized).toBe(true);
        // Verify other states remain unchanged
        expect(updatedState.loading).toBe(initialState.loading);
        expect(updatedState.isQueryInvalid).toBe(initialState.isQueryInvalid);
        expect(updatedState.allMessages).toEqual(initialState.allMessages);
        expect(updatedState.hasMoreResult).toBe(initialState.hasMoreResult);
      });
    });
  });

  it('updates state correctly when startMessageSearch is called', async () => {
    const wrapper = ({ children }) => (
      <MessageSearchProvider channelUrl="test-channel">
        {children}
      </MessageSearchProvider>
    );

    const { result } = renderHook(() => useMessageSearch(), { wrapper });

    await act(async () => {
      result.current.actions.startMessageSearch();
      await waitFor(() => {
        const updatedState = result.current.state;
        expect(updatedState.loading).toBe(false);
        expect(updatedState.isQueryInvalid).toBe(false);
        // Verify other states remain unchanged
        expect(updatedState.allMessages).toEqual(initialState.allMessages);
        expect(updatedState.currentChannel).toBe(initialState.currentChannel);
        expect(updatedState.hasMoreResult).toBe(initialState.hasMoreResult);
      });
    });
  });

  it('updates state correctly when getSearchedMessages is called', async () => {
    const wrapper = ({ children }) => (
      <MessageSearchProvider channelUrl="test-channel">
        {children}
      </MessageSearchProvider>
    );

    const { result } = renderHook(() => useMessageSearch(), { wrapper });
    const messages = [{ messageId: 1 }, { messageId: 2 }];
    const mockQuery = { channelUrl: 'test-channel', hasNext: true };

    await act(async () => {
      result.current.actions.startGettingSearchedMessages(mockQuery as any);
      result.current.actions.getSearchedMessages(messages as any, mockQuery as any);
      await waitFor(() => {
        const updatedState = result.current.state;
        expect(updatedState.allMessages).toEqual(messages);
        expect(updatedState.loading).toBe(false);
        expect(updatedState.hasMoreResult).toBe(true);
        expect(updatedState.currentMessageSearchQuery).toEqual(mockQuery);
        // Verify other states remain unchanged
        expect(updatedState.isQueryInvalid).toBe(initialState.isQueryInvalid);
        expect(updatedState.initialized).toBe(initialState.initialized);
      });
    });
  });

  it('calls onResultLoaded when search results are loaded', async () => {
    const onResultLoaded = jest.fn();
    const wrapper = ({ children }) => (
      <MessageSearchProvider
        channelUrl="test-channel"
        onResultLoaded={onResultLoaded}
        searchString="test"
      >
        {children}
      </MessageSearchProvider>
    );

    const { result } = renderHook(() => useMessageSearch(), { wrapper });

    await act(async () => {
      result.current.actions.setCurrentChannel({ url: 'test-channel' } as any);
      result.current.actions.startMessageSearch();
      const mockQuery = {
        channelUrl: 'test-channel',
        key: 'test-key',
        hasNext: true,
      };
      result.current.actions.startGettingSearchedMessages(mockQuery as any);

      await waitFor(() => {
        expect(result.current.state.loading).toBe(true);
        expect(result.current.state.currentMessageSearchQuery).toEqual(mockQuery);
      });

      const messages = [{ messageId: 1 }];
      result.current.actions.getSearchedMessages(messages as any, mockQuery as any);

      await waitFor(() => {
        expect(result.current.state.loading).toBe(false);
        expect(result.current.state.allMessages).toEqual(messages);
        expect(result.current.state.hasMoreResult).toBe(true);
      });
    });
  });

  it('updates state correctly when setQueryInvalid is called', async () => {
    const wrapper = ({ children }) => (
      <MessageSearchProvider channelUrl="test-channel">
        {children}
      </MessageSearchProvider>
    );

    const { result } = renderHook(() => useMessageSearch(), { wrapper });

    await act(async () => {
      result.current.actions.setQueryInvalid();
      await waitFor(() => {
        const updatedState = result.current.state;
        expect(updatedState.isQueryInvalid).toBe(true);
        // Verify other states remain unchanged
        expect(updatedState.allMessages).toEqual(initialState.allMessages);
        expect(updatedState.loading).toBe(initialState.loading);
        expect(updatedState.currentChannel).toBe(initialState.currentChannel);
      });
    });
  });

  it('updates state correctly when resetSearchString is called', async () => {
    const wrapper = ({ children }) => (
      <MessageSearchProvider channelUrl="test-channel">
        {children}
      </MessageSearchProvider>
    );
    const mockQuery = { channelUrl: 'test-channel', hasNext: false } as MessageSearchQuery;

    const { result } = renderHook(() => useMessageSearch(), { wrapper });

    await act(async () => {
      result.current.actions.startGettingSearchedMessages(mockQuery);
      result.current.actions.getSearchedMessages([{ messageId: 1 }] as any, {} as any);
      result.current.actions.resetSearchString();
      await waitFor(() => {
        const updatedState = result.current.state;
        expect(updatedState.allMessages).toEqual([]);
        // Verify other states remain unchanged
        expect(updatedState.isQueryInvalid).toBe(initialState.isQueryInvalid);
        expect(updatedState.currentChannel).toBe(initialState.currentChannel);
      });
    });
  });
});
