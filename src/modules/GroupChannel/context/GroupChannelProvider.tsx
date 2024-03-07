import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { SendbirdError, User } from '@sendbird/chat';
import {
  FileMessageCreateParams,
  MultipleFilesMessageCreateParams,
  ReplyType as ChatReplyType,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';
import type { GroupChannel, MessageCollectionParams, MessageFilterParams } from '@sendbird/chat/groupChannel';
import { MessageFilter } from '@sendbird/chat/groupChannel';
import { useAsyncEffect, useAsyncLayoutEffect, useGroupChannelMessages, useIIFE, usePreservedCallback } from '@sendbird/uikit-tools';

import type { SendableMessageType } from '../../../utils';
import { UserProfileProvider, UserProfileProviderProps } from '../../../lib/UserProfileContext';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { ThreadReplySelectType } from './const';
import { RenderUserProfileProps, ReplyType } from '../../../types';
import useToggleReactionCallback from './hooks/useToggleReactionCallback';
import { getCaseResolvedReplyType, getCaseResolvedThreadReplySelectType } from '../../../lib/utils/resolvedReplyType';
import { getMessageTopOffset, isContextMenuClosed } from './utils';
import { useOnScrollPositionChangeDetectorWithRef } from '../../../hooks/useOnScrollReachedEndDetector';
import { ScrollTopics, ScrollTopicUnion, useMessageListScroll } from './hooks/useMessageListScroll';
import PUBSUB_TOPICS, { PubSubSendMessagePayload } from '../../../lib/pubSub/topics';
import { PubSubTypes } from '../../../lib/pubSub';
import { useMessageActions } from './hooks/useMessageActions';
import { usePreventDuplicateRequest } from './hooks/usePreventDuplicateRequest';

type OnBeforeHandler<T> = (params: T) => T | Promise<T>;
type MessageListQueryParamsType = Omit<MessageCollectionParams, 'filter'> & MessageFilterParams;
type MessageActions = ReturnType<typeof useMessageActions>;
type MessageListDataSourceWithoutActions = Omit<ReturnType<typeof useGroupChannelMessages>, keyof MessageActions | `_dangerous_${string}`>;

interface ContextBaseType {
  // Required
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

  startingPoint?: number;

  // Message Focusing
  animatedMessageId?: number | null;
  onMessageAnimated?: () => void;

  // Custom
  messageListQueryParams?: MessageListQueryParamsType;

  // Handlers
  onBeforeSendUserMessage?: OnBeforeHandler<UserMessageCreateParams>;
  onBeforeSendFileMessage?: OnBeforeHandler<FileMessageCreateParams>;
  onBeforeSendVoiceMessage?: OnBeforeHandler<FileMessageCreateParams>;
  onBeforeSendMultipleFilesMessage?: OnBeforeHandler<MultipleFilesMessageCreateParams>;
  onBeforeUpdateUserMessage?: OnBeforeHandler<UserMessageUpdateParams>;

  // Click
  onBackClick?(): void;
  onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
  onReplyInThreadClick?: (props: { message: SendableMessageType }) => void;
  onSearchClick?(): void;
  onQuoteMessageClick?: (props: { message: SendableMessageType }) => void;

  // Render
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  renderUserMentionItem?: (props: { user: User }) => JSX.Element;
}

export interface GroupChannelContextType extends ContextBaseType, MessageListDataSourceWithoutActions, MessageActions {
  currentChannel: GroupChannel | null;
  fetchChannelError: SendbirdError | null;
  nicknamesMap: Map<string, string>;

  scrollRef: React.MutableRefObject<HTMLDivElement>;
  scrollDistanceFromBottomRef: React.MutableRefObject<number>;
  scrollPubSub: PubSubTypes<ScrollTopics, ScrollTopicUnion>;
  messageInputRef: React.MutableRefObject<HTMLDivElement>;

  quoteMessage: SendableMessageType | null;
  setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType | null>>;
  animatedMessageId: number;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
  isScrollBottomReached: boolean;
  setIsScrollBottomReached: React.Dispatch<React.SetStateAction<boolean>>;

  scrollToBottom: (animated?: boolean) => void;
  scrollToMessage: (createdAt: number, messageId: number) => void;
  toggleReaction(message: SendableMessageType, emojiKey: string, isReacted: boolean): void;
}

export interface GroupChannelProviderProps
  extends ContextBaseType,
    Pick<UserProfileProviderProps, 'onUserProfileMessage' | 'renderUserProfile' | 'disableUserProfile'> {
  children?: React.ReactNode;
}

export const GroupChannelContext = React.createContext<GroupChannelContextType>(null);
export const GroupChannelProvider = (props: GroupChannelProviderProps) => {
  const {
    channelUrl,
    children,
    isReactionEnabled: moduleReactionEnabled,
    replyType: moduleReplyType,
    threadReplySelectType: moduleThreadReplySelectType,
    isMessageGroupingEnabled = true,
    isMultipleFilesMessageEnabled,
    showSearchIcon,
    disableMarkAsRead = false,
    scrollBehavior = 'auto',
    startingPoint,
    animatedMessageId: _animatedMessageId,
    messageListQueryParams,
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeSendVoiceMessage,
    onBeforeSendMultipleFilesMessage,
    onBeforeUpdateUserMessage,
    onMessageAnimated,
    onBackClick,
    onChatHeaderActionClick,
    onReplyInThreadClick,
    onSearchClick,
    onQuoteMessageClick,
    renderUserMentionItem,
  } = props;

  // Global context
  const { config, stores } = useSendbirdStateContext();

  const { sdkStore } = stores;
  const { markAsReadScheduler } = config;

  // State
  const [quoteMessage, setQuoteMessage] = useState<SendableMessageType>(null);
  const [animatedMessageId, setAnimatedMessageId] = useState<number | null>(null);
  const [currentChannel, setCurrentChannel] = useState<GroupChannel | null>(null);
  const [fetchChannelError, setFetchChannelError] = useState<SendbirdError>(null);

  // Ref
  const { scrollRef, scrollPubSub, scrollDistanceFromBottomRef, isScrollBottomReached, setIsScrollBottomReached } = useMessageListScroll(scrollBehavior);
  const messageInputRef = useRef(null);

  const toggleReaction = useToggleReactionCallback(currentChannel, config.logger);
  const replyType = getCaseResolvedReplyType(moduleReplyType ?? config.groupChannel.replyType).upperCase;
  const threadReplySelectType = getCaseResolvedThreadReplySelectType(
    moduleThreadReplySelectType ?? config.groupChannel.threadReplySelectType,
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
    [currentChannel?.members],
  );

  const preventDuplicateRequest = usePreventDuplicateRequest();
  const messageDataSource = useGroupChannelMessages(sdkStore.sdk, currentChannel, {
    startingPoint,
    replyType: chatReplyType,
    collectionCreator: getCollectionCreator(currentChannel, messageListQueryParams),
    shouldCountNewMessages: () => !isScrollBottomReached,
    markAsRead: (channels) => {
      if (!disableMarkAsRead && isScrollBottomReached) {
        channels.forEach((it) => markAsReadScheduler.push(it));
      }
    },
    onMessagesReceived: () => {
      if (isScrollBottomReached && isContextMenuClosed()) {
        scrollPubSub.publish('scrollToBottom', {});
      }
    },
    onChannelDeleted: () => {
      setCurrentChannel(null);
      setFetchChannelError(null);
    },
    onCurrentUserBanned: () => {
      setCurrentChannel(null);
      setFetchChannelError(null);
    },
    onChannelUpdated: (channel) => setCurrentChannel(channel),
    logger: config.logger,
  });

  useOnScrollPositionChangeDetectorWithRef(scrollRef, {
    async onReachedTop() {
      preventDuplicateRequest.lock();

      await preventDuplicateRequest.run(async () => {
        if (!messageDataSource.hasPrevious()) return;

        const prevViewInfo = { scrollTop: scrollRef.current.scrollTop, scrollHeight: scrollRef.current.scrollHeight };
        await messageDataSource.loadPrevious();

        // FIXME: We need a good way to detect right after the rendering of the screen instead of using setTimeout.
        setTimeout(() => {
          const nextViewInfo = { scrollHeight: scrollRef.current.scrollHeight };
          const viewUpdated = prevViewInfo.scrollHeight < nextViewInfo.scrollHeight;

          if (viewUpdated) {
            const bottomOffset = prevViewInfo.scrollHeight - prevViewInfo.scrollTop;
            scrollPubSub.publish('scroll', { top: nextViewInfo.scrollHeight - bottomOffset, lazy: false, animated: false });
          }
        });
      });

      preventDuplicateRequest.release();
    },
    async onReachedBottom() {
      preventDuplicateRequest.lock();

      await preventDuplicateRequest.run(async () => {
        if (!messageDataSource.hasNext()) return;

        const prevViewInfo = { scrollTop: scrollRef.current.scrollTop, scrollHeight: scrollRef.current.scrollHeight };
        await messageDataSource.loadNext();

        setTimeout(() => {
          const nextViewInfo = { scrollHeight: scrollRef.current.scrollHeight };
          const viewUpdated = prevViewInfo.scrollHeight < nextViewInfo.scrollHeight;

          if (viewUpdated) {
            scrollPubSub.publish('scroll', { top: prevViewInfo.scrollTop, lazy: false, animated: false });
          }
        });
      });

      preventDuplicateRequest.release();

      if (currentChannel && !messageDataSource.hasNext()) {
        messageDataSource.resetNewMessages();
        if (!disableMarkAsRead) markAsReadScheduler.push(currentChannel);
      }
    },
  });

  // SideEffect: Fetch and set to current channel by channelUrl prop.
  useAsyncEffect(async () => {
    if (sdkStore.initialized && channelUrl) {
      try {
        const channel = await sdkStore.sdk.groupChannel.getChannel(channelUrl);
        setCurrentChannel(channel);
        setFetchChannelError(null);
      } catch (error) {
        setCurrentChannel(null);
        setFetchChannelError(error);
      } finally {
        // Reset states when channel changes
        setQuoteMessage(null);
        setAnimatedMessageId(null);
      }
    }
  }, [sdkStore.initialized, sdkStore.sdk, channelUrl]);

  // SideEffect: Scroll to the bottom
  //  - On the initialized message list
  //  - On messages sent from the thread
  useAsyncLayoutEffect(async () => {
    if (messageDataSource.initialized) {
      // it prevents message load from previous/next before scroll to bottom finished.
      preventDuplicateRequest.lock();
      await preventDuplicateRequest.run(() => {
        return new Promise<void>((resolve) => {
          scrollPubSub.publish('scrollToBottom', { resolve, animated: false });
        });
      });
      preventDuplicateRequest.release();
    }

    const onSentMessageFromOtherModule = (data: PubSubSendMessagePayload) => {
      if (data.channel.url === channelUrl) scrollPubSub.publish('scrollToBottom', {});
    };
    const subscribes = [
      config.pubSub.subscribe(PUBSUB_TOPICS.SEND_USER_MESSAGE, onSentMessageFromOtherModule),
      config.pubSub.subscribe(PUBSUB_TOPICS.SEND_FILE_MESSAGE, onSentMessageFromOtherModule),
    ];
    return () => {
      subscribes.forEach((subscribe) => subscribe.remove());
      scrollPubSub.publish('scrollToBottom', { animated: false });
    };
  }, [messageDataSource.initialized, channelUrl]);

  // SideEffect: Reset MessageCollection with startingPoint prop.
  useEffect(() => {
    if (typeof startingPoint === 'number') {
      // We do not handle animation for message search here.
      // Please update the animatedMessageId prop to trigger the animation.
      scrollToMessage(startingPoint, 0, false, false);
    }
  }, [startingPoint]);

  // SideEffect: Update animatedMessageId prop to state.
  useEffect(() => {
    if (_animatedMessageId) setAnimatedMessageId(_animatedMessageId);
  }, [_animatedMessageId]);

  const scrollToBottom = usePreservedCallback(async (animated?: boolean) => {
    if (!scrollRef.current) return;

    setAnimatedMessageId(null);
    setIsScrollBottomReached(true);

    if (config.isOnline && messageDataSource.hasNext()) {
      await messageDataSource.resetWithStartingPoint(Number.MAX_SAFE_INTEGER);
      scrollPubSub.publish('scrollToBottom', { animated });
    } else {
      scrollPubSub.publish('scrollToBottom', { animated });
    }

    if (currentChannel && !messageDataSource.hasNext()) {
      messageDataSource.resetNewMessages();
      if (!disableMarkAsRead) markAsReadScheduler.push(currentChannel);
    }
  });

  const scrollToMessage = usePreservedCallback(
    async (createdAt: number, messageId: number, messageFocusAnimated?: boolean, scrollAnimated?: boolean) => {
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

      setAnimatedMessageId(null);
      const message = messageDataSource.messages.find((it) => it.messageId === messageId || it.createdAt === createdAt);
      if (message) {
        const topOffset = getMessageTopOffset(message.createdAt);
        if (topOffset) scrollPubSub.publish('scroll', { top: topOffset, animated: scrollAnimated });
        if (messageFocusAnimated ?? true) setAnimatedMessageId(messageId);
      } else {
        await messageDataSource.resetWithStartingPoint(createdAt);
        setTimeout(() => {
          const topOffset = getMessageTopOffset(createdAt);
          if (topOffset) scrollPubSub.publish('scroll', { top: topOffset, lazy: false, animated: scrollAnimated });
          if (messageFocusAnimated ?? true) setAnimatedMessageId(messageId);
        });
      }

      clickHandler.activate();
    },
  );

  const messageActions = useMessageActions({ ...props, ...messageDataSource, scrollToBottom, quoteMessage, replyType });

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

        // # Custom Props
        messageListQueryParams,
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
        fetchChannelError,
        nicknamesMap,

        scrollRef,
        scrollDistanceFromBottomRef,
        scrollPubSub,
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

        ...messageDataSource,
        ...messageActions,
      }}
    >
      <UserProfileProvider
        disableUserProfile={props?.disableUserProfile ?? config?.disableUserProfile}
        renderUserProfile={props?.renderUserProfile ?? config?.renderUserProfile}
        onUserProfileMessage={props?.onUserProfileMessage ?? config?.onUserProfileMessage}
      >
        {children}
      </UserProfileProvider>
    </GroupChannelContext.Provider>
  );
};

export const useGroupChannelContext = () => {
  const context = useContext(GroupChannelContext);
  if (!context) throw new Error('GroupChannelContext not found. Use within the GroupChannel module.');
  return context;
};

function getCollectionCreator(groupChannel: GroupChannel, messageListQueryParams?: MessageListQueryParamsType) {
  return (defaultParams: MessageListQueryParamsType) => {
    const params = { ...defaultParams, prevResultLimit: 30, nextResultLimit: 30, ...messageListQueryParams };
    return groupChannel.createMessageCollection({
      ...params,
      filter: new MessageFilter(params),
    });
  };
}
