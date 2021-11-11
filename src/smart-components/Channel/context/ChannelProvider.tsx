
import React, {
  useEffect,
  useState,
  useReducer,
  useRef,
  useMemo,
} from 'react';
import SendBird, { GroupChannel } from 'sendbird';

import { ReplyType, RenderUserProfileProps } from '../../../types';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { CoreMessageType } from '../../../utils';

import * as utils from './utils';

import messagesInitialState from './dux/initialState';
import messagesReducer from './dux/reducers';

import useHandleChannelEvents from './hooks/useHandleChannelEvents';
import useGetChannel from './hooks/useGetChannel';
import useInitialMessagesFetch from './hooks/useInitialMessagesFetch';
import useHandleReconnect from './hooks/useHandleReconnect';
import useScrollCallback from './hooks/useScrollCallback';
import useScrollDownCallback from './hooks/useScrollDownCallback';
import useDeleteMessageCallback from './hooks/useDeleteMessageCallback';
import useUpdateMessageCallback from './hooks/useUpdateMessageCallback';
import useResendMessageCallback from './hooks/useResendMessageCallback';
import useSendMessageCallback from './hooks/useSendMessageCallback';
import useSendFileMessageCallback from './hooks/useSendFileMessageCallback';
import useMemoizedEmojiListItems from './hooks/useMemoizedEmojiListItems';
import useToggleReactionCallback from './hooks/useToggleReactionCallback';
import useScrollToMessage from './hooks/useScrollToMessage';
import { CustomUseReducerDispatcher } from '../../../lib/SendbirdState';

export type MessageListParams = {
  prevResultSize?: number;
  nextResultSize?: number;
  isInclusive?: boolean;
  shouldReverse?: boolean;
  messageType?: string;
  customType?: string;
  senderUserIds?: Array<string>;
  includeMetaArray?: boolean;
  includeReactions?: boolean;
  includeReplies?: boolean;
  includeParentMessageText?: boolean;
  includeThreadInfo?: boolean;
}

export type ChannelQueries = {
  messageListParams?: MessageListParams;
}

export type ChannelContextProps = {
  children?: React.ReactNode;
  channelUrl: string;
  useMessageGrouping?: boolean;
  useReaction?: boolean;
  showSearchIcon?: boolean;
  highlightedMessage?: number;
  startingPoint?: number;
  onBeforeSendUserMessage?(text: string, quotedMessage?: SendBird.UserMessage | SendBird.FileMessage): SendBird.UserMessageParams;
  onBeforeSendFileMessage?(file: File, quotedMessage?: SendBird.UserMessage | SendBird.FileMessage): SendBird.FileMessageParams;
  onBeforeUpdateUserMessage?(text: string): SendBird.UserMessageParams;
  onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
  onSearchClick?(): void;
  replyType?: ReplyType;
  queries?: ChannelQueries;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  disableUserProfile?: boolean;
};

interface MessageStoreInterface {
  allMessages: CoreMessageType[];
  loading: boolean;
  initialized: boolean;
  unreadCount: number;
  unreadSince: number;
  isInvalid: boolean;
  currentGroupChannel: GroupChannel;
  hasMore: boolean;
  lastMessageTimeStamp: number;
  hasMoreToBottom: boolean;
  latestFetchedMessageTimeStamp: number;
  emojiContainer: any;
  readStatus: any;
}

interface ChannelProviderInterface extends ChannelContextProps, MessageStoreInterface {
  scrollToMessage?(createdAt: number, messageId: number): void;
  messagesDispatcher: CustomUseReducerDispatcher;
  quoteMessage: CoreMessageType;
  setQuoteMessage: React.Dispatch<React.SetStateAction<CoreMessageType>>;
  intialTimeStamp: number;
  setIntialTimeStamp: React.Dispatch<React.SetStateAction<number>>;
  animatedMessageId: number;
  highLightedMessageId: number;
  nicknamesMap: Map<string, string>;
  emojiAllMap: any;
  onScrollCallback: any;
  onScrollDownCallback: any;
  memoizedEmojiListItems: any;
  scrollRef: React.MutableRefObject<HTMLDivElement>;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
  setHighLightedMessageId: React.Dispatch<React.SetStateAction<number>>;
  messageInputRef: React.MutableRefObject<HTMLInputElement>,
  deleteMessage(message: CoreMessageType): Promise<CoreMessageType>,
  updateMessage(messageId: number, text: string): Promise<CoreMessageType>,
  resendMessage(failedMessage: CoreMessageType): Promise<CoreMessageType>,
  sendMessage(messageParams: SendBird.UserMessageParams): Promise<SendBird.UserMessage>,
  sendFileMessage(messageParams: SendBird.FileMessageParams): Promise<SendBird.FileMessage>,
}

