import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { RenderUserProfileProps } from '../types';
interface UserProfileContextInterface {
    disableUserProfile: boolean;
    isOpenChannel: boolean;
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
    onUserProfileMessage?: (channel: GroupChannel) => void;
}
/**
 * user profile goes deep inside the component tree
 * use this context as a short circuit to send in values
 */
declare const UserProfileContext: React.Context<UserProfileContextInterface>;
export type UserProfileProviderProps = React.PropsWithChildren<{
    disableUserProfile?: boolean;
    isOpenChannel?: boolean;
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
    onUserProfileMessage?: (channel: GroupChannel) => void;
}>;
declare const UserProfileProvider: ({ isOpenChannel, disableUserProfile, renderUserProfile, onUserProfileMessage, children, }: UserProfileProviderProps) => React.JSX.Element;
export { UserProfileContext, UserProfileProvider };
