import React, {
  useRef,
  useState,
  useReducer,
} from 'react';
import { SendbirdError } from '@sendbird/chat';
import type { MessageSearchQuery } from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { ClientSentMessages } from '../../../types';

import messageSearchReducer from './dux/reducers';
import messageSearchInitialState from './dux/initialState';
import { State as MessageSearchReducerState } from './dux/initialState';

import useSetChannel from './hooks/useSetChannel';
import useGetSearchMessages from './hooks/useGetSearchedMessages';
import useScrollCallback, {
  CallbackReturn as UseScrollCallbackType,
} from './hooks/useScrollCallback';
import useSearchStringEffect from './hooks/useSearchStringEffect';

export interface MessageSearchProviderProps {
  channelUrl: string;
  children?: React.ReactNode;
  searchString?: string;
  requestString?: string;
  messageSearchQuery?: MessageSearchQuery;
  onResultLoaded?(messages?: Array<ClientSentMessages>, error?: SendbirdError): void;
  onResultClick?(message: ClientSentMessages): void;
}

interface MessageSearchProviderInterface extends MessageSearchProviderProps {
  retryCount: number;
  setRetryCount: React.Dispatch<React.SetStateAction<number>>;
  selectedMessageId: number;
  setSelectedMessageId: React.Dispatch<React.SetStateAction<number>>;
  messageSearchDispatcher: ({ type: string, payload: any }) => void;
  scrollRef: React.MutableRefObject<HTMLDivElement>;
  allMessages: MessageSearchReducerState['allMessages'];
  loading: boolean;
  isInvalid: boolean;
  currentChannel: GroupChannel;
  currentMessageSearchQuery: MessageSearchQuery;
  hasMoreResult: boolean;
  onScroll: UseScrollCallbackType;
  handleRetryToConnect: () => void;
  handleOnScroll: (e: React.BaseSyntheticEvent) => void;
}

const MessageSearchContext = React.createContext<MessageSearchProviderInterface|null>(undefined);

const MessageSearchProvider: React.FC<MessageSearchProviderProps> = (props: MessageSearchProviderProps) => {
  const {
    // message search props
    channelUrl,
    searchString,
    messageSearchQuery,
    onResultLoaded,
    onResultClick,
  } = props;

  const globalState = useSendbirdStateContext();

  // hook variables
  const [retryCount, setRetryCount] = useState(0); // this is a trigger flag for activating useGetSearchMessages
  const [selectedMessageId, setSelectedMessageId] = useState(0);
  const [messageSearchStore, messageSearchDispatcher] = useReducer(messageSearchReducer, messageSearchInitialState);
  const {
    allMessages,
    loading,
    isInvalid,
    currentChannel,
    currentMessageSearchQuery,
    hasMoreResult,
  } = messageSearchStore;

  const logger = globalState?.config?.logger;
  const sdk = globalState?.stores?.sdkStore?.sdk;
  const sdkInit = globalState?.stores?.sdkStore?.initialized;
  const scrollRef = useRef(null);
  const handleOnScroll = (e: React.BaseSyntheticEvent) => {
    const scrollElement = e.target as HTMLDivElement;
    const {
      scrollTop,
      scrollHeight,
      clientHeight,
    } = scrollElement;

    if (!hasMoreResult) {
      return;
    }
    if (scrollTop + clientHeight >= scrollHeight) {
      onScroll(() => {
        // after load more searched messages
      });
    }
  };

  useSetChannel(
    { channelUrl, sdkInit },
    { sdk, logger, messageSearchDispatcher },
  );

  const requestString = useSearchStringEffect({ searchString }, { messageSearchDispatcher });

  useGetSearchMessages(
    { currentChannel, channelUrl, requestString, messageSearchQuery, onResultLoaded, retryCount },
    { sdk, logger, messageSearchDispatcher },
  );

  const onScroll = useScrollCallback(
    { currentMessageSearchQuery, hasMoreResult, onResultLoaded },
    { logger, messageSearchDispatcher },
  );

  const handleRetryToConnect = () => {
    setRetryCount(retryCount + 1);
  };
  return (
    <MessageSearchContext.Provider value={{
      channelUrl,
      searchString,
      requestString,
      messageSearchQuery,
      onResultLoaded,
      onResultClick,
      retryCount,
      setRetryCount,
      selectedMessageId,
      setSelectedMessageId,
      messageSearchDispatcher,
      allMessages,
      loading,
      isInvalid,
      currentChannel,
      currentMessageSearchQuery,
      hasMoreResult,
      onScroll,
      scrollRef,
      handleRetryToConnect,
      handleOnScroll,
    }}>
      {props?.children}
    </MessageSearchContext.Provider>
  );
}

export type UseMessageSearchType = () => MessageSearchProviderInterface;
const useMessageSearchContext: UseMessageSearchType = () => React.useContext(MessageSearchContext);

export {
  MessageSearchProvider,
  useMessageSearchContext,
};
