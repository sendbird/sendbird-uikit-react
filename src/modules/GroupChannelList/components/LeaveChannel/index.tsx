import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LeaveChannelView } from './LeaveChannelView';

export type LeaveChannelProps = {
  channel?: GroupChannel;
  onSubmit?: () => void;
  onCancel?: () => void;
};

export const LeaveChannel: React.FC<LeaveChannelProps> = (
  props: LeaveChannelProps,
) => {
  const { channel = null } = props;
  if (channel) {
    return <LeaveChannelView {...props} channel={channel} />;
  }
};

export default LeaveChannel;
export { LeaveChannelView, LeaveChannelViewProps } from './LeaveChannelView';
