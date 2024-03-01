import React from 'react';
import { ToggleContextInterface } from './ToggleContext';
export interface ToggleContainerProps extends ToggleContextInterface {
    children?: React.ReactElement;
}
export declare function ToggleContainer({ checked, // null
defaultChecked, disabled, onChange, onFocus, onBlur, children, }: ToggleContainerProps): React.ReactElement;
