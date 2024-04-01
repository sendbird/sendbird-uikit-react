import React, { useReducer, useMemo, useEffect, ReactElement } from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import type {
  BaseMessage, FileMessage,
  FileMessageCreateParams, MultipleFilesMessage,
  MultipleFilesMessageCreateParams,
  UserMessageCreateParams,
} from '@sendbird/chat/message';

import { getNicknamesMapFromMembers, getParentMessageFrom } from './utils';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
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

export type ThreadProviderProps = {
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
  // User Profile
  disableUserProfile?: boolean;
  renderUserProfile?: (props: { user: User, close: () => void }) => ReactElement;
  isMultipleFilesMessageEnabled?: boolean;
};
export interface ThreadProviderInterface extends ThreadProviderProps, ThreadContextInitialState {
  // hooks for fetching threads
  fetchPrevThreads: (callback?: (messages?: Array<BaseMessage>) => void) => void;
  fetchNextThreads: (callback?: (messages?: Array<BaseMessage>) => void) => void;
  toggleReaction: (message, key, isReacted) => void;
  sendMessage: (props: SendMessageParams) => void;
  sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>;
  sendVoiceMessage: (file: File, duration: number, quoteMessage?: SendableMessageType) => void;
  sendMultipleFilesMessage: (files: Array<File>, quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>,
  resendMessage: (failedMessage: SendableMessageType) => void;
  updateMessage: (props, callback?: () => void) => void;
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
    // User Profile
    disableUserProfile,
    renderUserProfile,
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
  const { eventHandlers } = globalStore;
  // // config
  const {
    logger,
    pubSub,
    replyType,
    isMentionEnabled,
    isReactionEnabled,
    onUserProfileMessage,
  } = config;

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
    anchorMessage: propsMessage?.messageId !== propsParentMessage?.messageId ? propsMessage : undefined,
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
    eventHandlers,
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
    eventHandlers,
    pubSub,
  });

  const resendMessage = useResendMessageCallback({
    currentChannel,
  }, { logger, eventHandlers, pubSub, threadDispatcher });
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
    (replyType && currentChannel)
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
      }}
    >
      {/* UserProfileProvider */}
      <UserProfileProvider
        disableUserProfile={disableUserProfile ?? config.disableUserProfile}
        renderUserProfile={renderUserProfile}
        onUserProfileMessage={onUserProfileMessage}
      >
        {children}
      </UserProfileProvider>
    </ThreadContext.Provider>
  );
};

export type UseThreadContextType = () => ThreadProviderInterface;
export const useThreadContext: UseThreadContextType = () => React.useContext(ThreadContext);
