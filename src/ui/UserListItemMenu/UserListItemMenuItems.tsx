import React, { ReactNode } from 'react';
import { MenuItem, MenuItemProps } from '../MessageMenu';
import { useUserListItemMenuContext } from './context';
import { useLocalization } from '../../lib/LocalizationContext';

export interface ToggleMenuItemProps extends Omit<MenuItemProps, 'children'> {
  children?: ReactNode;
}
export const OperatorToggleMenuItem = (props: ToggleMenuItemProps) => {
  const { stringSet } = useLocalization();
  const {
    isOperator,
    toggleOperator,
    isCurrentUser,
    isCurrentUserOperator,
    hideMenu,
  } = useUserListItemMenuContext();

  if (!isCurrentUserOperator) return <></>;
  return (
    <MenuItem
      {...props}
      onClick={(e) => {
        props?.onClick?.(e);
        toggleOperator();
        hideMenu();
      }}
      disabled={isCurrentUser}
    >
      {props?.children ?? (
        isOperator
          ? stringSet.CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR
          : stringSet.CHANNEL_SETTING__MODERATION__REGISTER_AS_OPERATOR
      )}
    </MenuItem>
  );
};

export const MuteToggleMenuItem = (props: ToggleMenuItemProps) => {
  const { stringSet } = useLocalization();
  const {
    isMuted,
    toggleMute,
    isCurrentUserOperator,
    hideMenu,
    channel,
  } = useUserListItemMenuContext();

  if (!isCurrentUserOperator || channel?.isBroadcast) return <></>;
  return (
    <MenuItem
      {...props}
      onClick={(e) => {
        props?.onClick?.(e);
        toggleMute();
        hideMenu();
      }}
    >
      {props?.children ?? (
        isMuted
          ? stringSet.CHANNEL_SETTING__MODERATION__UNMUTE
          : stringSet.CHANNEL_SETTING__MODERATION__MUTE
      )}
    </MenuItem>
  );
};

export const BanToggleMenuItem = (props: ToggleMenuItemProps) => {
  const { stringSet } = useLocalization();
  const {
    isBanned,
    toggleBan,
    isCurrentUserOperator,
    hideMenu,
  } = useUserListItemMenuContext();

  if (!isCurrentUserOperator) return <></>;
  return (
    <MenuItem
      {...props}
      onClick={(e) => {
        props?.onClick?.(e);
        toggleBan();
        hideMenu();
      }}
    >
      {props?.children ?? (
        isBanned
          ? stringSet.CHANNEL_SETTING__MODERATION__UNBAN
          : stringSet.CHANNEL_SETTING__MODERATION__BAN
      )}
    </MenuItem>
  );
};
