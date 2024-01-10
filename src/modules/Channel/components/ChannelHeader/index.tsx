import React from 'react';
import GroupChannelHeaderView from '../../../GroupChannel/components/GroupChannelHeader/GroupChannelHeaderView';
import { useChannelContext } from '../../context/ChannelProvider';

export interface ChannelHeaderProps {
  className?: string;
}

export const ChannelHeader = ({ className }: ChannelHeaderProps) => {
  const context = useChannelContext();
  return (
    <GroupChannelHeaderView
      {...context}
      className={className}
      currentChannel={context.currentGroupChannel}
    />
  );
};

export default ChannelHeader;
