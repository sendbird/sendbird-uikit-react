import type SendbirdChat from '@sendbird/chat';
import type { User } from '@sendbird/chat';
import type { Member } from '@sendbird/chat/groupChannel';

export type CustomUseReducerDispatcher = ({
  type: string,
  /* eslint-disable @typescript-eslint/no-explicit-any*/
  payload: any,
}) => void;

interface UserListQuery {
  hasNext?: boolean;
  next(callback: unknown): void;
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
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  allowProfileEdit: boolean;
  isOnline: boolean;
  userId: string;
  appId: string;
  accessToken: string;
  theme: SendbirdUIKitThemes;
  setCurrenttheme: (theme: SendbirdUIKitThemes) => void;
  userListQuery?(): UserListQuery;
  isMentionEnabled?: boolean;
  userMention: {
    maxMentionCount: number,
    maxSuggestionCount: number,
  };
  /* eslint-disable @typescript-eslint/no-explicit-any*/
  pubSub: any,
  logger: Logger;
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  };
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
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
