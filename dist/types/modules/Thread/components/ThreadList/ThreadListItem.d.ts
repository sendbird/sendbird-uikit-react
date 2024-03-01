import React from 'react';
import { SendableMessageType } from '../../../../utils';
export interface ThreadListItemProps {
    className?: string;
    message: SendableMessageType;
    chainTop?: boolean;
    chainBottom?: boolean;
    hasSeparator?: boolean;
    renderCustomSeparator?: (props: {
        message: SendableMessageType;
    }) => React.ReactElement;
    handleScroll?: () => void;
}
export default function ThreadListItem({ className, message, chainTop, chainBottom, hasSeparator, renderCustomSeparator, handleScroll, }: ThreadListItemProps): React.ReactElement;
