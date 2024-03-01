import './leave-channel.scss';
import React from 'react';
export type LeaveChannelProps = {
    onSubmit: () => void;
    onCancel: () => void;
};
declare const LeaveChannel: React.FC<LeaveChannelProps>;
export default LeaveChannel;
