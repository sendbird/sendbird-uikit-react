import React, {
  useEffect,
  useState,
  useReducer,
  useRef,
  useMemo,
} from 'react';

import type { GroupChannel, SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import type {
  BaseMessage,
  FileMessage,
  FileMessageCreateParams,
  UserMessage,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';
import type { SendbirdError, User } from '@sendbird/chat';

import { ReplyType, RenderUserProfileProps, Nullable } from '../../../types';
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
import useToggleReactionCallback from './hooks/useToggleReactionCallback';
import useScrollToMessage from './hooks/useScrollToMessage';
import { CustomUseReducerDispatcher } from '../../../lib/SendbirdState';
import useSendVoiceMessageCallback from './hooks/useSendVoiceMessageCallback';

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
  includeParentMessageInfo?: boolean,
  showSubchannelMessagesOnly?: boolean,
  customTypes?: Array<string>,
  senderUserIds?: Array<string>,
};

export type ChannelQueries = {
  messageListParams?: MessageListParams;
};

export enum ThreadReplySelectType {
  PARENT = 'PARENT',
  THREAD = 'THREAD',
}

export type ChannelContextProps = {
  children?: React.ReactElement;
  channelUrl: string;
  isReactionEnabled?: boolean;
  isMessageGroupingEnabled?: boolean;
  showSearchIcon?: boolean;
  animatedMessage?: number;
  highlightedMessage?: number;
  startingPoint?: number;
  onBeforeSendUserMessage?(text: string, quotedMessage?: UserMessage | FileMessage): UserMessageCreateParams;
  onBeforeSendFileMessage?(file: File, quotedMessage?: UserMessage | FileMessage): FileMessageCreateParams;
  onBeforeUpdateUserMessage?(text: string): UserMessageUpdateParams;
  onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
  onBeforeSendVoiceMessage?: (file: File, quotedMessage?: UserMessage | FileMessage) => FileMessageCreateParams;
  onSearchClick?(): void;
  onBackClick?(): void;
  replyType?: ReplyType;
  threadReplySelectType?: ThreadReplySelectType;
  queries?: ChannelQueries;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  filterMessageList?(messages: BaseMessage): boolean;
  disableUserProfile?: boolean;
  disableMarkAsRead?: boolean;
  onReplyInThread?: (props: { message: UserMessage | FileMessage }) => void;
  onQuoteMessageClick?: (props: { message: UserMessage | FileMessage }) => void;
  onMessageAnimated?: () => void;
  onMessageHighlighted?: () => void;
};

interface MessageStoreInterface {
  allMessages: CoreMessageType[];
  loading: boolean;
  initialized: boolean;
  unreadSince: string;
  isInvalid: boolean;
  currentGroupChannel: Nullable<GroupChannel>;
  hasMorePrev: boolean;
  oldestMessageTimeStamp: number;
  hasMoreNext: boolean;
  latestMessageTimeStamp: number;
  emojiContainer: any;
  readStatus: any;
}

interface SendMessageParams {
  message: string;
  quoteMessage?: UserMessage | FileMessage;
  // mentionedUserIds?: Array<string>;
  mentionedUsers?: Array<User>;
  mentionTemplate?: string;
}

interface UpdateMessageProps {
  messageId: string | number;
  message: string;
  mentionedUsers?: Array<User>;
  mentionTemplate?: string;
}

interface ChannelProviderInterface extends ChannelContextProps, MessageStoreInterface {
  scrollToMessage?(createdAt: number, messageId: number): void;
  messageActionTypes: Record<string, string>;
  messagesDispatcher: CustomUseReducerDispatcher;
  quoteMessage: UserMessage | FileMessage;
  setQuoteMessage: React.Dispatch<React.SetStateAction<UserMessage | FileMessage>>;
  initialTimeStamp: number;
  setInitialTimeStamp: React.Dispatch<React.SetStateAction<number>>;
  animatedMessageId: number;
  highLightedMessageId: number;
  nicknamesMap: Map<string, string>;
  emojiAllMap: any;
  onScrollCallback: any;
  onScrollDownCallback: any;
  scrollRef: React.MutableRefObject<HTMLDivElement>;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
  setHighLightedMessageId: React.Dispatch<React.SetStateAction<number>>;
  messageInputRef: React.MutableRefObject<HTMLInputElement>,
  deleteMessage(message: CoreMessageType): Promise<CoreMessageType>,
  updateMessage(props: UpdateMessageProps, callback?: (err: SendbirdError, message: UserMessage) => void): Promise<CoreMessageType>,
  resendMessage(failedMessage: UserMessage | FileMessage): Promise<UserMessage | FileMessage>,
  // TODO: Good to change interface to using params / This part need refactoring
  sendMessage(props: SendMessageParams): Promise<UserMessage>,
  sendFileMessage(file: File, quoteMessage: UserMessage | FileMessage): Promise<FileMessage>,
  sendVoiceMessage: (file: File, duration: number, quoteMessage?: UserMessage | FileMessage) => void,
  // sendMessage(messageParams: SendBird.UserMessageParams): Promise<SendBird.UserMessage>,
  // sendFileMessage(messageParams: SendBird.FileMessageParams): Promise<SendBird.FileMessage>,
  toggleReaction(message: UserMessage | FileMessage, emojiKey: string, isReacted: boolean): void,
  renderUserMentionItem?: (props: { user: User }) => JSX.Element;
}

const ChannelContext = React.createContext<ChannelProviderInterface | null>(undefined);

const ChannelProvider: React.FC<ChannelContextProps> = (props: ChannelContextProps) => {
  const {
    channelUrl,
    children,
    isReactionEnabled,
    isMessageGroupingEnabled = true,
    showSearchIcon,
    animatedMessage,
    highlightedMessage,
    startingPoint,
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeUpdateUserMessage,
    onBeforeSendVoiceMessage,
    onChatHeaderActionClick,
    onSearchClick,
    onBackClick,
    replyType,
    threadReplySelectType = ThreadReplySelectType.THREAD,
    queries,
    filterMessageList,
    disableMarkAsRead = false,
    onReplyInThread,
    onQuoteMessageClick,
    onMessageAnimated,
    onMessageHighlighted,
  } = props;

  const globalStore = useSendbirdStateContext();
  const { config } = globalStore;
  const {
    pubSub,
    logger,
    userId,
    isOnline,
    imageCompression,
    isMentionEnabled,
    isVoiceMessageEnabled,
    onUserProfileMessage,
    markAsReadScheduler,
  } = config;
  const sdk = globalStore?.stores?.sdkStore?.sdk as SendbirdGroupChat;
  const sdkInit = globalStore?.stores?.sdkStore?.initialized;

  const [initialTimeStamp, setInitialTimeStamp] = useState(startingPoint);
  useEffect(() => {
    setInitialTimeStamp(startingPoint);
  }, [startingPoint, channelUrl]);
  const [animatedMessageId, setAnimatedMessageId] = useState(0);
  const [highLightedMessageId, setHighLightedMessageId] = useState(highlightedMessage);
  useEffect(() => {
    setHighLightedMessageId(highlightedMessage);
  }, [highlightedMessage]);
  const userFilledMessageListQuery = queries?.messageListParams;
  const [quoteMessage, setQuoteMessage] = useState<UserMessage | FileMessage>(null);

  const [messagesStore, messagesDispatcher] = useReducer(
    messagesReducer,
    messagesInitialState,
  ) as [MessageStoreInterface, CustomUseReducerDispatcher];
  const scrollRef = useRef(null);

  const {
    allMessages,
    loading,
    initialized,
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

  const isSuper = currentGroupChannel?.isSuper || false;
  const isBroadcast = currentGroupChannel?.isBroadcast || false;
  const { appInfo } = sdk;
  const usingReaction = appInfo?.useReaction && !isBroadcast && !isSuper && (config?.isReactionEnabled || isReactionEnabled);

  const emojiAllMap = useMemo(() => (
    usingReaction
      ? utils.getAllEmojisMapFromEmojiContainer(emojiContainer)
      : new Map()
  ), [emojiContainer]);
  const nicknamesMap: Map<string, string> = useMemo(() => (
    (usingReaction && currentGroupChannel)
      ? utils.getNicknamesMapFromMembers(currentGroupChannel?.members)
      : new Map()
  ), [currentGroupChannel?.members]);

  // Animate message
  useEffect(() => {
    if (animatedMessage) {
      setAnimatedMessageId(animatedMessage);
    }
  }, [animatedMessage]);

  // Scrollup is default scroll for channel
  const onScrollCallback = useScrollCallback({
    currentGroupChannel,
    oldestMessageTimeStamp,
    userFilledMessageListQuery,
    replyType,
    isVoiceMessageEnabled,
  }, {
    hasMorePrev,
    logger,
    messagesDispatcher,
    sdk,
  });

  const scrollToMessage = useScrollToMessage({
    setInitialTimeStamp,
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
    isVoiceMessageEnabled,
  }, {
    logger,
    messagesDispatcher,
    sdk,
  });

  const toggleReaction = useToggleReactionCallback({ currentGroupChannel }, { logger });

  // to create message-datasource
  // this hook sets currentGroupChannel asynchronously
  useGetChannel(
    { channelUrl, sdkInit, disableMarkAsRead },
    { messagesDispatcher, sdk, logger, markAsReadScheduler },
  );

  // to set quote message as null
  useEffect(() => {
    setQuoteMessage(null);
  }, [channelUrl]);

  // Hook to handle ChannelEvents and send values to useReducer using messagesDispatcher
  useHandleChannelEvents(
    {
      currentGroupChannel,
      sdkInit,
      currentUserId: userId,
      disableMarkAsRead,
    },
    {
      messagesDispatcher,
      sdk,
      logger,
      scrollRef,
      setQuoteMessage,
      markAsReadScheduler,
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
    latestMessageTimeStamp,
    replyType,
    isVoiceMessageEnabled,
  }, {
    logger,
    scrollRef,
    messagesDispatcher,
  });

  // handles API calls from withSendbird
  useEffect(() => {
    const subscriber = utils.pubSubHandler({
      channelUrl,
      pubSub,
      dispatcher: messagesDispatcher,
      scrollRef,
    });
    return () => {
      utils.pubSubHandleRemover(subscriber);
    };
  }, [channelUrl, sdkInit]);

  // handling connection breaks
  useHandleReconnect({ isOnline, replyType, disableMarkAsRead }, {
    logger,
    sdk,
    scrollRef,
    currentGroupChannel,
    messagesDispatcher,
    userFilledMessageListQuery,
    markAsReadScheduler,
  });

  // callbacks for Message CURD actions
  const deleteMessage = useDeleteMessageCallback({ currentGroupChannel, messagesDispatcher },
    { logger });
  const updateMessage = useUpdateMessageCallback(
    { currentGroupChannel, messagesDispatcher, onBeforeUpdateUserMessage, isMentionEnabled },
    { logger, pubSub },
  );
  const resendMessage = useResendMessageCallback(
    { currentGroupChannel, messagesDispatcher },
    { logger },
  );
  const [messageInputRef, sendMessage] = useSendMessageCallback(
    { currentGroupChannel, onBeforeSendUserMessage, isMentionEnabled },
    {
      logger,
      pubSub,
      scrollRef,
      messagesDispatcher,
    },
  );
  const [sendFileMessage] = useSendFileMessageCallback(
    { currentGroupChannel, onBeforeSendFileMessage, imageCompression },
    {
      logger,
      pubSub,
      scrollRef,
      messagesDispatcher,
    },
  );
  const [sendVoiceMessage] = useSendVoiceMessageCallback(
    {
      currentGroupChannel,
      onBeforeSendVoiceMessage,
    },
    {
      logger,
      pubSub,
      scrollRef,
      messagesDispatcher,
    },
  );

  return (
    <ChannelContext.Provider value={{
      // props
      channelUrl,
      isReactionEnabled: usingReaction,
      isMessageGroupingEnabled,
      showSearchIcon,
      highlightedMessage,
      startingPoint,
      onBeforeSendUserMessage,
      onBeforeSendFileMessage,
      onBeforeUpdateUserMessage,
      onChatHeaderActionClick,
      onSearchClick,
      onBackClick,
      replyType,
      threadReplySelectType,
      queries,
      filterMessageList,
      disableMarkAsRead,
      onReplyInThread,
      onQuoteMessageClick,
      onMessageAnimated,
      onMessageHighlighted,

      // messagesStore
      allMessages,
      loading,
      initialized,
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
      sendVoiceMessage,
      initialTimeStamp,
      messageActionTypes,
      messagesDispatcher,
      setInitialTimeStamp,
      setAnimatedMessageId,
      setHighLightedMessageId,
      animatedMessageId,
      highLightedMessageId,
      nicknamesMap,
      emojiAllMap,
      onScrollCallback,
      onScrollDownCallback,
      scrollRef,
      toggleReaction,
    }}>
      <UserProfileProvider
        disableUserProfile={props?.disableUserProfile}
        renderUserProfile={props?.renderUserProfile}
        onUserProfileMessage={onUserProfileMessage}
      >
        {children}
      </UserProfileProvider>
    </ChannelContext.Provider>
  );
};

export type UseChannelType = () => ChannelProviderInterface;
const useChannelContext: UseChannelType = () => React.useContext(ChannelContext);

export {
  ChannelProvider,
  useChannelContext,
};
