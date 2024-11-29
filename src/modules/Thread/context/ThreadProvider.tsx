import React, { useMemo, useEffect, useRef } from 'react';
import { type EmojiCategory, EmojiContainer } from '@sendbird/chat';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import type {
  FileMessageCreateParams,
  MultipleFilesMessageCreateParams,
  UserMessageCreateParams,
} from '@sendbird/chat/message';

import { getNicknamesMapFromMembers, getParentMessageFrom } from './utils';
import { UserProfileProvider, UserProfileProviderProps } from '../../../lib/UserProfileContext';

import type { OnBeforeDownloadFileMessageType } from '../../GroupChannel/context/types';
import useGetChannel from './hooks/useGetChannel';
import useGetAllEmoji from './hooks/useGetAllEmoji';
import useGetParentMessage from './hooks/useGetParentMessage';
import useHandleThreadPubsubEvents from './hooks/useHandleThreadPubsubEvents';
import useHandleChannelEvents from './hooks/useHandleChannelEvents';
import { CoreMessageType, SendableMessageType } from '../../../utils';
import { createStore } from '../../../utils/storeManager';
import { ChannelStateTypes, ParentMessageStateTypes, ThreadListStateTypes } from '../types';
import { useStore } from '../../../hooks/useStore';
import useSetCurrentUserId from './hooks/useSetCurrentUserId';
import useThread from './useThread';
import { useSendbird } from '../../../lib/Sendbird/context/hooks/useSendbird';

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

export interface ThreadState {
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
  currentChannel: GroupChannel;
  allThreadMessages: Array<CoreMessageType>;
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
}

const initialState = {
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
};

export const ThreadContext = React.createContext<ReturnType<typeof createStore<ThreadState>> | null>(null);

export const InternalThreadProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const storeRef = useRef(createStore(initialState));

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
    },
    actions: {
      initializeThreadFetcher,
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
  const { logger, pubSub } = config;

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
  useHandleThreadPubsubEvents({
    sdkInit,
    currentChannel,
    parentMessage,
  }, { logger, pubSub });

  useEffect(() => {
    if (stores.sdkStore.initialized && config.isOnline) {
      initializeThreadFetcher();
    }
  }, [stores.sdkStore.initialized, config.isOnline, initializeThreadFetcher]);

  // memo
  const nicknamesMap: Map<string, string> = useMemo(() => (
    (config.groupChannel.replyType !== 'none' && currentChannel)
      ? getNicknamesMapFromMembers(currentChannel?.members)
      : new Map()
  ), [currentChannel?.members]);

  useEffect(() => {
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
    <InternalThreadProvider>
      <ThreadManager {...props} />
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
  return useStore(ThreadContext, state => state, initialState);
};
