import React, { useReducer, useMemo, useEffect, ReactElement } from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import type {
  BaseMessage,
  FileMessageCreateParams,
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
import useGetThreadList from './hooks/useGetThreadList';
import useGetParentMessage from './hooks/useGetParentMessage';
import useHandlePubsubEvents from './hooks/useHandlePubsubEvents';
import useHandleChannelEvents from './hooks/useHandleChannelEvents';
import useSendFileMessageCallback from './hooks/useSendFileMessage';
import useUpdateMessageCallback from './hooks/useUpdateMessageCallback';
import useDeleteMessageCallback from './hooks/useDeleteMessageCallback';
import useGetPrevThreadsCallback from './hooks/useGetPrevThreadsCallback';
import useGetNextThreadsCallback from './hooks/useGetNextThreadsCallback';
import useToggleReactionCallback from './hooks/useToggleReactionsCallback';
import useSendUserMessageCallback, { SendMessageParams } from './hooks/useSendUserMessageCallback';
import useResendMessageCallback from './hooks/useResendMessageCallback';
import useSendVoiceMessageCallback from './hooks/useSendVoiceMessageCallback';
import { SubscribedModuleType, useSendMultipleFilesMessage } from './hooks/useSendMultipleFilesMessage';
import { SendableMessageType } from '../../../utils';

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
  // User Profile
  disableUserProfile?: boolean;
  renderUserProfile?: (props: { user: User, close: () => void }) => ReactElement;
};
export interface ThreadProviderInterface extends ThreadProviderProps, ThreadContextInitialState {
  // hooks for fetching threads
  fetchPrevThreads: (callback?: (messages?: Array<BaseMessage>) => void) => void;
  fetchNextThreads: (callback?: (messages?: Array<BaseMessage>) => void) => void;
  toggleReaction: (message, key, isReacted) => void;
  sendMessage: (props: SendMessageParams) => void;
  sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => void;
  sendVoiceMessage: (file: File, duration: number, quoteMessage?: SendableMessageType) => void;
  sendMultipleFilesMessage: (files: Array<File>, quoteMessage?: SendableMessageType) => void,
  resendMessage: (failedMessage: SendableMessageType) => void;
  updateMessage: (props, callback?: () => void) => void;
  deleteMessage: (message: SendableMessageType) => Promise<SendableMessageType>;
  nicknamesMap: Map<string, string>;
}
const ThreadContext = React.createContext<ThreadProviderInterface | null>(null);

export const ThreadProvider: React.FC<ThreadProviderProps> = (props: ThreadProviderProps) => {
  const {
    children,
    channelUrl,
    onHeaderActionClick,
    onMoveToParentMessage,
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeSendVoiceMessage,
    onBeforeSendMultipleFilesMessage,
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
  useGetThreadList({
    sdkInit,
    parentMessage,
    isReactionEnabled,
    anchorMessage: propsMessage?.messageId !== propsParentMessage?.messageId ? propsMessage : null,
    // anchorMessage should be null when parentMessage doesn't exist
  }, { logger, threadDispatcher });
  useGetAllEmoji({ sdk }, { logger, threadDispatcher });
  // Handle channel events
  useHandleChannelEvents({
    sdk,
    currentChannel,
  }, { logger, threadDispatcher });
  useHandlePubsubEvents({
    sdkInit,
    currentChannel,
    parentMessage,
  }, { logger, pubSub, threadDispatcher });

  // callbacks
  const fetchPrevThreads = useGetPrevThreadsCallback({
    hasMorePrev,
    parentMessage,
    threadListState,
    isReactionEnabled,
    oldestMessageTimeStamp: allThreadMessages[0]?.createdAt || 0,
  }, { logger, threadDispatcher });
  const fetchNextThreads = useGetNextThreadsCallback({
    hasMoreNext,
    parentMessage,
    threadListState,
    isReactionEnabled,
    latestMessageTimeStamp: allThreadMessages[allThreadMessages.length - 1]?.createdAt || 0,
  }, { logger, threadDispatcher });
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
    subscribedModules: [SubscribedModuleType.THREAD],
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
  const deleteMessage = useDeleteMessageCallback({ currentChannel, threadDispatcher }, { logger });

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
        // ThreadContextInitialState
        currentChannel,
        allThreadMessages,
        parentMessage,
        channelState,
        threadListState,
        parentMessageState,
        hasMorePrev,
        hasMoreNext,
        emojiContainer,
        // hooks
        fetchPrevThreads,
        fetchNextThreads,
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
