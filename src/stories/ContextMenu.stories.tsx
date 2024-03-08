import React, { RefObject, useRef } from 'react';
import ContextMenu, { MenuItems as MenuItemsComponent, MenuItem as MenuItemComponent } from '../ui/ContextMenu';
import './index.css';

export default {
  title: 'ui/ContextMenu',
  component: ContextMenu,
};

export const Default = (args) => {
  const ref = useRef() as RefObject<HTMLDivElement>;
  return (
    <div ref={ref}>
      <div
        id="sendbird-dropdown-portal"
        className="sendbird-dropdown-portal"
        style={{ height: '200px', position: 'relative' }}
      >
        <ContextMenu
          menuTrigger={(toggleDropdown) =>
            <button onClick={toggleDropdown}>click me to open menu</button>
          }
          menuItems={(closeMenu) => (
            <MenuItemsComponent
              parentRef={ref}
              closeDropdown={closeMenu}
            >
              <MenuItemComponent
                onClick={() => {
                  console.log('MenuItem 1 clicked');
                  closeMenu();
                }}
                disable={false}
              >
                Menu Item 1
              </MenuItemComponent>
              <MenuItemComponent
                onClick={() => {
                  console.log('MenuItem 2 clicked');
                  closeMenu();
                }}
                disable={true}
              >
                Menu Item 2 (Disabled)
              </MenuItemComponent>
              <MenuItemComponent onClick={closeMenu} disable={false}>
                Close Menu
              </MenuItemComponent>
            </MenuItemsComponent>
          )}
          {...args}
        />
      </div>
    </div>
  );
};
