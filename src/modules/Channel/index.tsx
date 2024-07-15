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
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
const Channel = (props: ChannelProps) => {
  return (
    <ChannelProvider {...props}>
      <ChannelUI {...props}/>
    </ChannelProvider>
  );
};

export default Channel;
