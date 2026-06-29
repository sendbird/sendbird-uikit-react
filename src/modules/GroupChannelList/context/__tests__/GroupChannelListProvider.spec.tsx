import React from 'react';
import { GroupChannelListProvider, useGroupChannelListStore } from '../GroupChannelListProvider';
import { useGroupChannelList } from '../useGroupChannelList';
import { act, renderHook, waitFor } from '@testing-library/react';

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
vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', async () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
  useSendbird: vi.fn(() => ({ state: mockState })),
}));

vi.mock('@sendbird/uikit-tools', async () => ({
  ...await vi.importActual('@sendbird/uikit-tools'),
  useGroupChannelList: vi.fn(() => ({
    refreshing: false,
    initialized: true,
    groupChannels: [{ url: 'test-groupchannel-url-1', serialize: () => JSON.stringify({}) }],
    refresh: null,
    loadMore: null,
  })),
}));

describe('GroupChannelListProvider', () => {
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
      <GroupChannelListProvider onChannelSelect={vi.fn()} onChannelCreated={vi.fn()}>
        {children}
      </GroupChannelListProvider>
    );

    const { result } = renderHook(() => useGroupChannelList(), { wrapper });

    expect(result.current.state).toMatchObject(initialState);
  });

  it('update state correctly', async () => {
    const channelListQueryParams = {} as any;
    const wrapper = ({ children }) => (
      <GroupChannelListProvider className="old-classname" onChannelSelect={vi.fn()} onChannelCreated={vi.fn()} channelListQueryParams={channelListQueryParams}>
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

});
