import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import type { User } from '@sendbird/chat';
import {
  ReplyType as SendbirdReplyType,
  FileMessageCreateParams,
  MultipleFilesMessageCreateParams,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { useGroupChannelMessages } from '@sendbird/uikit-tools';

import type { CoreMessageType, SendableMessageType } from '../../../utils';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { ThreadReplySelectType } from './const';

import { getIsReactionEnabled } from '../../../utils/getIsReactionEnabled';

import { RenderUserProfileProps, ReplyType } from '../../../types';
import useToggleReactionCallback from './hooks/useToggleReactionCallback';
import { getCaseResolvedThreadReplySelectType } from '../../../lib/utils/resolvedReplyType';
import useScrollToMessage from './hooks/useScrollToMessage';
import { match } from 'ts-pattern';

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

  // Message Focusing
  startingPoint?: number | null;
  animatedMessageId?: number | null; // quote or thread
  highlightedMessageId?: number | null; // message search

  // Custom
  // TODO: queries?: ChannelQueries; -> MessageCollectionFilter
  filterMessageList?(messages: CoreMessageType): boolean;
  // #Message
  onBeforeSendUserMessage?(params: UserMessageCreateParams): UserMessageCreateParams | Promise<UserMessageCreateParams>;
  onBeforeSendFileMessage?(params: FileMessageCreateParams): FileMessageCreateParams | Promise<FileMessageCreateParams>;
  onBeforeSendVoiceMessage?: (params: FileMessageCreateParams) => FileMessageCreateParams | Promise<FileMessageCreateParams>;
  onBeforeSendMultipleFilesMessage?: (params: MultipleFilesMessageCreateParams) => MultipleFilesMessageCreateParams | Promise<MultipleFilesMessageCreateParams>;
  onBeforeUpdateUserMessage?(params: UserMessageUpdateParams): UserMessageUpdateParams | Promise<UserMessageUpdateParams>;
  // #Focusing
  onMessageAnimated?: () => void;
  onMessageHighlighted?: () => void;
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
  // Memo
  currentChannel: GroupChannel | null;
  nicknamesMap: Map<string, string>;
  // Ref
  scrollRef: React.MutableRefObject<HTMLDivElement>;
  messageInputRef: React.MutableRefObject<HTMLDivElement>;
  // State
  isScrolled?: boolean;
  setIsScrolled?: React.Dispatch<React.SetStateAction<boolean>>;
  quoteMessage: SendableMessageType | null;
  setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType | null>>;
  initialTimeStamp: number;
  setInitialTimeStamp: React.Dispatch<React.SetStateAction<number>>;
  animatedMessageId: number;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
  highlightedMessageId: number;
  setHighLightedMessageId: React.Dispatch<React.SetStateAction<number>>;
  // Callback
  scrollToMessage?(createdAt: number, messageId: number): void;
  toggleReaction(message: SendableMessageType, emojiKey: string, isReacted: boolean): void,
}

const GroupChannelContext = React.createContext<GroupChannelProviderInterface>(null);

