import React, { MutableRefObject } from 'react';
import type { Member } from '@sendbird/chat/groupChannel';
import type { User } from '@sendbird/chat';
type MentionItemUIEvent = {
    event: any;
    member: Member;
    itemRef: MutableRefObject<HTMLElement>;
};
interface SuggestedUserMentionItemProps {
    member: User | Member;
    isFocused?: boolean;
    parentScrollRef?: React.RefObject<HTMLDivElement>;
    onClick?: (props: MentionItemUIEvent) => void;
    onMouseOver?: (props: MentionItemUIEvent) => void;
    onMouseMove?: (props: MentionItemUIEvent) => void;
    renderUserMentionItem?: (props: {
        user: User | Member;
    }) => JSX.Element;
}
declare function SuggestedUserMentionItem(props: SuggestedUserMentionItemProps): JSX.Element;
export default SuggestedUserMentionItem;
