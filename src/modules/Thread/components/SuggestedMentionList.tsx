import React from 'react';
import type { SuggestedMentionListViewProps } from '../../GroupChannel/components/SuggestedMentionList/SuggestedMentionListView';
import SuggestedMentionListView from '../../GroupChannel/components/SuggestedMentionList/SuggestedMentionListView';
import useThread from '../context/useThread';

export type SuggestedMentionListProps = Omit<SuggestedMentionListViewProps, 'currentChannel'>;

export const SuggestedMentionList = (props: SuggestedMentionListProps) => {
  const {
    state: {
      currentChannel,
    },
  } = useThread();
  return (
    <SuggestedMentionListView
      {...props}
      currentChannel={currentChannel}
    />
  );
};

export default SuggestedMentionList;
