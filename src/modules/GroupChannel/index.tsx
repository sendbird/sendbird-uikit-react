import React from 'react';

import { GroupChannelProvider } from './context/GroupChannelProvider';
import { type GroupChannelProviderProps } from './context/types';
import GroupChannelUI, { GroupChannelUIProps } from './components/GroupChannelUI';

export interface GroupChannelProps extends GroupChannelProviderProps, GroupChannelUIProps { }
export const GroupChannel = (props: GroupChannelProps) => {
  return (
    <GroupChannelProvider {...props} >
      <GroupChannelUI {...props} />
    </GroupChannelProvider>
  );
};

export default GroupChannel;
