import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useContext, useMemo } from 'react';
import { ThreadContext, ThreadState } from './ThreadProvider';
import { ChannelStateTypes, FileUploadInfoParams, ParentMessageStateTypes, ThreadListStateTypes } from '../types';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { CoreMessageType, SendableMessageType } from '../../../utils';
import { EmojiContainer, User } from '@sendbird/chat';
import { compareIds } from './utils';
import { BaseMessage, MultipleFilesMessage, ReactionEvent, UserMessage } from '@sendbird/chat/message';
import { NEXT_THREADS_FETCH_SIZE, PREV_THREADS_FETCH_SIZE } from '../consts';
import useToggleReactionCallback from './hooks/useToggleReactionsCallback';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import useSendUserMessageCallback from './hooks/useSendUserMessageCallback';
import useSendFileMessageCallback from './hooks/useSendFileMessage';
import useSendVoiceMessageCallback from './hooks/useSendVoiceMessageCallback';
import { useSendMultipleFilesMessage } from '../../Channel/context/hooks/useSendMultipleFilesMessage';
import { PublishingModuleType } from '../../internalInterfaces';
import useResendMessageCallback from './hooks/useResendMessageCallback';
import useUpdateMessageCallback from './hooks/useUpdateMessageCallback';
import useDeleteMessageCallback from './hooks/useDeleteMessageCallback';
import { useThreadFetchers } from './hooks/useThreadFetchers';

function hasReqId<T extends object>(
  message: T,
): message is T & { reqId: string } {
  return 'reqId' in message;
}

