import React, { useMemo, useEffect, useRef, createContext, useCallback } from 'react';
import {
  ReplyType as ChatReplyType,
} from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageFilter } from '@sendbird/chat/groupChannel';
import {
  useAsyncEffect,
  useAsyncLayoutEffect,
  useIIFE,
  useGroupChannelMessages,
} from '@sendbird/uikit-tools';

import { UserProfileProvider } from '../../../lib/UserProfileContext';
import { useMessageListScroll } from './hooks/useMessageListScroll';
import { getIsReactionEnabled } from '../../../utils/getIsReactionEnabled';
import {
  getCaseResolvedReplyType,
  getCaseResolvedThreadReplySelectType,
} from '../../../lib/utils/resolvedReplyType';
import { isContextMenuClosed } from './utils';
import PUBSUB_TOPICS from '../../../lib/pubSub/topics';
import { createStore } from '../../../utils/storeManager';
import { useStore } from '../../../hooks/useStore';
import { useGroupChannel } from './hooks/useGroupChannel';
import { ThreadReplySelectType } from './const';
import type {
  GroupChannelProviderProps,
  MessageListQueryParamsType,
  GroupChannelState,
} from './types';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import useDeepCompareEffect from '../../../hooks/useDeepCompareEffect';
import { deleteNullish } from '../../../utils/utils';
import { CollectionEventSource } from '@sendbird/chat';

const initialState = () => ({
  currentChannel: null,
  channelUrl: '',
  fetchChannelError: null,
  nicknamesMap: new Map(),

  initialized: false,
  loading: true,
  messages: [],
  quoteMessage: null,
  animatedMessageId: null,
  isScrollBottomReached: true,
  readState: null,

  scrollRef: { current: null },
  scrollDistanceFromBottomRef: { current: 0 },
  scrollPositionRef: { current: 0 },
  messageInputRef: { current: null },

  isReactionEnabled: false,
  isMessageGroupingEnabled: true,
  isMultipleFilesMessageEnabled: false,
  showSearchIcon: true,
  replyType: 'NONE',
  threadReplySelectType: ThreadReplySelectType.PARENT,
  disableMarkAsRead: false,
  scrollBehavior: 'auto',
  scrollPubSub: null,
} as GroupChannelState);

export const GroupChannelContext = createContext<ReturnType<typeof createStore<GroupChannelState>> | null>(null);

const createGroupChannelStore = (props?: Partial<GroupChannelState>) => createStore({
  ...initialState(),
  ...props,
});

export const InternalGroupChannelProvider = (props: GroupChannelProviderProps) => {
  const { children } = props;

  const defaultProps: Partial<GroupChannelState> = deleteNullish({
    channelUrl: props?.channelUrl,
    renderUserProfile: props?.renderUserProfile,
    disableUserProfile: props?.disableUserProfile,
    onUserProfileMessage: props?.onUserProfileMessage,
    onStartDirectMessage: props?.onStartDirectMessage,
    isReactionEnabled: props?.isReactionEnabled,
    isMessageGroupingEnabled: props?.isMessageGroupingEnabled,
    isMultipleFilesMessageEnabled: props?.isMultipleFilesMessageEnabled,
    showSearchIcon: props?.showSearchIcon,
    threadReplySelectType: props?.threadReplySelectType,
    disableMarkAsRead: props?.disableMarkAsRead,
    scrollBehavior: props?.scrollBehavior,
    forceLeftToRightMessageLayout: props?.forceLeftToRightMessageLayout,
    startingPoint: props?.startingPoint,
    animatedMessageId: props?.animatedMessageId,
    onMessageAnimated: props?.onMessageAnimated,
    messageListQueryParams: props?.messageListQueryParams,
    filterEmojiCategoryIds: props?.filterEmojiCategoryIds,
    onBeforeSendUserMessage: props?.onBeforeSendUserMessage,
    onBeforeSendFileMessage: props?.onBeforeSendFileMessage,
    onBeforeSendVoiceMessage: props?.onBeforeSendVoiceMessage,
    onBeforeSendMultipleFilesMessage: props?.onBeforeSendMultipleFilesMessage,
    onBeforeUpdateUserMessage: props?.onBeforeUpdateUserMessage,
    onBeforeDownloadFileMessage: props?.onBeforeDownloadFileMessage,
    onBackClick: props?.onBackClick,
    onChatHeaderActionClick: props?.onChatHeaderActionClick,
    onReplyInThreadClick: props?.onReplyInThreadClick,
    onSearchClick: props?.onSearchClick,
    onQuoteMessageClick: props?.onQuoteMessageClick,
    renderUserMentionItem: props?.renderUserMentionItem,
  });

  const storeRef = useRef(createGroupChannelStore(defaultProps));

  return (
    <GroupChannelContext.Provider value={storeRef.current}>
      {children}
    </GroupChannelContext.Provider>
  );
};

