import React from 'react';
import {
  ChannelProvider,
  ChannelContextProps,
} from './context/ChannelProvider';
import ChannelUI, { ChannelUIProps } from './components/ChannelUI';

export interface ChannelProps extends ChannelContextProps, ChannelUIProps {}

/**
 * @deprecated This component is deprecated and will be removed in future releases.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * 
 * Example usage:
 * 
 * import { GroupChannel } from '@sendbird/uikit-react/GroupChannel';
 * 
 * <GroupChannel
 *   // pass required props here
 * />
 * 
 * The `GroupChannel` component provides enhanced functionality and improved performance.
 */
const Channel = (props: ChannelProps) => {
  return (
    <ChannelProvider {...props}>
      <ChannelUI {...props}/>
    </ChannelProvider>
  );
};

export default Channel;
