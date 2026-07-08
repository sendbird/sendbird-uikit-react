import { GroupChannelListProvider } from '../GroupChannelListProvider';
import type { GroupChannelListProviderProps } from '../GroupChannelListProvider';
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
vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
  useSendbird: vi.fn(() => ({ state: mockState })),
}));

vi.mock('@sendbird/uikit-tools', () => ({
  useGroupChannelList: vi.fn(() => ({
    refreshing: false,
    initialized: false,
    groupChannels: [],
    refresh: null,
    loadMore: null,
  })),
  useGroupChannelHandler: vi.fn(() => {}),
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

const LooseGroupChannelListProvider = GroupChannelListProvider as React.ComponentType<Partial<GroupChannelListProviderProps>>;

const wrapper = ({ children }) => (
  <LooseGroupChannelListProvider>
    {children}
  </LooseGroupChannelListProvider>
);

describe('GroupChannelListProvider', () => {

  beforeEach(() => {
    vi.clearAllMocks();
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