const GroupChannelManager :React.FC<React.PropsWithChildren<GroupChannelProviderProps>> = (props) => {
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
    onBeforeDownloadFileMessage,
    onMessageAnimated,
    onBackClick,
    onChatHeaderActionClick,
    onReplyInThreadClick,
    onSearchClick,
    onQuoteMessageClick,
    renderUserMentionItem,
    filterEmojiCategoryIds,
  } = props;

  const { state, actions } = useGroupChannel();
  const { updateState } = useGroupChannelStore();
  const { state: { config, stores } } = useSendbird();
  const { sdkStore } = stores;
  const { userId, markAsReadScheduler, logger, pubSub } = config;

  // ScrollHandler initialization
  const {
    scrollRef,
    scrollPubSub,
    scrollDistanceFromBottomRef,
    scrollPositionRef,
  } = useMessageListScroll(scrollBehavior, [state.currentChannel?.url]);

  const { isScrollBottomReached } = state;

  // Configuration resolution
  const resolvedReplyType = getCaseResolvedReplyType(moduleReplyType ?? config.groupChannel.replyType).upperCase;
  const resolvedThreadReplySelectType = getCaseResolvedThreadReplySelectType(
    moduleThreadReplySelectType ?? config.groupChannel.threadReplySelectType,
  ).upperCase;
  const replyType = getCaseResolvedReplyType(moduleReplyType ?? config.groupChannel.replyType).upperCase;
  const resolvedIsReactionEnabled = getIsReactionEnabled({
    channel: state.currentChannel,
    config,
    moduleLevel: moduleReactionEnabled,
  });
  const chatReplyType = useIIFE(() => {
    if (replyType === 'NONE') return ChatReplyType.NONE;
    return ChatReplyType.ONLY_REPLY_TO_CHANNEL;
  });

  const markAsUnreadSourceRef = useRef<'manual' | 'internal' | undefined>(undefined);

  const markAsUnread = useCallback((message: any, source?: 'manual' | 'internal') => {
    if (!config.groupChannel.enableMarkAsUnread) return;
    if (!state.currentChannel) {
      logger?.error?.('GroupChannelProvider: channel is required for markAsUnread');
      return;
    }

    try {
      if (state.currentChannel.markAsUnread) {
        state.currentChannel.markAsUnread(message);
        logger?.info?.('GroupChannelProvider: markAsUnread called for message', {
          messageId: message.messageId,
          source: source || 'unknown',
        });
        markAsUnreadSourceRef.current = source || 'internal';
      } else {
        logger?.error?.('GroupChannelProvider: markAsUnread method not available in current SDK version');
      }
    } catch (error) {
      logger?.error?.('GroupChannelProvider: markAsUnread failed', error);
    }
  }, [state.currentChannel, logger, config.groupChannel.enableMarkAsUnread]);

  // Message Collection setup
  const messageDataSource = useGroupChannelMessages(sdkStore.sdk, state.currentChannel!, {
    startingPoint,
    replyType: chatReplyType,
    collectionCreator: getCollectionCreator(state.currentChannel!, messageListQueryParams),
    shouldCountNewMessages: () => !isScrollBottomReached,
    markAsRead: (channels) => {
      if (!config.groupChannel.enableMarkAsUnread) {
        if (isScrollBottomReached && !disableMarkAsRead) {
          channels.forEach((it) => markAsReadScheduler.push(it));
        }
      }
    },
    onMessagesReceived: (messages) => {
      if (isScrollBottomReached
        && isContextMenuClosed()
        // Note: this shouldn't happen ideally, but it happens on re-rendering GroupChannelManager
        // even though the next messages and the current messages length are the same.
        // So added this condition to check if they are the same to prevent unnecessary calling scrollToBottom action
        && messages.length !== state.messages.length) {
        setTimeout(async () => actions.scrollToBottom(true), 10);
      }
    },
    onChannelDeleted: () => {
      actions.setCurrentChannel(null);
      onBackClick?.();
    },
    onCurrentUserBanned: () => {
      actions.setCurrentChannel(null);
      onBackClick?.();
    },
    onChannelUpdated: (channel, ctx) => {
      if (ctx.source === CollectionEventSource.EVENT_CHANNEL_UNREAD
        && ctx.userIds.includes(userId)
      ) {
        actions.setReadStateChanged('unread');
      }
      if (ctx.source === CollectionEventSource.EVENT_CHANNEL_READ
        && ctx.userIds.includes(userId)
      ) {
        actions.setReadStateChanged('read');
      }
      actions.setCurrentChannel(channel);
    },
    logger: logger as any,
  });

  // Channel initialization
  useAsyncEffect(async () => {
    if (sdkStore.initialized && channelUrl) {
      try {
        const channel = await sdkStore.sdk.groupChannel.getChannel(channelUrl);
        actions.setCurrentChannel(channel);
      } catch (error) {
        actions.handleChannelError(error);
        logger?.error?.('GroupChannelProvider: error when fetching channel', error);
      }
    }
  }, [sdkStore.initialized, sdkStore.sdk, channelUrl]);

  // Message sync effect
  useAsyncLayoutEffect(async () => {
    if (messageDataSource.initialized) {
      actions.scrollToBottom();
    }

    const handleExternalMessage = (data) => {
      if (data.channel.url === state.currentChannel?.url) {
        actions.scrollToBottom(true);
      }
    };

    if (pubSub?.subscribe === undefined) return;
    const subscriptions = [
      pubSub.subscribe(PUBSUB_TOPICS.SEND_USER_MESSAGE, handleExternalMessage),
      pubSub.subscribe(PUBSUB_TOPICS.SEND_FILE_MESSAGE, handleExternalMessage),
    ];

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, [messageDataSource.initialized, state.currentChannel?.url]);

  // Starting point handling
  useEffect(() => {
    if (typeof startingPoint === 'number' && messageDataSource.initialized) {
      actions.scrollToMessage(startingPoint, 0, false, false);
    }
  }, [messageDataSource.initialized, startingPoint]);

  // Animated message handling
  useEffect(() => {
    if (_animatedMessageId) {
      actions.setAnimatedMessageId(_animatedMessageId);
    }
  }, [_animatedMessageId]);

  // State update effect
  const eventHandlers = useMemo(() => ({
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeSendVoiceMessage,
    onBeforeSendMultipleFilesMessage,
    onBeforeUpdateUserMessage,
    onBeforeDownloadFileMessage,
    onBackClick,
    onChatHeaderActionClick,
    onReplyInThreadClick,
    onSearchClick,
    onQuoteMessageClick,
    onMessageAnimated,
  }), [
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeSendVoiceMessage,
    onBeforeSendMultipleFilesMessage,
    onBeforeUpdateUserMessage,
    onBeforeDownloadFileMessage,
    onBackClick,
    onChatHeaderActionClick,
    onReplyInThreadClick,
    onSearchClick,
    onQuoteMessageClick,
    onMessageAnimated,
  ]);

  const renderProps = useMemo(() => ({
    renderUserMentionItem,
    filterEmojiCategoryIds,
  }), [renderUserMentionItem, filterEmojiCategoryIds]);

  const configurations = useMemo(() => ({
    isReactionEnabled: resolvedIsReactionEnabled,
    isMessageGroupingEnabled,
    isMultipleFilesMessageEnabled,
    replyType: resolvedReplyType,
    threadReplySelectType: resolvedThreadReplySelectType,
    showSearchIcon: showSearchIcon ?? config.groupChannelSettings.enableMessageSearch,
    disableMarkAsRead,
    scrollBehavior,
  }), [
    resolvedIsReactionEnabled,
    isMessageGroupingEnabled,
    isMultipleFilesMessageEnabled,
    resolvedReplyType,
    resolvedThreadReplySelectType,
    showSearchIcon,
    disableMarkAsRead,
    scrollBehavior,
    config.groupChannelSettings.enableMessageSearch,
  ]);

  const scrollState = useMemo(() => ({
    scrollRef,
    scrollPubSub,
    scrollDistanceFromBottomRef,
    scrollPositionRef,
    isScrollBottomReached,
  }), [
    scrollRef,
    scrollPubSub,
    scrollDistanceFromBottomRef,
    scrollPositionRef,
    isScrollBottomReached,
  ]);

  useDeepCompareEffect(() => {
    updateState({
      // Channel state
      channelUrl,
      currentChannel: state.currentChannel,

      // Grouped states
      ...configurations,
      ...scrollState,
      ...eventHandlers,
      ...renderProps,

      // Message data source & actions
      ...messageDataSource,
      markAsUnread,
      markAsUnreadSourceRef,
    });
  }, [
    channelUrl,
    state.currentChannel?.serialize(),
    configurations,
    scrollState,
    eventHandlers,
    renderProps,
    messageDataSource.initialized,
    messageDataSource.loading,
    messageDataSource.messages.map(it => it.serialize()),
  ]);

  return children;
};

