import SendBird from "sendbird";
import {
  ReplyType,
  UserListQuery,
  RenderUserProfileProps,
  SendBirdProviderConfig,
} from "../../types";

export default interface AppProps {
  appId: string;
  userId: string;
  accessToken?: string;
  theme?: 'light' | 'dark';
  userListQuery?(): UserListQuery;
  nickname?: string;
  profileUrl?: string;
  allowProfileEdit?: boolean;
  disableUserProfile?: boolean;
  showSearchIcon?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactNode;
  onProfileEditSuccess?(user: SendBird.User): void;
  config?: SendBirdProviderConfig;
  useReaction?: boolean;
  useMessageGrouping?: boolean;
  stringSet?: Record<string, string>;
  colorSet?: Record<string, string>;
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  };
  replyType?: ReplyType;
  autoSelectChannelItem?: boolean;
}
