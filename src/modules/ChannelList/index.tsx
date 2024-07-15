import React from 'react';
import {
  ChannelListProvider,
  ChannelListProviderProps,
} from './context/ChannelListProvider';

import ChannelListUI, { ChannelListUIProps } from './components/ChannelListUI';

export interface ChannelListProps extends ChannelListProviderProps, ChannelListUIProps {}

/**
 * @deprecated This component is deprecated and will be removed in future releases.
 * Please use the `GroupChannelList` component from '@sendbird/uikit-react/GroupChannelList' instead.
 *
 * Example usage:
 *
 * import { GroupChannelList } from '@sendbird/uikit-react/GroupChannelList';
 *
 * <GroupChannelList
 *   // pass required props here
 * />
 *
 * The `GroupChannelList` component provides enhanced functionality and improved performance.
 */
const ChannelList: React.FC<ChannelListProps> = (props: ChannelListProps) => {
  return (
    <ChannelListProvider {...props}>
      <ChannelListUI {...props}/>
    </ChannelListProvider>
  );
};

export default ChannelList;
