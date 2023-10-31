import React, { ReactElement, ReactNode, useContext } from 'react';
import { createPortal } from 'react-dom';

import './index.scss';

import { noop } from '../../utils/utils';
import { MODAL_ROOT } from '../../hooks/useModal/ModalRoot';
import { LocalizationContext } from '../../lib/LocalizationContext';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';

import IconButton from '../IconButton';
import Button, { ButtonTypes } from '../Button';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';

export interface ModalHeaderProps {
  titleText: string;
}
export const ModalHeader = ({ titleText }: ModalHeaderProps): ReactElement => (
  <div className="sendbird-modal__header">
    <Label type={LabelTypography.H_1} color={LabelColors.ONBACKGROUND_1}>
      {titleText}
    </Label>
  </div>
);

export interface ModalBodyProps {
  children?: ReactNode;
}
export const ModalBody = ({ children }: ModalBodyProps): ReactElement => (
  <div className="sendbird-modal__body">
    <Label
      type={LabelTypography.SUBTITLE_1}
      color={LabelColors.ONBACKGROUND_2}
    >
      {children}
    </Label>
  </div>
);

export interface ModalFooterProps {
  submitText: string;
  disabled?: boolean;
  type?: ButtonTypes;
  onCancel: () => void;
  onSubmit: () => void;
  hideCancelButton?: boolean;
}
export const ModalFooter = ({
  submitText,
  disabled = false,
  hideCancelButton = false,
  type = ButtonTypes.DANGER,
  onSubmit,
  onCancel,
}: ModalFooterProps): ReactElement => {
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div className="sendbird-modal__footer">
      {!hideCancelButton && (
        <Button type={ButtonTypes.SECONDARY} onClick={onCancel}>
          <Label type={LabelTypography.BUTTON_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.BUTTON__CANCEL}
          </Label>
        </Button>
      )}
      <Button type={type} disabled={disabled} onClick={onSubmit}>
        {submitText}
      </Button>
    </div>
  );
};

export interface ModalProps {
  children?: ReactNode;
  className?: string;
  isCloseOnClickOutside?: boolean;
  isFullScreenOnMobile?: boolean;
  titleText?: string;
  submitText?: string;
  disabled?: boolean;
  hideFooter?: boolean;
  type?: ButtonTypes;
  /**
   * Do not use this! We will deprecate onCancel in v4.
   */
  onCancel?: () => void;
  onClose?: () => void;
  onSubmit?: (...args: any[]) => void;
  renderHeader?: () => ReactElement;
}
export function Modal(props: ModalProps): ReactElement {
  const {
    children = null,
    className = '',
    isCloseOnClickOutside = false,
    isFullScreenOnMobile = false,
    titleText,
    submitText,
    disabled = false,
    hideFooter = false,
    type = ButtonTypes.DANGER,
    /**
     * Do not use this! We will deprecate onCancel in v4.
     */
    onCancel = noop,
    onClose,
    onSubmit = noop,
    renderHeader,
  } = props;
  const handleClose = onClose ?? onCancel;

  const { isMobile } = useMediaQueryContext();
  return createPortal((
    <div className={`
      sendbird-modal ${className}
      ${(isFullScreenOnMobile && isMobile) ? 'sendbird-modal--full-mobile' : ''}
    `}>
      <div className="sendbird-modal__content">
        {renderHeader?.() || (
          <ModalHeader titleText={titleText ?? ''} />
        )}
        <ModalBody>{children}</ModalBody>
        {
          !hideFooter && (
            <ModalFooter
              disabled={disabled}
              onCancel={handleClose}
              onSubmit={onSubmit}
              submitText={submitText ?? ''}
              type={type}
            />
          )
        }
        <div className="sendbird-modal__close">
          <IconButton
            width="32px"
            height="32px"
            onClick={handleClose}
          >
            <Icon
              type={IconTypes.CLOSE}
              fillColor={IconColors.DEFAULT}
              width="24px"
              height="24px"
            />
          </IconButton>
        </div>
      </div>
      <div
        className={`
          sendbird-modal__backdrop
          ${isCloseOnClickOutside && 'sendbird-modal__backdrop--clickoutside'}
        `}
        onClick={(e) => {
          e?.stopPropagation();
          if (isCloseOnClickOutside) {
            handleClose();
          }
        }}
      />
    </div>
  ), document.getElementById(MODAL_ROOT) as HTMLElement);
}
export default Modal;
