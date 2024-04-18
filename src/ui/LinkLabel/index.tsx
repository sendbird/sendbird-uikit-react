import React, { ReactNode } from 'react';

import Label, { LabelColors, LabelTypography } from '../Label';
import { changeColorToClassName } from '../Label/utils';
import './index.scss';
import { ObjectValues } from '../../utils/typeHelpers/objectValues';
import { openURL } from '../../utils/utils';

const http = /https?:\/\//;

type LinkLabelProps = {
  src: string;
  className?: string | string[];
  type?: ObjectValues<typeof LabelTypography>;
  color?: ObjectValues<typeof LabelColors>;
  children: ReactNode;
};

export default function LinkLabel({ className = '', src, type, color, children }: LinkLabelProps) {
  const url = http.test(src) ? src : `http://${src}`;

  return (
    <a
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-link-label',
        changeColorToClassName(color),
      ].join(' ')}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      // for mobile
      onTouchEnd={(e) => {
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        openURL(url);
      }}
    >
      <Label className="sendbird-link-label__label" type={type} color={color}>
        {children}
      </Label>
    </a>
  );
}

export const LinkLabelTypography = LabelTypography;
export const LinkLabelColors = LabelColors;
