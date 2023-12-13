import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { scrollToRenderedMessage } from './utils';
import {
  META_ARRAY_MESSAGE_TYPE_KEY,
  META_ARRAY_MESSAGE_TYPE_VALUE__VOICE,
  META_ARRAY_VOICE_DURATION_KEY,
  VOICE_MESSAGE_FILE_NAME,
  VOICE_MESSAGE_MIME_TYPE,
} from '../../../utils/consts';
import { useOnScrollPositionChangeDetectorWithRef } from '../../../hooks/useOnScrollReachedEndDetector';

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

  const messageCollectionHook = useGroupChannelMessages(sdkStore.sdk, currentChannel, {
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

      messageCollectionHook.loadPrevious();
    },
    onInBetween({ distanceFromBottom }) {
      setIsScrollBottomReached(false);
      scrollDistanceFromBottomRef.current = distanceFromBottom;
    },
    onReachedBottom({ distanceFromBottom }) {
      setIsScrollBottomReached(true);
      scrollDistanceFromBottomRef.current = distanceFromBottom;

      messageCollectionHook.loadNext();
    },
  });

  useEffect(() => {
    if (_animatedMessageId) setAnimatedMessageId(_animatedMessageId);
  }, [_animatedMessageId]);

  const scrollToBottom = usePreservedCallback(() => {
    setAnimatedMessageId(0);
    setIsScrollBottomReached(true);

    if (messageCollectionHook.hasNext()) {
      messageCollectionHook.resetWithStartingPoint(Number.MAX_SAFE_INTEGER, () => {
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
    const message = messageCollectionHook.messages.find((it) => it.messageId === messageId);
    if (message) {
      if (animated) setAnimatedMessageId(messageId);
      scrollToRenderedMessage(scrollRef, message.createdAt);
    } else {
      messageCollectionHook.resetWithStartingPoint(createdAt, () => {
        if (animated) setAnimatedMessageId(messageId);
        scrollToRenderedMessage(scrollRef, message.createdAt);
      });
    }

    clickHandler.activate();
  });

  const messageActions = useCustomMessageActions({ ...props, ...messageCollectionHook, scrollToBottom, quoteMessage });

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
        ...messageCollectionHook,
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

const pass = <T,>(value: T) => value;

function useCustomMessageActions(
  params: GroupChannelContextProps &
    ReturnType<typeof useGroupChannelMessages> & {
      scrollToBottom(): void;
      quoteMessage?: SendableMessageType;
    }
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

    return messageParams;
  }

  return {
    sendUserMessage: usePreservedCallback(async (params: UserMessageCreateParams) => {
      const internalParams = buildInternalMessageParams<UserMessageCreateParams>(params);
      const processedParams = await onBeforeSendUserMessage(internalParams);

      // TODO: check isMentionEnabled should be handled here.
      //  if (!isMentionEnabled) {
      //    delete internalParams['mentionedUserIds'];
      //    delete internalParams['mentionedUsers'];
      //    delete internalParams['mentionedMessageTemplate'];
      //  }

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

      // TODO: check isMentionEnabled should be handled here.
      //  if (!isMentionEnabled) {
      //    delete internalParams['mentionedUserIds'];
      //    delete internalParams['mentionedUsers'];
      //    delete internalParams['mentionedMessageTemplate'];
      //  }

      const processedParams = await onBeforeUpdateUserMessage(internalParams);
      return updateUserMessage(messageId, processedParams);
    }),
  };
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
