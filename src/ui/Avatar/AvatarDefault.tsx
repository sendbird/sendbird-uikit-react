import React from 'react';
import pxToNumber from '../../utils/pxToNumber';
import Icon, { IconColors, IconTypes } from '../Icon';

interface AvatarDefaultProps {
  width: string | number,
  height: string | number,
  text?: string,
}

const AvatarDefault = (props: AvatarDefaultProps) => {
  const { width, height, text } = props;

  let iconWidth = pxToNumber(width);
  let iconHeight = pxToNumber(height);
  if (typeof iconWidth === 'number' && !Number.isNaN(iconWidth)) {
    iconWidth *= 0.575;
  }
  if (typeof iconHeight === 'number' && !Number.isNaN(iconHeight)) {
    iconHeight *= 0.575;
  }

  return (
    <div
      className={`sendbird-avatar-img--default ${text ? 'text' : ''}`}
      style={{ width, height }}
    >
      {
        text
          ? <div
            className='sendbird-avatar-text'
          >{ text }</div>
          : <Icon
            type={IconTypes.USER}
            fillColor={IconColors.CONTENT}
            width={iconWidth}
            height={iconHeight}
          />
      }
    </div>
  );
};

export default AvatarDefault;
