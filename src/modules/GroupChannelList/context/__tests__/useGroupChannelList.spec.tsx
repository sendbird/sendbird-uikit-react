import { GroupChannelListProvider } from '../GroupChannelListProvider';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { useGroupChannelList } from '../useGroupChannelList';

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
      enableTypingIndicator: true,
    },
  },
};
jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({ state: mockState })),
  useSendbird: jest.fn(() => ({ state: mockState })),
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

const initialState = {
  className: '',
  selectedChannelUrl: '',
  disableAutoSelect: false,
  allowProfileEdit: true,
  isTypingIndicatorEnabled: true,
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

const wrapper = ({ children }) => (
  <GroupChannelListProvider>
    {children}
  </GroupChannelListProvider>
);

describe('GroupChannelListProvider', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if used outside of GroupChannelListProvider', () => {
    expect(() => {
      renderHook(() => useGroupChannelList());
    }).toThrow(new Error('useGroupChannelList must be used within a GroupChannelListProvider'));
  });

  it('provide the correct initial state', () => {
    const { result } = renderHook(() => useGroupChannelList(), { wrapper });

    expect(result.current.state).toEqual(expect.objectContaining(initialState));
  });

});
