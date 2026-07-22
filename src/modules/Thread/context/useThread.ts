import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useCallback, useContext, useMemo } from 'react';
import { ThreadContext, ThreadState } from './ThreadProvider';
import { ChannelStateTypes, FileUploadInfoParams, ParentMessageStateTypes, ThreadListStateTypes } from '../types';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { CoreMessageType, SendableMessageType } from '../../../utils';
import { EmojiContainer, User } from '@sendbird/chat';
import { BaseMessage, ReactionEvent } from '@sendbird/chat/message';
import { compareIds, getNicknamesMapFromMembers } from './utils';
import useToggleReactionCallback from './hooks/useToggleReactionsCallback';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { useThreadMessageActions } from './hooks/useThreadMessageActions';

const useThread = () => {
  const store = useContext(ThreadContext);
  if (!store) throw new Error('useThread must be used within a ThreadProvider');
  // SendbirdStateContext config
  const { state: { config } } = useSendbird();
  const { logger, pubSub } = config;
  const isMentionEnabled = config.groupChannel.enableMention;

  const state: ThreadState = useSyncExternalStore(store.subscribe, store.getState);
  const { currentChannel } = state;

  const toggleReaction = useToggleReactionCallback({ currentChannel }, { logger });

  const initializeThreadFetcher = useCallback((callback?: (messages: CoreMessageType[]) => void) => {
    const { resetWithStartingPoint, message: anchorMessage, parentMessage } = store.getState();
    if (!resetWithStartingPoint) return;
    const startingPoint = (anchorMessage && parentMessage && anchorMessage.messageId !== parentMessage.messageId)
      ? anchorMessage.createdAt
      : parentMessage?.createdAt ?? 0;
    resetWithStartingPoint(startingPoint).then(() => {
      setTimeout(() => callback?.(store.getState().allThreadMessages));
    });
  }, [store]);

  const fetchPrevThreads = useCallback((callback?: (messages: CoreMessageType[]) => void) => {
    const { loadPrevious } = store.getState();
    if (!loadPrevious) return;
    loadPrevious().then(() => {
      setTimeout(() => callback?.(store.getState().allThreadMessages));
    });
  }, [store]);

  const fetchNextThreads = useCallback((callback?: (messages: CoreMessageType[]) => void) => {
    const { loadNext } = store.getState();
    if (!loadNext) return;
    loadNext().then(() => {
      setTimeout(() => callback?.(store.getState().allThreadMessages));
    });
  }, [store]);

  const messageActions = useThreadMessageActions(state, { logger, pubSub, isMentionEnabled });

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

    onUserBanned: useCallback((channel: GroupChannel, user: User) => {
      store.setState(state => {
        if (state.currentChannel?.url !== channel?.url) {
          return state;
        }
        // Only reset state when the current user is banned
        if (state.currentUserId === user?.userId) {
          return {
            ...state,
            channelState: ChannelStateTypes.NIL,
            threadListState: ThreadListStateTypes.NIL,
            parentMessageState: ParentMessageStateTypes.NIL,
            currentChannel: null,
            parentMessage: null,
            threadMessages: [],
            allThreadMessages: [],
            localThreadMessages: [],
            hasMorePrev: false,
            hasMoreNext: false,
          };
        }
        // Another user banned: update channel info and nicknames map
        return {
          ...state,
          currentChannel: channel,
          nicknamesMap: getNicknamesMapFromMembers(channel?.members),
        };
      });
    }, [store]),

    onUserUnbanned: useCallback(() => store.setState(state => {
      return {
        ...state,
      };
    }), [store]),

    onUserLeft: useCallback((channel: GroupChannel, user: User) => {
      store.setState(state => {
        if (state.currentChannel?.url !== channel?.url) {
          return state;
        }
        // Only reset state when the current user has left
        if (state.currentUserId === user?.userId) {
          return {
            ...state,
            channelState: ChannelStateTypes.NIL,
            threadListState: ThreadListStateTypes.NIL,
            parentMessageState: ParentMessageStateTypes.NIL,
            currentChannel: null,
            parentMessage: null,
            threadMessages: [],
            allThreadMessages: [],
            localThreadMessages: [],
            hasMorePrev: false,
            hasMoreNext: false,
          };
        }
        // Another user left: update channel info and nicknames map
        return {
          ...state,
          currentChannel: channel,
          nicknamesMap: getNicknamesMapFromMembers(channel?.members),
        };
      });
    }, [store]),

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
  };

  /**
   * These low-level dispatchers were removed when the @sendbird/uikit-tools collection took over
   * thread state management. They are retained for backward compatibility (existing customer code
   * referencing them still compiles) but no longer mutate state — the collection owns it now. Each
   * logs a deprecation warning when called so a direct caller is not left with a silent no-op.
   * Signatures are supplied by casting, which keeps the parameters off the runtime function.
   */
  const backwardCompatActions = useMemo(() => {
    const warn = (name: string) => () => {
      logger?.warning?.(`[Thread] useThread().actions.${name} is deprecated and no longer has any effect; thread state is now managed by the @sendbird/uikit-tools collection.`);
    };
    return {
      onMessageReceived: warn('onMessageReceived') as (channel: GroupChannel, message: SendableMessageType) => void,
      onReactionUpdated: warn('onReactionUpdated') as (reactionEvent: ReactionEvent) => void,
      onFileInfoUpdated: warn('onFileInfoUpdated') as (params: FileUploadInfoParams) => void,
      sendMessageStart: warn('sendMessageStart') as (message: SendableMessageType) => void,
      sendMessageSuccess: warn('sendMessageSuccess') as (message: SendableMessageType) => void,
      sendMessageFailure: warn('sendMessageFailure') as (message: SendableMessageType) => void,
      resendMessageStart: warn('resendMessageStart') as (message: SendableMessageType) => void,
      onMessageUpdated: warn('onMessageUpdated') as (channel: GroupChannel, message: SendableMessageType) => void,
      onMessageDeleted: warn('onMessageDeleted') as (channel: GroupChannel, messageId: number) => void,
      onMessageDeletedByReqId: warn('onMessageDeletedByReqId') as (reqId: string | number) => void,
      initializeThreadListStart: warn('initializeThreadListStart'),
      initializeThreadListSuccess: warn('initializeThreadListSuccess') as (parentMessage: BaseMessage, anchorMessage: SendableMessageType, threadedMessages: BaseMessage[]) => void,
      initializeThreadListFailure: warn('initializeThreadListFailure'),
      getPrevMessagesStart: warn('getPrevMessagesStart'),
      getPrevMessagesSuccess: warn('getPrevMessagesSuccess') as (threadedMessages: CoreMessageType[]) => void,
      getPrevMessagesFailure: warn('getPrevMessagesFailure'),
      getNextMessagesStart: warn('getNextMessagesStart'),
      getNextMessagesSuccess: warn('getNextMessagesSuccess') as (threadedMessages: CoreMessageType[]) => void,
      getNextMessagesFailure: warn('getNextMessagesFailure'),
    };
  }, [logger]);

  const actions = useMemo(() => ({
    ...simpleActions,
    toggleReaction,
    initializeThreadFetcher,
    fetchPrevThreads,
    fetchNextThreads,
    ...messageActions,
    ...backwardCompatActions,
  }), [
    simpleActions,
    toggleReaction,
    initializeThreadFetcher,
    fetchPrevThreads,
    fetchNextThreads,
    messageActions,
    backwardCompatActions,
  ]);

  return { state, actions };
};

export default useThread;
