import React from 'react';

import {
  ChannelProvider,
  ChannelContextProps,
} from './context/ChannelProvider';

import ChannelUI, { ChannelUIProps } from './components/ChannelUI';

export interface ChannelProps extends ChannelContextProps, ChannelUIProps { }

const Channel = (props: ChannelProps) => {
  return (
    <ChannelProvider {...props}>
      <ChannelUI {...props}/>
    </ChannelProvider>
  );
};

export default Channel;
