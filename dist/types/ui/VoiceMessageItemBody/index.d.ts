import React from 'react';
import { FileMessage } from '@sendbird/chat/message';
import './index.scss';
export interface VoiceMessageItemBodyProps {
    className?: string;
    message: FileMessage;
    channelUrl: string;
    isByMe?: boolean;
    isReactionEnabled?: boolean;
}
export declare const VoiceMessageItemBody: ({ className, message, channelUrl, isByMe, isReactionEnabled, }: VoiceMessageItemBodyProps) => React.ReactElement;
export default VoiceMessageItemBody;
