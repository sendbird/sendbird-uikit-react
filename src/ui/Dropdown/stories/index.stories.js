import React from 'react';
import DropdownMenu, { MenuItem } from '../index.jsx';

import IconButton from "../../IconButton";
import DefaultIcon from '../../../svgs/icon-create.svg';

const description = `
  \`import DropdownMenu, { MenuItem } from "@sendbird/uikit-react/ui/DropdownMenu";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/DropdownMenu',
  component: DropdownMenu,
  subcomponents: { MenuItem },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
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
    {...arg}
  />
);
