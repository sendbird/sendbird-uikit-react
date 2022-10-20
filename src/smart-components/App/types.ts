import type { User } from "@sendbird/chat";
import type { Locale } from "date-fns";

import {
  ReplyType,
  UserListQuery,
  RenderUserProfileProps,
  SendBirdProviderConfig,
} from "../../types";

export interface LayoutProps {
  isReactionEnabled?: boolean;
  replyType?: "NONE" | "QUOTE_REPLY" | "THREAD";
  isMessageGroupingEnabled?: boolean;
  allowProfileEdit?: boolean;
  showSearchIcon?: boolean;
  onProfileEditSuccess?(user: User): void;
  disableAutoSelect?: boolean;
};

export interface MobileLayoutProps extends LayoutProps {
  currentChannelUrl?: string;
  setCurrentChannelUrl?: React.Dispatch<string>;
  highlightedMessage?: number;
  setHighlightedMessage?: React.Dispatch<number>;
  startingPoint?: number;
  setStartingPoint?: React.Dispatch<number>;
}

export interface DesktopLayoutProps extends LayoutProps {
  showSettings: boolean;
  setShowSettings: React.Dispatch<boolean>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<boolean>;
  currentChannelUrl?: string;
  setCurrentChannelUrl?: React.Dispatch<string>;
  highlightedMessage?: number;
  setHighlightedMessage?: React.Dispatch<number>;
  startingPoint?: number;
  setStartingPoint?: React.Dispatch<number>;
}

export default interface AppProps {
  appId: string;
  userId: string;
  accessToken?: string;
  customApiHost?: string,
  customWebSocketHost?: string,
  theme?: 'light' | 'dark';
  userListQuery?(): UserListQuery;
  nickname?: string;
  profileUrl?: string;
  dateLocale?: Locale;
  allowProfileEdit?: boolean;
  disableUserProfile?: boolean;
  showSearchIcon?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  onProfileEditSuccess?(user: User): void;
  config?: SendBirdProviderConfig;
  isReactionEnabled?: boolean;
  isMessageGroupingEnabled?: boolean;
  stringSet?: Record<string, string>;
  colorSet?: Record<string, string>;
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  };
  replyType?: ReplyType;
  disableAutoSelect?: boolean;
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
}
