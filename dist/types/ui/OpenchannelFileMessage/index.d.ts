/// <reference types="react" />
import { FileMessage } from '@sendbird/chat/message';
import './index.scss';
interface OpenChannelFileMessageProps {
    className?: string | Array<string>;
    message: FileMessage;
    isOperator?: boolean;
    isEphemeral?: boolean;
    userId: string;
    disabled?: boolean;
    chainTop?: boolean;
    chainBottom?: boolean;
    showRemove(bool: boolean): void;
    resendMessage(message: FileMessage): void;
}
export default function OpenchannelFileMessage({ className, message, isOperator, isEphemeral, userId, disabled, chainTop, showRemove, resendMessage, }: OpenChannelFileMessageProps): JSX.Element;
export {};
