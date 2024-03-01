import React, { KeyboardEvent, MouseEvent, TouchEvent } from 'react';
export interface AddReactionBadgeItemProps {
    onClick: (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => void;
}
export declare const AddReactionBadgeItem: ({ onClick, }: AddReactionBadgeItemProps) => React.ReactElement;
