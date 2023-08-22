import { MockErrorType, mockError } from './error';
import { MockMessageType, mockFailedMessage, mockPendingMessage, mockSucceededMessage } from './message';

type OnPendingCallbackType = (pendingMessage: MockMessageType) => void;
type OnFailedCallbackType = (error: MockErrorType, failedMessage: MockMessageType) => void;
type OnSucceededCallbackType = (succeededMessage: MockMessageType) => void;

export type MockMessageRequestHandlerType = {
  onPending: (callback?: OnPendingCallbackType) => MockMessageRequestHandlerType,
  onFailed: (callback?: OnFailedCallbackType) => MockMessageRequestHandlerType,
  onSucceeded: (callback?: OnSucceededCallbackType) => MockMessageRequestHandlerType,
};

const getOnPending = (isSucceeded = true) => jest.fn((callback) => {
  if (isSucceeded) {
    callback(mockPendingMessage);
  }
  return getMockMessageRequestHandler(isSucceeded);
});
const getOnFailed = (isSucceeded = true) => jest.fn((callback) => {
  if (!isSucceeded) {
    callback(mockError, mockFailedMessage);
  }
  return getMockMessageRequestHandler(isSucceeded);
});
const getOnSucceeded = (isSucceeded = true) => jest.fn((callback) => {
  if (isSucceeded) {
    callback(mockSucceededMessage);
  }
  return getMockMessageRequestHandler(isSucceeded);
});

export function getMockMessageRequestHandler(isSucceeded = true): MockMessageRequestHandlerType {
  return {
    onPending: getOnPending(isSucceeded),
    onFailed: getOnFailed(isSucceeded),
    onSucceeded: getOnSucceeded(isSucceeded),
  };
}
