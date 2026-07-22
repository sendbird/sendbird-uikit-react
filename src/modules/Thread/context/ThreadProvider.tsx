import React, { useMemo, useRef, useContext, useEffect } from 'react';
import { type EmojiCategory, EmojiContainer } from '@sendbird/chat';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import type {
  FileMessage,
  FileMessageCreateParams,
  MultipleFilesMessage,
  MultipleFilesMessageCreateParams,
  UserMessage,
  UserMessageCreateParams,
} from '@sendbird/chat/message';
import { SendingStatus } from '@sendbird/chat/message';

import { getNicknamesMapFromMembers, getParentMessageFrom } from './utils';
import { UserProfileProvider, UserProfileProviderProps } from '../../../lib/UserProfileContext';

import type { OnBeforeDownloadFileMessageType } from '../../GroupChannel/context/types';
import useGetChannel from './hooks/useGetChannel';
import useGetAllEmoji from './hooks/useGetAllEmoji';
import useGetParentMessage from './hooks/useGetParentMessage';
import useHandleChannelEvents from './hooks/useHandleChannelEvents';
import { useGroupChannelThreadMessages } from '@sendbird/uikit-tools';
import { CoreMessageType, SendableMessageType } from '../../../utils';
import { createStore } from '../../../utils/storeManager';
import { ChannelStateTypes, ParentMessageStateTypes, ThreadListStateTypes } from '../types';
import { useStore } from '../../../hooks/useStore';
import useSetCurrentUserId from './hooks/useSetCurrentUserId';
import useThread from './useThread';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import useDeepCompareEffect from '../../../hooks/useDeepCompareEffect';

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

type ThreadMessageDataSource = ReturnType<typeof useGroupChannelThreadMessages>;

export interface ThreadState extends ThreadProviderProps {
  currentChannel: GroupChannel;
  /** All thread replies (succeeded + pending + failed) in one list. Prefer this. */
  threadMessages: Array<CoreMessageType>;
  /** @deprecated Use {@link ThreadState.threadMessages} instead. Holds succeeded (server) replies only. */
  allThreadMessages: Array<CoreMessageType>;
  /** @deprecated Use {@link ThreadState.threadMessages} instead. Holds pending/failed outbound replies only. */
  localThreadMessages: Array<CoreMessageType>;
  parentMessage: SendableMessageType;
  channelState: ChannelStateTypes;
  parentMessageState: ParentMessageStateTypes;
  threadListState: ThreadListStateTypes;
  hasMorePrev: boolean;
  hasMoreNext: boolean;
  emojiContainer: EmojiContainer;
  isMuted: boolean;
  isChannelFrozen: boolean;
  currentUserId: string;
  typingMembers: Member[];
  nicknamesMap: Map<string, string>;
  loadPrevious?: ThreadMessageDataSource['loadPrevious'];
  loadNext?: ThreadMessageDataSource['loadNext'];
  resetWithStartingPoint?: ThreadMessageDataSource['resetWithStartingPoint'];
  dsSendUserMessage?: ThreadMessageDataSource['sendUserMessage'];
  dsSendFileMessage?: ThreadMessageDataSource['sendFileMessage'];
  dsSendMultipleFilesMessage?: ThreadMessageDataSource['sendMultipleFilesMessage'];
  dsUpdateUserMessage?: ThreadMessageDataSource['updateUserMessage'];
  dsResendMessage?: ThreadMessageDataSource['resendMessage'];
  dsDeleteMessage?: ThreadMessageDataSource['deleteMessage'];
}

const initialState = () => ({
  channelUrl: '',
  message: null,
  onHeaderActionClick: undefined,
  onMoveToParentMessage: undefined,
  onBeforeSendUserMessage: undefined,
  onBeforeSendFileMessage: undefined,
  onBeforeSendVoiceMessage: undefined,
  onBeforeSendMultipleFilesMessage: undefined,
  onBeforeDownloadFileMessage: undefined,
  isMultipleFilesMessageEnabled: undefined,
  filterEmojiCategoryIds: undefined,
  currentChannel: null,
  threadMessages: [],
  allThreadMessages: [],
  localThreadMessages: [],
  parentMessage: null,
  channelState: ChannelStateTypes.NIL,
  parentMessageState: ParentMessageStateTypes.NIL,
  threadListState: ThreadListStateTypes.NIL,
  hasMorePrev: false,
  hasMoreNext: false,
  emojiContainer: {} as EmojiContainer,
  isMuted: false,
  isChannelFrozen: false,
  currentUserId: '',
  typingMembers: [],
  nicknamesMap: null,
} as ThreadState);

