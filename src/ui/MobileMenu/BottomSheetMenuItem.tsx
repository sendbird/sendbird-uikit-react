import React from 'react';
import { MenuItemProps } from '../MessageMenu/menuItems/MessageMenuItems';
import { classnames } from '../../utils/utils';

export const BottomSheetMenuItem = ({
  className,
  disabled = false,
  tabIndex = 0,
  testID,
  onClick,
  children,
}: MenuItemProps) => {
  return (
    <div
      className={classnames('sendbird-message__bottomsheet--action', className)}
      role="menuitem"
      tabIndex={tabIndex}
      aria-disabled={disabled}
      onClick={onClick}
      data-testid={testID}
    >
      {children}
    </div>
  );
};
