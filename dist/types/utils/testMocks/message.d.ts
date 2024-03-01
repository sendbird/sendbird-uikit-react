export declare enum MockMessageStateType {
    PENDING = "PENDING",
    FAILED = "FAILED",
    SUCCEEDED = "SUCCEEDED",
    SENT = "SENT"
}
export interface MockMessageType {
    messageId: 0;
    mockMessageType: MockMessageStateType;
}
export declare const mockPendingMessage: {
    mockMessageType: MockMessageStateType;
};
export declare const mockFailedMessage: {
    mockMessageType: MockMessageStateType;
};
export declare const mockSucceededMessage: {
    mockMessageType: MockMessageStateType;
};
export declare const mockSentMessage: {
    messageId: number;
    mockMessageType: MockMessageStateType;
};
