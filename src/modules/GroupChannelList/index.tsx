import React from 'react';
import {
  GroupChannelListProvider,
  GroupChannelListProviderProps,
} from './context/GroupChannelListProvider';

import ChannelListUI, { GroupChannelListUIProps } from './components/GroupChannelListUI';

interface GroupChannelListProps extends GroupChannelListProviderProps, GroupChannelListUIProps {}

export const GroupChannelList: React.FC<GroupChannelListProps> = (props: GroupChannelListProps) => {
  return (
    <GroupChannelListProvider {...props} >
      <ChannelListUI {...props} />
    </GroupChannelListProvider>
  );
};

export default GroupChannelList;
