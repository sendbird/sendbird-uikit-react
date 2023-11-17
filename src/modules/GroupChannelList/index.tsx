import React from 'react';
import {
  ChannelListProvider,
  ChannelListProviderProps,
} from './context/ChannelListProvider';

import ChannelListUI, { ChannelListUIProps } from './components/ChannelListUI';

interface ChannelListProps extends ChannelListProviderProps, ChannelListUIProps {}

const ChannelList: React.FC<ChannelListProps> = (props: ChannelListProps) => {
  return (
    <ChannelListProvider {...props} >
      <ChannelListUI {...props} />
    </ChannelListProvider>
  );
};

export default ChannelList;
