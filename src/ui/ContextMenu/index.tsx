import React, { ReactElement, MouseEvent, useState, ReactNode } from 'react';
import './index.scss';

import _MenuItems from './MenuItems';
import { MuteMenuItem } from './items/MuteMenuItem';
import { OperatorMenuItem } from './items/OperatorMenuItem';
import _EmojiListItems from './EmojiListItems';

import { MenuItem as MenuItem_MessageMenu } from '../MessageMenu';
import { classnames } from '../../utils/utils';

// # useElementObserve
export const MENU_OBSERVING_CLASS_NAME = 'sendbird-observing-message-menu';
export const getObservingId = (txt: string | number) => `m_${txt}`;

export const MenuItems = _MenuItems;
export const EmojiListItems = _EmojiListItems;

/**
 * @deprecated
 * Use the `MessageItemProps` from '@sendbird/uikit-react/ui/MessageMenu' instead
 */
export interface MenuItemProps {
  className?: string | Array<string>;
  children: ReactElement | ReactElement[] | ReactNode;
  onClick?: (e: MouseEvent<HTMLLIElement>) => void;
  disable?: boolean;
  /**
   * @deprecated Please use the testID instead
   */
  dataSbId?: string;
  testID?: string;
}
/**
 * @deprecated
 * Use the `MenuItem` from '@sendbird/uikit-react/ui/MessageMenu' instead
 */
export const MenuItem = ({
  className = '',
  children,
  onClick,
  disable = false,
  dataSbId = '',
  testID,
}: MenuItemProps) => {
  return (
    <MenuItem_MessageMenu
      className={classnames(
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-dropdown__menu-item',
        disable ? 'disable' : '',
      )}
      disabled={disable}
      testID={testID ?? dataSbId}
      onClick={onClick}
    >
      {children}
    </MenuItem_MessageMenu>
  );
};

export const MENU_ROOT_ID = 'sendbird-dropdown-portal';
export const MenuRoot = (): ReactElement => (
  <div id={MENU_ROOT_ID} className={MENU_ROOT_ID} />
);

export const EMOJI_MENU_ROOT_ID = 'sendbird-emoji-list-portal';
export const EmojiReactionListRoot = (): ReactElement => <div id={EMOJI_MENU_ROOT_ID} />;

type MenuDisplayingFunc = () => void;
export interface ContextMenuProps {
  menuTrigger?: (func: MenuDisplayingFunc) => ReactElement;
  menuItems: (func: MenuDisplayingFunc) => ReactElement;
  isOpen?: boolean;
  onClick?: (...args: any[]) => void;
}
export default function ContextMenu({
  menuTrigger,
  menuItems,
  isOpen,
  onClick,
}: ContextMenuProps): ReactElement {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div
      className="sendbird-context-menu"
      style={{ display: 'inline' }}
      onClick={onClick}
    >
      {menuTrigger?.(() => setShowMenu(!showMenu))}
      {(showMenu || isOpen) && menuItems(() => setShowMenu(false))}
    </div>
  );
}
export {
  MuteMenuItem,
  OperatorMenuItem,
};
