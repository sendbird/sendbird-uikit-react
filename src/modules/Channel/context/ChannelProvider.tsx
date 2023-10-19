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
  FileMessageCreateParams,
  MultipleFilesMessageCreateParams,
  UserMessage,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';
import type { EmojiContainer, SendbirdError, User } from '@sendbird/chat';

import { ReplyType, RenderUserProfileProps, Nullable } from '../../../types';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { CoreMessageType, SendableMessageType } from '../../../utils';
import { ThreadReplySelectType } from './const';

import * as utils from './utils';
import { getIsReactionEnabled } from '../../../utils/getIsReactionEnabled';

import messagesInitialState from './dux/initialState';
import messagesReducer from './dux/reducers';
import * as messageActionTypes from './dux/actionTypes';

import useHandleChannelEvents from './hooks/useHandleChannelEvents';
import useGetChannel from './hooks/useGetChannel';
import useInitialMessagesFetch from './hooks/useInitialMessagesFetch';
import useHandleReconnect from './hooks/useHandleReconnect';
import useScrollCallback, { UseScrollCallbackReturn } from './hooks/useScrollCallback';
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
import { getCaseResolvedThreadReplySelectType } from '../../../lib/utils/resolvedReplyType';
import { PublishingModuleType, useSendMultipleFilesMessage } from './hooks/useSendMultipleFilesMessage';
import { useHandleChannelPubsubEvents } from './hooks/useHandleChannelPubsubEvents';

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

export type ChannelContextProps = {
  children?: React.ReactElement;
  channelUrl: string;
  isReactionEnabled?: boolean;
  isMessageGroupingEnabled?: boolean;
  isMultipleFilesMessageEnabled?: boolean;
  showSearchIcon?: boolean;
  animatedMessage?: number | null;
  highlightedMessage?: number | null;
  startingPoint?: number | null;
  onBeforeSendUserMessage?(text: string, quotedMessage?: SendableMessageType): UserMessageCreateParams;
  onBeforeSendFileMessage?(file: File, quotedMessage?: SendableMessageType): FileMessageCreateParams;
  onBeforeUpdateUserMessage?(text: string): UserMessageUpdateParams;
  onBeforeSendVoiceMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
  onBeforeSendMultipleFilesMessage?: (files: Array<File>, quotedMessage?: SendableMessageType) => MultipleFilesMessageCreateParams;
  onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
  onSearchClick?(): void;
  onBackClick?(): void;
  replyType?: ReplyType;
  threadReplySelectType?: ThreadReplySelectType;
  queries?: ChannelQueries;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  filterMessageList?(messages: BaseMessage): boolean;
  disableUserProfile?: boolean;
  disableMarkAsRead?: boolean;
  onReplyInThread?: (props: { message: SendableMessageType }) => void;
  onQuoteMessageClick?: (props: { message: SendableMessageType }) => void;
  onMessageAnimated?: () => void;
  onMessageHighlighted?: () => void;
  scrollBehavior?: 'smooth' | 'auto';
  reconnectOnIdle?: boolean;
};

interface MessageStoreInterface {
  allMessages: CoreMessageType[];
  localMessages: CoreMessageType[];
  loading: boolean;
  initialized: boolean;
  unreadSince: string;
  isInvalid: boolean;
  currentGroupChannel: Nullable<GroupChannel>;
  hasMorePrev: boolean;
  oldestMessageTimeStamp: number;
  hasMoreNext: boolean;
  latestMessageTimeStamp: number;
  emojiContainer: EmojiContainer;
  readStatus: any;
}

interface SendMessageParams {
  message: string;
  quoteMessage?: SendableMessageType;
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
  isScrolled?: boolean;
  setIsScrolled?: React.Dispatch<React.SetStateAction<boolean>>;
  messageActionTypes: typeof messageActionTypes;
  messagesDispatcher: CustomUseReducerDispatcher;
  quoteMessage: SendableMessageType | null;
  setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType | null>>;
  initialTimeStamp: number;
  setInitialTimeStamp: React.Dispatch<React.SetStateAction<number>>;
  animatedMessageId: number;
  highLightedMessageId: number;
  nicknamesMap: Map<string, string>;
  emojiAllMap: any;
  onScrollCallback: UseScrollCallbackReturn;
  onScrollDownCallback: any;
  scrollRef: React.MutableRefObject<HTMLDivElement>;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
  setHighLightedMessageId: React.Dispatch<React.SetStateAction<number>>;
  messageInputRef: React.MutableRefObject<HTMLInputElement>,
  deleteMessage(message: CoreMessageType): Promise<CoreMessageType>,
  updateMessage(props: UpdateMessageProps, callback?: (err: SendbirdError, message: UserMessage) => void): Promise<CoreMessageType>,
  resendMessage(failedMessage: SendableMessageType): Promise<SendableMessageType>,
  // TODO: Good to change interface to using params / This part need refactoring
  sendMessage: (props: SendMessageParams) => void,
  sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => void,
  sendVoiceMessage: (file: File, duration: number, quoteMessage?: SendableMessageType) => void,
  sendMultipleFilesMessage: (files: Array<File>, quoteMessage?: SendableMessageType) => void,
  // sendMessage(messageParams: SendBird.UserMessageParams): Promise<SendBird.UserMessage>,
  // sendFileMessage(messageParams: SendBird.FileMessageParams): Promise<SendBird.FileMessage>,
  toggleReaction(message: SendableMessageType, emojiKey: string, isReacted: boolean): void,
  renderUserMentionItem?: (props: { user: User }) => JSX.Element;
}

