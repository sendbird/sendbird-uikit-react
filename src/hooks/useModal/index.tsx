// idea from https://github.com/shibe97/react-hooks-use-modal
import React, { useState, useCallback, ReactElement, createContext, useMemo, useContext } from 'react';
import { createPortal } from 'react-dom';

import './index.scss';

import { noop } from '../../utils/utils';
import Modal, { type ModalProps } from '../../ui/Modal';
import { MODAL_ROOT } from './ModalRoot';

export type OpenGlobalModalWithProps = {
  modalProps: ModalProps,
  childElement: ReactElement,
}

export interface GlobalModalContextInterface {
  openGlobalModalWith: (props: OpenGlobalModalWithProps) => void,
  closeGlobalModal: () => void,
}

const GlobalModalContext = createContext<GlobalModalContextInterface>({
  openGlobalModalWith: noop,
  closeGlobalModal: noop,
});

export const GlobalModalProvider = ({ children }) => {
  const [globalModalProps, setGlobalModalProps] = useState<ModalProps | null>(null);
  const [globalModalContents, setGlobalModalContents] = useState<ReactElement | null>(null);

  const ModalComponent = useMemo(() => () => {
    if (!globalModalContents) {
      return <></>;
    }
    return createPortal(
      <Modal
        {...globalModalProps}
      >
        {globalModalContents}
      </Modal>,
      document.getElementById(MODAL_ROOT) as HTMLElement,
    )
  }, [globalModalProps, globalModalContents]);

  const openGlobalModalWith = useCallback((props: OpenGlobalModalWithProps) => {
    const { modalProps, childElement } = props;
    setGlobalModalProps(modalProps);
    setGlobalModalContents(childElement);
    open();
  }, [open]);
  const closeGlobalModal = useCallback(() => {
    setGlobalModalProps(null);
    setGlobalModalContents(null);
    close();
  }, [close]);

  return (
    <GlobalModalContext.Provider
      value={{
        openGlobalModalWith,
        closeGlobalModal,
      }}
    >
      <ModalComponent />
      {children}
    </GlobalModalContext.Provider>
  )
};
export const useGlobalModal = (): GlobalModalContextInterface => useContext(GlobalModalContext);

export { MODAL_ROOT } from './ModalRoot';
export * from './Components';
