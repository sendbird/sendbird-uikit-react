import './index.scss';
import React from 'react';
export interface UnreadCountProps {
    className?: string;
    count: number | undefined;
    onClick(): void;
    lastReadAt?: Date | null;
    /** @deprecated Please use `lastReadAt` instead * */
    time?: string;
}
export declare const UnreadCount: React.FC<UnreadCountProps>;
export default UnreadCount;
