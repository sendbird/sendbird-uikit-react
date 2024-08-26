import React, { useReducer, useMemo, useEffect } from 'react';
import { type EmojiCategory } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import type {
  BaseMessage, FileMessage,
  FileMessageCreateParams, MultipleFilesMessage,
  MultipleFilesMessageCreateParams,
  UserMessageCreateParams,
} from '@sendbird/chat/message';

import { getNicknamesMapFromMembers, getParentMessageFrom } from './utils';
import { UserProfileProvider, UserProfileProviderProps } from '../../../lib/UserProfileContext';
import { CustomUseReducerDispatcher } from '../../../lib/SendbirdState';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';

import threadReducer from './dux/reducer';
import { ThreadContextActionTypes } from './dux/actionTypes';
import threadInitialState, { ThreadContextInitialState } from './dux/initialState';

import useGetChannel from './hooks/useGetChannel';
import useGetAllEmoji from './hooks/useGetAllEmoji';
import useGetParentMessage from './hooks/useGetParentMessage';
import useHandleThreadPubsubEvents from './hooks/useHandleThreadPubsubEvents';
import useHandleChannelEvents from './hooks/useHandleChannelEvents';
import useSendFileMessageCallback from './hooks/useSendFileMessage';
import useUpdateMessageCallback from './hooks/useUpdateMessageCallback';
import useDeleteMessageCallback from './hooks/useDeleteMessageCallback';
import useToggleReactionCallback from './hooks/useToggleReactionsCallback';
import useSendUserMessageCallback, { SendMessageParams } from './hooks/useSendUserMessageCallback';
import useResendMessageCallback from './hooks/useResendMessageCallback';
import useSendVoiceMessageCallback from './hooks/useSendVoiceMessageCallback';
import { PublishingModuleType, useSendMultipleFilesMessage } from './hooks/useSendMultipleFilesMessage';
import { SendableMessageType } from '../../../utils';
import { useThreadFetchers } from './hooks/useThreadFetchers';
import type { OnBeforeDownloadFileMessageType } from '../../GroupChannel/context/GroupChannelProvider';
import { useMessageLayoutDirection } from '../../../hooks/useHTMLTextDirection';

