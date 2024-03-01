import React from 'react';
import { OpenChannelUIProps } from './components/OpenChannelUI';
import { OpenChannelProviderProps } from './context/OpenChannelProvider';
export interface OpenChannelProps extends OpenChannelProviderProps, OpenChannelUIProps {
}
declare const OpenChannel: React.FC<OpenChannelProps>;
export default OpenChannel;
