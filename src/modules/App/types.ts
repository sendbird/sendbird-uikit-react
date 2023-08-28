import type { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import type { FileMessage, UserMessage } from '@sendbird/chat/message';

import type { Locale } from 'date-fns';

import {
  ReplyType,
  UserListQuery,
  RenderUserProfileProps,
  SendBirdProviderConfig,
} from '../../types';

import { CustomExtensionParams, SendbirdChatInitParams } from '../../lib/types';
import { SendableMessageType } from '../../utils';

export interface AppLayoutProps {
  isReactionEnabled?: boolean;
  replyType?: 'NONE' | 'QUOTE_REPLY' | 'THREAD';
  isMessageGroupingEnabled?: boolean;
  allowProfileEdit?: boolean;
  showSearchIcon?: boolean;
  onProfileEditSuccess?(user: User): void;
  disableAutoSelect?: boolean;
  currentChannel?: GroupChannel;
  setCurrentChannel: React.Dispatch<GroupChannel | null>;
}

interface SubLayoutCommonProps {
  highlightedMessage?: number | null;
  setHighlightedMessage: React.Dispatch<number | null>;
  startingPoint?: number | null;
  setStartingPoint: React.Dispatch<number | null>;
  threadTargetMessage: SendableMessageType | null;
  setThreadTargetMessage: React.Dispatch<SendableMessageType>;
}

export interface MobileLayoutProps extends AppLayoutProps, SubLayoutCommonProps { }

export interface DesktopLayoutProps extends AppLayoutProps, SubLayoutCommonProps {
  // modertion pannel
  showSettings: boolean;
  setShowSettings: React.Dispatch<boolean>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<boolean>;
  // thread
  showThread: boolean;
  setShowThread: React.Dispatch<boolean>;
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
  sdkInitParams?: SendbirdChatInitParams;
  customExtensionParams?: CustomExtensionParams;
}
