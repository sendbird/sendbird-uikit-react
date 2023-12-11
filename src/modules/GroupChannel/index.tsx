import React from 'react';

import {
  ChannelProvider,
  ChannelContextProps,
} from './context/ChannelProvider';

import ChannelUI, { ChannelUIProps } from './components/ChannelUI';

export interface GroupChannelProps extends ChannelContextProps, ChannelUIProps { }

export const GroupChannel = (props: GroupChannelProps) => {
  return (
    <ChannelProvider {...props}>
      <ChannelUI {...props}/>
    </ChannelProvider>
  );
};

export default GroupChannel;
