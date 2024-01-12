import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { User } from '@sendbird/chat';
import {
  BaseMessageCreateParams,
  FileMessage,
  FileMessageCreateParams,
  MessageMetaArray,
  MultipleFilesMessage,
  MultipleFilesMessageCreateParams,
  ReplyType as ChatReplyType,
  UserMessage,
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
import { getMessageTopOffset, isContextMenuClosed } from './utils';
import {
  META_ARRAY_MESSAGE_TYPE_KEY,
  META_ARRAY_MESSAGE_TYPE_VALUE__VOICE,
  META_ARRAY_VOICE_DURATION_KEY,
  VOICE_MESSAGE_FILE_NAME,
  VOICE_MESSAGE_MIME_TYPE,
} from '../../../utils/consts';
import { useOnScrollPositionChangeDetectorWithRef } from '../../../hooks/useOnScrollReachedEndDetector';
import { useMessageListScroll } from './hooks/useMessageListScroll';
import PUBSUB_TOPICS, { PubSubSendMessagePayload } from '../../../lib/pubSub/topics';

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

type MessageCollectionHookValues = Pick<
  ReturnType<typeof useGroupChannelMessages>,
  | 'initialized'
  | 'loading'
  | 'refreshing'
  | 'messages'
  | 'newMessages'
  | 'refresh'
  | 'loadNext'
  | 'hasNext'
  | 'loadPrevious'
  | 'hasPrevious'
  | 'resendMessage'
  | 'deleteMessage'
  | 'resetNewMessages'
  | 'resetWithStartingPoint'
>;
interface MessagesStateAndActions extends MessageCollectionHookValues {
  sendUserMessage: (params: UserMessageCreateParams) => Promise<UserMessage>;
  sendFileMessage: (params: FileMessageCreateParams) => Promise<FileMessage>;
  sendVoiceMessage: (params: FileMessageCreateParams, duration: number) => Promise<FileMessage>;
  sendMultipleFilesMessage: (params: MultipleFilesMessageCreateParams) => Promise<MultipleFilesMessage>;
  updateUserMessage: (messageId: number, params: UserMessageUpdateParams) => Promise<UserMessage>;
}

export interface GroupChannelProviderInterface extends GroupChannelContextProps, MessagesStateAndActions {
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
  const { logger, onUserProfileMessage, markAsReadScheduler } = config;

  // State
  const [quoteMessage, setQuoteMessage] = useState<SendableMessageType>(null);
  const [animatedMessageId, setAnimatedMessageId] = useState(0);
  const [currentChannel, setCurrentChannel] = useState<GroupChannel | null>(null);

  // Ref
  const { scrollRef, scrollPubSub, scrollDistanceFromBottomRef, isScrollBottomReached, setIsScrollBottomReached } = useMessageListScroll();
  const messageInputRef = useRef(null);

  const toggleReaction = useToggleReactionCallback(currentChannel, logger);
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

  const messageDataSource = useGroupChannelMessages(sdkStore.sdk, currentChannel, {
    replyType: chatReplyType,
    startingPoint,
    shouldCountNewMessages: () => !isScrollBottomReached,
    markAsRead: (channels) => {
      if (!disableMarkAsRead && isScrollBottomReached) {
        channels.forEach((it) => markAsReadScheduler.push(it));
      }
    },
    onMessagesReceived: () => {
      if (isScrollBottomReached && isContextMenuClosed()) {
        scrollPubSub.publish('scrollToBottom', null);
      }
    },
    onChannelDeleted: () => setCurrentChannel(null),
    onCurrentUserBanned: () => setCurrentChannel(null),
    onChannelUpdated: (channel) => setCurrentChannel(channel),
    logger,
    // collectionCreator?: (collectionParams?: DefaultCollectionParams) => MessageCollection,
  });

  const preventDuplicateRequest = usePreventDuplicateRequest();
  useOnScrollPositionChangeDetectorWithRef(scrollRef, {
    async onReachedTop() {
      preventDuplicateRequest.lock();

      await preventDuplicateRequest.run(async () => {
        if (!messageDataSource.hasPrevious()) return;

        const prevViewInfo = { scrollTop: scrollRef.current.scrollTop, scrollHeight: scrollRef.current.scrollHeight };
        await messageDataSource.loadPrevious();

        setTimeout(() => {
          const nextViewInfo = { scrollHeight: scrollRef.current.scrollHeight };
          const viewUpdated = prevViewInfo.scrollHeight < nextViewInfo.scrollHeight;

          if (viewUpdated) {
            const bottomOffset = prevViewInfo.scrollHeight - prevViewInfo.scrollTop;
            scrollPubSub.publish('scroll', { top: nextViewInfo.scrollHeight - bottomOffset, lazy: false });
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
            scrollPubSub.publish('scroll', { top: prevViewInfo.scrollTop, lazy: false });
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
      } catch {
        setCurrentChannel(null);
      } finally {
        // Reset states when channel changes
        setQuoteMessage(null);
        setAnimatedMessageId(0);
      }
    }
  }, [sdkStore.initialized, sdkStore.sdk, channelUrl]);

  // SideEffect: Scroll to the bottom
  //  - On the initialized message list
  //  - On messages sent from the thread
  useLayoutEffect(() => {
    if (messageDataSource.initialized) {
      scrollPubSub.publish('scrollToBottom', null);
    }

    const onSentMessageFromOtherModule = (data: PubSubSendMessagePayload) => {
      if (data.channel.url === channelUrl) scrollPubSub.publish('scrollToBottom', null);
    };
    const subscribes = [
      config.pubSub.subscribe(PUBSUB_TOPICS.SEND_USER_MESSAGE, onSentMessageFromOtherModule),
      config.pubSub.subscribe(PUBSUB_TOPICS.SEND_FILE_MESSAGE, onSentMessageFromOtherModule),
    ];
    return () => {
      subscribes.forEach((subscribe) => subscribe.remove());
    };
  }, [messageDataSource.initialized, channelUrl]);

  // SideEffect: Reset MessageCollection with startingPoint prop.
  useEffect(() => {
    if (typeof startingPoint === 'number') {
      // We do not handle animation for message search here.
      // Please update the animatedMessageId prop to trigger the animation.
      scrollToMessage(startingPoint, 0, false);
    }
  }, [startingPoint]);

  // SideEffect: Update animatedMessageId prop to state.
  useEffect(() => {
    if (_animatedMessageId) setAnimatedMessageId(_animatedMessageId);
  }, [_animatedMessageId]);

  const scrollToBottom = usePreservedCallback(async () => {
    if (!scrollRef.current) return;

    setAnimatedMessageId(0);
    setIsScrollBottomReached(true);

    if (messageDataSource.hasNext()) {
      await messageDataSource.resetWithStartingPoint(Number.MAX_SAFE_INTEGER);
      scrollPubSub.publish('scrollToBottom', null);
    } else {
      scrollPubSub.publish('scrollToBottom', null);
    }

    if (currentChannel && !messageDataSource.hasNext()) {
      messageDataSource.resetNewMessages();
      if (!disableMarkAsRead) markAsReadScheduler.push(currentChannel);
    }
  });

  const scrollToMessage = usePreservedCallback(async (createdAt: number, messageId: number, animated = true) => {
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
    const message = messageDataSource.messages.find((it) => it.messageId === messageId || it.createdAt === createdAt);
    if (message) {
      const topOffset = getMessageTopOffset(message.createdAt);
      if (topOffset) scrollPubSub.publish('scroll', { top: topOffset });

      // scrollToRenderedMessage(scrollRef, message.createdAt);
      // scrollDistanceFromBottomRef.current = getDistanceFromBottom(scrollRef.current);
      if (animated) setAnimatedMessageId(messageId);
    } else {
      await messageDataSource.resetWithStartingPoint(createdAt);
      setTimeout(() => {
        const topOffset = getMessageTopOffset(createdAt);
        if (topOffset) scrollPubSub.publish('scroll', { top: topOffset, lazy: false });
        if (animated) setAnimatedMessageId(messageId);
      });
    }

    clickHandler.activate();
  });

  const messageActions = useCustomMessageActions({ ...props, ...messageDataSource, scrollToBottom, quoteMessage });

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
        ...messageDataSource,
        ...messageActions,
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

const pass = <T, >(value: T) => value;

function useCustomMessageActions(
  params: GroupChannelContextProps &
    ReturnType<typeof useGroupChannelMessages> & {
      scrollToBottom(): void;
      quoteMessage?: SendableMessageType;
    },
) {
  const {
    onBeforeSendUserMessage = pass,
    onBeforeSendFileMessage = pass,
    onBeforeUpdateUserMessage = pass,
    onBeforeSendVoiceMessage = pass,
    onBeforeSendMultipleFilesMessage = pass,

    sendFileMessage,
    sendMultipleFilesMessage,
    sendUserMessage,
    updateUserMessage,

    quoteMessage,
    scrollToBottom,
  } = params;

  function buildInternalMessageParams<T extends BaseMessageCreateParams>(basicParams: T): T {
    const messageParams = { ...basicParams } as T;

    if (params.quoteMessage) {
      messageParams.isReplyToChannel = true;
      messageParams.parentMessageId = quoteMessage.messageId;
    }

    // TODO: check isMentionEnabled should be handled here.
    //  if (!isMentionEnabled) {
    //    delete internalParams['mentionedUserIds'];
    //    delete internalParams['mentionedUsers'];
    //    delete internalParams['mentionedMessageTemplate'];
    //  }

    return messageParams;
  }

  return {
    sendUserMessage: usePreservedCallback(async (params: UserMessageCreateParams) => {
      const internalParams = buildInternalMessageParams<UserMessageCreateParams>(params);
      const processedParams = await onBeforeSendUserMessage(internalParams);

      return sendUserMessage(processedParams, () => scrollToBottom());
    }),
    sendFileMessage: usePreservedCallback(async (params: FileMessageCreateParams) => {
      const internalParams = buildInternalMessageParams<FileMessageCreateParams>(params);
      const processedParams = await onBeforeSendFileMessage(internalParams);

      return sendFileMessage(processedParams, () => scrollToBottom());
    }),
    sendMultipleFilesMessage: usePreservedCallback(async (params: MultipleFilesMessageCreateParams) => {
      const internalParams = buildInternalMessageParams<MultipleFilesMessageCreateParams>(params);
      const processedParams = await onBeforeSendMultipleFilesMessage(internalParams);

      return sendMultipleFilesMessage(processedParams, () => scrollToBottom());
    }),
    sendVoiceMessage: usePreservedCallback(async (params: FileMessageCreateParams, duration: number) => {
      const internalParams = buildInternalMessageParams<FileMessageCreateParams>({
        ...params,
        fileName: VOICE_MESSAGE_FILE_NAME,
        mimeType: VOICE_MESSAGE_MIME_TYPE,
        metaArrays: [
          new MessageMetaArray({
            key: META_ARRAY_VOICE_DURATION_KEY,
            value: [`${duration}`],
          }),
          new MessageMetaArray({
            key: META_ARRAY_MESSAGE_TYPE_KEY,
            value: [META_ARRAY_MESSAGE_TYPE_VALUE__VOICE],
          }),
        ],
      });
      const processedParams = await onBeforeSendVoiceMessage(internalParams);

      return sendFileMessage(processedParams, () => scrollToBottom());
    }),
    updateUserMessage: usePreservedCallback(async (messageId: number, params: UserMessageUpdateParams) => {
      const internalParams = buildInternalMessageParams<UserMessageUpdateParams>(params);
      const processedParams = await onBeforeUpdateUserMessage(internalParams);

      return updateUserMessage(messageId, processedParams);
    }),
  };
}

const usePreventDuplicateRequest = () => {
  const context = useRef({ locked: false, count: 0 }).current;

  return {
    lock() {
      context.locked = true;
    },
    async run(callback: any) {
      if (context.locked && context.count > 0) return;

      try {
        context.count++;
        await callback();
      } catch {
        // noop
      }
    },
    release() {
      context.locked = false;
      context.count = 0;
    },
  };
};

export type UseGroupContextChannelType = () => GroupChannelProviderInterface;
const useGroupChannelContext: UseGroupContextChannelType = () => React.useContext(GroupChannelContext);

export { GroupChannelProvider, useGroupChannelContext };
