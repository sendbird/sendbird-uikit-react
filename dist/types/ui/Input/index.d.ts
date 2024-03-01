import React, { ReactElement, ReactNode } from 'react';
import './index.scss';
export interface InputLabelProps {
    children: ReactNode;
}
export declare const InputLabel: ({ children }: InputLabelProps) => ReactElement;
export interface InputProps {
    name: string;
    required?: boolean;
    disabled?: boolean;
    value?: string;
    placeHolder?: string;
    autoFocus?: boolean;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export default Input;
