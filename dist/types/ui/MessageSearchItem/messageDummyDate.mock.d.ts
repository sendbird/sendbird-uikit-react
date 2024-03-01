type MockUserMessage = Record<string, any>;
export declare function generateNormalMessage(pretreatment?: (message: MockUserMessage) => MockUserMessage): MockUserMessage;
export declare function generateLongMessage(pretreatment?: (message: MockUserMessage) => MockUserMessage): MockUserMessage;
declare const _default: MockUserMessage;
export default _default;