const GroupChannelProvider: React.FC<GroupChannelProviderProps> = (props) => {
  return (
    <InternalGroupChannelProvider key={props.channelUrl} {...props}>
      <GroupChannelManager {...props}>
        <UserProfileProvider {...props}>
          {props.children}
        </UserProfileProvider>
      </GroupChannelManager>
    </InternalGroupChannelProvider>
  );
};

/**
 * A specialized hook for GroupChannel state management
 * @returns {ReturnType<typeof createStore<GroupChannelState>>}
 */
const useGroupChannelStore = () => {
  return useStore(GroupChannelContext, state => state, initialState());
};

// Keep this function for backward compatibility.
const useGroupChannelContext = () => {
  const { state, actions } = useGroupChannel();
  return { ...state, ...actions };
};

export {
  GroupChannelProvider,
  useGroupChannelContext,
  GroupChannelManager,
};

function getCollectionCreator(groupChannel: GroupChannel, messageListQueryParams?: MessageListQueryParamsType) {
  return (defaultParams?: MessageListQueryParamsType) => {
    const params = { ...defaultParams, prevResultLimit: 30, nextResultLimit: 30, ...messageListQueryParams };
    return groupChannel.createMessageCollection({
      ...params,
      filter: new MessageFilter(params),
    });
  };
}