export const ThreadContext = React.createContext<ReturnType<typeof createStore<ThreadState>> | null>(null);

const createThreadStore = (props?: Partial<ThreadState>) => createStore({
  ...initialState(),
  ...props,
});

export const InternalThreadProvider: React.FC<React.PropsWithChildren<unknown>> = (props: ThreadProviderProps) => {
  const { children } = props;

  const defaultProps: Partial<ThreadState> = {
    channelUrl: props?.channelUrl,
    message: props?.message,
    onHeaderActionClick: props?.onHeaderActionClick,
    onMoveToParentMessage: props?.onMoveToParentMessage,
    onBeforeSendUserMessage: props?.onBeforeSendUserMessage,
    onBeforeSendFileMessage: props?.onBeforeSendFileMessage,
    onBeforeSendVoiceMessage: props?.onBeforeSendVoiceMessage,
    onBeforeSendMultipleFilesMessage: props?.onBeforeSendMultipleFilesMessage,
    onBeforeDownloadFileMessage: props?.onBeforeDownloadFileMessage,
    isMultipleFilesMessageEnabled: props?.isMultipleFilesMessageEnabled,
    filterEmojiCategoryIds: props?.filterEmojiCategoryIds,
  };

  const storeRef = useRef(createThreadStore(defaultProps));

  return (
    <ThreadContext.Provider value={storeRef.current}>
      {children}
    </ThreadContext.Provider>
  );
};

