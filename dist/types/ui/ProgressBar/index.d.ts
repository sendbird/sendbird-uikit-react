import React from 'react';
import './index.scss';
export declare const ProgressBarColorTypes: {
    readonly PRIMARY: "progress-bar-color--primary";
    readonly GRAY: "progress-bar-color--gray";
};
export type ProgressBarColorTypes = typeof ProgressBarColorTypes[keyof typeof ProgressBarColorTypes];
export interface ProgressBarProps {
    className?: string;
    disabled?: boolean;
    maxSize: number;
    currentSize: number;
    colorType?: ProgressBarColorTypes;
}
export declare const ProgressBar: ({ className, disabled, maxSize, currentSize, colorType, }: ProgressBarProps) => React.ReactElement;
export default ProgressBar;
