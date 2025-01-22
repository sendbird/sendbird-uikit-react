import React from 'react';
import type { SuggestedMentionListViewProps } from '../../../GroupChannel/components/SuggestedMentionList/SuggestedMentionListView';
import SuggestedMentionListView from '../../../GroupChannel/components/SuggestedMentionList/SuggestedMentionListView';
import { useChannelContext } from '../../context/ChannelProvider';

export type SuggestedMentionListProps = Omit<SuggestedMentionListViewProps, 'currentChannel'>;

/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
export const SuggestedMentionList = (props: SuggestedMentionListProps) => {
  const { currentGroupChannel } = useChannelContext();
  return (
    <SuggestedMentionListView
      {...props}
      currentChannel={currentGroupChannel}
    />
  );
};

export default SuggestedMentionList;