const ChannelContext = React.createContext<ChannelProviderInterface | null>(undefined);

const ChannelProvider: React.FC<ChannelContextProps> = (props: ChannelContextProps) => {
  const {
    channelUrl,
    children,
    isReactionEnabled,
    isMessageGroupingEnabled = true,
    isMultipleFilesMessageEnabled = false,
    showSearchIcon,
    animatedMessage,
    highlightedMessage,
    startingPoint,
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeUpdateUserMessage,
    onBeforeSendVoiceMessage,
    onBeforeSendMultipleFilesMessage,
    onChatHeaderActionClick,
    onSearchClick,
    onBackClick,
    replyType: channelReplyType,
    threadReplySelectType,
    queries,
    filterMessageList,
    disableMarkAsRead = false,
    onReplyInThread,
    onQuoteMessageClick,
    onMessageAnimated,
    onMessageHighlighted,
    scrollBehavior = 'auto',
    reconnectOnIdle = true,
  } = props;

  const globalStore = useSendbirdStateContext();
  const { config } = globalStore;
  const replyType = channelReplyType ?? config.replyType;
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
    groupChannel,
  } = config;
  const sdk = globalStore?.stores?.sdkStore?.sdk as SendbirdGroupChat;
  const sdkInit = globalStore?.stores?.sdkStore?.initialized;
  const globalConfigs = globalStore?.config;

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
  const [quoteMessage, setQuoteMessage] = useState<SendableMessageType>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const [messagesStore, messagesDispatcher] = useReducer(
    messagesReducer,
    messagesInitialState,
  ) as [MessageStoreInterface, CustomUseReducerDispatcher];
  const scrollRef = useRef(null);

  const {
    allMessages,
    localMessages,
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
  const usingReaction = getIsReactionEnabled({
    isBroadcast,
    isSuper,
    globalLevel: config?.isReactionEnabled,
    moduleLevel: isReactionEnabled,
  });

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
    scrollRef,
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
    setIsScrolled,
  }, {
    logger,
    scrollRef,
    messagesDispatcher,
  });

  // handles API calls from withSendbird
  useHandleChannelPubsubEvents({
    channelUrl,
    sdkInit,
    pubSub,
    dispatcher: messagesDispatcher,
    scrollRef,
  });

  // handling connection breaks
  useHandleReconnect({ isOnline, replyType, disableMarkAsRead, reconnectOnIdle }, {
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
    {
      currentGroupChannel,
      isMentionEnabled,
      onBeforeSendUserMessage,
    },
    {
      logger,
      pubSub,
      scrollRef,
      messagesDispatcher,
    },
  );
  const [sendFileMessage] = useSendFileMessageCallback(
    {
      currentGroupChannel,
      imageCompression,
      onBeforeSendFileMessage,
    },
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
  const [sendMultipleFilesMessage] = useSendMultipleFilesMessage({
    currentChannel: currentGroupChannel,
    onBeforeSendMultipleFilesMessage,
    publishingModules: [PublishingModuleType.CHANNEL],
  }, {
    logger,
    pubSub,
    scrollRef,
  });

  return (
    <ChannelContext.Provider value={{
      // props
      channelUrl,
      isReactionEnabled: usingReaction,
      isMessageGroupingEnabled,
      isMultipleFilesMessageEnabled,
      showSearchIcon: showSearchIcon ?? globalConfigs.showSearchIcon,
      highlightedMessage,
      startingPoint,
      onBeforeSendUserMessage,
      onBeforeSendFileMessage,
      onBeforeUpdateUserMessage,
      onChatHeaderActionClick,
      onSearchClick,
      onBackClick,
      replyType,
      threadReplySelectType: threadReplySelectType
        ?? getCaseResolvedThreadReplySelectType(groupChannel.threadReplySelectType).upperCase
        ?? ThreadReplySelectType.THREAD,
      queries,
      filterMessageList,
      disableMarkAsRead,
      onReplyInThread,
      onQuoteMessageClick,
      onMessageAnimated,
      onMessageHighlighted,

      // messagesStore
      allMessages,
      localMessages,
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
      sendMultipleFilesMessage,
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
      scrollBehavior,
      toggleReaction,
      isScrolled,
      setIsScrolled,
    }}>
      <UserProfileProvider
        disableUserProfile={props?.disableUserProfile ?? config?.disableUserProfile}
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