const useThread = () => {
  const store = useContext(ThreadContext);
  if (!store) throw new Error('useCreateChannel must be used within a CreateChannelProvider');

  // SendbirdStateContext config
  const { config } = useSendbirdStateContext();
  const { logger, pubSub } = config;
  const isMentionEnabled = config.groupChannel.enableMention;
  const isReactionEnabled = config.groupChannel.enableReactions;

  const state: ThreadState = useSyncExternalStore(store.subscribe, store.getState);

  const {
    initialize: initializeThreadFetcher,
    loadPrevious: fetchPrevThreads,
    loadNext: fetchNextThreads,
  } = useThreadFetchers({
    parentMessage: state.parentMessage,
    // anchorMessage should be null when parentMessage doesn't exist
    anchorMessage: state.message?.messageId !== state.parentMessage?.messageId ? state.message || undefined : undefined,
    logger,
    isReactionEnabled,
    threadListState: state.threadListState,
    oldestMessageTimeStamp: state.allThreadMessages[0]?.createdAt || 0,
    latestMessageTimeStamp: state.allThreadMessages[state.allThreadMessages.length - 1]?.createdAt || 0,
  });

  const actions = useMemo(() => ({
    setCurrentUserId: (currentUserId: string) => store.setState(state => ({
      ...state,
      currentUserId: currentUserId,
    })),

    toggleReaction: useToggleReactionCallback({ currentChannel: state.currentChannel }, { logger }),

    sendMessage: useSendUserMessageCallback({
      isMentionEnabled: isMentionEnabled,
      currentChannel: state.currentChannel,
      onBeforeSendUserMessage: state.onBeforeSendUserMessage,
    }, {
      logger,
      pubSub,
    }),

    sendFileMessage: useSendFileMessageCallback({
      currentChannel: state.currentChannel,
      onBeforeSendFileMessage: state.onBeforeSendFileMessage,
    }, {
      logger,
      pubSub,
    }),

    sendVoiceMessage: useSendVoiceMessageCallback({
      currentChannel: state.currentChannel,
      onBeforeSendVoiceMessage: state.onBeforeSendVoiceMessage,
    }, {
      logger,
      pubSub,
    }),

    sendMultipleFilesMessage: useSendMultipleFilesMessage({
      currentChannel: state.currentChannel,
      onBeforeSendMultipleFilesMessage: state.onBeforeSendMultipleFilesMessage,
      publishingModules: [PublishingModuleType.THREAD],
    }, {
      logger,
      pubSub,
    })[0],

    resendMessage: useResendMessageCallback({
      currentChannel: state.currentChannel,
    }, { logger, pubSub }),

    updateMessage: useUpdateMessageCallback({
      currentChannel: state.currentChannel,
      isMentionEnabled,
    }, { logger, pubSub }),

    deleteMessage: useDeleteMessageCallback(
      { currentChannel: state.currentChannel },
      { logger },
    ),

    initializeThreadFetcher: initializeThreadFetcher,

    fetchPrevThreads: fetchPrevThreads,

    fetchNextThreads: fetchNextThreads,

    getChannelStart: () => store.setState(state => ({
      ...state,
      channelState: ChannelStateTypes.LOADING,
      currentChannel: null,
    })),

    getChannelSuccess: (groupChannel: GroupChannel) => store.setState(state => ({
      ...state,
      channelState: ChannelStateTypes.INITIALIZED,
      currentChannel: groupChannel,
      // only support in normal group channel
      isMuted: groupChannel?.members?.find((member) => member?.userId === state.currentUserId)?.isMuted || false,
      isChannelFrozen: groupChannel?.isFrozen || false,
    })),

    getChannelFailure: () => store.setState(state => ({
      ...state,
      channelState: ChannelStateTypes.INVALID,
      currentChannel: null,
    })),

    getParentMessageStart: () => store.setState(state => ({
      ...state,
      parentMessageState: ParentMessageStateTypes.LOADING,
      parentMessage: null,
    })),

    getParentMessageSuccess: (parentMessage: SendableMessageType) => store.setState(state => ({
      ...state,
      parentMessageState: ParentMessageStateTypes.INITIALIZED,
      parentMessage: parentMessage,
    })),

    getParentMessageFailure: () => store.setState(state => ({
      ...state,
      parentMessageState: ParentMessageStateTypes.INVALID,
      parentMessage: null,
    })),

    setEmojiContainer: (emojiContainer: EmojiContainer) => store.setState(state => ({
      ...state,
      emojiContainer: emojiContainer,
    })),

    onMessageReceived: (channel: GroupChannel, message: SendableMessageType) => store.setState(state => {
      if (
        state.currentChannel?.url !== channel?.url
        || state.hasMoreNext
        || message?.parentMessage?.messageId !== state?.parentMessage?.messageId
      ) {
        return state;
      }

      const isAlreadyReceived = state.allThreadMessages.findIndex((m) => (
        m.messageId === message.messageId
      )) > -1;

      return {
        ...state,
        parentMessage: state.parentMessage?.messageId === message?.messageId ? message : state.parentMessage,
        allThreadMessages: isAlreadyReceived
          ? state.allThreadMessages.map((m) => (
            m.messageId === message.messageId ? message : m
          ))
          : [
            ...state.allThreadMessages.filter((m) => (m as SendableMessageType)?.reqId !== message?.reqId),
            message,
          ],
      };
    }),

    onMessageUpdated: (channel: GroupChannel, message: SendableMessageType) => store.setState(state => {
      if (state.currentChannel?.url !== channel?.url) {
        return state;
      }

      return {
        ...state,
        parentMessage: state.parentMessage?.messageId === message?.messageId
          ? message
          : state.parentMessage,
        allThreadMessages: state.allThreadMessages?.map((msg) => (
          (msg?.messageId === message?.messageId) ? message : msg
        )),
      };
    }),

    onMessageDeleted: (channel: GroupChannel, messageId: number) => store.setState(state => {
      if (state.currentChannel?.url !== channel?.url) {
        return state;
      }
      if (state?.parentMessage?.messageId === messageId) {
        return {
          ...state,
          parentMessage: null,
          parentMessageState: ParentMessageStateTypes.NIL,
          allThreadMessages: [],
        };
      }
      return {
        ...state,
        allThreadMessages: state.allThreadMessages?.filter((msg) => (
          msg?.messageId !== messageId
        )),
        localThreadMessages: state.localThreadMessages?.filter((msg) => (
          msg?.messageId !== messageId
        )),
      };
    }),

    onMessageDeletedByReqId: (reqId: string | number) => store.setState(state => {
      return {
        ...state,
        localThreadMessages: state.localThreadMessages.filter((m) => (
          !compareIds((m as SendableMessageType).reqId, reqId)
        )),
      };
    }),

    onReactionUpdated: (reactionEvent: ReactionEvent) => store.setState(state => {
      if (state?.parentMessage?.messageId === reactionEvent?.messageId) {
        state.parentMessage?.applyReactionEvent?.(reactionEvent);
      }
      return {
        ...state,
        allThreadMessages: state.allThreadMessages.map((m) => {
          if (reactionEvent?.messageId === m?.messageId) {
            m?.applyReactionEvent?.(reactionEvent);
            return m;
          }
          return m;
        }),
      };
    }),

    onUserMuted: (channel: GroupChannel, user: User) => store.setState(state => {
      if (state.currentChannel?.url !== channel?.url || state.currentUserId !== user?.userId) {
        return state;
      }
      return {
        ...state,
        isMuted: true,
      };
    }),

    onUserUnmuted: (channel: GroupChannel, user: User) => store.setState(state => {
      if (state.currentChannel?.url !== channel?.url || state.currentUserId !== user?.userId) {
        return state;
      }
      return {
        ...state,
        isMuted: false,
      };
    }),

    onUserBanned: () => store.setState(state => {
      return {
        ...state,
        channelState: ChannelStateTypes.NIL,
        threadListState: ThreadListStateTypes.NIL,
        parentMessageState: ParentMessageStateTypes.NIL,
        currentChannel: null,
        parentMessage: null,
        allThreadMessages: [],
        hasMorePrev: false,
        hasMoreNext: false,
      };
    }),

    onUserUnbanned: () => store.setState(state => {
      return {
        ...state,
      };
    }),

    onUserLeft: () => store.setState(state => {
      return {
        ...state,
        channelState: ChannelStateTypes.NIL,
        threadListState: ThreadListStateTypes.NIL,
        parentMessageState: ParentMessageStateTypes.NIL,
        currentChannel: null,
        parentMessage: null,
        allThreadMessages: [],
        hasMorePrev: false,
        hasMoreNext: false,
      };
    }),

    onChannelFrozen: () => store.setState(state => {
      return {
        ...state,
        isChannelFrozen: true,
      };
    }),

    onChannelUnfrozen: () => store.setState(state => {
      return {
        ...state,
        isChannelFrozen: false,
      };
    }),

    onOperatorUpdated: (channel: GroupChannel) => store.setState(state => {
      if (channel?.url === state.currentChannel?.url) {
        return {
          ...state,
          currentChannel: channel,
        };
      }
      return state;
    }),

    onTypingStatusUpdated: (channel: GroupChannel, typingMembers: Member[]) => store.setState(state => {
      if (!compareIds(channel.url, state.currentChannel?.url)) {
        return state;
      }
      return {
        ...state,
        typingMembers,
      };
    }),

    sendMessageStart: (message: SendableMessageType) => store.setState(state => {
      return {
        ...state,
        localThreadMessages: [
          ...state.localThreadMessages,
          message,
        ],
      };
    }),

    sendMessageSuccess: (message: SendableMessageType) => store.setState(state => {
      return {
        ...state,
        allThreadMessages: [
          ...state.allThreadMessages.filter((m) => (
            !compareIds((m as UserMessage)?.reqId, message?.reqId)
          )),
          message,
        ],
        localThreadMessages: state.localThreadMessages.filter((m) => (
          !compareIds((m as UserMessage)?.reqId, message?.reqId)
        )),
      };
    }),

    sendMessageFailure: (message: SendableMessageType) => store.setState(state => {
      return {
        ...state,
        localThreadMessages: state.localThreadMessages.map((m) => (
          compareIds((m as UserMessage)?.reqId, message?.reqId)
            ? message
            : m
        )),
      };
    }),

    resendMessageStart: (message: SendableMessageType) => store.setState(state => {
      return {
        ...state,
        localThreadMessages: state.localThreadMessages.map((m) => (
          compareIds((m as UserMessage)?.reqId, message?.reqId)
            ? message
            : m
        )),
      };
    }),

    onFileInfoUpdated: ({
      channelUrl,
      requestId,
      index,
      uploadableFileInfo,
      error,
    }: FileUploadInfoParams) => store.setState(state => {
      if (!compareIds(channelUrl, state.currentChannel?.url)) {
        return state;
      }
      /**
       * We don't have to do anything here because
       * onFailed() will be called so handle error there instead.
       */
      if (error) return state;
      const { localThreadMessages } = state;
      const messageToUpdate = localThreadMessages.find((message) => compareIds(hasReqId(message) && message.reqId, requestId),
      );
      const fileInfoList = (messageToUpdate as MultipleFilesMessage)
        .messageParams?.fileInfoList;
      if (Array.isArray(fileInfoList)) {
        fileInfoList[index] = uploadableFileInfo;
      }
      return {
        ...state,
        localThreadMessages,
      };
    }),

    initializeThreadListStart: () => store.setState(state => {
      return {
        ...state,
        threadListState: ThreadListStateTypes.LOADING,
        allThreadMessages: [],
      };
    }),

    initializeThreadListSuccess: (parentMessage: BaseMessage, anchorMessage: SendableMessageType, threadedMessages: BaseMessage[]) => store.setState(state => {
      const anchorMessageCreatedAt = (!anchorMessage?.messageId) ? parentMessage?.createdAt : anchorMessage?.createdAt;
      const anchorIndex = threadedMessages.findIndex((message) => message?.createdAt > anchorMessageCreatedAt);
      const prevThreadMessages = anchorIndex > -1 ? threadedMessages.slice(0, anchorIndex) : threadedMessages;
      const anchorThreadMessage = anchorMessage?.messageId ? [anchorMessage] : [];
      const nextThreadMessages = anchorIndex > -1 ? threadedMessages.slice(anchorIndex) : [];
      return {
        ...state,
        threadListState: ThreadListStateTypes.INITIALIZED,
        hasMorePrev: anchorIndex === -1 || anchorIndex === PREV_THREADS_FETCH_SIZE,
        hasMoreNext: threadedMessages.length - anchorIndex === NEXT_THREADS_FETCH_SIZE,
        allThreadMessages: [prevThreadMessages, anchorThreadMessage, nextThreadMessages].flat() as CoreMessageType[],
      };
    }),

    initializeThreadListFailure: () => store.setState(state => {
      return {
        ...state,
        threadListState: ThreadListStateTypes.LOADING,
        allThreadMessages: [],
      };
    }),

    getPrevMessagesStart: () => store.setState(state => {
      return {
        ...state,
      };
    }),

    getPrevMessagesSuccess: (threadedMessages: CoreMessageType[]) => store.setState(state => {
      return {
        ...state,
        hasMorePrev: threadedMessages.length === PREV_THREADS_FETCH_SIZE,
        allThreadMessages: [...threadedMessages, ...state.allThreadMessages],
      };
    }),

    getPrevMessagesFailure: () => store.setState(state => {
      return {
        ...state,
        hasMorePrev: false,
      };
    }),

    getNextMessagesStart: () => store.setState(state => {
      return {
        ...state,
      };
    }),

    getNextMessagesSuccess: (threadedMessages: CoreMessageType[]) => store.setState(state => {
      return {
        ...state,
        hasMoreNext: threadedMessages.length === NEXT_THREADS_FETCH_SIZE,
        allThreadMessages: [...state.allThreadMessages, ...threadedMessages],
      };
    }),

    getNextMessagesFailure: () => store.setState(state => {
      return {
        ...state,
        hasMoreNext: false,
      };
    }),

  }), [store]);

  return { state, actions };
};

export default useThread;
