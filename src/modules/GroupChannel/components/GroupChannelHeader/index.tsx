import React from 'react';
import GroupChannelHeaderView from './GroupChannelHeaderView';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';

export interface GroupChannelHeaderProps {
  className?: string;
}

export const GroupChannelHeader = ({ className }: GroupChannelHeaderProps) => {
  const context = useGroupChannelContext();

  return (
    <GroupChannelHeaderView
      {...context}
      className={className}
      currentChannel={context.currentChannel}
    />
  );
};

export default GroupChannelHeader;
