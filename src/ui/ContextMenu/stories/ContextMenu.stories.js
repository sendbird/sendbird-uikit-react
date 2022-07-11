import { useRef } from '@storybook/addons';
import React from 'react';
import ContextMenu, { MenuItems, MenuItem } from '../index';

const description = `
  \`import ContextMenu, { MenuItems, MenuItem } from "@sendbird/uikit-react/ui/ContextMenu";\`
  \n A simple context menu component, use menuTrigger & menuItems to render trigger and menu components respectively
`;

export default {
  title: '@sendbird/uikit-react/ui/ContextMenu',
  component: ContextMenu,
  subcomponents: { MenuItem, MenuItems },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (args) => {
  const ref = useRef()
  return (
    <div ref={ref}>
      <ContextMenu
        menuTrigger={(toggleDropdown) =>
          <button onClick={toggleDropdown}>click me to open menu</button>
        }
        menuItems={(closeDropdown) => {
          <MenuItems
            closeDropdown={closeDropdown}
            parentRef={ref}
            parentContainRef={ref}
          >
            <MenuItem>Item 1</MenuItem>
            <MenuItem>Item 2</MenuItem>
          </MenuItems>
        }}
        {...args}
      />
    </div>
  );
}
