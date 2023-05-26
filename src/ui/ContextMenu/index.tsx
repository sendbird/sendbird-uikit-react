import React, { ReactElement, MouseEvent, useState, ReactNode } from 'react';
import './index.scss';

import _MenuItems from './MenuItems';
import _EmojiListItems from './EmojiListItems';

import { getClassName } from '../../utils';
import Label, { LabelTypography, LabelColors } from '../Label';

const ENTER_KEY = 13;

export const MenuItems = _MenuItems;
export const EmojiListItems = _EmojiListItems;

export interface MenuItemProps {
  className?: string | Array<string>;
  children: ReactElement | ReactElement[] | ReactNode;
  onClick?: (e: MouseEvent<HTMLLIElement>) => void;
  disable?: boolean;
  dataId?: string;
}
export const MenuItem = ({
  className = '',
  children,
  onClick,
  disable = false,
  dataId = '',
}: MenuItemProps): ReactElement => {
  const handleClickEvent = (e) => {
    if (!disable && onClick) {
      onClick?.(e);
    }
  };
  return (
    <li
      className={getClassName([className, 'sendbird-dropdown__menu-item', disable ? 'disable' : ''])}
      role="menuitem"
      aria-disabled={disable ? true : false}
      onClick={handleClickEvent}
      onKeyPress={(e) => { if (e.keyCode === ENTER_KEY) handleClickEvent(e); }}
      tabIndex={0}
      data-sb-id={`message_context_menu${dataId ? `_${dataId}` : ''}`}
    >
      <Label
        className="sendbird-dropdown__menu-item__text"
        type={LabelTypography.SUBTITLE_2}
        color={disable ? LabelColors.ONBACKGROUND_4 : LabelColors.ONBACKGROUND_1}
      >
        {children}
      </Label>
    </li>
  );
};

export const MenuRoot = (): ReactElement => (
  <div
    id="sendbird-dropdown-portal"
    className="sendbird-dropdown-portal"
  />
);

// For the test environment
export const EmojiReactionListRoot = (): ReactElement => <div id="sendbird-emoji-list-portal" />;

type MenuDisplayingFunc = () => void;
export interface ContextMenuProps {
  menuTrigger?: (func: MenuDisplayingFunc) => ReactElement;
  menuItems: (func: MenuDisplayingFunc) => ReactElement;
  isOpen?: boolean;
}
export default function ContextMenu({
  menuTrigger,
  menuItems,
  isOpen,
}: ContextMenuProps): ReactElement {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div
      className="sendbird-context-menu"
      style={{ display: 'inline' }}
    >
      {menuTrigger?.(() => setShowMenu(!showMenu))}
      {(showMenu || isOpen) && menuItems(() => setShowMenu(false))}
    </div>
  );
}
