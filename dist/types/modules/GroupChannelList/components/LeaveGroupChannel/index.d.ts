import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
export type LeaveGroupChannelProps = {
    channel?: GroupChannel;
    onSubmit?: () => void;
    onCancel?: () => void;
};
export declare const LeaveGroupChannel: ({ channel, onSubmit, onCancel, }: LeaveGroupChannelProps) => React.JSX.Element;
export default LeaveGroupChannel;
