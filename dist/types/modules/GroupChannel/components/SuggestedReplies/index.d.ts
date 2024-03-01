import './index.scss';
import React from 'react';
interface Props {
    replyOptions: string[];
    onSendMessage: ({ message }: {
        message: string;
    }) => void;
}
export declare const SuggestedReplies: ({ replyOptions, onSendMessage }: Props) => React.JSX.Element;
export default SuggestedReplies;
