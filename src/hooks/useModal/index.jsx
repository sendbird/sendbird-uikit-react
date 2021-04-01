// idea from https://github.com/shibe97/react-hooks-use-modal
import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import './index.scss';
import { MODAL_ROOT } from './ModalRoot';

import {
  ModalHeader,
  ModalClose,
  ModalFooter,
} from './Components';

const Modal = ({
  children,
  isOpen = false,
  modalRoot = MODAL_ROOT,
  className = '',
}) => {
  if (isOpen === false) {
    return null;
  }
  return createPortal(
    <div className={`sendbird-modal__wrapper ${className}`}>
      <div className="sendbird-modal__mask" />
      <div className="sendbird-modal__container">{children}</div>
    </div>,
    document.getElementById(modalRoot),
  );
};

const useModal = (className) => {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), [setOpen]);
  const close = useCallback(() => setOpen(false), [setOpen]);

  const ModalWrapper = ({ children }) => (
    <Modal isOpen={isOpen} close={close} className={className}>
      {children}
    </Modal>
  );

  ModalWrapper.propTypes = {
    children: PropTypes.element.isRequired,
  };

  return [ModalWrapper, open, close];
};

export default useModal;
export const ModalComponents = {
  ModalHeader,
  ModalClose,
  ModalFooter,
};
