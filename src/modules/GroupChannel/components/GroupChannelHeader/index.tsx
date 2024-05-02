import React from 'react';

import type { HeaderCustomProps } from '../../../../ui/Header';
import GroupChannelHeaderView from './GroupChannelHeaderView';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';

export interface GroupChannelHeaderProps extends HeaderCustomProps {
  className?: string;
}

export const GroupChannelHeader = (props: GroupChannelHeaderProps) => {
  const context = useGroupChannelContext();

  return (
    <GroupChannelHeaderView
      {...props}
      {...context}
      currentChannel={context.currentChannel}
    />
  );
};

export default GroupChannelHeader;
