import React from 'react';
import { ChannelContextProps } from './context/ChannelProvider';
import { ChannelUIProps } from './components/ChannelUI';
export interface ChannelProps extends ChannelContextProps, ChannelUIProps {
}
declare const Channel: (props: ChannelProps) => React.JSX.Element;
export default Channel;
