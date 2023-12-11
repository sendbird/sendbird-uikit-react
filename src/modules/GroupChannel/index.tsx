import React from 'react';

import type { GroupChannelContextProps } from './types';
import ChannelUI, { ChannelUIProps } from './components/ChannelUI';
import { GroupChannelProvider } from './context/GroupChannelProvider';

export interface GroupChannelProps extends GroupChannelContextProps, ChannelUIProps { }

export const GroupChannel = (props: GroupChannelProps) => {
  return (
    <GroupChannelProvider {...props}>
      <ChannelUI {...props}/>
    </GroupChannelProvider>
  );
};

export default GroupChannel;
