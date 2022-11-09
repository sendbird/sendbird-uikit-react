import React, { useReducer, useMemo, useEffect } from 'react';
import { BaseMessage, FileMessage, UserMessage } from '@sendbird/chat/message';

import { CustomUseReducerDispatcher } from '../../../lib/SendbirdState';
import { ThreadContextInitialState } from './dux/initialState';
import threadReducer from './dux/reducer';
import useGetChannel from './hooks/useGetChannel';
import threadInitialState from './dux/initialState';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import useGetParentMessage from './hooks/useGetParentMessage';
import useGetThreadList from './hooks/useGetThreadList';
import useGetPrevThreadsCallback from './hooks/useGetPrevThreadsCallback';
import useGetNextThreadsCallback from './hooks/useGetNextThreadsCallback';
import useHandleChannelEvents from './hooks/useHandleChannelEvents';
import useGetAllEmoji from './hooks/useGetAllEmoji';
import { getNicknamesMapFromMembers } from './utils';
import useToggleReactionCallback from './hooks/useToggleReactionsCallback';
import useDeleteMessageCallback from './hooks/useDeleteMessageCallback';
import { User } from '@sendbird/chat';
import useSendUserMessageCallback from './hooks/useSendUserMessageCallback';
import useSendFileMessageCallback from './hooks/useSendFileMessage';
import useHandlePubsubEvents from './hooks/useHandlePubsubEvents';
import useUpdateMessageCallback from './hooks/useUpdateMessageCallback';
import { ThreadContextActionTypes } from './dux/actionTypes';

export type ThreadContextProps = {
  children?: React.ReactElement;
  channelUrl?: string;
  message?: UserMessage | FileMessage;
  isMessageGroupingEnabled?: boolean;
}
export interface ThreadProviderInterface extends ThreadContextProps, ThreadContextInitialState {
  // hooks for fetching threads
  fetchPrevThreads: (callback?: (messages?: Array<BaseMessage>) => void) => void;
  fetchNextThreads: (callback?: (messages?: Array<BaseMessage>) => void) => void;
  toggleReaction: (message, key, isReacted) => void;
  sendMessage: (props: {
    message: UserMessage,
    quoteMessage?: UserMessage | FileMessage,
    mentionTemplate?: string,
    mentionedUsers?: Array<User>,
  }) => void;
  sendFileMessage: (file: File, quoteMessage: UserMessage | FileMessage) => void;
  updateMessage: (props, callback?: () => void) => void;
  deleteMessage: (message: UserMessage | FileMessage) => Promise<UserMessage | FileMessage>;
  nicknamesMap: Map<string, string>;
}
const ThreadContext = React.createContext<ThreadProviderInterface | null>(null);

export const ThreadProvider: React.FC<ThreadContextProps> = (props: ThreadContextProps) => {
  const {
    children,
    channelUrl,
    message,
    isMessageGroupingEnabled,
  } = props;
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
    channelStatus,
    threadListStatus,
    parentMessageInfoStatus,
    hasMorePrev,
    hasMoreNext,
    emojiContainer,
    isMuted,
    isOperator,
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
    message,
  }, { sdk, logger, threadDispatcher });
  useGetParentMessage({
    channelUrl,
    sdkInit,
    parentMessageId: message?.parentMessageId,
  }, { sdk, logger, threadDispatcher });
  useGetThreadList({
    sdkInit,
    parentMessage,
    isReactionEnabled,
    anchorMessage: message?.messageId ? message : null,
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
  }, { logger, pubSub, threadDispatcher })

  // callbacks
  const fetchPrevThreads = useGetPrevThreadsCallback({
    hasMorePrev,
    parentMessage,
    threadListStatus,
    isReactionEnabled,
    oldestMessageTimeStamp: allThreadMessages[0]?.createdAt || 0,
  }, { logger, threadDispatcher });
  const fetchNextThreads = useGetNextThreadsCallback({
    hasMoreNext,
    parentMessage,
    threadListStatus,
    isReactionEnabled,
    latestMessageTimeStamp: allThreadMessages[allThreadMessages.length - 1]?.createdAt || 0
  }, { logger, threadDispatcher });
  const toggleReaction = useToggleReactionCallback({ currentChannel }, { logger });
  const sendMessage = useSendUserMessageCallback({
    isMentionEnabled,
    currentChannel,
  }, { logger, pubSub, threadDispatcher });
  const sendFileMessage = useSendFileMessageCallback({
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
        // ThreadContextProps
        message,
        isMessageGroupingEnabled,
        // ThreadContextInitialState
        currentChannel,
        allThreadMessages,
        parentMessage,
        channelStatus,
        threadListStatus,
        parentMessageInfoStatus,
        hasMorePrev,
        hasMoreNext,
        emojiContainer,
        // hooks
        fetchPrevThreads,
        fetchNextThreads,
        toggleReaction,
        sendMessage,
        sendFileMessage,
        updateMessage,
        deleteMessage,
        // context
        nicknamesMap,
        isMuted,
        isOperator,
        isChannelFrozen,
        currentUserId,
      }}
    >
      {/* UserProfileProvider */}
      {children}
    </ThreadContext.Provider>
  );
};

export type UseThreadContextType = () => ThreadProviderInterface;
export const useThreadContext: UseThreadContextType = () => React.useContext(ThreadContext);
