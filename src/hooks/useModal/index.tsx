import React, { useState, useCallback, ReactElement, createContext, useMemo, useContext } from 'react';
import { match } from 'ts-pattern';

import { classnames, noop } from '../../utils/utils';
import Modal, { type ModalProps } from '../../ui/Modal';

export type OpenGlobalModalProps = {
  modalProps: ModalProps;
  childElement: (props: { closeModal: () => void }) => ReactElement;
};
export type GlobalModalProviderProps = React.PropsWithChildren<unknown>;
export interface GlobalModalContextInterface {
  openModal: (props: OpenGlobalModalProps) => void;
}

const GlobalModalContext = createContext<GlobalModalContextInterface>({
  openModal: noop,
});

export const GlobalModalProvider = ({ children }: GlobalModalProviderProps) => {
  // Idea from https://dev.to/nurislamov/simple-modals-queue-in-react-4g6c
  const [globalModalQueue, setGlobalModalQueue] = useState<Array<OpenGlobalModalProps>>([]);

  const openModal = useCallback((props: OpenGlobalModalProps) => {
    setGlobalModalQueue((currentQue) => [...currentQue, props]);
  }, []);

  const closeModal = useCallback(() => {
    setGlobalModalQueue((currentQue) => currentQue.slice(1));
  }, []);

  const ModalComponent = useMemo(() => () => {
    return match(globalModalQueue)
      .when(q => q.length === 0, () => {
        return <></>;
      })
      .otherwise(() => {
        const { modalProps, childElement } = globalModalQueue[0];
        return (
          <Modal
            {...modalProps}
            className={classnames('sendbird-global-modal', modalProps?.className)}
            onClose={() => {
              modalProps?.onClose?.();
              closeModal();
            }}
          >
            {
              childElement({
                closeModal,
              })
            }
          </Modal>
        );
      });
  }, [globalModalQueue]);

  return (
    <GlobalModalContext.Provider
      value={{
        openModal,
      }}
    >
      <ModalComponent />
      {children}
    </GlobalModalContext.Provider>
  );
};
export const useGlobalModalContext = (): GlobalModalContextInterface => useContext(GlobalModalContext);

export * from './ModalRoot';
