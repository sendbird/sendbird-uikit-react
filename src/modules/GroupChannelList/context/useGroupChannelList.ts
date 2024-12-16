import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useMemo, useContext } from 'react';
import { GroupChannelListState, GroupChannelListContext } from './GroupChannelListProvider';

export const useGroupChannelList = () => {
  const store = useContext(GroupChannelListContext);
  if (!store) throw new Error('useGroupChannelList must be used within a GroupChannelListProvider');

  const state: GroupChannelListState = useSyncExternalStore(store.subscribe, store.getState);
  const actions = useMemo(() => ({
  }), [store]);

  return { state, actions };
};

export default useGroupChannelList;
