import React from 'react';
import {
  GroupChannelListProvider,
  GroupChannelListProviderProps,
} from './context/GroupChannelListProvider';

import ChannelListUI, { ChannelListUIProps } from './components/ChannelListUI';

interface GroupChannelListProps extends GroupChannelListProviderProps, ChannelListUIProps {}

export const GroupChannelList: React.FC<GroupChannelListProps> = (props: GroupChannelListProps) => {
  return (
    <GroupChannelListProvider {...props} >
      <ChannelListUI {...props} />
    </GroupChannelListProvider>
  );
};

export default GroupChannelList;
