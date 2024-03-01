import React from 'react';
import { GroupChannel, GroupChannelUpdateParams } from '@sendbird/chat/groupChannel';
import { RenderUserProfileProps } from '../../../types';
interface ApplicationUserListQuery {
    limit?: number;
    userIdsFilter?: Array<string>;
    metaDataKeyFilter?: string;
    metaDataValuesFilter?: Array<string>;
}
interface ChannelSettingsQueries {
    applicationUserListQuery?: ApplicationUserListQuery;
}
type OverrideInviteUserType = {
    users: Array<string>;
    onClose: () => void;
    channel: GroupChannel;
};
export type ChannelSettingsContextProps = {
    children?: React.ReactElement;
    channelUrl: string;
    className?: string;
    onCloseClick?(): void;
    onLeaveChannel?(): void;
    overrideInviteUser?(params: OverrideInviteUserType): void;
    onChannelModified?(channel: GroupChannel): void;
    onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): GroupChannelUpdateParams;
    queries?: ChannelSettingsQueries;
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
    disableUserProfile?: boolean;
};
interface ChannelSettingsProviderInterface {
    channelUrl: string;
    onCloseClick?(): void;
    onLeaveChannel?(): void;
    overrideInviteUser?(params: OverrideInviteUserType): void;
    onChannelModified?(channel: GroupChannel): void;
    onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): GroupChannelUpdateParams;
    queries?: ChannelSettingsQueries;
    setChannelUpdateId(uniqId: string): void;
    forceUpdateUI(): void;
    channel: GroupChannel | null;
    loading: boolean;
    invalidChannel: boolean;
}
declare const ChannelSettingsProvider: ({ children, className, channelUrl, onCloseClick, onLeaveChannel, onChannelModified, overrideInviteUser, onBeforeUpdateChannel, queries, renderUserProfile, disableUserProfile, }: ChannelSettingsContextProps) => React.JSX.Element;
declare const useChannelSettingsContext: () => ChannelSettingsProviderInterface;
export { ChannelSettingsProvider, useChannelSettingsContext };
