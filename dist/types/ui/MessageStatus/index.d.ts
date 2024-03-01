import './index.scss';
import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CoreMessageType } from '../../utils';
import { OutgoingMessageStates } from '../../utils/exports/getOutgoingMessageState';
import { Nullable } from '../../types';
export declare const MessageStatusTypes: typeof OutgoingMessageStates;
interface MessageStatusProps {
    className?: string;
    message?: CoreMessageType | null;
    channel: Nullable<GroupChannel>;
    isDateSeparatorConsidered?: boolean;
}
export default function MessageStatus({ className, message, channel, isDateSeparatorConsidered, }: MessageStatusProps): React.ReactElement;
export {};
