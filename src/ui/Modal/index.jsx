import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

import './index.scss';

import { LocalizationContext } from '../../lib/LocalizationContext';
import { MODAL_ROOT } from '../../hooks/useModal/ModalRoot';
import IconButton from '../IconButton';
import Icon, { IconTypes, IconColors } from '../Icon';
import Button, { ButtonTypes } from '../Button';
import Label, { LabelTypography, LabelColors } from '../Label';
import { noop } from '../../utils/utils';

export const ModalHeader = ({ titleText }) => (
  <div className="sendbird-modal__header">
    <Label type={LabelTypography.H_1} color={LabelColors.ONBACKGROUND_1}>
      {titleText}
    </Label>
  </div>
);
ModalHeader.propTypes = {
  titleText: PropTypes.string.isRequired,
};

export const ModalBody = ({ children }) => (
  <div className="sendbird-modal__body">{children}</div>
);
ModalBody.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.arrayOf(PropTypes.element.isRequired),
  ]),
};
ModalBody.defaultProps = {
  children: null,
};

export const ModalFooter = ({
  onSubmit,
  onCancel,
  disabled = false,
  submitText,
  type,
}) => {
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div className="sendbird-modal__footer">
      <Button type={ButtonTypes.SECONDARY} onClick={onCancel}>
        <Label type={LabelTypography.BUTTON_1} color={LabelColors.ONBACKGROUND_1}>
          {stringSet.BUTTON__CANCEL}
        </Label>
      </Button>
      <Button type={type} disabled={disabled} onClick={onSubmit}>
        {submitText}
      </Button>
    </div>
  );
};

ModalFooter.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};
ModalFooter.defaultProps = {
  disabled: false,
  type: ButtonTypes.DANGER,
};

export default function Modal(props) {
  const {
    children,
    onCancel,
    onSubmit = noop,
    disabled,
    submitText,
    titleText,
    hideFooter,
    type,
  } = props;
  return createPortal((
    <div className="sendbird-modal">
      <div className="sendbird-modal__content">
        <ModalHeader titleText={titleText} />
        <ModalBody>{children}</ModalBody>
        {
          !hideFooter && (
            <ModalFooter
              disabled={disabled}
              onCancel={onCancel}
              onSubmit={onSubmit}
              submitText={submitText}
              type={type}
            />
          )
        }
        <div className="sendbird-modal__close">
          <IconButton
            width="32px"
            height="32px"
            onClick={onCancel}
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
      <div className="sendbird-modal__backdrop" />
    </div>
  ), document.getElementById(MODAL_ROOT));
}

Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  hideFooter: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};
Modal.defaultProps = {
  children: null,
  hideFooter: false,
  disabled: false,
  type: ButtonTypes.DANGER,
};
