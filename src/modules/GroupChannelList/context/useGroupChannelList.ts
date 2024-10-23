import { GroupChannelListState, useGroupChannelListContext } from './GroupChannelListProvider';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useMemo } from 'react';

export const useGroupChannelList = () => {
  const store = useGroupChannelListContext();
  if (!store) throw new Error('useGroupChannelList must be used within a GroupChannelListProvider');

  const state: GroupChannelListState = useSyncExternalStore(store.subscribe, store.getState);
  const actions = useMemo(() => ({
  }), [store]);

  return { state, actions };
};
