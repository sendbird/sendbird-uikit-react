
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
import * as messageActionTypes from './dux/actionTypes';

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
  // https://sendbird.github.io/core-sdk-javascript/module-model_params_messageListParams-MessageListParams.html
  replyType?: string,
  messageType?: string,
  prevResultSize?: number,
  nextResultSize?: number,
  reverse?: boolean,
  isInclusive?: boolean,
  includeMetaArray?: boolean,
  includeReactions?: boolean,
  includeThreadInfo?: boolean,
  includePollDetails?: boolean,
  includeParentMessageInfo?: boolean,
  showSubchannelMessagesOnly?: boolean,
  customTypes?: Array<string>,
  senderUserIds?: Array<string>,
};

export type ChannelQueries = {
  messageListParams?: MessageListParams;
};

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
  hasMorePrev: boolean;
  oldestMessageTimeStamp: number;
  hasMoreNext: boolean;
  latestMessageTimeStamp: number;
  emojiContainer: any;
  readStatus: any;
}

interface ChannelProviderInterface extends ChannelContextProps, MessageStoreInterface {
  scrollToMessage?(createdAt: number, messageId: number): void;
  messageActionTypes: Record<string ,string>;
  messagesDispatcher: CustomUseReducerDispatcher;
  quoteMessage: CoreMessageType;
  setQuoteMessage: React.Dispatch<React.SetStateAction<CoreMessageType>>;
  initialTimeStamp: number;
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
  // TODO: Good to change interface to using params / This part need refactoring
  sendMessage(quoteMessage: CoreMessageType): Promise<SendBird.UserMessage>,
  sendFileMessage(file: File, quoteMessage: CoreMessageType): Promise<SendBird.FileMessage>,
  // sendMessage(messageParams: SendBird.UserMessageParams): Promise<SendBird.UserMessage>,
  // sendFileMessage(messageParams: SendBird.FileMessageParams): Promise<SendBird.FileMessage>,
  toggleReaction(message: SendBird.UserMessage | SendBird.FileMessage, emojiKey: string, isReacted: boolean): void,
}

const ChannelContext = React.createContext<ChannelProviderInterface | null>(undefined);

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

  const [initialTimeStamp, setIntialTimeStamp] = useState(startingPoint);
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
    hasMorePrev,
    oldestMessageTimeStamp,
    hasMoreNext,
    latestMessageTimeStamp,
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
    currentGroupChannel, oldestMessageTimeStamp, userFilledMessageListQuery, replyType,
  }, {
    hasMorePrev,
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
  // hasMorePrev, onScrollCallback -> scroll up(default behavior)
  // hasMoreNext, onScrollDownCallback -> scroll down
  const onScrollDownCallback = useScrollDownCallback({
    currentGroupChannel,
    latestMessageTimeStamp,
    userFilledMessageListQuery,
    hasMoreNext,
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
    { currentGroupChannel, sdkInit, hasMoreNext },
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
  // p.s This one executes on initialTimeStamp change too
  useInitialMessagesFetch({
    currentGroupChannel,
    userFilledMessageListQuery,
    initialTimeStamp,
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
      useReaction: usingReaction,
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
      hasMorePrev,
      hasMoreNext,
      oldestMessageTimeStamp,
      latestMessageTimeStamp,
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
      initialTimeStamp,
      messageActionTypes,
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
      toggleReaction,
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
