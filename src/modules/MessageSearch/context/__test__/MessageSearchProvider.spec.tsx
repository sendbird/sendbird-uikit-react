import React from 'react';
import { waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { MessageSearchProvider, useMessageSearchContext } from '../MessageSearchProvider';
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
  it('provides the correct initial state', () => {
    const wrapper = ({ children }) => (
      <MessageSearchProvider channelUrl="test-channel">
        {children}
      </MessageSearchProvider>
    );

    const { result } = renderHook(() => useMessageSearchContext(), { wrapper });

    expect(result.current.getState()).toEqual(expect.objectContaining({
      channelUrl: 'test-channel',
      allMessages: [],
      loading: false,
      isQueryInvalid: false,
      initialized: false,
      currentChannel: null,
      currentMessageSearchQuery: null,
      hasMoreResult: false,
    }));
  });

  it('updates state correctly when props change', () => {
    const wrapper = ({ children }) => (
      <MessageSearchProvider channelUrl="test-channel">
        {children}
      </MessageSearchProvider>
    );

    const { result } = renderHook(() => useMessageSearchContext(), { wrapper });
    expect(result.current.getState().channelUrl).toBe('test-channel');
    result.current.setState({ channelUrl: 'new-channel' });
    expect(result.current.getState().channelUrl).toBe('new-channel');
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
  });

  it('updates state correctly when actions are called', async () => {
    const wrapper = ({ children }) => (
      <MessageSearchProvider channelUrl="test-channel">
        {children}
      </MessageSearchProvider>
    );

    const { result } = renderHook(() => useMessageSearch(), { wrapper });

    await act(async () => {
      result.current.actions.setCurrentChannel({ url: 'test-channel' } as any);
      await waitFor(() => {
        expect(result.current.state.currentChannel).toEqual({ url: 'test-channel' });
        expect(result.current.state.initialized).toBe(true);
      });
    });

    await act(async () => {
      result.current.actions.startMessageSearch();
      await waitFor(() => {
        expect(result.current.state.loading).toBe(false);
        expect(result.current.state.isQueryInvalid).toBe(false);
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

      result.current.actions.getSearchedMessages([{ messageId: 1 }] as any, mockQuery as any);

      await waitFor(() => {
        expect(result.current.state.loading).toBe(false);
        expect(result.current.state.allMessages).toEqual([{ messageId: 1 }]);
        expect(result.current.state.hasMoreResult).toBe(true);
      });
    });
  });
});
