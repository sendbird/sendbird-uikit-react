import '../ModerationPanel/admin-panel.scss';

import React from 'react';

import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconColors } from '../../../../ui/Icon';
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
            renderLeft={() => (
              <Icon
                type={item.icon}
                fillColor={IconColors.PRIMARY}
                width={24}
                height={24}
                className="sendbird-channel-settings__accordion-icon"
              />
            )}
            renderMiddle={() => (
              <Label
                type={LabelTypography.SUBTITLE_1}
                color={LabelColors.ONBACKGROUND_1}
              >
                {item.label}
              </Label>
            )}
            renderRight={item.rightComponent}
            renderAccordion={item.accordionComponent}
          />
        );
      })}
    </div>
  );
};

export default MenuListByRole;