const ChannelContext = React.createContext<ChannelProviderInterface|null>(undefined);

const ChannelProvider: React.FC<ChannelContextProps> = (props: ChannelContextProps) => {
  const {
    channelUrl,
    children,
    useMessageGrouping,
    useReaction,
    showSearchIcon,
    highlightedMessage,
    startingPoint,
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeUpdateUserMessage,
    onChatHeaderActionClick,
    onSearchClick,
    replyType,
    queries,
  } = props;

  const globalStore = useSendbirdStateContext();
  const { config } = globalStore;
  const { pubSub, logger, userId, isOnline, imageCompression } = config;
  const sdk = globalStore?.stores?.sdkStore?.sdk;
  const sdkInit = globalStore?.stores?.sdkStore?.initialized;

  const [intialTimeStamp, setIntialTimeStamp] = useState(startingPoint);
  useEffect(() => {
    setIntialTimeStamp(startingPoint);
  }, [startingPoint, channelUrl]);
  const [animatedMessageId, setAnimatedMessageId] = useState(null);
  const [highLightedMessageId, setHighLightedMessageId] = useState(highlightedMessage);
  useEffect(() => {
    setHighLightedMessageId(highlightedMessage);
  }, [highlightedMessage]);
  const userFilledMessageListQuery = queries?.messageListParams;
  const [quoteMessage, setQuoteMessage] = useState<CoreMessageType>(null);

  const [messagesStore, messagesDispatcher] = useReducer(
    messagesReducer,
    messagesInitialState,
  ) as [MessageStoreInterface, CustomUseReducerDispatcher];
  const scrollRef = useRef(null);

  const {
    allMessages,
    loading,
    initialized,
    unreadCount,
    unreadSince,
    isInvalid,
    currentGroupChannel,
    hasMore,
    lastMessageTimeStamp,
    hasMoreToBottom,
    latestFetchedMessageTimeStamp,
    emojiContainer,
    readStatus,
  } = messagesStore;

  const { isBroadcast, isSuper } = currentGroupChannel;
  const { appInfo } = sdk;
  const usingReaction = (
    appInfo?.isUsingReaction && !isBroadcast && !isSuper && useReaction
    // TODO: Make useReaction independent from appInfo.isUsingReaction
  );

  const emojiAllMap = useMemo(() => (
    usingReaction
      ? utils.getAllEmojisMapFromEmojiContainer(emojiContainer)
      : new Map()
  ), [emojiContainer]);
  const emojiAllList = useMemo(() => (
    usingReaction
      ? utils.getAllEmojisFromEmojiContainer(emojiContainer)
      : []
  ), [emojiContainer]);
  const nicknamesMap: Map<string, string> = useMemo(() => (
    usingReaction
      ? utils.getNicknamesMapFromMembers(currentGroupChannel.members)
      : new Map()
  ), [currentGroupChannel.members]);

  // Scrollup is default scroll for channel
  const onScrollCallback = useScrollCallback({
    currentGroupChannel, lastMessageTimeStamp, userFilledMessageListQuery, replyType,
  }, {
    hasMore,
    logger,
    messagesDispatcher,
    sdk,
  });

  const scrollToMessage = useScrollToMessage({
    setIntialTimeStamp,
    setAnimatedMessageId,
    allMessages,
  }, { logger });

  // onScrollDownCallback is added for navigation to different timestamps on messageSearch
  // hasMoreToBottom, onScrollDownCallback -> scroll down
  // hasMore, onScrollCallback -> scroll up(default behavior)
  const onScrollDownCallback = useScrollDownCallback({
    currentGroupChannel,
    latestFetchedMessageTimeStamp,
    userFilledMessageListQuery,
    hasMoreToBottom,
    replyType,
  }, {
    logger,
    messagesDispatcher,
    sdk,
  });

  const toggleReaction = useToggleReactionCallback({ currentGroupChannel }, { logger });

  const memoizedEmojiListItems = useMemoizedEmojiListItems({
    emojiContainer, toggleReaction,
  }, {
    useReaction: usingReaction,
    logger,
    userId,
    emojiAllList,
  });

  // to create message-datasource
  // this hook sets currentGroupChannel asynchronously
  useGetChannel(
    { channelUrl, sdkInit },
    { messagesDispatcher, sdk, logger },
  );

  // to set quote message as null
  useEffect(() => {
    setQuoteMessage(null);
  }, [channelUrl]);

  // Hook to handle ChannelEvents and send values to useReducer using messagesDispatcher
  useHandleChannelEvents(
    { currentGroupChannel, sdkInit, hasMoreToBottom },
    {
      messagesDispatcher,
      sdk,
      logger,
      scrollRef,
      setQuoteMessage,
    },
  );

  // hook that fetches messages when channel changes
  // to be clear here useGetChannel sets currentGroupChannel
  // and useInitialMessagesFetch executes when currentGroupChannel changes
  // p.s This one executes on intialTimeStamp change too
  useInitialMessagesFetch({
    currentGroupChannel,
    userFilledMessageListQuery,
    intialTimeStamp,
    replyType,
  }, {
    sdk,
    logger,
    messagesDispatcher,
  });

  // handles API calls from withSendbird
  useEffect(() => {
    const subScriber = utils.pubSubHandler(channelUrl, pubSub, messagesDispatcher);
    return () => {
      utils.pubSubHandleRemover(subScriber);
    };
  }, [channelUrl, sdkInit]);

  // handling connection breaks
  useHandleReconnect({ isOnline, replyType }, {
    logger,
    sdk,
    currentGroupChannel,
    messagesDispatcher,
    userFilledMessageListQuery,
  });

  // callbacks for Message CURD actions
  const deleteMessage = useDeleteMessageCallback({ currentGroupChannel, messagesDispatcher },
    { logger });
  const updateMessage = useUpdateMessageCallback(
    { currentGroupChannel, messagesDispatcher, onBeforeUpdateUserMessage },
    { logger, sdk, pubSub },
  );
  const resendMessage = useResendMessageCallback(
    { currentGroupChannel, messagesDispatcher },
    { logger },
  );
  const [messageInputRef, sendMessage] = useSendMessageCallback(
    { currentGroupChannel, onBeforeSendUserMessage },
    {
      sdk,
      logger,
      pubSub,
      messagesDispatcher,
    },
  );
  const [sendFileMessage] = useSendFileMessageCallback(
    { currentGroupChannel, onBeforeSendFileMessage, imageCompression },
    {
      sdk,
      logger,
      pubSub,
      messagesDispatcher,
    },
  );

  return (
    <ChannelContext.Provider value={{
      // props
      channelUrl,
      useMessageGrouping,
      useReaction,
      showSearchIcon,
      highlightedMessage,
      startingPoint,
      onBeforeSendUserMessage,
      onBeforeSendFileMessage,
      onBeforeUpdateUserMessage,
      onChatHeaderActionClick,
      onSearchClick,
      replyType,
      queries,

      // messagesStore
      allMessages,
      loading,
      initialized,
      unreadCount,
      unreadSince,
      isInvalid,
      currentGroupChannel,
      hasMore,
      lastMessageTimeStamp,
      hasMoreToBottom,
      latestFetchedMessageTimeStamp,
      emojiContainer,
      readStatus,

      // utils
      scrollToMessage,
      quoteMessage,
      setQuoteMessage,
      deleteMessage,
      updateMessage,
      resendMessage,
      messageInputRef,
      sendMessage,
      sendFileMessage,
      intialTimeStamp,
      messagesDispatcher,
      setIntialTimeStamp,
      setAnimatedMessageId,
      setHighLightedMessageId,
      animatedMessageId,
      highLightedMessageId,
      nicknamesMap,
      emojiAllMap,
      onScrollCallback,
      onScrollDownCallback,
      memoizedEmojiListItems,
      scrollRef,
    }}>
      <UserProfileProvider
        disableUserProfile={props?.disableUserProfile}
        renderUserProfile={props?.renderUserProfile}
      >
        {children}
      </UserProfileProvider>
    </ChannelContext.Provider>
  );
}

export type UseChannelType = () => ChannelProviderInterface;
const useChannel: UseChannelType = () => React.useContext(ChannelContext);

export { ChannelProvider, useChannel };
