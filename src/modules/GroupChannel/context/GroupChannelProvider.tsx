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
import { createRuntimeStore, dispatchToRuntime } from '../internal/runtime/integration';
import type { GroupChannelRuntimeEvent } from '../internal/runtime/events';
import {
  mapChannelFailed,
  mapChannelReady,
  mapOnChannelDeleted,
  mapOnChannelUpdated,
  mapOnCurrentUserBanned,
  mapOnMessagesReceived,
  mapOnMessagesUpdated,
} from '../internal/runtime/adapter';
import { createUnreadStore, dispatchToUnreadStore } from '../internal/unread/integration';
import type { UnreadEvent } from '../internal/unread/reducer';
import { GroupChannelUnreadContext } from './GroupChannelUnreadContext';

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
  autoscrollMessageOverflowToTop: false,
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
    autoscrollMessageOverflowToTop: props?.autoscrollMessageOverflowToTop,
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
    autoscrollMessageOverflowToTop,
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

  // Phase 2 runtime adapter — parallel-only. Wires coreTs callbacks into
  // a typed event reducer so Phase 3 (ScrollController) and Phase 4
  // (UnreadReducer) can consume a single dispatch boundary. Today it does
  // not drive any legacy state — dispatch calls are additive at each
  // existing callback site. The dev/test instrumentation hook
  // (__GROUP_CHANNEL_RUNTIME_DISPATCH_HOOK__) lets RV specs inspect events.
  const runtimeStoreRef = useRef(createRuntimeStore());

  // Wraps every dispatch site so a bug in the reducer OR a mapper cannot
  // prevent the legacy callback from continuing (Plan §2.4 parallel-only
  // invariant). The thunk form (`() => mapXxx(args)`) defers mapper
  // execution into the guard so a throw from the mapper is also
  // contained. Errors are observable via `logger.warn` — visible in
  // production logs but never re-thrown.
  const runtimeDispatch = useCallback((makeEvent: () => GroupChannelRuntimeEvent) => {
    try {
      const event = makeEvent();
      return dispatchToRuntime(runtimeStoreRef.current, event, (error, failedEvent) => {
        logger?.warning?.('GroupChannelProvider: runtime dispatch failed (reducer)', {
          eventType: failedEvent.type,
          error,
        });
      });
    } catch (error) {
      logger?.warning?.('GroupChannelProvider: runtime dispatch failed (mapper)', error);
      return [];
    }
  }, [logger]);

  // Phase 5.1.a — Unread reducer store. Dual-write strategy (spec §AC-4):
  // dispatch fires alongside the legacy `setNewMessageIds` /
  // `setFirstUnreadMessageId` calls. Phase 5.1.b/c switch consumer reads
  // over to this store via `useUnreadSelector`; the legacy state slice is
  // retained until Phase 5.2 has a verification window.
  //
  // MESSAGES_DELETED is intentionally NOT dispatched — `@sendbird/uikit-tools@0.1.0`
  // does not expose `onMessagesDeleted` (Plan §1). Re-evaluate when the
  // uikit-tools bump (separate follow-up) ships that callback.
  const unreadStoreRef = useRef(createUnreadStore());

  // Tracks the last channelUrl observed by the unread store so repeated
  // CHANNEL_CHANGED dispatches (e.g. mount-time + a stale onChannelUpdated
  // closure firing before the legacy setCurrentChannel has flushed) collapse
  // to a single transition. Idempotent regardless, but avoids dev-hook
  // double-fire and any future subscriber re-render.
  const unreadChannelUrlRef = useRef<string | null>(null);

  // Thunk-guarded dispatch — see runtimeDispatch (W1). A bug in the
  // reducer or in a caller-supplied factory MUST NOT prevent the legacy
  // callback from continuing.
  const dispatchChannelChanged = useCallback((channelUrl: string) => {
    if (unreadChannelUrlRef.current === channelUrl) return;
    unreadChannelUrlRef.current = channelUrl;
    return dispatchToUnreadStore(
      unreadStoreRef.current,
      { type: 'CHANNEL_CHANGED', channelUrl },
      undefined,
      (error) => {
        logger?.warning?.('GroupChannelProvider: unread CHANNEL_CHANGED failed', { error });
      },
    );
  }, [logger]);

  const unreadDispatch = useCallback((makeEvent: () => UnreadEvent, isAtBottom?: boolean) => {
    try {
      const event = makeEvent();
      return dispatchToUnreadStore(
        unreadStoreRef.current,
        event,
        { isAtBottom: isAtBottom ?? true },
        (error, failedEvent) => {
          logger?.warning?.('GroupChannelProvider: unread dispatch failed (reducer)', {
            eventType: failedEvent.type,
            error,
          });
        },
      );
    } catch (error) {
      logger?.warning?.('GroupChannelProvider: unread dispatch failed (mapper)', error);
      return unreadStoreRef.current.getState();
    }
  }, [logger]);

  // ScrollHandler initialization
  const {
    scrollRef,
    scrollPubSub,
    scrollDistanceFromBottomRef,
    scrollPositionRef,
  } = useMessageListScroll(scrollBehavior, [state.currentChannel?.url]);

  const { isScrollBottomReached } = state;

  const isAutoscrollMessageOverflowToTop = autoscrollMessageOverflowToTop ?? config.autoscrollMessageOverflowToTop ?? false;

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
        // Phase 5.1.a — record the user-chosen unread anchor in the
        // reducer. Only fires after the SDK call succeeds so the local
        // and server states agree.
        unreadDispatch(() => ({
          type: 'MARK_AS_UNREAD_SET',
          messageId: message.messageId,
          createdAt: message.createdAt,
        }));
      } else {
        logger?.error?.('GroupChannelProvider: markAsUnread method not available in current SDK version');
      }
    } catch (error) {
      logger?.error?.('GroupChannelProvider: markAsUnread failed', error);
    }
  }, [state.currentChannel, logger, config.groupChannel.enableMarkAsUnread, unreadDispatch]);

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
      // Phase 2 dispatch — additive, runs alongside the legacy effect below.
      // coreTs callback uses SendbirdMessage[] (broader than SendableMessageType);
      // the adapter mapper accepts the broader shape via structural cast.
      runtimeDispatch(() => mapOnMessagesReceived(messages as never));

      // Phase 5.1.a — Unread dispatch. Filter out current-user messages
      // BEFORE dispatch so they never enter the unread set (review I-2).
      // Prior `messages.every(...)` collapsed mixed bursts to
      // `fromCurrentUser: false`, which would have grown the set with my
      // own messageId — wrong the moment a consumer reads from the set.
      // After filtering, the remaining burst is by definition non-self,
      // so `fromCurrentUser: false` is correct.
      const peerMessages = messages.filter(
        (m) => (m as { sender?: { userId?: string } }).sender?.userId !== userId,
      );
      if (peerMessages.length > 0) {
        unreadDispatch(() => ({
          type: 'MESSAGES_RECEIVED',
          messages: peerMessages.map((m) => ({ messageId: m.messageId, createdAt: m.createdAt })),
          fromCurrentUser: false,
        }), isScrollBottomReached);
      }
      if (isScrollBottomReached
        && isContextMenuClosed()
        // Note: this shouldn't happen ideally, but it happens on re-rendering GroupChannelManager
        // even though the next messages and the current messages length are the same.
        // So added this condition to check if they are the same to prevent unnecessary calling scrollToBottom action
        && messages.length !== state.messages.length) {
        if (!isAutoscrollMessageOverflowToTop) {
          // The requestAnimationFrame already ensures DOM is updated
          requestAnimationFrame(() => {
            actions?.scrollToBottom(true);
          });
        } else {
          actions.setNewMessageIds(messages.map(it => it.messageId));
        }
      }
    },
    onMessagesUpdated: (messages) => {
      // Phase 2 dispatch — additive new callback. coreTs accepts this as
      // optional; no legacy code reads from it.
      runtimeDispatch(() => mapOnMessagesUpdated(messages as never));
    },
    // Phase 2 NOTE — `onCacheResult` / `onApiResult` exist in the local
    // coreTs source but not yet in published `@sendbird/uikit-tools@0.1.0`,
    // so we cannot wire them here without bumping the dependency. The
    // COLLECTION_CACHE_RESULT / COLLECTION_API_RESULT runtime events remain
    // reducer-only until a follow-up cycle ships those callbacks.
    onChannelDeleted: () => {
      runtimeDispatch(() => mapOnChannelDeleted());
      // Phase 5.1.a — channel cleared → reset unread tracking (idempotent
      // via unreadChannelUrlRef).
      dispatchChannelChanged('');
      actions.setCurrentChannel(null);
      onBackClick?.();
    },
    onCurrentUserBanned: () => {
      runtimeDispatch(() => mapOnCurrentUserBanned());
      dispatchChannelChanged('');
      actions.setCurrentChannel(null);
      onBackClick?.();
    },
    onChannelUpdated: (channel, ctx) => {
      runtimeDispatch(() => mapOnChannelUpdated(channel));
      if (ctx.source === CollectionEventSource.EVENT_CHANNEL_UNREAD
        && ctx.userIds.includes(userId)
      ) {
        actions.setReadStateChanged('unread');
      }
      if (ctx.source === CollectionEventSource.EVENT_CHANNEL_READ
        && ctx.userIds.includes(userId)
      ) {
        actions.setReadStateChanged('read');
        // Phase 5.1.a — remote read confirmation → clear local unread.
        unreadDispatch(() => ({
          type: 'READ_CONFIRMED',
          channelUrl: channel.url,
          at: Date.now(),
        }));
      }
      // Phase 5.1.a — fire CHANNEL_CHANGED only when the url actually
      // changes. dispatchChannelChanged handles its own idempotency via
      // unreadChannelUrlRef, so this is purely a perf early-out.
      dispatchChannelChanged(channel.url);
      actions.setCurrentChannel(channel);
    },
    logger: logger as any,
  });

  // Phase 5.1.a — scroll-edge → unread reducer wiring. Dispatches
  // USER_REACHED_BOTTOM / USER_LEFT_BOTTOM whenever the legacy
  // `state.isScrollBottomReached` flag flips. Runs on initial mount as
  // well (isScrollBottomReached defaults to true → fires
  // USER_REACHED_BOTTOM, which the reducer treats as a no-op when state
  // is already `clean`).
  useEffect(() => {
    if (isScrollBottomReached) {
      unreadDispatch(() => ({ type: 'USER_REACHED_BOTTOM', at: Date.now() }));
    } else {
      unreadDispatch(() => ({ type: 'USER_LEFT_BOTTOM', at: Date.now() }));
    }
  }, [isScrollBottomReached, unreadDispatch]);

  // Phase 5.2.b — Hydrate UnreadReducer from SDK state once the message
  // collection is initialized. The session-local reducer needs this
  // one-shot seed to know about pre-existing server-side unread (e.g.
  // user enters a channel where unreadMessageCount > 0). Without this,
  // consumer cut-read of firstUnreadMessage would regress (see
  // .agentic/p0-phase-5-2a/audit.md §4.1).
  //
  // Effect dependencies: re-runs on channel switch and when the message
  // collection finishes its initial fetch. CHANNEL_CHANGED (5.1.a) fires
  // earlier on switch, so the reducer is already at clean state when
  // this hydrate runs — ordering is correct.
  //
  // Pagination caveat (R-1): if messageDataSource.messages does not
  // include the anchor (myLastRead + 1) because older messages aren't
  // loaded, firstUnreadMessageId falls back to null. The badge still
  // shows server count, but no separator anchor renders until more
  // history loads. Accepted limitation for v1.
  useEffect(() => {
    if (!messageDataSource.initialized || !state.currentChannel) return;
    const channel = state.currentChannel;
    const myLastRead = channel.myLastRead ?? 0;
    const serverUnreadCount = channel.unreadMessageCount ?? 0;
    if (serverUnreadCount === 0) {
      unreadDispatch(() => ({
        type: 'CHANNEL_HYDRATED',
        channelUrl: channel.url,
        unreadCount: 0,
        firstUnreadMessageId: null,
        firstUnreadCreatedAt: null,
        unreadMessageIds: [],
        lastReadAt: myLastRead,
      }));
      return;
    }
    const unreadMessages = messageDataSource.messages.filter(
      (m: { createdAt: number; sender?: { userId?: string } }) =>
        m.createdAt > myLastRead && m.sender?.userId !== userId,
    );
    const first = unreadMessages[0];
    unreadDispatch(() => ({
      type: 'CHANNEL_HYDRATED',
      channelUrl: channel.url,
      unreadCount: serverUnreadCount,
      firstUnreadMessageId: first ? (first as { messageId: number }).messageId : null,
      firstUnreadCreatedAt: first ? (first as { createdAt: number }).createdAt : null,
      unreadMessageIds: unreadMessages.map((m) => (m as { messageId: number }).messageId),
      lastReadAt: myLastRead,
    }));
  }, [messageDataSource.initialized, state.currentChannel?.url, userId, unreadDispatch]);

  // Channel initialization
  useAsyncEffect(async () => {
    if (sdkStore.initialized && channelUrl) {
      try {
        const channel = await sdkStore.sdk.groupChannel.getChannel(channelUrl);
        // Phase 2 dispatch — additive, before legacy actions.setCurrentChannel.
        runtimeDispatch(() => mapChannelReady(channel));
        // Phase 5.1.a — fresh channel mount → reset unread tracking under
        // the new url. dispatchChannelChanged collapses repeat fires
        // through unreadChannelUrlRef (Plan §R-2, review I-1).
        dispatchChannelChanged(channel.url);
        actions.setCurrentChannel(channel);
      } catch (error) {
        // Phase 2 dispatch — additive, before legacy actions.handleChannelError.
        runtimeDispatch(() => mapChannelFailed(error));
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
      // send message
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

  // Starting point handling — skip when animated message handles scroll
  useEffect(() => {
    if (typeof startingPoint === 'number' && state.initialized && !_animatedMessageId) {
      actions.scrollToMessage(startingPoint, 0, false, false);
    }
  }, [state.initialized, startingPoint]);

  // Animated message handling — scroll + animation
  // NOTE: Depend on state.initialized so that deep-link / direct Provider usage
  // (animatedMessageId + startingPoint set on initial mount) retries after the
  // channel is initialized. Without it, scrollToMessage runs while messages are
  // empty and the starting-point effect is suppressed by !_animatedMessageId,
  // leaving the message un-scrolled and un-animated.
  useEffect(() => {
    if (_animatedMessageId && state.initialized) {
      if (typeof startingPoint === 'number') {
        // Search result click: scroll to message and animate
        actions.scrollToMessage(startingPoint, _animatedMessageId, true, false);
      } else {
        // Thread parent jump: scroll already handled by startingPoint effect, just animate
        actions.setAnimatedMessageId(_animatedMessageId);
      }
    }
  }, [_animatedMessageId, state.initialized]);

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
    autoscrollMessageOverflowToTop: autoscrollMessageOverflowToTop ?? config.autoscrollMessageOverflowToTop ?? false,
    replyType: resolvedReplyType,
    threadReplySelectType: resolvedThreadReplySelectType,
    showSearchIcon: showSearchIcon ?? config.groupChannelSettings.enableMessageSearch,
    disableMarkAsRead,
    scrollBehavior,
  }), [
    resolvedIsReactionEnabled,
    isMessageGroupingEnabled,
    isMultipleFilesMessageEnabled,
    autoscrollMessageOverflowToTop,
    resolvedReplyType,
    resolvedThreadReplySelectType,
    showSearchIcon,
    disableMarkAsRead,
    scrollBehavior,
    config.groupChannelSettings.enableMessageSearch,
    config.autoscrollMessageOverflowToTop,
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

  // Phase 5.1.b — expose the unread store to consumer subscriptions
  // (useUnreadSelector). The context value is the same store ref for
  // the lifetime of this manager mount; consumers re-render only when
  // their selector output changes (useSyncExternalStore semantics).
  return (
    <GroupChannelUnreadContext.Provider value={unreadStoreRef.current}>
      {children}
    </GroupChannelUnreadContext.Provider>
  );
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
