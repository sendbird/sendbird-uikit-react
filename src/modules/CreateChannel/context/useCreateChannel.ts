import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useContext, useMemo } from 'react';
import { CreateChannelContext, CreateChannelState } from './CreateChannelProvider';
import { CHANNEL_TYPE } from '../types';
import { getCreateGroupChannel } from '../../../lib/selectors';
import { useSendbirdStateContext } from '../../../index';

const useCreateChannel = () => {
  const store = useContext(CreateChannelContext);
  const sendbirdStore = useSendbirdStateContext();
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

    createChannel: getCreateGroupChannel(sendbirdStore),
  }), [store]);

  return { state, actions };
};

export default useCreateChannel;
