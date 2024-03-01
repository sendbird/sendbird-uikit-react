import React from 'react';
import { ChannelListProviderProps } from './context/ChannelListProvider';
import { ChannelListUIProps } from './components/ChannelListUI';
interface ChannelListProps extends ChannelListProviderProps, ChannelListUIProps {
}
declare const ChannelList: React.FC<ChannelListProps>;
export default ChannelList;
