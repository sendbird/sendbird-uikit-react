import { FileInfo } from '@sendbird/chat/message';
import { MockErrorType } from './error';
import { MockMessageType } from './message';
type OnPendingCallbackType = (pendingMessage: MockMessageType) => void;
type OnFailedCallbackType = (error: MockErrorType, failedMessage: MockMessageType) => void;
type OnSucceededCallbackType = (succeededMessage: MockMessageType) => void;
type OnFileUploadedCallbackType = (requestId: number, index: number, fileInfo: FileInfo, error: MockErrorType) => void;
export type MockMessageRequestHandlerType = {
    onPending: (callback?: OnPendingCallbackType) => MockMessageRequestHandlerType;
    onFailed: (callback?: OnFailedCallbackType) => MockMessageRequestHandlerType;
    onSucceeded: (callback?: OnSucceededCallbackType) => MockMessageRequestHandlerType;
    onFileUploaded: (callback?: OnFileUploadedCallbackType) => MockMessageRequestHandlerType;
};
export declare function getMockMessageRequestHandler(isForSucceeded?: boolean): MockMessageRequestHandlerType;
export {};
