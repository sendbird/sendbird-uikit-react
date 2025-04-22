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
  }, []);

  const setChannelInvalid = useCallback(() => {
    store.setState(state => ({ ...state, currentChannel: null, initialized: false }));
  }, []);

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
  }, []);

  const setQueryInvalid = useCallback(() => {
    store.setState(state => ({ ...state, isInvalid: true }));
  }, []);

  const startMessageSearch = useCallback(() => {
    store.setState(state => ({ ...state, isInvalid: false, loading: false }));
  }, []);

  const startGettingSearchedMessages = useCallback((query: MessageSearchQuery) => {
    store.setState(state => ({ ...state, loading: true, currentMessageSearchQuery: query }));
  }, []);

  const getNextSearchedMessages = useCallback((messages: ClientSentMessages[]) => {
    store.setState(state => ({
      ...state,
      allMessages: [...state.allMessages, ...messages],
      hasMoreResult: state.currentMessageSearchQuery?.hasNext || false,
    }));
  }, []);

  const resetSearchString = useCallback(() => {
    store.setState(state => ({ ...state, allMessages: [] }));
  }, []);

  const setSelectedMessageId = (messageId: number) => useCallback(() => {
    store.setState(state => ({ ...state, selectedMessageId: messageId }));
  }, []);

  const handleRetryToConnect = useCallback(() => {
    store.setState(state => ({ ...state, retryCount: state.retryCount + 1 }));
  }, []);

  // Looks exactly same as handleRetryToConnect but keep just for backward compatibility
  const setRetryCount = useCallback(() => {
    store.setState(state => ({ ...state, retryCount: state.retryCount + 1 }));
  }, []);

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
