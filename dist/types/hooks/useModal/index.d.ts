import React, { ReactElement } from 'react';
import { type ModalProps } from '../../ui/Modal';
export type OpenGlobalModalProps = {
    modalProps: ModalProps;
    childElement: (props: {
        closeModal: () => void;
    }) => ReactElement;
};
export type GlobalModalProviderProps = React.PropsWithChildren<unknown>;
export interface GlobalModalContextInterface {
    openModal: (props: OpenGlobalModalProps) => void;
}
export declare const GlobalModalProvider: ({ children }: GlobalModalProviderProps) => React.JSX.Element;
export declare const useGlobalModalContext: () => GlobalModalContextInterface;
export * from './ModalRoot';
