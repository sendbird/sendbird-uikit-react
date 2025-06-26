import React, { ReactElement } from 'react';

import './index.scss';

import {
  Colors,
  changeColorToClassName,
} from '../../utils/color';

import Label, { LabelTypography, LabelColors } from '../Label';

export interface DateSeparatorProps {
  children?: string | ReactElement;
  className?: string | Array<string>;
  separatorColor?: Colors;
  hasNewMessageSeparator?: boolean;
}
const DateSeparator = ({
  children = undefined,
  className = '',
  hasNewMessageSeparator = false,
  separatorColor = hasNewMessageSeparator ? Colors.PRIMARY : Colors.ONBACKGROUND_4,
}: DateSeparatorProps): ReactElement => {
  return (
    <div
      id={hasNewMessageSeparator ? 'new-message-separator' : undefined}
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-separator',
      ].join(' ')}
    >
      <div className={['sendbird-separator__left', `${changeColorToClassName(separatorColor)}--background-color`].join(' ')} />
      <div className="sendbird-separator__text">
        {
          children
          || (
            <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
              Date Separator
            </Label>
          )
        }
      </div>
      <div className={['sendbird-separator__right', `${changeColorToClassName(separatorColor)}--background-color`].join(' ')} />
    </div>
  );
};

export default DateSeparator;
