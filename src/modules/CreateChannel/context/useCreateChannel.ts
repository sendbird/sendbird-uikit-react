import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useCallback, useContext, useMemo } from 'react';
import { CreateChannelContext, CreateChannelState } from './CreateChannelProvider';
import { CHANNEL_TYPE } from '../types';
import { getCreateGroupChannel } from '../../../lib/selectors';
import { useSendbirdStateContext } from '../../../index';

const useCreateChannel = () => {
  const store = useContext(CreateChannelContext);
  const sendbirdStore = useSendbirdStateContext();
  if (!store) throw new Error('useCreateChannel must be used within a CreateChannelProvider');

  const setPageStep = useCallback((pageStep: number) => {
    store.setState(state => ({ ...state, pageStep }));
  }, []);

  const setType = useCallback((type: CHANNEL_TYPE) => {
    store.setState(state => ({ ...state, type }));
  }, []);

  const createChannel = useCallback(() => {
    return getCreateGroupChannel(sendbirdStore);
  }, [sendbirdStore]);

  const state: CreateChannelState = useSyncExternalStore(store.subscribe, store.getState);
  const actions = useMemo(() => ({
    setPageStep,
    setType,
    createChannel,
  }), [
    setPageStep,
    setType,
    createChannel,
  ]);

  return { state, actions };
};

export default useCreateChannel;
