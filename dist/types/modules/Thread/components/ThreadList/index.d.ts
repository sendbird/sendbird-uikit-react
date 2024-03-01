import React, { RefObject } from 'react';
import './index.scss';
import type { SendableMessageType } from '../../../../utils';
export interface ThreadListProps {
    className?: string;
    renderMessage?: (props: {
        message: SendableMessageType;
        chainTop: boolean;
        chainBottom: boolean;
        hasSeparator: boolean;
    }) => React.ReactElement;
    renderCustomSeparator?: (props: {
        message: SendableMessageType;
    }) => React.ReactElement;
    scrollRef?: RefObject<HTMLDivElement>;
    scrollBottom?: number;
}
export default function ThreadList({ className, renderMessage, renderCustomSeparator, scrollRef, scrollBottom, }: ThreadListProps): React.ReactElement;
