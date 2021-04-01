import React from 'react';
import DropdownMenu, { MenuItem } from '../index.jsx';

import IconButton from "../../IconButton";
import DefaultIcon from '../../../svgs/icon-create.svg';

export default { title: 'UI Components/DropdownMenu' };

export const simpleDropdownMenu = () => (
  <DropdownMenu
    renderButton={(toggleDropdown) => (
      <IconButton
        onClick={toggleDropdown}
        height="36px"
        width="36px"
      >
        <DefaultIcon />
      </IconButton>
    )}
    renderItems={(closeDropdown) => (
      <>
        <MenuItem onClick={e => { alert("clicked 1"); closeDropdown(); }}>
          option1
        </MenuItem>
        <MenuItem onClick={e => { alert("clicked 2"); closeDropdown(); }}>
          option2
        </MenuItem>
      </>
    )}
  />
);
