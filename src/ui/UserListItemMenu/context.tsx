import React, { ReactNode, createContext, useContext } from 'react';
import { Role, type User } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';

import { useToggleBan, useToggleMute, useToggleOperator } from './hooks';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';

interface UserListItemMenuContextInterface extends
  UserListItemMenuContextValues,
  ReturnType<typeof useToggleOperator>,
  ReturnType<typeof useToggleMute>,
  ReturnType<typeof useToggleBan> {
  isCurrentUser: boolean;
  isCurrentUserOperator: boolean;
}
const UserListItemMenuContext = createContext<UserListItemMenuContextInterface>(undefined);

export type OnToggleStateHandlerType = (params: {
  user: User,
  newStatus: boolean,
  error?: Error,
}) => void;
export interface UserListItemMenuContextValues {
  channel?: GroupChannel;
  user: User;
  hideMenu: () => void;
  toggleMenu: () => void;
  onToggleOperatorState?: OnToggleStateHandlerType;
  onToggleMuteState?: OnToggleStateHandlerType;
  onToggleBanState?: OnToggleStateHandlerType;
}
export interface UserListItemMenuProviderProps extends UserListItemMenuContextValues {
  children: ReactNode;
  // NOTE: These three props are not the same as Context
  isOperator?: boolean;
  isMuted?: boolean;
  isBanned?: boolean;
}
export const UserListItemMenuProvider = ({ children, ...values }: UserListItemMenuProviderProps) => {
  const { config } = useSendbirdStateContext();
  const { userId: currentUserId } = config;
  const { channel, user } = values;
  const isCurrentUser = user.userId === currentUserId;
  const isCurrentUserOperator = (() => {
    if (!channel) return false;
    return channel instanceof OpenChannel
      ? channel.isOperator(currentUserId)
      : channel.myRole === Role.OPERATOR;
  })();

  const operatorState = useToggleOperator(values);
  const muteState = useToggleMute(values);
  const banState = useToggleBan(values);

  return (
    <UserListItemMenuContext.Provider value={{
      ...values,
      ...operatorState,
      ...muteState,
      ...banState,
      isCurrentUser,
      isCurrentUserOperator,
    }}>
      {children}
    </UserListItemMenuContext.Provider>
  );
};

export const useUserListItemMenuContext = () => {
  const context = useContext(UserListItemMenuContext);
  if (!context) {
    throw new Error('useUserListItemMenuContext must be used within a UserListItemMenuProvider.');
  }
  return context;
};
