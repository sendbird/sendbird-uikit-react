import React, { KeyboardEvent, MouseEvent, ReactElement, RefObject } from 'react';

import './index.scss';

import Label, { LabelTypography, LabelColors } from '../Label';

export interface ReactionBadgeProps {
  className?: string | Array<string>;
  children: ReactElement;
  count?: number | string;
  isAdd?: boolean;
  selected?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
}
const ReactionBadge = React.forwardRef((props: ReactionBadgeProps, ref: RefObject<HTMLDivElement>): ReactElement => {
  const {
    className,
    children,
    count = '',
    isAdd = false,
    selected = false,
    onClick,
  } = props;

  const getClassNameTail = (): string => {
    if (selected && !isAdd) {
      return '--selected';
    }
    if (isAdd) {
      return '--is-add';
    }
    return '';
  };

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        `sendbird-reaction-badge${getClassNameTail()}`,
      ].join(' ')}
      role="button"
      ref={ref}
      onClick={(e) => onClick?.(e)}
      onKeyDown={(e) => onClick?.(e)}
      tabIndex={0}
    >
      <div className="sendbird-reaction-badge__inner">
        <div className="sendbird-reaction-badge__inner__icon">
          {children}
        </div>
        <Label
          className={(children && count) && 'sendbird-reaction-badge__inner__count'}
          type={LabelTypography.CAPTION_3}
          color={LabelColors.ONBACKGROUND_1}
        >
          {count}
        </Label>
      </div>
    </div>
  );
});

export default ReactionBadge;
