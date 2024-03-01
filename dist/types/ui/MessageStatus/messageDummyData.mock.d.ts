type MockMessage = {
    [key: string]: any;
};
export declare function generateNormalMessage(pretreatment?: (msg: MockMessage) => MockMessage): MockMessage;
export declare function generateLongMessage(pretreatment?: (msg: MockMessage) => MockMessage): MockMessage;
declare const _default: MockMessage;
export default _default;
