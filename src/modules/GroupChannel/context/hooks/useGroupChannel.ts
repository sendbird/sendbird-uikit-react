import { useContext, useMemo } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { SendbirdError } from '@sendbird/chat';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

import type {
  FileMessage,
  FileMessageCreateParams,
  MultipleFilesMessage,
  MultipleFilesMessageCreateParams,
  UserMessage,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';

import { SendableMessageType } from '../../../../utils';
import { getMessageTopOffset } from '../utils';
import { useSendbird } from '../../../../lib/Sendbird/context/hooks/useSendbird';
import { GroupChannelContext } from '../GroupChannelProvider';
import type { GroupChannelState, MessageActions } from '../types';
import { useMessageActions } from './useMessageActions';

export interface GroupChannelActions extends MessageActions {
  // Channel actions
  setCurrentChannel: (channel: GroupChannel) => void;
  handleChannelError: (error: SendbirdError) => void;

  // Message actions
  sendUserMessage: (params: UserMessageCreateParams) => Promise<UserMessage>;
  sendFileMessage: (params: FileMessageCreateParams) => Promise<FileMessage>;
  sendMultipleFilesMessage: (params: MultipleFilesMessageCreateParams) => Promise<MultipleFilesMessage>;
  updateUserMessage: (messageId: number, params: UserMessageUpdateParams) => Promise<UserMessage>;

  // UI actions
  setQuoteMessage: (message: SendableMessageType | null) => void;
  setAnimatedMessageId: (messageId: number | null) => void;
  setIsScrollBottomReached: (isReached: boolean) => void;

  // Scroll actions
  scrollToBottom: (animated?: boolean) => Promise<void>;
  scrollToMessage: (
    createdAt: number,
    messageId: number,
    messageFocusAnimated?: boolean,
    scrollAnimated?: boolean
  ) => Promise<void>;

  // Reaction action
  toggleReaction: (message: SendableMessageType, emojiKey: string, isReacted: boolean) => void;
}

export const useGroupChannel = () => {
  const store = useContext(GroupChannelContext);
  if (!store) throw new Error('useGroupChannel must be used within a GroupChannelProvider');

  const { state: { config } } = useSendbird();
  const { markAsReadScheduler } = config;
  const state: GroupChannelState = useSyncExternalStore(store.subscribe, store.getState);

  const flagActions = {
    setAnimatedMessageId: (messageId: number | null) => {
      store.setState(state => ({ ...state, animatedMessageId: messageId }));
    },

    setIsScrollBottomReached: (isReached: boolean) => {
      store.setState(state => ({ ...state, isScrollBottomReached: isReached }));
    },
  };

  const scrollToBottom = async (animated?: boolean) => {
    if (!state.scrollRef.current) return;

    flagActions.setAnimatedMessageId(null);
    flagActions.setIsScrollBottomReached(true);

    if (config.isOnline && state.hasNext()) {
      await state.resetWithStartingPoint(Number.MAX_SAFE_INTEGER);
      state.scrollPubSub.publish('scrollToBottom', { animated });
    } else {
      state.scrollPubSub.publish('scrollToBottom', { animated });
    }

    if (state.currentChannel && !state.hasNext()) {
      state.resetNewMessages();
      if (!state.disableMarkAsRead) {
        markAsReadScheduler.push(state.currentChannel);
      }
    }
  };
  const messageActions = useMessageActions({
    ...state,
    scrollToBottom,
  });

  const actions: GroupChannelActions = useMemo(() => ({
    setCurrentChannel: (channel: GroupChannel) => {
      store.setState(state => ({
        ...state,
        currentChannel: channel,
        fetchChannelError: null,
        quoteMessage: null,
        animatedMessageId: null,
        nicknamesMap: new Map(
          channel.members.map(({ userId, nickname }) => [userId, nickname]),
        ),
      }));
    },

    handleChannelError: (error: SendbirdError) => {
      store.setState(state => ({
        ...state,
        currentChannel: null,
        fetchChannelError: error,
        quoteMessage: null,
        animatedMessageId: null,
      }));
    },

    setQuoteMessage: (message: SendableMessageType | null) => {
      store.setState(state => ({ ...state, quoteMessage: message }));
    },

    scrollToBottom,
    scrollToMessage: async (
      createdAt: number,
      messageId: number,
      messageFocusAnimated?: boolean,
      scrollAnimated?: boolean,
    ) => {
      const element = state.scrollRef.current;
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

      flagActions.setAnimatedMessageId(null);
      const message = state.messages.find(
        (it) => it.messageId === messageId || it.createdAt === createdAt,
      );

      if (message) {
        const topOffset = getMessageTopOffset(message.createdAt);
        if (topOffset) state.scrollPubSub.publish('scroll', { top: topOffset, animated: scrollAnimated });
        if (messageFocusAnimated ?? true) flagActions.setAnimatedMessageId(messageId);
      } else {
        await state.resetWithStartingPoint(createdAt);
        setTimeout(() => {
          const topOffset = getMessageTopOffset(createdAt);
          if (topOffset) {
            state.scrollPubSub.publish('scroll', {
              top: topOffset,
              lazy: false,
              animated: scrollAnimated,
            });
          }
          if (messageFocusAnimated ?? true) flagActions.setAnimatedMessageId(messageId);
        });
      }

      clickHandler.activate();
    },

    toggleReaction: (message: SendableMessageType, emojiKey: string, isReacted: boolean) => {
      if (!state.currentChannel) return;

      if (isReacted) {
        state.currentChannel.deleteReaction(message, emojiKey)
          .catch(error => {
            config.logger?.warning('Failed to delete reaction:', error);
          });
      } else {
        state.currentChannel.addReaction(message, emojiKey)
          .catch(error => {
            config.logger?.warning('Failed to add reaction:', error);
          });
      }
    },
    ...flagActions,
    ...messageActions,
  }), [store, state, config.isOnline, markAsReadScheduler]);

  return { state, actions };
};
