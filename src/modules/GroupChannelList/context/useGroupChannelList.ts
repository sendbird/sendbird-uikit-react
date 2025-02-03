import { useMemo, useContext, useCallback, useSyncExternalStore } from 'react';
import { GroupChannelListState, GroupChannelListContext } from './GroupChannelListProvider';

export const useGroupChannelList = () => {
  const store = useContext(GroupChannelListContext);
  if (!store) throw new Error('useGroupChannelList must be used within a GroupChannelListProvider');

  const setGroupChannels = useCallback((channels) => {
    store.setState(state => ({
      ...state,
      groupChannels: channels,
    }), true);
  }, []);

  const state: GroupChannelListState = useSyncExternalStore(store.subscribe, store.getState);
  const actions = useMemo(() => ({
    setGroupChannels,
  }), [setGroupChannels]);

  return { state, actions };
};

export default useGroupChannelList;
