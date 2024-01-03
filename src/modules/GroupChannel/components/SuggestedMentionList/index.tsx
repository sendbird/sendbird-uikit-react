import React from 'react';
import type { SuggestedMentionListViewProps } from './SuggestedMentionListView';
import SuggestedMentionListView from './SuggestedMentionListView';

export interface SuggestedMentionListProps extends SuggestedMentionListViewProps { }

export const SuggestedMentionList = (props: SuggestedMentionListProps) => {
  return (
    <SuggestedMentionListView {...props}/>
  );
};

export default SuggestedMentionList;
