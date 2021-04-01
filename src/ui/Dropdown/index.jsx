import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import onClickOutside from '../../hooks/onClickOutside';

import Label, { LabelTypography, LabelColors } from '../Label';

export const MenuItem = ({ children, onClick }) => (
  <li
    className="sendbird-dropdown__menu-item"
    role="menuitem"
    onClick={onClick}
    onKeyPress={(e) => {
      if (e.keyCode === 13) {
        onClick(e);
      }
    }}
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
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
};

/**
 * For now, this is not a dropdown component that should be used inside forms
 * This should be used in a list or in a nav-bar where you can click
 * and a list of options opens up
 * Also closing the dropdown is a manual operation for now
 * More options, Aria labels etc should be implemented
 */
const DropdownMenu = ({ renderButton, renderItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  onClickOutside({
    ref: wrapperRef,
    callback: () => setIsOpen(false),
  });
  return (
    <div className="sendbird-dropdown" ref={wrapperRef}>
      <div className="sendbird-dropdown__button">
        {renderButton(() => setIsOpen(!isOpen)/** toggle-menu */)}
      </div>
      {
        isOpen && (
          <ul className="sendbird-dropdown__menu">
            {renderItems(() => setIsOpen(false)/** close-menu */)}
          </ul>
        )
      }
    </div>
  );
};

DropdownMenu.propTypes = {
  renderButton: PropTypes.func.isRequired,
  renderItems: PropTypes.func.isRequired,
};

export default DropdownMenu;
