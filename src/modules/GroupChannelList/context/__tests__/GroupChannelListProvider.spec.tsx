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
    groupChannels: [{ url: 'test-groupchannel-url-1' }],
    refresh: null,
    loadMore: null,
  })),
}));

describe('GroupChannelListProvider', () => {
  const initialState = {
    className: '',
    selectedChannelUrl: '',
    disableAutoSelect: false,
    allowProfileEdit: undefined,
    isTypingIndicatorEnabled: undefined,
    isMessageReceiptStatusEnabled: undefined,
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
      await waitFor(() => {
        const newState = result.current.state;
        expect(newState.className).toEqual('new-classname');
        expect(newState.disableAutoSelect).toEqual(true);
      });
    });
  });

});
