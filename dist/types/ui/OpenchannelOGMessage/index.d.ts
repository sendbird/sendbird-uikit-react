/// <reference types="react" />
import { UserMessage } from '@sendbird/chat/message';
import './index.scss';
interface OpenChannelOGMessageProps {
    message: UserMessage;
    isOperator?: boolean;
    isEphemeral?: boolean;
    className?: string | Array<string>;
    disabled?: boolean;
    showEdit(bool: boolean): void;
    showRemove(bool: boolean): void;
    resendMessage(message: UserMessage): void;
    chainTop?: boolean;
    chainBottom?: boolean;
    userId: string;
}
export default function OpenchannelOGMessage({ message, isOperator, isEphemeral, className, disabled, showEdit, showRemove, resendMessage, chainTop, userId, }: OpenChannelOGMessageProps): JSX.Element;
export {};