const GroupChannelProvider = (props: GroupChannelContextProps) => {
  const {
    // Default
    channelUrl,
    children,
    // Flags
    isReactionEnabled: localIsReactionEnabled,
    isMessageGroupingEnabled = true,
    isMultipleFilesMessageEnabled,
    showSearchIcon,
    replyType: localReplyType,
    threadReplySelectType,
    disableMarkAsRead = false,
    reconnectOnIdle = true,
    scrollBehavior = 'auto',
    // Message Focusing
    startingPoint,
    animatedMessageId: _animatedMessageId,
    highlightedMessageId: _highlightedMessageId,
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
    onMessageHighlighted,
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
  const {
    logger,
    userId,
    replyType: globalReplyType,
    isReactionEnabled: globalIsReactionEnabled,
    onUserProfileMessage,
    markAsReadScheduler,
    groupChannel,
  } = config;
  const { sdkStore } = stores;
  const sdk = sdkStore?.sdk;
  const sdkInit = sdkStore?.initialized;

  const replyType = localReplyType ?? globalReplyType;

  // Get current channel
  const [currentChannel, setCurrentChannel] = useState<GroupChannel | null>(null);
  const getChannel = useCallback((channelUrl) => {
    sdk.groupChannel.getChannel(channelUrl)
      .then((ch) => {
        setCurrentChannel(ch);
        if (!disableMarkAsRead) {
          markAsReadScheduler.push(ch);
        }
      })
      .catch(() => setCurrentChannel(null));
  }, [sdk.groupChannel, disableMarkAsRead]);
  useEffect(() => {
    getChannel(channelUrl);
  }, [channelUrl, sdkInit]);

  // Ref
  const scrollRef = useRef(null);
  const messageInputRef = useRef(null);

  // States
  const [initialTimeStamp, setInitialTimeStamp] = useState(startingPoint);
  const [quoteMessage, setQuoteMessage] = useState<SendableMessageType>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [animatedMessageId, setAnimatedMessageId] = useState(0);
  const [highlightedMessageId, setHighLightedMessageId] = useState(_highlightedMessageId);

  // Reset states when channel changes
  useEffect(() => {
    setQuoteMessage(null);
    setInitialTimeStamp(startingPoint);
    setAnimatedMessageId(0);
    setHighLightedMessageId(0);
  }, [channelUrl]);

  // Message Focusing
  useEffect(() => {
    setInitialTimeStamp(startingPoint);
  }, [startingPoint]);
  useEffect(() => {
    setAnimatedMessageId(_animatedMessageId);
  }, [_animatedMessageId]);
  useEffect(() => {
    setHighLightedMessageId(_highlightedMessageId);
  }, [_highlightedMessageId]);

  // Memos
  const usingReaction = useMemo(() => {
    return getIsReactionEnabled({
      isSuper: currentChannel?.isSuper ?? false,
      isBroadcast: currentChannel?.isBroadcast ?? false,
      globalLevel: globalIsReactionEnabled,
      moduleLevel: localIsReactionEnabled,
    });
  }, [
    currentChannel.isSuper,
    currentChannel.isBroadcast,
    globalIsReactionEnabled,
    localIsReactionEnabled,
  ]);
  const nicknamesMap = useMemo(() => (
    (usingReaction && currentChannel?.members.length > 0)
      ? new Map(currentChannel.members.map(({ userId, nickname }) => [userId, nickname]))
      : new Map<string, string>()
  ), [currentChannel?.members]);

  // Callbacks
  const toggleReaction = useToggleReactionCallback(currentChannel, logger);

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
  } = useGroupChannelMessages(sdk, currentChannel, userId, {
    replyType: match(replyType)
      .with('NONE', () => SendbirdReplyType.NONE)
      .with('QUOTE_REPLY', () => SendbirdReplyType.ALL)
      .with('THREAD', () => SendbirdReplyType.ALL)
      .otherwise(() => SendbirdReplyType.NONE),
    startingPoint: initialTimeStamp,
    // markAsRead?: (channels: GroupChannel[]) => void;
    // shouldCountNewMessages?: () => boolean;
    // collectionCreator?: (collectionParams?: DefaultCollectionParams) => MessageCollection;
    // onMessagesReceived?: (messages: SendbirdMessage[]) => void;
    // onMessagesUpdated?: (messages: SendbirdMessage[]) => void;
    // onChannelDeleted?: (channelUrl: string) => void;
    // onChannelUpdated?: (channel: GroupChannel) => void;
    // onCurrentUserBanned?: () => void;
    logger,
  });

  // Callbacks (using context)
  const scrollToMessage = useScrollToMessage({
    setInitialTimeStamp,
    setAnimatedMessageId,
    allMessages: messages,
    scrollRef,
  }, { logger });

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
    <GroupChannelContext.Provider value={{
      // # Props
      channelUrl,
      isReactionEnabled: usingReaction,
      isMessageGroupingEnabled,
      isMultipleFilesMessageEnabled,
      showSearchIcon: showSearchIcon ?? config.showSearchIcon,
      replyType,
      threadReplySelectType: threadReplySelectType
        ?? getCaseResolvedThreadReplySelectType(groupChannel.threadReplySelectType).upperCase
        ?? ThreadReplySelectType.THREAD,
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
      onMessageHighlighted,
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
      messageInputRef,

      isScrolled,
      setIsScrolled,
      quoteMessage,
      setQuoteMessage,
      initialTimeStamp,
      setInitialTimeStamp,
      animatedMessageId,
      setAnimatedMessageId,
      highlightedMessageId,
      setHighLightedMessageId,

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
