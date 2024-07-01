import React, { MutableRefObject } from 'react';
import IconButton from '../IconButton';
import Icon, { IconColors, IconTypes } from '../Icon';
import { RenderUserListItemMenuItemsParams } from './UserListItemMenu';

interface TriggerIconProps {
  toggleMenu: () => void;
  ref: MutableRefObject<any>;
}
export const TriggerIcon = ({
  toggleMenu,
  ref,
}: TriggerIconProps) => {
  return (
    <IconButton
      ref={ref}
      className="sendbird-user-message__more__menu"
      width="32px"
      height="32px"
      onClick={toggleMenu}
    >
      <Icon
        width="24px"
        height="24px"
        type={IconTypes.MORE}
        fillColor={IconColors.CONTENT_INVERSE}
      />
    </IconButton>
  );
};

export const DefaultMenuItems = ({ items }: RenderUserListItemMenuItemsParams) => {
  const {
    OperatorToggleMenuItem,
    MuteToggleMenuItem,
    BanToggleMenuItem,
  } = items;
  return (
    <>
      <OperatorToggleMenuItem />
      <MuteToggleMenuItem />
      <BanToggleMenuItem />
    </>
  );
};
