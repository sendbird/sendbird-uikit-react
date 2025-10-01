import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useCallback, useContext, useMemo } from 'react';
import { ThreadContext, ThreadState } from './ThreadProvider';
import { ChannelStateTypes, FileUploadInfoParams, ParentMessageStateTypes, ThreadListStateTypes } from '../types';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { CoreMessageType, SendableMessageType } from '../../../utils';
import { EmojiContainer, User } from '@sendbird/chat';
import { compareIds } from './utils';
import {
  BaseMessage,
  MultipleFilesMessage,
  ReactionEvent,
  SendingStatus,
  UserMessage,
} from '@sendbird/chat/message';
import { NEXT_THREADS_FETCH_SIZE, PREV_THREADS_FETCH_SIZE } from '../consts';
import useToggleReactionCallback from './hooks/useToggleReactionsCallback';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import useSendUserMessageCallback from './hooks/useSendUserMessageCallback';
import { PublishingModuleType } from '../../../lib/pubSub/topics';

import useSendFileMessageCallback from './hooks/useSendFileMessage';
import useSendVoiceMessageCallback from './hooks/useSendVoiceMessageCallback';
import { useSendMultipleFilesMessage } from '../../Channel/context/hooks/useSendMultipleFilesMessage';
import useResendMessageCallback from './hooks/useResendMessageCallback';
import useUpdateMessageCallback from './hooks/useUpdateMessageCallback';
import useDeleteMessageCallback from './hooks/useDeleteMessageCallback';
import { useThreadFetchers } from './hooks/useThreadFetchers';

import { cloneDeep } from 'lodash';

function hasReqId<T extends object>(
  message: T,
): message is T & { reqId: string } {
  return 'reqId' in message;
}

