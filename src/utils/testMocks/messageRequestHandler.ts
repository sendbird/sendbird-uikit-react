import { FileInfo } from '@sendbird/chat/message';
import { MockErrorType, mockError } from './error';
import { MockMessageType, mockFailedMessage, mockPendingMessage, mockSucceededMessage } from './message';

type OnPendingCallbackType = (pendingMessage: MockMessageType) => void;
type OnFailedCallbackType = (error: MockErrorType, failedMessage: MockMessageType) => void;
type OnSucceededCallbackType = (succeededMessage: MockMessageType) => void;
type OnFileUploadedCallbackType = (requestId: number, index: number, fileInfo: FileInfo, error: MockErrorType) => void;

export type MockMessageRequestHandlerType = {
  onPending: (callback?: OnPendingCallbackType) => MockMessageRequestHandlerType,
  onFailed: (callback?: OnFailedCallbackType) => MockMessageRequestHandlerType,
  onSucceeded: (callback?: OnSucceededCallbackType) => MockMessageRequestHandlerType,
  onFileUploaded: (callback?: OnFileUploadedCallbackType) => MockMessageRequestHandlerType,
};

const getOnPending = (isForSucceeded = true) => jest.fn((callback) => {
  if (isForSucceeded) {
    callback(mockPendingMessage);
  }
  return getMockMessageRequestHandler(isForSucceeded);
});
const getOnFailed = (isForSucceeded = true) => jest.fn((callback) => {
  if (!isForSucceeded) {
    callback(mockError, mockFailedMessage);
  }
  return getMockMessageRequestHandler(isForSucceeded);
});
const getOnSucceeded = (isForSucceeded = true) => jest.fn((callback) => {
  if (isForSucceeded) {
    callback(mockSucceededMessage);
  }
  return getMockMessageRequestHandler(isForSucceeded);
});
const getOnFileUploaded = (isForSucceeded = true) => jest.fn((callback) => {
  if (isForSucceeded) {
    // TODO: Improve this logic
    // - we don't test this event handler now
    callback(0, 0, {}, null);
  }
  return getMockMessageRequestHandler(isForSucceeded);
});

export function getMockMessageRequestHandler(isForSucceeded = true): MockMessageRequestHandlerType {
  return {
    onPending: getOnPending(isForSucceeded),
    onFailed: getOnFailed(isForSucceeded),
    onSucceeded: getOnSucceeded(isForSucceeded),
    onFileUploaded: getOnFileUploaded(isForSucceeded),
  };
}
