/// <reference types="react" />
import { FileMessage } from '@sendbird/chat/message';
import './index.scss';
interface OpenChannelThumbnailMessageProps {
    className?: string | Array<string>;
    message: FileMessage;
    isOperator?: boolean;
    isEphemeral?: boolean;
    disabled: boolean;
    userId: string;
    chainTop: boolean;
    chainBottom: boolean;
    onClick(bool: boolean): void;
    showRemove(bool: boolean): void;
    resendMessage(message: FileMessage): void;
}
export default function OpenchannelThumbnailMessage({ className, message, isOperator, isEphemeral, disabled, userId, chainTop, onClick, showRemove, resendMessage, }: OpenChannelThumbnailMessageProps): JSX.Element;
export {};
