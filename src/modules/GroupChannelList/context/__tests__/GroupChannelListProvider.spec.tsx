import React from 'react';
import {
  GroupChannelListProvider,
  useGroupChannelListContext,
} from '../GroupChannelListProvider';
import { act, renderHook, waitFor } from '@testing-library/react';

jest.mock('../../../../hooks/useSendbirdStateContext', () => ({
  __esModule: true,
  default: jest.fn(() => ({
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
    config: { logger: console },
  })),
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
    allowProfileEdit: false,
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

    const { result } = renderHook(() => useGroupChannelListContext(), { wrapper });

    expect(result.current.getState()).toMatchObject(initialState);
  });

  it('update state correctly', async () => {
    const channelListQueryParams = {} as any;
    const wrapper = ({ children }) => (
      <GroupChannelListProvider className="old-classname" onChannelSelect={jest.fn()} onChannelCreated={jest.fn()} channelListQueryParams={channelListQueryParams}>
        {children}
      </GroupChannelListProvider>
    );

    channelListQueryParams.prev = 42;

    const { result } = renderHook(() => useGroupChannelListContext(), { wrapper });
    expect(result.current.getState().className).toEqual('old-classname');

    await act(async () => {
      result.current.setState({ className: 'new-classname' });
      result.current.setState({ disableAutoSelect: true });
      await waitFor(() => {
        const newState = result.current.getState();
        expect(newState.className).toEqual('new-classname');
        expect(newState.disableAutoSelect).toEqual(true);
      });
    });
  });

});
