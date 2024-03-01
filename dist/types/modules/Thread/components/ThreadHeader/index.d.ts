import React from 'react';
import './index.scss';
type EventType = React.MouseEvent<HTMLDivElement | HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>;
export interface ThreadHeaderProps {
    className?: string;
    channelName: string;
    renderActionIcon?: (props: {
        onActionIconClick: (e: EventType) => void;
    }) => React.ReactElement;
    onActionIconClick?: (e: EventType) => void;
    onChannelNameClick?: (e: EventType) => void;
}
export default function ThreadHeader({ className, channelName, renderActionIcon, onActionIconClick, onChannelNameClick, }: ThreadHeaderProps): React.ReactElement;
export {};
