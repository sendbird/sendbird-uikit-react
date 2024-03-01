/**
 * @description This hook is designed to prevent scroll flickering caused by duplicate calls of onEndReached and onTopReached.
 * It controls the loading of messages to ensure a single request for message retrieval.
 * */
export declare const usePreventDuplicateRequest: () => {
    lock(): void;
    run(callback: any): Promise<void>;
    release(): void;
};
