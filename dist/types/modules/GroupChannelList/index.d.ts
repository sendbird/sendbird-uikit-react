import React from 'react';
import { GroupChannelListProviderProps } from './context/GroupChannelListProvider';
import { GroupChannelListUIProps } from './components/GroupChannelListUI';
export interface GroupChannelListProps extends GroupChannelListProviderProps, GroupChannelListUIProps {
}
export declare const GroupChannelList: (props: GroupChannelListProps) => React.JSX.Element;
export default GroupChannelList;
