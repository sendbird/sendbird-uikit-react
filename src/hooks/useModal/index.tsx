import React, { useState, useCallback, ReactElement, createContext, useMemo, useContext } from 'react';
import { createPortal } from 'react-dom';
import { match } from 'ts-pattern';

import { noop } from '../../utils/utils';
import Modal, { type ModalProps } from '../../ui/Modal';
import { MODAL_ROOT } from './ModalRoot';

export type OpenGlobalModalWithProps = {
  modalProps: ModalProps,
  childElement: ReactElement,
}

export interface GlobalModalContextInterface {
  openGlobalModalWith: (props: OpenGlobalModalWithProps) => void,
}

const GlobalModalContext = createContext<GlobalModalContextInterface>({
  openGlobalModalWith: noop,
});

export const GlobalModalProvider = ({ children }) => {
  // Idea from https://dev.to/nurislamov/simple-modals-queue-in-react-4g6c
  const [globalModalQueue, setGlobalModalQueue] = useState<Array<OpenGlobalModalWithProps>>([]);

  const openModal = useCallback((props: OpenGlobalModalWithProps) => {
    setGlobalModalQueue((currentQue) => [...currentQue, props]);
  }, []);

  const closeModal = useCallback(() => {
    setGlobalModalQueue((currentQue) =>  currentQue.slice(1));
  }, []);

  const ModalComponent = useMemo(() => () => {
    return match(globalModalQueue)
      .when(q => q.length === 0, () => {
        return <></>;
      })
      .otherwise(() => {
        const { modalProps, childElement } = globalModalQueue[0];
        return createPortal(
          <Modal
            {...{
              ...modalProps,
              className: `sendbird-global-modal ${modalProps?.className}`,
              onClose: closeModal,
            }}
          >
            {childElement}
          </Modal>,
          document.getElementById(MODAL_ROOT) as HTMLElement,
        );
      });
  }, [globalModalQueue]);

  return (
    <GlobalModalContext.Provider
      value={{
        openGlobalModalWith: openModal,
      }}
    >
      <ModalComponent />
      {children}
    </GlobalModalContext.Provider>
  )
};
export const useGlobalModal = (): GlobalModalContextInterface => useContext(GlobalModalContext);

export * from './ModalRoot';
