import React from 'react';
import {
  ChannelListProvider,
  ChannelListProviderProps,
} from './context/ChannelListProvider';

import ChannelListUI, { ChannelListUIProps } from './components/ChannelListUI';

export interface ChannelListProps extends ChannelListProviderProps, ChannelListUIProps {}

/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannelList` component from '@sendbird/uikit-react/GroupChannelList' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
const ChannelList: React.FC<ChannelListProps> = (props: ChannelListProps) => {
  return (
    <ChannelListProvider {...props}>
      <ChannelListUI {...props}/>
    </ChannelListProvider>
  );
};

export default ChannelList;
