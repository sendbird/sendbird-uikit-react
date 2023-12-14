import React from 'react';

import { GroupChannelHeaderView } from './GroupChannelHeaderView';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';

export interface GroupChannelHeaderProps {
  className?: string;
}

export const GroupChannelHeader: React.FC<GroupChannelHeaderProps> = ({
  className = '',
}) => {
  const channelStore = useGroupChannelContext();

  return (
    <GroupChannelHeaderView
      {...channelStore}
      className={className}
    />
  );
};

export default GroupChannelHeader;
