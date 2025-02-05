import React from 'react';
import { createStore } from '../../../utils/storeManager';
import { initialState } from './initialState';
import { SendbirdState } from '../types';
import { useStore } from '../../../hooks/useStore';

/**
 * SendbirdContext
 */
export const SendbirdContext = React.createContext<ReturnType<typeof createStore<SendbirdState>> | null>(null);

/**
 * Create store for Sendbird context
 */
export const createSendbirdContextStore = () => createStore(initialState);

/**
 * A specialized hook for Ssendbird state management
 * @returns {ReturnType<typeof createStore<SendbirdState>>}
 */
export const useSendbirdStore = () => {
  return useStore(SendbirdContext, state => state, initialState);
};
