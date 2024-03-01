import React from 'react';
import type { Member } from '@sendbird/chat/groupChannel';
export interface TypingIndicatorTextProps {
    members: Member[];
}
export declare const TypingIndicatorText: ({ members }: TypingIndicatorTextProps) => React.JSX.Element;
export interface TypingIndicatorProps {
    channelUrl: string;
}
export declare const TypingIndicator: ({ channelUrl }: TypingIndicatorProps) => React.JSX.Element;
export default TypingIndicator;
