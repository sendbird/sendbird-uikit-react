import React from 'react';
import type { SuggestedMentionListViewProps } from '../../../GroupChannel/components/SuggestedMentionList/SuggestedMentionListView';
import SuggestedMentionListView from '../../../GroupChannel/components/SuggestedMentionList/SuggestedMentionListView';
import { useChannelContext } from '../../context/ChannelProvider';

export type SuggestedMentionListProps = Omit<SuggestedMentionListViewProps, 'currentChannel'>;

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
