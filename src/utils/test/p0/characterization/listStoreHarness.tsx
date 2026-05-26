/**
 * Channel-list-side characterization harness — parallel to storeHarness.tsx
 * but for `GroupChannelListContext` from
 * `src/modules/GroupChannelList/context/GroupChannelListProvider.tsx`.
 *
 * Provides a real `createStore` wrapping the `GroupChannelListState` shape
 * (typingChannelUrls, groupChannels, selectedChannelUrl, etc.) so we can
 * characterize the channel-list render boundary independently of the main
 * GroupChannel store.
 */
import * as React from 'react';
import { GroupChannelListContext } from '../../../../modules/GroupChannelList/context/GroupChannelListProvider';
import { createStore, type Store } from '../../../storeManager';

export type CharacterizationListState = {
  className: string;
  selectedChannelUrl: string;
  disableAutoSelect: boolean;
  allowProfileEdit: boolean;
  isTypingIndicatorEnabled: boolean;
  isMessageReceiptStatusEnabled: boolean;
  onChannelSelect: () => void;
  onChannelCreated: () => void;
  onThemeChange: () => void;
  onCreateChannelClick: () => void;
  onBeforeCreateChannel: null;
  onUserProfileUpdated: () => void;
  typingChannelUrls: string[];
  refreshing: boolean;
  initialized: boolean;
  groupChannels: any[];
  refresh: jest.Mock | null;
  loadMore: jest.Mock | null;
  scrollRef: { current: HTMLDivElement | null };
  [k: string]: unknown;
};

export type CharacterizationListStore = Store<CharacterizationListState> & {
  notifyCount: () => number;
};

function defaultListState(): CharacterizationListState {
  return {
    className: '',
    selectedChannelUrl: '',
    disableAutoSelect: false,
    allowProfileEdit: false,
    isTypingIndicatorEnabled: true,
    isMessageReceiptStatusEnabled: false,
    onChannelSelect: () => {},
    onChannelCreated: () => {},
    onThemeChange: () => {},
    onCreateChannelClick: () => {},
    onBeforeCreateChannel: null,
    onUserProfileUpdated: () => {},
    typingChannelUrls: [],
    refreshing: false,
    initialized: true,
    groupChannels: [],
    refresh: jest.fn(),
    loadMore: jest.fn(),
    scrollRef: { current: null },
  };
}

export function createCharacterizationListStore(
  overrides: Partial<CharacterizationListState> = {},
): CharacterizationListStore {
  const initial = { ...defaultListState(), ...overrides };
  const store = createStore<CharacterizationListState>(initial);
  let notifyCount = 0;
  store.subscribe(() => { notifyCount += 1; });
  return Object.assign(store, { notifyCount: () => notifyCount }) as CharacterizationListStore;
}

export function createListWrapper(store: CharacterizationListStore): React.FC<{ children: React.ReactNode }> {
  return ({ children }) => (
    <GroupChannelListContext.Provider value={store as any}>{children}</GroupChannelListContext.Provider>
  );
}

export function mockListChannel(overrides: Partial<any> = {}) {
  return {
    url: 'list-channel-1',
    name: 'Channel One',
    members: [],
    lastMessage: null,
    unreadMessageCount: 0,
    serialize: function () { return JSON.stringify({ url: this.url }); },
    ...overrides,
  };
}
