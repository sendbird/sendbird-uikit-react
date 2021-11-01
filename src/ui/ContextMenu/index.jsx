import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './index.scss';

import Label, { LabelTypography, LabelColors } from '../Label';
import { getClassName } from '../../utils';

import MenuItems_ from './items/MenuItems';
import EmojiListItems_ from './items/EmojiListItems';

const ENTER = 13;

export const MenuItems = MenuItems_;
export const EmojiListItems = EmojiListItems_;

export const MenuItem = ({
  className,
  children,
  onClick,
  disable,
}) => {
  const handleClickEvent = (e) => { if (!disable) onClick(e); };
  return (
    <li
      className={getClassName([className, 'sendbird-dropdown__menu-item', disable ? 'disable' : ''])}
      role="menuitem"
      onClick={handleClickEvent}
      onKeyPress={(e) => { if (e.keyCode === ENTER) handleClickEvent(e); }}
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

MenuItem.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
  disable: PropTypes.bool,
};

MenuItem.defaultProps = {
  className: '',
  disable: false,
};

// Root components should be appended before ContextMenu is rendered
export const MenuRoot = () => (
  <div id="sendbird-dropdown-portal" />
);
export const EmojiReactionListRoot = () => (
  <div id="sendbird-emoji-list-portal" />
);

export default function ContextMenu({ menuTrigger, menuItems }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="sendbird-context-menu" style={{ display: 'inline' }}>
      {menuTrigger(() => setShowMenu(!showMenu))}
      {showMenu && menuItems(() => setShowMenu(false))}
    </div>
  );
}

ContextMenu.propTypes = {
  menuTrigger: PropTypes.func.isRequired,
  menuItems: PropTypes.func.isRequired,
};
