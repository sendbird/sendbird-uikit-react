import React, { ReactElement, MouseEvent, useState } from 'react';
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
  children: ReactElement;
  onClick?: (e: MouseEvent<HTMLLIElement>) => void;
  disable?: boolean;
}
export const MenuItem = ({
  className = '',
  children,
  onClick,
  disable = false,
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
      onClick={handleClickEvent}
      onKeyPress={(e) => { if (e.keyCode === ENTER_KEY) handleClickEvent(e); }}
      tabIndex={0}
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

export const MenuRoot = (): ReactElement => <div id="sendbird-dropdown-portal" />;
export const EmojiReactionListRoot = (): ReactElement => <div id="sendbird-emoji-list-portal" />;

type MenuDisplayingFunc = () => void;
export interface ContextMenuProps {
  menuTrigger: (MenuDisplayingFunc) => ReactElement;
  menuItems: (MenuDisplayingFunc) => ReactElement;
}
export default function ContextMenu({
  menuTrigger,
  menuItems,
}: ContextMenuProps): ReactElement {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="sendbird-context-menu">
      {menuTrigger(() => setShowMenu(!showMenu))}
      {showMenu && menuItems(() => setShowMenu(false))}
    </div>
  );
}
