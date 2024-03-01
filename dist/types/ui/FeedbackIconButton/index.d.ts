import React, { MouseEvent, ReactNode } from 'react';
import './index.scss';
export interface FeedbackIconButtonProps {
    children: ReactNode;
    isSelected: boolean;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
}
declare const FeedbackIconButton: React.ForwardRefExoticComponent<FeedbackIconButtonProps & React.RefAttributes<HTMLButtonElement>>;
export default FeedbackIconButton;
