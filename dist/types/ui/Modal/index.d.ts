import { ReactElement, ReactNode } from 'react';
import './index.scss';
import { ButtonTypes } from '../Button';
export interface ModalHeaderProps {
    titleText: string;
}
export declare const ModalHeader: ({ titleText }: ModalHeaderProps) => ReactElement;
export interface ModalBodyProps {
    children?: ReactNode;
}
export declare const ModalBody: ({ children }: ModalBodyProps) => ReactElement;
export interface ModalFooterProps {
    submitText: string;
    disabled?: boolean;
    type?: ButtonTypes;
    onCancel: () => void;
    onSubmit: () => void;
    hideCancelButton?: boolean;
}
export declare const ModalFooter: ({ submitText, disabled, hideCancelButton, type, onSubmit, onCancel, }: ModalFooterProps) => ReactElement;
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
    /**
     * Do not use this! We will deprecate onCancel in v4.
     */
    onCancel?: () => void;
    onClose?: () => void;
    onSubmit?: (...args: any[]) => void;
    renderHeader?: () => ReactElement;
    customFooter?: ReactNode;
}
export declare function Modal(props: ModalProps): ReactElement;
export default Modal;
