import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { User } from '@sendbird/chat';
import {
  FileMessageCreateParams,
  MultipleFilesMessageCreateParams,
  ReplyType as ChatReplyType,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { useAsyncEffect, useGroupChannelMessages, useIIFE, usePreservedCallback } from '@sendbird/uikit-tools';

import type { CoreMessageType, SendableMessageType } from '../../../utils';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { ThreadReplySelectType } from './const';
import { RenderUserProfileProps, ReplyType } from '../../../types';
import useToggleReactionCallback from './hooks/useToggleReactionCallback';
import { getCaseResolvedReplyType, getCaseResolvedThreadReplySelectType } from '../../../lib/utils/resolvedReplyType';
import { scrollToRenderedMessage } from './utils';
import { SCROLL_BUFFER } from '../../../utils/consts';
import { useOnScrollPositionChangeDetectorWithRef } from '../../../hooks/useOnScrollReachedEndDetector';
import PUBSUB_TOPICS from '../../../lib/pubSub/topics';
import { shouldPubSubPublishToChannel } from '../../internalInterfaces';

type OnBeforeHandler<T> = (params: T) => T | Promise<T>;

export interface GroupChannelContextProps {
  // Default
  children?: React.ReactElement;
  channelUrl: string;

  // Flags
  isReactionEnabled?: boolean;
  isMessageGroupingEnabled?: boolean;
  isMultipleFilesMessageEnabled?: boolean;
  showSearchIcon?: boolean;
  replyType?: ReplyType;
  threadReplySelectType?: ThreadReplySelectType;
  disableUserProfile?: boolean;
  disableMarkAsRead?: boolean;
  scrollBehavior?: 'smooth' | 'auto';
  reconnectOnIdle?: boolean;

  startingPoint?: number;

  // Message Focusing
  animatedMessageId?: number | null;
  onMessageAnimated?: () => void;

  // Custom
  // TODO: queries?: ChannelQueries; -> MessageCollectionFilter
  filterMessageList?(messages: CoreMessageType): boolean;

  // Handlers
  onBeforeSendUserMessage?: OnBeforeHandler<UserMessageCreateParams>;
  onBeforeSendFileMessage?: OnBeforeHandler<FileMessageCreateParams>;
  onBeforeSendVoiceMessage?: OnBeforeHandler<FileMessageCreateParams>;
  onBeforeSendMultipleFilesMessage?: OnBeforeHandler<MultipleFilesMessageCreateParams>;
  onBeforeUpdateUserMessage?: OnBeforeHandler<UserMessageUpdateParams>;

  // #Click
  onBackClick?(): void;
  onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
  onReplyInThreadClick?: (props: { message: SendableMessageType }) => void;
  onSearchClick?(): void;
  onQuoteMessageClick?: (props: { message: SendableMessageType }) => void;

  // Render
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  renderUserMentionItem?: (props: { user: User }) => JSX.Element;
}

export interface GroupChannelProviderInterface extends GroupChannelContextProps, ReturnType<typeof useGroupChannelMessages> {
  currentChannel: GroupChannel | null;
  nicknamesMap: Map<string, string>;

  scrollRef: React.MutableRefObject<HTMLDivElement>;
  scrollDistanceFromBottomRef: React.MutableRefObject<number>;
  messageInputRef: React.MutableRefObject<HTMLDivElement>;

  quoteMessage: SendableMessageType | null;
  setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType | null>>;
  animatedMessageId: number;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
  isScrollBottomReached: boolean;
  setIsScrollBottomReached: React.Dispatch<React.SetStateAction<boolean>>;

  scrollToBottom: () => void;
  scrollToMessage: (createdAt: number, messageId: number) => void;
  toggleReaction(message: SendableMessageType, emojiKey: string, isReacted: boolean): void;
}

const GroupChannelContext = React.createContext<GroupChannelProviderInterface>(null);

const GroupChannelProvider = (props: GroupChannelContextProps) => {
  const {
    // Default
    channelUrl,
    children,
    // Flags
    isReactionEnabled: moduleReactionEnabled,
    replyType: moduleReplyType,
    threadReplySelectType: moduleThreadReplySelectType,
    isMessageGroupingEnabled = true,
    isMultipleFilesMessageEnabled,
    showSearchIcon,
    disableMarkAsRead = false,
    reconnectOnIdle = true,
    scrollBehavior = 'auto',

    // Message Focusing
    startingPoint,
    animatedMessageId: _animatedMessageId,

    // Custom
    // queries -> TODO: message collection filter
    filterMessageList,
    // #Message
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeSendVoiceMessage,
    onBeforeSendMultipleFilesMessage,
    onBeforeUpdateUserMessage,
    // #Focusing
    onMessageAnimated,
    // #Click
    onBackClick,
    onChatHeaderActionClick,
    onReplyInThreadClick,
    onSearchClick,
    onQuoteMessageClick,
    // Render
    renderUserMentionItem,
  } = props;

  // Global context
  const { config, stores } = useSendbirdStateContext();

  const { sdkStore } = stores;
  const { logger, userId, onUserProfileMessage, markAsReadScheduler } = config;

  // State
  const [quoteMessage, setQuoteMessage] = useState<SendableMessageType>(null);
  const [animatedMessageId, setAnimatedMessageId] = useState(0);
  const [currentChannel, setCurrentChannel] = useState<GroupChannel | null>(null);
  const [isScrollBottomReached, setIsScrollBottomReached] = useState(false);

  // Ref
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollDistanceFromBottomRef = useRef(0);
  const messageInputRef = useRef(null);

  const toggleReaction = useToggleReactionCallback(currentChannel, logger);

  const replyType = getCaseResolvedReplyType(moduleReplyType ?? config.groupChannel.replyType).upperCase;
  const threadReplySelectType = getCaseResolvedThreadReplySelectType(
    moduleThreadReplySelectType ?? config.groupChannel.threadReplySelectType
  ).upperCase;
  const chatReplyType = useIIFE(() => {
    if (replyType === 'NONE') return ChatReplyType.NONE;
    return ChatReplyType.ONLY_REPLY_TO_CHANNEL;
  });
  const isReactionEnabled = useIIFE(() => {
    if (!currentChannel || currentChannel.isSuper || currentChannel.isBroadcast || currentChannel.isEphemeral) return false;
    return moduleReactionEnabled ?? config.groupChannel.enableReactions;
  });

  const nicknamesMap = useMemo(
    () => new Map((currentChannel?.members ?? []).map(({ userId, nickname }) => [userId, nickname])),
    [currentChannel?.members]
  );

  // Initialize current channel
  useAsyncEffect(async () => {
    if (sdkStore.initialized) {
      try {
        const channel = await sdkStore.sdk.groupChannel.getChannel(channelUrl);
        setCurrentChannel(channel);
      } catch {
        setCurrentChannel(null);
      } finally {
        // Reset states when channel changes
        setQuoteMessage(null);
        setAnimatedMessageId(0);
      }
    }
  }, [sdkStore.initialized, sdkStore.sdk, channelUrl]);

  // Store - useGroupChannelMessages
  const {
    loading,
    refreshing,
    messages,
    newMessages,
    refresh,
    next,
    hasNext,
    prev,
    hasPrev,
    resetNewMessages,
    sendUserMessage,
    sendFileMessage,
    updateUserMessage,
    updateFileMessage,
    resendMessage,
    deleteMessage,
    resetWithStartingPoint,
  } = useGroupChannelMessages(sdkStore.sdk, currentChannel, userId, {
    replyType: chatReplyType,
    startingPoint,
    markAsRead: (channels) => channels.forEach((it) => markAsReadScheduler.push(it)),
    shouldCountNewMessages: () => !isScrollBottomReached,
    onMessagesReceived: () => {
      if (isScrollBottomReached && isContextMenuClosed()) {
        scrollToBottom();
      }
    },
    // collectionCreator?: (collectionParams?: DefaultCollectionParams) => MessageCollection;
    // onMessagesUpdated?: (messages: SendbirdMessage[]) => void;
    // onChannelDeleted?: (channelUrl: string) => void;
    // onChannelUpdated?: (channel: GroupChannel) => void;
    // onCurrentUserBanned?: () => void;
    logger,
  });

  useOnScrollPositionChangeDetectorWithRef(scrollRef, {
    onReachedTop({ distanceFromBottom }) {
      setIsScrollBottomReached(false);
      scrollDistanceFromBottomRef.current = distanceFromBottom;

      prev();
    },
    onInBetween({ distanceFromBottom }) {
      setIsScrollBottomReached(false);
      scrollDistanceFromBottomRef.current = distanceFromBottom;
    },
    onReachedBottom({ distanceFromBottom }) {
      setIsScrollBottomReached(true);
      scrollDistanceFromBottomRef.current = distanceFromBottom;

      next();
    },
  });

  const scrollToBottom = usePreservedCallback(() => {
    setAnimatedMessageId(0);
    setIsScrollBottomReached(true);

    if (hasNext()) {
      resetWithStartingPoint(Number.MAX_SAFE_INTEGER, () => {
        scrollRef.current.scrollTop = Number.MAX_SAFE_INTEGER;
      });
    } else {
      scrollRef.current.scrollTop = Number.MAX_SAFE_INTEGER;
    }
  });

  const scrollToMessage = usePreservedCallback((createdAt: number, messageId: number, animated = true) => {
    // NOTE: To prevent multiple clicks on the message in the channel while scrolling
    //  Check if it can be replaced with event.stopPropagation()
    const element = scrollRef.current;
    const parentNode = element?.parentNode as HTMLDivElement;
    const clickHandler = {
      activate() {
        if (!element || !parentNode) return;
        element.style.pointerEvents = 'auto';
        parentNode.style.cursor = 'auto';
      },
      deactivate() {
        if (!element || !parentNode) return;
        element.style.pointerEvents = 'none';
        parentNode.style.cursor = 'wait';
      },
    };

    clickHandler.deactivate();

    setAnimatedMessageId(0);
    const message = messages.find((it) => it.messageId === messageId);
    if (message) {
      if (animated) setAnimatedMessageId(messageId);
      scrollToRenderedMessage(scrollRef, message.createdAt);
    } else {
      resetWithStartingPoint(createdAt, () => {
        if (animated) setAnimatedMessageId(messageId);
        scrollToRenderedMessage(scrollRef, message.createdAt);
      });
    }

    clickHandler.activate();
  });

  useEffect(() => {
    config.pubSub.subscribe(PUBSUB_TOPICS.SEND_USER_MESSAGE, (data) => {
      if (shouldPubSubPublishToChannel(data.publishingModules)) {
      }
    });
  }, []);

  // 1. TODO: useGroupChannelEvents - 참고: useHandleChannelEvents
  // 2. TODO: 없앨지 살펴보기
  // handles API calls from withSendbird
  // useHandleChannelPubsubEvents({
  //   channelUrl,
  //   sdkInit,
  //   pubSub,
  //   scrollRef,
  // });

  return (
    <GroupChannelContext.Provider
      value={{
        // # Props
        channelUrl,
        isReactionEnabled,
        isMessageGroupingEnabled,
        isMultipleFilesMessageEnabled,
        showSearchIcon: showSearchIcon ?? config.showSearchIcon,
        replyType,
        threadReplySelectType,
        disableMarkAsRead,
        scrollBehavior,
        reconnectOnIdle,

        // # Custom Props
        // queries,
        filterMessageList,
        // ## Message
        onBeforeSendUserMessage,
        onBeforeSendFileMessage,
        onBeforeSendVoiceMessage,
        onBeforeSendMultipleFilesMessage,
        onBeforeUpdateUserMessage,
        // ## Focusing
        onMessageAnimated,
        // ## Click
        onBackClick,
        onChatHeaderActionClick,
        onReplyInThreadClick,
        onSearchClick,
        onQuoteMessageClick,
        // ## Custom render
        renderUserMentionItem,

        // Internal Interface
        currentChannel,
        nicknamesMap,

        scrollRef,
        scrollDistanceFromBottomRef,
        messageInputRef,

        quoteMessage,
        setQuoteMessage,
        animatedMessageId,
        setAnimatedMessageId,
        isScrollBottomReached,
        setIsScrollBottomReached,

        scrollToBottom,
        scrollToMessage,
        toggleReaction,

        // # useGroupChannelMessages
        loading,
        refreshing,
        messages,
        newMessages,
        refresh,
        next,
        hasNext,
        prev,
        hasPrev,
        resetNewMessages,
        sendUserMessage,
        sendFileMessage,
        updateUserMessage,
        updateFileMessage,
        resendMessage,
        deleteMessage,
        resetWithStartingPoint,
      }}
    >
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

function isReachedToBottom(elem: HTMLDivElement) {
  if (elem) {
    const { clientHeight, scrollTop, scrollHeight } = elem;
    return clientHeight + scrollTop >= scrollHeight - SCROLL_BUFFER;
  }
  return false;
}
function isContextMenuClosed() {
  return (
    document.getElementById('sendbird-dropdown-portal')?.childElementCount === 0 &&
    document.getElementById('sendbird-emoji-list-portal')?.childElementCount === 0
  );
}

export type UseGroupContextChannelType = () => GroupChannelProviderInterface;
const useGroupChannelContext: UseGroupContextChannelType = () => React.useContext(GroupChannelContext);

export { GroupChannelProvider, useGroupChannelContext };
