import React, { MouseEvent, ReactNode } from 'react';
import { classnames } from '../../../utils/utils';
import Label, { LabelColors, LabelTypography } from '../../Label';

export interface MenuItemProps {
  className?: string;
  disabled?: boolean;
  tabIndex?: number;
  testID?: string;
  onClick?: (e: MouseEvent<HTMLLIElement | HTMLDivElement>) => void;
  children: ReactNode;
}

export const MenuItem = ({
  className,
  disabled,
  tabIndex = 0,
  testID,
  onClick,
  children,
}: MenuItemProps) => {
  const handleClickEvent = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };
  return (
    <li
      className={classnames('sendbird-menu-item', className)}
      role="menuitem"
      aria-disabled={disabled}
      data-testid={testID}
      tabIndex={tabIndex}
      onClick={handleClickEvent}
      onKeyDown={(e) => { if (e.code === 'Enter') handleClickEvent(e); }}
    >
      <Label
        type={LabelTypography.SUBTITLE_2}
        color={disabled ? LabelColors.ONBACKGROUND_4 : LabelColors.ONBACKGROUND_1}
      >
        {children}
      </Label>
    </li>
  );
};

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
