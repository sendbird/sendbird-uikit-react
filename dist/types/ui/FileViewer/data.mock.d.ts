import { FileInfo } from './types';
import { UploadedFileInfo } from '@sendbird/chat/message';
export declare const FILE_INFO_LIST: FileInfo[];
export declare const msg0: {
    messageId: number;
    messageType: string;
    channelUrl: string;
    data: string;
    customType: string;
    createdAt: number;
    updatedAt: number;
    channelType: string;
    mentionType: string;
    url: string;
    name: string;
    size: number;
    type: string;
    sender: {
        nickname: string;
        profileUrl: string;
        userId: string;
        connectionStatus: string;
        lastSeenAt: number;
    };
    reqId: string;
    requireAuth: boolean;
    requestState: string;
    errorCode: number;
    isFileMessage: () => boolean;
    isMultipleFilesMessage: () => boolean;
};
export declare const msg1: {
    messageId: number;
    messageType: string;
    channelUrl: string;
    data: string;
    customType: string;
    createdAt: number;
    updatedAt: number;
    channelType: string;
    mentionType: string;
    url: string;
    name: string;
    size: number;
    type: string;
    sender: {
        nickname: string;
        profileUrl: string;
        userId: string;
        connectionStatus: string;
        lastSeenAt: number;
    };
    reqId: string;
    requireAuth: boolean;
    requestState: string;
    errorCode: number;
    isFileMessage: () => boolean;
    isMultipleFilesMessage: () => boolean;
};
export declare const msg2: {
    messageId: number;
    messageType: string;
    channelUrl: string;
    data: string;
    customType: string;
    createdAt: number;
    updatedAt: number;
    channelType: string;
    mentionType: string;
    fileInfoList: UploadedFileInfo[];
    sender: {
        nickname: string;
        profileUrl: string;
        userId: string;
        connectionStatus: string;
        lastSeenAt: number;
    };
    reqId: string;
    requireAuth: boolean;
    requestState: string;
    errorCode: number;
    isFileMessage: () => boolean;
    isMultipleFilesMessage: () => boolean;
};