import type { ReactNode } from 'react';
import type { GroupChannel, GroupChannelUpdateParams } from '@sendbird/chat/groupChannel';
import type { UserListItemProps } from '../../../ui/UserListItem';
import type { UserProfileProviderProps } from '../../../lib/UserProfileContext';

interface ApplicationUserListQuery {
  limit?: number;
  userIdsFilter?: Array<string>;
  metaDataKeyFilter?: string;
  metaDataValuesFilter?: Array<string>;
}

export interface ChannelSettingsQueries {
  applicationUserListQuery?: ApplicationUserListQuery;
}

type OverrideInviteUserType = {
  users: Array<string>;
  onClose: () => void;
  channel: GroupChannel;
};

export interface CommonChannelSettingsProps {
  channelUrl: string;
  onCloseClick?(): void;
  onLeaveChannel?(): void;
  overrideInviteUser?(params: OverrideInviteUserType): void;
  onChannelModified?(channel: GroupChannel): void;
  onBeforeUpdateChannel?(currentTitle: string, currentImg: File | null, data: string | undefined): GroupChannelUpdateParams;
  queries?: ChannelSettingsQueries;
  renderUserListItem?: (props: UserListItemProps) => ReactNode;
}

export interface ChannelSettingsState extends CommonChannelSettingsProps {
  channel: GroupChannel | null;
  loading: boolean;
  invalidChannel: boolean;
  forceUpdateUI(): void;
  setChannelUpdateId(uniqId: string): void;
}

export interface ChannelSettingsContextProps extends
  CommonChannelSettingsProps,
  Pick<UserProfileProviderProps, 'renderUserProfile' | 'disableUserProfile'> {
  children?: ReactNode;
  className?: string;
}
