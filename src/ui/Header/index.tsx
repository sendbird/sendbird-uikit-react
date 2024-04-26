import React from 'react';
import type { MouseEvent, KeyboardEvent, TouchEvent, ReactNode } from 'react';
import './index.scss';
import Label, { LabelColors, LabelTypography } from '../Label';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import TextButton from '../TextButton';
import UIIcon, { type IconProps } from '../Icon';

export interface HeaderCustomProps {
  renderLeft?: () => ReactNode;
  renderRight?: () => ReactNode;
  renderMiddle?: (props: HeaderTitleProps) => ReactNode;
}
export interface HeaderProps extends HeaderCustomProps, HeaderTitleProps {
  className?: string;
}

export const Header = ({
  className,
  title,
  subtitle,
  onClickSubtitle,
  renderLeft,
  renderRight,
  renderMiddle = (props) => <Title {...props} />,
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
        {renderMiddle({ title, subtitle, onClickSubtitle })}
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
};

export interface HeaderTitleProps {
  title?: string;
  subtitle?: string;
  onClickSubtitle?: (e: MouseEvent | TouchEvent | KeyboardEvent) => void;
}
const Title = ({
  title,
  subtitle,
  onClickSubtitle,
}: HeaderTitleProps) => {
  return (
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
        onClickSubtitle ? (
          <TextButton
            className="sendbird-ui-header__middle__subtitle__container"
            onClick={onClickSubtitle}
            disableUnderline
          >
            <Label
              className="sendbird-ui-header__middle__subtitle"
              type={LabelTypography.CAPTION_3}
              color={LabelColors.ONBACKGROUND_2}
            >
              {subtitle}
            </Label>
          </TextButton>
        ) : (
          <Label
            className="sendbird-ui-header__middle__subtitle"
            type={LabelTypography.BODY_1}
            color={LabelColors.ONBACKGROUND_2}
          >
            {subtitle}
          </Label>
        )
      )}
    </div>
  );
};

const Icon = (props: IconProps) => <UIIcon {...props} />;

export default Object.assign(Header, { Title, Icon });
