import React, { MutableRefObject, ReactElement, useEffect, useRef, useState } from 'react';

import type { ToggleMenuItemProps } from './UserListItemMenuItems';
import { UserListItemMenuProvider, UserListItemMenuProviderProps } from './context';
import { OperatorToggleMenuItem, MuteToggleMenuItem, BanToggleMenuItem } from './UserListItemMenuItems';
import { classnames } from '../../utils/utils';
import { MenuItems } from '../ContextMenu';
import { DefaultMenuItems, TriggerIcon } from './DefaultElements';
import useSendbird from '../../lib/Sendbird/context/hooks/useSendbird';

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

  const { state: { config } } = useSendbird();
  const { userId: currentUserId } = config;

  const toggleMenu = () => {
    setMenuVisibility((prev) => !prev);
  };
  const hideMenu = () => {
    setMenuVisibility(false);
  };

  useEffect(() => {
    const root = containerRef.current?.closest?.('.sendbird-user-list-item--small, .sendbird-user-list-item') as HTMLElement | null;
    if (!root) return;

    if (isMenuVisible) root.classList.add('sendbird-icon--pressed');
    else root.classList.remove('sendbird-icon--pressed');

    return () => root.classList.remove('sendbird-icon--pressed');
  }, [isMenuVisible]);

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
