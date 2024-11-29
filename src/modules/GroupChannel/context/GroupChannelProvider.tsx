import React, { useMemo, useEffect, useRef, createContext } from 'react';
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
import { useSendbird } from '../../../lib/Sendbird/context/hooks/useSendbird';

const initialState = {
  currentChannel: null,
  channelUrl: '',
  fetchChannelError: null,
  nicknamesMap: new Map(),

  quoteMessage: null,
  animatedMessageId: null,
  isScrollBottomReached: true,

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
} as GroupChannelState;

export const GroupChannelContext = createContext<ReturnType<typeof createStore<GroupChannelState>> | null>(null);

export const InternalGroupChannelProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const storeRef = useRef(createStore(initialState));

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
  const { markAsReadScheduler, logger, pubSub } = config;

  // ScrollHandler initialization
  const {
    scrollRef,
    scrollPubSub,
    scrollDistanceFromBottomRef,
    isScrollBottomReached,
    scrollPositionRef,
  } = useMessageListScroll(scrollBehavior, [state.currentChannel?.url]);

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

  // Message Collection setup
  const messageDataSource = useGroupChannelMessages(sdkStore.sdk, state.currentChannel!, {
    startingPoint,
    replyType: chatReplyType,
    collectionCreator: getCollectionCreator(state.currentChannel!, messageListQueryParams),
    shouldCountNewMessages: () => !isScrollBottomReached,
    markAsRead: (channels) => {
      if (isScrollBottomReached && !disableMarkAsRead) {
        channels.forEach((it) => markAsReadScheduler.push(it));
      }
    },
    onMessagesReceived: () => {
      if (isScrollBottomReached && isContextMenuClosed()) {
        setTimeout(() => actions.scrollToBottom(true), 10);
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
    onChannelUpdated: (channel) => {
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
      config.pubSub.subscribe(PUBSUB_TOPICS.SEND_USER_MESSAGE, handleExternalMessage),
      config.pubSub.subscribe(PUBSUB_TOPICS.SEND_FILE_MESSAGE, handleExternalMessage),
    ];

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, [messageDataSource.initialized, state.currentChannel?.url, pubSub?.subscribe]);

  // Starting point handling
  useEffect(() => {
    if (typeof startingPoint === 'number') {
      actions.scrollToMessage(startingPoint, 0, false, false);
    }
  }, [startingPoint]);

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
    replyType: resolvedReplyType,
    threadReplySelectType: resolvedThreadReplySelectType,
    showSearchIcon: showSearchIcon ?? config.groupChannelSettings.enableMessageSearch,
    disableMarkAsRead,
    scrollBehavior,
  }), [
    resolvedIsReactionEnabled,
    isMessageGroupingEnabled,
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

  useEffect(() => {
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
    });
  }, [
    channelUrl,
    state.currentChannel,
    messageDataSource.initialized,
    messageDataSource.loading,
    messageDataSource.messages,
    configurations,
    scrollState,
    eventHandlers,
    renderProps,
  ]);

  return children;
};

const GroupChannelProvider: React.FC<React.PropsWithChildren<GroupChannelProviderProps>> = (props) => {
  return (
    <InternalGroupChannelProvider>
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
  return useStore(GroupChannelContext, state => state, initialState);
};
/**
 * Keep this function for backward compatibility.
 */
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
