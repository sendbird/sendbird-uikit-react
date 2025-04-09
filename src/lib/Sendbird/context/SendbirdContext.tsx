import React from 'react';
import { createStore } from '../../../utils/storeManager';
import { initialState } from './initialState';
import { SendbirdState } from '../types';
import { useStore } from '../../../hooks/useStore';
import { TwoDepthPartial } from '../../../utils/typeHelpers/partialDeep';

/**
 * SendbirdContext
 */
export const SendbirdContext = React.createContext<ReturnType<typeof createStore<SendbirdState>> | null>(null);

/**
 * Create store for Sendbird context
 */
export const createSendbirdContextStore = (props?: TwoDepthPartial<SendbirdState>) => createStore({
  config: {
    ...initialState.config,
    ...props?.config,
  },
  stores: {
    ...initialState.stores,
    ...props?.stores,
  },
  eventHandlers: {
    ...initialState.eventHandlers,
    ...props?.eventHandlers,
  },
  emojiManager: initialState.emojiManager,
  utils: {
    ...initialState.utils,
    ...props?.utils,
  },
});

/**
 * A specialized hook for Sendbird state management
 * @returns {ReturnType<typeof createStore<SendbirdState>>}
 */
export const useSendbirdStore = () => {
  return useStore(SendbirdContext, state => state, initialState);
};
