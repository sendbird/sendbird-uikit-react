import React, { ReactElement, useLayoutEffect, useRef, useCallback } from 'react';

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
  onVisibilityChange?: (isVisible: boolean) => void;
}

const DateSeparator = ({
  children = undefined,
  className = '',
  hasNewMessageSeparator = false,
  onVisibilityChange,
  separatorColor = hasNewMessageSeparator ? Colors.PRIMARY : Colors.ONBACKGROUND_4,
}: DateSeparatorProps): ReactElement => {
  const separatorRef = useRef<HTMLDivElement>(null);

  const handleVisibilityChange = useCallback((isVisible: boolean) => {
    onVisibilityChange?.(isVisible);
  }, [onVisibilityChange]);

  useLayoutEffect(() => {
    const element = separatorRef.current;
    if (!element || !hasNewMessageSeparator || !onVisibilityChange) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting;
          handleVisibilityChange(visible);
        });
      },
      {
        threshold: 1.0,
        rootMargin: '0px',
        root: null, // viewport를 기준으로 관찰
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasNewMessageSeparator, handleVisibilityChange, onVisibilityChange]);

  return (
    <div
      ref={separatorRef}
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
