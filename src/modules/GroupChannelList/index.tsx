import React from 'react';

import { GroupChannelListProvider, GroupChannelListProviderProps } from './context/GroupChannelListProvider';
import GroupChannelListUI, { GroupChannelListUIProps } from './components/GroupChannelListUI';

export interface GroupChannelListProps extends GroupChannelListProviderProps, GroupChannelListUIProps {}
export const GroupChannelList = (props: GroupChannelListProps) => {
  return (
    <GroupChannelListProvider {...props}>
      <GroupChannelListUI {...props} />
    </GroupChannelListProvider>
  );
};

export default GroupChannelList;