export interface ThreadProviderProps extends
  Pick<UserProfileProviderProps, 'disableUserProfile' | 'renderUserProfile'> {
  children?: React.ReactElement;
  channelUrl: string;
  message: SendableMessageType | null;
  onHeaderActionClick?: () => void;
  onMoveToParentMessage?: (props: { message: SendableMessageType, channel: GroupChannel }) => void;
  onBeforeSendUserMessage?: (message: string, quotedMessage?: SendableMessageType) => UserMessageCreateParams;
  onBeforeSendFileMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
  onBeforeSendVoiceMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
  onBeforeSendMultipleFilesMessage?: (files: Array<File>, quotedMessage?: SendableMessageType) => MultipleFilesMessageCreateParams;
  onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;
  isMultipleFilesMessageEnabled?: boolean;
  filterEmojiCategoryIds?: (message: SendableMessageType) => EmojiCategory['id'][];
}
export interface ThreadProviderInterface extends ThreadProviderProps, ThreadContextInitialState {
  // hooks for fetching threads
  fetchPrevThreads: (callback?: (messages?: Array<BaseMessage>) => void) => void;
  fetchNextThreads: (callback?: (messages?: Array<BaseMessage>) => void) => void;
  toggleReaction: ReturnType<typeof useToggleReactionCallback>;
  sendMessage: (props: SendMessageParams) => void;
  sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>;
  sendVoiceMessage: ReturnType<typeof useSendVoiceMessageCallback>;
  sendMultipleFilesMessage: (files: Array<File>, quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>,
  resendMessage: (failedMessage: SendableMessageType) => void;
  updateMessage: ReturnType<typeof useUpdateMessageCallback>;
  deleteMessage: (message: SendableMessageType) => Promise<void>;
  nicknamesMap: Map<string, string>;
}
const ThreadContext = React.createContext<ThreadProviderInterface | null>(null);

export const ThreadProvider = (props: ThreadProviderProps) => {
  const {
    children,
    channelUrl,
    onHeaderActionClick,
    onMoveToParentMessage,
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeSendVoiceMessage,
    onBeforeSendMultipleFilesMessage,
    onBeforeDownloadFileMessage,
    isMultipleFilesMessageEnabled,
    filterEmojiCategoryIds,
  } = props;
  const propsMessage = props?.message;
  const propsParentMessage = getParentMessageFrom(propsMessage);
  // Context from SendbirdProvider
  const globalStore = useSendbirdStateContext();
  const { stores, config } = globalStore;
  // // stores
  const { sdkStore, userStore } = stores;
  const { sdk } = sdkStore;
  const { user } = userStore;
  const sdkInit = sdkStore?.initialized;
  // // config
  const { logger, pubSub, htmlTextDirection, forceLeftToRightMessageLayout } = config;

  const isMentionEnabled = config.groupChannel.enableMention;
  const isReactionEnabled = config.groupChannel.enableReactions;

  // dux of Thread
  const [threadStore, threadDispatcher] = useReducer(
    threadReducer,
    threadInitialState,
  ) as [ThreadContextInitialState, CustomUseReducerDispatcher];
  const {
    currentChannel,
    allThreadMessages,
    localThreadMessages,
    parentMessage,
    channelState,
    threadListState,
    parentMessageState,
    hasMorePrev,
    hasMoreNext,
    emojiContainer,
    isMuted,
    isChannelFrozen,
    currentUserId,
    typingMembers,
  }: ThreadContextInitialState = threadStore;

  // Initialization
  useEffect(() => {
    threadDispatcher({
      type: ThreadContextActionTypes.INIT_USER_ID,
      payload: user?.userId,
    });
  }, [user]);
  useGetChannel({
    channelUrl,
    sdkInit,
    message: propsMessage,
  }, { sdk, logger, threadDispatcher });
  useGetParentMessage({
    channelUrl,
    sdkInit,
    parentMessage: propsParentMessage,
  }, { sdk, logger, threadDispatcher });
  useGetAllEmoji({ sdk }, { logger, threadDispatcher });
  // Handle channel events
  useHandleChannelEvents({
    sdk,
    currentChannel,
  }, { logger, threadDispatcher });
  useHandleThreadPubsubEvents({
    sdkInit,
    currentChannel,
    parentMessage,
  }, { logger, pubSub, threadDispatcher });

  const { initialize, loadPrevious, loadNext } = useThreadFetchers({
    parentMessage,
    // anchorMessage should be null when parentMessage doesn't exist
    anchorMessage: propsMessage?.messageId !== propsParentMessage?.messageId ? propsMessage || undefined : undefined,
    logger,
    isReactionEnabled,
    threadDispatcher,
    threadListState,
    oldestMessageTimeStamp: allThreadMessages[0]?.createdAt || 0,
    latestMessageTimeStamp: allThreadMessages[allThreadMessages.length - 1]?.createdAt || 0,
  });

  useEffect(() => {
    if (stores.sdkStore.initialized && config.isOnline) {
      initialize();
    }
  }, [stores.sdkStore.initialized, config.isOnline, initialize]);

  useMessageLayoutDirection(
    htmlTextDirection,
    forceLeftToRightMessageLayout,
    // we're assuming that if the thread message list is empty, it's in the loading state
    allThreadMessages.length === 0,
  );

  const toggleReaction = useToggleReactionCallback({ currentChannel }, { logger });

  // Send Message Hooks
  const sendMessage = useSendUserMessageCallback({
    isMentionEnabled,
    currentChannel,
    onBeforeSendUserMessage,
  }, {
    logger,
    pubSub,
    threadDispatcher,
  });
  const sendFileMessage = useSendFileMessageCallback({
    currentChannel,
    onBeforeSendFileMessage,
  }, {
    logger,
    pubSub,
    threadDispatcher,
  });
  const sendVoiceMessage = useSendVoiceMessageCallback({
    currentChannel,
    onBeforeSendVoiceMessage,
  }, {
    logger,
    pubSub,
    threadDispatcher,
  });
  const [sendMultipleFilesMessage] = useSendMultipleFilesMessage({
    currentChannel,
    onBeforeSendMultipleFilesMessage,
    publishingModules: [PublishingModuleType.THREAD],
  }, {
    logger,
    pubSub,
  });

  const resendMessage = useResendMessageCallback({
    currentChannel,
  }, { logger, pubSub, threadDispatcher });
  const updateMessage = useUpdateMessageCallback({
    currentChannel,
    isMentionEnabled,
  }, { logger, pubSub, threadDispatcher });
  const deleteMessage = useDeleteMessageCallback(
    { currentChannel, threadDispatcher },
    { logger },
  );

  // memo
  const nicknamesMap: Map<string, string> = useMemo(() => (
    (config.groupChannel.replyType !== 'none' && currentChannel)
      ? getNicknamesMapFromMembers(currentChannel?.members)
      : new Map()
  ), [currentChannel?.members]);

  return (
    <ThreadContext.Provider
      value={{
        // ThreadProviderProps
        channelUrl,
        message: propsMessage,
        onHeaderActionClick,
        onMoveToParentMessage,
        isMultipleFilesMessageEnabled,
        onBeforeDownloadFileMessage,
        // ThreadContextInitialState
        currentChannel,
        allThreadMessages,
        localThreadMessages,
        parentMessage,
        channelState,
        threadListState,
        parentMessageState,
        hasMorePrev,
        hasMoreNext,
        emojiContainer,
        // hooks
        fetchPrevThreads: loadPrevious,
        fetchNextThreads: loadNext,
        toggleReaction,
        sendMessage,
        sendFileMessage,
        sendVoiceMessage,
        sendMultipleFilesMessage,
        resendMessage,
        updateMessage,
        deleteMessage,
        // context
        nicknamesMap,
        isMuted,
        isChannelFrozen,
        currentUserId,
        typingMembers,
        filterEmojiCategoryIds,
      }}
    >
      {/* UserProfileProvider */}
      <UserProfileProvider {...props}>
        {children}
      </UserProfileProvider>
    </ThreadContext.Provider>
  );
};

export const useThreadContext = () => {
  const context = React.useContext(ThreadContext);
  if (!context) throw new Error('ThreadContext not found. Use within the Thread module');
  return context;
};
