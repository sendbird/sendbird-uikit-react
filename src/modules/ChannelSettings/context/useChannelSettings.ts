import { useMemo, useContext } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

import { ChannelSettingsContext } from './ChannelSettingsProvider';
import { ChannelSettingsState } from './types';

export const useChannelSettings = () => {
  const store = useContext(ChannelSettingsContext);
  if (!store) throw new Error('useChannelSettings must be used within a ChannelSettingsProvider');

  const state: ChannelSettingsState = useSyncExternalStore(store.subscribe, store.getState);
  const actions = useMemo(() => ({
    setChannel: (channel: GroupChannel) => store.setState(state => ({
      ...state,
      channel,
    })),

    setLoading: (loading: boolean) => store.setState((state): ChannelSettingsState => ({
      ...state,
      loading,
    })),

    setInvalid: (invalid: boolean) => store.setState((state): ChannelSettingsState => ({
      ...state,
      invalidChannel: invalid,
    })),
  }), [store]);

  return { state, actions };
};

export default useChannelSettings;
