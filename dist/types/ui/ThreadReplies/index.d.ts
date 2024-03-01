import React from 'react';
import { ThreadInfo } from '@sendbird/chat/message';
import './index.scss';
export interface ThreadRepliesProps {
    className?: string;
    threadInfo: ThreadInfo;
    onClick?: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
}
export default function ThreadReplies({ className, threadInfo, onClick, }: ThreadRepliesProps): React.ReactElement;
