import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useMemo } from 'react';
import { CreateChannelState, useCreateChannelContext } from './CreateChannelProvider';
import { CHANNEL_TYPE } from '../types';

export const useCreateChannel = () => {
  const store = useCreateChannelContext();
  if (!store) throw new Error('useCreateChannel must be used within a CreateChannelProvider');

  const state: CreateChannelState = useSyncExternalStore(store.subscribe, store.getState);
  const actions = useMemo(() => ({
    setStep: (step: number) => store.setState(state => ({
      ...state,
      step,
    })),
    setType: (type: CHANNEL_TYPE) => store.setState(state => ({
      ...state,
      type,
    })),
  }), [store]);

  return { state, actions };
};