export const ThreadManager: React.FC<React.PropsWithChildren<ThreadProviderProps>> = (props) => {
  const {
    message,
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

  const {
    state: {
      currentChannel,
      parentMessage,
      parentMessageState,
    },
  } = useThread();
  const { updateState } = useThreadStore();

  const propsParentMessage = getParentMessageFrom(message);
  // Context from SendbirdProvider
  const { state: { stores, config } } = useSendbird();
  // // stores
  const { sdkStore, userStore } = stores;
  const { sdk } = sdkStore;
  const { user } = userStore;
  const sdkInit = sdkStore?.initialized;
  // // config
  const { logger } = config;
  const isReactionEnabled = config.groupChannel.enableReactions;

  // Initialization
  useSetCurrentUserId({ user });
  useGetChannel({
    channelUrl,
    sdkInit,
    message,
  }, { sdk, logger });
  useGetParentMessage({
    channelUrl,
    sdkInit,
    parentMessage: propsParentMessage,
  }, { sdk, logger });
  useGetAllEmoji({ sdk }, { logger });
  // Handle channel events
  useHandleChannelEvents({
    sdk,
    currentChannel,
  }, { logger });

  const startingPoint = (message && propsParentMessage && message.messageId !== propsParentMessage.messageId)
    ? message.createdAt
    : Number.MAX_SAFE_INTEGER;
  const threadDataSource = useGroupChannelThreadMessages(
    sdk as Parameters<typeof useGroupChannelThreadMessages>[0],
    currentChannel as GroupChannel,
    (propsParentMessage ?? parentMessage) as UserMessage | FileMessage,
    {
      startingPoint,
      isReactionEnabled,
      logger,
      onParentMessageUpdated: (updatedParentMessage) => {
        updateState({ parentMessage: updatedParentMessage as SendableMessageType });
      },
      onParentMessageDeleted: () => {
        updateState({
          parentMessage: null,
          parentMessageState: ParentMessageStateTypes.NIL,
          threadMessages: [],
          allThreadMessages: [],
          localThreadMessages: [],
        });
      },
      onChannelDeleted: () => {
        updateState({
          currentChannel: null,
          channelState: ChannelStateTypes.NIL,
          threadListState: ThreadListStateTypes.NIL,
          // Clear the parent too: the channel is gone, so a stale parentMessage would keep the
          // composer enabled (ThreadMessageInput only disables on parentMessage === null) while sends
          // silently no-op. Mirrors the current-user-banned reset.
          parentMessage: null,
          parentMessageState: ParentMessageStateTypes.NIL,
          threadMessages: [],
          allThreadMessages: [],
          localThreadMessages: [],
          hasMorePrev: false,
          hasMoreNext: false,
        });
      },
      onCurrentUserBanned: () => {
        updateState({
          currentChannel: null,
          channelState: ChannelStateTypes.NIL,
          threadListState: ThreadListStateTypes.NIL,
          parentMessage: null,
          parentMessageState: ParentMessageStateTypes.NIL,
          threadMessages: [],
          allThreadMessages: [],
          localThreadMessages: [],
          hasMorePrev: false,
          hasMoreNext: false,
        });
      },
      onChannelUpdated: (channel) => {
        updateState({
          currentChannel: channel,
          isChannelFrozen: channel?.isFrozen || false,
        });
      },
    },
  );

  const threadListState = threadDataSource.loading && config.isOnline && parentMessageState === ParentMessageStateTypes.INITIALIZED
    ? ThreadListStateTypes.LOADING
    : threadDataSource.initialized
      ? ThreadListStateTypes.INITIALIZED
      : ThreadListStateTypes.NIL;
  const hasMorePrev = threadDataSource.hasPrevious();
  const hasMoreNext = threadDataSource.hasNext();
  const store = useContext(ThreadContext);
  const messagesSyncKey = threadDataSource.messages
    .map((message) => {
      const uploadParams = (message as MultipleFilesMessage).messageParams as MultipleFilesMessageCreateParams | undefined;
      const uploadState = uploadParams?.fileInfoList
        ? uploadParams.fileInfoList.map((info) => info.fileUrl ?? '').join(',')
        : '';
      return `${JSON.stringify(message.serialize())}#${uploadState}`;
    })
    .join('~');

  useEffect(() => {
    if (!parentMessage) return;
    // core-ts scopes the collection to this thread's replies (belongsToThread on the event/fetch and
    // send/resend paths), so mirror them as-is. Split into the legacy public shape: allThreadMessages =
    // succeeded (server) messages, localThreadMessages = pending/failed; threadMessages = all of them.
    const scopedMessages = threadDataSource.messages;
    const localThreadMessages = scopedMessages.filter((m) => {
      const sendingStatus = (m as SendableMessageType).sendingStatus;
      return sendingStatus === SendingStatus.PENDING || sendingStatus === SendingStatus.FAILED;
    });
    const allThreadMessages = scopedMessages.filter((m) => !localThreadMessages.includes(m));
    store?.setState((prev) => ({
      ...prev,
      threadMessages: scopedMessages as CoreMessageType[],
      allThreadMessages: allThreadMessages as CoreMessageType[],
      localThreadMessages: localThreadMessages as CoreMessageType[],
      hasMorePrev,
      hasMoreNext,
      threadListState,
    }), true);
  }, [store, messagesSyncKey, parentMessage?.messageId, hasMorePrev, hasMoreNext, threadListState]);

  useEffect(() => {
    store?.setState((prev) => ({
      ...prev,
      loadPrevious: threadDataSource.loadPrevious,
      loadNext: threadDataSource.loadNext,
      resetWithStartingPoint: threadDataSource.resetWithStartingPoint,
      dsSendUserMessage: threadDataSource.sendUserMessage,
      dsSendFileMessage: threadDataSource.sendFileMessage,
      dsSendMultipleFilesMessage: threadDataSource.sendMultipleFilesMessage,
      dsUpdateUserMessage: threadDataSource.updateUserMessage,
      dsResendMessage: threadDataSource.resendMessage,
      dsDeleteMessage: threadDataSource.deleteMessage,
    }), true);
  }, [store]);

  // memo
  const nicknamesMap: Map<string, string> = useMemo(() => (
    (config.groupChannel.replyType !== 'none' && currentChannel)
      ? getNicknamesMapFromMembers(currentChannel?.members)
      : new Map()
  ), [currentChannel?.members]);

  useDeepCompareEffect(() => {
    updateState({
      channelUrl,
      message,
      onHeaderActionClick,
      onMoveToParentMessage,
      onBeforeSendUserMessage,
      onBeforeSendFileMessage,
      onBeforeSendVoiceMessage,
      onBeforeSendMultipleFilesMessage,
      onBeforeDownloadFileMessage,
      isMultipleFilesMessageEnabled,
      filterEmojiCategoryIds,
      nicknamesMap,
    });
  }, [
    channelUrl,
    message,
    onHeaderActionClick,
    onMoveToParentMessage,
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeSendVoiceMessage,
    onBeforeSendMultipleFilesMessage,
    onBeforeDownloadFileMessage,
    isMultipleFilesMessageEnabled,
    filterEmojiCategoryIds,
    nicknamesMap,
  ]);

  return null;
};

export const ThreadProvider = (props: ThreadProviderProps) => {
  const { children } = props;

  return (
    <InternalThreadProvider {...props}>
      <ThreadManager key={props.message?.messageId ?? 'thread'} {...props} />
        {/* UserProfileProvider */}
        <UserProfileProvider {...props}>
          {children}
        </UserProfileProvider>
    </InternalThreadProvider>
  );
};

export const useThreadContext = () => {
  const { state, actions } = useThread();
  return { ...state, ...actions };
};

const useThreadStore = () => {
  return useStore(ThreadContext, state => state, initialState());
};
