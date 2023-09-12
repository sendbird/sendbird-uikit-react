// idea from https://github.com/shibe97/react-hooks-use-modal
import React, { useState, useCallback, ReactElement } from 'react';
import { createPortal } from 'react-dom';

import './index.scss';
import { MODAL_ROOT } from './ModalRoot';

interface ModalProps {
  children: ReactElement;
  isOpen?: boolean;
  modalRoot?: string;
  className?: string;
}
const Modal = ({
  children,
  isOpen = false,
  modalRoot = MODAL_ROOT,
  className = '',
}: ModalProps): ReactElement | null => {
  if (isOpen === false) {
    return null;
  }
  return createPortal(
    <div className={`sendbird-modal__wrapper ${className}`}>
      <div className="sendbird-modal__mask" />
      <div className="sendbird-modal__container">{children}</div>
    </div>,
    document.getElementById(modalRoot) as HTMLElement,
  );
};

const useModal = (className) => {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), [setOpen]);
  const close = useCallback(() => setOpen(false), [setOpen]);

  const ModalWrapper = ({ children }) => (
    <Modal
      className={className}
      isOpen={isOpen}
    >
      {children}
    </Modal>
  );

  return [ModalWrapper, open, close];
};

export default useModal;
export * from './Components';
