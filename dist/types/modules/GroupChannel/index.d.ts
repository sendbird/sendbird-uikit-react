import React from 'react';
import { GroupChannelProviderProps } from './context/GroupChannelProvider';
import { GroupChannelUIProps } from './components/GroupChannelUI';
export interface GroupChannelProps extends GroupChannelProviderProps, GroupChannelUIProps {
}
export declare const GroupChannel: (props: GroupChannelProps) => React.JSX.Element;
export default GroupChannel;
