import React, { ChangeEventHandler } from 'react';
export declare const TOGGLE_DEFAULT_VALUE: {
    checked: any;
    defaultChecked: boolean;
    disabled: boolean;
    onChange: () => void;
    onFocus: () => void;
    onBlur: () => void;
};
export interface ToggleContextInterface {
    checked?: boolean | null;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onFocus?: ChangeEventHandler<HTMLInputElement>;
    onBlur?: ChangeEventHandler<HTMLInputElement>;
}
export declare const ToggleContext: React.Context<ToggleContextInterface>;
export declare function useToggleContext(): ToggleContextInterface;
