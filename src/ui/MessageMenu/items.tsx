import React, { FocusEvent, MouseEvent, MutableRefObject, ReactNode } from 'react';
import IconButton from '../IconButton';
import Icon, { IconColors, IconProps, IconTypes } from '../Icon';
import { classnames, noop } from '../../utils/utils';
import Label, { LabelColors, LabelTypography } from '../Label';

import './index.scss';

export interface TriggerIconProps {
  toggleDropdown: () => void;
  ref: MutableRefObject<any>;
  setSupposedHover: (bool: boolean) => void;
  onClick?: (e: MouseEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  renderIcon?: (props: IconProps) => ReactNode;
}
export const TriggerIcon = ({
  toggleDropdown,
  ref,
  onClick = noop,
  onBlur = noop,
  setSupposedHover = noop,
  renderIcon = (props) => <Icon {...props} />,
}: TriggerIconProps) => {
  return (
    <IconButton
      ref={ref}
      width="32px"
      height="32px"
      onClick={(e) => {
        toggleDropdown();
        setSupposedHover(true);
        onClick(e);
      }}
      onBlur={(e) => {
        setSupposedHover(false);
        onBlur(e);
      }}
    >
      {renderIcon({
        type: IconTypes.MORE,
        fillColor: IconColors.CONTENT_INVERSE,
        width: '24px',
        height: '24px',
      })}
    </IconButton>
  );
};

export interface MenuItemProps {
  className?: string;
  disabled?: boolean;
  tabIndex?: number;
  testID?: string;
  onClick?: (e: MouseEvent<HTMLLIElement>) => void;
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

export type PrebuildMenuItemPropsType = Omit<MenuItemProps, 'children'> & Partial<Pick<MenuItemProps, 'children'>>;
