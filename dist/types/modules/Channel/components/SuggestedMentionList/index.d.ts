import React from 'react';
import type { SuggestedMentionListViewProps } from '../../../GroupChannel/components/SuggestedMentionList/SuggestedMentionListView';
export type SuggestedMentionListProps = Omit<SuggestedMentionListViewProps, 'currentChannel'>;
export declare const SuggestedMentionList: (props: SuggestedMentionListProps) => React.JSX.Element;
export default SuggestedMentionList;
