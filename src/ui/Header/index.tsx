import React, { ReactElement } from 'react';
import './index.scss';
import Label, { LabelColors, LabelTypography } from '../Label';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';

export interface HeaderCustomProps {
  renderLeft?: () => ReactElement;
  renderRight?: () => ReactElement;
  renderMiddle?: () => ReactElement;
}
export interface HeaderProps extends HeaderCustomProps {
  className?: string;
  title?: string;
  subtitle?: string;
}
export const Header = ({
  className,
  title,
  subtitle,
  renderLeft,
  renderRight,
  renderMiddle,
}: HeaderProps) => {
  let isMobile = false;
  try {
    isMobile = useMediaQueryContext?.()?.isMobile;
  } catch (err) {
    // TODO: handle it
  }

  return (
    <div className={`sendbird-ui-header ${className}`}>
      {
        renderLeft ? (
          <div className={`sendbird-ui-header__left sendbird-ui-header--is-${isMobile ? 'mobile' : 'desktop'}`}>
            {renderLeft?.()}
          </div>
        ) : null
      }
      <div className="sendbird-ui-header__middle">
        {renderMiddle?.() ?? (
          <div className="sendbird-ui-header__middle">
            {title && (
              <Label
                className="sendbird-ui-header__middle__title"
                type={LabelTypography.H_2}
                color={LabelColors.ONBACKGROUND_1}
              >
                {title}
              </Label>
            )}
            {subtitle && (
              <Label
                className="sendbird-ui-header__middle__subtitle"
                type={LabelTypography.BODY_1}
                color={LabelColors.ONBACKGROUND_2}
              >
                {subtitle}
              </Label>
            )}
          </div>
        )}
      </div>
      {
        renderRight ? (
          <div className={`sendbird-ui-header__right sendbird-ui-header--is-${isMobile ? 'mobile' : 'desktop'}`}>
            {renderRight?.()}
          </div>
        ) : null
      }
    </div>
  );
}

export default Header;
