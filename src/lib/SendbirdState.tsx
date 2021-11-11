import Sendbird from 'sendbird';

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
  user: Sendbird.Member | Sendbird.User;
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
  /* eslint-disable @typescript-eslint/no-explicit-any*/
  pubSub: any,
  logger: Logger;
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  };
}

export interface SdkStore {
  error: boolean;
  initialized: boolean;
  loading: boolean;
  sdk: Sendbird.SendBirdInstance;
}

interface UserStore {
  initialized: boolean;
  loading: boolean;
  user: Sendbird.User;
}

interface SendBirdStateStore {
  sdkStore: SdkStore;
  userStore: UserStore;
}

export type SendBirdState = {
  config: SendBirdStateConfig;
  stores: SendBirdStateStore;
}
