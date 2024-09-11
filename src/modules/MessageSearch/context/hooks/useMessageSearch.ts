import { useContext, useMemo, useSyncExternalStore } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageSearchQuery } from '@sendbird/chat/message';

import { ClientSentMessages } from '../../../../types';
import { MessageSearchContext } from '../_MessageSearchProvider';

const useMessageSearch = () => {
  const store = useContext(MessageSearchContext);
  if (!store) throw new Error('useMessageSearch must be used within a MessageSearchProvider');

  const state = useSyncExternalStore(store.subscribe, store.getState);
  const actions = useMemo(() => ({
    setCurrentChannel: (channel: GroupChannel) => store.setState(state => ({
      ...state,
      currentChannel: channel,
      initialized: true,
    })),

    setChannelInvalid: () => store.setState(state => ({
      ...state,
      currentChannel: null,
      initialized: false,
    })),

    getSearchedMessages: (messages: ClientSentMessages[], createdQuery: MessageSearchQuery) => {
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
    },

    setQueryInvalid: () => store.setState(state => ({ ...state, isInvalid: true })),

    startMessageSearch: () => store.setState(state => ({
      ...state,
      isInvalid: false,
      loading: false,
    })),

    startGettingSearchedMessages: (query: MessageSearchQuery) => store.setState(state => ({
      ...state,
      loading: true,
      currentMessageSearchQuery: query,
    })),

    getNextSearchedMessages: (messages: ClientSentMessages[]) => store.setState(state => ({
      ...state,
      allMessages: [...state.allMessages, ...messages],
      hasMoreResult: state.currentMessageSearchQuery?.hasNext || false,
    })),

    resetSearchString: () => store.setState(state => ({ ...state, allMessages: [] })),

    setSelectedMessageId: (messageId: number) => store.setState(state => ({
      ...state,
      selectedMessageId: messageId,
    })),

    handleRetryToConnect: () => store.setState(state => ({
      ...state,
      retryCount: state.retryCount + 1,
    })),
  }), [store]);

  return { state, actions };
};

export default useMessageSearch;
