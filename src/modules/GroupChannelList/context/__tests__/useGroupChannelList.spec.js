import { GroupChannelListProvider, useGroupChannelListContext } from '../GroupChannelListProvider';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';

jest.mock('../../../../hooks/useSendbirdStateContext', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    stores: {
      sdkStore: {
        sdk: {
          currentUser: {
            userId: 'test-user-id'
          }
        },
        initialized: true,
      },
    },
    config: { logger: console },
  })),
}));

jest.mock('@sendbird/uikit-tools', () => ({
  useGroupChannelList: jest.fn(() => ({
    refreshing: false,
    initialized: false,
    groupChannels: [],
    refresh: null,
    loadMore: null,
  })),
  useGroupChannelHandler: jest.fn(() => {})
}));

describe('GroupChannelListProvider', () => {
  const initialState = {
    className: '',
    selectedChannelUrl: '',
    disableAutoSelect: false,
    allowProfileEdit: false,
    isTypingIndicatorEnabled: false,
    isMessageReceiptStatusEnabled: false,
    onChannelSelect: undefined,
    onChannelCreated: undefined,
    onThemeChange: undefined,
    onCreateChannelClick: undefined,
    onBeforeCreateChannel: undefined,
    onUserProfileUpdated: undefined,
    typingChannelUrls: [],
    refreshing: false,
    initialized: false,
    groupChannels: [],
    refresh: null,
    loadMore: null,
  };

  it('provide the correct initial state', () => {
    const wrapper = ({ children }) => (
      <GroupChannelListProvider>
        {children}
      </GroupChannelListProvider>
    );

    const { result } = renderHook(() => useGroupChannelListContext(), { wrapper });

    expect(result.current.getState()).toEqual(expect.objectContaining(initialState));
  })

  it('update state through the props correctly', async () => {
    const wrapper = ({ children }) => (
      <GroupChannelListProvider className="old-classname">
        {children}
      </GroupChannelListProvider>
    );

    const { result } = renderHook(() => useGroupChannelListContext(), { wrapper });
    expect(result.current.getState().className).toEqual('old-classname');

    await act(async () => {
      result.current.setState({ className: 'new-classname' });
      await waitFor(() => {
        const newState = result.current.getState();
        expect(newState.className).toEqual('new-classname');
        expect(newState.disableAutoSelect).toEqual(false);
      });
    })
  });

});
