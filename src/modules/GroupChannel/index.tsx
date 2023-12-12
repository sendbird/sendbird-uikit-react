import React from 'react';

import type { GroupChannelContextProps } from './context/GroupChannelProvider';
import { GroupChannelProvider } from './context/GroupChannelProvider';
import ChannelUI, { ChannelUIProps } from './components/ChannelUI';

export interface GroupChannelProps extends GroupChannelContextProps, ChannelUIProps { }

export const GroupChannel = (props: GroupChannelProps) => {
  return (
    <GroupChannelProvider {...props}>
      <ChannelUI {...props}/>
    </GroupChannelProvider>
  );
};

export default GroupChannel;
