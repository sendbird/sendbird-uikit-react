import React, { ReactElement, useLayoutEffect, useRef, useCallback } from 'react';

import './index.scss';

import {
  Colors,
  changeColorToClassName,
} from '../../utils/color';

import Label, { LabelTypography, LabelColors } from '../Label';

export interface NewMessageIndicatorProps {
  children?: string | ReactElement;
  className?: string | Array<string>;
  separatorColor?: Colors;
  onVisibilityChange?: (isVisible: boolean) => void;
}

const NewMessageIndicator = ({
  children = undefined,
  className = '',
  onVisibilityChange,
  separatorColor = Colors.PRIMARY,
}: NewMessageIndicatorProps): ReactElement => {
  const separatorRef = useRef<HTMLDivElement>(null);

  const handleVisibilityChange = useCallback((isVisible: boolean) => {
    onVisibilityChange?.(isVisible);
  }, [onVisibilityChange]);

  useLayoutEffect(() => {
    const element = separatorRef.current;
    if (!element || !onVisibilityChange) return;

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
        root: null,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleVisibilityChange, onVisibilityChange]);

  return (
    <div
      ref={separatorRef}
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
            <Label type={LabelTypography.CAPTION_2} color={LabelColors.PRIMARY}>
              New Messages
            </Label>
          )
        }
      </div>
      <div className={['sendbird-separator__right', `${changeColorToClassName(separatorColor)}--background-color`].join(' ')} />
    </div>
  );
};

export default NewMessageIndicator;
