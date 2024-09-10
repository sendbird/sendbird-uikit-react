import React, { createContext, useRef, useContext, useCallback, useEffect } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageSearchQuery } from '@sendbird/chat/message';
import { ClientSentMessages } from '../../../types';
import { SendbirdError } from '@sendbird/chat';
import type { MessageSearchQueryParams } from '@sendbird/chat/lib/__definition';

import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';

import useSetChannel from './hooks/useSetChannel';
import useGetSearchMessages from './hooks/useGetSearchedMessages';
import useScrollCallback from './hooks/useScrollCallback';
import useSearchStringEffect from './hooks/useSearchStringEffect';
import { CoreMessageType } from '../../../utils';
import { useStore } from '../../../hooks/useStore';
import { createStore } from '../../../utils/storeManager';

export interface MessageSearchProviderProps {
  channelUrl: string;
  children?: React.ReactElement;
  searchString?: string;
  messageSearchQuery?: MessageSearchQueryParams;
  onResultLoaded?(messages?: Array<CoreMessageType> | null, error?: SendbirdError | null): void;
  onResultClick?(message: ClientSentMessages): void;
}

interface MessageSearchState extends MessageSearchProviderProps {
  channelUrl: string;
  allMessages: ClientSentMessages[];
  loading: boolean;
  isInvalid: boolean;
  initialized: boolean;
  currentChannel: GroupChannel | null;
  currentMessageSearchQuery: MessageSearchQuery | null;
  hasMoreResult: boolean;
  retryCount: number;
  selectedMessageId: number | null;
  requestString: string;
  onScroll?: ReturnType<typeof useScrollCallback>;
  handleOnScroll?: (e: React.BaseSyntheticEvent) => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const initialState: MessageSearchState = {
  channelUrl: '',
  allMessages: [],
  loading: false,
  isInvalid: false,
  initialized: false,
  currentChannel: null,
  currentMessageSearchQuery: null,
  messageSearchQuery: null,
  hasMoreResult: false,
  retryCount: 0,
  selectedMessageId: null,
  searchString: '',
  requestString: '',
};

const MessageSearchContext = createContext<ReturnType<typeof createStore<MessageSearchState>> | null>(null);

const MessageSearchManager: React.FC<MessageSearchProviderProps> = ({
  channelUrl,
  searchString,
  messageSearchQuery,
  onResultLoaded,
  onResultClick,
}) => {
  const { config, stores } = useSendbirdStateContext();
  const sdk = stores?.sdkStore?.sdk;
  const sdkInit = stores?.sdkStore?.initialized;
  const { logger } = config;
  const { state, updateState } = useMessageSearchStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useSetChannel(
    { channelUrl, sdkInit },
    { sdk, logger },
  );

  const requestString = useSearchStringEffect(
    { searchString: searchString ?? '' },
  );

  useGetSearchMessages(
    {
      currentChannel: state.currentChannel,
      channelUrl,
      requestString,
      messageSearchQuery,
      onResultLoaded,
    },
    { sdk, logger },
  );

  const onScroll = useScrollCallback(
    { onResultLoaded },
    { logger },
  );

  const handleOnScroll = useCallback((e: React.BaseSyntheticEvent) => {
    const scrollElement = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = scrollElement;

    if (!state.hasMoreResult) {
      return;
    }
    if (scrollTop + clientHeight >= scrollHeight) {
      onScroll(() => {
        // after load more searched messages
      });
    }
  }, [state.hasMoreResult, onScroll]);

  useEffect(() => {
    updateState({
      channelUrl,
      searchString,
      messageSearchQuery,
      onResultClick,
      onScroll,
      handleOnScroll,
      scrollRef,
      requestString,
    });
  }, [channelUrl, searchString, messageSearchQuery, onResultClick, updateState, requestString]);

  return null;
};

const createMessageSearchStore = () => createStore(initialState);
const MessageSearchProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const storeRef = useRef(createMessageSearchStore());

  return (
    <MessageSearchContext.Provider value={storeRef.current}>
      {children}
    </MessageSearchContext.Provider>
  );
};

const useMessageSearchContext = () => {
  const context = useContext(MessageSearchContext);
  if (!context) throw new Error('MessageSearchContext not found. Use within the MessageSearch module.');
  return context;
};

export {
  MessageSearchProvider,
  useMessageSearchContext,
  MessageSearchManager,
};

/**
 * A specialized hook for MessageSearch state management
 * @returns {ReturnType<typeof createStore<MessageSearchState>>}
 */
export const useMessageSearchStore = () => {
  return useStore(MessageSearchContext, state => state, initialState);
};
