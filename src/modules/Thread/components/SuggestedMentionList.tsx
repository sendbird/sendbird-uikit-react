import React from 'react';
import type { SuggestedMentionListViewProps } from '../../GroupChannel/components/SuggestedMentionList/SuggestedMentionListView';
import SuggestedMentionListView from '../../GroupChannel/components/SuggestedMentionList/SuggestedMentionListView';
import { useThreadContext } from '../context/ThreadProvider';

export type SuggestedMentionListProps = Omit<SuggestedMentionListViewProps, 'currentChannel'>;

export const SuggestedMentionList = (props: SuggestedMentionListProps) => {
  const { currentChannel } = useThreadContext();
  return (
    <SuggestedMentionListView
      {...props}
      currentChannel={currentChannel}
    />
  );
};

export default SuggestedMentionList;
