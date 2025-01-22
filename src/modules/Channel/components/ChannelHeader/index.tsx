import React from 'react';
import GroupChannelHeaderView from '../../../GroupChannel/components/GroupChannelHeader/GroupChannelHeaderView';
import { useChannelContext } from '../../context/ChannelProvider';

export interface ChannelHeaderProps {
  className?: string;
}

/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
export const ChannelHeader = ({ className }: ChannelHeaderProps) => {
  const context = useChannelContext();
  return (
    <GroupChannelHeaderView
      {...context}
      className={className}
      currentChannel={context.currentGroupChannel}
    />
  );
};

export default ChannelHeader;
