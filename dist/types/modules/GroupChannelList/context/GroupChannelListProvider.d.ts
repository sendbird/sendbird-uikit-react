import React from 'react';
import type { User } from '@sendbird/chat';
import type { GroupChannel, GroupChannelCreateParams, GroupChannelFilterParams } from '@sendbird/chat/groupChannel';
import { GroupChannelCollectionParams } from '@sendbird/chat/groupChannel';
import { useGroupChannelList } from '@sendbird/uikit-tools';
import type { CHANNEL_TYPE } from '../../CreateChannel/types';
import type { UserProfileProviderProps } from '../../../lib/UserProfileContext';
import { PartialRequired } from '../../../utils/typeHelpers/partialRequired';
type OnCreateChannelClickParams = {
    users: Array<string>;
    onClose: () => void;
    channelType: CHANNEL_TYPE;
};
type ChannelListDataSource = ReturnType<typeof useGroupChannelList>;
type ChannelListQueryParamsType = Omit<GroupChannelCollectionParams, 'filter'> & GroupChannelFilterParams;
interface ContextBaseType {
    onChannelSelect(channel: GroupChannel | null): void;
    onChannelCreated(channel: GroupChannel): void;
    className: string | string[];
    selectedChannelUrl?: string;
    allowProfileEdit: boolean;
    disableAutoSelect: boolean;
    isTypingIndicatorEnabled: boolean;
    isMessageReceiptStatusEnabled: boolean;
    channelListQueryParams?: ChannelListQueryParamsType;
    onThemeChange?(theme: string): void;
    onCreateChannelClick?(params: OnCreateChannelClickParams): void;
    onBeforeCreateChannel?(users: string[]): GroupChannelCreateParams;
    onUserProfileUpdated?(user: User): void;
}
export interface GroupChannelListContextType extends ContextBaseType, ChannelListDataSource {
    typingChannelUrls: string[];
}
export interface GroupChannelListProviderProps extends PartialRequired<ContextBaseType, 'onChannelSelect' | 'onChannelCreated'>, Pick<UserProfileProviderProps, 'onUserProfileMessage' | 'renderUserProfile' | 'disableUserProfile'> {
    children?: React.ReactNode;
}
export declare const GroupChannelListContext: React.Context<GroupChannelListContextType>;
export declare const GroupChannelListProvider: (props: GroupChannelListProviderProps) => React.JSX.Element;
export declare const useGroupChannelListContext: () => GroupChannelListContextType;
export {};
