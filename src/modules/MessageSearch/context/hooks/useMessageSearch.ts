import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useCallback, useContext, useMemo } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageSearchQuery } from '@sendbird/chat/message';

import { ClientSentMessages } from '../../../../types';
import { MessageSearchContext, type MessageSearchState } from '../MessageSearchProvider';

const useMessageSearch = () => {
  const store = useContext(MessageSearchContext);
  if (!store) throw new Error('useMessageSearch must be used within a MessageSearchProvider');

  const state: MessageSearchState = useSyncExternalStore(store.subscribe, store.getState);

  const setCurrentChannel = useCallback((channel: GroupChannel) => {
    store.setState(state => ({ ...state, currentChannel: channel, initialized: true }));
  }, [store]);

  const setChannelInvalid = useCallback(() => {
    store.setState(state => ({ ...state, currentChannel: null, initialized: false }));
  }, [store]);

  const getSearchedMessages = useCallback((messages: ClientSentMessages[], createdQuery: MessageSearchQuery) => {
    store.setState(state => {
      if (createdQuery && createdQuery.channelUrl === state.currentMessageSearchQuery?.channelUrl
        && (createdQuery as any).key === (state.currentMessageSearchQuery as any).key) {
        return {
          ...state,
          loading: false,
          isInvalid: false,
          allMessages: messages,
          hasMoreResult: state.currentMessageSearchQuery.hasNext,
        };
      }
      return state;
    });
  }, [store]);

  const setQueryInvalid = useCallback(() => {
    store.setState(state => ({ ...state, isInvalid: true }));
  }, [store]);

  const startMessageSearch = useCallback(() => {
    store.setState(state => ({ ...state, isInvalid: false, loading: false }));
  }, [store]);

  const startGettingSearchedMessages = useCallback((query: MessageSearchQuery) => {
    store.setState(state => ({ ...state, loading: true, currentMessageSearchQuery: query }));
  }, [store]);

  const getNextSearchedMessages = useCallback((messages: ClientSentMessages[]) => {
    store.setState(state => ({
      ...state,
      allMessages: [...state.allMessages, ...messages],
      hasMoreResult: state.currentMessageSearchQuery?.hasNext || false,
    }));
  }, [store]);

  const resetSearchString = useCallback(() => {
    store.setState(state => ({ ...state, allMessages: [] }));
  }, [store]);

  const setSelectedMessageId = useCallback((messageId: number) => {
    store.setState(state => ({ ...state, selectedMessageId: messageId }));
  }, [store]);

  const handleRetryToConnect = useCallback(() => {
    store.setState(state => ({ ...state, retryCount: state.retryCount + 1 }));
  }, [store]);

  // Looks exactly same as handleRetryToConnect but keep just for backward compatibility
  const setRetryCount = useCallback(() => {
    store.setState(state => ({ ...state, retryCount: state.retryCount + 1 }));
  }, [store]);

  const actions = useMemo(() => ({
    setCurrentChannel,
    setChannelInvalid,
    getSearchedMessages,
    setQueryInvalid,
    startMessageSearch,
    startGettingSearchedMessages,
    getNextSearchedMessages,
    resetSearchString,
    setSelectedMessageId,
    handleRetryToConnect,
    setRetryCount,
  }), [
    setCurrentChannel,
    setChannelInvalid,
    getSearchedMessages,
    setQueryInvalid,
    startMessageSearch,
    startGettingSearchedMessages,
    getNextSearchedMessages,
    resetSearchString,
    setSelectedMessageId,
    handleRetryToConnect,
    setRetryCount,
  ]);

  return { state, actions };
};

export default useMessageSearch;
