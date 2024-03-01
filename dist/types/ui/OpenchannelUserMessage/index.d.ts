import { ReactElement } from 'react';
import { UserMessage } from '@sendbird/chat/message';
import './index.scss';
interface OpenChannelUserMessageProps {
    className?: string | Array<string>;
    message: UserMessage;
    isOperator?: boolean;
    isEphemeral?: boolean;
    userId: string;
    disabled?: boolean;
    showEdit(bool: boolean): void;
    showRemove(bool: boolean): void;
    resendMessage(message: UserMessage): void;
    chainTop?: boolean;
    chainBottom?: boolean;
}
export default function OpenchannelUserMessage({ className, message, isOperator, isEphemeral, userId, resendMessage, disabled, showEdit, showRemove, chainTop, }: OpenChannelUserMessageProps): ReactElement;
export {};
