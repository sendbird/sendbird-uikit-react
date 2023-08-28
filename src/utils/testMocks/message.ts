export enum MockMessageStateType {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCEEDED = 'SUCCEEDED',
  SENT = 'SENT',
}
export interface MockMessageType {
  messageId: 0,
  mockMessageType: MockMessageStateType;
}

// TODO: Improve the property details of these mock messages
export const mockPendingMessage = { mockMessageType: MockMessageStateType.PENDING };
export const mockFailedMessage = { mockMessageType: MockMessageStateType.FAILED };
export const mockSucceededMessage = { mockMessageType: MockMessageStateType.SUCCEEDED };
export const mockSentMessage = {
  messageId: 0,
  mockMessageType: MockMessageStateType.SENT,
};
