import React, { MutableRefObject, ReactElement, useRef, useState } from 'react';

import type { ToggleMenuItemProps } from './UserListItemMenuItems';
import { UserListItemMenuProvider, UserListItemMenuProviderProps } from './context';
import { OperatorToggleMenuItem, MuteToggleMenuItem, BanToggleMenuItem } from './UserListItemMenuItems';
import { classnames } from '../../utils/utils';
import { MenuItems } from '../ContextMenu';
import { DefaultMenuItems, TriggerIcon } from './DefaultElements';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';

export type RenderUserListItemMenuItemsParams = {
  items: {
    OperatorToggleMenuItem: (props: ToggleMenuItemProps) => ReactElement,
    MuteToggleMenuItem: (props: ToggleMenuItemProps) => ReactElement,
    BanToggleMenuItem: (props: ToggleMenuItemProps) => ReactElement,
  },
};
export interface UserListItemMenuProps extends Omit<UserListItemMenuProviderProps, 'children' | 'hideMenu' | 'toggleMenu'> {
  className?: string;
  renderTrigger?: (props: { ref: MutableRefObject<any>, toggleMenu: () => void }) => ReactElement;
  renderMenuItems?: (params: RenderUserListItemMenuItemsParams) => ReactElement;
}

export const UserListItemMenu = (props: UserListItemMenuProps) => {
  const {
    user,
    className,
    renderTrigger = TriggerIcon,
    renderMenuItems = DefaultMenuItems,
  } = props;
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const { config } = useSendbirdStateContext();
  const { userId: currentUserId } = config;

  const toggleMenu = () => {
    setMenuVisibility((prev) => !prev);
  };
  const hideMenu = () => {
    setMenuVisibility(false);
  };

  if (user.userId === currentUserId) {
    return null;
  }
  return (
    <div
      className={classnames('sendbird-user-list-item-menu', className)}
      ref={containerRef}
    >
      <UserListItemMenuProvider
        {...props}
        hideMenu={hideMenu}
        toggleMenu={toggleMenu}
      >
        {renderTrigger({ ref: triggerRef, toggleMenu })}
        {isMenuVisible && (
          <MenuItems
            // TODO: Add id using getObservingId for useElementObserver
            parentRef={triggerRef}
            parentContainRef={containerRef}
            closeDropdown={hideMenu}
          >
            {renderMenuItems({
              items: {
                OperatorToggleMenuItem,
                MuteToggleMenuItem,
                BanToggleMenuItem,
              },
            })}
          </MenuItems>
        )}
      </UserListItemMenuProvider>
    </div>
  );
};

export default UserListItemMenu;
