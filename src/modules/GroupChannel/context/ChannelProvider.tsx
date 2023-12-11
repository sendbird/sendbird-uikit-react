import React, {
  useEffect,
  useState,
  useReducer,
  useRef,
  useMemo,
} from 'react';

import type { SendableMessageType } from '../../../utils';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { ThreadReplySelectType } from './const';

import type { GroupChannelContextProps, GroupChannelProviderInterface } from '../types';
import * as utils from './utils';
import { getIsReactionEnabled } from '../../../utils/getIsReactionEnabled';

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
import useSendVoiceMessageCallback from './hooks/useSendVoiceMessageCallback';
import { getCaseResolvedThreadReplySelectType } from '../../../lib/utils/resolvedReplyType';
import { useSendMultipleFilesMessage } from './hooks/useSendMultipleFilesMessage';
import { useHandleChannelPubsubEvents } from './hooks/useHandleChannelPubsubEvents';
import { PublishingModuleType } from '../../internalInterfaces';

const GroupChannelContext = React.createContext<GroupChannelProviderInterface>(null);

const GroupChannelProvider = (props: GroupChannelContextProps) => {
  const {
    channelUrl,
    children,
    isReactionEnabled,
    isMessageGroupingEnabled = true,
    isMultipleFilesMessageEnabled,
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
    // queries,
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
    onUserProfileMessage,
    markAsReadScheduler,
    groupChannel,
  } = config;
  const sdk = globalStore?.stores?.sdkStore?.sdk;
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
  // const userFilledMessageListQuery = queries?.messageListParams;
  const [quoteMessage, setQuoteMessage] = useState<SendableMessageType>(null);
  const [isScrolled, setIsScrolled] = useState(false);


  useGroupChannelMessages

  const [messagesStore, messagesDispatcher] = useReducer(messagesReducer, messagesInitialState);
  const scrollRef = useRef(null);

  const {
    allMessages,
    localMessages,
    loading,
    initialized,
    unreadSince,
    unreadSinceDate,
    isInvalid,
    currentGroupChannel,
    hasMorePrev,
    oldestMessageTimeStamp,
    hasMoreNext,
    latestMessageTimeStamp,
    emojiContainer,
    readStatus,
    typingMembers,
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
    <GroupChannelContext.Provider value={{
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
      // queries,
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
      unreadSinceDate,
      isInvalid,
      currentGroupChannel,
      hasMorePrev,
      hasMoreNext,
      oldestMessageTimeStamp,
      latestMessageTimeStamp,
      emojiContainer,
      readStatus,
      typingMembers,

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
      messageActionTypes: channelActions,
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
    </GroupChannelContext.Provider>
  );
};

export type UseGroupContextChannelType = () => GroupChannelProviderInterface;
const useGroupChannelContext: UseGroupContextChannelType = () => React.useContext(GroupChannelContext);

export {
  GroupChannelProvider,
  useGroupChannelContext,
};
