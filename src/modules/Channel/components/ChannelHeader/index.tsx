import React from 'react';

import { useChannelContext } from '../../context/ChannelProvider';
import { GroupChannelHeaderView } from '../../../GroupChannel/components/GroupChannelHeader/GroupChannelHeaderView';

interface ChannelHeaderProps {
  className?: string;
}

const ChannelHeader: React.FC<ChannelHeaderProps> = ({
  className = '',
}) => {
  const channelStore = useChannelContext();
  return (
    <GroupChannelHeaderView
      {...channelStore}
      className={className}
      currentChannel={channelStore.currentGroupChannel}
    />
  );
};

export default ChannelHeader;
