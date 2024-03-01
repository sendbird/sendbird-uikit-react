import './index.scss';
import React from 'react';
import type { User } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
export interface SuggestedMentionListViewProps {
    className?: string;
    currentChannel: GroupChannel;
    targetNickname: string;
    memberListQuery?: Record<string, string>;
    onUserItemClick?: (member: User) => void;
    onFocusItemChange?: (member: User) => void;
    onFetchUsers?: (users: Array<User>) => void;
    renderUserMentionItem?: (props: {
        user: User;
    }) => JSX.Element;
    ableAddMention: boolean;
    maxMentionCount?: number;
    maxSuggestionCount?: number;
    inputEvent?: React.KeyboardEvent<HTMLDivElement>;
}
export declare const SuggestedMentionListView: (props: SuggestedMentionListViewProps) => React.JSX.Element;
export default SuggestedMentionListView;
