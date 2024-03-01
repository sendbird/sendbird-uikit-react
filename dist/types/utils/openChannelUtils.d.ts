import type { User } from '@sendbird/chat';
import type { UserMessage } from '@sendbird/chat/message';
import { SendableMessageType } from './index';
export declare const getSenderFromMessage: (message: SendableMessageType) => User;
export declare const checkIsSent: (status: string) => boolean;
export declare const checkIsPending: (status: string) => boolean;
export declare const checkIsFailed: (status: string) => boolean;
export declare const checkIsByMe: (message: SendableMessageType, userId: string) => boolean;
interface isFineCopyParams {
    message: UserMessage;
    status: string;
    userId: string;
}
export declare const isFineCopy: ({ message }: isFineCopyParams) => boolean;
interface isFineResendParams {
    message: SendableMessageType;
    status: string;
    userId: string;
}
export declare const isFineResend: ({ message, status, userId }: isFineResendParams) => boolean;
interface isFineEditParams {
    message: SendableMessageType;
    status: string;
    userId: string;
}
export declare const isFineEdit: ({ message, status, userId }: isFineEditParams) => boolean;
interface isFineDeleteParams {
    message: SendableMessageType;
    status: string;
    userId: string;
}
export declare const isFineDelete: ({ message, userId }: isFineDeleteParams) => boolean;
interface IsFineDownloadParams {
    message: SendableMessageType;
    status: string;
}
export declare const isFineDownload: ({ message, status }: IsFineDownloadParams) => boolean;
interface showMenuTriggerParams {
    message: SendableMessageType;
    status: string;
    userId: string;
}
export declare const showMenuTrigger: (props: showMenuTriggerParams) => boolean;
export {};
