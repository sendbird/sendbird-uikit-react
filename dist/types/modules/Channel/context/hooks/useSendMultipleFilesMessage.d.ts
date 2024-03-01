/// <reference types="react" />
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { MultipleFilesMessageCreateParams, UploadableFileInfo } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import type { Logger } from '../../../../lib/SendbirdState';
import type { Nullable } from '../../../../types';
import { SendableMessageType } from '../../../../utils';
import { PublishingModuleType } from '../../../internalInterfaces';
export type OnBeforeSendMFMType = (files: Array<File>, quoteMessage?: SendableMessageType) => MultipleFilesMessageCreateParams;
export interface UseSendMFMDynamicParams {
    currentChannel: Nullable<GroupChannel>;
    onBeforeSendMultipleFilesMessage?: OnBeforeSendMFMType;
    publishingModules: PublishingModuleType[];
}
export interface UseSendMFMStaticParams {
    logger: Logger;
    pubSub: any;
    scrollRef?: React.RefObject<HTMLDivElement>;
}
export interface FileUploadedPayload {
    channelUrl: string;
    requestId: string;
    index: number;
    uploadableFileInfo: UploadableFileInfo;
    error: Error;
}
export type SendMFMFunctionType = (files: Array<File>, quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>;
/**
 * pubSub is used instead of messagesDispatcher to avoid redundantly calling
 * because this useSendMultipleFilesMessage is used in the Channel and Thread both
 */
export declare const useSendMultipleFilesMessage: ({ currentChannel, onBeforeSendMultipleFilesMessage, publishingModules, }: UseSendMFMDynamicParams, { logger, pubSub, scrollRef, }: UseSendMFMStaticParams) => Array<SendMFMFunctionType>;