const useThread = () => {
  const store = useContext(ThreadContext);
  if (!store) throw new Error('useThread must be used within a ThreadProvider');
  // SendbirdStateContext config
  const { state: { config } } = useSendbird();
  const { logger, pubSub } = config;
  const isMentionEnabled = config.groupChannel.enableMention;
  const isReactionEnabled = config.groupChannel.enableReactions;

  const state: ThreadState = useSyncExternalStore(store.subscribe, store.getState);
  const {
    message,
    parentMessage,
    currentChannel,
    threadListState,
    allThreadMessages,
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeSendVoiceMessage,
    onBeforeSendMultipleFilesMessage,
  } = state;

  const sendMessageStatusActions = {
    sendMessageStart: useCallback((message: SendableMessageType) => store.setState(state => {
      if ('sendingStatus' in message) {
        (message as SendableMessageType).sendingStatus = SendingStatus.PENDING;
      }

      return {
        ...state,
        localThreadMessages: [
          ...state.localThreadMessages,
          message,
        ],
      };
    }), [store]),

    sendMessageSuccess: useCallback((message: SendableMessageType) => store.setState(state => {
      if ('sendingStatus' in message) {
        (message as SendableMessageType).sendingStatus = SendingStatus.SUCCEEDED;
      }

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
    }), [store]),

    sendMessageFailure: useCallback((message: SendableMessageType) => store.setState(state => {
      if ('sendingStatus' in message) {
        (message as SendableMessageType).sendingStatus = SendingStatus.FAILED;
      }

      return {
        ...state,
        localThreadMessages: state.localThreadMessages.map((m) => (
          compareIds((m as UserMessage)?.reqId, message?.reqId)
            ? message
            : m
        )),
      };
    }), [store]),

    resendMessageStart: useCallback((message: SendableMessageType) => store.setState(state => {
      if ('sendingStatus' in message) {
        (message as SendableMessageType).sendingStatus = SendingStatus.PENDING;
      }

      return {
        ...state,
        localThreadMessages: state.localThreadMessages.map((m) => (
          compareIds((m as UserMessage)?.reqId, message?.reqId)
            ? message
            : m
        )),
      };
    }), [store]),
  };

  const toggleReaction = useToggleReactionCallback({ currentChannel }, { logger });

  const sendMessageActions = {
    sendMessage: useSendUserMessageCallback({
      isMentionEnabled,
      currentChannel,
      onBeforeSendUserMessage,
      sendMessageStart: sendMessageStatusActions.sendMessageStart,
      sendMessageFailure: sendMessageStatusActions.sendMessageFailure,
    }, {
      logger,
      pubSub,
    }),

    sendFileMessage: useSendFileMessageCallback({
      currentChannel,
      onBeforeSendFileMessage,
      sendMessageStart: sendMessageStatusActions.sendMessageStart,
      sendMessageFailure: sendMessageStatusActions.sendMessageFailure,
    }, {
      logger,
      pubSub,
    }),

    sendVoiceMessage: useSendVoiceMessageCallback({
      currentChannel,
      onBeforeSendVoiceMessage,
      sendMessageStart: sendMessageStatusActions.sendMessageStart,
      sendMessageFailure: sendMessageStatusActions.sendMessageFailure,
    }, {
      logger,
      pubSub,
    }),

    sendMultipleFilesMessage: useSendMultipleFilesMessage({
      currentChannel,
      onBeforeSendMultipleFilesMessage,
      publishingModules: [PublishingModuleType.THREAD],
    }, {
      logger,
      pubSub,
    })[0],

    resendMessage: useResendMessageCallback({
      resendMessageStart: sendMessageStatusActions.resendMessageStart,
      sendMessageSuccess: sendMessageStatusActions.sendMessageSuccess,
      sendMessageFailure: sendMessageStatusActions.sendMessageFailure,
      currentChannel,
    }, { logger, pubSub }),
  };

  const messageModifiedActions = {
    onMessageUpdated: useCallback((channel: GroupChannel, message: SendableMessageType) => {
      store.setState(state => {
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
      });
    }, [store]),

    onMessageDeleted: useCallback((channel: GroupChannel, messageId: number) => {
      store.setState(state => {
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
      });
    }, [store]),

    onMessageDeletedByReqId: useCallback((reqId: string | number) => {
      store.setState(state => {
        return {
          ...state,
          localThreadMessages: state.localThreadMessages.filter((m) => (
            !compareIds((m as SendableMessageType).reqId, reqId)
          )),
        };
      });
    }, [store]),
  };

  const modifyMessageActions = {
    updateMessage: useUpdateMessageCallback({
      currentChannel,
      isMentionEnabled,
      onMessageUpdated: messageModifiedActions.onMessageUpdated,
    }, { logger, pubSub }),

    deleteMessage: useDeleteMessageCallback({
      currentChannel,
      onMessageDeleted: messageModifiedActions.onMessageDeleted,
      onMessageDeletedByReqId: messageModifiedActions.onMessageDeletedByReqId,
    }, { logger }),
  };

  const threadFetcherStatusActions = {
    initializeThreadListStart: useCallback(() => store.setState(state => {
      return {
        ...state,
        threadListState: ThreadListStateTypes.LOADING,
        allThreadMessages: [],
      };
    }), [store]),

    initializeThreadListSuccess: useCallback((parentMessage: BaseMessage, anchorMessage: SendableMessageType, threadedMessages: BaseMessage[]) => store.setState(state => {
      const anchorMessageCreatedAt = (!anchorMessage?.messageId) ? parentMessage?.createdAt : anchorMessage?.createdAt;
      const anchorIndex = threadedMessages.findIndex((message) => message?.createdAt === anchorMessageCreatedAt);
      const prevThreadMessages = anchorIndex > -1 ? threadedMessages.slice(0, anchorIndex) : threadedMessages;
      const nextThreadMessages = anchorIndex > -1 ? threadedMessages.slice(anchorIndex) : [];

      return {
        ...state,
        threadListState: ThreadListStateTypes.INITIALIZED,
        hasMorePrev: anchorIndex === -1 || anchorIndex === PREV_THREADS_FETCH_SIZE,
        hasMoreNext: threadedMessages.length - anchorIndex === NEXT_THREADS_FETCH_SIZE,
        allThreadMessages: [...prevThreadMessages, ...nextThreadMessages] as CoreMessageType[],
      };
    }), [store]),

    initializeThreadListFailure: useCallback(() => store.setState(state => {
      return {
        ...state,
        threadListState: ThreadListStateTypes.LOADING,
        allThreadMessages: [],
      };
    }), [store]),

    getPrevMessagesStart: useCallback(() => store.setState(state => {
      return {
        ...state,
      };
    }), [store]),

    getPrevMessagesSuccess: useCallback((threadedMessages: CoreMessageType[]) => store.setState(state => {
      return {
        ...state,
        hasMorePrev: threadedMessages.length === PREV_THREADS_FETCH_SIZE,
        allThreadMessages: [...threadedMessages, ...state.allThreadMessages],
      };
    }), [store]),

    getPrevMessagesFailure: useCallback(() => store.setState(state => {
      return {
        ...state,
        hasMorePrev: false,
      };
    }), [store]),

    getNextMessagesStart: useCallback(() => store.setState(state => {
      return {
        ...state,
      };
    }), [store]),

    getNextMessagesSuccess: useCallback((threadedMessages: CoreMessageType[]) => store.setState(state => {
      return {
        ...state,
        hasMoreNext: threadedMessages.length === NEXT_THREADS_FETCH_SIZE,
        allThreadMessages: [...state.allThreadMessages, ...threadedMessages],
      };
    }), [store]),

    getNextMessagesFailure: useCallback(() => store.setState(state => {
      return {
        ...state,
        hasMoreNext: false,
      };
    }), [store]),
  };

  const { initializeThreadFetcher, fetchPrevThreads, fetchNextThreads } = useThreadFetchers({
    parentMessage,
    // anchorMessage should be null when parentMessage doesn't exist
    anchorMessage: message?.messageId !== parentMessage?.messageId ? message || undefined : undefined,
    logger,
    isReactionEnabled,
    threadListState,
    oldestMessageTimeStamp: allThreadMessages[0]?.createdAt || 0,
    latestMessageTimeStamp: allThreadMessages[allThreadMessages.length - 1]?.createdAt || 0,
    initializeThreadListStart: threadFetcherStatusActions.initializeThreadListStart,
    initializeThreadListSuccess: threadFetcherStatusActions.initializeThreadListSuccess,
    initializeThreadListFailure: threadFetcherStatusActions.initializeThreadListFailure,
    getPrevMessagesStart: threadFetcherStatusActions.getPrevMessagesStart,
    getPrevMessagesSuccess: threadFetcherStatusActions.getPrevMessagesSuccess,
    getPrevMessagesFailure: threadFetcherStatusActions.getPrevMessagesFailure,
    getNextMessagesStart: threadFetcherStatusActions.getNextMessagesStart,
    getNextMessagesSuccess: threadFetcherStatusActions.getNextMessagesSuccess,
    getNextMessagesFailure: threadFetcherStatusActions.getNextMessagesFailure,
  });

  const simpleActions = {
    setCurrentUserId: useCallback((currentUserId: string) => store.setState(state => ({
      ...state,
      currentUserId: currentUserId,
    })), [store]),

    getChannelStart: useCallback(() => store.setState(state => ({
      ...state,
      channelState: ChannelStateTypes.LOADING,
      currentChannel: null,
    })), [store]),

    getChannelSuccess: useCallback((groupChannel: GroupChannel) => store.setState(state => ({
      ...state,
      channelState: ChannelStateTypes.INITIALIZED,
      currentChannel: groupChannel,
      // only support in normal group channel
      isMuted: groupChannel?.members?.find((member) => member?.userId === state.currentUserId)?.isMuted || false,
      isChannelFrozen: groupChannel?.isFrozen || false,
    })), [store]),

    getChannelFailure: useCallback(() => store.setState(state => ({
      ...state,
      channelState: ChannelStateTypes.INVALID,
      currentChannel: null,
    })), [store]),

    getParentMessageStart: useCallback(() => store.setState(state => ({
      ...state,
      parentMessageState: ParentMessageStateTypes.LOADING,
      parentMessage: null,
    })), [store]),

    getParentMessageSuccess: useCallback((parentMessage: SendableMessageType) => store.setState(state => ({
      ...state,
      parentMessageState: ParentMessageStateTypes.INITIALIZED,
      parentMessage: parentMessage,
    })), [store]),

    getParentMessageFailure: useCallback(() => store.setState(state => ({
      ...state,
      parentMessageState: ParentMessageStateTypes.INVALID,
      parentMessage: null,
    })), [store]),

    setEmojiContainer: useCallback((emojiContainer: EmojiContainer) => store.setState(state => ({
      ...state,
      emojiContainer: emojiContainer,
    })), [store]),

    onMessageReceived: useCallback((channel: GroupChannel, message: SendableMessageType) => store.setState(state => {
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
    }), [store]),

    onReactionUpdated: useCallback((reactionEvent: ReactionEvent) => store.setState(state => {
      let updatedParentMessage = state.parentMessage;
      if (state.parentMessage?.messageId === reactionEvent?.messageId) {
        updatedParentMessage = cloneDeep(state.parentMessage as SendableMessageType);
        updatedParentMessage.applyReactionEvent(reactionEvent);
      }

      const updatedMessages = state.allThreadMessages.map((m) => {
        if (reactionEvent?.messageId === m?.messageId) {
          const updatedMessage = cloneDeep(m as CoreMessageType);
          updatedMessage.applyReactionEvent(reactionEvent);
          return updatedMessage;
        }
        return m;
      });

      return {
        ...state,
        parentMessage: updatedParentMessage,
        allThreadMessages: [...updatedMessages], // 새 배열 참조로 리렌더링 트리거
      };
    }), [store]),

    onUserMuted: useCallback((channel: GroupChannel, user: User) => store.setState(state => {
      if (state.currentChannel?.url !== channel?.url || state.currentUserId !== user?.userId) {
        return state;
      }
      return {
        ...state,
        isMuted: true,
      };
    }), [store]),

    onUserUnmuted: useCallback((channel: GroupChannel, user: User) => store.setState(state => {
      if (state.currentChannel?.url !== channel?.url || state.currentUserId !== user?.userId) {
        return state;
      }
      return {
        ...state,
        isMuted: false,
      };
    }), [store]),

    onUserBanned: useCallback(() => store.setState(state => {
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
    }), [store]),

    onUserUnbanned: useCallback(() => store.setState(state => {
      return {
        ...state,
      };
    }), [store]),

    onUserLeft: useCallback(() => store.setState(state => {
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
    }), [store]),

    onChannelFrozen: useCallback(() => store.setState(state => {
      return {
        ...state,
        isChannelFrozen: true,
      };
    }), [store]),

    onChannelUnfrozen: useCallback(() => store.setState(state => {
      return {
        ...state,
        isChannelFrozen: false,
      };
    }), [store]),

    onOperatorUpdated: useCallback((channel: GroupChannel) => store.setState(state => {
      if (channel?.url === state.currentChannel?.url) {
        return {
          ...state,
          currentChannel: channel,
        };
      }
      return state;
    }), [store]),

    onTypingStatusUpdated: useCallback((channel: GroupChannel, typingMembers: Member[]) => store.setState(state => {
      if (!compareIds(channel.url, state.currentChannel?.url)) {
        return state;
      }
      return {
        ...state,
        typingMembers,
      };
    }), [store]),

    onFileInfoUpdated: useCallback(({
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
    }), [store]),
  };

  const actions = useMemo(() => ({
    ...simpleActions,
    toggleReaction,
    ...sendMessageStatusActions,
    ...sendMessageActions,
    ...messageModifiedActions,
    ...modifyMessageActions,
    ...threadFetcherStatusActions,
    initializeThreadFetcher,
    fetchPrevThreads,
    fetchNextThreads,
  }), [
    simpleActions,
    toggleReaction,
    sendMessageStatusActions,
    sendMessageActions,
    messageModifiedActions,
    modifyMessageActions,
    threadFetcherStatusActions,
    initializeThreadFetcher,
    fetchPrevThreads,
    fetchNextThreads,
  ]);

  return { state, actions };
};

export default useThread;
