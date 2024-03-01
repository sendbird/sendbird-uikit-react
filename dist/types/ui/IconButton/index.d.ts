import React, { FocusEvent, MouseEvent, ReactNode } from 'react';
import './index.scss';
export interface IconButtonProps {
    className?: string | Array<string>;
    children: ReactNode;
    disabled?: boolean;
    width?: string;
    height?: string;
    type?: 'button' | 'submit' | 'reset';
    style?: {
        [key: string]: string;
    };
    onBlur?: (e: FocusEvent<HTMLButtonElement>) => void;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}
declare const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;
export default IconButton;
