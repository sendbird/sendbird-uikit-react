import React from 'react';
import { Member } from '@sendbird/chat/groupChannel';
export interface TypingIndicatorBubbleProps {
    typingMembers: Member[];
    handleScroll?: (isBottomMessageAffected?: boolean) => void;
}
export interface AvatarStackProps {
    sources: string[];
    max: number;
}
declare const TypingIndicatorBubble: (props: TypingIndicatorBubbleProps) => React.JSX.Element;
export default TypingIndicatorBubble;
