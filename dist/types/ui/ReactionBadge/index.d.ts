import React, { KeyboardEvent, MouseEvent, ReactElement, TouchEvent } from 'react';
import './index.scss';
export interface ReactionBadgeProps {
    className?: string | Array<string>;
    children: ReactElement;
    count?: number | string;
    isAdd?: boolean;
    selected?: boolean;
    onClick?: (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => void;
}
declare const ReactionBadge: React.ForwardRefExoticComponent<ReactionBadgeProps & React.RefAttributes<HTMLDivElement>>;
export default ReactionBadge;
