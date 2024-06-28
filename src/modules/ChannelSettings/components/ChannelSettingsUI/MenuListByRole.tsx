import '../ModerationPanel/admin-panel.scss';

import React from 'react';

import Label from '../../../../ui/Label';
import Icon from '../../../../ui/Icon';
import { isOperator } from '../../../Channel/context/utils';

import MenuItem from './MenuItem';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import useMenuItems from './hooks/useMenuItems';

const MenuListByRole = ({ menuItems }: { menuItems: ReturnType<typeof useMenuItems> }) => {
  const { channel } = useChannelSettingsContext();
  const menuItemsByRole = isOperator(channel) ? menuItems.operator : menuItems.nonOperator;

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
          />
        );
      })}
    </div>
  );
};

export default MenuListByRole;
