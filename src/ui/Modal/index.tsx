import React, { ReactElement, ReactNode, useContext, MouseEvent, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import './index.scss';

import { classnames, noop } from '../../utils/utils';
import { MODAL_ROOT } from '../../hooks/useModal/ModalRoot';
import { LocalizationContext } from '../../lib/LocalizationContext';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';

import IconButton from '../IconButton';
import Button, { ButtonTypes } from '../Button';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { useSendbirdStateContext } from '../../lib/Sendbird';
import uuidv4 from '../../utils/uuid';

export interface ModalHeaderProps {
  titleText: string;
  onCloseClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}
export const ModalHeader = ({ titleText, onCloseClick }: ModalHeaderProps): ReactElement => (
  <div className="sendbird-modal__header">
    <Label type={LabelTypography.H_1} color={LabelColors.ONBACKGROUND_1}>
      {titleText}
    </Label>
    <div className="sendbird-modal__close">
      <IconButton width="32px" height="32px" onClick={onCloseClick}>
        <Icon type={IconTypes.CLOSE} fillColor={IconColors.DEFAULT} width="24px" height="24px" />
      </IconButton>
    </div>
  </div>
);

export interface ModalBodyProps {
  children?: ReactNode;
}
export const ModalBody = ({ children }: ModalBodyProps): ReactElement => (
  <div className="sendbird-modal__body">
    <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_2}>
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
  contentClassName?: string | Array<string>;
  isCloseOnClickOutside?: boolean;
  isFullScreenOnMobile?: boolean;
  titleText?: string;
  submitText?: string;
  disabled?: boolean;
  hideFooter?: boolean;
  type?: ButtonTypes;
  onClose?: () => void;
  onSubmit?: (...args: any[]) => void;
  renderHeader?: () => ReactElement;
  customFooter?: ReactNode;
  /** @deprecated Please use `onClose` instead, we will remove `onCancel` in v4. * */
  onCancel?: () => void;
}
export function Modal(props: ModalProps): ReactElement {
  const {
    children = null,
    className = '',
    contentClassName = '',
    isCloseOnClickOutside = false,
    isFullScreenOnMobile = false,
    titleText,
    submitText,
    disabled = false,
    hideFooter = false,
    type = ButtonTypes.DANGER,
    renderHeader,
    onSubmit = noop,
    onClose,
    onCancel,
    customFooter,
  } = props;
  const handleClose = onClose ?? onCancel ?? noop;
  const { eventHandlers } = useSendbirdStateContext();

  const [id] = useState(() => `sbu-modal-${uuidv4()}`);

  useEffect(() => {
    return eventHandlers?.modal?.onMounted?.({ close: handleClose, id });
  }, []);

  const { isMobile } = useMediaQueryContext();
  return createPortal(
    <div className={classnames('sendbird-modal', className, isFullScreenOnMobile && isMobile && 'sendbird-modal--full-mobile')}>
      <div className={classnames('sendbird-modal__content', ...(Array.isArray(contentClassName) ? contentClassName : [contentClassName]))}>
        {renderHeader?.() || <ModalHeader titleText={titleText ?? ''} onCloseClick={handleClose} />}
        <ModalBody>{children}</ModalBody>
        {!hideFooter
          && (customFooter ?? (
            <ModalFooter disabled={disabled} onCancel={handleClose} onSubmit={onSubmit} submitText={submitText ?? ''} type={type} />
          ))}
      </div>
      <div
        className={classnames('sendbird-modal__backdrop', isCloseOnClickOutside && 'sendbird-modal__backdrop--clickoutside')}
        onClick={(e) => {
          e?.stopPropagation();
          if (isCloseOnClickOutside) {
            handleClose();
          }
        }}
      />
    </div>,
    document.getElementById(MODAL_ROOT) as HTMLElement,
  );
}
export default Modal;
