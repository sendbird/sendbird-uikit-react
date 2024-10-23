import { GroupChannelListProvider, useGroupChannelListContext } from '../GroupChannelListProvider';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { useGroupChannelList } from '../useGroupChannelList';

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
  useGroupChannelList: jest.fn(() => ({
    refreshing: false,
    initialized: false,
    groupChannels: [],
    refresh: null,
    loadMore: null,
  })),
  useGroupChannelHandler: jest.fn(() => {}),
}));

jest.mock('../GroupChannelListProvider', () => ({
  ...jest.requireActual('../GroupChannelListProvider'),
  useGroupChannelListContext: jest.fn(),
}));

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

const mockStore = {
  getState: jest.fn(() => initialState),
  setState: jest.fn(),
  subscribe: jest.fn(() => jest.fn()),
};

const wrapper = ({ children }) => (
  <GroupChannelListProvider onChannelSelect={jest.fn()} onChannelCreated={jest.fn()}>
    {children}
  </GroupChannelListProvider>
);

describe('GroupChannelListProvider', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if used outside of GroupChannelListProvider', () => {
    (useGroupChannelListContext as jest.Mock).mockReturnValue(null);

    expect(() => {
      renderHook(() => useGroupChannelList(), { wrapper });
    }).toThrow(new Error('useGroupChannelList must be used within a GroupChannelListProvider'));
  });

  it('provide the correct initial state', () => {
    (useGroupChannelListContext as jest.Mock).mockReturnValue(mockStore);
    const { result } = renderHook(() => useGroupChannelList(), { wrapper });

    expect(result.current.state).toEqual(expect.objectContaining(initialState));
  });

});
