import type SendbirdChat from '@sendbird/chat';
import type { User } from '@sendbird/chat';
import type { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { Dispatch } from 'react';
import { MarkAsReadSchedulerType } from './hooks/useMarkAsReadScheduler';

export type CustomUseReducerDispatcher = Dispatch<{ type: string, payload: any }>;

interface UserListQuery {
  hasNext?: boolean;
  next(): Promise<Array<User>>;
}

interface RenderUserProfileProps {
  user: Member;
  currentUserId: string;
  close(): void;
}

export type Logger = {
  info?(title?: unknown, description?: unknown): void;
  error?(title?: unknown, description?: unknown): void;
  warning?(title?: unknown, description?: unknown): void;
};

export enum SendbirdUIKitThemes {
  light = 'light',
  dark = 'dark',
}

interface SendBirdStateConfig {
  disableUserProfile: boolean;
  onUserProfileMessage?: (props: GroupChannel) => void;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  allowProfileEdit: boolean;
  isOnline: boolean;
  userId: string;
  appId: string;
  accessToken: string;
  theme: SendbirdUIKitThemes;
  setCurrenttheme: (theme: SendbirdUIKitThemes) => void;
  userListQuery?(): UserListQuery;
  isReactionEnabled: boolean;
  isMentionEnabled: boolean;
  userMention: {
    maxMentionCount: number,
    maxSuggestionCount: number,
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  pubSub: any,
  logger: Logger;
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  };
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
  markAsReadScheduler?: MarkAsReadSchedulerType;
}

export interface SdkStore {
  error: boolean;
  initialized: boolean;
  loading: boolean;
  sdk: SendbirdChat;
}

interface UserStore {
  initialized: boolean;
  loading: boolean;
  user: User;
}

interface SendBirdStateStore {
  sdkStore: SdkStore;
  userStore: UserStore;
}

export type SendBirdState = {
  config: SendBirdStateConfig;
  stores: SendBirdStateStore;
}
