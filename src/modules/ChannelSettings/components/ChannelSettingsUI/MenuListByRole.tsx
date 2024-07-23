import '../ModerationPanel/admin-panel.scss';
import '../UserPanel/user-panel.scss';

import React, { useState } from 'react';

import Label from '../../../../ui/Label';
import Icon from '../../../../ui/Icon';
import { isOperator } from '../../../Channel/context/utils';

import MenuItem from './MenuItem';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import useMenuItems from './hooks/useMenuItems';

interface MenuListByRoleProps {
  menuItems: ReturnType<typeof useMenuItems>;
}
export const MenuListByRole = ({
  menuItems,
}: MenuListByRoleProps) => {
  const { channel } = useChannelSettingsContext();
  const menuItemsByRole = isOperator(channel) ? menuItems.operator : menuItems.nonOperator;
  // State to track the open accordion key
  const [openAccordionKey, setOpenAccordionKey] = useState<string | null>(null);

  return (
    <div className="sendbird-channel-settings__operator">
      {Object.entries(menuItemsByRole).map(([key, item]) => {
        if (item.hideMenu) return null;
        return (
          <MenuItem
            key={key}
            onClick={item.onClick}
            onKeyDown={item.onKeyDown}
            renderLeft={() => <Icon {...item.icon} />}
            renderMiddle={() => <Label {...item.label} />}
            renderRight={item.rightComponent}
            renderAccordion={item.accordionComponent}
            accordionOpened={openAccordionKey === key}
            setAccordionOpened={() => {
              setOpenAccordionKey((prevKey) => (prevKey === key ? null : key));
            }}
          />
        );
      })}
    </div>
  );
};

export default MenuListByRole;
