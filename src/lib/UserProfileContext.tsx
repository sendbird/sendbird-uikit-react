import React, { useContext } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { RenderUserProfileProps } from '../types';
import { useSendbirdStateContext } from './Sendbird';

interface UserProfileContextInterface {
  isOpenChannel: boolean;
  disableUserProfile: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  onStartDirectMessage?: (channel: GroupChannel) => void;

  /**
   * @deprecated This prop has been renamed to `onStartDirectMessage`.
   */
  onUserProfileMessage?: (channel: GroupChannel) => void;
}

/**
 * user profile goes deep inside the component tree
 * use this context as a short circuit to send in values
 */
export const UserProfileContext = React.createContext<UserProfileContextInterface>({
  disableUserProfile: true,
  isOpenChannel: false,
});

export type UserProfileProviderProps = React.PropsWithChildren<
  Partial<UserProfileContextInterface>
  & {
    /** This prop is optional. It is no longer necessary to provide it because the value can be accessed through SendbirdStateContext. */
    disableUserProfile?: boolean;
    /** This prop is optional. It is no longer necessary to provide it because the value can be accessed through SendbirdStateContext. */
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  }
>;

export const useUserProfileContext = () => useContext(UserProfileContext);

export const UserProfileProvider = ({
  isOpenChannel = false,
  disableUserProfile: _disableUserProfile = false,
  renderUserProfile: _renderUserProfile,
  onUserProfileMessage: _onUserProfileMessage,
  onStartDirectMessage: _onStartDirectMessage,
  children,
}: UserProfileProviderProps) => {
  const { config } = useSendbirdStateContext();
  const onStartDirectMessage = _onStartDirectMessage ?? _onUserProfileMessage ?? config.onStartDirectMessage;

  return (
    <UserProfileContext.Provider
      value={{
        isOpenChannel,
        disableUserProfile: _disableUserProfile ?? !config.common.enableUsingDefaultUserProfile,
        renderUserProfile: _renderUserProfile ?? config.renderUserProfile,
        onStartDirectMessage,
        /** legacy of onStartDirectMessage */
        onUserProfileMessage: onStartDirectMessage,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};
