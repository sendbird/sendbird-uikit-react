import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './index.scss';

import Label, { LabelTypography, LabelColors } from '../Label';

import MenuItems_ from './items/MenuItems';
import EmojiListItems_ from './items/EmojiListItems';

const ENTER = 13;

export const MenuItems = MenuItems_;
export const EmojiListItems = EmojiListItems_;

export const MenuItem = ({
  className,
  children,
  onClick,
}) => (
  <li
    className={[
      ...(Array.isArray(className) ? className : [className]),
      'sendbird-dropdown__menu-item',
    ].join(' ')}
    role="menuitem"
    onClick={onClick}
    onKeyPress={(e) => {
      if (e.keyCode === ENTER) {
        onClick(e);
      }
    }}
    tabIndex={0}
  >
    <Label
      className="sendbird-dropdown__menu-item__text"
      type={LabelTypography.SUBTITLE_2}
      color={LabelColors.ONBACKGROUND_1}
    >
      {children}
    </Label>
  </li>
);

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
};

MenuItem.defaultProps = {
  className: '',
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
