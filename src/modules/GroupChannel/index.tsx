import React from 'react';

import type { GroupChannelContextProps } from './context/GroupChannelProvider';
import { GroupChannelProvider } from './context/GroupChannelProvider';
import GroupChannelUI, { GroupChannelUIProps } from './components/GroupGroupChannelUI';

export interface GroupChannelProps extends GroupChannelContextProps, GroupChannelUIProps { }

export const GroupChannel = (props: GroupChannelProps) => {
  return (
    <GroupChannelProvider {...props}>
      <GroupChannelUI {...props}/>
    </GroupChannelProvider>
  );
};

export default GroupChannel;
