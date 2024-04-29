import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { RenderUserProfileProps } from '../types';

interface UserProfileContextInterface {
  disableUserProfile: boolean;
  isOpenChannel: boolean;
  renderUserProfile?: ((props: RenderUserProfileProps) => React.ReactElement) | null;
  onUserProfileMessage?: ((channel: GroupChannel) => void) | null;
}

/**
 * user profile goes deep inside the component tree
 * use this context as a short circuit to send in values
 */
const UserProfileContext = React.createContext<UserProfileContextInterface>({
  disableUserProfile: true,
  isOpenChannel: false,
  renderUserProfile: null,
  onUserProfileMessage: null,
});

export type UserProfileProviderProps = React.PropsWithChildren<{
  disableUserProfile?: boolean;
  isOpenChannel?: boolean;
  renderUserProfile?: ((props: RenderUserProfileProps) => React.ReactElement) | null;
  onUserProfileMessage?: ((channel: GroupChannel) => void) | null;
}>;

const UserProfileProvider = ({
  isOpenChannel = false,
  disableUserProfile = false,
  renderUserProfile = null,
  onUserProfileMessage = null,
  children,
}: UserProfileProviderProps) => {
  return (
    <UserProfileContext.Provider
      value={{
        isOpenChannel,
        disableUserProfile,
        renderUserProfile,
        onUserProfileMessage,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export { UserProfileContext, UserProfileProvider };
