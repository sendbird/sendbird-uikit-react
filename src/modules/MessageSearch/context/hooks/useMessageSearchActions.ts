import { useCallback } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageSearchQuery } from '@sendbird/chat/message';

import { ClientSentMessages } from '../../../../types';
import { useMessageSearchStore } from '../_MessageSearchProvider';

const useMessageSearchActions = () => {
  const { state, updateState } = useMessageSearchStore();

  const setCurrentChannel = (channel: GroupChannel) => updateState({
    currentChannel: channel,
    initialized: true,
  });

  const setChannelInvalid = () => updateState({
    currentChannel: null,
    initialized: false,
  });

  const getSearchedMessages = useCallback((messages: ClientSentMessages[], createdQuery: MessageSearchQuery) => {
    if (createdQuery && createdQuery.channelUrl === state.currentMessageSearchQuery?.channelUrl
        && (createdQuery as any).key === (state.currentMessageSearchQuery as any).key) {
      updateState({
        loading: false,
        isInvalid: false,
        allMessages: messages,
        hasMoreResult: state.currentMessageSearchQuery.hasNext,
      });
    }
  }, [state.currentMessageSearchQuery, updateState]);

  const setQueryInvalid = () => updateState({ isInvalid: true });

  const startMessageSearch = () => updateState({
    isInvalid: false,
    loading: false,
  });

  const startGettingSearchedMessages = (query: MessageSearchQuery) => updateState({
    loading: true,
    currentMessageSearchQuery: query,
  });

  const getNextSearchedMessages = useCallback((messages: ClientSentMessages[]) => {
    updateState({
      allMessages: [...state.allMessages, ...messages],
      hasMoreResult: state.currentMessageSearchQuery?.hasNext || false,
    });
  }, [state.allMessages?.map(m => m.messageId).join(''), state.currentMessageSearchQuery, updateState]);

  const resetSearchString = useCallback(() => updateState({ allMessages: [] }), [updateState]);

  const setSelectedMessageId = (messageId: number) => updateState({ selectedMessageId: messageId });

  const handleRetryToConnect = () => updateState({ retryCount: state.retryCount + 1 });

  return {
    setCurrentChannel,
    setChannelInvalid,
    getSearchedMessages,
    setQueryInvalid,
    setSelectedMessageId,
    startMessageSearch,
    startGettingSearchedMessages,
    getNextSearchedMessages,
    resetSearchString,
    handleRetryToConnect,
  };
};

export default useMessageSearchActions;
