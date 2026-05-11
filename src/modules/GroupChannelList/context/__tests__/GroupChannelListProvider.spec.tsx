import React from 'react';
import { GroupChannelListProvider, useGroupChannelListStore } from '../GroupChannelListProvider';
import { useGroupChannelList } from '../useGroupChannelList';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useGroupChannelList as useGroupChannelListDataSource } from '@sendbird/uikit-tools';

const mockState = {
  stores: {
    sdkStore: {
      sdk: {
        currentUser: {
          userId: 'test-user-id',
        },
      },
      initialized: true,
    },
  },
  config: {
    logger: console,
    groupChannelList: {
    },
  },
};
jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({ state: mockState })),
  useSendbird: jest.fn(() => ({ state: mockState })),
}));

jest.mock('@sendbird/uikit-tools', () => ({
  ...jest.requireActual('@sendbird/uikit-tools'),
  useGroupChannelList: jest.fn(() => ({
    refreshing: false,
    initialized: true,
    groupChannels: [{ url: 'test-groupchannel-url-1', serialize: () => JSON.stringify(this) }],
    refresh: null,
    loadMore: null,
  })),
}));

describe('GroupChannelListProvider', () => {
  const createDataSource = (overrides = {}) => ({
    refreshing: false,
    initialized: true,
    groupChannels: [{ url: 'test-groupchannel-url-1', serialize: () => JSON.stringify(this) }],
    refresh: null,
    loadMore: null,
    ...overrides,
  });

  beforeEach(() => {
    (useGroupChannelListDataSource as jest.Mock).mockImplementation(() => createDataSource());
  });

  const initialState = {
    className: '',
    selectedChannelUrl: '',
    disableAutoSelect: false,
    allowProfileEdit: true,
    isTypingIndicatorEnabled: false,
    isMessageReceiptStatusEnabled: false,
    onChannelSelect: expect.any(Function),
    onChannelCreated: expect.any(Function),
    onThemeChange: undefined,
    onCreateChannelClick: undefined,
    onBeforeCreateChannel: undefined,
    onUserProfileUpdated: undefined,
    typingChannelUrls: [],
    refreshing: false,
    initialized: true,
    groupChannels: [{ url: 'test-groupchannel-url-1' }],
    refresh: null,
    loadMore: null,
  };

  it('provide the correct initial state', () => {
    const wrapper = ({ children }) => (
      <GroupChannelListProvider onChannelSelect={jest.fn()} onChannelCreated={jest.fn()}>
        {children}
      </GroupChannelListProvider>
    );

    const { result } = renderHook(() => useGroupChannelList(), { wrapper });

    expect(result.current.state).toMatchObject(initialState);
  });

  it('update state correctly', async () => {
    const channelListQueryParams = {} as any;
    const wrapper = ({ children }) => (
      <GroupChannelListProvider className="old-classname" onChannelSelect={jest.fn()} onChannelCreated={jest.fn()} channelListQueryParams={channelListQueryParams}>
        {children}
      </GroupChannelListProvider>
    );

    channelListQueryParams.prev = 42;

    const { result } = renderHook(() => useGroupChannelListStore(), { wrapper });
    expect(result.current.state.className).toEqual('old-classname');

    await act(async () => {
      result.current.updateState({ className: 'new-classname' });
      result.current.updateState({ disableAutoSelect: true });
    });

    await waitFor(() => {
      const newState = result.current.state;
      expect(newState.className).toEqual('new-classname');
      expect(newState.disableAutoSelect).toEqual(true);
    });
  });

  it('keeps pagination callbacks fresh when the data source updates', async () => {
    const refresh = jest.fn();
    const loadMore = jest.fn();
    let dataSource = createDataSource({ refresh, loadMore });
    (useGroupChannelListDataSource as jest.Mock).mockImplementation(() => dataSource);

    const wrapper = ({ children }) => (
      <GroupChannelListProvider onChannelSelect={jest.fn()} onChannelCreated={jest.fn()}>
        {children}
      </GroupChannelListProvider>
    );

    const { result } = renderHook(() => useGroupChannelListStore(), { wrapper });

    await waitFor(() => {
      expect(result.current.state.refresh).toEqual(expect.any(Function));
      expect(result.current.state.loadMore).toEqual(expect.any(Function));
      expect(result.current.state.scrollRef).toEqual(expect.objectContaining({ current: null }));
    });
    refresh.mockClear();
    loadMore.mockClear();

    const nextRefresh = jest.fn();
    const nextLoadMore = jest.fn();
    dataSource = createDataSource({ refresh: nextRefresh, loadMore: nextLoadMore });

    await act(async () => {
      result.current.updateState({ channelListQueryParams: { refreshed: true } as any });
    });

    await act(async () => {
      result.current.state.refresh?.();
      result.current.state.loadMore?.();
    });

    expect(refresh).not.toHaveBeenCalled();
    expect(loadMore).not.toHaveBeenCalled();
    expect(nextRefresh).toHaveBeenCalledTimes(1);
    expect(nextLoadMore).toHaveBeenCalledTimes(1);
  });

  it('auto-selects the first channel when channels arrive after initialization', async () => {
    const onChannelSelect = jest.fn();
    const delayedChannel = {
      url: 'delayed-channel',
      serialize: () => JSON.stringify({ url: 'delayed-channel' }),
    };
    let dataSource = createDataSource({ groupChannels: [] });
    (useGroupChannelListDataSource as jest.Mock).mockImplementation(() => dataSource);

    const wrapper = ({ children }) => (
      <GroupChannelListProvider onChannelSelect={onChannelSelect} onChannelCreated={jest.fn()}>
        {children}
      </GroupChannelListProvider>
    );

    const { rerender } = renderHook(() => useGroupChannelListStore(), { wrapper });

    await waitFor(() => {
      expect(onChannelSelect).toHaveBeenCalledWith(null);
    });
    onChannelSelect.mockClear();

    dataSource = createDataSource({ groupChannels: [delayedChannel] });
    rerender();

    await waitFor(() => {
      expect(onChannelSelect).toHaveBeenCalledWith(delayedChannel);
    });
  });

});
